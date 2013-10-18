/*
@grunt -task=comp-js-all
*/
define([
	"mout/object/mixIn",
	"sayyes/modules/log",
	"signals/signals",
	"sayyes/modules/ajax"
],function(
	mixIn,
	log,
	signals,
	ajax
){

	var ClosureFormBind, blob, submit_event,
		__parseError, __parseSuccess;

	submit_event = "submit";

	__parseError = function (result){
		console.log(" deu certo:",this.on_error);
		// this.view.show_alert(result,0);
	};

	__parseSuccess = function (result){
		console.log(" deu certo:",this.on_success);
		// this.view.show_alert(result,0);
	};

	ClosureFormBind = function(config){
		mixIn(this,config);
		this.form = $(this.node);
		this.enable_ux();
		this.service = null;
	};

	ClosureFormBind.prototype = {
		submit_handle : function (event){
			event.preventDefault();
			if (!this.service){
				this.service = new ajax();
				this.service.trigger.success.add(__parseSuccess.bind(this));
				this.service.trigger.error.add(__parseError.bind(this));
				this.service.expect("success",true);
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