import { useLoaderData, useNavigate } from "react-router-dom";
import clsx from "clsx";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Product from "../Product/Product";

import styles from "./random.module.css";

/**
 * The 'Random' page, used as a destination for links without any actual content.
 */
const Random = () => {
	const products = useLoaderData() as Product[];
	const navigate = useNavigate();

	const pages = ["/", "/store", "/about"];
	products.forEach((product) => {
		pages.push(`/product/${product.id}`);
	});

	const goToRandomPage = () => {
		navigate(pages[Math.floor(Math.random() * pages.length)]);
	};

	return (
		<>
			<Header />
			<main className={clsx("main-container expand-to-footer", styles.randomPage)}>
				<h1>Nothing Here!</h1>
				<p>
					So yeah there's no content here. Just pretend this is a Privacy Policy or Terms of Service or
					something. Or like a Careers page where you can apply to work at this non-existent company.
				</p>
				<button className="link-text" onClick={goToRandomPage}>
					Click here to go to a random page.
				</button>
			</main>
			<Footer />
		</>
	);
};

export default Random;
