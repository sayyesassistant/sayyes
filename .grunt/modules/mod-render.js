exports.render = function (obj, src) {
	if (!obj || !src) {
		grunt.fail.fatal("render got invalid argument"+obj+","+src);
		return;
	}
	var prop,
		mustache = require("mustache"),
		rendered = obj.constructor(),
		propValue;

	for(prop in obj){
		propValue = obj[prop];
		if (!!propValue && propValue.constructor.name === "String" ) {
			rendered[prop] = mustache.render(propValue, src);
		}
	}
	return rendered;
};