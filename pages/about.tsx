import Link from "next/link";

export default function About() {
	return (
		<div className="p-4">
			<h1> Pixle Sorter</h1>

			<p>This is an interface for pixel sorting to create glitch art.</p>
			<ul>
				<li>
					interval functions:
					<ul>
						<li>threshold with min and max.</li>
						<li>random</li>
						<li>none</li>
					</ul>
				</li>
				<li>
					- sorting functions:
					<ul>
						<li>- - lightness (hsv)</li>
						<li>- - hue (hsv)</li>
						<li>- - saturation (hsv)</li>
						<li>- - intensity (sum of rgb)</li>
						<li>- - color (individual rgb)</li>
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
			<p>Project assigned by Peter Sanfilippo</p>
			<p>
				{
					"If you've created great art with Pixel Sorter, message me and I'll link it in the showcase!"
				}
			</p>
			<Link href="/">
				<a>Return</a>
			</Link>
		</div>
	);
}
