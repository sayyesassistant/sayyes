/*
@grunt -task=comp-js -page=app
*/
require([
	"sayyes/modules/core",
	"lib/domReady",
	"sayyes/modules/view"
], function (
	core,
	domReady,
	view
){
	function add_view (event,view) {
		console.info("add_view",view.html);
		$("body").append(view.html);
		view.enable_ux();
	}

	function log_error (arg) {
		if (typeof arg === "string"){
			console.error(arg);
		} else {
			console.error(arg.type);
		}
	}

	function init () {
		console.info("init");
		var v;
		try {
			v = view({
				template_name : "mock-test",
				name:"view test"
			});
			console.info("view created");
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