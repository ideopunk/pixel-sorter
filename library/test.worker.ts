import { workersort } from "./pixelsort";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData>) {
		const neww = workersort(e.data.data, e.data.width, e.data.height, {
			sortingStyle: "red",
			threshold: [66, 244],
		});
		self.postMessage(neww);
	},
	false
);
