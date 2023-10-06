import { useState, useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Link, To, useLocation, useMatches, useMatch, useNavigate } from "react-router-dom";

import IconSun from "./icons/IconSun";
import IconMoon from "./icons/IconMoon";
import IconHamburger from "./icons/IconHamburger";
import IconX from "./icons/IconX";
import IconChevron from "./icons/IconChevron";
import IconShoppingCart from "./icons/IconShoppingCart";
import useCartContext from "../hooks/useCartContext";
import IconMinus from "./icons/IconMinus";
import IconPlus from "./icons/IconPlus";
import { formatDollarAmount } from "../utils/stringUtils";

import styles from "./header.module.css";

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
	{ name: "Store", to: "/store" },
	{ name: "About Us", to: "/about" },
];

const Header = ({ className, ...props }: ComponentPropsWithoutRef<"header">) => {
	const [lightMode, setLightMode] = useState(lightModeEnabled);
	const [shoppingCartOpen, setShoppingCartOpen] = useState(false);
	const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
	const hamburgerMenuRef = useRef(null);

	const location = useLocation();
	const navigate = useNavigate();

	const matches = useMatches();

	const { addToCart, removeFromCart, products } = useCartContext();

	useEffect(() => {
		const resizeListener = () => {
			setHamburgerMenuOpen(false);
		};

		window.addEventListener("resize", resizeListener);

		return () => {
			window.removeEventListener("resize", resizeListener);
		};
	}, []);

	useEffect(() => {
		if (hamburgerMenuRef.current) {
			const hideHamburgerMenu = (event: MouseEvent) => {
				if (document.getElementById("hamburger-menu")?.getAttribute("data-displayed") === "true") {
					const target = event.target as HTMLElement;

					if (target === document.getElementById("hamburger-button")) return;

					const isDescendantOfHamburgerMenu = (element: HTMLElement): boolean =>
						element === hamburgerMenuRef.current ||
						(element.parentElement && isDescendantOfHamburgerMenu(element.parentElement)) ||
						false;

					if (!isDescendantOfHamburgerMenu(target)) {
						setHamburgerMenuOpen(false);
					}
				}
			};

			window.addEventListener("click", hideHamburgerMenu);

			return () => {
				window.removeEventListener("click", hideHamburgerMenu);
			};
		}
	}, []);

	const toggleDarkMode = () => {
		lightModeEnabled = !lightModeEnabled;

		if (lightModeEnabled) {
			document.body.classList.add("light-mode");
			localStorage.setItem("light-mode", "true");
		} else {
			document.body.classList.remove("light-mode");
			localStorage.setItem("light-mode", "false");
		}

		setLightMode(lightModeEnabled);
	};

	const onStorePage = useMatch("/store");

	let distinctProducts = 0;
	let productSubtotal = 0;
	products.forEach(([{ price }, count]) => {
		distinctProducts++;
		productSubtotal += price * count;
	});

	return (
		<>
			<header className={clsx(styles.header, className)} {...props} key={location.key}>
				<button
					id="hamburger-button"
					className={clsx("icon-button", styles.hamburgerButton)}
					type="button"
					onClick={() => {
						setHamburgerMenuOpen(true);
					}}
					style={hamburgerMenuOpen ? { color: "transparent" } : undefined}
					tabIndex={hamburgerMenuOpen ? -1 : 0}
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
						tabIndex={hamburgerMenuOpen ? -1 : 0}
					>
						Illuminous
					</button>
				</div>

				{!hamburgerMenuOpen && (
					<nav className={styles.headerNavigation}>
						<ul>
							{locations.map(({ name, to }) => (
								<li key={name}>
									<Link to={to}>{name}</Link>
								</li>
							))}
						</ul>
					</nav>
				)}

				<div className={styles.headerButtons}>
					<button
						className={clsx("icon-button", styles.darkModeToggle)}
						onClick={toggleDarkMode}
						tabIndex={hamburgerMenuOpen ? -1 : 0}
					>
						{lightMode ? <IconSun /> : <IconMoon />}
					</button>
					<div className={styles.shoppingCartContainer}>
						<button
							className={clsx("icon-button", styles.shoppingCartButton)}
							onClick={() => {
								setShoppingCartOpen(!shoppingCartOpen);
							}}
							tabIndex={hamburgerMenuOpen ? -1 : 0}
							data-quantity={
								distinctProducts > 0
									? distinctProducts < 10
										? distinctProducts.toString()
										: "9+"
									: undefined
							}
						>
							<IconShoppingCart />
						</button>
						<div className={styles.shoppingCart} data-displayed={shoppingCartOpen || undefined}>
							<h3 className={styles.shoppingCartHeader}>Your Cart</h3>
							{products.size > 0 ? (
								<>
									<div className={styles.shoppingCartProducts}>
										{[...products].map(([, [product, count]]) => (
											<div className={styles.shoppingCartProduct}>
												<img className={styles.shoppingCartProductImage} src={product.image} />
												<div className={styles.shoppingCartProductInfo}>
													<p>{product.name}</p>
													<div className={styles.shoppingCartProductInfoBottom}>
														<div className={styles.shoppingCartProductQuantity}>
															<button
																className="icon-button"
																onClick={() => {
																	removeFromCart(product);
																}}
																disabled={count === 1}
															>
																<IconMinus />
															</button>
															{count}
															<button
																className="icon-button"
																onClick={() => {
																	addToCart(product);
																}}
																disabled={count >= 10}
															>
																<IconPlus />
															</button>
														</div>
														<span className={clsx("dollar-amount", styles.productSubtotal)}>
															{formatDollarAmount(product.price * count)}
														</span>
													</div>
												</div>
											</div>
										))}
									</div>
									<div className={styles.shoppingCartSubtotal}>
										<p>Subtotal</p>
										<strong className={clsx("dollar-amount", styles.shoppingCartSubtotalPrice)}>
											{formatDollarAmount(productSubtotal)}
										</strong>
									</div>
									<Link className={styles.shoppingCartCheckoutButton} to="/checkout">
										Checkout
									</Link>
								</>
							) : (
								<p className={styles.shoppingCartEmptyMessage}>
									No items yet. Get shopping! <br />
									{!onStorePage && (
										<Link className="link-text" to="/store">
											Go to Store
										</Link>
									)}
								</p>
							)}
						</div>
					</div>
				</div>
			</header>

			<div
				id="hamburger-menu"
				className={styles.hamburgerMenu}
				ref={hamburgerMenuRef}
				data-displayed={hamburgerMenuOpen || undefined}
			>
				<div className={styles.hamburgerHeader}>
					<button
						className="icon-button"
						type="button"
						onClick={() => {
							setHamburgerMenuOpen(false);
						}}
						tabIndex={hamburgerMenuOpen ? 0 : -1}
					>
						<IconX />
					</button>
					<button
						className={clsx("icon-button", styles.hamburgerDarkModeToggle)}
						onClick={toggleDarkMode}
						tabIndex={hamburgerMenuOpen ? 0 : -1}
					>
						{lightMode ? <IconSun /> : <IconMoon />}
					</button>
				</div>
				<nav className={styles.hamburgerMenuNavigation}>
					<ul>
						{locations.map(({ name, to }) => {
							const active = matches?.length >= 2 && matches[1].pathname === to;
							return (
								<li key={name}>
									{active ? (
										<strong>{name}</strong>
									) : (
										<Link
											className={styles.hamburgerNavigationLink}
											to={to}
											tabIndex={hamburgerMenuOpen ? 0 : -1}
										>
											{!active && <IconChevron className={styles.activeRouteIndicator} />}
											{name}
										</Link>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>

			<div className={styles.headerSpacer} />
		</>
	);
};

export default Header;
