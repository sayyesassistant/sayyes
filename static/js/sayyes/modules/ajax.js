/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log",
	"sayyes/modules/vo",
	"signals/signals",
	"mout/lang/kindOf",
	"mout/array/every",
	"mout/object/hasOwn"
],function(
	log,
	vo,
	signals,
	kindOf,
	every,
	hasOwn
){

	function validate (xhr) {

		var result, passed, prop, val, prop_fail;
		if (kindOf(xhr) === "Object"){
			passed = every(this._xpect,function(value){
				prop = value[0]; val = value[1];
				switch(kindOf(val)){
					case "Function":
						return hasOwn(xhr,prop) && val.call(null,xhr[prop]);
					default:
						return hasOwn(xhr,prop) && xhr[prop] === val;
				}
			});
			if (passed===false){
				result = new vo.result();
				result.status = "error";
				result.exception = -101;
				result.message = "'"+prop+"' doesn't match expected value";
				return result;
			}
			return xhr;
		} else {
			result = new vo.result();
			result.status = "error";
			result.exception = -100;
			result.message = "result isn't a valid json";
			return result;
		}
	}

	function on_success (xhr) {
		if (!!this.default_result && !this.default_result.implements(xhr)) {
			this.result = xhr;
			this.on.error.dispatch(this.result);
			return;
		}
		if (!!this._xpect){
			xhr = validate.bind(this)(xhr);
		}
		this.result = xhr;
		if (this.result.status!=="error"){
			this.on.success.dispatch(this.result);
			return;
		}
		this.on.error.dispatch(this.result);
	}

	function on_error(xhr){
		this.result = new vo.result();
		this.result.expection = xhr.status;
		this.result.message = xhr.responseText;
		this.on.error.dispatch(this.result);
	}

	function __init(instance){
		instance.on = {
			success : new signals(),
			error : new signals()
		};
		instance.default_result = new vo.result();
		instance.options = {
			type : "POST",
			url : null,
			data  : null,
			processData : false,
			dataType : "json",
			timeout : 2000,
			context : instance,
			cache : true,
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

		type : function () {
			this.options.dataType = value || this.options.dataType;
			return this;
		},

		allow_cache : function (value) {
			this.options.cache = value;
			return this;
		},

		success : function (fn) {
			this.on.success.add(fn);
			return this;
		},

		error : function (fn) {
			this.on.error.add(fn);
			return this;
		},

		dispose : function (){
			this.on.error.removeAll();
			this.on.success.removeAll();
		},

		expect : function (prop,to_be) {
			if (!this._xpect){
				this._xpect = [];
			}
			this._xpect.push([prop,to_be]);
			return this;
		},

		request : function (url, data) {
			if (!url){
				log.error("ajax.request can't be done without url.");
				return null;
			}
			this.options.url = url;
			this.options.data = data;
			log.info("ajax.request => "+url + " method:"+this.options.type, this.options.data);
			$.ajax(this.options);
			return this;
		}

	};

	return ajax;
});