import clsx from "clsx";

import Header from "../../components/Header";

import styles from "./home.module.css";
import { useEffect, useCallback, useState } from "react";

const landingAnimationEnabled = sessionStorage.getItem("visited") !== "true";
sessionStorage.setItem("visited", "true");

const animationStart = Date.now();
const landingAnimationDefaultDuration = 6_000;

const Home = () => {
	const [landingAnimationDuration, setLandingAnimationDuration] = useState(landingAnimationDefaultDuration);

	const landingAnimationListener = useCallback((event: KeyboardEvent | MouseEvent) => {
		let skipped = false;
		if ("code" in event) {
			const keyboardEvent = event as KeyboardEvent;
			console.log(keyboardEvent);
			if (keyboardEvent.code === "Space" || keyboardEvent.code === "Enter") {
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
		window.removeEventListener("keypress", landingAnimationListener);
		window.removeEventListener("click", landingAnimationListener);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (landingAnimationEnabled) {
			window.addEventListener("keypress", landingAnimationListener);
			window.addEventListener("click", landingAnimationListener);

			return removeLandingAnimationListener;
		}
	}, [landingAnimationListener, removeLandingAnimationListener]);

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
				<h1>This is some placeholder text</h1>
				<p>This is some other placeholder text</p>
			</main>
		</>
	);
};

export default Home;
