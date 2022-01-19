import { pixelsort } from "./pixelsort";
import { Options } from "./types";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData & {options: Options}>) {
		const alteredImage = pixelsort(e.data.data, e.data.width, e.data.height, e.data.options);
		self.postMessage(alteredImage);
	},
	false
);
