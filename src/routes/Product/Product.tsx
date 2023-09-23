import { useEffect } from "react";
import { useLoaderData, useMatches, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import type { Product } from "../../models/Product";

import styles from "./product.module.css";
import clsx from "clsx";

const Product = () => {
	const product = useLoaderData() as Product;
	const matches = useMatches();
	const navigate = useNavigate();

	useEffect(() => {
		if (!matches[0].params.id) {
			navigate("/shop");
		}
	}, [matches, navigate]);

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
