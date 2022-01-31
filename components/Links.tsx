import Link from "next/link";
import { useTheme } from "next-themes";
import SunSvg from "./SunSvg";
import MoonSvg from "./MoonSVG";
import QuestionMark from "./QuestionMarkSvg";
import FrameSVG from "./FrameSVG";
import { useRouter } from "next/router";
import FlashSVG from "./FlashSVG";

export default function Links({ between }: { between?: boolean }) {
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	return (
		<div className={`flex items-center h-20 ${between ? "justify-between" : "justify-evenly"}`}>
			<button
				title="Toggle theme"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="w-8 h-8 hover:scale-125 transition-transform "
			>
				{theme === "dark" ? <SunSvg /> : <MoonSvg />}
			</button>
			{router.pathname !== "/" && (
				<Link href="/">
					<a className="w-8 h-8 dark:text-white hover:scale-125 transition-transform">
						<FlashSVG />
					</a>
				</Link>
			)}
			{router.pathname !== "/about" && (
				<Link href="/about">
					<a className="w-8 h-8   hover:scale-125 transition-transform">
						<QuestionMark />
					</a>
				</Link>
			)}
			{router.pathname !== "/showcase" && (
				<Link href="/showcase">
					<a className="w-8 h-8  hover:scale-125 dark:text-white transition-transform">
						<FrameSVG />
					</a>
				</Link>
			)}
		</div>
	);
}
