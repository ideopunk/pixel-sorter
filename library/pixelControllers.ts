import { sortRandomRow, sortRowWithThreshold } from "./intervalFunctions";
import { maskNoThresholdRow, maskThresholdRow, rotateCoordinates } from "./mask";
import {
	columnsToFlatArray,
	HSLtoClampArray,
	RGBtoClampArray,
	toColumns,
	toHSLPixels,
	toPixels,
} from "./pixelUtils";
import { HSLPixel, MaskCoordinates, Pixel } from "./types";

export function hslNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: HSLPixel, b: HSLPixel) => number,
	columns: boolean,
	mask?: MaskCoordinates
): ImageData {
	let hslPixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		hslPixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let nestedData: HSLPixel[][] = [];

	if (columns) {
		nestedData = toColumns(hslPixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(hslPixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: HSLPixel[][] = [];

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		convertedArray = maskNoThresholdRow(nestedData, sortingFunction, mask);
	} else {
		for (let row of nestedData) {
			convertedArray.push(row.sort(sortingFunction));
		}
	}

	let flattenedArray: HSLPixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	return new ImageData(clampedArr, width, height);
}

export function hslThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	thresholdCheck: (pixel: HSLPixel, min: number, max: number) => boolean,
	sorter: (a: HSLPixel, b: HSLPixel) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	let pixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let nestedData: HSLPixel[][] = [];

	if (columns) {
		nestedData = toColumns(pixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(pixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: HSLPixel[][] = [];

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		convertedArray = maskThresholdRow(nestedData, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let row of nestedData) {
			convertedArray.push(sortRowWithThreshold(row, min, max, thresholdCheck, sorter));
		}
	}

	let flattenedArray: HSLPixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	return new ImageData(clampedArr, width, height);
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
	sorter: (a: HSLPixel, b: HSLPixel) => number,
	columns: boolean
) {
	let pixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let nestedData: HSLPixel[][] = [];

	if (columns) {
		nestedData = toColumns(pixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(pixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: HSLPixel[][] = [];
	for (let row of nestedData) {
		convertedArray.push(sortRandomRow(row, min, max, sorter));
	}

	let flattenedArray: HSLPixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
}

export function rgbNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: Pixel, b: Pixel) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let nestedData: Pixel[][] = [];

	if (columns) {
		nestedData = toColumns(pixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(pixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: Pixel[][] = [];

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		convertedArray = maskNoThresholdRow(nestedData, sortingFunction, mask);
	} else {
		for (let row of nestedData) {
			convertedArray.push(row.sort(sortingFunction));
		}
	}

	let flattenedArray: Pixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}

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
	sorter: (a: Pixel, b: Pixel) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let nestedData: Pixel[][] = [];

	if (columns) {
		nestedData = toColumns(pixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(pixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: Pixel[][] = [];

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		convertedArray = maskThresholdRow(nestedData, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let row of nestedData) {
			convertedArray.push(sortRowWithThreshold(row, min, max, thresholdCheck, sorter));
		}
	}

	let flattenedArray: Pixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}

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
	sorter: (a: Pixel, b: Pixel) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	let pixels: Pixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		pixels.push(toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
	}

	let nestedData: Pixel[][] = [];

	if (columns) {
		nestedData = toColumns(pixels, width, height);
	} else {
		for (let i = 0; i < height; i++) {
			nestedData.push(pixels.slice(i * width, (i + 1) * width));
		}
	}

	let convertedArray: Pixel[][] = [];

	for (let row of nestedData) {
		convertedArray.push(row.sort(sorter));
	}

	for (let row of nestedData) {
		convertedArray.push(sortRandomRow(row, min, max, sorter));
	}

	let flattenedArray: Pixel[] = [];
	if (columns) {
		flattenedArray = columnsToFlatArray(convertedArray);
	} else {
		flattenedArray = convertedArray.flat();
	}
	const clampedArr = Uint8ClampedArray.from(RGBtoClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);
	return newData;
}
