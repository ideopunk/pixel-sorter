import * as group from "./group";
import { maskNoThresholdData, maskRandomData, maskThresholdData, rotateCoordinates } from "./mask";
import {
	rotateClockwise,
	rotateCounterClockwise,
	sectionSort,
	RGBToHSLPixel,
	HSLToRGBPixel,
} from "./pixelUtils";
import { MaskCoordinates, PixelArray } from "../types";

export function hslNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
): ImageData {
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	let hslPixels = new Float64Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = RGBToHSLPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);
		maskNoThresholdData(hslPixels, width, height, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = hslPixels.subarray(previous, previous + internalWidth * 4);
			sectionSort(row, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGBPixel(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
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
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	let hslPixels = new Float64Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = RGBToHSLPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);
		maskThresholdData(hslPixels, width, height, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = hslPixels.subarray(previous, previous + internalWidth * 4);
			group.withThreshold(row, min, max, thresholdCheck, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGBPixel(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
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
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	let hslPixels = new Float64Array(data.length);

	for (let i = 0; i < data.length; i += 4) {
		const hslPixel = RGBToHSLPixel(data.subarray(i, i + 4));
		hslPixels[i] = hslPixel[0];
		hslPixels[i + 1] = hslPixel[1];
		hslPixels[i + 2] = hslPixel[2];
		hslPixels[i + 3] = hslPixel[3];
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskRandomData(hslPixels, width, height, min, max, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = hslPixels.subarray(previous, previous + internalWidth * 4);
			group.withRandomness(row, min, max, sorter);
		}
	}

	for (let i = 0; i < data.length; i += 4) {
		const rgbPixel = HSLToRGBPixel(hslPixels.subarray(i, i + 4));
		data[i] = rgbPixel[0];
		data[i + 1] = rgbPixel[1];
		data[i + 2] = rgbPixel[2];
		data[i + 3] = rgbPixel[3];
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
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
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskNoThresholdData(data, internalWidth, internalHeight, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = data.subarray(previous, previous + internalWidth * 4);
			sectionSort(row, sorter);
		}
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
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
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskThresholdData(data, width, height, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = data.subarray(previous, previous + internalWidth * 4);
			group.withThreshold(row, min, max, thresholdCheck, sorter);
		}
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
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
	let internalWidth = width;
	let internalHeight = height;
	if (columns) {
		data = rotateCounterClockwise(data, width, height);
		internalWidth = height;
		internalHeight = width;
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskRandomData(data, width, height, min, max, sorter, mask);
	} else {
		for (let i = 0; i < internalHeight; i++) {
			const previous = internalWidth * 4 * i;

			const row = data.subarray(previous, previous + internalWidth * 4);
			group.withRandomness(row, min, max, sorter);
		}
	}

	if (columns) {
		data = rotateClockwise(data, height, width);
	}

	return new ImageData(data, width, height);
}
