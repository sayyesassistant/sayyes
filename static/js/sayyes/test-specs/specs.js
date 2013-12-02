function __init_tests__(){
	var jasmineEnv = jasmine.getEnv(),
		htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.updateInterval = 1000;
	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};
	jasmineEnv.execute();
}
/*
@grunt -task=comp-js -app=test-specs -env=final
*/
require([
	"lib/domReady",
	"sayyes/modules/core",
	"sayyes/test-specs/spec-model",
	"sayyes/test-specs/spec-vos",
	"sayyes/test-specs/spec-ajax",
	"sayyes/test-specs/spec-log"
],function(domReady){
	domReady(__init_tests__);
});
