const currencyFormat = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

/**
 * Calculates the Levenshtein distance between two strings.
 *
 * @param s1 - The first string used for comparison.
 * @param s1 - The second string used for comparison.
 *
 * @returns The Levenshtein distance between the two strings.
 */
export const calculateLevenshteinDistance = (s1: string, s2: string) => {
	if (s1.length === 0) return s2.length;
	if (s2.length === 0) return s1.length;

	const matrix = [];

	for (let i = 0; i <= s2.length; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= s1.length; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= s2.length; i++) {
		for (let j = 1; j <= s1.length; j++) {
			const cost = s1[j - 1] === s2[i - 1] ? 0 : 1;
			matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
		}
	}

	return matrix[s2.length][s1.length];
};

/**
 * Formats a given number with 2 decimal points of precision.
 *
 * @param value - The number to format.
 *
 * @returns The formatted dollar amount.
 */
export const formatDollarAmount = (value: number) => {
	return currencyFormat.format(value).substring(1);
};

/**
 * Formats a given number with 2 decimal points of precision.
 *
 * @param amount - The number to format.
 *
 * @returns The formatted dollar amount.
 */
export const formatNumber = (value: number) => {
	if (value < 1000) {
		return value;
	} else if (value >= 1_000 && value < 1_000_000) {
		return `${(value / 1_000).toFixed(1)}k`;
	} else {
		return `${(value / 1_000_000).toFixed(1)}m`;
	}
};
