module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
				inter: ['Inter', 'system-ui', 'sans-serif'],
				geist: ['Geist', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
