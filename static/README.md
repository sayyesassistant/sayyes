#<a name="top"></a>Say Yes!

###How this folder is organized?

- ###<a name="css-min"># </a>/css-min
	
	designed for serving minified css for the page.

	> **route**: `~/css-min/(.*\.css)`

- ###<a name="examples"># </a>/examples

	designed for hosting page/modules examples.

	> **route**: `/examples`

	**Do not edit this folder.**

	All files inside this folder are created/removed by the task: `grunt examples`.

- ###<a name="js"># </a>/js

	desiged for javascript source files.


- ###<a name="js-min"># </a>/js-min
	
	desiged for serving minified javascript files.

	> **route**: `~/js-min/(.*\.js)`

- ###<a name="mock"># </a>/mock
	
	desiged for serving mock data for the app/services and static templates.

	> **route**: `~/mock-data/`
	
- ###<a name="sass"># </a>/sass

	designed for hosting sass files that will be generated after calling the task: `grunt comp-sass`

- ###<a name="templates"># </a>/templates

	designed for hosting mustache template files that are used by [examples](#examples) pages

- ###<a name="tests"># </a>/tests

	designed for hosting javascript unit test (using Jasmine)

	> **route**:`~/tests/index.html`

[#top](#top)