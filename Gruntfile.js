/*
global module: true, process:true
*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-concat');

	var config   = {
		"pages" : {
			"app": {
				"src"  : "sayyes/main/main-app",
				"dest" : "{{{dest_js_folder}}}/main-app-min.js",
			}
		},
		"arguments" : {
			"__warn":"don't change! this object will be auto-filled",
			"env" : "dev",
		},
		"tasks" : {
			"comp-js" : {
				"dev" : {
					"cmd"  : "node",
					"args" : ["bower_components/r.js/dist/r.js","-o","baseUrl={{{baseUrl}}}","optimize=none","skipModuleInsertion=false","name={{{src}}}","out={{{dest}}}"]
				},
				"final" : {
					"cmd"  : "node",
					"args" : ["bower_components/r.js/dist/r.js","-o","baseUrl={{{baseUrl}}}","optimize=uglify2","skipModuleInsertion=false","generateSourceMaps=false","preserveLicenseComments=false","name={{{src}}}","out={{{dest}}}"]
				}
			}
		},
		"path" : {

			"root"           : "static",
			"store"          : "",

			"templates"		: "{{{root}}}/templates",
			"tests"			: "{{{root}}}/tests",
			"test_index"	: "{{{root}}}/templates/test-index.mustache",

			"js_sources"     : "{{{root}}}/js",
			"dest_js_folder" : "{{{root}}}/js-min",

			"sass_sources"   : "{{{root}}}/sass",
			"dest_css_folder": "{{{root}}}/css-min",

			"bower_path": "bower_components"
		},
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
		},
		"tests" : {
			"test1" : {
				"dest" : "{{{tests}}}/test1.html",
				"view" : "{{{templates}}}/test-view.mustache",
				"template" : "{{{templates}}}/simple-template.mustache",
				"js_src":"/{{{dest_js_folder}}}/main-app-min.js",
				"mock_data" : '{"title":"Foo Bar", "description":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. "}'
			}
		}
	}, ready = false;

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

	grunt.registerTask('comp-js', "Build AMD module.\n@usage grunt comp-js -page=foo -env=final|dev (dev is default)", function () {
		init();
		var task = require("./.grunt/tasks/task-comp-js");
		task.run(grunt, this);
	});

	grunt.task.registerTask('run-tests', "create tests for templates", function () {
		init();
		var task = require("./.grunt/tasks/task-run-tests");
		task.run(grunt, this);
	});

	grunt.task.registerTask('comp-js-all', "run the task 'comp-js' to all targets", function () {

	});
};