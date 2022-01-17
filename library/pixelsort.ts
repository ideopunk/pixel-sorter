import { idGenerator } from "./pixelUtils";
import { Direction, IntervalStyle, SortingStyle } from "./types";

interface Options {
	direction: Direction;
	sortingStyle: SortingStyle;
	intervalStyle: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
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
	let newArray = [];
	for (let i = 0; i < data.length; i += 4) {
		newArray.push(data[i + 3]);
		newArray.push(data[i + 2]);
		newArray.push(data[i + 1]);
		newArray.push(data[i]);
	}

	const clampedArr = Uint8ClampedArray.from(newArray);

	const newData = new ImageData(clampedArr, width, height);
	return newData;
};
