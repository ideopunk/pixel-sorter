import {
	sortHSLRowRandomly,
	sortHSLRowWithThreshold,
	sortRGBRowRandomly,
	sortRGBRowWithThreshold,
} from "./intervalFunctions";
import { HSLtoClampArray, RGBtoClampArray, toHSLPixels, toPixels } from "./pixelUtils";
import { HSLPixel, Pixel } from "./types";

export function columnTest(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
): ImageData {
	let hslPixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		hslPixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let columns: HSLPixel[][] = [];
	for (let i = 0; i < width; i++) {
		columns.push([]);
		for (let j = 0; j < height; j++) {
			columns[i].push(hslPixels[j * width + i]);
		}
	}

	// let tempNewArray: HSLPixel[][] = [];
	// for (let column of columns) {
	// 	tempNewArray.push(column.sort(sortingFunction));
	// }

	// let tempRows: HSLPixel[][] = [];
	// for (let i = 0; i < width; i++) {
	// 	tempRows.push([]);
	// 	for (let j = 0; j < height; j++) {
	// 		tempRows[i].push(hslPixels[j * width + i]);
	// 	}
	// }

	const tempFlattenedArray = columns.flat();
	const tempArr = Uint8ClampedArray.from(HSLtoClampArray(tempFlattenedArray));
	return new ImageData(tempArr, height, width);
}

export function hslNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
): ImageData {
	let hslPixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		hslPixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let rows: HSLPixel[][] = [];
	for (let i = 0; i < height; i++) {
		rows.push(hslPixels.slice(i * width, (i + 1) * width));
	}

	let newArray: HSLPixel[][] = [];
	for (let row of rows) {
		newArray.push(row.sort(sortingFunction));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}

export function hslThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	thresholdCheck: (pixel: HSLPixel, min: number, max: number) => boolean,
	sorter: (a: HSLPixel, b: HSLPixel) => number
) {
	let pixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(pixels.slice(i * width, (i + 1) * width));
	}

	let newArray: HSLPixel[][] = [];
	for (let row of rows) {
		newArray.push(sortHSLRowWithThreshold(row, min, max, thresholdCheck, sorter));
		// newArray.push(sortRowWithThreshold(row, min, max));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}

export function rgbNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: Pixel, b: Pixel) => number
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let rows: Pixel[][] = [];

	for (let i = 0; i < height; i++) {
		rows.push(pixels.slice(i * width, (i + 1) * width));
	}

	let newArray: Pixel[][] = [];
	for (let row of rows) {
		newArray.push(row.sort(sortingFunction));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(RGBtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}

export function rgbThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	thresholdCheck: (pixel: Pixel, min: number, max: number) => boolean,
	sorter: (a: Pixel, b: Pixel) => number
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(pixels.slice(i * width, (i + 1) * width));
	}

	let newArray: Pixel[][] = [];
	for (let row of rows) {
		newArray.push(sortRGBRowWithThreshold(row, min, max, thresholdCheck, sorter));
		// newArray.push(sortRowWithThreshold(row, min, max));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(RGBtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}

/**
 *
 * @param data
 * @param width
 * @param height
 * @param min The minimum acceptable random value for an interval range
 * @param max The maximum (exclusive) acceptable random value for an interval range
 * @param sorter
 * @returns
 */
export function rgbRandomConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: Pixel, b: Pixel) => number
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(pixels.slice(i * width, (i + 1) * width));
	}

	let newArray: Pixel[][] = [];
	for (let row of rows) {
		newArray.push(sortRGBRowRandomly(row, min, max, sorter));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(RGBtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);
	// throw new Error(JSON.stringify({ height: newData.height, width: newData.height }));
	return newData;
}

/**
 *
 * @param data
 * @param width
 * @param height
 * @param min The minimum acceptable random value for an interval range
 * @param max The maximum (exclusive) acceptable random value for an interval range
 * @param sorter
 * @returns
 */
export function hslRandomConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: HSLPixel, b: HSLPixel) => number
) {
	let pixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let rows = [];

	for (let i = 0; i < height; i++) {
		rows.push(pixels.slice(i * width, (i + 1) * width));
	}

	let newArray: HSLPixel[][] = [];
	for (let row of rows) {
		newArray.push(sortHSLRowRandomly(row, min, max, sorter));
	}

	let flattenedArray = newArray.flat();

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}
