import Link from "next/link";
import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import Links from "../components/Links";

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
			<div className="p-4 prose prose-lg max-w-[30ch] dark:text-white">
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

					<li>Masking (coming soon!)</li>
				</ul>
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
				<Links />
			</div>
		</div>
	);
}
