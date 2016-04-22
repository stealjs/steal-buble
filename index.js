var buble = require("buble");
var rollup = require("rollup").rollup;

var bubleOptions = {
	transforms: {
		modules: false
	}
};
var noop = function(){};

exports.translate = function(translate, load){
	var loader = {
		resolveId: function(id){
			return id === load.name ? id : undefined;
		},
		load: function(id) {
			return id === load.name ? load.source : undefined;
		},
		transform: function(source) {
			return buble.transform(source, bubleOptions);
		}
	};

	return rollup({
		entry: load.name,
		onwarn: noop,
		plugins: [loader]
	}).then(function(bundle){
		var out = bundle.generate({ format: "cjs"});
		return out.code;
	});
};
