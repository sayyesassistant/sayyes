exports.run = function (grunt, task) {

	var
		diff = require("mout/array/difference"),
		keys = require("mout/object/keys"),
		map = require("mout/object/map"),
		blob, value;

	if(!task.data){
		grunt.fail.fatal("Test failed.\nNo test found!'");
		return;
	}

	var diff_result = diff(["dest", "files"], keys(task.data));
	if (!!diff_result.length) {
		grunt.fail.fatal("Test failed.\nMissing properties: '"+diff_result.join("','")+"'.");
		return;
	}

	value = task.data;

	if (!!value.data && !!value.data.indexOf && !!value.data.indexOf("file!"===0)) {
		var file_name = value.data.replace(/^file\!/,"");
		if (grunt.file.exists(file_name)){
			value.data = grunt.file.readJSON(file_name);
		} else {
			grunt.fail.fatal("[page.data]: attempt failed to  file:"+file_name+" failed!");
		}
	}

	if(!!value.raw && value.raw.constructor.name === "Object"){
		value.raw = map(value.raw,function(value){
			if (value.indexOf("file!")===0){
				value = value.replace(/^file\!/,"");
				if (grunt.file.exists(value)){
					return grunt.file.read(value);
				} else {
					grunt.fail.fatal("[page.raw]: attempt failed to  file:"+file_name+" failed!");
				}
			}
			return value;
		});
	}

	blob = grunt.config.get("concat");
	blob[task.target] = {
		src : task.data.files,
		dest : task.data.dest,
		options : task.data.concat_options
	};

	grunt.config.set("concat",blob);
	var to_run = ["concat:"+task.target];
	if (!!task.data.data){
		grunt.config.set("blob-"+task.target,value);
		to_run.push("render-template:"+task.target);
	}
	grunt.task.run(to_run);
};