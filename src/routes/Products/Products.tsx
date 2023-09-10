import { Link } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./products.module.css";

type ProductInfo = {
	id: string;
	name: string;
	image: string;
	features: string[];
	price: number;
};

const products: ProductInfo[] = [
	{
		id: "smart-bulb-standard",
		name: "Smart Bulb",
		image: "https://www.vont.com/i/11907?w=1200",
		features: ["800 lumen", "full color range vibrant LED", "supports Alexa, Google Home, and Homekit"],
		price: 19.99,
	},
	{
		id: "smart-bulb-flood",
		name: "Smart Flood Bulb",
		image: "https://www.vont.com/i/11907?w=1200",
		features: ["1100 lumen", "full color range vibrant LED", "supports Alexa, Google Home, and Homekit"],
		price: 24.99,
	},
];

const Products = () => (
	<>
		<Header />
		<main className={styles.products}>
			<div className={styles.productList}>
				{products.map(({ id, name, image, features, price }) => (
					<Link className={styles.product} to={`${id}`} key={name}>
						<img className={styles.productImage} src={image} key={name} />
						<div className={styles.productPrice}>{price.toLocaleString("en-US")}</div>
						<div className={styles.productDetails}>
							<h3 className={styles.productName}>{name}</h3>
							<ul className={styles.productFeatures}>
								{features.map((feature) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
						</div>
					</Link>
				))}
			</div>
		</main>
	</>
);

export default Products;
