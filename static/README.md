#Say Yes!

---

###How this folder is organized?

- `css-min`: designed for serving minified css for the page.
 
	 **route**: `~/css-min/(.*\.css)`

- `examples`:<a name="examples"></a> designed for hosting page examples.
 
	**route**: `/examples`

	**Do not edit this folder.**
	
	All files inside this folder are created/removed by the task: `grunt examples`.


- `js`: desiged for javascript source files.

- `js-min`: desiged for serving minified javascript files.
 
	**route**: `~/js-min/(.*\.js)`
- `mock`: desiged for serving mock data for the app/services and static templates.

	**route**: `~/mock-data/`
- `sass`: designed for hosting sass files that will be generated after calling the task: `grunt comp-sass`
- `templates`: designed for hosting mustache template files that are used by [examples](#examples) pages- `tests`: designed for hosting javascript unit test
	**route**:`~/tests/index.html`