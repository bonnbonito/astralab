const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { getWebpackEntryPoints } = require('@wordpress/scripts/utils/config');
const path = require('path');

module.exports = {
	...defaultConfig,
	entry: {
		...getWebpackEntryPoints(),
		trello: './scripts/trello/index.tsx',
		main: './scripts/main/main.tsx',
		dashboard: './scripts/dashboard/index.tsx',
		'single-card': './scripts/single-card/index.tsx',
	},
	resolve: {
		...defaultConfig.resolve, // Retain existing resolution options
		alias: {
			...defaultConfig.resolve?.alias, // Preserve any existing aliases
			'@': path.resolve(__dirname, 'scripts'), // Add custom alias
		},
		extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'], // Ensure TypeScript and JavaScript files are resolved
	},
};
