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
		"tasks" : grunt.file.readJSON("./.grunt/config/tasks.json"),
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

	grunt.registerTask('js', "Build AMD module.\n@usage grunt js -app=app_name -env=final|dev (dev is default)\n@see .grunt/requirejs-config.json\n", function (app) {
		init();
		if (!!app){
			var args = grunt.config.get("arguments");
				args.app = app;
			grunt.config.set("arguments",args);
			grunt.log.writeflags(args);
		}
		var task = require("./.grunt/tasks/task-comp-js");
		task.run(grunt, this);
	});

	grunt.task.registerTask('jss', "Run the task 'js' for every app\n@see .grunt/javascript.json\n", function () {
		init();
		var app = grunt.config.get("js"),
			forOwn = require("mout/object/forOwn"),
			tasks = ["jshint"];
			each_app = function(list){
				return function(value,prop){
					list.push("js:"+prop);
				};
			};
		forOwn(app,each_app(tasks));
		grunt.task.run(tasks);
	});

	grunt.registerMultiTask('pages', "Create all pages\n@see .grunt/pages.json", function () {
		init();
		var task = require("./.grunt/tasks/task-create-page");
		task.run(grunt, this);
	});

	grunt.task.registerTask('render-template', "Render target argument as mustache template using page data object\n@see .grunt/pages.json\n", function (test_name) {
		init();
		var task = require("./.grunt/tasks/task-render-file");
		task.run(grunt, this);
	});

	grunt.task.registerTask('build', "Combines all tasks. '\nThere is an argument '-reset=true' that removes all tests made before\n", function () {
		init();
		var args = grunt.config.get("arguments");
		if (!!args && args.reset === "true"){
			var bash = require("./.grunt/modules/mod-run").bash,
				command = grunt.config.get("tasks")["clear-tests"];
			grunt.log.warn("Cleaning all tests and generated files...");
			bash(command,null,grunt);
		}
		grunt.task.run(["jss","pages","sass:final"]);
	});
};