import { workersort } from "./pixelsort";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData>) {
		const alteredImage = workersort(e.data.data, e.data.width, e.data.height, {
			sortingStyle: "red",
			threshold: [20, 150],
		});
		self.postMessage(alteredImage);
	},
	false
);
