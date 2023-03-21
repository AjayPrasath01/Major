const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log({app})
	app.use(
		"/api",
		createProxyMiddleware({
			target: "http://localhost:80",
			changeOrigin: true,
		})
	);

	app.use(
		"/ws",
		createProxyMiddleware({
			target: "http://localhost:80", // replace with your backend server URL
			ws: true,
			secure: false,
			changeOrigin: false,
		})
	);

};
