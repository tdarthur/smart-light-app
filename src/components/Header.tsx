import { useState, type ComponentProps, useEffect } from "react";
import clsx from "clsx";
import { Link, To, useLocation, useNavigate } from "react-router-dom";
import IconSun from "./icons/IconSun";
import IconMoon from "./icons/IconMoon";
import IconHamburger from "./icons/IconHamburger";

import styles from "./header.module.css";
import IconX from "./icons/IconX";

let lightModeEnabled = localStorage.getItem("light-mode") === "true";
if (lightModeEnabled) {
	document.body.classList.add("light-mode");
}

type NavigationOption = {
	name: string;
	to: To;
};

const locations: NavigationOption[] = [
	{ name: "Home", to: "/" },
	{ name: "Products", to: "/shop" },
	{ name: "About Us", to: "/about" },
];

const Header = ({ className, ...props }: ComponentProps<"header">) => {
	const [lightMode, setLightMode] = useState(lightModeEnabled);
	const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const resizeListener = () => {
			setHamburgerMenuOpen(false);
		};

		window.addEventListener("resize", resizeListener);

		return () => {
			window.removeEventListener("resize", resizeListener);
		};
	}, []);

	const navigationList = (
		<ul>
			{locations.map(({ name, to }) => (
				<li>
					<Link to={to}>{name}</Link>
				</li>
			))}
		</ul>
	);

	return (
		<>
			<header className={clsx(styles.header, className)} {...props} key={location.key}>
				<button
					className={clsx("icon-button", styles.hamburgerButton)}
					type="button"
					onClick={() => {
						setHamburgerMenuOpen(true);
					}}
					style={hamburgerMenuOpen ? { color: "transparent" } : undefined}
				>
					<IconHamburger />
				</button>

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

				{!hamburgerMenuOpen && <nav className={styles.headerNavigation}>{navigationList}</nav>}

				<button
					className={clsx("icon-button", styles.headerDarkModeToggle)}
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
					{lightMode ? <IconSun /> : <IconMoon />}
				</button>
			</header>

			{hamburgerMenuOpen && (
				<div className={styles.hamburgerMenu}>
					<button
						className={clsx("icon-button", styles.hamburgerExitButton)}
						type="button"
						onClick={() => {
							setHamburgerMenuOpen(false);
						}}
					>
						<IconX />
					</button>
					<nav className={styles.hamburgerMenuNavigation}>{navigationList}</nav>
				</div>
			)}

			<div className={styles.headerSpacer} />
		</>
	);
};

export default Header;
