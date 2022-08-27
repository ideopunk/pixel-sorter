import Link from "next/link";
import { useTheme } from "next-themes";
import SunSvg from "./svgs/SunSvg";
import MoonSvg from "./svgs/MoonSVG";
import QuestionMark from "./svgs/QuestionMarkSvg";
import FrameSVG from "./svgs/FrameSVG";
import { useRouter } from "next/router";
import FlashSVG from "./svgs/FlashSVG";
import { useEffect, useState } from "react";

export default function Links({ between }: { between?: boolean }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const { theme, setTheme } = useTheme();

	const router = useRouter();
	return (
		<div className={`flex items-center h-20 ${between ? "justify-between" : "justify-evenly"}`}>
			<button
				title="Toggle theme"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="w-8 h-8 hover:scale-125 transition-transform "
			>
				{!mounted ? null : theme === "dark" ? <SunSvg /> : <MoonSvg />}
			</button>
			{router.pathname !== "/" && (
				<Link href="/">
					<a className="w-8 h-8 dark:text-white hover:scale-125 transition-transform">
						<FlashSVG />
					</a>
				</Link>
			)}
			{router.pathname !== "/about" && (
				<a
					href="/about"
					target="_blank"
					rel="noreferrer"
					className="w-8 h-8   hover:scale-125 transition-transform"
				>
					<QuestionMark />
				</a>
			)}
			{router.pathname !== "/showcase" && (
				<a
					href="/showcase"
					target="_blank"
					rel="noreferrer"
					className="w-8 h-8  hover:scale-125 dark:text-white transition-transform"
				>
					<FrameSVG />
				</a>
			)}
		</div>
	);
}
