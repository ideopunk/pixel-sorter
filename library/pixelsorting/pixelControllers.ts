import { sortRowWithRandomness, sortRowWithThreshold } from "./intervalFunctions";
import { maskNoThresholdData, maskRandomData, maskThresholdData, rotateCoordinates } from "./mask";
import { columnsToRows, toColumns, sectionSort } from "./pixelUtils";
import { HSLPixel, MaskCoordinates, Pixel } from "../types";

// function* chunkGen(collection: any, size = 2, i = 0) {
// 	for (; i < collection.length; i += size) {
// 		yield collection.slice(i, i + size);
// 	}
// }

// export function hslNoThresholdConversionGenerator(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	sortingFunction: (a: HSLPixel, b: HSLPixel) => number,
// 	columns: boolean,
// 	mask?: MaskCoordinates
// ): ImageData {
// 	let pixels: HSLPixel[] = [];

// 	for (let i = 0; i < data.length; i += 4) {
// 		pixels.push(rgbPixeltoHslPixel(data[i], data[i + 1], data[i + 2], data[i + 3]));
// 	}

// 	// let nestedData: HSLPixel[][] = [];

// 	// if (columns) {
// 	// 	nestedData = toColumns(hslPixels, width, height);
// 	// } else {
// 	// 	for (let i = 0; i < height; i++) {
// 	// 		nestedData.push(hslPixels.slice(i * width, (i + 1) * width));
// 	// 	}
// 	// }

// 	// let convertedArray: HSLPixel[][] = [];

// 	// if (!!mask) {
// 	// 	if (columns) mask = rotateCoordinates(mask, width, height);

// 	// 	convertedArray = maskNoThresholdData(nestedData, sortingFunction, mask);
// 	// } else {
// 	for (let i = 0; i < height; i++) {
// 		pixels.splice(
// 			i * width,
// 			width,
// 			...pixels.slice(i * width, i * width + width).sort(sortingFunction)
// 		);
// 	}
// 	// }

// 	// let flattenedArray: HSLPixel[] = [];
// 	// if (columns) {
// 	// 	flattenedArray = columnsToFlatArray(convertedArray);
// 	// } else {
// 	// 	flattenedArray = convertedArray.flat();
// 	// }

// 	const clampedArr = HSLtoClampArray(pixels);
// 	return new ImageData(clampedArr, width, height);
// }

// export function hslNoThresholdConversion(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	sortingFunction: (a: HSLPixel, b: HSLPixel) => number,
// 	columns: boolean,
// 	mask?: MaskCoordinates
// ): ImageData {
// 	let hslPixels: HSLPixel[] = [];

// 	for (let i = 0; i < data.length; i += 4) {
// 		hslPixels.push(rgbPixeltoHslPixel(data[i], data[i + 1], data[i + 2], data[i + 3]));
// 	}

// 	let nestedData: HSLPixel[][] = [];

// 	// if (columns) {
// 	// 	nestedData = toColumns(hslPixels, width, height);
// 	// } else {
// 	for (let i = 0; i < height; i++) {
// 		nestedData.push(hslPixels.slice(i * width, (i + 1) * width));
// 	}
// 	// }

// 	let convertedArray: HSLPixel[][] = [];

// 	// if (!!mask) {
// 	// 	if (columns) mask = rotateCoordinates(mask, width, height);

// 	// 	convertedArray = maskNoThresholdData(nestedData, sortingFunction, mask);
// 	// } else {
// 	for (let row of nestedData) {
// 		convertedArray.push(row.sort(sortingFunction));
// 	}
// 	// }

// 	let flattenedArray: HSLPixel[] = [];
// 	if (columns) {
// 		flattenedArray = columnsToRows(convertedArray);
// 	} else {
// 		flattenedArray = convertedArray.flat();
// 	}

// 	const clampedArr = HSLtoClampArray(flattenedArray);
// 	return new ImageData(clampedArr, width, height);
// }

// export function hslThresholdConversion(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	min: number,
// 	max: number,
// 	thresholdCheck: (pixel: HSLPixel, min: number, max: number) => boolean,
// 	sorter: (a: HSLPixel, b: HSLPixel) => number,
// 	columns: boolean,
// 	mask?: MaskCoordinates
// ) {
// 	let pixels: HSLPixel[] = [];

// 	for (let i = 0; i < data.length; i += 4) {
// 		pixels.push(rgbPixeltoHslPixel(data[i], data[i + 1], data[i + 2], data[i + 3]));
// 	}

// 	let nestedData: HSLPixel[][] = [];

// 	if (columns) {
// 		nestedData = toColumns(pixels, width, height);
// 	} else {
// 		for (let i = 0; i < height; i++) {
// 			nestedData.push(pixels.slice(i * width, (i + 1) * width));
// 		}
// 	}

// 	let convertedArray: HSLPixel[][] = [];

// 	if (!!mask) {
// 		if (columns) mask = rotateCoordinates(mask, width, height);

// 		convertedArray = maskThresholdData(nestedData, min, max, thresholdCheck, sorter, mask);
// 	} else {
// 		for (let row of nestedData) {
// 			convertedArray.push(sortRowWithThreshold(row, min, max, thresholdCheck, sorter));
// 		}
// 	}

// 	let flattenedArray: HSLPixel[] = [];
// 	if (columns) {
// 		flattenedArray = columnsToRows(convertedArray);
// 	} else {
// 		flattenedArray = convertedArray.flat();
// 	}

// 	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
// 	return new ImageData(clampedArr, width, height);
// }

// /**
//  *
//  * @param data
//  * @param width
//  * @param height
//  * @param min The minimum acceptable random value for an interval range
//  * @param max The maximum (exclusive) acceptable random value for an interval range
//  * @param sorter
//  * @returns
//  */
// export function hslRandomConversion(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	min: number,
// 	max: number,
// 	sorter: (a: Uint8ClampedArray, b: Uint8ClampedArray) => number,
// 	columns: boolean,
// 	mask?: MaskCoordinates
// ) {
// 	let pixels: HSLPixel[] = [];

// 	for (let i = 0; i < data.length; i += 4) {
// 		pixels.push(rgbPixeltoHslPixel(data[i], data[i + 1], data[i + 2], data[i + 3]));
// 	}

// 	let nestedData: HSLPixel[][] = [];

// 	if (columns) {
// 		nestedData = toColumns(pixels, width, height);
// 	} else {
// 		for (let i = 0; i < height; i++) {
// 			nestedData.push(pixels.slice(i * width, (i + 1) * width));
// 		}
// 	}

// 	let convertedArray: HSLPixel[][] = [];
// 	if (!!mask) {
// 		if (columns) mask = rotateCoordinates(mask, width, height);

// 		convertedArray = maskRandomData(nestedData, min, max, sorter, mask);
// 	} else {
// 		for (let row of nestedData) {
// 			convertedArray.push(sortRandomRow(row, min, max, sorter));
// 		}
// 	}

// 	let flattenedArray: HSLPixel[] = [];
// 	if (columns) {
// 		flattenedArray = columnsToRows(convertedArray);
// 	} else {
// 		flattenedArray = convertedArray.flat();
// 	}

// 	const clampedArr = Uint8ClampedArray.from(HSLtoClampArray(flattenedArray));
// 	const newData = new ImageData(clampedArr, width, height);

// 	return newData;
// }

export function rgbNoThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	sorter: (a: Uint8ClampedArray, b: Uint8ClampedArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskNoThresholdData(data, width, height, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sectionSort(row, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	const newData = new ImageData(data, width, height);

	return newData;
}

export function rgbThresholdConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	thresholdCheck: (pixel: Uint8ClampedArray, min: number, max: number) => boolean,
	sorter: (a: Uint8ClampedArray, b: Uint8ClampedArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskThresholdData(data, width, min, max, thresholdCheck, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithThreshold(row, min, max, thresholdCheck, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	const newData = new ImageData(data, width, height);

	return newData;
}

/**
 *
 * @param data
 * @param width
 * @param height
 * @param min The minimum acceptable random value for an interval range
 * @param max The maximum (exclusive) acceptable random value for an interval range
 * @param sorter
 * @returns
 */
export function rgbRandomConversion(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	min: number,
	max: number,
	sorter: (a: Uint8ClampedArray, b: Uint8ClampedArray) => number,
	columns: boolean,
	mask?: MaskCoordinates
) {
	if (columns) {
		data = toColumns(data, width, height);
	}

	if (!!mask) {
		if (columns) mask = rotateCoordinates(mask, width, height);

		maskRandomData(data, width, min, max, sorter, mask);
	} else {
		for (let i = 0; i < height; i++) {
			const previous = width * 4 * i;

			const row = data.subarray(previous, previous + width * 4);
			sortRowWithRandomness(row, min, max, sorter);
		}
	}

	if (columns) {
		data = columnsToRows(data, height, width);
	}

	const newData = new ImageData(data, width, height);

	return newData;
}
