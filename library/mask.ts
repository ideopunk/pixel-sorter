import { HSLPixel, MaskCoordinates } from "./types";

export function toCoordinates(mask: {
	x: number;
	y: number;
	width: number;
	height: number;
}): MaskCoordinates {
	console.log("to coordinates");
	console.log(mask);
	console.log(mask.x, mask.y, mask.width, mask.height);
	
	const coordinates = {
		left: mask.x,
		top: mask.y,
		right: mask.x + mask.width,
		bottom: mask.y + mask.height,
	};

	console.log(coordinates);
	return coordinates;
}
