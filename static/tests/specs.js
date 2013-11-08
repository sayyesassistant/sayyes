var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;

var htmlReporter = new jasmine.HtmlReporter();

jasmineEnv.addReporter(htmlReporter);

jasmineEnv.specFilter = function(spec) {
	return htmlReporter.specFilter(spec);
};

require([
	"zepto/zepto",
	"zepto/data",
	"zepto/event",
	"zepto/form",
	"zepto/ajax",
	"test/spec/spec-model",
	"test/spec/spec-vos",
	"test/spec/spec-ajax"
],function(){
	jasmineEnv.execute();
});
