import { NextSeo } from "next-seo";
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import Links from "../components/Links";
import Script from "next/script";
import X from "../components/svgs/XSvg";

function Lank(
	props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
) {
	return (
		<a
			{...props}
			className="text-purple-700 dark:text-purple-300 no-underline hover:underline "
		>
			{props.children}
		</a>
	);
}

export default function About() {
	return (
		<div className="w-full flex flex-col items-center">
			<NextSeo
				title="About Pixel Sorter"
				description="Pixel Sorter features and credits"
				canonical="https://pixel-sorter.com/about"
				openGraph={{
					title: "About Pixel Sorter",
					description: "Features and credits",
					url: "https://pixel-sorter.com/about",
				}}
			/>
			<Link href="/">
				<a className="fixed top-4 right-4 p-4">
					<X />
				</a>
			</Link>
			<div className="mt-12 prose prose-lg prose-li:my-0 max-w-[30ch] dark:text-white dark:prose-headings:text-purple-200">
				<h1>Pixel Sorter</h1>

				<p>This is an interface to create glitch art with pixel sorting.</p>

				<h2>How Does It Work?</h2>
				<p>
					Pixel sorting re-orders the pixels in a row (or a column) accoding to some
					parameter. For example, you might sort the pixels in a row based on how red they
					are.
				</p>
				<p>
					This gets cool when you use thresholds. You might set a threshold to only sort
					pixels that are somewhat light -- this will ignore pixels that are too light or
					too dark. This creates natural intervals within a row: a block of pixels within
					the threshold will be sorted, blocks of pixels outside the threshold will
					interrupt the sorting. This can create beautiful effects.
				</p>
				<p>
					You can take this further by masking. This will set an area for the sorting to
					ignore, and can bring focus to a scene.
				</p>
				<p>
					Try different modes and different thresholds. Sensible defaults have been
					chosen. Have fun!{" "}
				</p>

				<h2>Shout Outs</h2>
				<p>
					<Lank href="https://github.com/kimasendorf/ASDFPixelSort">Original script</Lank>{" "}
					by Kim Asendorf.
				</p>
				<p>
					Shout outs to Satyarth for their{" "}
					<Lank href="http://satyarth.me/articles/pixel-sorting/">great explanation</Lank>
					.
				</p>
				<p>
					Web worker usage inspired by{" "}
					<Lank href="https://github.com/brandly/butter.js">Butter.js</Lank>.
				</p>
				<p>
					Project requested by{" "}
					<Lank href="https://twitter.com/petesanf">Peter Sanfilippo</Lank>.
				</p>
				<p>
					{"If you've created great art with Pixel Sorter, "}
					<Lank href="mailto:conorbarnes93@gmail.com" target="_blank" rel="noreferrer">
						message me
					</Lank>
					{" and I'll link it in the "}
					<Link href="/showcase" passHref>
						<Lank>showcase</Lank>
					</Link>
					{"!"}
				</p>
				<p className="inline">
					Pixel Sorter will always be free. All code is executed in your browser, so there
					are no server costs to pay. If you enjoy Pixel Sorter, you can leave a tip here:{" "}
				</p>
				<div id="donate-button" />
				<Script
					id="paypal"
					src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
					charSet="UTF-8"
					onLoad={() => {
						// @ts-ignore
						PayPal.Donation.Button({
							env: "production",
							hosted_button_id: "ZMA9AS9F39HLE",
							image: {
								src: "https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif",
								alt: "Donate with PayPal button",
								title: "PayPal!",
							},
						}).render("#donate-button");
					}}
				/>
				<div className="w-48">
					<Links between />
				</div>
			</div>
		</div>
	);
}
