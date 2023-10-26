import styles from "./loadingSpinner.module.css";

type Props = Omit<React.SVGProps<SVGSVGElement>, "children">;

/**
 * SVG loading spinner.
 */
const LoadingSpinner = ({ ...props }: Props) => (
	<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" {...props}>
		<g className={styles.loadingSpinnerGroup}>
			<circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3" />
		</g>
	</svg>
);

export default LoadingSpinner;
