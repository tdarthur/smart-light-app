import styles from "./icons.module.css";

/**
 * SVG chevron icon.
 */
const IconChevron = (props: React.SVGProps<SVGSVGElement>) => (
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
			<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
		</svg>
	</span>
);

export default IconChevron;
