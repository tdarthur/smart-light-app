import type { ComponentProps } from "react";
import clsx from "clsx";

import styles from "./components.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ className, ...props }: ComponentProps<"header">) => {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<>
			<header className={clsx(styles.header, className)} {...props}>
				<button
					className={styles.headerLogo}
					data-text="Illuminous"
					onClick={() => {
						if (location.pathname !== "/") {
							navigate("/");
						}
					}}
				>
					Illuminous
				</button>

				<button />
			</header>
			<div className={styles.headerSpacer} />
		</>
	);
};

export default Header;
