import { idGenerator } from "./pixelUtils";
import { Direction, IntervalStyle, SortingStyle } from "./types";

interface Options {
	direction: Direction;
	sortingStyle: SortingStyle;
	intervalStyle: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
}

// 4 index

export default function pixelsort(
	original: HTMLImageElement,
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	options?: Options
): void {
	// write our original image to a canvas so we can manipulate it
	ctx?.drawImage(original, 0, 0);

	// const { width, height } = canvas;
	const imageData = ctx?.getImageData(0, 0, width, height);

	if (!imageData) throw Error("uh");

	let newCanvas = new HTMLCanvasElement();
	let rows: Uint8ClampedArray[] = [];
	for (let i = 0; i < height; i++) {
		rows.push(imageData?.data.slice(i, width * i + width));
	}

	// let fakeData = [];
	// for (let i = 0; i < rows.length; i++) {
	// 	fakeData.push(rows[i]);
	// }
	// let fakeClamp = new Uint8ClampedArray(fakeData);
	// let fake = new ImageData(fakeData, width, height);

	let x = 0;
	for (let row of rows) {
		ctx?.putImageData({ data: row, height, width }, 0, x);
		x++;
	}
}
