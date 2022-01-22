import Link from "next/link";

export default function About() {
	return (
		<div className="p-4 prose text-white">
			<h1 className="text-white"> Pixel Sorter</h1>

			<p>This is an interface for pixel sorting to create glitch art.</p>
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
						<li>Combined</li>
					</ul>
				</li>

				<li>Masking</li>
			</ul>
			<p>Original script by Kim Asendorf https://github.com/kimasendorf/ASDFPixelSort</p>
			<p>
				Shout outs to Satyarth for their great explanation
				http://satyarth.me/articles/pixel-sorting/
			</p>
			<p>
				Web worker usage inspired by Butter.js
				https://github.com/brandly/butter.js/blob/master/src/butter-worker.js
			</p>
			<p>Project assigned by Peter Sanfilippo</p>
			<p>
				{
					"If you've created great art with Pixel Sorter, message me and I'll link it in the showcase!"
				}
			</p>
			<Link href="/">
				<a className="text-blue-400 hover:text-blue-800 transition-colors">Return</a>
			</Link>
		</div>
	);
}
