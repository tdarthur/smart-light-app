import clsx from "clsx";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import IconMinusSign from "../../components/icons/IconMinusSign";
import IconPlusSign from "../../components/icons/IconPlusSign";
import useCartContext from "../../hooks/useCartContext";
import { maxProductQuantity } from "../../contexts/cartContext";
import { getProductOption } from "../../utils/productUtils";
import { formatDollarAmount } from "../../utils/stringUtils";

import styles from "./checkout.module.css";

/**
 * The checkout page.
 */
const Checkout = () => {
	const { cart, addToCart, removeFromCart } = useCartContext();

	let distinctProducts = 0;
	let productSubtotal = 0;
	cart.forEach(([product, optionId, count]) => {
		const price = getProductOption(product, optionId)?.price || 0;

		distinctProducts++;
		productSubtotal += price * count;
	});

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.checkoutPage)}>
				<h1>Review and Checkout</h1>
				<div className={styles.summaryPanels}>
					<div className={styles.cartSummary}>
						{[...cart].map(([, [product, optionId, count]]) => {
							const productUrl = `/product/${product.id}?option=${optionId}`;
							const option = getProductOption(product, optionId);
							if (!option) return;

							return (
								<div className={styles.product}>
									<Link to={productUrl}>
										<h3>
											{product.name} - {option.caption}
										</h3>
									</Link>

									<div className={styles.productInfo}>
										<Link to={productUrl}>
											<img src={product.image} alt={`${product.name} image`} />
										</Link>

										<div className={styles.productActions}>
											<p>Quantity</p>
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
														if (count < maxProductQuantity && count < option.available) {
															addToCart(product, optionId, 1);
														}
													}}
													disabled={count >= maxProductQuantity || count >= option.available}
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
							<strong className="dollar-amount">{formatDollarAmount(productSubtotal)}</strong> (
							{distinctProducts} items)
							<br />
							<button
								onClick={() => {
									console.log("Placing order!");
									cart.forEach(([product, optionId, count]) => {
										removeFromCart(product, optionId, count);
									});
								}}
							>
								Place Order
							</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default Checkout;
