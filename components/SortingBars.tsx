import { ReactNode } from "react";

function Wrapper({ children }: { children: ReactNode }) {
	return <div className="flex justify-center gap-1 mt-1">{children}</div>;
}

export function SortHue() {
	return (
		<Wrapper>
<div style={{ backgroundColor: "hsl(50, 50%, 50%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(150, 50%, 50%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(250, 50%, 50%)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}
export function SortSaturation() {
	return (
		<Wrapper>
			<div style={{ backgroundColor: "hsl(50, 10%, 50%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(50, 50%, 50%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(50, 90%, 50%)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}

export function SortLightness() {
	return (
		<Wrapper>
			<div className="h-4 w-4  bg-neutral-200" />
			<div className="h-4 w-4  bg-neutral-500" />
			<div className="h-4 w-4  bg-neutral-800" />
		</Wrapper>
	);
}

export function SortRed() {
	return (
		<Wrapper>
			<div className="h-4 w-4  bg-red-200" />
			<div className="h-4 w-4  bg-red-500" />
			<div className="h-4 w-4  bg-red-800" />
		</Wrapper>
	);
}

export function SortBlue() {
	return (
		<Wrapper>
			<div className="h-4 w-4  bg-blue-200" />
			<div className="h-4 w-4  bg-blue-500" />
			<div className="h-4 w-4  bg-blue-800" />
		</Wrapper>
	);
}

export function SortGreen() {
	return (
		<Wrapper>
			<div className="h-4 w-4  bg-green-200" />
			<div className="h-4 w-4  bg-green-500" />
			<div className="h-4 w-4  bg-green-800" />
		</Wrapper>
	);
}
