/*
@grunt -task=comp-js-all
*/
require([
	"sayyes/util/log",
	"sayyes/modules/core",
	"lib/domReady",
	"sayyes/modules/controller",
	"sayyes/modules/tracker"
], function (
	log,
	core,
	domReady,
	controller,
	tracker
){

	var instance, track;

	function init(){

		if (!window.mock){
			log.error("missing window.mock ");
			return;
		}

		try {
			instance = controller(document.getElementById("sayyes-assistant"));

			track  = new tracker(instance);
			track.start();

			instance.define(window.mock);
		} catch (error) {
			log.error("error to create controller:",error.message);
			return;
		}
	}

	domReady(init);
});