import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Direction, IntervalStyle, Options, SortingStyle } from "../library/types";
import { NextSeo } from "next-seo";
// import Draggable from "draggable";

type Dimensions = { width: number; height: number };

export default function Home() {
	const [imageDimensions, setImageDimensions] = useState<Dimensions>({ width: 0, height: 0 });
	const [imageUrl, setImageUrl] = useState("./defaultimage.png");
	const [newImage, setNewImage] = useState(true);

	// ui stuff
	const [waiting, setWaiting] = useState(false);
	const [toast, setToast] = useState(false);

	// mask stuff
	const [mask, setMask] = useState(false);
	const [maskPosition, setMaskPosition] = useState({});

	const draggableRef = useRef<HTMLDivElement>(null);
	const handleRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		async function fn() {
			if (mask) {
				// @ts-ignore
				const Draggable = (await import("draggable")).default;

				new Draggable(draggableRef.current, {
					handle: handleRef.current,
					limit: imageRef.current,
					// limit: {
					// 	x: [bounds[0], bounds[0] + imageDimensions.width],
					// 	y: [bounds[1], bounds[1] + imageDimensions.height],
					// 	// y: [(700 - imageDimensions.height) / 2, imageDimensions.height],
					// },
					onDragEnd: (el: HTMLElement, x: number, y: number, event: any) => {
						console.log(x, y, event);
						const rect = el.getBoundingClientRect();
						console.log(rect);
						setMaskPosition({ x, y, width: rect.width, height: rect.height });
					},
				});
			}
		}

		fn();
	}, [mask, imageDimensions.width, imageDimensions.height]);

	const workerRef = useRef<Worker>();

	useEffect(() => {
		workerRef.current = new Worker(new URL("../library/pixel.worker.ts", import.meta.url));
		workerRef.current.addEventListener(
			"message",
			(e: MessageEvent<ImageData>) => {
				const ctx = canvasRef.current?.getContext("2d");
				if (ctx) {
					ctx.putImageData(e.data, 0, 0);
				}
				setWaiting(false);
			},
			false
		);

		workerRef.current.addEventListener(
			"error",
			(err) => {
				setWaiting(false);
				console.log(err);
				alert(err.message);
			},
			false
		);
	}, []);

	const draw = useCallback(
		({ direction, sortingStyle, intervalStyle, threshold }: Options) => {
			if (workerRef.current && imageRef.current) {
				setWaiting(true);
				const ctx = canvasRef.current?.getContext("2d");

				if (newImage) {
					ctx?.drawImage(imageRef.current, 0, 0); // use this if nothing else!
					setNewImage(false);
				}

				const imageData = ctx?.getImageData(
					0,
					0,
					imageDimensions.width,
					imageDimensions.height
				);

				if (imageData?.data) {
					workerRef.current.postMessage({
						data: imageData.data,
						width: imageDimensions.width,
						height: imageDimensions.height,
						options: { direction, sortingStyle, intervalStyle, threshold },
					});
				}
			}
		},
		[imageDimensions, newImage]
	);

	async function handleShare() {
		if (window.isSecureContext) {
			const dataUrl = canvasRef.current?.toDataURL();
			if (!dataUrl) throw new Error("no data url found");
			const res = await fetch(dataUrl);

			const blob = await res.blob();

			if (!!navigator.share) {
				const filesArray = [
					new File([blob], "pielsorted.png", {
						type: blob.type,
						lastModified: new Date().getTime(),
					}),
				];

				await navigator.share({ files: filesArray, title: "Pixel Sorted!" });
			} else {
				const clipboardItem = new ClipboardItem({ [blob.type]: blob });

				await navigator.clipboard.write([clipboardItem]);
				setToast(true);
			}
		}
	}

	useEffect(() => {
		if (toast) {
			setTimeout(() => {
				setToast(false);
			}, 1000);
		}
	}, [toast]);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	// derive canvas dimension
	useEffect(() => {
		if (!canvasRef.current) return;
		canvasRef.current.width = imageDimensions.width;
		canvasRef.current.height = imageDimensions.height;
	}, [imageDimensions]);

	// get dimensions of new file
	const convertUrlToImage = useCallback(
		(url: string) => {
			setNewImage(true);
			if (imageRef.current) {
				imageRef.current.src = url;

				imageRef.current.onload = () => {
					if (imageRef.current?.height && imageRef.current.width && canvasRef.current) {
						const ctx = canvasRef.current?.getContext("2d");
						canvasRef.current.width = imageDimensions.width;
						canvasRef.current.height = imageDimensions.height;

						// ctx?.drawImage(imageRef.current, 0, 0);

						setImageDimensions({
							// height: imageRef.current.clientHeight,
							// width: imageRef.current.clientWidth,
							height: imageRef.current.naturalHeight || imageRef.current.height,
							width: imageRef.current.naturalWidth || imageRef.current.width,
						});
					}
				};
				imageRef.current.onerror = (err: any) => {
					console.error(err);
					if (typeof err === "object" && "message" in err) console.log(err.message);
				};
			}
		},
		[imageDimensions.height, imageDimensions.width]
	);

	useEffect(() => {
		convertUrlToImage(imageUrl);
	}, [convertUrlToImage, imageUrl]);

	// new file
	async function updateFile(newFile: File) {
		const fileAsDataURL = URL.createObjectURL(newFile);
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			if (reader.result) {
				if (typeof reader.result !== "string") {
					console.log("huh?");
					return;
				}

				setImageUrl(reader.result);
			}
		});
		reader.readAsDataURL(newFile);
	}

	function handleReset() {
		if (imageRef.current) {
			const ctx = canvasRef.current?.getContext("2d");
			ctx?.drawImage(imageRef.current, 0, 0);
		}
	}

	return (
		<div className="w-screen lg:h-screen dark:bg-black flex flex-col lg:flex-row justify-center items-center">
			<NextSeo
				title="Pixel Sorter"
				canonical="https://pixel-sorter.com"
				description="Create glitch art"
				openGraph={{
					title: "Pixel Sorter",
					description: "Create glitch art",
					url: "https://pixel-sorter.com",
				}}
			/>
			<Sidebar
				draw={draw}
				reset={handleReset}
				waiting={waiting}
				updateFile={updateFile}
				mask={mask}
				setMask={setMask}
				newImage={newImage}
				handleShare={handleShare}
			/>
			<main className="z-10 w-full lg:h-full flex justify-center items-center flex-col p-4">
				<div className="w-[500px]  h-[500px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[700px] max-w-full  relative flex items-center justify-center">
					<div className="relative">
						<img ref={imageRef} alt="test-image" src="" className="object-contain" />

						<div
							ref={draggableRef}
							draggable
							className={`absolute w-40 overflow-auto bg-black bg-opacity-30 z-20 h-40 resize border-2 top-0 left-0 max-w-full max-h-full ${
								mask ? "visible" : "invisible"
							}`}
						>
							<div ref={handleRef} className="w-11/12 h-full cursor-pointer" />
						</div>
					</div>
					<canvas
						onClick={handleShare}
						ref={canvasRef}
						className="w-[500px] h-[500px]  md:w-[600px] md:h-[600px]  lg:w-[800px] lg:h-[700px] max-w-full top-0 left-0 absolute object-contain"
					/>
				</div>
				{/* <button className="absolute bottom-0 left-0">
					{!!mask &&
						`Client top ${draggableRef.current?.clientTop}, client lieft ${draggableRef.current?.clientLeft}, client height ${draggableRef.current?.clientHeight}, client width ${draggableRef.current?.clientWidth}`}
				</button> */}

				<div className="absolute bottom-4 w-full left-0 flex justify-center">
					<div
						className={`${
							!toast ? "opacity-0" : "opacity-100"
						} transition-opacity duration-700 w-24 bg-black dark:bg-white text-white dark:text-black text-center rounded-sm`}
					>
						<p className="font-sans font-bold tracking-wide text-lg ">COPIED</p>
					</div>
				</div>
			</main>
		</div>
	);
}
