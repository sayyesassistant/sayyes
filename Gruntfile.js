/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	var ready, config;

	ready = false;

	config = {
		"arguments" : {"env" : "final"},
		"concat" : {},
		"env" : grunt.file.readJSON("./.grunt/config/env.json"),
		"jshint" : grunt.file.readJSON("./.grunt/config/jshint.json"),
		"watch" : grunt.file.readJSON("./.grunt/config/watch.json"),
		"requirejs" : grunt.file.readJSON("./.grunt/config/requirejs.json"),
		"command" : grunt.file.readJSON("./.grunt/config/command.json"),
		"js" : grunt.file.readJSON("./.grunt/config/javascript.json"),
		"paths" : grunt.file.readJSON("./.grunt/config/paths.json"),
		"sass" : grunt.file.readJSON("./.grunt/config/sass.json"),
		"pages" : grunt.file.readJSON("./.grunt/config/pages.json"),
		"imagemin" : grunt.file.readJSON("./.grunt/config/imagemin.json"),
	};
	grunt.initConfig(config);

	//file String file path (not required)
	function init(file) {
		if (!!ready){
			return;
		}
		if (!!file) {
			require("./.grunt/modules/mod-arguments").fromFile(file, grunt);
		} else {
			require("./.grunt/modules/mod-arguments").fromCommandLine(grunt);
		}

		var args = grunt.config.get("arguments");
		delete args.__warn;

		grunt.config.set("arguments",args);
		grunt.log.writeflags(grunt.config.get("arguments"));

		ready = true;
	}

	grunt.registerTask( "default" , "Uses the given target file to figure out what to do.\nUse this sintaxe sugar as a comment on your file:\n/*\n@grunt -task:task_name -arg=foo [-arg2=bar ...]\n*/\n", function (value) {
		if (!!value) {
			init(value);
			grunt.task.run(grunt.config.get("arguments").task);
		}
	});

	grunt.registerMultiTask('js', "Build AMD module.\n\n@see .grunt/requirejs-config.json\n", function (app) {
		init();
		require("./.grunt/tasks/task-comp-js").run(grunt, this);
	});

	grunt.registerMultiTask('pages', "Create all pages\n@see .grunt/pages.json", function () {
		init();
		require("./.grunt/tasks/task-create-page").run(grunt, this);
	});

	grunt.task.registerTask('render-template', "Render target argument as mustache template using page data object\n@see .grunt/pages.json\n", function (test_name) {
		init();
		require("./.grunt/tasks/task-render-file").run(grunt, this);
	});

	grunt.task.registerTask('build', "Comcommandes all tasks. '\nThere is an argument '-reset=true' that removes all tests made before\n", function () {
		init();
		var args = grunt.config.get("arguments");
		if (!!args && args.reset === "true"){
			var bash = require("./.grunt/modules/mod-run").bash,
				command = grunt.config.get("command")["clear-tests"];
			grunt.log.warn("Cleaning all tests and generated files...");
			bash(command,null,grunt);
		}
		grunt.task.run(["jshint","js","pages","sass:final"]);
	});
};