import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

import {
	arrayOfDirections,
	arrayOfIntervalStyles,
	arrayOfMaskOptions,
	arrayOfSortingStyles,
	Direction,
	IntervalStyle,
	MaskOptions,
	Options,
	SortingStyle,
} from "../library/types";
import toTitleCase from "../library/toTitleCase";
import rangeBackgrounds from "../library/rangeBackgrounds";
import FrameSVG from "./FrameSVG";
import Links from "./Links";

type Dimensions = { width: number; height: number };

function Select({
	title,
	value,
	setValue,
	options,
	style,
}: {
	title: string;
	value: string;
	setValue: (s: any) => void;
	options: readonly string[];
	style?: string;
}) {
	return (
		<label
			className={`mb-4 flex p-4 lg:p-0 items-center justify-between font-bold w-1/2 lg:w-full ${style}`}
		>
			{title}
			<select
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				className="appearance-none block p-1 pr-2 w-24 text-right bg-white dark:bg-black border-black dark:border-white border-2 rounded-md"
			>
				{options.map((opt) => (
					<option key={opt} value={opt}>
						{toTitleCase(opt)}
					</option>
				))}
			</select>
		</label>
	);
}

export default function Sidebar({
	waiting,
	mask,
	newImage,
	setMask,
	draw,
	reset,
	undo,
	previous,
	updateFile,
	handleShare,
}: {
	waiting: boolean;
	mask: MaskOptions;
	newImage: boolean;
	setMask: (m: MaskOptions) => void;
	draw: (options: Options) => void;
	reset: () => void;
	undo: () => void;
	previous: boolean;
	updateFile: (f: File) => void;
	handleShare: () => void;
}) {
	const [direction, setDirection] = useState<Direction>("down");
	const [sortingStyle, setSortingStyle] = useState<SortingStyle>("lightness");
	const [intervalStyle, setIntervalStyle] = useState<IntervalStyle>("threshold");
	const [threshold, setThreshold] = useState<[number, number]>([25, 80]);

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
		<div className="lg:h-screen border-r-2 w-full lg:w-96 flex flex-col lg:justify-between">
			<div className=" border-gray-400 lg:p-4 pb-0 flex flex-wrap items-center lg:block">
				{/* DIRECTION */}
				<Select
					title="Direction"
					value={direction}
					setValue={handleDirection}
					options={arrayOfDirections}
				/>

				{/* SORTING STYLE */}
				<Select
					title="Sorting Style"
					value={sortingStyle}
					setValue={setSortingStyle}
					options={arrayOfSortingStyles}
				/>

				{/* INTERVAL STYLE */}
				<Select
					title="Interval Style"
					value={intervalStyle}
					setValue={setIntervalStyle}
					options={arrayOfIntervalStyles}
				/>

				{/* MASKING STYLE */}
				<Select
					title="Masking"
					value={mask}
					setValue={setMask}
					options={arrayOfMaskOptions}
				/>

				{/* THRESHOLD */}
				<div className="order-last p-4 lg:px-0 w-full py-4">
					{(intervalStyle === "threshold" || intervalStyle === "random") && (
						<label className="relative font-bold">
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
				</div>

				{/* <label className="font-bold p-4 lg:p-0 lg:pt-3 flex items-baseline w-1/2">
					Masking{" "}
					<input
						className="ml-4 appearance-none w-4 h-4 rounded-md border-2 border-black dark:border-white checked:bg-gray-900 dark:checked:bg-gray-200 relative top-0.5"
						checked={mask}
						type="checkbox"
						onChange={(e) => setMask(e.target.checked)}
					/>
				</label> */}
			</div>

			{/* BUTTONS */}
			<div className="p-4 pb-0 order-last lg:order-none">
				<div className="flex bg-white text-black dark:bg-black  dark:text-white border-2 border-black dark:border-white rounded-full items-center divide-x-2 my-4 h-12">
					<label
						htmlFor="fileinput"
						className="w-full text-center  font-bold cursor-pointer hover:underline"
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
				</div>
				<div
					className={`flex bg-white text-black dark:bg-black  dark:text-white border-2 border-black dark:border-white rounded-full items-center divide-x-2 my-4 h-12 divide-black dark:divide-white ${
						!previous ? "opacity-50" : "opacity-90 cursor-pointer"
					}`}
				>
					<button
						className={`hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-1/2 `}
						disabled={!previous}
						onClick={undo}
					>
						Undo
					</button>
					<button
						className="  hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-1/2 cursor-pointer "
						disabled={!previous}
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

				<div className="h-20 flex items-center justify-center">
					{!newImage && !waiting && window.isSecureContext && (
						<button
							className="  hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-full rounded-full  cursor-pointer bg-white text-black dark:bg-black  dark:text-white border-2 border-black dark:border-white"
							onClick={handleShare}
						>
							Share
						</button>
					)}
				</div>
			</div>
			<Links />
		</div>
	);
}
