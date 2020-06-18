const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry   : './src/js/app.js',
	plugins : [
		new HtmlWebpackPlugin({
			template : './src/template.html'
		})
	],
	module  : {
		rules : [
			{
				test : /\.html$/,
				use  : [
					'html-loader'
				]
			},
			{
				test : /\.(svg|png|jpg|gif)$/,
				use  : {
					loader  : 'file-loader',
					options : {
						name       : '[name].[hash].[ext]',
						outputPath : 'img'
					}
				}
			},
			{
				test    : /\.m?js?$/,
				exclude : /node_modules/,
				loader  : 'babel-loader',
				options : {
					presets : [
						'@babel/preset-env'
					]
				}
			}
		]
	}
};
