/*
@grunt -task=comp-js -page=test-view
*/
define([
	"sayyes/modules/log",
	"sayyes/modules/view",
	"sayyes/modules/vo"
], function (
	log,
	view,
	vo
) {

	var Controller, _viewVO, _notify;

	_viewVO = new vo.view();

	_notify = function(scope,status) {
		return function(){
			var a = Array.prototype.slice.call(arguments);
			scope.events.trigger(status,a);
		};
	};

	__init = function (instance) {
		instance.queued = null;
		instance.current = null;
		instance.previous = null;
		instance.data = null;
		instance.scope = null;
		instance.events = $(document.createElement("span"));
	};

	Controller = function(scope){
		__init(this);
		this.scope = $(scope);
	};

	Controller.prototype = {
		define_pages : function (data) {
			// if (validate_model(data)) {
			// 	this.events.trigger("define.ok");
			// 	this.data = data;
			// } else {
			// 	this.events.trigger("define.fail");
			// }
		},
		start : function (index) {

		},
		create_view : function (config) {
			if (_viewVO.implements(config)) {
				try {
					this.queued = view(config);
				} catch (err) {
					_notify(this,"create_view:fail")(err);
					return;
				}
				_notify(this,"create_view:ok")(this.queued.name);
				this.render_view(config.data);
			} else {
				_notify(this,"create_view:fail")();
			}
		},
		render_view : function (data) {
			if (!this.queued || !data){
				_notify(this,"render_view:fail")();
				return;
			}
			this.queued.events.one("render:fail",_notify(this,"render_view:fail"));
			this.queued.events.one("render:ok",_notify(this,"render_view:ok"));
			try{
				this.queued.render(data);
			} catch (err) {
				_notify(this,"render_view.fail")(err);
				return;
			}
			this.close_current();
		},
		open : function () {
			if (!this.queued){
				_notify(this,"open:fail")(["no view to open"]);
				return;
			}
			this.scope.append(this.queued.html);
			this.queued.events.one("open:ok",this._onOpen.bind(this));
			this.queued.events.one("open:fail",this._on_fail.bind(this));
			this.queued.open();
		},
		close_current: function () {
			if (!this.current || !this.queued){
				_notify(this,"close_current:warn")(!this.current ? "no view to close" : "no queued view to open");
				this.open();
				return;
			}
			this.queued.events.one("close:ok",this._on_close.bind(this));
			this.queued.events.one("close:fail",this._on_fail.bind(this));
			this.queued.disable_ux();
			this.queued.close();
		},
		_dispose_view : function(view) {
			view.events.off("close:ok",this._on_close.bind(this));
			view.events.off("close:fail",this._on_fail.bind(this));
			view.events.off("open:ok",this._onOpen.bind(this));
			view.events.off("open:fail",this._on_fail.bind(this));
			view.dispose();
		},
		_on_fail : function (event) {
			log.error("[to-do] failed to ",event);
		},
		_on_close : function () {
			if (this.current){
				this._dispose_view(this.current);
				_notify(this,"close_view:ok")(this.current.name);
				this.previous = this.current;
			}
			this.current = null;
			this.open();
		},
		_onOpen : function () {
			this.current = this.queued;
			this.queued = null;
			this.current.enable_ux();
			_notify(this,"open:ok")(this.current.name);
		},
	};
	return function(scope){
		if (!scope){
			throw "undefined scope";
		} else {
			return new Controller(scope);
		}
	};
});