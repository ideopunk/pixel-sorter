import { sortRandomRow, sortRowWithThreshold } from "./intervalFunctions";
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
	columns: boolean
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
	for (let row of nestedData) {
		convertedArray.push(row.sort(sortingFunction));
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
		convertedArray.push(sortRowWithThreshold(row, min, max, thresholdCheck, sorter));
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
	columns: boolean
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
		convertedArray.push(row.sort(sortingFunction));
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
	columns: boolean
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
		convertedArray.push(sortRowWithThreshold(row, min, max, thresholdCheck, sorter));
		// newArray.push(sortRowWithThreshold(row, min, max));
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
	columns: boolean
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
	// throw new Error(JSON.stringify({ height: newData.height, width: newData.height }));
	return newData;
}

export function maskTestConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sortingFunction: (a: HSLPixel, b: HSLPixel) => number,
	mask?: MaskCoordinates
): ImageData {
	console.log(mask);
	let hslPixels: HSLPixel[] = [];

	for (let i = 0; i < data.length; i += 4) {
		hslPixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
	}

	let nestedData: HSLPixel[][] = [];

	for (let i = 0; i < height; i++) {
		nestedData.push(hslPixels.slice(i * width, (i + 1) * width));
	}

	let convertedArray: HSLPixel[][] = [];

	if (!!mask) {
		const { top, bottom, left, right } = mask;
		for (let i = 0; i < nestedData.length; i++) {
			if (i >= top && i <= bottom) {
				const convertedLeft = nestedData[i].slice(0, left).sort(sortingFunction);
				const untouchedMid = nestedData[i].slice(left, right);
				const convertedRight = nestedData[i].slice(right).sort(sortingFunction);
				untouchedMid.push(...convertedRight);
				convertedLeft.push(...untouchedMid);
				convertedArray.push(convertedLeft);
			} else {
				convertedArray.push(nestedData[i].sort(sortingFunction));
			}
		}
	} else {
		for (let i = 0; i < nestedData.length; i++) {
			convertedArray.push(nestedData[i].sort(sortingFunction));
		}
	}

	let flattenedArray: HSLPixel[] = [];

	flattenedArray = convertedArray.flat();

	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
	return new ImageData(clampedArr, width, height);
}
