import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel, Options } from "./types";
import * as sorting from "./sorting";
import * as threshold from "./threshold";
import {
	hslNoThresholdConversion,
	hslRandomConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbRandomConversion,
	rgbThresholdConversion,
} from "./pixelControllers";
import * as maskLib from "./mask";

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
	let downOrRight: boolean = options.direction === "down" || options.direction === "right";
	let columns: boolean = options.direction === "up" || options.direction === "down";
	switch (options.sortingStyle) {
		case "hue":
			schema = "hsl";
			thresholdCheck = threshold.hueWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byHueAscending : sorting.byHueDescending;
			break;
		case "lightness":
			schema = "hsl";
			thresholdCheck = threshold.lightnessWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byLightAscending : sorting.byLightDescending;
			break;
		case "saturation":
			schema = "hsl";
			thresholdCheck = threshold.saturationWithinThresholdCheck;
			sortingFunction = downOrRight
				? sorting.bySaturationAscending
				: sorting.bySaturationDescending;
			break;
		case "red":
			thresholdCheck = threshold.redWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byRedAscending : sorting.byRedDescending;
			break;
		case "green":
			thresholdCheck = threshold.greenWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byGreenAscending : sorting.byGreenDescending;
			break;
		case "blue":
			thresholdCheck = threshold.blueWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byBlueAscending : sorting.byBlueDescending;
			break;
		case "intensity":
			thresholdCheck = threshold.intensityWithinThresholdCheck;
			sortingFunction = downOrRight ? sorting.byRGBAscending : sorting.byRGBDescending;
			break;
		default:
			const exhaustiveCheck: never = options.sortingStyle;
			throw new Error("unreachable");
	}

	const mask = options?.mask ? maskLib.toCoordinates(options.mask, width, height) : undefined;
	// DO THINGS

	// HSL
	if (schema === "hsl") {
		if (options.intervalStyle === "none") {
			return hslNoThresholdConversion(
				data,
				width,
				height,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number,
				columns,
				mask
			);
		} else if (options.intervalStyle === "random") {
			return hslRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction as (a: HSLPixel, b: HSLPixel) => number,
				columns,
				mask
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
				columns,
				mask
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
				columns,
				mask
			);
		} else if (options.intervalStyle === "random") {
			return rgbRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction as (a: Pixel, b: Pixel) => number,
				columns,
				mask
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
				columns,
				mask
			);
		}
	}

	const exhaustiveCheckFinal: never = schema;
	throw Error("uhhh unreachable");
};
