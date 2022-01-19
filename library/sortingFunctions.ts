import { HSLPixel, Pixel } from "./types";

// ASCENDING
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

export function byHueAscending(a: HSLPixel, b: HSLPixel) {
	return a.h - b.h;
}

export function bySaturationAscending(a: HSLPixel, b: HSLPixel) {
	return a.s - b.s;
}

export function byLightAscending(a: HSLPixel, b: HSLPixel) {
	return a.l - b.l;
}

// DESCENDING
export function byRedDescending(a: Pixel, b: Pixel) {
	return b.r - a.r;
}

export function byGreenDescending(a: Pixel, b: Pixel) {
	return b.g - a.g;
}

export function byBlueDescending(a: Pixel, b: Pixel) {
	return b.b - a.b;
}

export function byAlphaDescending(a: Pixel, b: Pixel) {
	return b.a - a.a;
}

export function byRGBDescending(a: Pixel, b: Pixel) {
	const sumA = a.r + a.g + a.b;
	const sumB = b.r + b.g + b.b;
	return sumB - sumA;
}

export function byHueDescending(a: HSLPixel, b: HSLPixel) {
	return b.h - a.h;
}

export function bySaturationDescending(a: HSLPixel, b: HSLPixel) {
	return b.s - a.s;
}

export function byLightDescending(a: HSLPixel, b: HSLPixel) {
	return b.l - a.l;
}
