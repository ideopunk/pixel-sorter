import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Rect, Options, SortingStyle, MaskOptions } from "../library/types";
import { NextSeo } from "next-seo";
// import { ctx } from "../library/pixel.worker";

type Dimensions = { width: number; height: number };

export default function Home() {
	const [imageDimensions, setImageDimensions] = useState<Dimensions>({ width: 0, height: 0 });
	const [imageUrl, setImageUrl] = useState("./defaultimage.png");
	const [newImage, setNewImage] = useState(true);
	const [previous, setPrevious] = useState<Uint8ClampedArray>();

	// ui stuff
	const [waiting, setWaiting] = useState(false);
	const [toast, setToast] = useState(false);

	// mask stuff
	const [mask, setMask] = useState<MaskOptions>("none");
	const [maskPosition, setMaskPosition] = useState<Rect>();

	// MASKING
	const containerRef = useRef<HTMLDivElement>(null);
	const draggableRef = useRef<HTMLDivElement>(null);
	const handleRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		async function fn() {
			if (mask !== "none" && draggableRef.current) {
				// @ts-ignore
				const Draggable = (await import("draggable")).default;

				new Draggable(draggableRef.current, {
					handle: handleRef.current,
					// limit: imageRef.current,
					limit: {
						x: [0, imageDimensions.width],
						y: [0, imageDimensions.height],
					},
					onDragEnd: (el: HTMLElement, x: number, y: number, event: any) => {
						const rect = el.getBoundingClientRect();
						setMaskPosition({ x, y, width: rect.width, height: rect.height });
					},
				});
			}
		}

		fn();
	}, [mask, imageDimensions.width, imageDimensions.height]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				setMaskPosition((prev) => {
					return {
						x: prev?.x || 0,
						y: prev?.y || 0,
						width: entry.contentRect.width,
						height: entry.contentRect.height,
					};
				});
			}
		});

		if (draggableRef.current) {
			resizeObserver.observe(draggableRef.current);

			return () => {
				if (draggableRef.current) {
					resizeObserver.unobserve(draggableRef.current);
				}
			};
		}
	}, []);

	// GLITCHING
	const workerRef = useRef<Worker>();
	useEffect(() => {
		workerRef.current = new Worker(
			new URL("../library/pixelsorting/pixel.worker.ts", import.meta.url)
		);
		workerRef.current.addEventListener(
			"message",
			(e: MessageEvent<ImageData>) => {
				console.log("end: ", Date.now());

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
				alert(err.message);
				throw err;
			},
			false
		);

		return () => {
			workerRef.current?.terminate();
		};
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

				// this is separate from the above newImage conditional because we need to get the imageData before writing it to previous.
				console.log(imageData?.data.length);
				setPrevious(imageData?.data);

				const containerY = containerRef.current?.getBoundingClientRect().y;
				const flexedY = canvasRef.current?.getBoundingClientRect().y;

				const adjustedY = (flexedY || 0) - (containerY || 0);

				const widthAdjustment = imageDimensions.width / imageRef.current.width;
				const heightAdjustment = imageDimensions.height / imageRef.current.height;

				const adjustedMaskPosition: Rect | undefined =
					mask !== "none"
						? {
								x:
									(maskPosition?.x || 0) *
									(imageDimensions.width / imageRef.current.width),
								y:
									((maskPosition?.y || 0) + adjustedY) *
									(imageDimensions.height / imageRef.current.height),
								width:
									(maskPosition?.width || 0) *
									(widthAdjustment < 1 ? 1 : widthAdjustment),
								height:
									(maskPosition?.height || 0) *
									(heightAdjustment < 1 ? 1 : heightAdjustment),
						  }
						: undefined;
				if (imageData?.data) {
					console.log("start: ", Date.now());
					workerRef.current.postMessage({
						data: imageData.data,
						width: imageDimensions.width,
						height: imageDimensions.height,
						options: {
							direction,
							sortingStyle,
							intervalStyle,
							threshold,
							mask: adjustedMaskPosition,
							invertedMask: mask === "inverted",
						} as Options,
					});
				}
			}
		},
		[imageDimensions, newImage, maskPosition, mask]
	);

	async function handleShare() {
		if (window.isSecureContext) {
			const dataUrl = canvasRef.current?.toDataURL();
			if (!dataUrl) throw new Error("no data url found");
			const res = await fetch(dataUrl);

			const blob = await res.blob();

			if (!!navigator.share) {
				const filesArray = [
					new File([blob], "pixelsorted.png", {
						type: "image/png",
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
						canvasRef.current.width = imageDimensions.width;
						canvasRef.current.height = imageDimensions.height;

						setImageDimensions({
							height: imageRef.current.naturalHeight || imageRef.current.height,
							width: imageRef.current.naturalWidth || imageRef.current.width,
						});
					}
				};
				imageRef.current.onerror = (err: any) => {
					console.error(err);
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
		if (newFile) {
			const reader = new FileReader();

			reader.addEventListener("load", () => {
				if (!reader.result || typeof reader.result !== "string") return;

				setImageUrl(reader.result);
			});
			reader.readAsDataURL(newFile);
		}
	}

	function handleReset() {
		if (!imageRef.current) return;

		const ctx = canvasRef.current?.getContext("2d");
		ctx?.drawImage(imageRef.current, 0, 0);
	}

	function handleUndo() {
		if (previous) {
			const ctx = canvasRef.current?.getContext("2d");
			const imageData = new ImageData(
				previous,
				imageDimensions.width,
				imageDimensions.height
			);
			ctx?.putImageData(imageData, 0, 0);
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
				undo={handleUndo}
				previous={Boolean(previous)}
				waiting={waiting}
				updateFile={updateFile}
				mask={mask}
				setMask={setMask}
				newImage={newImage}
				handleShare={handleShare}
			/>
			<main className="z-10 w-full lg:h-full flex justify-center items-center flex-col p-4 ">
				<div
					ref={containerRef}
					className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] max-w-full max-h-full relative flex items-center justify-center object-contain "
				>
					<div
						style={
							imageDimensions.width > imageDimensions.height
								? { width: "100%" }
								: { height: "100%" }
						}
						className="relative max-w-[500px] max-h-[500px] md:max-w-[600px] md:max-h-[600px] lg:max-w-[700px] lg:max-h-[700px]"
					>
						<img
							ref={imageRef}
							alt="test-image"
							src=""
							className="object-contain w-full h-full"
						/>
						<div
							ref={draggableRef}
							draggable
							className={`absolute w-40 overflow-auto top-0 bg-gray-500 bg-opacity-60 z-20 h-40 resize  max-w-full max-h-full ${
								mask !== "none" ? "visible" : "invisible"
							}`}
						>
							<div ref={handleRef} className="w-11/12 h-full cursor-pointer" />
						</div>
					</div>

					<canvas
						onClick={handleShare}
						ref={canvasRef}
						style={
							imageDimensions.width > imageDimensions.height
								? { maxWidth: "100%" }
								: { maxHeight: "100%" }
						}
						className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]  top-0 left-0 absolute object-contain"
					/>
				</div>

				{/* TOAST */}
				<div className="fixed bottom-4 w-full left-0 flex justify-center pointer-events-none">
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
