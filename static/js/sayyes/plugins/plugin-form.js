/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log",
	"signals/signals",
	"sayyes/modules/ajax"
],function(
	log,
	signals,
	ajax
){

	var ClosureFormBind, blob, submit_event;

	submit_event = "submit";

	ClosureFormBind = function(node){
		this.form = $(node);
		this.trigger = new signals();
		this.enable_ux();
		this.service = null;
	};

	ClosureFormBind.prototype = {
		submit_handle : function (event){
			event.preventDefault();
			if (!this.service){
				this.service = new ajax();
				this.service.trigger.success.add(function(vo){
					console.log("plugin-form success notified",vo);
				});
				this.service.trigger.error.add(function(vo){
					console.log("plugin-form error notified",vo);
				});
				this.service.expect("success",true).expect("value",String);
			}
			this.service
				.method(this.form.attr("method"))
				.request(this.form.attr("action"), this.form.serialize());
		},
		enable_ux : function (){
			this.form.on(submit_event,this.submit_handle.bind(this));
		},
		dispose : function(){
			this.form.off(submit_event,this.submit_handle.bind(this));
			this.form = null;
		}
	};

	return function(view){

		function each_form (index,node) {
			if (!!node){
				blob = new ClosureFormBind(node);
				blob.trigger.add(view.on.nav.dispatch);
				view.plugin_closures.push(blob);
			}
		}

		if (!view || (!!view && !view.html)) {
			log.error("plugin-form got no view!");
			return false;
		}
		view.html.find("form").each(each_form);
		return true;
	};
});