import styles from "./icons.module.css";

/**
 * SVG magnifying glass icon.
 */
const IconMagnifyingGlass = (props: React.SVGProps<SVGSVGElement>) => (
	<span className={styles.iconImage}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			width="100%"
			height="100%"
			role="presentation"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
			/>
		</svg>
	</span>
);

export default IconMagnifyingGlass;
