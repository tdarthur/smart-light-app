import clsx from "clsx";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import IconMinusSignCircle from "../../components/icons/IconMinusSignCircle";
import IconPlusSignCircle from "../../components/icons/IconPlusSignCircle";
import useCartContext from "../../hooks/useCartContext";
import { maxProductQuantity } from "../../contexts/cartContext";
import { getProductOption } from "../../utils/productUtils";

import styles from "./checkout.module.css";

/**
 * The checkout page.
 */
const Checkout = () => {
	const { cart, addToCart, removeFromCart } = useCartContext();

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.checkoutPage)}>
				<h1>Review and Checkout</h1>
				<div className={styles.cartSummary}>
					{[...cart].map(([, [product, optionId, count]]) => {
						const productUrl = `/product/${product.id}`;
						const option = getProductOption(product, optionId);
						if (!option) return;

						return (
							<div className={styles.product}>
								<Link to={productUrl}>
									<h2>{product.name}</h2>
								</Link>
								<Link to={productUrl}>
									<img src={product.image} />
								</Link>

								<div>
									<button
										className="icon-button"
										onClick={() => {
											removeFromCart(product, optionId, 1);
										}}
									>
										<IconMinusSignCircle />
									</button>
									{count}
									<button
										className="icon-button"
										onClick={() => {
											if (count < maxProductQuantity && count < option.available) {
												addToCart(product, optionId, 1);
											}
										}}
										disabled={count >= maxProductQuantity || count >= option.available}
									>
										<IconPlusSignCircle />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</main>
		</>
	);
};

export default Checkout;
