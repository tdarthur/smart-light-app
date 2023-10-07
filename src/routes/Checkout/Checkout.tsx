import clsx from "clsx";
import Header from "../../components/Header";
import IconMinus from "../../components/icons/IconMinus";
import IconPlus from "../../components/icons/IconPlus";
import useCartContext from "../../hooks/useCartContext";
import { maxProductQuantity } from "../../contexts/cartContext";

import styles from "./checkout.module.css";
import { Link } from "react-router-dom";

const Checkout = () => {
	const { addToCart, removeFromCart, products } = useCartContext();

	return (
		<>
			<Header />
			<main className={clsx("main-container", styles.checkoutPage)}>
				<h1>Review and Checkout</h1>
				<div className={styles.cartSummary}>
					{[...products].map(([, [product, count]]) => {
						const productUrl = `/product/${product.id}`;

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
											removeFromCart(product);
										}}
									>
										<IconMinus />
									</button>
									{count}
									<button
										className="icon-button"
										onClick={() => {
											if (count < maxProductQuantity && count < product.availableQuantity) {
												addToCart(product);
											}
										}}
										disabled={count >= maxProductQuantity || count >= product.availableQuantity}
									>
										<IconPlus />
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
