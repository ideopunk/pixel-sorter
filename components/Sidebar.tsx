import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

import {
	arrayOfDirections,
	arrayOfIntervalStyles,
	arrayOfSortingStyles,
	Direction,
	IntervalStyle,
	Options,
	SortingStyle,
} from "../library/types";
import toTitleCase from "../library/toTitleCase";
import rangeBackgrounds from "../library/rangeBackgrounds";
import FrameSVG from "./FrameSVG";
import Links from "./Links";

type Dimensions = { width: number; height: number };

export default function Sidebar({
	waiting,
	mask,
	setMask,
	draw,
	reset,
	updateFile,
}: {
	waiting: boolean;
	mask: boolean;
	setMask: (b: boolean) => void;
	draw: (options: Options) => void;
	reset: () => void;
	updateFile: (f: File) => void;
}) {
	const [direction, setDirection] = useState<Direction>("down");
	const [sortingStyle, setSortingStyle] = useState<SortingStyle>("lightness");
	const [intervalStyle, setIntervalStyle] = useState<IntervalStyle>("threshold");
	const [threshold, setThreshold] = useState<[number, number]>([25, 80]);
	const [masking, setMasking] = useState(false);

	function handleDirection(newDir: string) {
		if (arrayOfDirections.includes(newDir as Direction)) setDirection(newDir as Direction);
	}

	function sendDraw() {
		window.scrollTo({ top: 1000, behavior: "smooth" });
		draw({ direction, sortingStyle, intervalStyle, threshold });
	}

	const [trackBG, leftBG, rightBG] = rangeBackgrounds(sortingStyle, threshold[0], threshold[1]);

	useEffect(() => {
		if (intervalStyle === "threshold")
			if (sortingStyle === "red" || sortingStyle === "green" || sortingStyle === "blue") {
				setThreshold([100, 200]);
			} else if (sortingStyle === "hue") {
				setThreshold([150, 250]);
			} else {
				setThreshold([25, 80]);
			}
		else if (intervalStyle === "random") {
			setThreshold([0, 10]);
		}
	}, [sortingStyle, intervalStyle]);
	return (
		<div className="lg:h-screen border-r-2 w-full lg:w-96">
			<div className="border-b border-gray-400 p-4 pb-6">
				{/* DIRECTION */}
				<label className="pb-12 block font-bold">
					Direction
					<select
						value={direction}
						onChange={(e) => {
							handleDirection(e.target.value);
						}}
						className="block p-1 w-3/5 bg-white dark:bg-black border-black dark:border-white border-2 rounded-md"
					>
						{arrayOfDirections.map((dir) => (
							<option key={dir} value={dir}>
								{toTitleCase(dir)}
							</option>
						))}
					</select>
				</label>

				{/* SORTING STYLE */}
				<label className="pb-12 block font-bold">
					Sorting Style
					<select
						value={sortingStyle}
						onChange={(e) => {
							setSortingStyle(e.target.value as SortingStyle);
						}}
						className="block p-1 w-3/5 bg-white dark:bg-black border-black dark:border-white border-2 rounded-md"
					>
						{arrayOfSortingStyles.map((sortstyle) => (
							<option key={sortstyle} value={sortstyle}>
								{toTitleCase(sortstyle)}
							</option>
						))}
					</select>
				</label>

				{/* INTERVAL STYLE */}
				<label className="pb-12 block font-bold">
					Interval Style
					<select
						value={intervalStyle}
						onChange={(e) => {
							setIntervalStyle(e.target.value as IntervalStyle);
						}}
						className="block p-1 w-3/5 bg-white dark:bg-black border-black dark:border-white border-2 rounded-md"
					>
						{arrayOfIntervalStyles.map((intervalstyle) => (
							<option key={intervalstyle} value={intervalstyle}>
								{toTitleCase(intervalstyle)}
							</option>
						))}
					</select>
				</label>

				{/* THRESHOLD */}
				{(intervalStyle === "threshold" || intervalStyle === "random") && (
					<label className="relative font-bold pt-12 ">
						Thresholds
						<Slider.Root
							className="relative flex items-center w-full h-6 select-none"
							min={0}
							max={
								intervalStyle === "random"
									? 200
									: sortingStyle === "red" ||
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
							<Slider.Track className="relative flex-grow h-1 bg-gray-200 dark:bg-gray-800 rounded-full outline-none">
								<Slider.Range
									style={{ backgroundColor: trackBG }}
									className="absolute h-full bg-black dark:bg-white rounded-full outline-none"
								/>
							</Slider.Track>
							<Slider.Thumb
								style={{ backgroundColor: leftBG }}
								className="z-50 block w-4 h-4 font-bold bg-black dark:bg-white rounded-full shadow-xl outline-none ring-gray-400 focus:ring-4 border-gray-400 border"
								data-tip="1.0"
							/>
							<Slider.Thumb
								style={{ backgroundColor: rightBG }}
								className="z-50 block w-4 h-4 font-bold bg-black dark:bg-white rounded-full shadow-xl outline-none ring-gray-400 focus:ring-4 border-gray-400 border "
								data-tip="1.0"
							/>
						</Slider.Root>
						<span>Min: {threshold[0]}</span> / <span>Max: {threshold[1]}</span>
					</label>
				)}

				<label className="font-bold pt-12 flex items-baseline">
					Masking{" "}
					<input
						className="ml-4 appearance-none w-4 h-4 rounded-md border-2 border-black dark:border-white checked:bg-gray-900 dark:checked:bg-gray-200 relative top-0.5"
						checked={mask}
						type="checkbox"
						onChange={(e) => setMask(e.target.checked)}
					/>
				</label>
			</div>

			{/* BUTTONS */}
			<div className="p-4">
				<div className="flex bg-white text-black dark:bg-black  dark:text-white border-2 border-black dark:border-white rounded-full items-center divide-x-2 my-4 h-12 divide-black dark:divide-white">
					<label
						htmlFor="fileinput"
						className="w-1/2 text-center  font-bold cursor-pointer hover:underline"
					>
						Choose file
					</label>
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
						className="hidden"
					/>
					<button
						className="  hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-1/2 cursor-pointer "
						onClick={reset}
					>
						Reset
					</button>
				</div>

				<button
					className={`border-0 hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-full rounded-full cursor-pointer bg-black text-white dark:bg-white  dark:text-black ${
						waiting && "animate-pulse"
					}`}
					disabled={waiting}
					onClick={sendDraw}
				>
					{waiting ? "Glitching..." : "Glitch!"}
				</button>
				<Links />
			</div>
		</div>
	);
}
