import { PixelArray } from "../types";

export function redOrHue(pixel: PixelArray, min: number, max: number) {
	return pixel[0] >= min && pixel[0] < max;
}

export function greenOrSaturation(pixel: PixelArray, min: number, max: number) {
	return pixel[1] >= min && pixel[1] < max;
}
export function blueOrLightness(pixel: PixelArray, min: number, max: number) {
	return pixel[2] >= min && pixel[2] < max;
}
export function alpha(pixel: PixelArray, min: number, max: number) {
	return pixel[3] >= min && pixel[3] < max;
}

// for use with rgb only
export function intensity(pixel: PixelArray, min: number, max: number) {
	const sum = (pixel[0] + pixel[1] + pixel[2]) / 3;
	return sum >= min && sum < max;
}
