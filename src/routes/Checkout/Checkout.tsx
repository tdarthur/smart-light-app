import Header from "../../components/Header";
import useCartContext from "../../hooks/useCartContext";

import styles from "./checkout.module.css";

const Checkout = () => {
	const { addToCart, removeFromCart, products } = useCartContext();

	console.log(addToCart, removeFromCart, products);

	return (
		<>
			<Header />
			<main className="main-container">
				<h1>Review and Checkout</h1>
				<div className={styles.cartSummary}>
					{[...products].map(([, [product, count]]) => (
						<div className={styles.product}>
							<h2>{product.name}</h2>
							<img src={product.image} />
							<p>{count}</p>
						</div>
					))}
				</div>
			</main>
		</>
	);
};

export default Checkout;
