/*
@grunt -task=comp-js-all -env=final
*/
define([
	"sayyes/util/ajax",
	"sayyes/util/log",
	"mout/object/forOwn",
	"mout/array/forEach",
	"mustache/mustache",
	"signals/signals"
], function (
	ajax,
	log,
	for_own,
	for_each,
	mustache,
	signals
) {

	var FormTracker, input_render;

	input_render = mustache.compile("<input type='hidden' name='{{name}}' value='{{value}}' />");

	function _init (instance, query) {
		instance.form = document.getElementsByClassName(query);

		if (!instance.form || instance.form.length>1){
			log.error("FormTracker failed to find '"+query+"' or many items were found.");
			return;
		}

		instance.on ={
			success : new signals(),
			error : new signals()
		};

		instance.form = $(instance.form[0]);
		instance.service = new ajax();
	}

	FormTracker = function (form_query) {
		_init(this,form_query);
	};

	function _update_hidden (key, value, form) {
		if (!form || !key || !value){
			log.error("tracker._update_hidden => got invalid arguments to udpate.");
			return;
		}
		var input = form.find("input[name="+key+"]");
		if (!!input.length){
			input.attr("value",value);
			return;
		}
		form.append(input_render({'name':key,'value':value}));
	}

	function _update_hiddens (arr, form) {
		function each_hidden (value, key) {_update_hidden(key, value, form); }
		function each_item (data, index) {for_own(data,each_hidden); }
		if (!!arr) {
			for_each(arr, each_item);
		}
	}

	function _parse_success (result) {
		var form = this.form;
		if (!!result.value.hiddens) {
			console.error("empty all");
			this.form.empty();
			_update_hiddens(result.value.hiddens,form);
		}
		this.on.success.dispatch(result.value);
	}

	function _notify_error (result){
		log.error("tracker._notify_error => failed to request next view",result);
		this.on.error.dispatch(result);
	}

	FormTracker.prototype = {
		run : function (init_data) {
			if (!this.form){
				log.error("impossible to request view, no form found");
				return;
			}

			if (!!init_data){
				_update_hiddens(init_data,this.form);
			}

			var data = this.form.serialize();

			if (!data || (!!data && !data.length)) {
				log.warn("FormTracker._on_nav failed to track. for has no data");
				return;
			}

			this.service.on.success.removeAll();
			this.service.on.error.removeAll();

			this.service.on.success.addOnce(_parse_success.bind(this));
			this.service.on.error.addOnce(_notify_error.bind(this));

			this.service
				.expect("status",function(value){return value!=="error";})
				.expect("value",function(value){return !!value;})
				.method(this.form.attr("method"))
				.request(this.form.attr("action"),data);
		}
	};

	return FormTracker;
});