import { pixelsort } from "./pixelsort";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData>) {
		const alteredImage = pixelsort(e.data.data, e.data.width, e.data.height, {
			sortingStyle: "lightness",
			threshold: [64, 204],
		});
		self.postMessage(alteredImage);
	},
	false
);
