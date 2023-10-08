import { useEffect, useRef } from "react";
import { Link, useLoaderData } from "react-router-dom";
import clsx from "clsx";

import Header from "../../components/Header";
import IconChevron from "../../components/icons/IconChevron";
import useCartContext from "../../hooks/useCartContext";
import type { Product } from "../../models/Product";
import { CartProductData, maxProductQuantity } from "../../contexts/cartContext";
import { formatDollarAmount } from "../../utils/stringUtils";

import styles from "./product.module.css";

const magnifierMagnification = 1.4;

/**
 * The product page.
 */
const Product = () => {
	const product = useLoaderData() as Product;

	const imageRef = useRef<HTMLImageElement>(null);
	const imageMagnifierRef = useRef<HTMLDivElement>(null);
	const magnifiedImageRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const imageElement = imageRef.current;
		const imageMagnifierElement = imageMagnifierRef.current;
		const magnifiedImageElement = magnifiedImageRef.current;
		if (imageElement && imageMagnifierElement && magnifiedImageElement) {
			let imageRect = imageElement.getBoundingClientRect();
			magnifiedImageElement.style.width = `${imageRect.width * magnifierMagnification}px`;
			magnifiedImageElement.style.height = `${imageRect.height * magnifierMagnification}px`;

			/**
			 * Updates the stored rect of the image.
			 */
			const updateImageRectOnResize = () => {
				imageRect = imageElement.getBoundingClientRect();
			};

			/**
			 * Calculates position for the magnifier and determines whether to display or hide it.
			 *
			 * @param pointerPositionX - the x position of the pointer (mouse or touch)
			 * @param pointerPositionY - the x position of the pointer (mouse or touch)
			 */
			const calculateMagnifierPosition = (pointerPositionX: number, pointerPositionY: number) => {
				const { width: magnifierWidth, height: magnifierHeight } =
					imageMagnifierElement.getBoundingClientRect();
				const { width: magnifiedImageWidth, height: magnifiedImageHeight } =
					magnifiedImageElement.getBoundingClientRect();

				const xOffset = pointerPositionX - (imageRect.left + imageRect.width / 2);
				const yOffset = pointerPositionY - (imageRect.top + imageRect.height / 2);

				imageMagnifierElement.style.left = `${pointerPositionX + window.scrollX - magnifierWidth / 2}px`;
				imageMagnifierElement.style.top = `${pointerPositionY + window.scrollY - magnifierHeight / 2}px`;

				magnifiedImageElement.style.left = `${
					-(magnifiedImageWidth / 2) + magnifierWidth / 2 - xOffset * (magnifiedImageWidth / imageRect.width)
				}px`;
				magnifiedImageElement.style.top = `${
					-(magnifiedImageHeight / 2) +
					magnifierHeight / 2 -
					yOffset * (magnifiedImageHeight / imageRect.height)
				}px`;
				magnifiedImageElement.style.width = `${imageRect.width * magnifierMagnification}px`;
				magnifiedImageElement.style.height = `${imageRect.height * magnifierMagnification}px`;
			};

			/**
			 * Updates the magnifier on a mouse move and determines whether to display or hide it.
			 * The magnifier will be shown when the pointer is over the product image and hidden otherwise.
			 */
			const updateMagnifierOnMouseMove = (event: MouseEvent) => {
				const { clientX, clientY } = event;
				if (event.target === imageElement) {
					if (!imageMagnifierElement.getAttribute("data-shown")) {
						imageMagnifierElement.setAttribute("data-shown", "true");
					}

					calculateMagnifierPosition(clientX, clientY);
				} else {
					if (imageMagnifierElement.getAttribute("data-shown")) {
						imageMagnifierElement.removeAttribute("data-shown");
					}
				}
			};

			/**
			 * Updates the magnifier position when a touch moves.
			 */
			const updateMagnifierOnTouchMove = (event: TouchEvent) => {
				event.preventDefault();

				const { clientX, clientY } = event.touches[0];
				if (
					event.target === imageElement &&
					clientX >= imageRect.left &&
					clientX <= imageRect.right &&
					clientY >= imageRect.top &&
					clientY <= imageRect.bottom
				) {
					if (!imageMagnifierElement.getAttribute("data-shown")) {
						imageMagnifierElement.setAttribute("data-shown", "true");
					}

					calculateMagnifierPosition(clientX, clientY);
				} else {
					if (imageMagnifierElement.getAttribute("data-shown")) {
						imageMagnifierElement.removeAttribute("data-shown");
					}
				}
			};

			/**
			 * Shows the magnifier when touch starts.
			 */
			const showMagnifierOnTouch = (event: TouchEvent) => {
				event.preventDefault();

				if (!imageMagnifierElement.getAttribute("data-shown")) {
					imageMagnifierElement.setAttribute("data-shown", "true");
				}

				const { clientX, clientY } = event.touches[0];
				calculateMagnifierPosition(clientX, clientY);
			};

			/**
			 * Hides the magnifier when touch ends.
			 */
			const hideMagnifierOnTouchEnd = () => {
				if (imageMagnifierElement.getAttribute("data-shown")) {
					imageMagnifierElement.removeAttribute("data-shown");
				}
			};

			window.addEventListener("resize", updateImageRectOnResize);
			window.addEventListener("mousemove", updateMagnifierOnMouseMove);
			imageElement.addEventListener("touchstart", showMagnifierOnTouch);
			imageElement.addEventListener("touchmove", updateMagnifierOnTouchMove);
			imageElement.addEventListener("touchend", hideMagnifierOnTouchEnd);

			return () => {
				window.removeEventListener("resize", updateImageRectOnResize);
				window.removeEventListener("mousemove", updateMagnifierOnMouseMove);
				imageElement.removeEventListener("touchstart", showMagnifierOnTouch);
				imageElement.removeEventListener("touchmove", updateMagnifierOnTouchMove);
				imageElement.removeEventListener("touchend", hideMagnifierOnTouchEnd);
			};
		}
	}, []);

	const { cart, addToCart } = useCartContext();
	const productCount = cart.has(product.id) ? (cart.get(product.id) as CartProductData)[1] : 0;

	return (
		<>
			<Header key={product.id} />
			<main className={clsx("main-container", styles.productPage)}>
				<Link className={styles.viewProductsLink} to="/store">
					<IconChevron style={{ rotate: "180deg" }} />
					<span>View more products</span>
				</Link>

				<div className={styles.product}>
					<div className={styles.productImageMagnifier} ref={imageMagnifierRef}>
						<img src={product?.image} ref={magnifiedImageRef} />
					</div>

					<img className={styles.productImage} src={product?.image} ref={imageRef} />

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
