import { HSLPixel, MaskCoordinates, Pixel } from "./types";

// RGB
export function redWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	return pixel.r > min && pixel.r < max;
}

export function greenWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	return pixel.g > min && pixel.g < max;
}
export function blueWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	return pixel.b > min && pixel.b < max;
}
export function alphaWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	return pixel.a > min && pixel.a < max;
}
export function intensityWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	const sum = (pixel.r + pixel.g + pixel.b) / 3;
	return sum > min && sum < max;
}

// HSL
export function hueWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
	return pixel.h > min && pixel.h < max;
}
export function saturationWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
	return pixel.s > min && pixel.s < max;
}
export function lightnessWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
	return pixel.l > min && pixel.l < max;
}

function maskArray(
	matrix: HSLPixel,
	mask: { left: number; top: number; width: number; height: number }
) {}

function maskCoordinates(mask: {
	left: number;
	top: number;
	width: number;
	height: number;
}): MaskCoordinates {
	return {
		left: mask.left,
		top: mask.top,
		right: mask.left + mask.width,
		bottom: mask.top + mask.height,
	};
}
