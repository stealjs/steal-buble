var buble = require("buble");
var rollup = require("rollup").rollup;

var bubleOptions = {
	transforms: {
		modules: false
	}
};

var noop = function(){};

var isJSExp = /(\.js|\.esm)$/;
var isJS = function(filename){
	return isJSExp.test(filename);
};

exports.translate = function(translate, load){
	if(!isJS(load.address)) {
		return;
	}

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
