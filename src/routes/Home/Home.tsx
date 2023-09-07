import { useEffect, useCallback, useState } from "react";
import clsx from "clsx";

import Header from "../../components/Header";

import styles from "./home.module.css";

import homeLightingImage from "../../assets/home-lighting.jpg";

const animationStart = Date.now();
const landingAnimationDefaultDuration = 6_000;

const Home = () => {
	const [landingAnimationEnabled, setLandingAnimationEnabled] = useState(false);
	const [landingAnimationDuration, setLandingAnimationDuration] = useState(landingAnimationDefaultDuration);

	const landingAnimationListener = useCallback((event: KeyboardEvent | MouseEvent) => {
		let skipped = false;
		if ("code" in event) {
			const keyboardEvent = event as KeyboardEvent;
			console.log(keyboardEvent);
			if (keyboardEvent.code === "Escape" || keyboardEvent.code === "Space" || keyboardEvent.code === "Enter") {
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

	useEffect(() => {
		setLandingAnimationEnabled(sessionStorage.getItem("visited") !== "true");
	}, []);

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
				className={clsx(styles.homePage, landingAnimationEnabled && styles.landingFade)}
				style={{ animationDuration: landingAnimationDurationStyle, animationDelay: "500ms" }}
				onAnimationEnd={() => {
					removeLandingAnimationListener();
				}}
			>
				<div className={styles.contentImageContainer}>
					<img className={styles.contentImage} src={homeLightingImage} />
					<div className={styles.contentImageText}>
						<h1>Home lighting redefined</h1>
						<h2>Give life to your whole space</h2>
					</div>
				</div>
				<h2>This is placeholder text</h2>
				<p>This is some other placeholder text</p>
			</main>
		</>
	);
};

export default Home;
