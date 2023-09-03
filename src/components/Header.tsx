import { useState, type ComponentProps } from "react";
import clsx from "clsx";

import styles from "./components.module.css";
import { useLocation, useNavigate } from "react-router-dom";

let lightModeEnabled = localStorage.getItem("light-mode") === "true";
if (lightModeEnabled) {
	document.body.classList.add("light-mode");
}

const Header = ({ className, ...props }: ComponentProps<"header">) => {
	const [lightMode, setLightMode] = useState(lightModeEnabled);

	const location = useLocation();
	const navigate = useNavigate();

	return (
		<>
			<header className={clsx(styles.header, className)} {...props}>
				<div className={styles.headerLogo}>
					<button
						className={styles.headerLogoText}
						data-text="Illuminous"
						onClick={() => {
							if (location.pathname !== "/") {
								navigate("/");
							}
						}}
					>
						Illuminous
					</button>
				</div>

				<button
					className={styles.headerDarkModeToggle}
					onClick={() => {
						lightModeEnabled = !lightModeEnabled;

						if (lightModeEnabled) {
							document.body.classList.add("light-mode");
							localStorage.setItem("light-mode", "true");
						} else {
							document.body.classList.remove("light-mode");
							localStorage.setItem("light-mode", "false");
						}

						setLightMode(lightModeEnabled);
					}}
				>
					{lightMode ? "Light Mode" : "Dark Mode"}
				</button>
			</header>
			<div className={styles.headerSpacer} />
		</>
	);
};

export default Header;
