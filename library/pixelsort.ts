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
	ctx?.drawImage(original, 0, 0);

	const imageData = ctx?.getImageData(0, 0, width, height);

	if (!imageData) throw Error("uh");

	// lil row experiment
	const reversed = imageData.data.reverse();
	const newData = new ImageData(reversed, width, height);
	ctx?.putImageData(newData, 0, 0); // experiment
}
