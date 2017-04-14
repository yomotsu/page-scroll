import babel from 'rollup-plugin-babel'

const license = `/*!
 * page-scroll.js
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */`

export default {
	entry: 'src/page-scroll.js',
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
	],
	targets: [
		{
			format: 'umd',
			moduleName: 'pageScroll',
			dest: 'dist/page-scroll.js',
			banner: license
		},
		{
			format: 'es',
			dest: 'dist/page-scroll.module.js',
			banner: license
		}
	]
};
