/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	async redirects() {
		return [
			{
				source: "/invite",
				destination: "/",
				permanent: true,
			},
		];
	},
	env: {
		// Add any logic you want here, returning `true` to enable password protect.
		PASSWORD_PROTECT: true,
	},
};
