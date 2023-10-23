import styles from "./icons.module.css";

/**
 * SVG minus sign circle icon.
 */
const IconMinusSignCircle = (props: React.SVGProps<SVGSVGElement>) => (
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
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</span>
);

export default IconMinusSignCircle;
