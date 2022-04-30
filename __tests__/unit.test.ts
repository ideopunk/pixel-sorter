import {
	columnsToRows,
	HSLToRGB,
	rgbPixeltoHslPixel,
	sectionSort,
	toColumns,
} from "../library/pixelsorting/pixelUtils";
import { maskNoThresholdData, rotateCoordinates } from "../library/pixelsorting/mask";
import { MaskCoordinates } from "../library/types";
import {
	hslNoThresholdConversion,
	hslThresholdConversion,
	rgbNoThresholdConversion,
	rgbThresholdConversion,
} from "../library/pixelsorting/pixelControllers";
import {
	byBlueOrLightnessDescending,
	byRedOrHueAscending,
	byRedOrHueDescending,
} from "../library/pixelsorting/sorting";
import { redOrHueWithinThresholdCheck } from "../library/pixelsorting/threshold";
import { sortRowWithThreshold } from "../library/pixelsorting/intervalFunctions";

test("ping", () => expect("pong").toBe("pong"));

function arraysEqual(a1: any[], a2: any[]) {
	/* WARNING: arrays must not contain {objects} or behavior may be undefined */
	return JSON.stringify(a1) == JSON.stringify(a2);
}

test("section sort", () => {
	let data = new Uint8ClampedArray([
		10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0,
		//  20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
	]);
	sectionSort(data, byRedOrHueAscending);
	expect(arraysEqual(Array.from(data), [0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0])).toBe(true);
});

test("test no threshold ascending", () => {
	let inputData = new Uint8ClampedArray([
		10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
	]);
	let result = rgbNoThresholdConversion(inputData, 3, 2, byRedOrHueAscending, false);
	expect(
		arraysEqual(
			Array.from(result.data),
			[0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0]
		)
	).toBe(true);
});

test("test no threshold descending", () => {
	let inputData = new Uint8ClampedArray([
		10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
	]);
	let result = rgbNoThresholdConversion(inputData, 3, 2, byRedOrHueDescending, false);
	expect(
		arraysEqual(
			Array.from(result.data),
			[20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0]
		)
	).toBe(true);
});

test("test no threshold blue descending", () => {
	let inputData = new Uint8ClampedArray([
		0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0,
	]);
	let result = rgbNoThresholdConversion(inputData, 3, 2, byBlueOrLightnessDescending, false);
	expect(
		arraysEqual(
			Array.from(result.data),
			[0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0]
		)
	).toBe(true);
});

test("threshold row nothing", () => {
	let inputData = new Uint8ClampedArray([10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0]);
	sortRowWithThreshold(inputData, 5, 30, redOrHueWithinThresholdCheck, byRedOrHueAscending);
	expect(arraysEqual(Array.from(inputData), [10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0])).toBe(true);
});

test("threshold row something", () => {
	let inputData = new Uint8ClampedArray([20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0]);
	sortRowWithThreshold(inputData, 5, 30, redOrHueWithinThresholdCheck, byRedOrHueAscending);
	expect(arraysEqual(Array.from(inputData), [10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0])).toBe(true);
});

test("test  threshold red ascending", () => {
	let inputData = new Uint8ClampedArray([
		10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
	]);
	let result = rgbThresholdConversion(
		inputData,
		3,
		2,
		5,
		30,
		byRedOrHueAscending,
		redOrHueWithinThresholdCheck,
		false
	);
	expect(
		arraysEqual(
			Array.from(result.data),
			[10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0]
		)
	).toBe(true);
});

test("test_pixel_to_hsl", () => {
	let result = rgbPixeltoHslPixel(new Uint8ClampedArray([191, 64, 64, 0]));

	let satch_delta = Math.abs(result[1] - 49.8);
	let light_delta = Math.abs(result[2] - 50.0);

	expect(satch_delta < 0.15).toBe(true);
	expect!(light_delta < 0.15).toBe(true);
});

test("test hsl to pixel", () => {
	let hsl = new Float64Array([0, 49.8, 50, 0]);
	// something is fcked here conor
	let result = HSLToRGB(hsl);

	expect(result[0]).toBe(191);
	expect(result[1]).toBe(64);
	expect(result[2]).toBe(64);
	expect(result[3]).toBe(0);
});

// spread operator to accomodate prettier
test(" test_no_threshold_hue_descending", () => {
	let inputData = new Uint8ClampedArray([
		...[106, 191, 64, 0], // 1
		...[191, 64, 64, 0], // 0
		...[64, 149, 191, 0], // 2
		...[64, 149, 191, 0], // 2
		...[106, 191, 64, 0], // 1
		...[191, 64, 64, 0], // 0
	]);
	let result = hslNoThresholdConversion(inputData, 3, 2, byRedOrHueDescending, false);

	expect(
		arraysEqual(Array.from(result.data), [
			...[64, 149, 191, 0], // 2
			...[106, 191, 64, 0], // 1
			...[191, 64, 64, 0], // 0
			...[64, 149, 191, 0], // 2
			...[106, 191, 64, 0], // 1
			...[191, 64, 64, 0], // 0
		])
	).toBe(true);
});

test("test_threshold_hue_ascending_dummy", () => {
	let inputData = new Uint8ClampedArray([
		// 1, 0, 2
		106, 191, 64, 0, 191, 64, 64, 0, 64, 149, 191, 0,
	]);
	let result = hslThresholdConversion(
		inputData,
		3,
		1,
		0,
		255,
		byRedOrHueAscending,
		redOrHueWithinThresholdCheck,
		false
	);

	console.log(result.data);
	expect(
		arraysEqual(
			Array.from(result.data),
			[
				// 0, 1, 2
				191, 64, 64, 0, 106, 191, 64, 0, 64, 149, 191, 0,
			]
		)
	).toBe(true);
});

test("test_to_columns", () => {
	let inputData = new Uint8ClampedArray([
		// row 1
		10, 0, 0, 1, 0, 0, 0, 2, 20, 0, 0, 3,
		// row 2
		20, 0, 0, 4, 0, 0, 0, 5, 10, 0, 0, 6,
		// row 3
		10, 0, 0, 1, 0, 0, 0, 2, 20, 0, 0, 3,
		// row 4
		20, 0, 0, 4, 0, 0, 0, 5, 10, 0, 0, 6,
	]);
	let result = toColumns(inputData, 3, 4);
	expect(
		arraysEqual(
			Array.from(result),
			[
				// row 1
				20, 0, 0, 3, 10, 0, 0, 6, 20, 0, 0, 3, 10, 0, 0, 6,
				// row 2
				0, 0, 0, 2, 0, 0, 0, 5, 0, 0, 0, 2, 0, 0, 0, 5,
				// row 3
				10, 0, 0, 1, 20, 0, 0, 4, 10, 0, 0, 1, 20, 0, 0, 4,
			]
		)
	).toBe(true);
});

test("test_to_rows", () => {
	let inputData = new Uint8ClampedArray([
		20, 0, 0, 3, 10, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 5, 10, 0, 0, 1, 20, 0, 0, 4,
	]);
	let result = columnsToRows(inputData, 2, 3);
	expect(
		arraysEqual(
			Array.from(result),
			[10, 0, 0, 1, 0, 0, 0, 2, 20, 0, 0, 3, 20, 0, 0, 4, 0, 0, 0, 5, 10, 0, 0, 6]
		)
	).toBe(true);
});

test("test masking no thresh", () => {
	let g = 0;
	let a = 0;
	let inputData = new Uint8ClampedArray([
		0, 0, 0, 1, 20, 0, 0, 2, 10, 0, 0, 3, 0, 0, 0, 4, 20, 0, 0, 5, 10, 0, 0, 6,
	]);

	let mask_coords = {
		left: 0,
		top: 1,
		right: 2,
		bottom: 2,
		inverted: false,
	};

	maskNoThresholdData(inputData, 3, 2, byRedOrHueAscending, mask_coords);
	expect(
		arraysEqual(
			Array.from(inputData),
			[0, 0, 0, 1, 10, 0, 0, 3, 20, 0, 0, 2, 0, 0, 0, 4, 20, 0, 0, 5, 10, 0, 0, 6]
		)
	);
});

test("test masking no thresh", () => {
	let g = 0;
	let a = 0;
	let inputData = new Uint8ClampedArray([
		0, 0, 0, 1, 20, 0, 0, 2, 10, 0, 0, 3, 0, 0, 0, 4, 20, 0, 0, 5, 10, 0, 0, 6,
	]);

	let mask_coords = {
		left: 0,
		top: 1,
		right: 3,
		bottom: 3,
		inverted: true,
	};

	maskNoThresholdData(inputData, 3, 2, byRedOrHueAscending, mask_coords);
	expect(
		arraysEqual(
			Array.from(inputData),
			[0, 0, 0, 1, 20, 0, 0, 2, 10, 0, 0, 3, 0, 0, 0, 4, 10, 0, 0, 6, 20, 0, 0, 5]
		)
	);
});

test("to coordinates", () => {
	
})