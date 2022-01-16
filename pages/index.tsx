import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import testPic from "../public/testimage.jpg";

export default function Home() {
	const [originalImage, setOriginalImage] = useState<string>("./testimage.jpg");
	const [alteredImage, setAlteredImage] = useState<string>("./testimage.jpg");

	function updateFile(newFile: File) {
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			if (reader.result) {
				if (typeof reader.result !== "string") {
					console.log("huh?");
					return;
				}

				setOriginalImage(reader.result);
				setAlteredImage(reader.result);
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

			<Sidebar updateFile={updateFile} />
			<main className="z-10 w-full h-full flex justify-center items-center flex-col">
				<div className="w-3/4 h-3/4 flex items-center justify-center ">
					<img alt="test-image" src={originalImage} className="object-cover" />
				</div>
			</main>
		</div>
	);
}
