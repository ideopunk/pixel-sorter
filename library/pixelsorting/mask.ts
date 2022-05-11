import * as group from "./group";
import { MaskCoordinates, PixelArray } from "../types";
import { sectionSort } from "./pixelUtils";

/**
 * Convert mask x, y, width, and height values into top, left, bottom, and right coordinates.
 */
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
		left: Math.round(left),
		top: Math.round(top),
		right: Math.round(right),
		bottom: Math.round(bottom),
		inverted: Boolean(inverted),
	};

	return coordinates;
}

/**
 * Rotate mask coordinates counter-clockwise to match image.
 */
export function rotateCoordinates(mask: MaskCoordinates, width: number): MaskCoordinates {
	return {
		left: mask.top,
		right: mask.bottom,
		bottom: width - 1 - mask.left,
		top: width - 1 - mask.right,
		inverted: mask.inverted,
	};
}

/**
 * If inverted, glitch pixels inside the mask coordinates. If regular, glitch pixels outside the mask coordinates.
 * @param data image
 * @param width image width in pixels
 * @param height image height in pixels
 * @param sorter sorting function
 * @param mask Coordinates for mask and inversion boolean
 */
export function maskNoThresholdData(
	data: PixelArray,
	width: number,
	height: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	if (mask.inverted) {
		console.log(top, bottom);

		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			const section = data.subarray(previous + left * 4, previous + right * 4);
			sectionSort(section, sorter);
		}
	} else {
		for (let i = 0; i < top; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sectionSort(row, sorter);
		}

		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			const leftSection = data.subarray(previous, previous + left * 4);
			sectionSort(leftSection, sorter);

			const rightSection = data.subarray(previous + right * 4, previous + width * 4);
			sectionSort(rightSection, sorter);
		}

		for (let i = bottom; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sectionSort(row, sorter);
		}
	}

	// return convertedArray;
}

export function maskThresholdData(
	data: PixelArray,
	width: number,
	height: number,
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

			group.withThreshold(
				data.subarray(previous + left * 4, previous + right * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);
		}
	} else {
		// above
		for (let i = 0; i < top; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			group.withThreshold(row, min, max, thresholdCheck, sorter);
		}

		// to the sides

		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			group.withThreshold(
				data.subarray(previous, previous + left * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);

			group.withThreshold(
				data.subarray(previous + right * 4, previous + width * 4),
				min,
				max,
				thresholdCheck,
				sorter
			);
		}

		for (let i = bottom; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			group.withThreshold(row, min, max, thresholdCheck, sorter);
		}
	}
}

/**
 * If inverted, glitch pixels inside the mask coordinates. If regular, glitch pixels outside the mask coordinates.
 * @param data image
 * @param width image width in pixels
 * @param height image height in pixels
 * @param min minimum random value
 * @param max maximum random value
 * @param sorter sorting function
 * @param mask Coordinates for mask and inversion boolean
 */
export function maskRandomData(
	data: PixelArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	if (mask.inverted) {
		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			group.withRandomness(
				data.subarray(previous + left * 4, previous + right * 4),
				min,
				max,
				sorter
			);
		}
	} else {
		for (let i = 0; i < top; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			group.withRandomness(row, min, max, sorter);
		}

		for (let i = top; i < bottom; i++) {
			const previous = width * 4 * i;

			group.withRandomness(data.subarray(previous, previous + left * 4), min, max, sorter);

			group.withRandomness(
				data.subarray(previous + right * 4, previous + width * 4),
				min,
				max,
				sorter
			);
		}

		for (let i = bottom; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			group.withRandomness(row, min, max, sorter);
		}
	}
}
