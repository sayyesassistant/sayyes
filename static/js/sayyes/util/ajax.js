/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/util/log",
	"sayyes/util/vo/result-vo",
	"signals/signals",
	"mout/lang/kindOf",
	"mout/array/every",
	"mout/object/hasOwn"
],function(
	log,
	result_vo,
	signals,
	kindOf,
	every,
	hasOwn
){

	function validate (xhr) {

		var result, passed, prop, val, prop_fail;

		if (this.options.dataType === "json"){
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
					result = new result_vo();
					result.set("status","error");
					result.set("exception" , this.NOT_MATCH);
					result.set("message", "'"+prop+"' doesn't match expected values");
					result.set("value", xhr);
					this.result = result.data();
					this.on.error.dispatch(this.result);
					return;
				}
				this.result = xhr;
				this.on.success.dispatch(this.result);
			} else {
				result = new result_vo();
				result.set("status", "error");
				result.set("exception", this.MALFORMED_JSON);
				result.set("message", "result isn't a valid JSON");
				this.result = result.data();
				this.on.error.dispatch(this.result);
			}
		} else {
			//TODO
			this.result = xhr;
			this.on.success.dispatch(this.result);
		}
	}

	function on_success (xhr) {
		if (!!this._xpect){
			validate.bind(this)(xhr);
			return;
		}
		if (xhr===null){
			var vo = new result_vo();
			vo.set("status","error");
			vo.set("exception",this.REQUEST_FAILED);
			vo.set("message","XHR couldn't complete the resquest");
			this.result = vo.data();
			this.on.error.dispatch(this.result);
			return;
		}
		this.result = xhr;
		this.on.success.dispatch(this.result);
	}

	function on_error(xhr, type){
		this.result = new result_vo();
		this.result.set("exception", xhr.status);
		this.result.set("message", xhr.responseText);
		this.on.error.dispatch(this.result.data());
	}

	function __init(instance){
		instance.on = {
			success : new signals(),
			error : new signals()
		};
		instance.options = {
			type : "GET",
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
		instance.MALFORMED_JSON = -100;
		instance.NOT_MATCH = -101;
		instance.REQUEST_FAILED = -102;
		instance.ALLOWED_TYPES = ["json", "jsonp", "xml", "html", "text"];
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

		type : function (value, jsonp_callback) {
			if (this.ALLOWED_TYPES.indexOf(value)===-1){
				throw "argument must be:'"+this.ALLOWED_TYPES.join("','")+"'";
			}
			if (value==="jsonp" && !!jsonp_callback){
				this.options.jsonpCallback = jsonp_callback;
			}
			this.options.dataType = value || this.options.dataType;
			return this;
		},

		allow_cache : function (value) {
			this.options.cache = Boolean(value);
			return this;
		},

		success : function (fn) {
			if (!fn || typeof fn !== "function") {
				throw "argument must be a function";
			}
			this.on.success.add(fn);
			return this;
		},

		error : function (fn) {
			if (!fn || typeof fn !== "function") {
				throw "argument must be a function";
			}
			this.on.error.add(fn);
			return this;
		},

		dispose : function (){
			this.on.error.removeAll();
			this.on.success.removeAll();
			this.mock_data = null;
			__init(this);
		},

		expect : function (prop,to_be) {
			if (!this._xpect){
				this._xpect = [];
			}
			this._xpect.push([prop,to_be]);
			return this;
		},

		mock : function (data) {
			this.mock_data = data;
			return this;
		},

		request : function (url, data) {
			if (!url){
				log.error("ajax.request can't be done without url.");
				return null;
			}
			if (!!this.mock_data){
				this.options.success(this.mock_data);
				this.mock_data = undefined;
			} else {
				this.options.url = url;
				this.options.data = data;
				log.info("ajax.request => "+url + " method:"+this.options.type, " data:", this.options.data);
				$.ajax(this.options);
			}
			return this;
		}
	};

	return ajax;
});