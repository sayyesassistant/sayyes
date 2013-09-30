/*
@grunt -task=comp-js -page=app
*/
require([
	"sayyes/modules/log",
	"sayyes/modules/core",
	"lib/domReady",
	"sayyes/modules/view"
], function (
	log,
	core,
	domReady,
	view
){
	function add_view (event,view) {
		log.info("add_view",view.html);
		$("body").append(view.html);
		view.enable_ux();
	}

	function log_error (arg) {
		if (typeof arg === "string"){
			log.error(arg);
		} else {
			log.error(arg.type);
		}
	}

	function init () {
		var v;
		try {
			v = view({
				template_name : "mock-test",
				name:"view test"
			});
			log.info("view created");
		} catch (err) {
			console.log("error:",err);
			log_error(err);
			return;
		}
		v.events.one("view-render-ok",add_view);
		v.events.one("view-render-fail",log_error);
		v.render(window.mock_data);
	}
	domReady(init);
});