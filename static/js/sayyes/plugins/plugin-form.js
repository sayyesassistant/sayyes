/*
@grunt -task=comp-js-all
*/
define([
	"mout/object/mixIn",
	"mout/queryString/decode",
	"sayyes/util/log",
	"signals/signals",
	"sayyes/util/ajax"
],function(
	mix_in,
	decode,
	log,
	signals,
	ajax
){

	var ClosureFormBind, blob, submit_event, reg_action;

	reg_action = /^[\w]+$/;

	submit_event = "submit";

	function _parseResult(result){
		this.form.removeClass("loading");
		this.view.form_result = result.value;
		var passed = (!!result.status && result.status!=="error");
			fn = passed ? this.on_success : this.on_error;
		this.view.on.nav.dispatch(fn);
	}

	function _submit_handle (event) {
		event.preventDefault();

		if(!!this.service && this.service.status !== this.service.status_idle){
			log.warn("plugin-form._submit_handle => service running...");
			return;
		}

		if (!this.service){
			this.service = new ajax();
			this.service
				.success(_parseResult.bind(this))
				.error(_parseResult.bind(this))
				.expect("status",function(value){
					return value !== "error";
				});
		}

		var form_data = this.form.serialize();
		if (form_data!==null && form_data!==undefined){
			this.view.form_data = decode(form_data);
		}

		this.form.addClass("loading");
		this.service
			.method(this.form.attr("method"))
			.request(this.form.attr("action"), this.view.form_data);
	}

	ClosureFormBind = function(config){
		mix_in(this,config);
		this.form = $(this.node);
		this.enable_ux();
		this.service = null;
	};

	ClosureFormBind.prototype = {
		enable_ux : function (){
			this.form.on(submit_event, _submit_handle.bind(this));
		},
		dispose : function(){
			this.form.off(submit_event, _submit_handle.bind(this));
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