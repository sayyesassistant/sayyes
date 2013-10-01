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
	function log_ok (event,args) {
		log.info(event.type);
	}

	function log_error (event, args) {
		log.error(event.type, args);
	}

	function init () {
		var c;
		try{
			c = controller(document.getElementById("sayyes-assistant"));
		} catch (err){
			log.error("error to create controller",err);
			return;
		}
		c.events.on("create_view:fail",log_error);
		c.events.on("create_view:ok",log_ok);
		c.create_view({
			"name":"test"
			,"template_name":"mock-test"
		});
		c.render_view(window.mock_data);
		c.open();
	}
	domReady(init);
});