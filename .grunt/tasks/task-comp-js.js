exports.run = function (grunt, scope) {

	var args = grunt.config.get("arguments"),
		pages = grunt.config.get("app"),
		task = grunt.config.get("tasks")["comp-js"],
		path = grunt.config.get("paths"),
		requirejs = grunt.config.get("requirejs"),
		render = require("../modules/mod-render").render,
		bash = require("../modules/mod-run").bash,
		app, command, blob;

	if(!args.app){
		grunt.fail.fatal("No app set on config.");
		return;
	}

	app = pages[args.app];

	if (!app){
		grunt.fail.fatal("Couldn't find target main:'"+args.app+"'");
		return;
	}

	command = task[args.env];

	if (!command){
		grunt.fail.fatal("Couldn't find command for env:'"+args.env+"'");
		return;
	}
	path = render(path);
	app = render(app,path);
	requirejs = render(requirejs,path);
	blob = require("mout/object/mixIn")({},path,app,requirejs);
	command = render(command, blob);
	require("mout/object/map")(requirejs.paths,function(value, prop){
		command.args.push("paths."+prop+"="+value);
	});
	bash(command, scope.async(), grunt);
};