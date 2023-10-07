import { useEffect, useRef } from "react";
import { useLoaderData, useMatches, useNavigate } from "react-router-dom";
import clsx from "clsx";

import Header from "../../components/Header";
import IconChevron from "../../components/icons/IconChevron";
import useCartContext from "../../hooks/useCartContext";
import type { Product } from "../../models/Product";
import { CartProductData, maxProductQuantity } from "../../contexts/cartContext";
import { formatDollarAmount } from "../../utils/stringUtils";

import styles from "./product.module.css";

const magnifierMagnification = 1.4;

const Product = () => {
	const product = useLoaderData() as Product;
	const matches = useMatches();
	const navigate = useNavigate();

	const imageRef = useRef<HTMLImageElement>(null);
	const imageMagnifierRef = useRef<HTMLDivElement>(null);
	const magnifiedImageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!matches[0].params.id) {
			navigate("/store");
		}
	}, [matches, navigate]);

	useEffect(() => {
		if (imageRef.current && imageMagnifierRef.current && magnifiedImageRef.current) {
			window.addEventListener("mousemove", (e) => {
				if (!imageRef.current || !imageMagnifierRef.current || !magnifiedImageRef.current) return;

				const mouseX = e.clientX;
				const mouseY = e.clientY;

				const {
					top,
					right,
					bottom,
					left,
					width: imageWidth,
					height: imageHeight,
				} = imageRef.current.getBoundingClientRect();
				const { width: magnifierWidth, height: magnifierHeight } =
					imageMagnifierRef.current.getBoundingClientRect();
				const { width: magnifiedImageWidth, height: magnifiedImageHeight } =
					magnifiedImageRef.current.getBoundingClientRect();

				if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
					if (!imageMagnifierRef.current.getAttribute("data-shown")) {
						imageMagnifierRef.current.setAttribute("data-shown", "true");
					}

					const xOffset = mouseX - (left + imageWidth / 2);
					const yOffset = mouseY - (top + imageHeight / 2);

					imageMagnifierRef.current.style.left = `${mouseX + window.scrollX - magnifierWidth / 2}px`;
					imageMagnifierRef.current.style.top = `${mouseY + window.scrollY - magnifierHeight / 2}px`;

					magnifiedImageRef.current.style.left = `${
						-(magnifiedImageWidth / 2) + magnifierWidth / 2 - xOffset * (magnifiedImageWidth / imageWidth)
					}px`;
					magnifiedImageRef.current.style.top = `${
						-(magnifiedImageHeight / 2) +
						magnifierHeight / 2 -
						yOffset * (magnifiedImageHeight / imageHeight)
					}px`;
					magnifiedImageRef.current.style.width = `${imageWidth * magnifierMagnification}px`;
					magnifiedImageRef.current.style.height = `${imageHeight * magnifierMagnification}px`;
				} else {
					if (imageMagnifierRef.current.getAttribute("data-shown")) {
						imageMagnifierRef.current.removeAttribute("data-shown");
					}
				}
			});
		}
	}, []);

	const { products, addToCart } = useCartContext();
	const productCount = products.has(product.id) ? (products.get(product.id) as CartProductData)[1] : 0;

	// TODO: fix horizontal overflow on mobile

	return (
		<>
			<Header key={product.id} />
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
					<img className={styles.productImage} src={product?.image} ref={imageRef} />
					<div className={styles.productImageMagnifier} ref={imageMagnifierRef}>
						<img src={product?.image} ref={magnifiedImageRef} />
					</div>
					<div className={styles.productInfo}>
						<div className={styles.productFeatures}>
							<h1>{product?.name}</h1>
						</div>

						<h2 className="dollar-amount">{formatDollarAmount(product.price)}</h2>

						<button
							className={styles.addToCartButton}
							onClick={() => {
								if (productCount < maxProductQuantity && productCount < product.availableQuantity) {
									addToCart(product);
								}
							}}
							disabled={productCount >= maxProductQuantity || productCount >= product.availableQuantity}
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
