import { useState, useRef } from "react";
import { Link, useLoaderData } from "react-router-dom";
import clsx from "clsx";

import Header from "../../components/Header";
import type { Product } from "../../models/Product";
import { calculateLevenshteinDistance } from "../../utils/stringUtils";

import styles from "./shop.module.css";
import IconX from "../../components/icons/IconX";
import IconMagnifyingGlass from "../../components/icons/IconMagnifyingGlass";

type SearchBarProps = {
	setSearchString: React.Dispatch<React.SetStateAction<string>>;
	search: (searchValue?: string) => void;
};

const SearchBar = ({ setSearchString, search }: SearchBarProps) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={styles.searchBar}>
			<input
				id="search-bar"
				className={styles.searchInput}
				onChange={(event) => {
					setSearchString(event.target.value);
				}}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						search();
					}
				}}
				placeholder="Search all products"
				ref={searchInputRef}
			/>
			<button
				type="button"
				className={styles.searchBarSearchButton}
				onClick={() => {
					searchInputRef.current?.focus();
				}}
			>
				<IconMagnifyingGlass />
			</button>
			{searchInputRef.current?.value && (
				<button
					type="button"
					className={styles.searchInputClearButton}
					onClick={() => {
						if (searchInputRef.current) {
							searchInputRef.current.value = "";
							setSearchString("");
							search("");
						}
					}}
				>
					<IconX />
				</button>
			)}
		</div>
	);
};

const searchSimilarityThreshold = 0.6;

const Shop = () => {
	const products = useLoaderData() as Product[];

	const [searchString, setSearchString] = useState("");
	const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
	const [lastSearch, setLastSearch] = useState("");

	const search = (searchValue = searchString) => {
		setLastSearch(searchValue);

		const searchValueLowercase = searchValue.toLowerCase();
		setFilteredProducts(
			products.filter(({ name }) => {
				const idLowerCase = name.toLowerCase();

				if (idLowerCase.includes(searchValueLowercase)) {
					return true;
				}

				const distance = calculateLevenshteinDistance(searchValueLowercase, idLowerCase);

				return (
					distance / Math.max(searchValueLowercase.length, idLowerCase.length) <= searchSimilarityThreshold
				);
			}),
		);
	};

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.shopPage)}>
				<h1>Shop</h1>

				<SearchBar setSearchString={setSearchString} search={search} />

				<div className={styles.productList}>
					{filteredProducts.length > 0 ? (
						filteredProducts.map(({ id, name, image, price }) => (
							<Link className={styles.product} to={`/product/${id}`} key={name}>
								<img className={styles.productImage} src={image} key={name} />
								<div className={styles.productDetails}>
									<h3 className={styles.productName}>{name}</h3>
									<div className={styles.productPrice}>{price.toLocaleString("en-US")}</div>
								</div>
							</Link>
						))
					) : (
						<p className={styles.productListEmptyText}>No results for &quot;{lastSearch}&quot;</p>
					)}
				</div>
			</main>
		</>
	);
};

export default Shop;
