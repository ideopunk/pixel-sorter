import { HSLPixel, Pixel } from "./types";
import * as sort from "./sortingFunctions";
import {
	sortHSLRowWithThreshold,
	sortRGBRowWithThreshold,
	sortHSLRowRandomly,
	sortRGBRowRandomly,
} from "./intervalFunctions";

export function RGBtoClampArray(pixels: Pixel[]) {
	let spreadArray = pixels.map((pixel) => [pixel.r, pixel.g, pixel.b, pixel.a]);
	let flatArray = spreadArray.flat();
	return Uint8ClampedArray.from(flatArray);
}

export function HSLtoClampArray(pixels: HSLPixel[]) {
	let spreadArray = pixels.map((pixel) => HSLToRGB(pixel.h, pixel.s, pixel.l));
	let flatArray = spreadArray.flat();
	return Uint8ClampedArray.from(flatArray);
}

export function HSLToRGB(h: number, s: number, l: number) {
	// Must be fractions of 1
	s /= 100;
	l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
		m = l - c / 2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b, 255];
}

export function toPixels(r: number, g: number, b: number, a: number): Pixel {
	return { r, g, b, a };
}

export const toHSLPixels = (r: number, g: number, b: number): HSLPixel => {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

	return {
		h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
		s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
		l: (100 * (2 * l - s)) / 2,
	};
};

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

	let rows = [];

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

	let rows = [];

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
