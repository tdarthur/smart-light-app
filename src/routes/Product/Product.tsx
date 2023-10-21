import { useEffect, useRef, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import toast, { Toaster } from "react-hot-toast";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import IconChevron from "../../components/icons/IconChevron";
import IconMinusSign from "../../components/icons/IconMinusSign";
import IconPlusSign from "../../components/icons/IconPlusSign";
import useCartContext from "../../hooks/useCartContext";
import type { Product } from "../../models/Product";
import { CartProductData, maxProductQuantity } from "../../contexts/cartContext";
import { formatDollarAmount, formatNumber } from "../../utils/stringUtils";
import { getProductOption } from "../../utils/productUtils";

import styles from "./product.module.css";
import StarRating from "../../components/StarRating";

const magnifierMagnification = 1.25;

/**
 * The product page.
 */
const Product = () => {
	const product = useLoaderData() as Product;
	const [quantity, setQuantity] = useState(1);

	const imageRef = useRef<HTMLImageElement>(null);
	const imageMagnifierRef = useRef<HTMLDivElement>(null);
	const magnifiedImageRef = useRef<HTMLImageElement>(null);
	const productQuantityRef = useRef<HTMLInputElement>(null);

	const { cart, addToCart } = useCartContext();

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const imageElement = imageRef.current;
		const imageMagnifierElement = imageMagnifierRef.current;
		const magnifiedImageElement = magnifiedImageRef.current;
		if (imageElement && imageMagnifierElement && magnifiedImageElement) {
			let imageRect = imageElement.getBoundingClientRect();
			let imageRectYOffset = 0;
			magnifiedImageElement.style.width = `${imageRect.width * magnifierMagnification}px`;
			magnifiedImageElement.style.height = `${imageRect.height * magnifierMagnification}px`;

			/**
			 * Updates the stored rect of the image.
			 */
			const updateImageRectOnResize = () => {
				imageRect = imageElement.getBoundingClientRect();
				imageRectYOffset = window.scrollY;
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
				const yOffset =
					pointerPositionY + window.scrollY - (imageRect.top + imageRectYOffset + imageRect.height / 2);

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

	const selectedOptionId = searchParams.get("option") || product.options[0].id;
	const selectedOption = getProductOption(product, selectedOptionId)!;
	const productCount = cart.has(product.id) ? (cart.get(product.id) as CartProductData)[2] : 0;

	return (
		<>
			<Toaster
				containerClassName={styles.toaster}
				toastOptions={{
					position: "top-right",
					className: styles.toast,
					duration: 750,
				}}
			/>
			<Header key={product.id} />
			<main className={clsx("main-container expand-to-footer", styles.productPage)}>
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
						<div>
							<h1>{product?.name}</h1>
							<button
								className={styles.productRating}
								onClick={() => {
									document.querySelector("#reviews")?.scrollIntoView({ behavior: "smooth" });
								}}
							>
								<StarRating rating={product.averageRating} />
								<span>( {formatNumber(product.reviewCount)} ratings )</span>
							</button>
						</div>

						<h3>Features</h3>
						<div className={styles.productFeatures}>
							{product.features.map((feature) => (
								<p key={feature}>{feature}</p>
							))}
						</div>

						<h3>Size</h3>
						<div className={styles.productSizes}>
							{product.options.map((option) => (
								<button
									onClick={() => {
										setSearchParams(
											{ ...searchParams, option: option.id },
											{ preventScrollReset: true },
										);
									}}
									data-selected={selectedOptionId === option.id || undefined}
									key={option.id}
								>
									{option.caption}
								</button>
							))}
						</div>

						<h3>Quantity</h3>
						<div className={styles.productQuantity}>
							<button
								className="icon-button"
								onClick={() => {
									const newQuantity = Math.max(quantity - 1, 1);
									setQuantity(newQuantity);
									if (productQuantityRef.current) {
										productQuantityRef.current.value = newQuantity.toString();
									}
								}}
								disabled={quantity <= 1}
							>
								<IconMinusSign />
							</button>
							<input
								id="product_quantity"
								type="text"
								onInput={(event) => {
									const inputText = event.currentTarget.value;
									if (inputText.length > 0) {
										const newQuantity = parseInt(event.currentTarget.value.replace(/\D/g, "")) || 0;
										setQuantity(newQuantity);
										event.currentTarget.value = newQuantity.toString();
									}
								}}
								onBlur={(event) => {
									const newQuantity = Math.max(
										1,
										Math.min(
											parseInt(event.currentTarget.value.replace(/\D/g, "")),
											maxProductQuantity,
											selectedOption.available,
										),
									);
									setQuantity(newQuantity);
									event.currentTarget.value = newQuantity.toString();
								}}
								maxLength={2}
								defaultValue={1}
								ref={productQuantityRef}
							/>
							<button
								className="icon-button"
								onClick={() => {
									const newQuantity = Math.min(quantity + 1, 99);
									setQuantity(newQuantity);
									if (productQuantityRef.current) {
										productQuantityRef.current.value = newQuantity.toString();
									}
								}}
								disabled={
									productCount + quantity >= maxProductQuantity ||
									productCount + quantity >= selectedOption.available
								}
							>
								<IconPlusSign />
							</button>
						</div>

						<h2 className="dollar-amount">{formatDollarAmount(selectedOption.price)}</h2>

						<button
							className={styles.addToCartButton}
							onClick={() => {
								if (
									productCount + quantity <= maxProductQuantity &&
									productCount + quantity <= selectedOption.available
								) {
									addToCart(product, selectedOption.id, quantity);
									toast("Added to cart!", { id: "added-to-cart" });
								}
							}}
							disabled={productCount >= maxProductQuantity || productCount >= selectedOption.available}
						>
							Add to Cart
						</button>
					</div>
				</div>

				<div className={styles.reviews} id="reviews">
					<h2>Reviews</h2>
					{product.reviews.map(({ customer, review, rating }) => (
						<div className={styles.review}>
							<p className={styles.reviewerName}>{customer}</p>
							<div>
								<StarRating rating={rating} starSize={16} />
							</div>
							<p>{review}</p>
						</div>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default Product;
