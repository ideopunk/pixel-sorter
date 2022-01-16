import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useTheme } from "next-themes";
import SunSvg from "./SunSvg";
import MoonSvg from "./MoonSVG";
import QuestionMark from "./QuestionMarkSvg";
import Link from "next/link";

const arrayOfDirections = [
	"up",
	"down",
	"left",
	"right",
	"up-to-left",
	"down-to-left",
	"up-to-right",
	"down-to-right",
	"left-to-up",
	"left-to-down",
	"right-to-up",
	"right-to-down",
] as const;

const arrayOfSortingStyles = [
	"lightness",
	"hue",
	"saturation",
	"intensity",
	"red",
	"green",
	"blue",
] as const;

const arrayOfIntervalStyles = ["threshold", "random", "none"] as const;

type IntervalStyle = typeof arrayOfIntervalStyles[number];
type SortingStyle = typeof arrayOfSortingStyles[number];
type Direction = typeof arrayOfDirections[number];

export default function Sidebar({ updateFile }: { updateFile: (f: File) => void }) {
	const [direction, setDirection] = useState<Direction>("down-to-left");
	const [sortingStyle, setSortingStyle] = useState<SortingStyle>("lightness");
	const [intervalStyle, setIntervalStyle] = useState<IntervalStyle>("none");
	const [threshold, setThreshold] = useState<[number, number]>([0.25, 0.8]);

	const { theme, setTheme } = useTheme();

	function handleDirection(newDir: string) {
		if (arrayOfDirections.includes(newDir as Direction)) setDirection(newDir as Direction);
	}

	function handleReset() {
		console.log("reset!");
	}

	return (
		<div className="h-screen border-r-2 p-4 w-96">
			{/* DIRECTION */}
			<label className="pb-12 block">
				Direction
				<select
					value={direction}
					onChange={(e) => {
						handleDirection(e.target.value);
					}}
					className="block"
				>
					{arrayOfDirections.map((dir) => (
						<option key={dir} value={dir}>
							{dir}
						</option>
					))}
				</select>
			</label>

			{/* SORTING STYLE */}
			<label className="pb-12 block">
				Sorting Style
				<select
					value={sortingStyle}
					onChange={(e) => {
						setSortingStyle(e.target.value as SortingStyle);
					}}
					className="block"
				>
					{arrayOfSortingStyles.map((sortstyle) => (
						<option key={sortstyle} value={sortstyle}>
							{sortstyle}
						</option>
					))}
				</select>
			</label>

			{/* INTERVAL STYLE */}
			<label className="pb-12 block">
				Interval Style
				<select
					value={intervalStyle}
					onChange={(e) => {
						setIntervalStyle(e.target.value as IntervalStyle);
					}}
					className="block"
				>
					{arrayOfIntervalStyles.map((intervalstyle) => (
						<option key={intervalstyle} value={intervalstyle}>
							{intervalstyle}
						</option>
					))}
				</select>
			</label>

			{/* THRESHOLD */}
			{intervalStyle === "threshold" && (
				<label className="relative pt-12">
					Thresholds
					<Slider.Root
						defaultValue={[25, 75]}
						minStepsBetweenThumbs={1}
						className="w-[200px] relative h-5 flex items-center "
					>
						<Slider.Track className="relative w-20 rounded-full bg-black h-1">
							<Slider.Range className="h-full absolute bg-white rounded-full" />
						</Slider.Track>
						<Slider.Thumb className="w-5 h-5 bg-white shadow-md" />
						<Slider.Thumb className="w-5 h-5 bg-white shadow-md" />
					</Slider.Root>
				</label>
			)}
			<button
				title="Toggle theme"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="w-8 h-8 hover:scale-125 transition-transform mx-10 lg:mx-0"
			>
				{theme === "light" ? <SunSvg /> : <MoonSvg />}
			</button>

			<input
				id="fileinput"
				name="fileinput"
				type="file"
				accept=".jpg, .png"
				onChange={(e) => {
					if (e.target.files) {
						updateFile(e.target.files[0]);
					}
				}}
				className="file:border-0 file:bg-black file:text-white dark:file:bg-white dark:file:text-black  file:rounded-full hover:file:underline file:p-3 file:font-bold file:opacity-90 hover:file:opacity-100 transition-opacity file:w-full file:cursor-pointer mb-4"
			/>

			<button onClick={handleReset}>Reset to Original Image</button>
			<div className="flex lg:flex-col items-center lg:h-20 justify-between ">
				<Link href="/about">
					<a className="w-8 h-8  hover:scale-125 transition-transform">
						<QuestionMark />
					</a>
				</Link>
			</div>
		</div>
	);
}
