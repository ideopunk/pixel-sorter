import Head from "next/head";

export default function Home() {
	return (
		<div className="w-screen h-screen bg-gradient-to-t from-red-300 to-pink-200 flex justify-center items-center">
			<Head>
				<title>CNR App</title>
				<meta name="description" content="Generated by create next app" />
				<meta property="og:title" content="CNR" />
				<meta property="og:description" content="Generated by create next app" />

				{/* <meta property="og:url" content="???" /> */}
				{/* <link rel="canonical" href="???" /> */}

				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="z-10">
				<h1 className="text-2xl font-bold mb-4">
					Welcome to{" "}
					<a
						className="text-blue-700 hover:text-green-600 transition-colors"
						href="https://nextjs.org"
					>
						Next.js
					</a>
					, using{" "}
					<a
						className="text-blue-700 hover:text-green-600 transition-colors"
						href="https://github.com/ideopunk/next-cnr-template"
					>
						next-cnr-template!
					</a>
				</h1>

				<p className="text-xl mb-4 font-medium">
					Get started by editing <code>pages/index.js</code>
				</p>
				<p className="text-xl font-medium">
					Add content to the og:url and canonical link tags.
				</p>
			</main>
		</div>
	);
}
