module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		fontFamily: {
			sans: ["Zen Maru Gothic"]
		},
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};
