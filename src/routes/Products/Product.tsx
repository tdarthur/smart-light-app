import { useMatches } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./products.module.css";

const Product = () => {
	const matches = useMatches();

	console.log(matches);
	if (matches.length > 0 && "params" in matches[0]) {
		console.log(matches[0].params.id);
	}

	return (
		<>
			<Header />
			<div className={styles.productPage}>
				{matches.length > 0 && "params" in matches[0] ? <h1>{matches[0].params.id}</h1> : null}
			</div>
		</>
	);
};

export default Product;
