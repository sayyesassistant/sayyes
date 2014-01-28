/*
@grunt -task=js:test-view
*/
require([
	"sayyes/util/log",
	"sayyes/modules/core",
	"sayyes/modules/ui",
	"lib/domReady"
], function (
	log,
	core,
	ui,
	domReady
){
	function init () {
		ui.run();
	}
	domReady(init);
});