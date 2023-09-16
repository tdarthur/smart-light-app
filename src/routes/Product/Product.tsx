import { useState, useEffect } from "react";
import { useMatches } from "react-router-dom";
import Header from "../../components/Header";
import type { Product } from "../../models/Product";

import styles from "./product.module.css";
import clsx from "clsx";

const Product = () => {
	const [product, setProduct] = useState<Product>();
	const matches = useMatches();

	useEffect(() => {
		// check that the id is valid, otherwise navigate back to products page.
		if (matches[0].params.id) {
			console.log(matches[0].params.id);
		}
	}, [matches]);

	useEffect(() => {
		(async () => {
			const products = (await (await fetch("/products.json", { cache: "no-store" })).json()) as Product[];
			setProduct(products.find((p) => p.id === matches[0].params.id));
		})();
	}, [matches]);

	console.log(product);

	return (
		<>
			<Header />
			<div className={clsx("main-container", styles.productPage)}>
				<h1>{product?.name}</h1>
				<img className={styles.productImage} src={product?.image} />
			</div>
		</>
	);
};

export default Product;
