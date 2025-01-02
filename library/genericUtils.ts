export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function catcher(e: unknown): string {
	if (typeof e === "string") {
		return e;
	} else if (e instanceof Error) {
		return e.message;
	} else {
		return (e as Error).message;
	}
}

export function isSafari() {
	return CSS.supports("-webkit-hyphens", "none");
}
