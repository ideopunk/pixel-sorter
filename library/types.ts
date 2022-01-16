export const arrayOfDirections = [
	"up",
	"down",
	"left",
	"right",
	"up-to-left",
	"down-to-left",
	"up-to-right",
	"down-to-right",
	"left-to-up",
	"left-to-down",
	"right-to-up",
	"right-to-down",
] as const;

export const arrayOfSortingStyles = [
	"lightness",
	"hue",
	"saturation",
	"intensity",
	"red",
	"green",
	"blue",
] as const;

export const arrayOfIntervalStyles = ["threshold", "random", "none"] as const;

export type IntervalStyle = typeof arrayOfIntervalStyles[number];
export type SortingStyle = typeof arrayOfSortingStyles[number];
export type Direction = typeof arrayOfDirections[number];
