/*
@grunt -task=comp-js -page=app
*/
define([
	"mout/object/mixIn",
	"mout/string/trim",
	"mustache/mustache"
], function (
	mixIn,
	trim,
	mustache
) {
	var View, _config, _count;

	_count = 0;

	_config = {
		__id : ++_count,
		name : null,
		html : null,
		template_name: null,
		template_raw: null,
		template_fn: null,
		events : null
	};

	View = function(config){
		this._init(config);
	};

	View.prototype = {

		_init : function (value) {
			mixIn(this,_config,value);
			var element = document.getElementById(this.template_name);
			if (!element) {
				throw "template:'"+this.template_name+"' not found.";
			}
			this.template_raw = trim(element.text);
			if (!this.template_raw || !this.template_raw.length) {
				throw "template:'"+this.template_name+"' is empty.";
			}
			this.template_fn = mustache.compile(this.template_raw);
			this.events = $(document.createElement("span"));
		},

		render : function (data) {
			try {
				this.html = $(this.template_fn(data));
			} catch (err) {
				this.error = err;
				this.events.trigger("render:fail",[this,err]);
				return;
			}
			this.events.trigger("render:ok",[this]);
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
				this.events.trigger("open:fail");
				return;
			}
			this.html.addClass("open");
			this.events.trigger("open:ok");
		},

		close : function () {
			if (!this.html){
				this.events.trigger("close:fail");
				return;
			}
			this.html.addClass("close");
			this.events.trigger("close:ok");
		},

		dispose : function () {
			this.html = null;
		}
	};

	return function (config) {
		if (!config){
			throw "view got undefined config";
		}
		return new View(config);
	};
});