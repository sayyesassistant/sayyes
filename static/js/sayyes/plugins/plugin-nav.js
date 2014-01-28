/*
@grunt -task=jss
*/
define([
	"sayyes/util/log",
	"mout/array/forEach"
],function(
	log,
	forEach
){

	var ClosureNav, blob, click_event, reg, instances;

	click_event = "click";

	reg = /([\w-]+)$/;

	function _click_handle (event){
		var nav_to = event.target.href.match(reg);
		if (!!nav_to && !!nav_to[1]){
			this.view.on.nav.dispatch(nav_to[1]);
		} else {
			event.preventDefault();
			log.info("plugin-nav couldn't find nav value on:",event.target.href);
		}
	}

	ClosureNav = function (node,view) {
		this.node = $(node);
		this.view = view;
		this.enable_ux();
	};

	ClosureNav.prototype = {

		enable_ux : function (){
			this.node.on(click_event,_click_handle.bind(this));
		},

		dispose : function(){
			this.node.off(click_event,_click_handle.bind(this));
			this.node = null;
			this.view = null;
		}
	};

	function _init(view){
		instances = [];
		function each_link (index,node) {
			if (!!node){
				blob = new ClosureNav(node, view);
				instances.push(blob);
			}
		}
		view.html.find("[data-role='nav']").each(each_link);
	}

	function _dispose(closure){
		closure.dispose();
		closure = null;
	}

	return {
		run : function (view) {
			if (!view || (!!view && !view.html)) {
				log.error("plugin-nav got no view!");
				return;
			}
			_init(view);
		},
		dispose : function(){
			if (!!instances){
				forEach(instances, _dispose);
				instances = null;
			}
		}
	};
});