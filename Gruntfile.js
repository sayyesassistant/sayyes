/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');

	var config   = {
		"arguments" : {
			"__warn":"don't change! this object will be auto-filled",
			"env" : "dev",
		},
		"concat":{},
		"requirejs"      : {
			"baseUrl": ".",
			"paths": {
				"lib": "{{{js_sources}}}/libs",
				"sayyes": "{{{js_sources}}}/sayyes",
				"mout": "{{{bower_path}}}/mout/src",
				"zepto": "{{{bower_path}}}/zeptojs/src",
				"req": "{{{bower_path}}}/requirejs",
				"mustache": "{{{bower_path}}}/mustache/"
			}
		}
	},	ready = false;

	config.tasks = grunt.file.readJSON("./.grunt/tasks.json");
	config.pages = grunt.file.readJSON("./.grunt/pages.json");
	config.paths = grunt.file.readJSON("./.grunt/paths.json");
	config["test-views"] = grunt.file.readJSON("./.grunt/tests.json");

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
			tasks = [];
			eachPage = function(list){
				return function(value,prop){
					list.push("comp-js:"+prop);
				};
			};
		forOwn(page,eachPage(tasks));
		grunt.task.run(tasks);
	});

	grunt.task.registerTask('render-template', "render target template", function (test_name) {
		var mock = grunt.config.get("blob-"+test_name),
			mustache = require("mustache"),
			file, file_name, rendered;

		if (!mock){
			grunt.fatal.fail("no data found to target",test_name)
			return;
		}

		file_name = mock.dest;

		//read target file
		try {
			file = grunt.file.read(file_name);
		} catch (err) {
			grunt.fail.fatal("coudn't open file: "+file_name);
			return;
		}

		rendered = mustache.render(file,mock.data);

		//override file with rendered template
		try{
			grunt.file.write(file_name, rendered);
		} catch (err) {
			grunt.fail.fatal("failed to create file: "+value.dest);
			return;
		}
		grunt.log.ok(file_name+" rendered.");
	});

	grunt.registerMultiTask('test-views', "run the task 'comp-js' to all targets", function () {
		var task = require("./.grunt/tasks/task-run-tests");
		task.run(grunt, this);
	});

	grunt.task.registerTask('run-tests', "Combines 'comp-js-all' with 'test-views'", function () {
		init();
		grunt.task.run(["comp-js-all","test-views"]);
	});
};