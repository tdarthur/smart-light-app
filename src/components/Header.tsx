import type { ComponentProps } from "react";
import clsx from "clsx";

import styles from "./components.module.css";

const Header = ({ className, ...props }: ComponentProps<"header">) => (
	<header className={clsx(styles.header, className)} {...props}>
		<button className={styles.headerLogo} data-text="Illuminous">
			Illuminous
		</button>
	</header>
);

export default Header;
