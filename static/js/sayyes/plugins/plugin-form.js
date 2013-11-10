/*
@grunt -task=comp-js-all
*/
define([
	"mout/object/mixIn",
	"sayyes/util/log",
	"signals/signals",
	"sayyes/util/ajax"
],function(
	mix_in,
	log,
	signals,
	ajax
){

	var ClosureFormBind, blob, submit_event,
		__parseError, __parseSuccess, reg_action;

	reg_action = /^[\w]+$/;

	submit_event = "submit";

	__fireAction = function (value) {

		if (!value){
			log.warn("plugin-form.__fireAction got no action to take!");
			return null;
		}

		var blob = value.split("="),
			target = blob[1] || "";
			target = target.match(reg_action);

		switch (blob[0]) {
			case "alert":
				this.view.show_alert();
				break;
			case "nav":
				this.view.on.nav.dispatch(target ? target[0] : null);
				break;
		}
	};

	__parseError = function (result){
		this.view.form_result = result.value;
		__fireAction.bind(this)(this.on_error);
	};

	__parseSuccess = function (result){
		this.view.form_result = result.value;
		__fireAction.bind(this)(this.on_success);
	};

	ClosureFormBind = function(config){
		mix_in(this,config);
		this.form = $(this.node);
		this.enable_ux();
		this.service = null;
	};

	ClosureFormBind.prototype = {
		submit_handle : function (event){
			event.preventDefault();
			if (!this.service){
				this.service = new ajax();
				this.service
					.success(__parseSuccess.bind(this))
					.error(__parseError.bind(this))
					.expect("status",function(value){
						return value !== "error";
					});
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
				var on_success = node.getAttribute("data-on-success"),
					on_error = node.getAttribute("data-on-error");
				if (!!on_success && !!on_error){
					blob = new ClosureFormBind({
						"node":node,
						"view":view,
						"on_success":on_success,
						"on_error":on_error
					});
					view.plugin_closures.push(blob);
				} else {
					log.error("plugin-form :: failed to init form, missing base attribute");
				}
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