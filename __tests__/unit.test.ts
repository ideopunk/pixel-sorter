import {
	columnsToRows,
	HSLToRGB,
	sectionSort,
	toColumns,
} from "../library/pixelsorting/pixelUtils";
import { maskNoThresholdData, rotateCoordinates } from "../library/pixelsorting/mask";
import { MaskCoordinates } from "../library/types";
import {
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
	console.log(inputData);
	expect(arraysEqual(Array.from(inputData), [10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0])).toBe(true);
});

test("threshold row something", () => {
	let inputData = new Uint8ClampedArray([20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0]);
	sortRowWithThreshold(inputData, 5, 30, redOrHueWithinThresholdCheck, byRedOrHueAscending);
	console.log(inputData);
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
		redOrHueWithinThresholdCheck,
		byRedOrHueAscending,
		false
	);
	console.log(result.data);
	expect(
		arraysEqual(
			Array.from(result.data),
			[10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0]
		)
	).toBe(true);
});

// #[test]
// fn test_pixel_to_hsl() {
//     let result = to_hsl_pixel(191, 64, 64, 0);
//     let satch_delta = (result.s - 49.8).abs();
//     assert_eq!(true, satch_delta < 0.15);

//     let light_delta = (result.l - 50.0).abs();
//     assert_eq!(true, light_delta < 0.15)
// }

// #[test]
// fn test_hsl_to_pixel() {
//     let hsl = HSLPixel {
//         h: 0.0,
//         s: 49.8,
//         l: 50.0,
//         a: 0.0,
//     };
//     // something is fcked here conor
//     let result = hsl_to_u8s(hsl.h, hsl.s, hsl.l, hsl.a);

//     assert_eq!(result[0], 191);
//     assert_eq!(result[1], 64);
//     assert_eq!(result[2], 64);
//     assert_eq!(result[3], 0);
// }

// #[test]
// fn test_no_threshold_hue_descending() {
//     let inputData = vec![
//         106, 191, 64, 0, // 1
//         191, 64, 64, 0, // 0
//         64, 149, 191, 0, // 2
//         64, 149, 191, 0, // 2
//         106, 191, 64, 0, // 1
//         191, 64, 64, 0, // 0
//     ];
//     let result = hsl_no_threshold_conversion(inputData, 3, 2, by_hue_descending, false, None);
//     assert_eq!(
//         result,
//         vec![
//             64, 149, 191, 0, // 2
//             106, 191, 64, 0, // 1
//             191, 64, 64, 0, // 0
//             64, 149, 191, 0, // 2
//             106, 191, 64, 0, // 1
//             191, 64, 64, 0, // 0
//         ]
//     )
// }

// #[test]
// fn test_threshold_hue_ascending_dummy() {
//     let inputData = vec![
//         106, 191, 64, 0, // 1
//         191, 64, 64, 0, // 0
//         64, 149, 191, 0, // 2
//     ];
//     let result = hsl_threshold_conversion(
//         inputData,
//         3,
//         1,
//         0,
//         255,
//         hue_within_threshold_check,
//         by_hue_ascending,
//         false,
//         None,
//     );
//     assert_eq!(
//         result,
//         vec![
//             191, 64, 64, 0, // 0
//             106, 191, 64, 0, // 1
//             64, 149, 191, 0, // 2
//         ] // uhhh
//     )
// }

test("test_to_columns", () => {
	let inputData = new Uint8ClampedArray([
		10, 0, 0, 1, 0, 0, 0, 2, 20, 0, 0, 3, 20, 0, 0, 4, 0, 0, 0, 5, 10, 0, 0, 6,
	]);
	let result = toColumns(inputData, 3, 2);
	console.log(result);
	expect(
		arraysEqual(
			Array.from(result),
			[20, 0, 0, 3, 10, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 5, 10, 0, 0, 1, 20, 0, 0, 4]
		)
	).toBe(true);
});

test("test_to_rows", () => {
	let inputData = new Uint8ClampedArray([
		20, 0, 0, 3, 10, 0, 0, 6, 0, 0, 0, 2, 0, 0, 0, 5, 10, 0, 0, 1, 20, 0, 0, 4,
	]);
	let result = columnsToRows(inputData, 2, 3);
	console.log(result);
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
