exports.run = function (grunt, task) {

	var render = require("../modules/mod-render").render,
		diff = require("mout/array/difference"),
		keys = require("mout/object/keys"),
		path = grunt.config.get("paths"),
		blob, value;

	path = render(path);

	if(!task.data){
		grunt.fail.fatal("Test failed.\nNo test found!'");
		return;
	}
	var diff_result = diff(["dest", "template", "data"], keys(task.data));
	if (!!diff_result.length) {
		grunt.fail.fatal("Test failed.\nMissing properties: '"+diff_result.join("','")+"'.");
		return;
	}
	value = render(task.data,path);
	blob = grunt.config.get("concat");
	blob[task.target] = {
		src : task.data.template,
		dest :task.data.dest
	};
	grunt.config.set("concat",blob);
	grunt.config.set("blob-"+task.target,value);
	grunt.task.run(["concat:"+task.target,"render-template:"+task.target]);
};