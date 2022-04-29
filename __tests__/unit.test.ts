import { HSLToRGB, sectionSort, toColumns } from "../library/pixelsorting/pixelUtils";
import { rotateCoordinates } from "../library/pixelsorting/mask";
import { HSLPixel, MaskCoordinates, Pixel } from "../library/types";
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

// describe("convert to columns", () => {
// 	test("yeah", () => {
// 		const matrix: Pixel[] = [
// 			{ r: 255, g: 0, b: 0, a: 0 },
// 			{ r: 255, g: 0, b: 0, a: 0 },
// 			{ r: 255, g: 0, b: 0, a: 0 },
// 			{ r: 0, g: 255, b: 0, a: 0 },
// 			{ r: 0, g: 255, b: 0, a: 0 },
// 			{ r: 0, g: 255, b: 0, a: 0 },
// 		];

// 		const columns = toColumns(matrix, 3, 2);

// 		console.log(columns);
// 		expect(columns[0].length).toBe(2);
// 		expect(columns.length).toBe(3);
// 		expect(columns).toStrictEqual([
// 			[
// 				{ r: 255, g: 0, b: 0, a: 0 },
// 				{ r: 0, g: 255, b: 0, a: 0 },
// 			],
// 			[
// 				{ r: 255, g: 0, b: 0, a: 0 },
// 				{ r: 0, g: 255, b: 0, a: 0 },
// 			],
// 			[
// 				{ r: 255, g: 0, b: 0, a: 0 },
// 				{ r: 0, g: 255, b: 0, a: 0 },
// 			],
// 		]);
// 	});
// });

// describe("rotate mask to suit columns", () => {
// 	test("yeah", () => {
// 		const width = 3;
// 		const height = 2;
// 		const mask: MaskCoordinates = { top: 0, bottom: 1, left: 0, right: 1 };

// 		const rotated = rotateCoordinates(mask, width, height);

// 		expect(rotated).toStrictEqual({ top: 1, bottom: 2, left: 0, right: 1 });
// 	});
// });

// describe("hsl to pix", () => {
// 	test("does this even work properly in ts?", () => {
// 		let result = HSLToRGB(0, 49.8, 50, 0);
// 		console.log(result);

// 		expect(result[0]).toBe(191);
// 		expect(result[1]).toBe(64);
// 		expect(result[2]).toBe(64);
// 		expect(result[3]).toBe(0);
// 	});
// });

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
// fn test_threshold_red_ascending() {
//     let inputData = vec![
//         10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0,
//     ];
//     let result = rgb_threshold_conversion(
//         inputData,
//         6,
//         1,
//         5,
//         30,
//         red_within_threshold_check,
//         by_red_ascending,
//         false,
//         None,
//     );
//     assert_eq!(
//         result,
//         vec![10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0,]
//     )
// }

// #[test]
// fn test_no_threshold_blue_descending() {
//     let inputData = vec![
//         0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0,
//     ];
//     let result = rgb_no_threshold_conversion(inputData, 3, 2, by_blue_ascending, false, None);
//     assert_eq!(
//         result,
//         vec![0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 20, 0]
//     )
// }

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

// #[test]
// fn test_to_columns() {
//     let g = 0;
//     let a = 0;
//     let inputData = vec![
//         RGBPixel { r: 10, g, b: 1, a },
//         RGBPixel { r: 0, g, b: 2, a },
//         RGBPixel { r: 20, g, b: 3, a },
//         RGBPixel { r: 20, g, b: 4, a },
//         RGBPixel { r: 0, g, b: 5, a },
//         RGBPixel { r: 10, g, b: 6, a },
//     ];
//     let result = to_columns_rgb(inputData, 3, 2);

//     assert_eq!(result[0].b, 3);
//     assert_eq!(result[1].b, 6);
//     assert_eq!(result[2].b, 2);
//     assert_eq!(result[3].b, 5);
//     assert_eq!(result[4].b, 1);
//     assert_eq!(result[5].b, 4);
// }

// #[test]
// fn test_to_rows() {
//     let r = 0;
//     let g = 0;
//     let a = 0;
//     let inputData = vec![
//         RGBPixel { r, g, b: 1, a },
//         RGBPixel { r, g, b: 2, a },
//         RGBPixel { r, g, b: 3, a },
//         RGBPixel { r, g, b: 4, a },
//         RGBPixel { r, g, b: 5, a },
//         RGBPixel { r, g, b: 6, a },
//     ];
//     let result = to_rows_rgb(inputData, 2, 3); // hoping thisll output width 3 height 2

//     assert_eq!(result[0].b, 5);
//     assert_eq!(result[1].b, 3);
//     assert_eq!(result[2].b, 1);
//     assert_eq!(result[3].b, 6);
//     assert_eq!(result[4].b, 4);
//     assert_eq!(result[5].b, 2);
// }

// #[test]
// fn test_masking_no_thresh() {
//     let g = 0;
//     let a = 0;
//     let inputData = vec![
//         RGBPixel { r: 0, g, b: 1, a },
//         RGBPixel { r: 20, g, b: 2, a },
//         RGBPixel { r: 10, g, b: 3, a },
//         RGBPixel { r: 0, g, b: 4, a },
//         RGBPixel { r: 20, g, b: 5, a },
//         RGBPixel { r: 10, g, b: 6, a },
//     ];

//     let mask_coords = MaskCoordinates {
//         left: 0,
//         top: 1,
//         right: 2,
//         bottom: 2,
//         inverted: false,
//     };

//     let result = mask_no_threshold_data(inputData, 3, by_red_ascending, mask_coords);

//     assert_eq!(result[0].b, 1);
//     assert_eq!(result[1].b, 3);
//     assert_eq!(result[2].b, 2);
//     assert_eq!(result[3].b, 4);
//     assert_eq!(result[4].b, 5);
//     assert_eq!(result[5].b, 6);
// }

// #[test]
// fn test_masking_no_thresh_inverted() {
//     let g = 0;
//     let a = 0;
//     let inputData = vec![
//         RGBPixel { r: 0, g, b: 1, a },
//         RGBPixel { r: 20, g, b: 2, a },
//         RGBPixel { r: 10, g, b: 3, a },
//         RGBPixel { r: 0, g, b: 4, a },
//         RGBPixel { r: 20, g, b: 5, a },
//         RGBPixel { r: 10, g, b: 6, a },
//     ];

//     let mask_coords = MaskCoordinates {
//         left: 0,
//         top: 1,
//         right: 3,
//         bottom: 3,
//         inverted: true,
//     };

//     let result = mask_no_threshold_data(inputData, 3, by_red_ascending, mask_coords);

//     assert_eq!(result[0].b, 1);
//     assert_eq!(result[1].b, 2);
//     assert_eq!(result[2].b, 3);
//     assert_eq!(result[3].b, 4);
//     assert_eq!(result[4].b, 6);
//     assert_eq!(result[5].b, 5);
//
