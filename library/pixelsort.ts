import { idGenerator } from "./pixelUtils";
import { Direction, IntervalStyle, SortingStyle } from "./types";

interface Options {
	direction: Direction;
	sortingStyle: SortingStyle;
	intervalStyle: IntervalStyle;
	threshold?: [number, number];
	mask?: { left: number; right: number; top: number; bottom: number };
}
export default function main({ image, options }: { image: string; options: Options }): ImageData {}
