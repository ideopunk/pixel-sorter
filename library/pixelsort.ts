import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel, Options } from "./types";
import * as sorting from "./sortingFunctions";
import * as interval from "./intervalFunctions";
import * as threshold from "./thresholdFunctions";
import {
	hslNoThresholdConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbThresholdConversion,
} from "./pixelUtils";

export const pixelsort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: Options
): ImageData => {
	const min = !!options?.threshold ? options.threshold[0] : 0;
	const max = !!options?.threshold ? options.threshold[1] : 0;
	// HSL
	if (options.sortingStyle === "hue") {
		if (!options.threshold) {
			return hslNoThresholdConversion(data, width, height, sorting.byHueAscending);
		} else {
			return hslThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.hueWithinThresholdCheck,
				sorting.byHueAscending
			);
		}
	}

	if (options.sortingStyle === "saturation") {
		if (!options.threshold) {
			return hslNoThresholdConversion(data, width, height, sorting.bySaturationAscending);
		} else {
			return hslThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.saturationWithinThresholdCheck,
				sorting.bySaturationAscending
			);
		}
	}

	if (options.sortingStyle === "lightness") {
		if (!options.threshold) {
			return hslNoThresholdConversion(data, width, height, sorting.byLightAscending);
		} else {
			return hslThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.lightnessWithinThresholdCheck,
				sorting.byLightAscending
			);
		}
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
				min,
				max,
				threshold.redWithinThresholdCheck,
				sorting.byRedAscending
			);
		}
	}

	if (options.sortingStyle === "green") {
		if (!options.threshold) {
			return rgbNoThresholdConversion(data, width, height, sorting.byGreenAscending);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.greenWithinThresholdCheck,
				sorting.byGreenAscending
			);
		}
	}

	if (options.sortingStyle === "blue") {
		if (!options.threshold) {
			return rgbNoThresholdConversion(data, width, height, sorting.byBlueAscending);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.blueWithinThresholdCheck,
				sorting.byBlueAscending
			);
		}
	}

	if (options.sortingStyle === "intensity") {
		if (!options.threshold) {
			return rgbNoThresholdConversion(data, width, height, sorting.byRGBAscending);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				threshold.intensityWithinThresholdCheck,
				sorting.byRGBAscending
			);
		}
	}

	throw Error("uhhh unreachable");
};
