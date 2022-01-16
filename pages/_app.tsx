import "../public/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { withPasswordProtect } from "@storyofams/next-password-protect";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="viewport-fit=cover" />
			</Head>
			<ThemeProvider attribute="class">
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	);
}
export default process.env.PASSWORD_PROTECT ? withPasswordProtect(MyApp) : MyApp;
