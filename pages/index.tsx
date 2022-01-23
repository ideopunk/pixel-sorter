import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Direction, IntervalStyle, Options, SortingStyle } from "../library/types";

type Dimensions = { width: number; height: number };

export default function Home() {
	const [imageDimensions, setImageDimensions] = useState<Dimensions>({ width: 0, height: 0 });
	const [imageUrl, setImageUrl] = useState("./testimage.jpg");
	const [newImage, setNewImage] = useState(true);
	const [waiting, setWaiting] = useState(false);

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

	async function copy() {
		if (!canvasRef.current) return;

		canvasRef.current.toBlob(function (blob) {
			if (!blob) return;
			let data = [new ClipboardItem({ [blob.type]: blob })];

			navigator.clipboard.write(data).then(
				() => {
					console.log("nice!");
				},
				(err: any) => {
					console.log(err);
				}
			);
		});
	}

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
						ctx?.drawImage(imageRef.current, 0, 0);
						console.log(imageRef.current.height, imageRef.current.width);
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
		<div className="w-screen h-screen dark:bg-black flex justify-center items-center">
			<Head>
				<title>Pixel Sorter</title>
				<meta name="description" content="Create glitch art" />
				<meta property="og:title" content="Pixel sorter" />
				<meta property="og:description" content="Create glitch art" />

				{/* <meta property="og:url" content="???" /> */}
				{/* <link rel="canonical" href="???" /> */}

				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Sidebar
				draw={draw}
				reset={handleReset}
				waiting={waiting}
				copy={copy}
				// originalImage={imageUrl}
				updateFile={updateFile}
				// dimensions={imageDimensions}
			/>
			<main className="z-10 w-full h-full flex justify-center items-center flex-col">
				<div className="w-[700px] h-[700px] relative flex items-center justify-center ">
					<img ref={imageRef} alt="test-image" src="" className="object-contain" />
					<canvas
						ref={canvasRef}
						className="w-[700px] h-[700px] absolute object-contain"
					/>
				</div>
				{/* <button className="absolute bottom-0 left-0" onClick={draw}>
					DRAW?!?!?
				</button> */}
			</main>
		</div>
	);
}
