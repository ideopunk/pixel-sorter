import { HSLPixel, Pixel } from "./types";
import * as threshold from "./thresholdFunctions";
import * as sort from "./sortingFunctions";
import { getRandomInt } from "./genericUtils";

/**
 * Split an RGB row into a row of intervals
 * @param row
 * @param min
 * @param max
 * @param thresholdCheck
 * @returns
 */
export function intervalizeRGBRow(
	row: Pixel[],
	min: number,
	max: number,
	thresholdCheck: (pixel: Pixel, min: number, max: number) => boolean
): Pixel[][] {
	let arrOfArrs: Pixel[][] = [[]];

	// avoid if-check inside for loop.
	arrOfArrs[0].push(row[0]);

	let latestIntervalIsWithinThreshold = thresholdCheck(
		arrOfArrs.at(-1)?.at(-1) as Pixel,
		min,
		max
	);

	for (let i = 1; i < row.length; i++) {
		const latestPixelWithin = thresholdCheck(row[i], min, max);
		if (latestPixelWithin === latestIntervalIsWithinThreshold) {
			// add to current interval
			arrOfArrs.at(-1)?.push(row[i]);
		} else {
			// start a new interval
			latestIntervalIsWithinThreshold = latestPixelWithin;
			arrOfArrs.push([row[i]]);
		}
	}

	return arrOfArrs;
}

/**
 * Split an HSL row into a row of intervals
 * @param row
 * @param min
 * @param max
 * @param thresholdCheck
 * @returns
 */
export function intervalizeHSLRow(
	row: HSLPixel[],
	min: number,
	max: number,
	thresholdCheck: (pixel: HSLPixel, min: number, max: number) => boolean
): HSLPixel[][] {
	let arrOfArrs: HSLPixel[][] = [[]];

	// avoid if-check inside for loop.
	arrOfArrs[0].push(row[0]);

	let latestIntervalIsWithinThreshold = thresholdCheck(
		arrOfArrs.at(-1)?.at(-1) as HSLPixel,
		min,
		max
	);

	for (let i = 1; i < row.length; i++) {
		const latestPixelWithin = thresholdCheck(row[i], min, max);
		if (latestPixelWithin === latestIntervalIsWithinThreshold) {
			// add to current interval
			arrOfArrs.at(-1)?.push(row[i]);
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
export function randomlyIntervalizeRow<T>(row: T[], min: number, max: number): T[][] {
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
			arrOfArrs.at(-1)?.push(row[i]);
		} else {
			arrOfArrs.push([row[i]]);
		}
	}

	return arrOfArrs;
}

// flip back and forth
function sortIntervalizedRGBRow(
	intervalizedRow: Pixel[][],
	startsWithinThreshold: boolean,
	sortingFunction: (a: Pixel, b: Pixel) => number
): Pixel[] {
	let sortedButNotFlattenedRow: Pixel[][] = [];

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

// flip back and forth
function sortIntervalizedHSLRow(
	intervalizedRow: HSLPixel[][],
	startsWithinThreshold: boolean,
	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
): HSLPixel[] {
	let sortedButNotFlattenedRow: HSLPixel[][] = [];

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

export function sortRGBRowWithThreshold(
	row: Pixel[],
	min: number,
	max: number,
	thresholdCheck: (pixel: Pixel, min: number, max: number) => boolean,
	sorter: (a: Pixel, b: Pixel) => number
): Pixel[] {
	const intervalRow = intervalizeRGBRow(row, min, max, thresholdCheck);
	const startsWithinThreshold = thresholdCheck(intervalRow[0][0], min, max);
	return sortIntervalizedRGBRow(intervalRow, startsWithinThreshold, sorter);
}

export function sortHSLRowWithThreshold(
	row: HSLPixel[],
	min: number,
	max: number,
	thresholdCheck: (pixel: HSLPixel, min: number, max: number) => boolean,
	sorter: (a: HSLPixel, b: HSLPixel) => number
): HSLPixel[] {
	const intervalRow = intervalizeHSLRow(row, min, max, thresholdCheck);
	const startsWithinThreshold = thresholdCheck(intervalRow[0][0], min, max);
	return sortIntervalizedHSLRow(intervalRow, startsWithinThreshold, sorter);
}

export function sortRGBRowRandomly(
	row: Pixel[],
	min: number,
	max: number,
	sorter: (a: Pixel, b: Pixel) => number
): Pixel[] {
	const intervalRow = randomlyIntervalizeRow(row, min, max);

	// randomly decide which to start on
	const startsWithinThreshold = Boolean(getRandomInt(0, 2));
	return sortIntervalizedRGBRow(intervalRow, startsWithinThreshold, sorter);
}

export function sortHSLRowRandomly(
	row: HSLPixel[],
	min: number,
	max: number,
	sorter: (a: HSLPixel, b: HSLPixel) => number
): HSLPixel[] {
	const intervalRow = randomlyIntervalizeRow(row, min, max);

	// randomly decide which to start on
	const startsWithinThreshold = Boolean(getRandomInt(0, 2));
	return sortIntervalizedHSLRow(intervalRow, startsWithinThreshold, sorter);
}
