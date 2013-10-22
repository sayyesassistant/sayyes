/*
@grunt -task=comp-js-all
*/
define([
	"mout/object/mixIn",
	"mout/array/forEach",
	"mout/array/every",
	"mustache/mustache",
	"signals/signals",
	"sayyes/modules/log",
	"sayyes/plugins/plugin-nav",
	"sayyes/plugins/plugin-form"
], function (
	mixIn,
	forEach,
	every,
	mustache,
	signal,
	log,
	plugin_nav,
	plugin_form
) {
	var View, _count, plugin_list,
		class_open, class_close;

	plugin_list = [plugin_nav, plugin_form];

	class_open = "open";
	class_close = "close";

	_count = 0;

	function __init (instance,value) {
		//define view properties
		instance.__id = ++_count;
		instance.name = null;
		instance.html = null;
		instance.template_name = null;
		instance.template_raw = null;
		instance.template_fn = null;
		instance.plugin_closures = null;
		instance.form_result = null;

		//apply values from object
		mixIn(instance,value);

		//define signals
		instance.on = {
			render : {
				failed : new signal(),
				passed : new signal()
			},
			open : {
				failed : new signal(),
				passed : new signal()
			},
			close : {
				failed : new signal(),
				passed : new signal()
			},
			nav : new signal()
		};

		instance.signals_list = [instance.on.render.failed, instance.on.render.passed,
								instance.on.open.failed, instance.on.open.passed,
								instance.on.close.failed, instance.on.close.passed,
								instance.on.nav];

		var element = document.getElementById(instance.template_name);
		if (!element) {
			throw "template:'"+instance.template_name+"' not found!";
		}
		instance.template_raw = element.text.trim();
		if (!instance.template_raw || !instance.template_raw.length) {
			throw "template:'"+instance.template_name+"' is empty!";
		}
		instance.template_fn = mustache.compile(instance.template_raw);
	}

	View = function(config){
		__init(this,config);
	};

	View.prototype = {
		render : function (data) {
			try {
				this.html = $(this.template_fn(data));
			} catch (err) {
				this.on.render.failed.dispatch(this,err);
				return;
			}
			this.on.render.passed.dispatch(this);
		},

		enable_ux : function () {
			this.plugin_closures = [];
			if (!!this.html) {
				var passed = every(plugin_list,function(self){
					return function(val){
						return val(self);
					};
				}(this));
			}
		},

		disable_ux : function () {
			function dispose_closure(c) {
				c.dispose(); c = null;
			}
			if (!!this.html) {
				forEach(this.plugin_closures,dispose_closure);
			}
			this.plugin_closures = null;
		},

		open : function () {
			if (!this.html){
				this.on.open.failed.dispatch(this);
				return;
			}
			this.html.addClass(class_open);
			this.on.open.passed.dispatch(this);
			this.form_result = null;
		},

		close : function () {
			if (!this.html){
				this.on.close.failed.dispatch(this);
				return;
			}
			this.html.removeClass(class_open).addClass(class_close);
			this.on.close.passed.dispatch(this);
		},

		show_alert : function (value){
			console.log("show alert",value);
		},

		close_alert : function (){
			console.log(value);
		},

		dispose : function () {
			this.html.removeClass(class_close);
			this.html = null;
			var passed = every(this.signals_list,function(val,index){
				if (!!val && !!val.removeAll){
					val.removeAll();
					return true;
				}
				return false;
			});
			if (!passed){
				log.warn("view.dispose => problems dispose all signals.");
			}
		}
	};

	return function (config) {
		if (!config){
			throw "view got undefined config";
		}
		return new View(config);
	};
});