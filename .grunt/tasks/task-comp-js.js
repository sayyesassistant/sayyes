exports.run = function (grunt, scope) {
	var args = grunt.config.get("arguments"),
		pages = grunt.config.get("pages"),
		task = grunt.config.get("tasks")["comp-js"],
		path = grunt.config.get("path"),
		requirejs = grunt.config.get("requirejs"),
		render = require("../modules/mod-render").render,
		bash = require("../modules/mod-run").bash,
		page, command, blob;
	if(!!args && !!args.page){
		page = pages[args.page];
		if (!!page){
			command = task[args.env];
			if (!command){
				grunt.fail.fatal("Couldn't find command for env:'"+args.env+"'\n@Use grunt -h for more information.");
			}
			path = render(path,path);
			page = render(page,path);
			requirejs.paths = render(requirejs.paths,path);
			blob = require("mout/object/mixIn")({},path,page,requirejs);
			command.args = render(command.args, blob);
			require("mout/object/map")(requirejs.paths,function(value, prop){
				command.args.push("paths."+prop+"="+value);
			});
			bash(command, scope.async(), grunt);
		} else {
			grunt.fail.fatal("Couldn't find target main:'"+args.page+"'\n@Use grunt comp-js -main=<%=target%> next time.");
		}
	} else {
		grunt.log.warn("grunt -h to see how to use this task");
	}
};