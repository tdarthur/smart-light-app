import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import IconMinusSign from "../../components/icons/IconMinusSign";
import IconPlusSign from "../../components/icons/IconPlusSign";
import useCartContext from "../../hooks/useCartContext";
import { CartProductData, maxProductQuantity } from "../../contexts/cartContext";
import { getProductOption } from "../../utils/productUtils";
import { formatDollarAmount } from "../../utils/stringUtils";

import styles from "./checkout.module.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

const orderProcessingTime = 2000;

const shippingCostPerIncrement = 3.49;
const shippingCostItemIncrements = 5;

/**
 * The checkout page.
 */
const Checkout = () => {
	const { cart, addToCart, removeFromCart } = useCartContext();
	const [orderStatus, setOrderStatus] = useState<"none" | "processing" | "success" | "failure">("none");
	const [orderData, setOrderData] = useState<Map<string, CartProductData>>(new Map());

	const navigate = useNavigate();

	useEffect(() => {
		if (cart.size === 0 && orderStatus === "none") {
			navigate("/store");
		}
	}, [cart.size, navigate, orderStatus]);

	let totalItemQuantity = 0;
	let subtotal = 0;
	cart.forEach(([product, optionId, count]) => {
		const price = getProductOption(product, optionId)?.price || 0;

		totalItemQuantity += count;
		subtotal += price * count;
	});

	const taxPrice = subtotal * 0.06;
	const shippingPrice = Math.ceil(totalItemQuantity / shippingCostItemIncrements) * shippingCostPerIncrement;
	const totalPrice = subtotal + taxPrice + shippingPrice;

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.checkoutPage)}>
				<h1>{orderStatus !== "success" ? "Review and Checkout" : "Order Details"}</h1>
				{orderStatus !== "success" ? (
					<div className={styles.summaryPanels}>
						<div className={styles.cartSummary}>
							{[...cart].map(([, [product, optionId, count]]) => {
								const productUrl = `/product/${product.id}?option=${optionId}`;
								const option = getProductOption(product, optionId);
								if (!option) return;

								return (
									<div className={styles.product}>
										<h3>
											<Link to={productUrl}>
												{product.name}{" "}
												<span className={styles.productOption}>{option.caption}</span>
											</Link>
										</h3>

										<div className={styles.productInfo}>
											<Link to={productUrl}>
												<img src={product.image} alt={`${product.name} image`} />
											</Link>

											<div className={styles.productActions}>
												<div className={styles.quantity}>
													<button
														className="icon-button"
														onClick={() => {
															removeFromCart(product, optionId, 1);
														}}
														aria-label="decrease quantity by 1"
													>
														<IconMinusSign />
													</button>
													<span>{count}</span>
													<button
														className="icon-button"
														onClick={() => {
															if (
																count < maxProductQuantity &&
																count < option.available
															) {
																addToCart(product, optionId, 1);
															}
														}}
														disabled={
															count >= maxProductQuantity || count >= option.available
														}
														aria-label="increase quantity by 1"
													>
														<IconPlusSign />
													</button>
												</div>
												<button
													className={styles.removeProductButton}
													onClick={() => removeFromCart(product, optionId, count)}
												>
													Remove From Cart
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<div className={styles.priceSummary}>
							<div className={styles.checkoutDetails}>
								<table className={styles.priceBreakdown}>
									<tr>
										<td>Subtotal</td>
										<td>
											<strong className="dollar-amount">{formatDollarAmount(subtotal)}</strong>{" "}
										</td>
									</tr>
									<tr>
										<td>Tax</td>
										<td>
											<strong className="dollar-amount">{formatDollarAmount(taxPrice)}</strong>
										</td>
									</tr>
									<tr>
										<td>Estimated shipping cost</td>
										<td>
											<strong className="dollar-amount">
												{formatDollarAmount(shippingPrice)}
											</strong>
										</td>
									</tr>
									<tr className={styles.separator}>
										<td colSpan={2}>
											<hr />
										</td>
									</tr>
									<tr>
										<td>Total</td>
										<td>
											<strong className="dollar-amount">{formatDollarAmount(totalPrice)}</strong>
										</td>
									</tr>
								</table>
								<button
									onClick={() => {
										if (orderStatus !== "processing") {
											setOrderStatus("processing");

											setTimeout(() => {
												setOrderStatus("success");

												setOrderData(cart);
												cart.forEach(([product, optionId, count]) => {
													removeFromCart(product, optionId, count);
												});
											}, orderProcessingTime);
										}
									}}
								>
									Place Order
								</button>
							</div>
						</div>
					</div>
				) : (
					<div>
						<div className={styles.orderConfirmation}>
							<h2>Order confirmed!</h2>
							<p>
								Details have been sent to nowhere, since this wasn't a real order! Or else we would have
								asked for your credit card information and address. But we didn't do that so...
							</p>
						</div>

						<div className={styles.orderedProducts}>
							{[...orderData].map(([, [product, optionId, count]]) => {
								const option = getProductOption(product, optionId);
								if (!option) return;

								return (
									<div className={styles.receiptProduct}>
										<h3>
											{product.name}{" "}
											<span className={styles.productOption}>{option.caption}</span>
										</h3>

										<div className={styles.productInfo}>
											<img src={product.image} alt={`${product.name} image`} />

											<div>
												<p className={styles.receiptQuantity}>x{count}</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<Link className="link-text" to="/store">
							<span>Ready to do some more shopping?</span>
						</Link>
					</div>
				)}

				<div className={styles.processingOverlay} data-displayed={orderStatus === "processing" || undefined}>
					<LoadingSpinner className={styles.processingLoadingSpinner} />
					<p>Placing order</p>
				</div>
			</main>
		</>
	);
};

export default Checkout;
