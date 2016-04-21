var QUnit = require("steal-qunit");
var clone = require("steal-clone");

function provide(loader, name, source) {
	loader._fetchSources[name] = source;
}

QUnit.module("steal-buble", {
	beforeEach: function(assert){
		var done = assert.async();

		var loader = this.loader = clone();
		loader.config({
			plugins: {
				"*.js": ["steal-buble"]
			}
		});
		loader._installModules().then(function(){
			done();
		});

		loader._fetchSources = {};
		var fetch = loader.fetch;
		loader.fetch = function(load){
			var source = this._fetchSources[load.name];
			if(source) {
				return Promise.resolve(source);
			} else {
				return fetch.apply(this, arguments);
			}
		};
	}
});

QUnit.test("most basic test possible", function(assert){
	var done = assert.async();

	var code = "import foo from 'foo';\n" +
		"const add = ( a, b ) => a + b;\n" +
		"export default add;";

	var loader = this.loader;

	provide(loader, "es", code);
	provide(loader, "foo", "module.exports = {};");

	loader.import("es")
	.then(function(add){
		var val = add(1, 2);
		assert.equal(val, 3, "omg it worked");
	}, function(err){
		assert.ok(!err, err.message || err);
	})
	.then(done, done);

});
