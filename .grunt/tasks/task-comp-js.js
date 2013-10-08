exports.run = function (grunt, scope) {

	var args = grunt.config.get("arguments"),
		pages = grunt.config.get("pages"),
		task = grunt.config.get("tasks")["comp-js"],
		path = grunt.config.get("paths"),
		requirejs = grunt.config.get("requirejs"),
		render = require("../modules/mod-render").render,
		bash = require("../modules/mod-run").bash,
		page, command, blob;

	if(!args.page){
		grunt.fatal.fail("No page set on config.");
		return;
	}

	page = pages[args.page];

	if (!page){
		grunt.fail.fatal("Couldn't find target main:'"+args.page+"'");
		return;
	}

	command = task[args.env];

	if (!command){
		grunt.fail.fatal("Couldn't find command for env:'"+args.env+"'");
		return;
	}
	path = render(path);
	page = render(page,path);
	requirejs = render(requirejs,path);
	blob = require("mout/object/mixIn")({},path,page,requirejs);
	command = render(command, blob);
	require("mout/object/map")(requirejs.paths,function(value, prop){
		command.args.push("paths."+prop+"="+value);
	});
	bash(command, scope.async(), grunt);
};