exports.run = function(grunt, scope) {

	var args = grunt.config.get("arguments"),
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

	sass[args.env] = command;
	grunt.config.set("sass",sass);
	grunt.task.run("sass:"+args.env);
};