/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

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
				src: ['static/js/sayyes/**/*.js']
			}
		}
	},	ready = false;

	config.requirejs = grunt.file.readJSON("./.grunt/requirejs-config.json");
	config.tasks = grunt.file.readJSON("./.grunt/tasks.json");
	config.pages = grunt.file.readJSON("./.grunt/pages.json");
	config.paths = grunt.file.readJSON("./.grunt/paths.json");
	config["test-views"] = grunt.file.readJSON("./.grunt/test-views.json");

	grunt.initConfig(config);

	//file String file path (not required)
	function init(file) {
		if (!!ready){return;}
		require("./.grunt/modules/mod-arguments").fromCommandLine(grunt);
		if (!!file) {
			require("./.grunt/modules/mod-arguments").fromFile(file, grunt);
		}
		var args = grunt.config.get("arguments");
		delete args.__warn;
		grunt.config.set("arguments",args);
		grunt.log.writeflags(grunt.config.get("arguments"));
		ready = true;
	}

	grunt.registerTask( "default" , "use the given target file to figure out what to do.", function (value) {
		if (!!value) {
			init(value);
			grunt.task.run(grunt.config.get("arguments").task);
		}
	});

	grunt.registerTask( "build-sass" , "Runs sass compiler", function () {
		init();
		// require("./.grunt/tasks/task-comp-sass").run(grunt, this);
	});

	grunt.registerTask('sass-watch', "Starts the sass -watch command", function () {
		init();
		// require("./.grunt/tasks/task-sass-watch").run( grunt, this );
	});

	grunt.registerTask('comp-js', "Build AMD module.\n@usage grunt comp-js -page=foo -env=final|dev (dev is default)", function (page) {
		init();
		if (!!page){
			var args = grunt.config.get("arguments");
				args.page = page;
			grunt.config.set("arguments",args);
		}
		var task = require("./.grunt/tasks/task-comp-js");
		task.run(grunt, this);
	});

	grunt.task.registerTask('comp-js-all', "run the task 'comp-js' to all targets", function () {
		init();
		var page = grunt.config.get("pages"),
			forOwn = require("mout/object/forOwn"),
			tasks = ["jshint"];
			eachPage = function(list){
				return function(value,prop){
					list.push("comp-js:"+prop);
				};
			};
		forOwn(page,eachPage(tasks));
		grunt.task.run(tasks);
	});

	grunt.task.registerTask('render-template', "render target template", function (test_name) {
		init();
		var task = require("./.grunt/tasks/task-render-file");
		task.run(grunt, this);
	});

	grunt.registerMultiTask('test-views', "run the task 'comp-js' to all targets", function () {
		init();
		var task = require("./.grunt/tasks/task-test-view");
		task.run(grunt, this);
	});

	grunt.task.registerTask('run-tests', "Combines 'comp-js-all' with 'test-views'", function () {
		init();
		var args = grunt.config.get("arguments");
		if (!!args && args.reset === "true"){
			var bash = require("./.grunt/modules/mod-run").bash,
				command = grunt.config.get("tasks")["clear-tests"],
				render = require("./.grunt/modules/mod-render").render,
				paths = grunt.config.get("paths");
			paths = render(paths);
			command = render(command,paths);
			grunt.log.warn("Cleaning all tests before ...");
			bash(command,null,grunt);
		}
		grunt.task.run(["comp-js-all","test-views"]);
	});
};