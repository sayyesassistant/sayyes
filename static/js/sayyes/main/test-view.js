/*
@grunt -task=comp-js -app=test-view
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
	function init () {
		var c;
		try{
			c = controller(document.getElementById("sayyes-assistant"));
		} catch (err){
			log.error("error to create controller",err);
			return;
		}
		c.on.warn.add(function(){
			log.warn("ops! controller yeld a warning", arguments);
		});
		c.on.error.add(function(){
			log.info("ops! controller found an error", arguments);
		});
		c.create_view(window.mock);
	}
	domReady(init);
});