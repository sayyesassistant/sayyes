var jasmineEnv = jasmine.getEnv(),
	htmlReporter = new jasmine.HtmlReporter();

jasmineEnv.updateInterval = 1000;
jasmineEnv.addReporter(htmlReporter);

jasmineEnv.specFilter = function(spec) {
	return htmlReporter.specFilter(spec);
};

requirejs.config({
	"baseUrl": "/js-src/libs",
	"paths": {
		"tests": "/tests",
		"lib": "/js-src/libs",
		"sayyes": "/js-src/sayyes",
		"mout": "/bower_path/mout/src",
		"signals": "/bower_path/js-signals/dist",
		"zepto": "/bower_path/zeptojs/src",
		"req": "/bower_path/requirejs",
		"mustache": "/bower_path/mustache/"
	}
});

require([
	"order!zepto/zepto",
	"order!zepto/data",
	"order!zepto/event",
	"order!zepto/form",
	"order!zepto/ajax",
	"tests/spec/spec-model",
	"tests/spec/spec-vos",
	"tests/spec/spec-ajax",
	"tests/spec/spec-log",
	"lib/domReady"
],function(){
	domReady = arguments[arguments.length-1];
	domReady(function(){
		jasmineEnv.execute();
	});
});
