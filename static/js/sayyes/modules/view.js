/*
@grunt -task=comp-js -page=test-controller
*/
define([
	"mout/object/mixIn",
	"mout/array/forEach",
	"mustache/mustache",
	"signals/signals",
	"sayyes/plugins/plugin-nav"
], function (
	mixIn,
	forEach,
	mustache,
	signal,
	plugin_nav
) {
	var View, _count,
		class_open, class_close;

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
				plugin_nav(this);
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
		},

		close : function () {
			if (!this.html){
				this.on.close.failed.dispatch(this);
				return;
			}
			this.html.removeClass(class_open).addClass(class_close);
			this.on.close.passed.dispatch(this);
		},

		dispose : function () {
			this.html.removeClass(class_close);
			this.html = null;

			this.on.render.passed.removeAll();
			this.on.render.failed.removeAll();

			this.on.close.passed.removeAll();
			this.on.close.failed.removeAll();

			this.on.open.passed.removeAll();
			this.on.open.failed.removeAll();
		}
	};

	return function (config) {
		if (!config){
			throw "view got undefined config";
		}
		return new View(config);
	};
});