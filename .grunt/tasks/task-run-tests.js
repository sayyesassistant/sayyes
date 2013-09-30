exports.run = function (grunt, scope) {
	var path = grunt.config.get("path"),
		render = require("../modules/mod-render").render,
		tests = grunt.config.get("tests"),
		mustache = require("mustache"),
		forOwn = require("mout/object/forOwn"),
		hasOwn = require("mout/object/hasOwn"),
		file, blob, template;
	path = render(path,path);
	function create_file(value){
		value = render(value,path);
		try{
			file = grunt.file.read(value.view);
		} catch (err) {
			grunt.fail.fatal("coudn't open file: "+value.view);
		}
		try{
			template = grunt.file.read(value.template);
		} catch (err) {
			grunt.fail.fatal("coudn't open file: "+value.template);
		}
		blob = {
			template_value : template
		};
		var rendered = mustache.render(file,blob);
		try{
			grunt.file.write(value.dest, rendered);
		} catch (err) {
			grunt.fail.fatal("failed to create file: "+value.dest);
			return;
		}
		grunt.log.ok("Creating test file at: "+value.dest);
	}
	function each_test(value, prop) {
		if (value && hasOwn(value, "dest") && hasOwn(value,"view") && hasOwn(value, "template")){
			grunt.log.subhead("Building test: "+prop);
			create_file(value);
		} else {
			grunt.log.error(prop+" got invalid test object");
		}
	}
	forOwn(tests,each_test);
};