import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel } from "./types";
import * as sorting from "./sortingFunctions";
import * as interval from "./intervalFunctions";
import {
	hslNoThresholdConversion,
	rgbNoThresholdConversion,
	rgbThresholdConversion,
} from "./pixelUtils";

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
	// HSL
	if (options.sortingStyle === "hue") {
		return hslNoThresholdConversion(data, width, height, sorting.byHueAscending);
	}

	if (options.sortingStyle === "saturation") {
		return hslNoThresholdConversion(data, width, height, sorting.bySaturationAscending);
	}

	if (options.sortingStyle === "lightness") {
		return hslNoThresholdConversion(data, width, height, sorting.byLightAscending);
	}

	// RGB
	if (options.sortingStyle === "red") {
		if (!options.threshold) {
			return rgbNoThresholdConversion(data, width, height, sorting.byRedAscending);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				options.threshold[0],
				options.threshold[1],
				interval.byRedAscendingIntervals
			);
		}
	}

	if (options.sortingStyle === "green") {
		return rgbNoThresholdConversion(data, width, height, sorting.byGreenAscending);
	}

	if (options.sortingStyle === "blue") {
		return rgbNoThresholdConversion(data, width, height, sorting.byBlueAscending);
	}

	if (options.sortingStyle === "intensity") {
		return rgbNoThresholdConversion(data, width, height, sorting.byRGBAscending);
	}

	throw Error("uhhh unreachable");
};
