#<a name="top"></a>Say Yes!

---

This documents explains the main files we have here and the [grunt tasks](#grunt) we most use during the daily workflow.

- [Folder structure](#structure)

- [Grunt tasks](#grunt)

- Daily workflow - TO-DO

---

###<a name="structure"># </a>Folder structure

There are some files here that are related to the tasks we have:

- ###<a name="paths"># </a>paths.json

	This document is a very simple json file with a set of [mustache](http://mustache.github.io/)  paths that will be rendered before **every** task in order to feed the tasks that uses this paths. i.e:

		"root"             : ".",
		"static"           : "static",
		"templates"        : "{{{root}}}/{{{static}}}/templates",
		"tests"            : "{{{static}}}/tests",

	After render they will look like:

		"root"             : ".",
		"static"           : "static",
		"templates"        : "./static/templates",
		"tests"            : "static/tests",


- ###<a name="app.json"># </a>app.json

	This document defines the javascripts that will be used by the guideline, examples, tests, and the actual site. This json could be described like:

		// the name you will use with "grunt comp-sass:my-page-name"
		"my-page-name" : {	
		
			//src is the file path (don't use trailing .js on file's name)
			"src":"sayyes/main/test-view",
			
			//the destination folder and file name
			"dest":"{{{dest_js_folder}}}/test-view-min.js"
		}

	This json will be used by the [task comp-js](#comp-js) to create the target javascript file with all modules and dependencies.


- ###<a name="pages.json"># </a>pages.json

	This document defines the pages (examples or any other page) that will be created by the [task examples](#examples).
	
		{
			"dest" : "{{{static}}}/examples/example-name.html",
			//destination file
			//this prop can't be null
		
			"files" : ["{{{templates}}}/inc/header.mustache","{{{templates}}}/pages/tmplt-guideline.mustache","{{{templates}}}/inc/footer.mustache"],
			//a list of files that will be concatenated to generate the 'dest'
			//this prop can't be null
		
			"raw": {
				"mock_template": "{{{templates}}}/views/view-mock.mustache"
			},
			//designed for data that will be printed on 'dest' but without performing the mustache render
			//this prop can be null
		
			"data" : "{{{static}}}/mock/mock-guideline.json"
			// data as String must be used when you want to provide a file's path that contains all the data you want.
			// data as Object defines the data provider that will be used on 'dest' to render all the mustache values.
			//this prop can be null
		}


- ###<a name="requirejs-config.json"># </a>requirejs-config.json
	This document will be used by [task comp-js](#comp-js) to provide all namespaces that will be used by [requirejs](http://requirejs.org/docs/api.html#config)

- ###<a name="sass.json"># </a>sass.json

	This document defines different ways to compile the sass file accordingly to the env you provide. See more on [task comp-sass](#comp-sass)


- ###<a name="tasks.json"># </a>tasks.json

	This document defines all the bash code that are executed by the tasks.

[#top](#top)

---

###<a name="grunt"># </a>Grunt tasks

We have a few tasks that helps during the development/deployment.

###Following the main grunt tasks:


- `$: grunt` [comp-js](#comp-js)

- `$: grunt` [comp-js-all](#comp-js-all)

- `$: grunt` [comp-sass](#comp-sass)

- `$: grunt` [sass-watch](#sass-watch)

- `$: grunt` [examples](#examples)

- `$: grunt` [run-tests](#run-tests)

- `$: grunt -h` to see all available tasks

[#top](#top)

---

- ###<a name="comp-js"># </a>comp-js

	This task uses the [require optimizer](http://requirejs.org/docs/optimization.html) setting the config file as [requirejs-config.json](#requirejs-config.json) to create the javascript that will be loaded by the [pages](#app.json) we have.

- ###<a name="comp-js-all"># </a>comp-js-all

	This is just an *alias task* to run [comp-js](#comp-js) through all [pages](#app.json) we have. Before running the comp-js for each app we also run jshint to make sure that all javascript won't fail. 

- ###<a name="comp-sass"># </a>comp-sass

	This task compiles the sass files defined by [this document](#sass.json)

- ###<a name="sass-watch"># </a>sass-watch

	This task runs the *[sass watch](http://sass-lang.com/documentation/file.SASS_REFERENCE.html)* on the files defined by [this document](#sass.json)


- ###<a name="run-tests"># </a>examples

	This task will create all [pages](#pages.json) concatenating all fragments into a single file and then render this target page with all *data* you've defined.

- ###<a name="run-tests"># </a>run-tests

	This task combines **comp-js-all**, **examples**, **comp-sass**

[#top](#top)