import { PixelArray } from "../types";

// ASCENDING
export function byRedOrHueAscending(a: PixelArray, b: PixelArray) {
	return a[0] - b[0];
}

export function byGreenOrSaturationAscending(a: PixelArray, b: PixelArray) {
	return a[1] - b[1];
}

export function byBlueOrLightnessAscending(a: PixelArray, b: PixelArray) {
	return a[2] - b[2];
}

export function byAlphaAscending(a: PixelArray, b: PixelArray) {
	return a[3] - b[3];
}

export function byRGBAscending(a: PixelArray, b: PixelArray) {
	const sumA = a[0] + a[1] + a[2];
	const sumB = b[0] + b[1] + b[2];
	return sumA - sumB;
}


// DESCENDING
export function byRedOrHueDescending(a: PixelArray, b: PixelArray) {
	return b[0] - a[0];
}

export function byGreenOrSaturationDescending(a: PixelArray, b: PixelArray) {
	return b[1] - a[1];
}

export function byBlueOrLightnessDescending(a: PixelArray, b: PixelArray) {
	return b[2] - a[2];
}

export function byAlphaDescending(a: PixelArray, b: PixelArray) {
	return b[0] - a[0];
}

export function byRGBDescending(a: PixelArray, b: PixelArray) {
	const sumA = a[0] + a[1] + a[2];
	const sumB = b[0] + b[1] + b[2];
	return sumB - sumA;
}
