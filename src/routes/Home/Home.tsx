import clsx from "clsx";

import Header from "../../components/Header";

import styles from "./home.module.css";
import { useEffect, useCallback, useState } from "react";

console.log(sessionStorage.getItem("visited"));
const landingAnimationEnabled = sessionStorage.getItem("visited") !== "true";
sessionStorage.setItem("visited", "true");

const Home = () => {
	const [landingAnimationFinished, setLandingAnimationFinished] = useState(!landingAnimationEnabled);

	const landingAnimationListener = useCallback((event: KeyboardEvent | MouseEvent) => {
		let skipped = false;
		if ("code" in event) {
			const keyboardEvent = event as KeyboardEvent;
			if (keyboardEvent.code === "Space") {
				skipped = true;
			}
		} else {
			skipped = true;
		}

		if (skipped) {
			setLandingAnimationFinished(true);
			removeLandingAnimationListener();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const removeLandingAnimationListener = useCallback(() => {
		window.removeEventListener("keypress", landingAnimationListener);
		window.removeEventListener("click", landingAnimationListener);

		console.log("removing listeners");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (landingAnimationEnabled) {
			window.addEventListener("keypress", landingAnimationListener);
			window.addEventListener("click", landingAnimationListener);

			console.log("adding listeners");

			return removeLandingAnimationListener;
		}
	}, [landingAnimationListener, removeLandingAnimationListener]);

	return (
		<>
			{landingAnimationEnabled && (
				<div
					className={styles.landingUnderlay}
					style={landingAnimationFinished ? { animationDuration: "150ms" } : undefined}
				>
					Light up your life
				</div>
			)}

			<Header
				className={landingAnimationEnabled ? styles.landingFade : undefined}
				style={landingAnimationFinished ? { animationDuration: "150ms" } : { animationDelay: "0ms" }}
			/>
			<main
				className={clsx(styles.homePage, landingAnimationEnabled && styles.landingFade)}
				style={landingAnimationFinished ? { animationDuration: "150ms" } : { animationDelay: "500ms" }}
				onAnimationEnd={() => {
					setLandingAnimationFinished(true);
				}}
			>
				<section className={styles.aboutSection}>
					<h2>This is some placeholder text</h2>
					<p>This is some other placeholder text</p>
				</section>
			</main>
		</>
	);
};

export default Home;
