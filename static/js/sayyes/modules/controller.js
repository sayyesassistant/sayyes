/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/modules/log",
	"sayyes/modules/view",
	"sayyes/modules/vo",
	"sayyes/helpers/helper-nav",
	"mout/object/mixIn",
	"mout/array/find",
	"signals/signals"
], function (
	log,
	view,
	vo,
	helper_nav,
	mix_in,
	find,
	signals
) {

	var Controller, _viewVO, _listVO, _notify, error, warn;

	error = "error";
	warn = "warn";

	_viewVO = new vo.view();
	_listVO = new vo.list();

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

	function __init (instance, scope) {
		instance.queued = null;
		instance.current = null;
		instance.previous = null;
		instance.data = {};
		instance.scope = $(scope);
		instance.pooling = {};
		instance.on = {
			warn : new signals(),
			info : new signals(),
			error : new signals()
		};
	}

	function _get_view (name, data) {
		return find(data,{"name":name});
	}

	function _on_fail (args) {
		log.error("fatal error, show alert box");
		_notify(this,"controller fail =>",error)(args);
	}

	function _on_close () {
		if (this.current){
			this.current.html.remove();
			this.current.dispose();
			_notify(this,"controller view '"+this.current.name+"' disposed.")();
			this.previous = this.current;
		}
		this.current = null;
		this.open();
	}

	function _on_open () {
		this.current = this.queued;
		this.queued = null;
		this.current.enable_ux();
		this.current.on.nav.add(_on_nav,this);
		_notify(this,"controller => view '"+this.current.name+"' opened.")();
	}

	function _on_nav (name) {
		if (this.current && this.current.name === name){
			_notify(this,"controller => view '"+name+"' already opened opened.",warn)();
			return;
		}
		var view_data = _get_view(name,this.data.views);
		if (!!view_data) {
			this.create_view(view_data);
		} else {
			_notify(this,"controller => view '"+name+"' not found.",warn)();
		}
	}

	Controller = function(scope){
		__init(this, scope);
	};

	Controller.prototype = {
		define : function (data) {
			if (!_listVO.implements(data)){
				_notify(this,"controller got invalid data initialize!",error)();
				return;
			}
			this.data = data;
			this.data.start_with = this.data.start_with || 0;
			var blob;
			switch (this.data.start_with.constructor.name){
				case "Number" :
					blob = this.data.views[this.data.start_with];
				break;
				case "String" :
					blob = _get_view(this.data.start_with,this.data.views);
				break;
			}
			if (!blob){
				_notify(this,"controller => failed to find view: "+this.start_with,error)();
				return;
			}
			this.create_view(blob);
		},
		create_view : function (config) {
			if (!_viewVO.implements(config)) {
				_notify(this,"controller => malformed view template",error)(config);
				return;
			}
			this.queued = this.pooling[config.name];
			if(!this.queued){
				try {
					this.queued = view(config);
				} catch (err) {
					_notify(this,"controller => view '"+config.name+"' failed to create.",error)(err);
					return;
				}
			}
			_notify(this,"controller => view '"+this.queued.name+"' created.")();
			var merged_data = mix_in({}, config.data, this.current ? this.current.form_result : {});
			this.render_view(merged_data);
		},
		render_view : function (data) {
			if (!this.queued) {
				_notify(this,"controller => no queued view to render",error)();
				return;
			}
			data = data || {};
			this.queued.on.render.failed.addOnce(_notify(this,"controller => view '"+this.queued.name+"' failed to render.",error));
			this.queued.on.render.passed.addOnce(this.close,this);
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
			this.queued.on.open.passed.addOnce(_on_open,this);
			this.queued.on.open.failed.addOnce(_on_fail,this);
			this.queued.open();
		},
		close: function () {
			if (!this.current) {
				_notify(this,"controller => no current view to close, open queued.",warn)();
				this.open();
				return;
			}
			this.current.on.close.passed.addOnce(_on_close,this);
			this.current.on.close.failed.addOnce(_on_fail,this);
			this.current.disable_ux();
			this.current.close();
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