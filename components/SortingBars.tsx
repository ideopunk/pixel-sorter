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
			<div style={{ backgroundColor: "hsl(50, 0%, 0%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(50, 0%, 50%)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "hsl(50, 0%, 100%)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}

export function SortRed() {
	return (
		<Wrapper>
			<div style={{ backgroundColor: "rgb(0, 50, 50)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(120, 50, 50)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(255, 50, 50)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}

export function SortGreen() {
	return (
		<Wrapper>
			<div style={{ backgroundColor: "rgb(50, 0, 50)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(50, 120, 50)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(50, 255, 50)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}

export function SortBlue() {
	return (
		<Wrapper>
			<div style={{ backgroundColor: "rgb(50, 50, 0)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(50, 50, 120)" }} className="h-4 w-4 " />
			<div style={{ backgroundColor: "rgb(50, 50, 255)" }} className="h-4 w-4 " />
		</Wrapper>
	);
}
