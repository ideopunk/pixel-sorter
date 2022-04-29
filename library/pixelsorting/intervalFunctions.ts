import {  MaskCoordinates, PixelArray } from "../types";
import * as threshold from "./threshold";
import * as sort from "./sorting";
import { getRandomInt } from "../genericUtils";
import { sectionSort } from "./pixelUtils";

// mask check should go here to push whole interval over I can't do anything because max is on top of me and wants to type

export function sortRowWithRandomness(
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

export function sortRowWithThreshold(
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
		const f = new Float32Array()
		f.subarray()
		const sub = row.subarray(i* 4, i*4 + 4)
		let latestPixelWithin = thresholdCheck(sub, min, max);
		console.log(i, latestPixelWithin);
		if (latestPixelWithin && !onRun) {
			console.log("START");
			// start a new run
			currentMin = i;
			onRun = true;
		} else if (!latestPixelWithin && onRun) {
			// finish a run
			console.log(
				"FINISH. sorting run. section length is " + currentMin * 4 + " to " + i * 4
			);
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

// /**
//  * Split a row into a row of intervals
//  * @param row
//  * @param min
//  * @param max
//  * @param thresholdCheck
//  * @returns
//  */
// export function intervalizeRowWithThresholds<T extends object>(
// 	row: T[],
// 	min: number,
// 	max: number,
// 	thresholdCheck: (pixel: T, min: number, max: number) => boolean
// ): T[][] {
// 	if (!row.length) return [];

// 	let arrOfArrs: T[][] = [[]];

// 	// avoid if-check inside for loop.
// 	arrOfArrs[0].push(row[0]);

// 	let latestIntervalIsWithinThreshold = thresholdCheck(row[0] as T, min, max);
// 	for (let i = 1; i < row.length; i++) {
// 		const latestPixelWithin = thresholdCheck(row[i], min, max);
// 		if (latestPixelWithin === latestIntervalIsWithinThreshold) {
// 			// add to current interval
// 			arrOfArrs[arrOfArrs.length - 1].push(row[i]);
// 		} else {
// 			// start a new interval
// 			latestIntervalIsWithinThreshold = latestPixelWithin;
// 			arrOfArrs.push([row[i]]);
// 		}
// 	}

// 	return arrOfArrs;
// }

// /**
//  * Split a row into a row of intervals randomly.
//  * @param row
//  * @param min
//  * @param max
//  * @returns
//  */
// export function intervalizeRowWithRandomness<T extends object>(
// 	row: T[],
// 	min: number,
// 	max: number
// ): T[][] {
// 	if (!row.length) return [];

// 	let arrOfArrs: T[][] = [[]];

// 	let count = getRandomInt(min, max);
// 	let matchcount = 0;
// 	arrOfArrs[0].push(row[0]);

// 	for (let i = 1; i < row.length; i++) {
// 		matchcount++;
// 		if (matchcount !== count) {
// 			matchcount = 0;
// 			count = getRandomInt(min, max);
// 			// add to current interval
// 			arrOfArrs[arrOfArrs.length - 1].push(row[i]);
// 		} else {
// 			arrOfArrs.push([row[i]]);
// 		}
// 	}

// 	return arrOfArrs;
// }

// // flip back and forth
// function sortIntervalizedRow<T extends object>(
// 	intervalizedRow: T[][],
// 	startsWithinThreshold: boolean,
// 	sortingFunction: (a: T, b: T) => number
// ): T[] {
// 	if (!intervalizedRow.length) return [];

// 	let sortedButNotFlattenedRow: T[][] = [];

// 	let withinThreshold = startsWithinThreshold;

// 	for (let interval of intervalizedRow) {
// 		if (withinThreshold) {
// 			sortedButNotFlattenedRow.push(interval.sort(sortingFunction));
// 		} else {
// 			sortedButNotFlattenedRow.push(interval);
// 		}

// 		// flip
// 		withinThreshold = !withinThreshold;
// 	}

// 	const sortedRow = sortedButNotFlattenedRow.flat();
// 	return sortedRow;
// }

// // export function sortRowWithThreshold<T extends object>(
// // 	row: T[],
// // 	min: number,
// // 	max: number,
// // 	thresholdCheck: (pixel: T, min: number, max: number) => boolean,
// // 	sorter: (a: T, b: T) => number
// // ): T[] {
// // 	if (!row.length) return [];

// // 	const intervalRow = intervalizeRowWithThresholds(row, min, max, thresholdCheck);
// // 	const startsWithinThreshold = thresholdCheck(intervalRow[0][0], min, max);
// // 	return sortIntervalizedRow(intervalRow, startsWithinThreshold, sorter);
// // }

// export function sortRandomRow<T extends object>(
// 	row: T[],
// 	min: number,
// 	max: number,
// 	sorter: (a: T, b: T) => number
// ): T[] {
// 	if (!row.length) return [];

// 	const intervalRow = intervalizeRowWithRandomness(row, min, max);

// 	// randomly decide which to start on
// 	const startsWithinThreshold = Boolean(getRandomInt(0, 2));
// 	return sortIntervalizedRow(intervalRow, startsWithinThreshold, sorter);
// }
