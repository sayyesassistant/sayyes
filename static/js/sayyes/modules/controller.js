/*
@grunt -task=comp-js-all -env=final
*/
define([
	"sayyes/util/log",
	"sayyes/util/vo/view-vo",
	"sayyes/util/vo/controller-vo",
	"sayyes/util/ajax",
	"sayyes/modules/view",
	"sayyes/modules/tracker",
	"mout/object/mixIn",
	"mout/array/find",
	"signals/signals"
], function (
	log,
	view_vo,
	controller_vo,
	ajax,
	view,
	tracker,
	mix_in,
	find,
	signals
) {

	var Controller, _view_vo, _controller_vo, _notify, error, warn;

	error = "error";
	warn = "warn";

	_view_vo = new view_vo();
	_controller_vo = new controller_vo();

	_notify  = function (self, message, severity) {
		return function (value) {
			switch (severity) {
				case warn :
					log.warn(message,value);
					self.on.warn.dispatch(message, value);
				break;
				case error :
					log.error(message,value);
					self.on.error.dispatch(message, value);
				break;
				default:
					log.info(message,value);
					self.on.info.dispatch(message, value);
				break;
			}
		};
	};

	function __init (instance, scope) {
		instance.queued_view = null;
		instance.current_view = null;
		instance.previous_view = null;
		instance.safe_nav = true;
		instance.data = {};
		instance.scope = $(scope);
		instance.pooling = {};
		instance.tracker = new tracker();
		instance.tracker.on.error.addOnce(_show_error.bind());
		instance.on = {
			warn : new signals(),
			info : new signals(),
			error : new signals(),
			nav : new signals()
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
		if (this.current_view){
			this.current_view.html.remove();
			this.current_view.dispose();
			_notify(this,"controller view '"+this.current_view.name+"' disposed.")();
			this.previous_view = this.current_view;
		}
		this.current_view = null;
		this.open();
	}

	function _on_open () {
		this.current_view = this.queued_view;
		this.queued_view = null;
		this.current_view.enable_ux();
		this.current_view.on.nav.add(_request_next.bind(this));
		_notify(this,"controller => view '"+this.current_view.name+"' opened.")();
		this.on.nav.dispatch(this.current_view);
	}

	function _show_error (result) {
		this.scope.removeClass("loading");
		alert("Deu errado! fim da linha. ainda preciso fazer o fallback para mostrar o erro na tela");
	}

	function _request_next (name) {
		if (this.current_view && this.current_view.name === name){
			_notify(this,"controller => view '"+name+"' already opened opened.",warn)();
			return;
		}
		var view_data = _get_view(name,this.data.views);
		function tracker_handler (result) {
			this.scope.removeClass("loading");
			view_data.data = mix_in({},view_data.data,result.view_data);
			this.create_view(view_data);
		}
		if (!!view_data && !!this.safe_nav) {
			this.scope.addClass("loading");
			this.tracker.on.success.addOnce(tracker_handler.bind(this));
			this.tracker.request_view(view_data.name);
		}
		else if (!!view_data && !!this.safe_nav) {
			this.create_view(view_data);
		}
		else {
			_notify(this,"controller => view '"+name+"' not found.",warn)();
		}
	}

	Controller = function(scope){
		__init(this, scope);
	};

	Controller.prototype = {

		load_config : function (url, on_success, on_error) {
			var service = new ajax();
			service.method("get")
				.expect("status","output")
				.expect("value",_controller_vo.implements)
				.error(on_error)
				.error(_notify(this,"controller got invalid config!",error))
				.success(on_success)
				.success(function(result){
					service.dispose();
					this.create(result.value);
				}.bind(this))
				.request(url);
		},

		create : function (data) {
			if (!_controller_vo.implements(data)){
				_notify(this,"controller got invalid data to initialize. check for missing properties!",error)(data);
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
				_notify(this,"controller => failed to find view: "+this.data.start_with,error)();
				return;
			}
			this.create_view(blob);
		},

		create_view : function (config) {
			if (!_view_vo.implements(config)) {
				_notify(this,"controller => malformed view template",error)(config);
				return;
			}
			this.queued_view = this.pooling[config.name];
			if(!this.queued_view){
				try {
					this.queued_view = view(config);
				} catch (err) {
					_notify(this,"controller => view '"+config.name+"' failed to create.",error)(err);
					return;
				}
			}
			_notify(this,"controller => view '"+this.queued_view.name+"' created.")();
			var merged_data =  this.current_view ? this.current_view.form_result : {};
			this.render_view(this.queued_view, mix_in({}, config.data, merged_data));
		},

		render_view : function (view, data) {
			view.on.render.failed.addOnce(_notify(this,"controller => view '"+view.name+"' failed to render.",error));
			view.on.render.passed.addOnce(this.close,this);
			// apply new helpers here!
			view.render(data);
		},

		open : function () {
			if (!this.queued_view) {
				_notify(this,"controller => no queued view to open!",error)();
				return;
			}
			if (!this.queued_view.html || !this.queued_view.html.length) {
				_notify(this,"controller => queued view has no html.",error)();
				return;
			}
			this.scope.append(this.queued_view.html);
			this.queued_view.on.open.passed.addOnce(_on_open,this);
			this.queued_view.on.open.failed.addOnce(_on_fail,this);
			this.queued_view.open();
		},

		close: function () {
			if (!this.current_view) {
				_notify(this,"controller => no current view to close, open queued.",warn)();
				this.open();
				return;
			}
			this.current_view.on.close.passed.addOnce(_on_close,this);
			this.current_view.on.close.failed.addOnce(_on_fail,this);
			this.current_view.disable_ux();
			this.current_view.close();
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