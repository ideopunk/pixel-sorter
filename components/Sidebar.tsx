import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useTheme } from "next-themes";
import SunSvg from "./SunSvg";
import MoonSvg from "./MoonSVG";
import QuestionMark from "./QuestionMarkSvg";
import Link from "next/link";
import {
	arrayOfDirections,
	arrayOfIntervalStyles,
	arrayOfSortingStyles,
	Direction,
	IntervalStyle,
	Options,
	SortingStyle,
} from "../library/types";

type Dimensions = { width: number; height: number };

export default function Sidebar({
	draw,
	reset,
	updateFile,
}: {
	draw: (options: Options) => void;
	reset: () => void;
	updateFile: (f: File) => void;
}) {
	const [direction, setDirection] = useState<Direction>("down-to-left");
	const [sortingStyle, setSortingStyle] = useState<SortingStyle>("lightness");
	const [intervalStyle, setIntervalStyle] = useState<IntervalStyle>("threshold");
	const [threshold, setThreshold] = useState<[number, number]>([25, 80]);

	const { theme, setTheme } = useTheme();

	function handleDirection(newDir: string) {
		if (arrayOfDirections.includes(newDir as Direction)) setDirection(newDir as Direction);
	}

	function sendDraw() {
		draw({ direction, sortingStyle, intervalStyle, threshold });
	}

	useEffect(() => {
		if (sortingStyle === "red" || sortingStyle === "green" || sortingStyle === "blue") {
			setThreshold([100, 200]);
		} else if (sortingStyle === "hue") {
			setThreshold([150, 250]);
		} else {
			setThreshold([25, 80]);
		}
	}, [sortingStyle]);
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
				<label className="relative pt-12 ">
					Thresholds. <span>Min: {threshold[0]}</span> <span>Max: {threshold[1]}</span>
					<Slider.Root
						className="relative flex items-center w-full h-6 select-none"
						min={0}
						max={
							sortingStyle === "red" ||
							sortingStyle === "green" ||
							sortingStyle === "blue"
								? 255
								: sortingStyle === "hue"
								? 360
								: 100
						}
						value={threshold}
						onValueChange={([min, max]) => setThreshold([min, max])}
						minStepsBetweenThumbs={1}
					>
						<Slider.Track className="relative flex-grow h-1 bg-gray-900 rounded-full outline-none">
							<Slider.Range className="absolute h-full bg-indigo-500 rounded-full outline-none" />
						</Slider.Track>
						<Slider.Thumb
							className="z-50 block w-4 h-4 font-bold bg-indigo-500 rounded-full shadow-xl outline-none ring-indigo-400 focus:ring-4 "
							data-tip="1.0"
						/>
						<Slider.Thumb
							className="z-50 block w-4 h-4 font-bold bg-indigo-500 rounded-full shadow-xl outline-none ring-indigo-400 focus:ring-4 "
							data-tip="1.0"
						/>
					</Slider.Root>
					{/* <Slider.Root
						defaultValue={[25, 75]}
						value={threshold}
						onValueChange={([min, max]) => setThreshold([min, max])}
						minStepsBetweenThumbs={1}
						className="w-[200px] relative h-5 flex items-center border-2 select-none touch-none "
					>
						<Slider.Track className="relative w-20 rounded-full bg-black h-1">
							<Slider.Range className="h-full bg-blue-400 rounded-full" />
						</Slider.Track>
						<Slider.Thumb className="w-5 h-5 bg-white shadow-md block" />
						<Slider.Thumb className="w-5 h-5 bg-white shadow-md block" />
					</Slider.Root> */}
				</label>
			)}

			<input
				id="fileinput"
				name="fileinput"
				type="file"
				accept=".jpg, .jpeg, .png"
				onChange={(e) => {
					if (e.target.files) {
						updateFile(e.target.files[0]);
					}
				}}
				className="file:border-0 file:bg-black file:text-white dark:file:bg-white dark:file:text-black  file:rounded-full hover:file:underline file:p-3  file:opacity-90 hover:file:opacity-100 transition-opacity file:w-full file:cursor-pointer mb-4 pt-8"
			/>

			<button
				className="border-0 bg-black text-white dark:bg-white dark:text-black rounded-full hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-full cursor-pointer mb-4 "
				onClick={sendDraw}
			>
				GLITCH
			</button>

			<button
				className=" bg-white text-black dark:bg-black dark:text-white border-2 border-black dark:border-white rounded-full hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-full cursor-pointer mb-4"
				onClick={reset}
			>
				Reset to Original Image
			</button>

			<div className="flex  items-center lg:h-20 justify-evenly ">
				<button
					title="Toggle theme"
					onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					className="w-8 h-8 hover:scale-125 transition-transform mx-10 lg:mx-0"
				>
					{theme === "light" ? <SunSvg /> : <MoonSvg />}
				</button>
				<Link href="/about">
					<a className="w-8 h-8  hover:scale-125 transition-transform">
						<QuestionMark />
					</a>
				</Link>
			</div>
		</div>
	);
}
