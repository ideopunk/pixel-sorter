import { idGenerator } from "./pixelUtils";
import { Direction, Pixel, IntervalStyle, SortingStyle } from "./types";
import * as sorting from "./sortingFunctions";

interface Options {
	direction: Direction;
	sortingStyle: SortingStyle;
	intervalStyle: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
}

function toPixels(arr: Uint8ClampedArray) {
	let pixelArray: Pixel[] = [];
	for (let i = 0; i < arr.length; i + 4) {
		pixelArray.push({ r: arr[i], g: arr[i + 1], b: arr[i + 2], a: arr[i + 3] });
	}

	return pixelArray;
}

function toClampArray(pixels: Pixel[]) {
	let spreadArray = pixels.map((pixel) => [pixel.r, pixel.g, pixel.b, pixel.a]);
	let flatArray = spreadArray.flat();
	return Uint8ClampedArray.from(flatArray);
}

export default function pixelsort(
	original: HTMLImageElement,
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	options?: Options
): void {
	ctx?.drawImage(original, 0, 0);

	const imageData = ctx?.getImageData(0, 0, width, height);

	if (!imageData) throw Error("uh");

	// lil single row experiment
	// let pixels = toPixels(imageData.data);

	let newArray = [];
	let data = imageData.data;
	for (let i = 0; i < data.length; i + 4) {
		newArray.push(data[i + 3]);
		newArray.push(data[i + 2]);
		newArray.push(data[i + 1]);
		newArray.push(data[i]);
	}

	const clampedArr = Uint8ClampedArray.from(newArray);

	const newData = new ImageData(clampedArr, width, height);
	ctx.putImageData(newData, 0, 0);
	console.log("complete");
	// const reversed = imageData.data.reverse();
	// const newData = new ImageData(reversed, width, height);
	// ctx?.putImageData(newData, 0, 0); // experiment
}

export const workersort = (
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options?: Options
): ImageData => {
	let pixels: Pixel[] = [];
	for (let i = 0; i < data.length; i += 4) {
		pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
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

	const clampedArr = Uint8ClampedArray.from(toClampArray(flattenedArray));
	const newData = new ImageData(clampedArr, width, height);

	return newData;
};


// export function rgbToHsl(pixel: Pixel) {
// 	let { r, g, b } = pixel;
// 	r = r / 255;
// 	g = g / 255;
// 	b = b / 255;

// 	const max = Math.max(r, g, b);
// 	const min = Math.min(r, g, b);

// 	let h: number;
// 	let s: number;
// 	let l = (max + min) / 2;

// 	if (max == min) {
// 		h = 0;
// 		s = 0;
// 	} else {
// 		const d = max - min;
// 		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
// 		switch (max) {
// 			case r:
// 				h = (g - b) / d + (g < b ? 6 : 0);
// 				break;
// 			case g:
// 				h = (b - r) / d + 2;
// 				break;
// 			case b:
// 				h = (r - g) / d + 4;
// 				break;
// 		}
// 		h = h / 6;
// 	}

// 	return [h, s, l];
// }
