/*
@grunt -task=comp-js -page=app
*/
define([], function () {

	var Logger, Log, instance,
		__init, __log, _reg,
		INFO, WARN, ERR, T_MESSAGE, T_OBJECT;

	INFO = 1;
	WARN = 2;
	ERR = 4;
	T_MESSAGE = 1;
	T_OBJECT = 2;

	_reg = /[\d]{2}:[\d]{2}:[\d]{2}/g;

	__init = function (){
		if (!!instance){
			return;
		}
		instance = new Logger();
		instance.history = [];
		instance.verbose = true;
		instance.verbose_type = T_MESSAGE;
	};

	__log = function (level,args) {
		instance.history.push(new Log(level,args));
		if (!!instance.verbose){
			__yeld(instance.history[instance.history.length-1]);
		}
	};

	__yeld = function (log) {
		if (!log){
			return;
		}
		if (instance.verbose_type===T_OBJECT){
			console.dir(log);
			return;
		}
		var fn;
		switch (log.type) {
			case INFO: fn = console.info; break;
			case WARN: fn = console.warn; break;
			case ERR: fn = console.error; break;
		}
		if (fn){
			fn.apply(window.console,[log.prefix].concat(log.message));
		}
	};

	Log = function(type,message){
		this.type = type;
		this.message = message;
		var date = new Date();
		this.prefix = (date.toTimeString().match(_reg)[0])||"" + ":" + date.getMilliseconds();
	};

	Logger = function () {
		this.type_object = T_OBJECT;
		this.type_message = T_MESSAGE;
	};

	Logger.prototype = {
		info : function () {
			__log(INFO,Array.prototype.slice.call(arguments));
		},
		warn : function (args) {
			__log(WARN,Array.prototype.slice.call(arguments));
		},
		error : function (args) {
			__log(ERR,Array.prototype.slice.call(arguments));
		}
	};
	__init();
	return instance;
});