/*
@grunt -task=comp-js -app=test-view
*/
require([
	"sayyes/util/log",
	"sayyes/modules/core",
	"sayyes/plugins/ui",
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