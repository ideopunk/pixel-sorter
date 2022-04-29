import { HSLPixel, Pixel } from "../types";

/**
 * The big one.
 * @param section
 * @param sorter
 */
export function sectionSort(
	section: Uint8ClampedArray,
	sorter: (a: Uint8ClampedArray, b: Uint8ClampedArray) => number
) {
	const pixels = [];
	const width = section.length / 4;
	for (let j = 0; j < width; j++) {
		const pixel = section.slice(j * 4, j * 4 + 4);
		pixels.push(pixel);
	}
	pixels.sort(sorter);

	for (let k = 0; k < width; k++) {
		const curr = k * 4;
		section[curr] = pixels[k][0];
		section[curr + 1] = pixels[k][1];
		section[curr + 2] = pixels[k][2];
		section[curr + 3] = pixels[k][3];
	}
}

export function toColumns(
	data: Uint8ClampedArray,
	originalWidth: number,
	originalHeight: number
): Uint8ClampedArray {
	let columns = new Uint8ClampedArray(data.length);
	for (let i = 0; i < originalWidth; i++) {
		// lil optimization
		const slideIntoColumn = originalWidth - i - 1;
		for (let j = 0; j < originalHeight; j++) {
			const columnIndex = (i * originalHeight + j) * 4;
			const dataIndex = (j * originalWidth + slideIntoColumn) * 4;

			columns[columnIndex] = data[dataIndex];
			columns[columnIndex + 1] = data[dataIndex + 1];
			columns[columnIndex + 2] = data[dataIndex + 2];
			columns[columnIndex + 3] = data[dataIndex + 3];
		}
	}

	return columns;
}

export function columnsToRows(
	columns: Uint8ClampedArray,
	columnWidth: number,
	columnHeight: number
): Uint8ClampedArray {
	let rows = new Uint8ClampedArray(columns.length);

	for (let i = 0; i < columnWidth; i++) {
		for (let j = 0; j < columnHeight; j++) {
			const rowIndex = (i * columnHeight + j) * 4;
			const dataIndex = (columnWidth * (columnHeight - j - 1) + i) * 4;
			
			rows[rowIndex] = columns[dataIndex];
			rows[rowIndex + 1] = columns[dataIndex + 1];
			rows[rowIndex + 2] = columns[dataIndex + 2];
			rows[rowIndex + 3] = columns[dataIndex + 3];
		}
	}

	return rows;
}

// export function RGBtoClampArray(pixels: Pixel[]) {
// 	let preClamp: number[] = [];
// 	pixels.forEach((pixel) => {
// 		preClamp.push(pixel.r, pixel.g, pixel.b, pixel.a);
// 	});
// 	return Uint8ClampedArray.from(preClamp);
// }

// export function HSLtoClampArray(pixels: HSLPixel[]) {
// 	let preclamp: number[] = [];
// 	pixels.forEach((pixel) => {
// 		const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l, pixel.a);
// 		preclamp.push(pixels[0], pixels[1], pixels[2], pixels[3]);
// 	});
// 	return Uint8ClampedArray.from(preclamp);
// }

export function HSLToRGB(h: number, s: number, l: number, a: number) {
	// Must be fractions of 1
	s /= 100;
	l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
		m = l - c / 2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	a = Math.round(a * 255);
	return [r, g, b, a];
}

// export function toPixels(r: number, g: number, b: number, a: number): Pixel {
// 	return { r, g, b, a };
// }

// one pixel at a time please
// export const rgbPixeltoHslPixel = (rgb: Uint8ClampedArray): Float32Array => {
// 	const r = rgb[0] / 255;
// 	const g = rgb[1] / 255;
// 	const b = rgb[2] / 255;
// 	const a = rgb[3] / 255;
// 	const l = Math.max(r, g, b);
// 	const s = l - Math.min(r, g, b);
// 	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

// 	return {
// 		h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
// 		s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
// 		l: (100 * (2 * l - s)) / 2,
// 		a,
// 	};
// };

// export function RGBMatrixtoClampArray(matrix: Pixel[][]) {
// 	let preClamp: number[] = [];
// 	matrix.forEach((row) => {
// 		row.forEach((pixel) => {
// 			preClamp.push(pixel.r, pixel.g, pixel.b, pixel.a);
// 		});
// 	});
// 	return Uint8ClampedArray.from(preClamp);
// }

// export function HSLMatrixtoClampArray(matrix: HSLPixel[][]) {
// 	let preclamp: number[] = [];
// 	matrix.forEach((row) => {
// 		row.forEach((pixel) => {
// 			const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l, pixel.a);
// 			preclamp.push(pixels[0], pixels[1], pixels[2], pixels[3]);
// 		});
// 	});
// 	return Uint8ClampedArray.from(preclamp);
// }
