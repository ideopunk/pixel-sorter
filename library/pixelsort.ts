import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel } from "./types";
import * as sorting from "./sortingFunctions";
import { hslConversion, rgbConversion } from "./pixelUtils";

interface Options {
	direction?: Direction;
	sortingStyle: SortingStyle;
	intervalStyle?: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
}

export const workersort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: Options
): ImageData => {
	// HSL??
	if (options.sortingStyle === "hue") {
		return hslConversion(data, width, height, sorting.byHueAscending);
	}

	if (options.sortingStyle === "saturation") {
		return hslConversion(data, width, height, sorting.bySaturationAscending);
	}

	if (options.sortingStyle === "lightness") {
		return hslConversion(data, width, height, sorting.byLightAscending);
	}

	if (options.sortingStyle === "red") {
		return rgbConversion(data, width, height, sorting.byRedAscending);
	}

	if (options.sortingStyle === "green") {
		return rgbConversion(data, width, height, sorting.byGreenAscending);
	}

	if (options.sortingStyle === "blue") {
		return rgbConversion(data, width, height, sorting.byBlueAscending);
	}

	if (options.sortingStyle === "intensity") {
		return rgbConversion(data, width, height, sorting.byRGBAscending);
	}

	throw Error("uhhh unreachable");
};
