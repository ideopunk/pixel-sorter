import { PixelArray } from "../types";
import { getRandomInt } from "../genericUtils";
import { sectionSort } from "./pixelUtils";

/**
 * Chunk sections randomly. Sort chunks.
 */
export function withRandomness(
	row: PixelArray,
	min: number,
	max: number,
	sorter: (a: PixelArray, b: PixelArray) => number
) {
	let sortableRange = Boolean(getRandomInt(0, 1));

	let count = getRandomInt(min, max) * 4;

	let matchcount = 0;

	for (let i = 0; i < row.length / 4; i++) {
		// finish run and start new one
		if (matchcount == count) {
			if (sortableRange) {
				const section = row.subarray(i * 4 - count, i * 4);
				sectionSort(section, sorter);
			}

			sortableRange = !sortableRange;
			matchcount = 0;
			count = getRandomInt(min, max) * 4; // gotta be sure this doesn't return the same thing as line 21 count.
		}

		matchcount += 4;
	}
}

/**
 * Chunk sections via thresholdCheck criteria. Sort chunks.
 */
export function withThreshold(
	row: PixelArray,
	min: number,
	max: number,
	thresholdCheck: (pixel: PixelArray, min: number, max: number) => boolean,
	sorter: (a: PixelArray, b: PixelArray) => number
) {
	let onRun = false;
	let currentMin = 0;

	let length = row.length / 4;
	for (let i = 0; i < length; i++) {
		const sub = row.subarray(i * 4, i * 4 + 4);
		let latestPixelWithin = thresholdCheck(sub, min, max);
		if (latestPixelWithin && !onRun) {
			// start a new run
			currentMin = i;
			onRun = true;
		} else if (!latestPixelWithin && onRun) {
			// finish a run
			const section = row.subarray(currentMin * 4, i * 4);
			sectionSort(section, sorter);
			currentMin = 0;
			onRun = false;
		}
	}

	// to catch the final run.
	if (onRun) {
		const section = row.subarray(currentMin * 4, length * 4);
		sectionSort(section, sorter);
	}
}
