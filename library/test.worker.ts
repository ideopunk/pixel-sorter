import { workersort } from "./pixelsort";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData>) {
		const neww = workersort(e.data.data, e.data.width, e.data.height);
		self.postMessage(neww);
	},
	false
);
