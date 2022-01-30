import { NextSeo } from "next-seo";
import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import Links from "../components/Links";
import Script from "next/script";
import X from "../components/XSvg";

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
			<div className="p-4 pt-0 prose prose-lg prose-li:my-0 max-w-[30ch] dark:text-white">
				<h1 className="text-white"> Pixel Sorter</h1>

				<p>This is an interface to create glitch art with pixel sorting.</p>
				<ul>
					<li>
						Interval functions:
						<ul>
							<li>Threshold with min and max</li>
							<li>Random</li>
							<li>None</li>
						</ul>
					</li>
					<li>
						Sorting functions:
						<ul>
							<li>Hue</li>
							<li>Saturation</li>
							<li>Lightness</li>
							<li>Color (individual RGB)</li>
							<li>Intensity (sum of RGB)</li>
						</ul>
					</li>
					<li>
						Direction:
						<ul>
							<li>Left / Right</li>
							<li> Up / Down</li>
						</ul>
					</li>
				</ul>
				<p>A mobile version and a masking feature are coming soon.</p>
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
					Project assigned by{" "}
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
				<div id="donate-button-container" className="flex flex-col items-center">
					<p className="inline">
						Pixel Sorter will always be free. All code is executed in your browser, so
						there are no server costs to pay. If you enjoy Pixel Sorter, you can leave a
						tip here:{" "}
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
				</div>
				<Links />
			</div>
		</div>
	);
}
