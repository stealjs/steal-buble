var stealTools = require("steal-tools");

stealTools.build({
	config: __dirname + "/../package.json!npm",
	main: "demo/app",
	bundlesPath: __dirname + "/dist",
	plugins: {
		"*.js": [
			"steal-buble"
		]
	}
}, {
	minify: false
});
