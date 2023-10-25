import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Link, To, useLocation, useMatches, useMatch, useNavigate } from "react-router-dom";

import IconSun from "./icons/IconSun";
import IconMoon from "./icons/IconMoon";
import IconHamburger from "./icons/IconHamburger";
import IconX from "./icons/IconX";
import IconChevron from "./icons/IconChevron";
import IconShoppingCart from "./icons/IconShoppingCart";
import useCartContext from "../hooks/useCartContext";
import IconMinusSignCircle from "./icons/IconMinusSignCircle";
import IconPlusSignCircle from "./icons/IconPlusSignCircle";
import { maxProductQuantity } from "../contexts/cartContext";
import { formatDollarAmount } from "../utils/stringUtils";
import { getProductOption } from "../utils/productUtils";

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

/**
 * Application header. Handles hamburger menu for smaller screens and light/dark mode toggling.
 */
const Header = ({ className, ...props }: React.ComponentPropsWithoutRef<"header">) => {
	const [lightMode, setLightMode] = useState(lightModeEnabled);
	const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
	const hamburgerMenuRef = useRef<HTMLDivElement>(null);
	const shoppingCartDialogRef = useRef<HTMLDialogElement>(null);

	const location = useLocation();
	const navigate = useNavigate();

	const matches = useMatches();

	const { cart, addToCart, removeFromCart } = useCartContext();

	/**
	 * Sets a listener for closing the hamburger menu when the window is resized.
	 */
	useEffect(() => {
		const resizeListener = () => {
			setHamburgerMenuOpen(false);
		};

		window.addEventListener("resize", resizeListener);

		return () => {
			window.removeEventListener("resize", resizeListener);
		};
	}, []);

	/**
	 * Sets a listener to close the hamburger menu when a click/touch occurs outside of it.
	 */
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

	/**
	 * Toggles between light and dark mode.
	 */
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
	cart.forEach(([product, optionId, count]) => {
		const price = getProductOption(product, optionId)?.price || 0;

		distinctProducts++;
		productSubtotal += price * count;
	});

	return (
		<>
			<button
				type="button"
				className={styles.skipToMainContentButton}
				onClick={() => {
					const mainElement = document.querySelector("main");
					if (!mainElement) return;

					mainElement.addEventListener("focusout", () => {
						mainElement.tabIndex = -1;
					});

					mainElement.tabIndex = 0;
					mainElement.focus({ preventScroll: true });
				}}
			>
				Skip to main content
			</button>

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
					aria-label="open hamburger menu"
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
						aria-label="dark mode toggle"
						aria-hidden
					>
						{lightMode ? <IconSun /> : <IconMoon />}
					</button>
					<div className={styles.shoppingCartContainer}>
						<button
							className={clsx("icon-button", styles.shoppingCartButton)}
							onClick={() => {
								if (!shoppingCartDialogRef.current) return;

								if (shoppingCartDialogRef.current?.open) {
									shoppingCartDialogRef.current.close();
								} else {
									shoppingCartDialogRef.current.show();
								}
							}}
							tabIndex={hamburgerMenuOpen ? -1 : 0}
							data-quantity={
								distinctProducts > 0
									? distinctProducts < 10
										? distinctProducts.toString()
										: "9+"
									: undefined
							}
							aria-label={
								shoppingCartDialogRef.current?.open ? "close shopping cart" : "open shopping cart"
							}
						>
							<IconShoppingCart />
						</button>
						<dialog className={styles.shoppingCart} ref={shoppingCartDialogRef}>
							<h3 className={styles.shoppingCartHeader}>Your Cart</h3>
							{cart.size > 0 ? (
								<>
									<div className={styles.shoppingCartProducts}>
										{[...cart].map(([, [product, optionId, count]]) => {
											const productUrl = `/product/${product.id}?option=${optionId}`;
											const option = getProductOption(product, optionId);
											if (!option) return;

											return (
												<div
													className={styles.shoppingCartProduct}
													key={`${product.id}-${optionId}`}
												>
													<Link to={productUrl} style={{ display: "flex" }}>
														<img
															className={styles.shoppingCartProductImage}
															src={product.image}
														/>
													</Link>

													<div className={styles.shoppingCartProductInfo}>
														<div className={styles.productNameAndOption}>
															<Link to={productUrl} style={{ width: "fit-content" }}>
																<p>{product.name}</p>
															</Link>
															<Link to={productUrl} style={{ width: "fit-content" }}>
																<small>{option.caption}</small>
															</Link>
														</div>

														<div className={styles.shoppingCartProductInfoBottom}>
															<div className={styles.shoppingCartProductQuantity}>
																<button
																	className="icon-button"
																	onClick={() => {
																		removeFromCart(product, optionId, 1);
																	}}
																	style={{ marginLeft: "-1px", marginRight: "4px" }}
																	aria-label="increase quantity by 1"
																>
																	<IconMinusSignCircle />
																</button>
																{count}
																<button
																	className="icon-button"
																	onClick={() => {
																		if (
																			count < maxProductQuantity &&
																			count < option.available
																		) {
																			addToCart(product, optionId, 1);
																		}
																	}}
																	style={{ marginLeft: "4px" }}
																	disabled={
																		count >= maxProductQuantity ||
																		count >= option.available
																	}
																	aria-label="increase quantity by 1"
																>
																	<IconPlusSignCircle />
																</button>
															</div>

															<span
																className={clsx(
																	"dollar-amount",
																	styles.productSubtotal,
																)}
															>
																{formatDollarAmount(option.price * count)}
															</span>
														</div>
													</div>
												</div>
											);
										})}
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
						</dialog>
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
						aria-label="close hamburger menu"
					>
						<IconX />
					</button>
					<button
						className={clsx("icon-button", styles.hamburgerDarkModeToggle)}
						onClick={toggleDarkMode}
						tabIndex={hamburgerMenuOpen ? 0 : -1}
						aria-hidden
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
