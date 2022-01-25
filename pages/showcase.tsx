import Image from "next/image";
import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import Links from "../components/Links";
import botns from "../public/showcase/botns.png";
import starrynight from "../public/showcase/starrynight.png";

function Figure({ children, title }: { children: ReactNode; title: string }) {
	return (
		<figure className="mb-20">
			{children}
			<figcaption className="font-bold font-mono text-justify text-xl w-full ">
				<pre className="whitespace-pre-wrap">{title}</pre>
			</figcaption>
		</figure>
	);
}

export default function Showcase() {
	return (
		<div className="flex flex-col w-full items-center">
			<NextSeo
				title="Pixel Sorter Showcase"
				description="Art made with Pixel Sorter"
				canonical="https://pixel-sorter.com/showcase"
				openGraph={{
					title: "Pixel Sorter Showcase",
					description: "Art made with Pixel Sorter",
					url: "https://pixel-sorter.com/showcase",
				}}
			/>
			<div className="w-1/2 max-w-xl py-10">
				<div className="pb-12">
					<h1 className="font-bold text-3xl text-center">Pixel Sorter Showcase</h1>
					<Links />
				</div>
				<Figure title="THERE IS NO MAGIC. THERE IS ONLY KNOWLEDGE, MORE OR LESS HIDDEN.">
					<Image src={botns} width={677} height={845} alt="BOOK OF THE NEW SUN" />
				</Figure>

				<Figure title="PUT OUT MORE SAIL, CAPTAIN, FOR THE UNIVERSE IS LEAVING US BEHIND...">
					<Image src={starrynight} width={1199} height={950} alt="STARRY NIGHT" />
				</Figure>
				<Links />
			</div>
		</div>
	);
}
