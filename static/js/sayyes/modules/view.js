/*
@grunt -task=comp-js -page=test-view
*/
define([
	"mout/object/mixIn",
	"mustache/mustache",
	"signals/signals"
], function (
	mixIn,
	mustache,
	signal
) {
	var View, _config, _count, class_open, class_close;

	class_open = "open";
	class_close = "close";

	_count = 0;

	_config = {
		__id : ++_count,
		name : null,
		html : null,
		template_name: null,
		template_raw: null,
		template_fn: null,
		on : {
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
			}
		}
	};

	View = function(config){
		this._init(config);
	};

	View.prototype = {

		_init : function (value) {
			mixIn(this,_config,value);
			var element = document.getElementById(this.template_name);
			if (!element) {
				throw "template:'"+this.template_name+"' not found!";
			}
			this.template_raw = element.text.trim();
			if (!this.template_raw || !this.template_raw.length) {
				throw "template:'"+this.template_name+"' is empty!";
			}
			this.template_fn = mustache.compile(this.template_raw);
		},

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
			if (!!this.html) {
				//
				// console.log("bind:",this.html);
			}
		},

		disable_ux : function () {
			if (!!this.html) {
				//
				// console.log("unbind:",this.html);
			}
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