import { useMatches } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./products.module.css";
import { useEffect } from "react";

const Product = () => {
	const matches = useMatches();

	useEffect(() => {
		// check that the id is valid, otherwise navigate back to products page.
		if (matches[0].params.id) {
			console.log(matches[0].params.id);
		}
	}, [matches]);

	return (
		<>
			<Header />
			<div className={styles.productPage}>
				<h1>{matches[0].params.id}</h1>
			</div>
		</>
	);
};

export default Product;
