import { sortRandomRow, sortRowWithThreshold } from "./intervalFunctions";
import { HSLPixel, MaskCoordinates } from "./types";

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

export function maskNoThresholdData<T extends object>(
	data: T[][],
	sorter: (a: T, b: T) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	let convertedArray: T[][] = [];

	if (mask.inverted) {
		for (let i = 0; i < data.length; i++) {
			if (i >= top && i <= bottom) {
				const untouchedLeft = data[i].slice(0, left);
				const convertedMid = data[i].slice(left, right).sort(sorter);
				const untouchedRight = data[i].slice(right);
				convertedMid.push(...untouchedRight);
				untouchedLeft.push(...convertedMid);
				convertedArray.push(untouchedLeft);
			} else {
				convertedArray.push(data[i]);
			}
		}
	} else {
		for (let i = 0; i < data.length; i++) {
			if (i >= top && i <= bottom) {
				const convertedLeft = data[i].slice(0, left).sort(sorter);
				const untouchedMid = data[i].slice(left, right);
				const convertedRight = data[i].slice(right).sort(sorter);
				untouchedMid.push(...convertedRight);
				convertedLeft.push(...untouchedMid);
				convertedArray.push(convertedLeft);
			} else {
				convertedArray.push(data[i].sort(sorter));
			}
		}
	}

	return convertedArray;
}

export function maskThresholdData<T extends object>(
	data: T[][],
	min: number,
	max: number,
	thresholdCheck: (pixel: T, min: number, max: number) => boolean,
	sorter: (a: T, b: T) => number,
	mask: MaskCoordinates
): T[][] {
	const { top, bottom, left, right } = mask;

	let convertedArray: T[][] = [];

	if (mask.inverted) {
		for (let i = 0; i < data.length; i++) {
			if (i >= top && i <= bottom) {
				const untouchedLeft = data[i].slice(0, left);

				const convertedMid = sortRowWithThreshold(
					data[i].slice(left, right),
					min,
					max,
					thresholdCheck,
					sorter
				);

				const untouchedRight = data[i].slice(right);

				convertedMid.push(...untouchedRight);
				untouchedLeft.push(...convertedMid);

				convertedArray.push(untouchedLeft);
			} else {
				convertedArray.push(data[i]);
			}
		}
	} else {
		for (let i = 0; i < data.length; i++) {
			if (i >= top && i <= bottom) {
				const convertedLeft = sortRowWithThreshold(
					data[i].slice(0, left),
					min,
					max,
					thresholdCheck,
					sorter
				);

				const untouchedMid = data[i].slice(left, right);
				const convertedRight = sortRowWithThreshold(
					data[i].slice(right),
					min,
					max,
					thresholdCheck,
					sorter
				);

				untouchedMid.push(...convertedRight);
				convertedLeft.push(...untouchedMid);

				convertedArray.push(convertedLeft);
			} else {
				convertedArray.push(
					sortRowWithThreshold(data[i], min, max, thresholdCheck, sorter)
				);
			}
		}
	}
	return convertedArray;
}

export function maskRandomData<T extends object>(
	data: T[][],
	min: number,
	max: number,
	sorter: (a: T, b: T) => number,
	mask: MaskCoordinates
): T[][] {
	const { top, bottom, left, right } = mask;

	let convertedArray: T[][] = [];

	for (let i = 0; i < data.length; i++) {
		if (i >= top && i <= bottom) {
			const convertedLeft = sortRandomRow(data[i].slice(0, left), min, max, sorter);

			const untouchedMid = data[i].slice(left, right);
			const convertedRight = sortRandomRow(data[i].slice(right), min, max, sorter);

			untouchedMid.push(...convertedRight);
			convertedLeft.push(...untouchedMid);

			convertedArray.push(convertedLeft);
		} else {
			convertedArray.push(sortRandomRow(data[i], min, max, sorter));
		}
	}

	return convertedArray;
}
