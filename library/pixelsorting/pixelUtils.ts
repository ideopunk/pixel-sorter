import { HSLPixel, Pixel } from "../types";

export function toColumns<T extends object>(
	data: T[],
	originalWidth: number,
	originalHeight: number
): T[][] {
	let columns: T[][] = [];
	for (let i = 0; i < originalWidth; i++) {
		columns.push([]);
		for (let j = 0; j < originalHeight; j++) {
			columns[i].push(data[j * originalWidth + (originalWidth - i) - 1]);
		}
	}

	return columns;
}

export function columnsToFlatArray<T extends object>(columns: T[][]): T[] {
	let flatArray: T[] = [];
	for (let i = 0; i < columns[0].length; i++) {
		for (let j = 0; j < columns.length; j++) {
			flatArray.push(columns[columns.length - j - 1][i]);
		}
	}

	return flatArray;
}

export function RGBtoClampArray(pixels: Pixel[]) {
	let preClamp: number[] = [];
	pixels.forEach((pixel) => {
		preClamp.push(pixel.r, pixel.g, pixel.b, pixel.a);
	});
	return Uint8ClampedArray.from(preClamp);
}

export function HSLtoClampArray(pixels: HSLPixel[]) {
	let preclamp: number[] = [];
	pixels.forEach((pixel) => {
		const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l, pixel.a);
		preclamp.push(pixels[0], pixels[1], pixels[2], pixels[3]);
	});
	return Uint8ClampedArray.from(preclamp);
}

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
	return [r, g, b, 255];
}

export function toPixels(r: number, g: number, b: number, a: number): Pixel {
	return { r, g, b, a };
}

export const toHSLPixels = (r: number, g: number, b: number, a: number): HSLPixel => {
	r = r / 255;
	g = g / 255;
	b = b / 255;
	a = a / 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

	return {
		h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
		s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
		l: (100 * (2 * l - s)) / 2,
		a,
	};
};

export function RGBMatrixtoClampArray(matrix: Pixel[][]) {
	let preClamp: number[] = [];
	matrix.forEach((row) => {
		row.forEach((pixel) => {
			preClamp.push(pixel.r, pixel.g, pixel.b, pixel.a);
		});
	});
	return Uint8ClampedArray.from(preClamp);
}

export function HSLMatrixtoClampArray(matrix: HSLPixel[][]) {
	let preclamp: number[] = [];
	matrix.forEach((row) => {
		row.forEach((pixel) => {
			const pixels = HSLToRGB(pixel.h, pixel.s, pixel.l, pixel.a);
			preclamp.push(pixels[0], pixels[1], pixels[2], pixels[3]);
		});
	});
	return Uint8ClampedArray.from(preclamp);
}
