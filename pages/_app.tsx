import "../public/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { DefaultSeo } from "next-seo";

import { withPasswordProtect } from "@storyofams/next-password-protect";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<DefaultSeo
				openGraph={{
					type: "website",
					locale: "en_US",
					site_name: "Pixel Sorter",
					images: [
						{
							url: "https://pixel-sorter.com/showcase/starrynight.png",
							width: 1199,
							height: 950,
							alt: "Pixel Sorter Showcase",
						},
					],
				}}
				twitter={{
					handle: "@ideopunk",
					site: "@ideopunk",
					cardType: "summary_large_image",
				}}
			/>
			<ThemeProvider attribute="class">
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}
export default process.env.NODE_ENV !== "production" ? withPasswordProtect(MyApp) : MyApp;
