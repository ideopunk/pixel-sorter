export const nope = "nope";
// import { sortRandomRow, sortRowWithThreshold } from "./intervalFunctions";
// import { maskNoThresholdData, maskRandomData, maskThresholdData, rotateCoordinates } from "./mask";
// import { columnsToFlatArray, HSLtoClampArray, HSLToRGB, toHSLPixels } from "./pixelUtils";
// import { HSLPixel, MaskCoordinates, Pixel } from "../types";

// function* toMatrix(data: Uint8ClampedArray, width: number, height: number) {
// 	for (let i = 0; i < height; i++) {
// 		yield data.slice(i * width * 4, i + 1 * width * 4);
// 	}
// }

// function* rowToHSL(data: Uint8ClampedArray[]) {
// 	for (let i = 0; i < data.length; i += 4) {
// 		yield toHSLPixels(data[i], data[i + 1], data[i + 2]);
// 	}
// }
// function* toWow(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
// ) {
// 	let matrix = toMatrix(data, width, height);
// 	for (let row of matrix) {
// 		let hslRow = rowToHSL(row);
// 		yield row.map;
// 	}

// 	for (let row of toNest(hslPixels, width, height)) {
// 		yield row.sort(sortingFunction);
// 	}
// }

// export function pyramidConversion(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
// ): ImageData {
// 	let preclamp = [];
// 	for (let row of toWow(data, width, height, sortingFunction)) {
// 		preclamp.push(...HSLtoClampRow(row));
// 	}

// 	return new ImageData(Uint8ClampedArray.from(preclamp), width, height);
// }

// export function simpleConversion(
// 	data: Uint8ClampedArray,
// 	width: number,
// 	height: number,
// 	sortingFunction: (a: HSLPixel, b: HSLPixel) => number
// ): ImageData {
// 	let hslPixels: HSLPixel[] = [];
// 	for (let i = 0; i < data.length; i += 4) {
// 		hslPixels.push(toHSLPixels(data[i], data[i + 1], data[i + 2]));
// 	}

// 	let nestedData = toNest(hslPixels, width, height);

// 	let convertedArray: HSLPixel[][] = [];
// 	for (let row of nestedData) {
// 		convertedArray.push(row.sort(sortingFunction));
// 	}

// 	const preclampArr: number[] = [];
// 	for (let row of convertedArray) {
// 		preclampArr.push(...HSLtoClampRow(row));
// 	}
// 	return new ImageData(Uint8ClampedArray.from(preclampArr), width, height);
// }

// function* toHSLPixelArr(data: Uint8ClampedArray) {
// 	for (let i = 0; i < data.length; i += 4) {
// 		yield toHSLPixels(data[i], data[i + 1], data[i + 2]);
// 	}
// }

// function* toNest<T>(pixels: T[], width: number, height: number) {
// 	for (let i = 0; i < height; i++) {
// 		yield pixels.slice(i * width, (i + 1) * width);
// 	}
// }

// function* toConverted<T>(nest: T[][], sortingFunction: (a: T, b: T) => number) {
// 	for (let row of nest) {
// 		yield row.sort(sortingFunction);
// 	}
// }

// export function HSLMatrixtoClampArray(matrix: HSLPixel[][]) {
// 	let preclamp: number[] = [];
// 	matrix.forEach((row) => {
// 		row.forEach((pixel) => {
// 			const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l);
// 			preclamp.push(pixels[0], pixels[1], pixels[2], pixels[3]);
// 		});
// 	});
// 	return Uint8ClampedArray.from(preclamp);
// }

// function HSLtoClampRow(row: HSLPixel[]) {
// 	const pix: number[] = [];
// 	row.forEach((pixel) => {
// 		const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l);
// 		pix.push(pixels[0], pixels[1], pixels[2], pixels[3]);
// 	});

// 	return pix;
// }
