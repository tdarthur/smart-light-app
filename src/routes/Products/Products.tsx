import styles from "./products.module.css";

type ProductInfo = {
	name: string;
	image: string;
	description: string | React.ReactNode;
	price: number;
};

const products: ProductInfo[] = [
	{ name: "Illuminous Smart Bulb", image: "", description: "This is a bulb for gamers.", price: 19.99 },
	{
		name: "Illuminous Flood Bulb",
		image: "",
		description: "This is a flood light bulb for real cool people.",
		price: 24.99,
	},
];

const Products = () => (
	<div className={styles.products}>
		<div className={styles.productList}>
			{products.map(({ name, image, description, price }) => (
				<div className={styles.product} key={name}>
					<img className={styles.productImage} src={image} key={name} />
					<div className={styles.productDetails}>
						<h3>{name}</h3>
						<div className={styles.productDescription}>{description}</div>
						<div className={styles.productPrice}>{price.toLocaleString("en-US")}</div>
					</div>
				</div>
			))}
		</div>
	</div>
);

export default Products;
