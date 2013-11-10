/*
@grunt -task=comp-js-all
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

	var instance;

	function init(){

		if (!window.mock){
			log.error("missing window.mock ");
			return;
		}

		try {
			instance = controller(document.getElementById("sayyes-assistant"));
			instance.define(window.mock);
		} catch (error) {
			log.error("error to create controller",error);
			return;
		}
	}

	domReady(init);
});