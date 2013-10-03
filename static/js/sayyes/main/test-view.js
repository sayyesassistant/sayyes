/*
@grunt -task=comp-js -page=test-view
*/
require([
	"sayyes/modules/log",
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
			// console.warn("ops! controller yeld a warning", arguments);
		});
		c.on.error.add(function(){
			// console.log("ops! controller found an error", arguments);
		});
		c.create_view(window.mock_view);
	}
	domReady(init);
});