import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../components/Header";

import styles from "./products.module.css";

type ProductInfo = {
	id: string;
	name: string;
	image: string;
	features: string[];
	price: number;
};

const Products = () => {
	// const [searchString, setSearchString] = useState("");
	const [products, setProducts] = useState<ProductInfo[]>([]);

	useEffect(() => {
		(async () => {
			setProducts((await (await fetch("/products.json")).json()) as ProductInfo[]);
		})();
	}, []);

	return (
		<>
			<Header />
			<main className={styles.products}>
				<div className={styles.productSection}>
					{/* <div className={styles.productSearchBar}>
						<input
							name="product-search"
							className={styles.productSearchInput}
							onChange={(event) => {
								setSearchString(event.target.value);
								console.log(searchString);
							}}
						/>
					</div> */}
					<div className={styles.productList}>
						{products.map(({ id, name, image, features, price }) => (
							<Link className={styles.product} to={`${id}`} key={name}>
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
						))}
					</div>
				</div>
			</main>
		</>
	);
};

export default Products;
