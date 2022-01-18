import { Pixel } from "./types";

export function redWithinThresholdCheck(pixel: Pixel, min: number, max: number) {
	return pixel.r > min && pixel.r < max;
}

export function createIntervalsRed(row: Pixel[], min: number, max: number): Pixel[][] {
	let arrOfArrs: Pixel[][] = [[]];

	// avoid if-check inside for loop.
	arrOfArrs[0].push(row[0]);

	let latestIntervalIsWithinThreshold = redWithinThresholdCheck(
		arrOfArrs.at(-1)?.at(-1) as Pixel,
		min,
		max
	);

	for (let i = 1; i < row.length; i++) {
		const latestPixelWithin = redWithinThresholdCheck(row[i], min, max);
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