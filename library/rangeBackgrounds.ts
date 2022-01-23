import { SortingStyle } from "./types";

export default function rangeBackgrounds(
	sortingStyle: SortingStyle,
	min: number,
	max: number
): [string, string, string] {
	const avg = (min + max) / 2;
	const [trackBg, leftBg, rightBg] =
		sortingStyle === "lightness"
			? [`hsl(0, 0%, ${avg}%)`, `hsl(0, 0%, ${min}%)`, `hsl(0, 0%, ${max}%)`]
			: sortingStyle === "saturation"
			? [`hsl(260, ${avg}%, 60%)`, `hsl(260, ${min}%, 60%)`, `hsl(260, ${max}%, 60%)`]
			: sortingStyle === "hue"
			? [`hsl(${avg}, 100%, 60%)`, `hsl(${min}, 100%, 60%)`, `hsl(${max}, 100%, 60%)`]
			: sortingStyle === "red"
			? [`rgb(${avg}, 0, 0)`, `rgb(${min}, 0, 0)`, `rgb(${max}, 0, 0)`]
			: sortingStyle === "green"
			? [`rgb(0, ${avg}, 0)`, `rgb(0, ${min}, 0)`, `rgb(0, ${max}, 0)`]
			: sortingStyle === "blue"
			? [`rgb(0, 0, ${avg})`, `rgb(0, 0, ${min})`, `rgb(0, 0, ${max})`]
			: [
					`rgb(${avg}, ${avg}, ${avg})`,
					`rgb(${min}, ${min}, ${min})`,
					`rgb(${max}, ${max}, ${max})`,
			  ];

	return [trackBg, leftBg, rightBg];
}
