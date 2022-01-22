import { columnTest } from "../library/pixelControllers";

test("ping", () => expect("pong").toBe("pong"));

describe("convert to columns", () => {
	test("yeah", () => {
		const originalData = Uint8ClampedArray.from([
			// row 1
			11, 12, 13, 255, 21, 22, 23, 255, 31, 32, 33, 255, 41, 42, 43, 255,
			// row 2
			111, 112, 113, 255, 121, 122, 123, 255, 131, 132, 133, 255, 141, 142, 143, 255,
			// row 3
			211, 212, 213, 255, 221, 222, 223, 255, 231, 232, 233, 255, 241, 242, 243, 255,
		]);
		const originalWidth = 4;
		const originalHeight = 3;

		const newData = columnTest(originalData, originalWidth, originalHeight);
		console.log(newData.data);
		expect(newData.width).toBe(4);
		expect(newData.height).toBe(3);
		expect(newData.data).toStrictEqual(originalData);
	});
});
