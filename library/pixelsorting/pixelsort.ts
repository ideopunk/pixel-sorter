import { Options, PixelArray } from "../types";
import * as sorting from "./sorting";
import * as threshold from "./thresholdCheck";
import {
	hslNoThresholdConversion,
	hslRandomConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbRandomConversion,
	rgbThresholdConversion,
} from "./routes";
import * as maskLib from "./mask";


/**
 * Assign functions and route based on options.
 * @returns converted image
 */
export const pixelsort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: Options
): ImageData => {
	// ASSIGN THINGS
	const [min, max] = options.threshold || [0, 0];

	let downOrRight: boolean = options.direction === "down" || options.direction === "right";
	let columns: boolean = options.direction === "up" || options.direction === "down";

	let sortingFunction: (a: PixelArray, b: PixelArray) => number;
	let thresholdCheck: (pixel: PixelArray, min: number, max: number) => boolean;

	let schema: "rgb" | "hsl" = "rgb";

	switch (options.sortingStyle) {
		case "hue":
			schema = "hsl";
			thresholdCheck = threshold.redOrHue;
			sortingFunction = downOrRight
				? sorting.byRedOrHueAscending
				: sorting.byRedOrHueDescending;
			break;
		case "lightness":
			schema = "hsl";
			thresholdCheck = threshold.blueOrLightness;
			sortingFunction = downOrRight
				? sorting.byBlueOrLightnessAscending
				: sorting.byBlueOrLightnessDescending;
			break;
		case "saturation":
			schema = "hsl";
			thresholdCheck = threshold.greenOrSaturation;
			sortingFunction = downOrRight
				? sorting.byGreenOrSaturationAscending
				: sorting.byGreenOrSaturationDescending;
			break;
		case "red":
			thresholdCheck = threshold.redOrHue;
			sortingFunction = downOrRight
				? sorting.byRedOrHueAscending
				: sorting.byRedOrHueDescending;
			break;
		case "green":
			thresholdCheck = threshold.greenOrSaturation;
			sortingFunction = downOrRight
				? sorting.byGreenOrSaturationAscending
				: sorting.byGreenOrSaturationDescending;
			break;
		case "blue":
			thresholdCheck = threshold.blueOrLightness;
			sortingFunction = downOrRight
				? sorting.byBlueOrLightnessAscending
				: sorting.byBlueOrLightnessDescending;
			break;
		case "intensity":
			thresholdCheck = threshold.intensity;
			sortingFunction = downOrRight ? sorting.byRGBAscending : sorting.byRGBDescending;
			break;
		default:
			const exhaustiveCheck: never = options.sortingStyle;
			throw new Error("unreachable");
	}

	const mask = options?.mask
		? maskLib.toCoordinates(options.mask, options.invertedMask, width, height)
		: undefined;

	// DO THINGS
	if (schema === "hsl") {
		if (options.intervalStyle === "none") {
			return hslNoThresholdConversion(data, width, height, sortingFunction, columns, mask);
		} else if (options.intervalStyle === "random") {
			return hslRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction,
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
				sortingFunction,
				thresholdCheck,
				columns,
				mask
			);
		}
	}

	if (schema === "rgb") {
		if (options.intervalStyle === "none") {
			return rgbNoThresholdConversion(data, width, height, sortingFunction, columns, mask);
		} else if (options.intervalStyle === "random") {
			return rgbRandomConversion(
				data,
				width,
				height,
				min,
				max,
				sortingFunction,
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
				sortingFunction,
				thresholdCheck,
				columns,
				mask
			);
		}
	}

	const exhaustiveCheckFinal: never = schema;
	throw Error("uhhh unreachable");
};
