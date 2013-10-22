exports.run = function (grunt, task) {

	var render = require("../modules/mod-render").render,
		diff = require("mout/array/difference"),
		keys = require("mout/object/keys"),
		map = require("mout/object/map"),
		path = grunt.config.get("paths"),
		blob, value;

	path = render(path);

	if(!task.data){
		grunt.fail.fatal("Test failed.\nNo test found!'");
		return;
	}

	var diff_result = diff(["dest", "files", "data", "raw"], keys(task.data));
	if (!!diff_result.length) {
		grunt.fail.fatal("Test failed.\nMissing properties: '"+diff_result.join("','")+"'.");
		return;
	}

	value = render(task.data,path);

	if (!!value.data && value.data.constructor.name === "String") {
		if (grunt.file.exists(value.data)){
			value.data = grunt.file.readJSON(value.data);
		}
	}

	if(!!value.raw && value.raw.constructor.name === "Object"){
		value.raw = map(value.raw,function(value){
			if (grunt.file.exists(value)){
				return grunt.file.read(value);
			}
			return value;
		});
	}

	blob = grunt.config.get("concat");
	blob[task.target] = {
		src : task.data.files,
		dest :task.data.dest
	};

	grunt.config.set("concat",blob);
	grunt.config.set("blob-"+task.target,value);
	grunt.task.run(["concat:"+task.target,"render-template:"+task.target]);
};