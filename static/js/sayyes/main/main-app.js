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
	var mock = {
		title : "Hello world"
		, description : "At vero eos et accusamus et iusto odio dignissimos\nducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio"
	};

	function add_view (event,view) {
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
		var v;
		try {
			v = view({
				template_name : "mock-test",
				name:"view test"
			});
		} catch (err) {
			console.log("error:",err);
			log_error(err);
			return;
		}
		v.events.one("view-render-ok",add_view);
		v.events.one("view-render-fail",log_error);
		v.render(mock);
	}
	domReady(init);
});