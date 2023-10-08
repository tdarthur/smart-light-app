import styles from "./icons.module.css";

/**
 * SVG minus sign icon.
 */
const IconMinusSign = (props: React.SVGProps<SVGSVGElement>) => (
	<span className={styles.iconImage}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="w-6 h-6"
			width="100%"
			height="100%"
			{...props}
		>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</span>
);

export default IconMinusSign;
