/*
@grunt -task=jss
*/
require([
	"sayyes/util/log",
	"sayyes/modules/core",
	"lib/domReady",
	"sayyes/modules/controller"
], function (
	log,
	core,
	domReady,
	controller
){
	var instance, track;
	function init(){
		if (!window.mock){
			log.error("missing window.mock ");
			return;
		}
		try {
			instance = controller(document.getElementById("sayyes-assistant"));
			instance.create(window.mock);
		} catch (error) {
			log.error("error to create controller:",error.message);
			return;
		}
	}
	domReady(init);
});