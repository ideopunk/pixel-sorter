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
	const [min, max] = options.threshold || [0, 0];

	let sortingFunction: ((a: HSLPixel, b: HSLPixel) => number) | ((a: Pixel, b: Pixel) => number);
	let thresholdCheck:
		| ((pixel: HSLPixel, min: number, max: number) => boolean)
		| ((pixel: Pixel, min: number, max: number) => boolean);

	let schema: "rgb" | "hsl" = "rgb";

	switch (options.sortingStyle) {
		case "hue":
			schema = "hsl";
			thresholdCheck = threshold.hueWithinThresholdCheck;
			sortingFunction = sorting.byHueAscending;
			break;
		case "lightness":
			schema = "hsl";
			thresholdCheck = threshold.lightnessWithinThresholdCheck;
			sortingFunction = sorting.byLightAscending;
			break;
		case "saturation":
			schema = "hsl";
			thresholdCheck = threshold.saturationWithinThresholdCheck;
			sortingFunction = sorting.bySaturationAscending;
			break;
		case "red":
			thresholdCheck = threshold.redWithinThresholdCheck;
			sortingFunction = sorting.byRedAscending;
			break;
		case "green":
			thresholdCheck = threshold.greenWithinThresholdCheck;
			sortingFunction = sorting.byGreenAscending;
			break;
		case "blue":
			thresholdCheck = threshold.blueWithinThresholdCheck;
			sortingFunction = sorting.byBlueAscending;
			break;
		case "intensity":
			thresholdCheck = threshold.intensityWithinThresholdCheck;
			sortingFunction = sorting.byRGBAscending;
			break;
		default:
			const exhaustiveCheck: never = options.sortingStyle;
			throw new Error("unreachable");
	}

	// HSL
	if (schema === "hsl") {
		if (!options.threshold) {
			return hslNoThresholdConversion(
				data,
				width,
				height,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number
			);
		} else {
			return hslThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				thresholdCheck as (pixel: HSLPixel, min: number, max: number) => boolean,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number
			);
		}
	}

	if (schema === "rgb") {
		if (!options.threshold) {
			return rgbNoThresholdConversion(
				data,
				width,
				height,
				sortingFunction as (a: Pixel, b: Pixel) => number
			);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				thresholdCheck as (pixel: Pixel, min: number, max: number) => boolean,
				sortingFunction as (a: Pixel, b: Pixel) => number
			);
		}
	}

	throw Error("uhhh unreachable");
};
