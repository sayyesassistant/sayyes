/*
global module: true, process:true
*/
module.exports = function (grunt) {
	var config   = {
		"pages" : {
			"app": {
				"src"  : "main/main-app",
				"dest" : "{{{dest_js_folder}}}/main-app-min.js",
			}
		},
		"arguments" : {
			"warn":"don't change! this property will be auto-filled",
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

			"js_sources"     : "{{{root}}}/js",
			"dest_js_folder" : "{{{root}}}/js-min",

			"sass_sources"   : "{{{root}}}/sass",
			"dest_css_folder": "{{{root}}}/css-min",

			"bower_path": "bower_components"
		},
		"requirejs"      : {
			"baseUrl": ".",
			"paths": {
				"main": "{{{js_sources}}}/sayyes/main",
				"lib": "{{{js_sources}}}/libs",
				"mod": "{{{js_sources}}}/sayyes/modules",
				"helper": "{{{js_sources}}}/sayyes/helper",
				"mout": "{{{bower_path}}}/mout/src",
				"zepto": "{{{bower_path}}}/zeptojs/src",
				"req": "{{{bower_path}}}/requirejs",
				"mustache": "{{{bower_path}}}/mustache/"
			}
		}
	}, normalized = false;

	grunt.initConfig(config);

	//file String file path (not required)
	function init(file) {
		if (!!normalized){return;}
		require("./.grunt/modules/mod-arguments").fromCommandLine(grunt);
		require("./.grunt/modules/mod-arguments").fromFile(file, grunt);
		var args = grunt.config.get("arguments");
		delete args.warn;
		grunt.config.set("arguments",args);
		grunt.log.writeflags(grunt.config.get("arguments"));
		normalized = true;
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

	grunt.task.registerTask('comp-js-all', "run the task 'comp-js' to all targets", function () {

	});
};