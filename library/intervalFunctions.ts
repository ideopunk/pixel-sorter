import { HSLPixel, MaskCoordinates, Pixel } from "./types";
import * as threshold from "./thresholdFunctions";
import * as sort from "./sortingFunctions";
import { getRandomInt } from "./genericUtils";

// mask check should go here to push whole interval over I can't do anything because max is on top of me and wants to type

/**
 * Split a row into a row of intervals
 * @param row
 * @param min
 * @param max
 * @param thresholdCheck
 * @returns
 */
export function intervalizeRowWithThresholds<T extends object>(
	row: T[],
	min: number,
	max: number,
	thresholdCheck: (pixel: T, min: number, max: number) => boolean
): T[][] {
	let arrOfArrs: T[][] = [[]];

	// avoid if-check inside for loop.
	arrOfArrs[0].push(row[0]);

	let latestIntervalIsWithinThreshold = thresholdCheck(row[0] as T, min, max);
	for (let i = 1; i < row.length; i++) {
		const latestPixelWithin = thresholdCheck(row[i], min, max);
		if (latestPixelWithin === latestIntervalIsWithinThreshold) {
			// add to current interval
			arrOfArrs[arrOfArrs.length - 1].push(row[i]);
		} else {
			// start a new interval
			latestIntervalIsWithinThreshold = latestPixelWithin;
			arrOfArrs.push([row[i]]);
		}
	}

	return arrOfArrs;
}

/**
 * Split a row into a row of intervals randomly.
 * @param row
 * @param min
 * @param max
 * @returns
 */
export function intervalizeRowWithRandomness<T extends object>(
	row: T[],
	min: number,
	max: number
): T[][] {
	let arrOfArrs: T[][] = [[]];

	let count = getRandomInt(min, max);
	let matchcount = 0;
	arrOfArrs[0].push(row[0]);

	for (let i = 1; i < row.length; i++) {
		matchcount++;
		if (matchcount !== count) {
			matchcount = 0;
			count = getRandomInt(min, max);
			// add to current interval
			arrOfArrs[arrOfArrs.length - 1].push(row[i]);
		} else {
			arrOfArrs.push([row[i]]);
		}
	}

	return arrOfArrs;
}

// flip back and forth
function sortIntervalizedRow<T extends object>(
	intervalizedRow: T[][],
	startsWithinThreshold: boolean,
	sortingFunction: (a: T, b: T) => number
): T[] {
	let sortedButNotFlattenedRow: T[][] = [];

	let withinThreshold = startsWithinThreshold;

	for (let interval of intervalizedRow) {
		if (withinThreshold) {
			sortedButNotFlattenedRow.push(interval.sort(sortingFunction));
		} else {
			sortedButNotFlattenedRow.push(interval);
		}

		// flip
		withinThreshold = !withinThreshold;
	}

	const sortedRow = sortedButNotFlattenedRow.flat();
	return sortedRow;
}

export function sortRowWithThreshold<T extends object>(
	row: T[],
	min: number,
	max: number,
	thresholdCheck: (pixel: T, min: number, max: number) => boolean,
	sorter: (a: T, b: T) => number
): T[] {
	const intervalRow = intervalizeRowWithThresholds(row, min, max, thresholdCheck);
	const startsWithinThreshold = thresholdCheck(intervalRow[0][0], min, max);
	return sortIntervalizedRow(intervalRow, startsWithinThreshold, sorter);
}

export function sortRandomRow<T extends object>(
	row: T[],
	min: number,
	max: number,
	sorter: (a: T, b: T) => number
): T[] {
	const intervalRow = intervalizeRowWithRandomness(row, min, max);

	// randomly decide which to start on
	const startsWithinThreshold = Boolean(getRandomInt(0, 2));
	return sortIntervalizedRow(intervalRow, startsWithinThreshold, sorter);
}

export function sortRowWithThresholdAndMaskProofOfConcept<T extends object>(
	row: T[],
	options: {
		min: number;
		max: number;
		left: number;
		right: number;
		thresholdCheck: (pixel: T, min: number, max: number) => boolean;
		sorter: (a: T, b: T) => number;
	}
): T[] {
	const { min, max, thresholdCheck, sorter, left, right } = options;

	const intervalRow = intervalizeRowWithThresholdsAndMaskProofOfConcept(
		row,
		min,
		max,
		left,
		right,
		thresholdCheck
	);
	const startsWithinThreshold = thresholdCheck(intervalRow[0][0], min, max);
	return sortIntervalizedRow(intervalRow, startsWithinThreshold, sorter);
}

export function intervalizeRowWithThresholdsAndMaskProofOfConcept<T extends object>(
	row: T[],
	min: number,
	max: number,
	left: number,
	right: number,
	thresholdCheck: (pixel: T, min: number, max: number) => boolean
): T[][] {
	let arrOfArrs: T[][] = [[]];

	// avoid if-check inside for loop.
	arrOfArrs[0].push(row[0]);

	let latestIntervalIsWithinThreshold = thresholdCheck(row[0] as T, min, max);
	for (let i = 1; i < row.length; i++) {
		const latestPixelWithin = thresholdCheck(row[i], min, max);
		if (latestPixelWithin === latestIntervalIsWithinThreshold) {
			// if mask
			// add to current interval
			arrOfArrs[arrOfArrs.length - 1].push(row[i]);
		} else {
			// start a new interval
			latestIntervalIsWithinThreshold = latestPixelWithin;
			arrOfArrs.push([row[i]]);
		}
	}

	return arrOfArrs;
}
