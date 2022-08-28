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
import rangeBackgrounds from "../library/rangeBackgrounds";
import FrameSVG from "./svgs/FrameSVG";
import Links from "./Links";
import { ArrowsDown, ArrowsLeft, ArrowsRight, ArrowsUp } from "./DirectionOptions";
import Dropdown from "./SidebarDropdown";
import X from "./svgs/XSvg";
import { IntervalNone, IntervalRandom, IntervalThreshold } from "./IntervalBars";
import {
	SortHue,
	SortSaturation,
	SortBlue,
	SortGreen,
	SortLightness,
	SortRed,
} from "./SortingBars";

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
	const [current, setCurrent] = useState<
		"" | "direction" | "sorting style" | "interval style" | "masking"
	>("");
	const [direction, setDirection] = useState<Direction>("up");
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

	// we don't yet need an FSM
	function handleCurrent(s: "direction" | "sorting style" | "interval style" | "masking") {
		if (current === s) {
			setCurrent("");
		} else {
			setCurrent(s);
		}
	}

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
		<div className="lg:h-screen  w-full lg:w-96 flex flex-col lg:justify-between bg-neutral-200 dark:bg-neutral-800 p-4 sm:p-0">
			<div className=" border-gray-400 lg:p-2 max-w-lg w-full self-center bg-white lg:bg-neutral-200 dark:bg-black dark:lg:bg-neutral-800 rounded-lg shadow lg:shadow-none p-6 mb-8 mt-6 lg:mb-0 pb-0 lg:block order-last lg:order-none">
				{/* DIRECTION */}
				<Dropdown
					title="direction"
					value={direction}
					setValue={handleDirection}
					options={[
						{
							name: "up",
							element: <ArrowsUp />,
						},
						{
							name: "down",
							element: <ArrowsDown />,
						},
						{
							name: "left",
							element: <ArrowsLeft />,
						},
						{
							name: "right",
							element: <ArrowsRight />,
						},
					]}
					current={current}
					toggle={() => handleCurrent("direction")}
				/>

				{/* SORTING STYLE */}
				<Dropdown
					title="sorting style"
					value={sortingStyle}
					setValue={setSortingStyle}
					options={[
						{ name: "hue", element: <SortHue /> },
						{ name: "saturation", element: <SortSaturation /> },
						{ name: "lightness", element: <SortLightness /> },
						{ name: "red", element: <SortRed /> },
						{ name: "green", element: <SortGreen /> },
						{ name: "blue", element: <SortBlue /> },
					]}
					current={current}
					toggle={() => handleCurrent("sorting style")}
				/>

				{/* INTERVAL STYLE */}
				<Dropdown
					title="interval style"
					value={intervalStyle}
					setValue={setIntervalStyle}
					options={[
						{
							name: "none",
							element: <IntervalNone />,
						},
						{
							name: "threshold",
							element: <IntervalThreshold />,
						},
						{
							name: "random",
							element: <IntervalRandom />,
						},
					]}
					current={current}
					toggle={() => handleCurrent("interval style")}
					// {/* THRESHOLD */}
					bonus={
						<div className="order-last p-4 lg:px-0 w-full py-4">
							{(intervalStyle === "threshold" || intervalStyle === "random") && (
								<label className="relative font-bold">
									{intervalStyle === "threshold" ? "Thresholds" : "Band Range"}
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
									<span>Min: {threshold[0]}</span> /{" "}
									<span>Max: {threshold[1]}</span>
								</label>
							)}
						</div>
					}
				/>

				{/* MASKING STYLE */}
				<Dropdown
					title="masking"
					value={mask}
					setValue={setMask}
					options={[
						{
							name: "none",
							element: (
								<div className="flex justify-center items-center mt-1">
									<div className="border-2 w-min self-center justify-self-center rounded-md border-black dark:border-white">
										<div className="flex">
											<X />
											<X />
										</div>
										<div className="flex">
											<X />
											<X />
										</div>
									</div>
								</div>
							),
						},
						{
							name: "regular",
							element: (
								<div className="flex justify-center items-center mt-1">
									<div className="border-2 w-min self-center justify-self-center rounded-md border-black dark:border-white">
										<div className="flex">
											<X />
											<X />
										</div>
										<div className="flex">
											<X />
											<div className="border-l border-t border-dashed border-black dark:border-white w-1/2" />
										</div>
									</div>
								</div>
							),
						},
						{
							name: "inverted",
							element: (
								<div className="flex justify-center items-center mt-1">
									<div className="border-2 w-min self-center justify-self-center rounded-md border-black dark:border-white">
										<div className="flex opacity-0">
											<X />
											<X />
										</div>
										<div className="border-r border-t border-dashed border-black dark:border-white w-1/2">
											<X />
										</div>
									</div>
								</div>
							),
						},
					]}
					current={current}
					toggle={() => handleCurrent("masking")}
				/>

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

			<div className="flex-col items-center  flex lg:block">
				{/* BUTTONS */}
				<div
					className={`max-w-lg p-4 w-full pb-0 order-last lg:order-none ${
						current && "lg:hidden"
					}`}
				>
					<div className="flex bg-white text-black dark:bg-black  dark:text-white shadow dark:border-white rounded-full items-center divide-x-2 h-12">
						<label
							htmlFor="fileinput"
							className="w-full text-center py-4  font-bold cursor-pointer hover:underline"
						>
							Choose image
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
						className={`flex bg-white shadow text-black dark:bg-black  dark:text-white  rounded-full items-center divide-x-2 my-4 h-12 divide-black dark:divide-white ${
							!previous ? "opacity-50" : "opacity-90 cursor-pointer"
						}`}
					>
						<button
							className={`${
								previous && "hover:underline cursor-pointer"
							} p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-1/2 `}
							disabled={!previous}
							onClick={undo}
						>
							Undo
						</button>
						<button
							className={`${
								previous && "hover:underline cursor-pointer"
							} p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-1/2 `}
							disabled={!previous}
							onClick={reset}
						>
							Reset
						</button>
					</div>

					<button
						className={`shadow hover:underline p-3 font-bold hover:bg-black transition-color w-full rounded-full cursor-pointer bg-neutral-800 text-white dark:bg-white  dark:text-black ${
							waiting && "animate-pulse"
						}`}
						disabled={waiting}
						onClick={sendDraw}
					>
						{waiting ? "Glitching..." : "Glitch!"}
					</button>

					<div className="h-20 pt-8 flex items-center justify-center">
						{!newImage && !waiting && window.isSecureContext && (
							<button
								className="hover:underline p-3 font-bold opacity-90 hover:opacity-100 transition-opacity w-full rounded-full  cursor-pointer bg-white text-black dark:bg-black  dark:text-white shadow dark:border-white"
								onClick={handleShare}
							>
								Share
							</button>
						)}
					</div>
				</div>
				<div className={`max-w-lg w-full ${current && "lg:hidden"}`}>
					<Links />
				</div>
			</div>
		</div>
	);
}
