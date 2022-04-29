import { sortRowWithRandomness, sortRowWithThreshold } from "./intervalFunctions";
import { maskNoThresholdData, maskRandomData, maskThresholdData, rotateCoordinates } from "./mask";
import { columnsToRows, toColumns, sectionSort, rgbPixeltoHslPixel, HSLToRGB } from "./pixelUtils";
import { MaskCoordinates, PixelArray } from "../types";

export function hslNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
): ImageData {
	if (columns) {
		data = toColumns(data, width, height);
	}

	let hslPixels = new Float32Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = rgbPixeltoHslPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);
		maskNoThresholdData(data, width, height, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sectionSort(row, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGB(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
}

export function hslThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	thresholdCheck: (pixel: PixelArray, min: number, max: number) => boolean,
	columns: boolean,
	mask?: MaskCoordinates
): ImageData {
	if (columns) {
		data = toColumns(data, width, height);
	}

	let hslPixels = new Float32Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = rgbPixeltoHslPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);
		maskThresholdData(data, width, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithThreshold(row, min, max, thresholdCheck, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGB(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
}

export function hslRandomConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
): ImageData {
	if (columns) {
		data = toColumns(data, width, height);
	}

	let hslPixels = new Float32Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = rgbPixeltoHslPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskRandomData(data, width, min, max, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithRandomness(row, min, max, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGB(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
}

export function rgbNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskNoThresholdData(data, width, height, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sectionSort(row, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
}

export function rgbThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	thresholdCheck: (pixel: PixelArray, min: number, max: number) => boolean,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskThresholdData(data, width, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithThreshold(row, min, max, thresholdCheck, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
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
	sorter: (a: PixelArray, b: PixelArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskRandomData(data, width, min, max, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithRandomness(row, min, max, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	return new ImageData(data, width, height);
}
