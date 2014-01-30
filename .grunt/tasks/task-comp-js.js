exports.run = function (grunt, scope) {

	var args = grunt.config.get("arguments"),
		mustache = require("mustache"),
		task = grunt.config.get("command")["comp-js"],
		requirejs = grunt.config.get("requirejs"),
		bash = require("../modules/mod-run").bash,
		mix_in = require("mout/object/mixIn"),
		command;

	command = task[args.env];

	if (!command){
		grunt.fail.fatal("Couldn't find command for env:'"+args.env+"'");
		return;
	}

	command.args = require("mout/array/map")(
		command.args,function(value, prop){
			return mustache.render(value,mix_in(requirejs,scope.data));
		}
	);

	require("mout/object/map")(
		requirejs.paths,function(value, prop){
			command.args.push("paths."+prop+"="+value);
		}
	);

	bash(command, scope.async(), grunt);
};