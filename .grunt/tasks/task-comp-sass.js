exports.run = function(grunt, scope) {

	var args = grunt.config.get("arguments"),
		path = grunt.config.get("paths"),
		render = require("../modules/mod-render").render,
		bash = require("../modules/mod-run").bash,
		sass = grunt.config.get("sass"),
		command;

	if (!sass){
		grunt.fail.fatal("No sass config found!");
		return;
	}

	command = sass[args.env];

	if (!command){
		grunt.fail.fatal("Couldn't find sass target for:'"+args.env+"'");
		return;
	}

	path = render(path);
	command = render(command,path);
	sass[args.env] = command;
	grunt.config.set("sass",sass);
	grunt.task.run("sass:"+args.env);
};