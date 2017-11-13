import babel from 'rollup-plugin-babel'

const license = `/*!
 * page-scroll.js
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */`

export default {
	input: 'src/page-scroll.js',
	output: [
		{
			format: 'umd',
			name: 'pageScroll',
			file: 'dist/page-scroll.js',
			banner: license
		},
		{
			format: 'es',
			file: 'dist/page-scroll.module.js',
			banner: license
		}
	],
	indent: '\t',
	sourceMap: false,
	plugins: [
		babel( {
			exclude: 'node_modules/**',
			presets: [
				[ 'env', {
					targets: {
						browsers: [
							'last 2 versions',
							'ie >= 9'
						]
					},
					loose: true,
					modules: false
				} ]
			]
		} )
	]
};
