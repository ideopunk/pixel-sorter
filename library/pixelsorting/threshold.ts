import { HSLPixel, MaskCoordinates, Pixel } from "../types";

// RGB
export function redOrHueWithinThresholdCheck(pixel: Uint8ClampedArray, min: number, max: number) {
	console.log(pixel[0], min, max)
	return pixel[0] >= min && pixel[0] < max;
}

export function greenOrSaturationWithinThresholdCheck(pixel: Uint8ClampedArray, min: number, max: number) {
	return pixel[1] >= min && pixel[1] < max;
}
export function blueOrLightnessWithinThresholdCheck(pixel: Uint8ClampedArray, min: number, max: number) {
	return pixel[2] >= min && pixel[2] < max;
}
export function alphaWithinThresholdCheck(pixel: Uint8ClampedArray, min: number, max: number) {
	return pixel[3] >= min && pixel[3] < max;
}

// for use with rgb only
export function intensityWithinThresholdCheck(pixel: Uint8ClampedArray, min: number, max: number) {
	const sum = (pixel[0] + pixel[1] + pixel[2]) / 3;
	return sum >= min && sum < max;
}

// // HSL
// export function hueWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
// 	return pixel.h > min && pixel.h < max;
// }
// export function saturationWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
// 	return pixel.s > min && pixel.s < max;
// }
// export function lightnessWithinThresholdCheck(pixel: HSLPixel, min: number, max: number) {
// 	return pixel.l > min && pixel.l < max;
// }
