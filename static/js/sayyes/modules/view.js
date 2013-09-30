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
				this.html = this.template_fn(data);
			} catch (err) {
				this.error = err;
				this.events.trigger("view-render-fail",[this]);
				return;
			}
			this.events.trigger("view-render-ok",[this]);
		},

		enable_ux : function () {
			if (!!this.html) {
				console.log(">cast elements");
			}
		},

		disable_ux : function () {
		},

		show : function () {
		},

		hide : function () {
		},

		dispose : function () {
		}
	};

	return function (config) {
		if (!config){
			throw "view got undefined config";
		}
		return new View(config);
	};
});