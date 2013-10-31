var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 1000;

var htmlReporter = new jasmine.HtmlReporter();

jasmineEnv.addReporter(htmlReporter);

jasmineEnv.specFilter = function(spec) {
	return htmlReporter.specFilter(spec);
};

require([
	"test/spec/spec-model",
	"test/spec/spec-vos"
],function(){
	jasmineEnv.execute();
});
