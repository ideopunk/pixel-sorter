// ASCENDING
export function byRedOrHueAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return a[0] - b[0];
}

export function byGreenOrSaturationAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return a[1] - b[1];
}

export function byBlueOrLightnessAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return a[2] - b[2];
}

export function byAlphaAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return a[3] - b[3];
}

export function byRGBAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	const sumA = a[0] + a[1] + a[2];
	const sumB = b[0] + b[1] + b[2];
	return sumA - sumB;
}

// export function byHueAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return a.h - b.h;
// }

// export function bySaturationAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return a.s - b.s;
// }

// export function byLightAscending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return a.l - b.l;
// }

// DESCENDING
export function byRedOrHueDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return b[0] - a[0];
}

export function byGreenOrSaturationDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return b[1] - a[1];
}

export function byBlueOrLightnessDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return b[2] - a[2];
}

export function byAlphaDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	return b[0] - a[0];
}

export function byRGBDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
	const sumA = a[0] + a[1] + a[2];
	const sumB = b[0] + b[1] + b[2];
	return sumB - sumA;
}

// export function byHueDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return b.h - a.h;
// }

// export function bySaturationDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return b.s - a.s;
// }

// export function byLightDescending(a: Uint8ClampedArray, b: Uint8ClampedArray) {
// 	return b.l - a.l;
// }
