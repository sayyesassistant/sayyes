/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');

	var config   = {
		arguments : {
			"__warn":"don't change! this object will be auto-filled",
			"env" : "dev",
		},
		concat:{},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true,
					require:true,
					define:true
				}
			},
			all: {
				src: ['./**/js/sayyes/**/*.js','./**/test/spec/*.js']
			}
		}
	},	ready = false;

	config.requirejs = grunt.file.readJSON("./.grunt/requirejs-config.json");
	config.tasks = grunt.file.readJSON("./.grunt/tasks.json");
	config.app = grunt.file.readJSON("./.grunt/app.json");
	config.paths = grunt.file.readJSON("./.grunt/paths.json");
	config.sass = grunt.file.readJSON("./.grunt/sass.json");
	config.pages = grunt.file.readJSON("./.grunt/pages.json");

	grunt.initConfig(config);

	//file String file path (not required)
	function init(file) {
		if (!!ready){return;}
		require("./.grunt/modules/mod-arguments").fromCommandLine(grunt);
		if (!!file) {
			require("./.grunt/modules/mod-arguments").fromFile(file, grunt);
		}
		var args = grunt.config.get("arguments"),
			paths = grunt.config.get("paths"),
			render = require("./.grunt/modules/mod-render").render,
			jshint = grunt.config.get("jshint");

		paths = render(paths);
		jshint = render(jshint,paths);
		grunt.config.set("jshint",jshint);

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

	grunt.registerTask( "comp-sass" , "Runs sass compiler.\n@usage: grunt comp-sass -env=final|dev (dev is default)\n@see .grunt/sass.json\n", function () {
		init();
		require("./.grunt/tasks/task-comp-sass").run(grunt, this);
	});

	grunt.registerTask('comp-js', "Build AMD module.\n@usage grunt comp-js -app=app_name -env=final|dev (dev is default)\n@see .grunt/requirejs-config.json\n", function (app) {
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

	grunt.task.registerTask('comp-js-all', "Run the task 'comp-js' for every app\n@see .grunt/apps.json\n", function () {
		init();
		var app = grunt.config.get("app"),
			forOwn = require("mout/object/forOwn"),
			tasks = ["jshint"];
			each_app = function(list){
				return function(value,prop){
					list.push("comp-js:"+prop);
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

	grunt.task.registerTask('run-tests', "Combines 'comp-js-all' and 'pages'\nThere is an argument '-reset=true' that removes all tests made before\n", function () {
		init();
		var args = grunt.config.get("arguments");
		if (!!args && args.reset === "true"){
			var bash = require("./.grunt/modules/mod-run").bash,
				command = grunt.config.get("tasks")["clear-tests"],
				render = require("./.grunt/modules/mod-render").render,
				paths = grunt.config.get("paths");
			paths = render(paths);
			command = render(command,paths);
			grunt.log.warn("Cleaning all tests and generated files...");
			bash(command,null,grunt);
		}
		grunt.task.run(["comp-js-all","pages","comp-sass"]);
	});

	grunt.registerTask('sass-watch', "Starts the sass -watch command", function () {
		init();
		grunt.log.ok("to-do!!");
		// require("./.grunt/tasks/task-sass-watch").run( grunt, this );
	});
};