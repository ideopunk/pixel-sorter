import { sortRowWithRandomness, sortRowWithThreshold } from "./intervalFunctions";
import { MaskCoordinates, PixelArray } from "../types";
import { sectionSort } from "./pixelUtils";

export function toCoordinates(
	mask: {
		x: number;
		y: number;
		width: number;
		height: number;
	},
	inverted: boolean | undefined,
	width: number,
	height: number
): MaskCoordinates {
	const left = mask.x >= 0 ? mask.x : 0;
	const top = mask.y >= 0 ? mask.y : 0;

	const preright = mask.x + mask.width;
	const right = preright > width ? width : preright;

	const prebottom = mask.y + mask.height;
	const bottom = prebottom > height ? height : prebottom;

	const coordinates = {
		left,
		top,
		right,
		bottom,
		inverted: Boolean(inverted),
	};

	return coordinates;
}

export function rotateCoordinates(
	mask: MaskCoordinates,
	width: number,
	height: number
): MaskCoordinates {
	return {
		left: mask.top,
		right: mask.bottom,
		bottom: width - 1 - mask.left,
		top: width - 1 - mask.right,
		inverted: mask.inverted,
	};
}

export function maskNoThresholdData(
	data: PixelArray,
	width: number,
	height: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	if (mask.inverted) {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			const section = data.subarray(previous + left * 4, previous + right * 4);
			sectionSort(section, sorter);
		}
	} else {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			const leftSection = data.subarray(previous, previous + left * 4);
			sectionSort(leftSection, sorter);

			const rightSection = data.subarray(previous + right * 4, previous + width * 4);
			sectionSort(rightSection, sorter);
		}
	}

	// return convertedArray;
}

export function maskThresholdData(
	data: PixelArray,
	width: number,
	min: number,
	max: number,
	thresholdCheck: (pixel: PixelArray, min: number, max: number) => boolean,
	sorter: (a: PixelArray, b: PixelArray) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	if (mask.inverted) {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			sortRowWithThreshold(
				data.subarray(previous + left * 4, previous + right * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);
		}
	} else {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			sortRowWithThreshold(
				data.subarray(previous, previous + left * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);

			sortRowWithThreshold(
				data.subarray(previous + right * 4, previous + width * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);
		}
	}
}

export function maskRandomData(
	data: PixelArray,
	width: number,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	if (mask.inverted) {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			sortRowWithRandomness(
				data.subarray(previous + left * 4, previous + right * 4),
				min,
				max,
				sorter
			);
		}
	} else {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			sortRowWithRandomness(data.subarray(previous, previous + left * 4), min, max, sorter);

			sortRowWithRandomness(
				data.subarray(previous + right * 4, previous + width * 4),
				min,
				max,
				sorter
			);
		}
	}
}
