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
		log.info(event.type,args);
	}

	function log_error (event, args) {
		log.warn(event.type, args);
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

		c.events.on("render_view:ok",log_ok);
		c.events.on("render_view:fail",log_error);

		c.events.on("close_current:warn",log_error);
		c.events.on("open:fail",log_error);
		c.events.on("open:ok",log_ok);

		c.create_view({
			"name":"test",
			"template_name":"mock-test",
			"data" : window.mock_data
		});
	}
	domReady(init);
});