exports.run = function (grunt, scope) {

	var path     = grunt.config.get("paths"),
		render   = require("../modules/mod-render").render,
		tests    = grunt.config.get("tests"),
		mustache = require("mustache"),
		forOwn   = require("mout/object/forOwn"),
		hasOwn   = require("mout/object/hasOwn"),
		file, blob, template, li, rendered;

	path = render(path,path);

	li = {
		links:[]
	};

	function create_file(value, name) {
		value = render(value,path);
		try{
			file = grunt.file.read(value.view);
		} catch (err) {
			grunt.fail.fatal("coudn't open file: "+value.view);
		}
		try{
			template = grunt.file.read(value.template);
			value.template = template;
		} catch (err) {
			grunt.fail.fatal("coudn't open file: "+value.template);
		}
		rendered = mustache.render(file,value);
		try{
			grunt.file.write(value.dest, rendered);
		} catch (err) {
			grunt.fail.fatal("failed to create file: "+value.dest);
			return;
		}
		li.links.push({name:name,url:value.dest});
		grunt.log.ok("Creating test file at: "+value.dest);
	}
	function each_test(value, prop) {
		if (value && hasOwn(value, "dest") && hasOwn(value,"view") && hasOwn(value, "template")){
			grunt.log.subhead("Building test: "+prop);
			create_file(value,prop);
		} else {
			grunt.log.error(prop+" got invalid test object");
		}
	}
	forOwn(tests,each_test);
	var index;
	try {
		index = grunt.file.read(path.test_index);
	} catch (err) {
		grunt.fail.fatal("failed to create file: "+path.test_index);
		return;
	}
	index = mustache.render(index,li);
	try {
		grunt.file.write(path.tests+"/index.html", index);
	} catch (err) {
		grunt.fail.fatal("failed to create file: "+path.tests+"/index.html");
		return;
	}
	grunt.log.subhead("Tests index created at:",path.tests+"/index.html");
};