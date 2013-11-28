/*
@grunt -task=comp-js-all
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

	var AppTracker, input_render;

	input_render = mustache.compile("<input type='hidden' name='{{name}}' value='{{value}}' />");

	function _init (instance) {
		instance.form = document.getElementsByClassName("session-tracker");
		if (!instance.form){
			log.error("AppTracker failed to find 'session-tracker' form");
			return;
		}
		instance.on ={
			success : new signals(),
			error : new signals()
		};
		instance.form = $(instance.form[0]);
		instance.service = new ajax();
	}

	AppTracker = function(){
		_init(this);
	};

	function _updateHidden (key, value, form) {
		if (!form || !key || !value){
			log.error("tracker._updateHidden => got invalid arguments to udpate.");
			return;
		}
		var input = form.find("input[name="+key+"]");
		if (!!input.length){
			input.attr("value",value);
			return;
		}
		form.append(input_render({'name':key,'value':value}));
	}

	function _parse_success (result) {
		var form = this.form;
		function each_hidden (value, key) {_updateHidden(key, value, form); }
		function each_item (data, index) {for_own(data,each_hidden); }
		if (!!result.value.hiddens) {
			for_each(result.value.hiddens, each_item);
		}
		this.on.success.dispatch(result);
	}

	function _notify_error (result){
		log.error("tracker._notify_error => failed to request next view",result);
		this.on.error.dispatch(result.value);
	}

	AppTracker.prototype = {
		request_view : function (view_name) {
			if (!this.form){
				log.error("impossible to request view, no form found");
				return;
			}

			_updateHidden("viewName",view_name,this.form);

			var data = this.form.serialize();

			if (!data || (!!data && !data.length)) {
				log.error("AppTracker._on_nav failed to track. for has no data");
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

	return AppTracker;
});