import {
	rotateClockwise,
	HSLToRGBPixel,
	RGBToHSLPixel,
	sectionSort,
	rotateCounterClockwise,
} from "../library/pixelsorting/pixelUtils";
import { maskNoThresholdData, rotateCoordinates } from "../library/pixelsorting/mask";
import { MaskCoordinates, Options } from "../library/types";
import {
	hslNoThresholdConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbThresholdConversion,
} from "../library/pixelsorting/routes";
import {
	byBlueOrLightnessDescending,
	byRedOrHueAscending,
	byRedOrHueDescending,
} from "../library/pixelsorting/sorting";
import { redOrHue } from "../library/pixelsorting/thresholdCheck";
import { withThreshold } from "../library/pixelsorting/group";
import { pixelsort } from "../library/pixelsorting/pixelsort";

function arraysEqual(a1: any[], a2: any[]) {
	/* WARNING: arrays must not contain {objects} or behavior may be undefined */
	return JSON.stringify(a1) == JSON.stringify(a2);
}

test("basic integration", () => {
	let initial_vec = new Uint8ClampedArray([
		10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
	]);

	let options: Options = {
		direction: "right",
		sortingStyle: "red",
		intervalStyle: "none",
		threshold: [0, 0],
	};

	let result = pixelsort(initial_vec, 3, 2, options);

	expect(JSON.stringify(Array.from(result.data))).toBe(
		JSON.stringify([0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0])
	);
});

test("mid-level integration", () => {
	let initial_vec = new Uint8ClampedArray([
		// 1, 0, 2, 2, 1, 0
		106, 191, 64, 1, 191, 64, 64, 0, 64, 149, 191, 2, 64, 149, 191, 2, 106, 191, 64, 1, 191, 64,
		64, 0,
	]);

	let options: Options = {
		direction: "right",
		sortingStyle: "hue",
		intervalStyle: "threshold",
		threshold: [50, 255],
	};

	let result = pixelsort(initial_vec, 3, 2, options);

	expect(JSON.stringify(Array.from(result.data))).toBe(
		JSON.stringify([
			// 1, 0, 2, 1, 2, 0
			106, 191, 64, 1, 191, 64, 64, 0, 64, 149, 191, 2, 106, 191, 64, 1, 64, 149, 191, 2, 191,
			64, 64, 0,
		])
	);
});

test("full integration", () => {
	let initial_vec = new Uint8ClampedArray([
		// row 1: 1, 0, 2, 1
		106, 191, 64, 1, 191, 64, 64, 0, 64, 149, 191, 2, 106, 191, 64, 1,
		// row 2: 2, 1, 0, 2
		64, 149, 191, 2, 106, 191, 64, 1, 191, 64, 64, 0, 64, 149, 191, 2,
	]);

	let options: Options = {
		direction: "up",
		sortingStyle: "hue",
		intervalStyle: "threshold",
		threshold: [50, 255],
		mask: { x: 2, y: 0, width: 2, height: 2 },
		invertedMask: true,
	};

	let result = pixelsort(initial_vec, 4, 2, options);

	expect(JSON.stringify(Array.from(result.data))).toBe(
		JSON.stringify([
			// row 1: 1, 0, 2, 2
			106, 191, 64, 1, 191, 64, 64, 0, 64, 149, 191, 2, 64, 149, 191, 2,
			// row 2: 2, 1, 0, 1
			64, 149, 191, 2, 106, 191, 64, 1, 191, 64, 64, 0, 106, 191, 64, 1,
		])
	);
});
