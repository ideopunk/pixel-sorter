import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					{/* <meta charSet="UTF-8" /> */}
					<meta name="twitter:card" content="summary" />
					<meta property="og:locale" content="en_US" />
					<meta property="og:type" content="website" />
					<meta name="theme-color" content="#F61E61" />

					<meta
						property="og:image"
						content="https://upload.wikimedia.org/wikipedia/commons/e/e6/Tom_Thomson_-_The_Jack_Pine_1916.jpg"
					/>

					<meta property="og:image:alt" content="Image description" />
					<meta property="og:image:width" content="2604" />
					<meta property="og:image:height" content="2380" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap"
						rel="stylesheet"
					/>

					{/* ICON */}
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="manifest" href="/site.webmanifest" />
					<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
