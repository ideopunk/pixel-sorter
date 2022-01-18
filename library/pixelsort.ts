import { Direction, Pixel, IntervalStyle, SortingStyle, HSLPixel } from "./types";
import * as sorting from "./sortingFunctions";
import * as pixel from "./pixelUtils";

interface Options {
	direction?: Direction;
	sortingStyle: SortingStyle;
	intervalStyle?: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
}

export const workersort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: Options
): ImageData => {
	// HSL??
	if (["hue", "saturation", "light"].includes(options.sortingStyle)) {
		let hslPixels: HSLPixel[] = [];

		for (let i = 0; i < data.length; i += 4) {
			hslPixels.push(pixel.toHSLPixels(data[i], data[i + 1], data[i + 2]));
		}

		let rows = [];

		for (let i = 0; i < height; i++) {
			rows.push(hslPixels.slice(i * width, (i + 1) * width));
		}

		let newArray: HSLPixel[][] = [];
		for (let row of rows) {
			newArray.push(row.sort(sorting.bySaturationAscending));
		}

		let flattenedArray = newArray.flat();

		const clampedArr = Uint8ClampedArray.from(pixel.HSLtoClampArray(flattenedArray));
		const newData = new ImageData(clampedArr, width, height);

		return newData;
	} else {
		// RGB??

		let pixels: Pixel[] = [];

		for (let i = 0; i < data.length; i += 4) {
			pixels.push(pixel.toPixels(data[i], data[i + 1], data[i + 2], data[i + 3]));
		}

		let rows = [];

		for (let i = 0; i < height; i++) {
			rows.push(pixels.slice(i * width, (i + 1) * width));
		}

		let newArray: Pixel[][] = [];
		for (let row of rows) {
			newArray.push(row.sort(sorting.byRGBAscending));
		}

		let flattenedArray = newArray.flat();

		const clampedArr = Uint8ClampedArray.from(pixel.RGBtoClampArray(flattenedArray));
		const newData = new ImageData(clampedArr, width, height);

		return newData;
	}
};
