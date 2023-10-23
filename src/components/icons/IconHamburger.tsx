import styles from "./icons.module.css";

/**
 * SVG hamburger icon.
 */
const IconHamburger = (props: React.SVGProps<SVGSVGElement>) => (
	<span className={styles.iconImage}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			width="100%"
			height="100%"
			role="presentation"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
		</svg>
	</span>
);

export default IconHamburger;
