import { useEffect, useCallback, useState } from "react";
import clsx from "clsx";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import styles from "./home.module.css";

const animationStart = Date.now();
const landingAnimationDefaultDuration = 4_000;

/**
 * The home page.
 */
const Home = () => {
	const [landingAnimationEnabled, setLandingAnimationEnabled] = useState(false);
	const [landingAnimationDuration, setLandingAnimationDuration] = useState(landingAnimationDefaultDuration);

	/**
	 * Listener that allows for skipping of the landing animation.
	 */
	const landingAnimationListener = useCallback((event: KeyboardEvent | MouseEvent) => {
		let skipped = false;
		if ("code" in event) {
			const keyboardEvent = event as KeyboardEvent;
			if (keyboardEvent.code === "Escape" || keyboardEvent.code === "Space" || keyboardEvent.code === "Enter") {
				keyboardEvent.preventDefault();
				skipped = true;
			}
		} else {
			skipped = true;
		}

		if (skipped) {
			setLandingAnimationDuration(Date.now() + 250 - animationStart);
			removeLandingAnimationListener();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const removeLandingAnimationListener = useCallback(() => {
		window.removeEventListener("keydown", landingAnimationListener);
		window.removeEventListener("click", landingAnimationListener);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * Determines whether or not to show the landing animation.
	 */
	useEffect(() => {
		const visited = localStorage.getItem("last-visit");
		if (visited && Date.now() - parseInt(visited) < 2000) {
			setLandingAnimationEnabled(true);
		}
	}, []);

	/**
	 * Adds listeners to skip the landing animation if it is enabled.
	 */
	useEffect(() => {
		if (landingAnimationEnabled) {
			window.addEventListener("keydown", landingAnimationListener);
			window.addEventListener("click", landingAnimationListener);

			return removeLandingAnimationListener;
		}
	}, [landingAnimationEnabled, landingAnimationListener, removeLandingAnimationListener]);

	const landingAnimationDurationStyle = `${landingAnimationDuration}ms`;

	return (
		<>
			{landingAnimationEnabled && (
				<div className={styles.landingUnderlay} style={{ animationDuration: landingAnimationDurationStyle }}>
					Light up your life
				</div>
			)}

			<Header
				className={landingAnimationEnabled ? styles.landingFade : undefined}
				style={{ animationDuration: landingAnimationDurationStyle, animationDelay: "0ms" }}
			/>

			<main
				className={clsx("expand-to-footer", styles.homePage, landingAnimationEnabled && styles.landingFade)}
				style={{ animationDuration: landingAnimationDurationStyle, animationDelay: "500ms" }}
				onAnimationEnd={() => {
					removeLandingAnimationListener();
				}}
			>
				<div className={styles.contentImageContainer}>
					<img
						className={styles.contentImage}
						src="https://d1clmlgd64m407.cloudfront.net/home-lighting.webp"
						alt="RGB home lighting scene"
					/>
					<div className={styles.contentImageText}>
						<h1>Home lighting redefined</h1>
						<h2>Give life to your whole space</h2>
					</div>
				</div>

				<div className={clsx("main-container", styles.homeContent)}>
					<div className={styles.infoContainer}>
						<h1>A world of customization</h1>
						<p>
							Control your lights one at a time, as part of a group, or all at once. Schedule wake-up and
							wind-down routines to shape the mood of your day. Your lights, how you want them.
						</p>
					</div>

					<div className={styles.infoContainer}>
						<h1>Control anytime, anywhere</h1>
						<p>
							All of our products support all the major home-hub accessories and integrate seamlessly for
							a simple and relaxing experience.
						</p>
						<img
							className={styles.compatibleAccessoriesImage}
							src="https://d1clmlgd64m407.cloudfront.net/accessory-compatibilities.webp"
							alt="WiFi 6e, Apple Homekit, Google Assistant, and Amazon Alexa compatibility"
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

			<Footer
				className={landingAnimationEnabled ? styles.landingFade : undefined}
				style={{ animationDuration: landingAnimationDurationStyle, animationDelay: "1000ms" }}
			/>
		</>
	);
};

export default Home;
