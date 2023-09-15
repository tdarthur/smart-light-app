import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import type { Product } from "../../models/Product";
// import IconFilter from "../../components/icons/IconFilter";

import styles from "./shop.module.css";
import IconX from "../../components/icons/IconX";
import IconMagnifyingGlass from "../../components/icons/IconMagnifyingGlass";

// type FilterSelectProps = {
// 	name: string;
// 	label: string;
// };

// const FilterSelect = ({ name, label }: FilterSelectProps) => (
// 	<div className={styles.filterSelect}>
// 		<input id={name} name={name} type="checkbox" />
// 		<label htmlFor={name}>{label}</label>
// 	</div>
// );

type SearchBarProps = {
	setSearchString: React.Dispatch<React.SetStateAction<string>>;
	setActiveFilters: React.Dispatch<React.SetStateAction<(typeof productFeatures)[]>>;
	search: (searchValue?: string) => void;
};

const SearchBar = ({ setSearchString, search }: SearchBarProps) => {
	// const [showFilterOptions, setShowFilterOptions] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const filterContainerRef = useRef(null);

	useEffect(() => {
		if (filterContainerRef.current) {
			const hideFilterOptions = (event: MouseEvent) => {
				const target = event.target as HTMLElement;

				const isDescendantOfFilters = (element: HTMLElement): boolean =>
					element === filterContainerRef.current ||
					(element.parentElement && isDescendantOfFilters(element.parentElement)) ||
					false;

				if (!isDescendantOfFilters(target)) {
					// setShowFilterOptions(false);
				}
			};

			window.addEventListener("click", hideFilterOptions);

			return () => {
				window.removeEventListener("click", hideFilterOptions);
			};
		}
	}, []);

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
		//     <div className={styles.filters} ref={filterContainerRef}>
		//     {/* <div className={styles.appliedFilters}>
		//         <p>These are the active filters</p>
		//     </div> */}
		//     <button
		//         id="toggle-filter-options-shown"
		//         className={styles.toggleFilterOptionsShownButton}
		//         onClick={() => {
		//             setShowFilterOptions(!showFilterOptions);
		//         }}
		//     >
		//         <IconFilter />
		//     </button>
		//     {showFilterOptions && (
		//         <div id="filter-options" className={styles.filterSelectionContainer}>
		//             <h3>Color</h3>
		//             <FilterSelect name="rgb" label="RGB" />
		//             <FilterSelect name="white" label="White" />
		//             <h3>Shape</h3>
		//             <FilterSelect name="standard" label="Standard bulb" />
		//             <FilterSelect name="flood" label="Flood bulb" />
		//             <h3>Brightness</h3>
		//             <FilterSelect name="1100-lumen" label="400 lumen" />
		//             <FilterSelect name="1100-lumen" label="600 lumen" />
		//             <FilterSelect name="1100-lumen" label="800 lumen" />
		//             <FilterSelect name="1100-lumen" label="1100 lumen" />
		//         </div>
		//     )}
		// </div>
	);
};

const productFeatures = ["white", "rgb", "standard", "flood"] as const;

const searchSimilarityThreshold = 0.6;

// Function to calculate Levenshtein distance between two strings
function calculateLevenshteinDistance(a: string, b: string) {
	if (a.length === 0) return b.length;
	if (b.length === 0) return a.length;

	const matrix = [];

	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			const cost = a[j - 1] === b[i - 1] ? 0 : 1;
			matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
		}
	}

	return matrix[b.length][a.length];
}

const Shop = () => {
	const [searchString, setSearchString] = useState("");
	const [activeFilters, setActiveFilters] = useState<(typeof productFeatures)[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [lastSearch, setLastSearch] = useState("");

	useEffect(() => {
		(async () => {
			const products = (await (await fetch("/products.json")).json()) as Product[];
			setProducts(products);
			setFilteredProducts(products);
		})();
	}, []);

	const search = (searchValue = searchString) => {
		setLastSearch(searchValue);

		const searchValueLowercase = searchValue.toLowerCase();
		console.log(activeFilters);
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
			<main className={styles.products}>
				<h1>Shop</h1>

				<SearchBar setSearchString={setSearchString} setActiveFilters={setActiveFilters} search={search} />

				<div className={styles.productList}>
					{filteredProducts.length > 0 ? (
						filteredProducts.map(({ id, name, image, features, price }) => (
							<Link className={styles.product} to={`/product/${id}`} key={name}>
								<img className={styles.productImage} src={image} key={name} />
								<div className={styles.productPrice}>{price.toLocaleString("en-US")}</div>
								<div className={styles.productDetails}>
									<h3 className={styles.productName}>{name}</h3>
									<ul className={styles.productFeatures}>
										{features.map((feature) => (
											<li key={feature}>{feature}</li>
										))}
									</ul>
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
