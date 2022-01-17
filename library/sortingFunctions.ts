import { Pixel } from "./types";

export function byRedAscending(a: Pixel, b: Pixel) {
	return a.r - b.r;
}

export function byGreenAscending(a: Pixel, b: Pixel) {
	return a.g - b.g;
}

export function byBlueAscending(a: Pixel, b: Pixel) {
	return a.b - b.b;
}

export function byAlphaAscending(a: Pixel, b: Pixel) {
	return a.a - b.a;
}

export function byRGBAscending(a: Pixel, b: Pixel) {
	const sumA = a.r + a.g + a.b;
	const sumB = b.r + b.g + b.b;
	return sumA - sumB;
}

export function byHue(a: Pixel, b: Pixel) {}

export function bySaturation(a: Pixel, b: Pixel) {}

export function byLight(a: Pixel, b: Pixel) {}

