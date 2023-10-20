import IconStar from "./icons/IconStar";
import styles from "./starRating.module.css";

type ProductRatingProps = {
	rating: number;
	starSize?: number;
};

const ratingScale = 5;

/**
 * A star-rating display.
 *
 * @param rating - The rating to use, from a scale of 1 to 5.
 * @param starSize - The size in pixels of the stars.
 */
const StarRating = ({ rating, starSize = 24 }: ProductRatingProps) => {
	const stars = [];
	for (let i = 0; i < ratingScale; i++) {
		const fillPercentage = (rating > i + 1 ? 1 : rating - i) * 100;
		stars.push(
			<div className={styles.ratingStar} style={{ height: `${starSize}px` }}>
				<IconStar />
				<IconStar
					style={{ clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)` }}
				/>
			</div>,
		);
	}

	return <div className={styles.rating}>{stars}</div>;
};

export default StarRating;
