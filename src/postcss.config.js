const purgecss = require('@fullhuman/postcss-purgecss')({
	content: [
		'./src/**/*.html',
		'./src/**/*.ts',
	],
	safelist: [],
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});


module.exports = {
	plugins: [
		purgecss,

		require('cssnano')({
			preset: 'default',
		}),
	],
};
