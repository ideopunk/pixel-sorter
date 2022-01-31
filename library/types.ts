export const arrayOfDirections = [
	"up",
	"down",
	"left",
	"right",
	// "up-to-left",
	// "down-to-left",
	// "up-to-right",
	// "down-to-right",
	// "left-to-up",
	// "left-to-down",
	// "right-to-up",
	// "right-to-down",
] as const;

export const arrayOfSortingStyles = [
	"hue",
	"saturation",
	"lightness",
	"red",
	"green",
	"blue",
	"intensity",
] as const;

export const arrayOfIntervalStyles = ["threshold", "random", "none"] as const;

export type IntervalStyle = typeof arrayOfIntervalStyles[number];
export type SortingStyle = typeof arrayOfSortingStyles[number];
export type Direction = typeof arrayOfDirections[number];

export type PixelSorterData = { data: Uint8ClampedArray; width: number; height: number };

export type Pixel = { r: number; g: number; b: number; a: number };
export type HSLPixel = { h: number; s: number; l: number };

export type Rect = { x: number; y: number; width: number; height: number };

export interface Options {
	direction?: Direction;
	sortingStyle: SortingStyle;
	intervalStyle?: IntervalStyle;
	threshold?: [number, number];
	mask?: Rect;
	invertedMask?: boolean;
}

export interface MaskCoordinates {
	left: number;
	right: number;
	top: number;
	bottom: number;
	inverted: boolean;
}

export const arrayOfMaskOptions = ["none", "regular", "inverted"] as const;
export type MaskOptions = typeof arrayOfMaskOptions[number];
