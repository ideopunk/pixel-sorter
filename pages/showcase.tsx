import Image from "next/image";
import { NextSeo } from "next-seo";
import { ReactNode } from "react";
import Link from "next/link";

import Links from "../components/Links";
import X from "../components/svgs/XSvg";

import botns from "../public/showcase/botns.png";
import starrynight from "../public/showcase/starrynight.png";
import wands from "../public/showcase/wands.png";
import influencer from "../public/showcase/influencer.png";
import coldmonet from "../public/showcase/coldmonet.png";
import woomp from "../public/showcase/woomp.png";
import eternalMemories from "../public/showcase/eternalmemories3.png";
import praterpark from "../public/showcase/praterpark.png";
import splashfountain from "../public/showcase/splashfountain.png";
import unwelcome from "../public/showcase/unwelcome.png";
import leave from "../public/showcase/leave.png";

function Figure({
	children,
	title,
	creator,
	maxWidth,
	href,
}: {
	children: ReactNode;
	title: string;
	creator: string;
	maxWidth?: number;
	href?: string;
}) {
	return (
		<figure className="mb-20 flex flex-col items-center max-w-lg lg:max-w-xl">
			{children}
			<figcaption style={{ maxWidth }} className="font-bold font-mono text-center text-xl  ">
				<pre className="whitespace-pre-wrap mt-2">{title}</pre>
				<pre className="whitespace-pre-wrap mt-4">
					{href ? (
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-black transition-colors"
							href={href}
						>
							{creator}
						</a>
					) : (
						<span>{creator}</span>
					)}
				</pre>
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
			<div className="w-3/5 lg:w-4/5 flex flex-col items-center py-10">
				<div className="pb-12">
					<h1 className="font-bold text-3xl text-center">Pixel Sorter Showcase</h1>
					<Links />
				</div>

				<Figure
					creator="Yourong Frank Wang"
					title="Splash Fountain, Napier New Zealand"
					href="https://fwphys.com/LUX/"
				>
					<Image
						src={splashfountain}
						width={640}
						height={427}
						alt="Splash Fountain, Napier New Zealand"
					/>
				</Figure>

				<Figure
					creator="Yourong Frank Wang"
					title="Prater Park Ferris Wheel, Vienna Austria"
					href="https://fwphys.com/LUX/"
				>
					<Image
						src={praterpark}
						width={640}
						height={640}
						alt="Prater Park Ferris Wheel, Vienna Austria"
					/>
				</Figure>

				<Figure
					creator="SP4C3C0R3"
					title="Leave"
					href=""
				>
					<Image
						src={leave}
						width={5716}
						height={3811}
						alt="Leave"
					/>
				</Figure>

	
				<Figure
					creator="SP4C3C0R3"
					title="Unwelcome"
					href=""
				>
					<Image
						src={unwelcome}
						width={5752}
						height={3835}
						alt="Unwelcome"
					/>
				</Figure>
		

				<Figure
					creator="Layla Claudia Smith"
					title="Eternal Memories 3"
					href="https://www.instagram.com/laylaclaudia._/"
				>
					<Image
						src={eternalMemories}
						width={853}
						height={620}
						alt="Eternal Memories 3"
					/>
				</Figure>
				<Figure
					creator="Zafite, JADR"
					title="WOOMP"
					href="https://soundcloud.com/zafite/zafite-jadr-woop"
				>
					<Image src={woomp} width={3000} height={3000} alt="WOOMP" />
				</Figure>
				<Figure creator="Turtle Bear" title="COLD MONET">
					<Image src={coldmonet} width={720} height={503} alt="COLD MONET" />
				</Figure>

				<Figure creator="Peter Sanfilippo" title="INFLUENCER">
					<Image src={influencer} width={1920} height={1279} alt="INFLUENCER" />
				</Figure>
				<Figure creator="Severian King Comfort" title="ACE OF WANDS">
					<Image src={wands} width={1052} height={1381} alt="ACE OF WANDS" />
				</Figure>

				<Figure
					creator="Ideopunk"
					title="PUT OUT MORE SAIL, CAPTAIN, FOR THE UNIVERSE IS LEAVING US BEHIND..."
				>
					<Image src={starrynight} width={1199} height={950} alt="STARRY NIGHT" />
				</Figure>

				<Figure
					creator="Ideopunk"
					title="THERE IS NO MAGIC. THERE IS ONLY KNOWLEDGE, MORE OR LESS HIDDEN."
					maxWidth={677}
				>
					<Image src={botns} width={677} height={845} alt="BOOK OF THE NEW SUN" />
				</Figure>

				<div className="w-48">
					<Links between />
				</div>
			</div>
		</div>
	);
}
