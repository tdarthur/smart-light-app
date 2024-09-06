import clsx from "clsx";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import styles from "./home.module.css";
import { Link } from "react-router-dom";

/**
 * The home page.
 */
const Home = () => (
	<>
		<Header />

		<main className={clsx(styles.homePage && styles.landingFade)}>
			<div className={styles.contentImageContainer}>
				<img
					className={styles.contentImage}
					src="https://d1clmlgd64m407.cloudfront.net/home-lighting.webp"
					alt="RGB home lighting scene"
				/>
				<div className={styles.contentImageText}>
					<h1>Home lighting redefined</h1>
					<h2>Give life to your living space</h2>
				</div>
			</div>

			<div className={clsx("main-container", styles.homeContent)}>
				<div className={styles.infoContainer}>
					<h1>A world of customization</h1>
					<p>
						Control your lights one at a time, as part of a group, or all at once. Schedule wake-up and
						wind-down routines to shape the mood of your day. Your lights, how you want them.
					</p>
					<Link className={styles.storeLink} to="/store">
						Check out our latest smart-home products
					</Link>
				</div>

				<div className={styles.infoContainer}>
					<h1>Control anytime, anywhere</h1>
					<p>
						All of our products support all the major home-hub accessories and integrate seamlessly for a
						simple and relaxing experience.
					</p>
					<img
						className={styles.compatibleAccessoriesImage}
						src="https://d1clmlgd64m407.cloudfront.net/accessory-compatibilities.webp"
						alt="WiFi 6e, Apple Homekit, Google Assistant, and Amazon Alexa compatibility"
						loading="lazy"
					/>
				</div>

				<h1 className={styles.statsHeader}>Smart home done right</h1>
				<div className={styles.statsContainer}>
					<div className={styles.stat}>
						<h2>2m+</h2>
						<p>satisfied customers</p>
					</div>
					<div className={styles.stat}>
						<h2>200k</h2>
						<p>positive reviews</p>
					</div>
					<div className={styles.stat}>
						<h2>5m+</h2>
						<p>devices purchased</p>
					</div>
				</div>
			</div>
		</main>

		<Footer />
	</>
);

export default Home;
