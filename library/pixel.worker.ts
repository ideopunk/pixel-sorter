import { catcher } from "./genericUtils";
import { pixelsort } from "./pixelsort";
import { Options } from "./types";

export const ctx: Worker = self as any;

ctx.addEventListener(
	"message",
	function (e: MessageEvent<ImageData & { options: Options }>) {
		try {
			const alteredImage = pixelsort(
				e.data.data,
				e.data.width,
				e.data.height,
				e.data.options
			);
			self.postMessage(alteredImage);
		} catch (e) {
			const err = catcher(e);
			throw err;
		}
	},
	false
);
