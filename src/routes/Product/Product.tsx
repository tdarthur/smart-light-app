import { useEffect } from "react";
import { useLoaderData, useMatches, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import type { Product } from "../../models/Product";

import styles from "./product.module.css";
import clsx from "clsx";
import IconChevron from "../../components/icons/IconChevron";

const Product = () => {
	const product = useLoaderData() as Product;
	const matches = useMatches();
	const navigate = useNavigate();

	useEffect(() => {
		if (!matches[0].params.id) {
			navigate("/store");
		}
	}, [matches, navigate]);

	return (
		<>
			<Header />
			<div className={clsx("main-container", styles.productPage)}>
				<button
					className={styles.viewProductsButton}
					onClick={() => {
						navigate("/store");
					}}
				>
					<IconChevron style={{ rotate: "180deg" }} />
					<span>View more products</span>
				</button>
				<div className={styles.product}>
					<img className={styles.productImage} src={product?.image} />
					<div className={styles.productDetails}>
						<h1>{product?.name}</h1>

						<h2>{product.price}</h2>

						<button className={styles.addToCartButton}>Add to Cart</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Product;
