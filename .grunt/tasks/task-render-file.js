exports.run = function (grunt, task) {

	var mustache = require("mustache"),
		mixIn = require("mout/object/deepMixIn"),
		file, file_name, rendered, blob, name, mock;

	name = task.args[0];
	if (!name){
		grunt.fatal.warn("No page to render.");
		return;
	}

	mock = grunt.config.get("blob-"+name);
	if (!mock){
		grunt.fail.warn("No data found to target",name);
		return;
	}

	file_name = mock.dest;

	//read target file
	try {
		file = grunt.file.read(file_name);
	} catch (err) {
		grunt.fail.warn("Coudn't open file: "+file_name);
		return;
	}

	if (!file || !file.length){
		grunt.fatal.warn(file_name+" seems to be empty");
		return;
	}

	//render file
	rendered = mustache.render(file,mock);

	//save rendeted file
	try{
		grunt.file.write(file_name, rendered);
	} catch (err) {
		grunt.fail.warn("Failed to save file: "+value.dest);
		return;
	}
	grunt.log.ok(file_name+" rendered successfully");
};