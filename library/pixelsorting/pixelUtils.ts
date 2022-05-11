import { PixelArray } from "../types";

/**
 * Sort a section by the sorter.
 * @param section a subarray of the image's pixels
 * @param sorter a function for sorting the pixels
 */
export function sectionSort(section: PixelArray, sorter: (a: PixelArray, b: PixelArray) => number) {
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

/**
 * Flip an image counter-clockwise
 * @param data image pixels
 * @param width current image width in pixels
 * @param height current image height in pixels
 * @returns
 */
export function rotateCounterClockwise(data: Uint8ClampedArray, width: number, height: number) {
	let rotatedData = new Uint8ClampedArray(data.length);
	for (let i = 0; i < width; i++) {
		// lil optimization
		const slideIntoColumn = width - i - 1;
		for (let j = 0; j < height; j++) {
			const columnIndex = (i * height + j) * 4;
			const dataIndex = (j * width + slideIntoColumn) * 4;

			rotatedData[columnIndex] = data[dataIndex];
			rotatedData[columnIndex + 1] = data[dataIndex + 1];
			rotatedData[columnIndex + 2] = data[dataIndex + 2];
			rotatedData[columnIndex + 3] = data[dataIndex + 3];
		}
	}

	return rotatedData;
}

/**
 * Flip an image clockwise
 * @param data image pixels
 * @param width current image width in pixels
 * @param height current image height in pixels
 * @returns
 */
export function rotateClockwise(
	data: ArrayLike<number>,
	width: number,
	height: number
): Uint8ClampedArray {
	let rotatedData = new Uint8ClampedArray(data.length);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const rowIndex = (i * height + j) * 4;
			const dataIndex = (width * (height - j - 1) + i) * 4;

			rotatedData[rowIndex] = data[dataIndex];
			rotatedData[rowIndex + 1] = data[dataIndex + 1];
			rotatedData[rowIndex + 2] = data[dataIndex + 2];
			rotatedData[rowIndex + 3] = data[dataIndex + 3];
		}
	}

	return rotatedData;
}

/**
 *
 * @param hsl array with length of 4 (hsl pixel)
 * @returns array with length of 4 (rgb pixel)
 */
export function HSLToRGBPixel(hsl: Float64Array) {
	// Must be fractions of 1
	const h = hsl[0];
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

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
	const a = Math.round(hsl[3] * 255);
	return new Uint8ClampedArray([r, g, b, a]);
}

/**
 *
 * @param rgb array with length of 4 (rgb pixel)
 * @returns array with length of 4 (hsl pixel)
 */
export function RGBToHSLPixel(rgb: Uint8ClampedArray): Float64Array {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Find greatest and smallest channel values
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta == 0) h = 0;
	// Red is max
	else if (cmax == r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax == g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return new Float64Array([h, s, l, rgb[3] / 255]);
}
