import Image from "next/image";
import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import Link from "next/link";

import Links from "../components/Links";
import X from "../components/XSvg";

import botns from "../public/showcase/botns.png";
import starrynight from "../public/showcase/starrynight.png";
import wands from "../public/showcase/wands.png";
import influencer from "../public/showcase/influencer.png";

function Figure({
	children,
	title,
	creator,
}: {
	children: ReactNode;
	title: string;
	creator: string;
}) {
	return (
		<figure className="mb-20 flex flex-col items-center">
			{children}
			<figcaption className="font-bold font-mono text-center text-xl  ">
				<pre className="whitespace-pre-wrap mt-2">{title}</pre>
				<pre className="whitespace-pre-wrap mt-4">{creator}</pre>
			</figcaption>
		</figure>
	);
}

export default function Showcase() {
	return (
		<div className="flex flex-col w-full items-center">
			<Link href="/">
				<a className="fixed top-4 right-4 p-4">
					<X />
				</a>
			</Link>
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
			<div className="w-3/5 flex flex-col items-center py-10">
				<div className="pb-12">
					<h1 className="font-bold text-3xl text-center">Pixel Sorter Showcase</h1>
					<Links />
				</div>
				<Figure
					creator="Ideopunk"
					title="THERE IS NO MAGIC. THERE IS ONLY KNOWLEDGE, MORE OR LESS HIDDEN."
				>
					<Image src={botns} width={677} height={845} alt="BOOK OF THE NEW SUN" />
				</Figure>

				<Figure
					creator="Ideopunk"
					title="PUT OUT MORE SAIL, CAPTAIN, FOR THE UNIVERSE IS LEAVING US BEHIND..."
				>
					<Image src={starrynight} width={1199} height={950} alt="STARRY NIGHT" />
				</Figure>

				<Figure creator="Severian King Comfort" title="ACE OF WANDS">
					<Image src={wands} width={1052} height={1381} alt="ACE OF WANDS" />
				</Figure>

				<Figure creator="Peter Sanfilippo" title="INFLUENCER">
					<Image src={influencer} width={1920} height={1279} alt="INFLUENCER" />
				</Figure>
				<div className="w-48">
					<Links between />
				</div>
			</div>
		</div>
	);
}
