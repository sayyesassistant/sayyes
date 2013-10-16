/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log",
	"signals/signals"
],function(
	log,
	signals
){

	var ClosureNav, blob, click_event, reg_trailing;

	click_event = "click";

	reg_trailing = /(nav=)([\w-_]+)/;

	ClosureNav = function(node){
		this.node = $(node);
		this.trigger = new signals();
		this.enable_ux();
	};

	ClosureNav.prototype = {
		click_handle : function (event){
			var nav_to = event.target.href.match(reg_trailing);
			if (nav_to && nav_to.length>=2){
				this.trigger.dispatch(nav_to[2]);
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
		}
	};

	return function(view){

		function each_link (index,node) {
			if (!!node){
				blob = new ClosureNav(node);
				blob.trigger.add(view.on.nav.dispatch);
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