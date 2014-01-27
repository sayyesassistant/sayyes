exports.run = function (grunt, scope) {

	var args = grunt.config.get("arguments"),
		mustache = require("mustache"),
		task = grunt.config.get("tasks")["comp-js"],
		requirejs = grunt.config.get("requirejs"),
		bash = require("../modules/mod-run").bash,
		mix_in = require("mout/object/mixIn"),
		app_name, command;

	if(!args.app){
		grunt.fail.fatal("No app set on config.");
		return;
	}

	app_name = grunt.config.get("js")[args.app];

	if (!app_name){
		grunt.fail.fatal("Couldn't find target main:'"+args.app+"'");
		return;
	}

	command = task[args.env];

	if (!command){
		grunt.fail.fatal("Couldn't find command for env:'"+args.env+"'");
		return;
	}

	command.args = require("mout/array/map")(
		command.args,function(value, prop){
			return mustache.render(value,mix_in(requirejs,app_name));
		}
	);

	require("mout/object/map")(
		requirejs.paths,function(value, prop){
			command.args.push("paths."+prop+"="+value);
		}
	);

	bash(command, scope.async(), grunt);
};