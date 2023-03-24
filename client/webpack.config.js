const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

OUTPATH = "../api/src/main/resources/static";

module.exports = {
	entry: "./src/index.js",
	output: {
		// ../api/src/main/resources/static
		publicPath: path.resolve("/"),   
		path: path.resolve(__dirname, OUTPATH),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
			{
				test: /\.svg$/,
				use: ["svg-url-loader"],
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
			favicon: "./public/favicon.png",
			manifest: "./public/manifest.json",
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 3000,
	},
};
