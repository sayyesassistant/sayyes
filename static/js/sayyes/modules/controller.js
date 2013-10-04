/*
@grunt -task=comp-js -page=test-view
*/
define([
	"sayyes/modules/log",
	"sayyes/modules/view",
	"sayyes/modules/vo",
	"sayyes/helpers/helper-nav",
	"mout/object/mixIn",
	"signals/signals"
], function (
	log,
	view,
	vo,
	helper_nav,
	mix_in,
	signals
) {

	var Controller, _viewVO, _notify, error, warn;

	error = "error";
	warn = "warn";

	_viewVO = new vo.view();

	_notify  = function (self, message, severity) {
		return function (value) {
			switch (severity) {
				case warn :
					log.warn(message);
					self.on.warn.dispatch(message, value);
				break;
				case error :
					log.error(message);
					self.on.error.dispatch(message, value);
				break;
				default:
					log.info(message);
					self.on.info.dispatch(message, value);
				break;
			}
		};
	};

	__init = function (instance, scope) {
		instance.queued = null;
		instance.current = null;
		instance.previous = null;
		instance.data = null;
		instance.scope = $(scope);
		instance.pooling = {};
		instance.on = {
			warn : new signals(),
			info : new signals(),
			error : new signals()
		};
	};

	Controller = function(scope){
		__init(this, scope);
	};

	Controller.prototype = {
		define_pages : function (data) {

		},
		start : function (name) {

		},
		create_view : function (config) {
			if (!_viewVO.implements(config)) {
				_notify(this,"controller => view '"+this.queued.name+"' malformed template",error)(config);
				return;
			}
			this.queued = this.pooling[config.name];
			if(!this.queued){
				try {
					this.queued = view(config);
				} catch (err) {
					_notify(this,"controller => view '"+this.queued.name+"' failed to create.",error)(err);
					return;
				}
			}
			_notify(this,"controller => view '"+this.queued.name+"' created.")();
			this.render_view(config.data);
		},
		render_view : function (data) {
			if (!this.queued) {
				_notify(this,"controller => no queued view to render",error)();
				return;
			}
			data = data || {};
			this.queued.on.render.failed.addOnce(_notify(this,"controller => view '"+this.queued.name+"' failed to render.",error));
			this.queued.on.render.passed.addOnce(this.close_current,this);
			this.queued.render(mix_in(data,helper_nav));
		},
		open : function () {
			if (!this.queued) {
				_notify(this,"controller => no queued view to open!",error)();
				return;
			}
			if (!this.queued.html || !this.queued.html.length) {
				_notify(this,"controller => queued view has no html.",error)();
				return;
			}
			this.scope.append(this.queued.html);
			this.queued.on.open.passed.addOnce(this._on_open,this);
			this.queued.on.open.failed.addOnce(this._on_fail,this);
			this.queued.open();
		},
		close_current: function () {
			if (!this.current) {
				_notify(this,"controller => no current view to close, open queued.",warn)();
				this.open();
				return;
			}
			this.queued.on.close.passed.addOnce(this._on_close,this);
			this.queued.on.close.failed.addOnce(this._on_fail,this);
			this.queued.disable_ux();
			this.queued.close();
		},
		_on_fail : function (args) {
			log.error("fatal erro, show alert box");
			_notify(this,"controller fail =>",error)(args);
		},
		_on_close : function () {
			if (this.current){
				this.current.dispose();
				_notify(this,"controller view '"+this.current.name+"' closed.");
				this.previous = this.current;
			}
			this.current = null;
			this.open();
		},
		_on_open : function () {
			this.current = this.queued;
			this.queued = null;
			this.current.enable_ux();
			_notify(this,"controller => view '"+this.current.name+"' opened.")();
		}
	};
	return function(scope){
		if (!scope){
			throw "undefined scope";
		} else {
			return new Controller(scope);
		}
	};
});