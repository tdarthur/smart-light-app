import { useEffect } from "react";
import { useLoaderData, useMatches, useNavigate } from "react-router-dom";
import clsx from "clsx";

import Header from "../../components/Header";
import IconChevron from "../../components/icons/IconChevron";
import useCartContext from "../../hooks/useCartContext";
import type { Product } from "../../models/Product";
import { formatDollarAmount } from "../../utils/stringUtils";

import styles from "./product.module.css";

const Product = () => {
	const product = useLoaderData() as Product;
	const matches = useMatches();
	const navigate = useNavigate();

	useEffect(() => {
		if (!matches[0].params.id) {
			navigate("/store");
		}
	}, [matches, navigate]);

	const { addToCart } = useCartContext();

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.productPage)}>
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

						<h2 className="dollar-amount">{formatDollarAmount(product.price)}</h2>

						<button
							className={styles.addToCartButton}
							onClick={() => {
								addToCart(product);
							}}
						>
							Add to Cart
						</button>
					</div>
				</div>
			</main>
		</>
	);
};

export default Product;
