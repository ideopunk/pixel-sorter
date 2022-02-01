import { toColumns } from "../library/pixelsorting/pixelUtils";
import { rotateCoordinates } from "../library/pixelsorting/mask";
import { HSLPixel, MaskCoordinates, Pixel } from "../library/types";

test("ping", () => expect("pong").toBe("pong"));

describe("convert to columns", () => {
	test("yeah", () => {
		const matrix: Pixel[] = [
			{ r: 255, g: 0, b: 0, a: 0 },
			{ r: 255, g: 0, b: 0, a: 0 },
			{ r: 255, g: 0, b: 0, a: 0 },
			{ r: 0, g: 255, b: 0, a: 0 },
			{ r: 0, g: 255, b: 0, a: 0 },
			{ r: 0, g: 255, b: 0, a: 0 },
		];

		const columns = toColumns(matrix, 3, 2);

		console.log(columns);
		expect(columns[0].length).toBe(2);
		expect(columns.length).toBe(3);
		expect(columns).toStrictEqual([
			[
				{ r: 255, g: 0, b: 0, a: 0 },
				{ r: 0, g: 255, b: 0, a: 0 },
			],
			[
				{ r: 255, g: 0, b: 0, a: 0 },
				{ r: 0, g: 255, b: 0, a: 0 },
			],
			[
				{ r: 255, g: 0, b: 0, a: 0 },
				{ r: 0, g: 255, b: 0, a: 0 },
			],
		]);
	});
});

describe("rotate mask to suit columns", () => {
	test("yeah", () => {
		const width = 3;
		const height = 2;
		const mask: MaskCoordinates = { top: 0, bottom: 1, left: 0, right: 1 };

		const rotated = rotateCoordinates(mask, width, height);

		expect(rotated).toStrictEqual({ top: 1, bottom: 2, left: 0, right: 1 });
	});
});
