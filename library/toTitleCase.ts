/**
 * Convert to title case
 *
 * @param s String to be title cased.
 * @returns The title-cased string.
 */
 export default function toTitleCase(s: string): string {
	if (s) {
		const lowerCase = s.toLowerCase();

		return lowerCase.replace(
			/\w\S*/g,
			(x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase()
		);
	}

	return "";
}