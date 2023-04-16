const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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
	optimization: {
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					output: {
						comments: false,
						beautify: false,
						inline_script: true,
					},
					compress: {
						// remove console statements
						drop_console: true,
						passes: 5,
					},
				},
			}),
			new TerserPlugin({
				terserOptions: {
					mangle: true,
					compress: {
						// Remove all console.* statements
						drop_console: true,
						unused: true,
						dead_code: true,
						passes: 5,
					},
				},
			}),
			new OptimizeCSSAssetsPlugin({
				assetNameRegExp: /\.optimize\.css$/g,
				cssProcessor: require("cssnano"),
				cssProcessorOptions: {
					discardComments: {
						removeAll: true,
					},
				},
			}),
			new CssMinimizerPlugin({
				minimizerOptions: {
					preset: "default",
					discardComments: { removeAll: true },
					normalizeWhitespace: true,
					minifyFontValues: true,
					minifyParams: true,
				},
			}),
		],
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
		new CleanWebpackPlugin(),
		new CompressionPlugin({
			algorithm: "gzip",
			test: /\.(js|jsx|css|html)$/i,
			threshold: 8192,
			minRatio: 0.8,
		}),
		new HtmlWebPackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
			favicon: "./public/favicon.png",
			manifest: "./public/manifest.json",
		}),
		// new BundleAnalyzerPlugin(),
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		port: 3000,
	},
};
