import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import pixelsort from "../library/pixelsort";
import testPic from "../public/testimage.jpg";

type Dimensions = { width: number; height: number };

export default function Home() {
	const [imageDimensions, setImageDimensions] = useState<Dimensions>({ width: 0, height: 0 });
	const [imageUrl, setImageUrl] = useState("./testimage.jpg");

	// const canvasRef = useRef<HTMLCanvasElement>(null);

	const draw = useCallback(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (imageRef.current && ctx) {
			pixelsort(imageRef.current, ctx, imageDimensions.width, imageDimensions.height);
		}
	}, [imageDimensions]);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	// derive canvas dimension
	useEffect(() => {
		if (!canvasRef.current) return;
		canvasRef.current.width = imageDimensions.width;
		canvasRef.current.height = imageDimensions.height;
	}, [imageDimensions]);

	// get dimensions of new file
	const convertUrlToImage = useCallback((url: string) => {
		console.log({ url });
		if (imageRef.current) {
			imageRef.current.src = url;
			// new Image({ src: url });

			imageRef.current.onload = () => {
				console.log("loaded");
				if (imageRef.current?.height && imageRef.current.width) {
					setImageDimensions({
						height: imageRef.current.height,
						width: imageRef.current.width,
					});
				}
			};
			imageRef.current.onerror = (err: any) => {
				console.log("img error");
				console.error(err);
				if (typeof err === "object" && "message" in err) console.log(err.message);
			};
		}
	}, []);

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
				originalImage={imageUrl}
				updateFile={updateFile}
				dimensions={imageDimensions}
			/>
			<main className="z-10 w-full h-full flex justify-center items-center flex-col">
				<div className="w-3/4 h-3/4 relative flex items-center justify-center ">
					<img ref={imageRef} alt="test-image" src="" className="object-cover" />
					<canvas ref={canvasRef} className=" absolute" />
				</div>
				<button onClick={draw}>DRAW?!?!?</button>
			</main>
		</div>
	);
}
