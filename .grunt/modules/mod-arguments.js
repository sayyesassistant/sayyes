exports.splitValue = function (value) {
	var argName, argValue, result;
	result = {};
	argName = value.match(/^-(\w+=)[\w-_]+/gi);
	if (!!argName){
		argValue = argName[0].match(/[\w-_]+/gi);
		if (argValue.length==2){
			result[argValue[0].replace(/^-/,"")] = argValue[1];
		}
	}
	return result;
};
exports.fromCommandLine = function (grunt) {
	var result, arg, prop, o, mixIn;
	result = {};
	mixIn = require("mout/object/mixIn");
	for (prop in process.argv) {
		arg = process.argv[prop];
		o = require("../modules/mod-arguments").splitValue(arg);
		result = mixIn(result,o);
	}
	arg = grunt.config.get('arguments');
	result = mixIn({},arg,result);
	grunt.config.set("arguments",result);
};
exports.fromFile = function (fileName, grunt) {
	var result, arg, file, o, mixIn;
	result = {};
	mixIn = require("mout/object/mixIn");
	if (!!fileName){
		file = grunt.file.read(fileName);
		if (!!file && !!file.length){
			arg = file.match(/\@\w+\s(-.+)/gm);
			var forEach = require("mout/array/forEach");
			forEach(arg,function(item){
				var props = item.replace(/\@\w+\s/gm,"").split(/[\t\s]/);
				forEach(props, function(v){
					o = require("../modules/mod-arguments").splitValue(v);
					mixIn(result,o);
				});
			});
		}
	}
	arg = grunt.config.get('arguments');
	result = mixIn({},arg,result);
	grunt.config.set("arguments",result);
};