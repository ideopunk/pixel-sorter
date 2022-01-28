import { HSLPixel, MaskCoordinates } from "./types";

export function toCoordinates(mask: {
	x: number;
	y: number;
	width: number;
	height: number;
}): MaskCoordinates {
	console.log("to coordinates");
	console.log(mask);
	console.log(mask.x, mask.y, mask.width, mask.height);

	const coordinates = {
		left: mask.x,
		top: mask.y,
		right: mask.x + mask.width,
		bottom: mask.y + mask.height,
	};

	console.log(coordinates);
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
	};
}

export function maskNoThresholdRow<T extends object>(
	data: T[][],
	sorter: (a: T, b: T) => number,
	mask: MaskCoordinates
) {
	const { top, bottom, left, right } = mask;

	let convertedArray: T[][] = [];

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

	return convertedArray;
}
