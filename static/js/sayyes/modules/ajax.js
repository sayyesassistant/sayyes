/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log",
	"sayyes/modules/vo",
	"signals/signals"
],function(
	log,
	vo,
	signals
){

	function on_success(xhr){
		console.log("ajax success");
		console.dir(event);
		console.dir(this);
	}

	function on_error(xhr){
		this.result = new vo.result();
		this.result.status = xhr.status;
		this.result.message = xhr.responseText;
		this.trigger.error.dispatch(this.result);
	}

	function __init(instance){
		instance.trigger = {
			success : new signals(),
			error : new signals()
		};
		instance.options = {
			type : "POST",
			url : null,
			data  : null,
			processData : false,
			dataType : "json",
			timeout : 2000,
			context : instance,
			cache : false,
			success : on_success.bind(instance),
			error : on_error.bind(instance)
		};
	}

	var ajax = function(type){
		__init(this);
		this.options.type = type || this.options.type;
	};

	ajax.prototype = {

		method : function (value) {
			this.options.type = value || this.options.type;
			return this;
		},

		expect : function (fn) {
			this._xpect = fn;
			return this;
		},

		request : function (url, data) {
			if (!url){
				log.error("ajax.request can't be done without url.");
				return null;
			}
			this.options.url = url;
			this.options.data = data;
			log.info("ajax.request => "+url);
			$.ajax(this.options);
			return this;
		}

	};

	return ajax;
});