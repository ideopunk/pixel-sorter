import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel, Options } from "./types";
import * as sorting from "./sortingFunctions";
import * as interval from "./intervalFunctions";
import * as threshold from "./thresholdFunctions";
import {
	hslColumnTest,
	hslNoThresholdConversion,
	hslRandomConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbRandomConversion,
	rgbThresholdConversion,
} from "./pixelControllers";

export const pixelsort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: Options
): ImageData => {
	// ASSIGN THINGS
	const [min, max] = options.threshold || [0, 0];

	let sortingFunction: ((a: HSLPixel, b: HSLPixel) => number) | ((a: Pixel, b: Pixel) => number);
	let thresholdCheck:
		| ((pixel: HSLPixel, min: number, max: number) => boolean)
		| ((pixel: Pixel, min: number, max: number) => boolean);

	let schema: "rgb" | "hsl" = "rgb";
	// let direction: "downright" | "upleft" = (options.direction === "down" || options.direction) === "right" ? "downright" : "upleft";

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

	// DO THINGS
	// HSL
	if (schema === "hsl") {
		if (options.intervalStyle === "none") {
			return hslNoThresholdConversion(
				data,
				width,
				height,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number,
				options.direction === "down" || options.direction === "up"
			);
			// return hslNoThresholdConversion(
			// 	data,
			// 	width,
			// 	height,
			// 	sortingFunction as (a: HSLPixel, b: HSLPixel) => number
			// );
		} else if (options.intervalStyle === "random") {
			return hslRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number,
				options.direction === "down" || options.direction === "up"
			);
		} else {
			return hslThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				thresholdCheck as (pixel: HSLPixel, min: number, max: number) => boolean,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number,
				options.direction === "down" || options.direction === "up"
			);
		}
	}

	if (schema === "rgb") {
		if (options.intervalStyle === "none") {
			return rgbNoThresholdConversion(
				data,
				width,
				height,
				sortingFunction as (a: Pixel, b: Pixel) => number,
				options.direction === "down" || options.direction === "up"
			);
		} else if (options.intervalStyle === "random") {
			return rgbRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction as (a: Pixel, b: Pixel) => number,
				options.direction === "down" || options.direction === "up"
			);
		} else {
			return rgbThresholdConversion(
				data,
				width,
				height,
				min,
				max,
				thresholdCheck as (pixel: Pixel, min: number, max: number) => boolean,
				sortingFunction as (a: Pixel, b: Pixel) => number,
				options.direction === "down" || options.direction === "up"
			);
		}
	}

	throw Error("uhhh unreachable");
};
