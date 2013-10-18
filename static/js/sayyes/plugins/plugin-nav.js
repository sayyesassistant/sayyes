/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log"
],function(
	log
){

	var ClosureNav, blob, click_event, reg;

	click_event = "click";

	reg = /([\w-]+)$/;

	ClosureNav = function (node,view) {
		this.node = $(node);
		this.view = view;
		this.enable_ux();
	};

	ClosureNav.prototype = {

		click_handle : function (event){
			event.preventDefault();
			console.log(event.target.href);
			var nav_to = event.target.href.match(reg);
			if (!!nav_to && !!nav_to[1]){
				this.view.on.nav.dispatch(nav_to[1]);
			} else {
				log.info("plugin-nav couldn't find nav value on:",event.target.href);
			}
		},

		enable_ux : function (){
			this.node.on(click_event,this.click_handle.bind(this));
		},

		dispose : function(){
			this.node.off(click_event,this.click_handle.bind(this));
			this.node = null;
			this.view = null;
		}
	};

	return function(view){

		function each_link (index,node) {
			if (!!node){
				blob = new ClosureNav(node, view);
				view.plugin_closures.push(blob);
			}
		}

		if (!view || (!!view && !view.html)) {
			log.error("plugin-nav got no view!");
			return false;
		}

		view.html.find("[data-role='nav']").each(each_link);
		return true;

	};
});