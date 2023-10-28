import { useState, useRef } from "react";
import { Link, useLoaderData } from "react-router-dom";
import clsx from "clsx";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import IconX from "../../components/icons/IconX";
import IconMagnifyingGlass from "../../components/icons/IconMagnifyingGlass";
import type { Product } from "../../models/Product";
import { calculateLevenshteinDistance, formatDollarAmount } from "../../utils/stringUtils";

import styles from "./store.module.css";
import StarRating from "../../components/StarRating";

type SearchBarProps = {
	setSearchString: React.Dispatch<React.SetStateAction<string>>;
	search: (searchValue?: string) => void;
};

/**
 * Search bar input used to filter products shown on the store page.
 *
 * @param setSearchString - Callback used to update the search string.
 * @param search - Callback invoked to search via the current searchString.
 */
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
				tabIndex={-1}
				aria-hidden
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
					aria-label="clear search"
				>
					<IconX />
				</button>
			)}
		</div>
	);
};

const searchSimilarityThreshold = 0.6;

/**
 * The store page.
 */
const Store = () => {
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
			<main className={clsx("main-container", styles.storePage)}>
				<SearchBar setSearchString={setSearchString} search={search} />

				<div className={styles.productList}>
					{filteredProducts.length > 0 ? (
						filteredProducts.map(({ id, name, image, options: [{ price }], averageRating }) => (
							<Link className={styles.product} to={`/product/${id}`} key={name}>
								<img className={styles.productImage} src={image} key={name} />
								<div className={styles.productDetails}>
									<div className={styles.productName}>{name}</div>
									<StarRating rating={averageRating} starSize={18} />
									<div className={clsx("dollar-amount", styles.productPrice)}>
										{formatDollarAmount(price)}
									</div>
								</div>
							</Link>
						))
					) : (
						<p className={styles.productListEmptyText}>No results for &quot;{lastSearch}&quot;</p>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default Store;
