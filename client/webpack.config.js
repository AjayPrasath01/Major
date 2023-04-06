const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

OUTPATH = "../api/src/main/resources/static";

module.exports = {
	entry: "./src/index.js",
	output: {
		// ../api/src/main/resources/static

		publicPath: "/",
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
						presets: ["@babel/preset-env"],
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

			{
				test: /\.png$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 8192,
						},
					},
					{
						loader: "image-webpack-loader",
						options: {
							mozjpeg: {
								quality: 75,
							},
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							webp: {
								quality: 75,
							},
						},
					},
				],
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
