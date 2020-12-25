module.exports = {
	important: true,
	purge: ['./apps/**/*.html', './apps/**/*.ts', './apps/**/*.scss'],
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'discord-light': '#36393F',
				'discord-lightest': '#D4D5D6',
				'discord-dark': '#2F3136',
				'discord-darkest': '#202225'
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
