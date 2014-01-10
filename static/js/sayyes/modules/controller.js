/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/util/log",
	"sayyes/util/vo/view-vo",
	"sayyes/util/vo/controller-vo",
	"sayyes/util/ajax",
	"sayyes/modules/view",
	"sayyes/modules/form-tracker",
	"mout/object/mixIn",
	"mout/object/keys",
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
	keys,
	find,
	signals
) {

	var Controller, _view_vo, _controller_vo, _notify,
		log_error, log_warn, _fail_view;

	log_error = "error";
	log_warn = "warn";

	_view_vo = new view_vo();

	_fail_view = {
		"name":"__fail_view__",
		"template_name":"fail_template",
		"data":{}
	};

	_controller_vo = new controller_vo();

	_notify  = function (self, message, severity) {
		return function (value) {
			switch (severity) {
				case log_warn :
					log.warn(message,value);
					self.on.warn.dispatch(message, value);
				break;
				case log_error :
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
		instance.view_data = null;
		instance.safe_nav = true;
		instance.data = {};
		instance.scope = $(scope);
		instance.history = [];

		instance.reporter = new tracker("session-report");
		instance.reporter.on.success.add(_notify(instance,"report sent!"));

		instance.auth = new tracker("session-tracker");
		instance.auth.on.error.addOnce(_auth_fail.bind(instance));

		instance.on = {
			warn : new signals(),
			info : new signals(),
			error : new signals(),
			nav : new signals(),
			eol : new signals()
		};
	}

	function _get_view (name, data) {
		return find(data,{"name":name});
	}

	function _on_fail (args) {
		log.error("fatal error, show alert box");
		_notify(this,"controller fail =>",log_error)(args);
	}

	function _get_history_from_view (view) {
		if (!view_vo) {
			return;
		}
		var fd = view.form_data || {};
		return {
			name : view.name,
			form_data : (!!keys(fd).length) ? fd : null
		};
	}

	function _on_close () {
		if (this.current_view){
			this.current_view.html.remove();
			this.current_view.dispose();
			_notify(this,"controller view '"+this.current_view.name+"' disposed.")();

			this.previous_view = this.current_view;
			this.history.push(_get_history_from_view(this.previous_view));
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

		if (!!this.previous_view && this.previous_view.eol === true) {
			this.history = [];
		}

		if (this.current_view.eol===true){
			this.history.push(_get_history_from_view(this.current_view));
			this.reporter.run([{
				"report" : JSON.stringify(this.history)
			}]);
		}
	}

	function _auth_fail(result) {
		this.scope.removeClass("loading");
		_fail_view.data = result.value;
		this.create_view(_fail_view);
		_fail_view.data = {};
	}

	function _auth_success (result) {
		this.scope.removeClass("loading");
		this.view_data.data = mix_in({}, this.view_data.data, result.view_data);
		this.create_view(this.view_data);
	}

	function _request_next (name) {
		if (this.current_view && this.current_view.name === name){
			_notify(this,"controller => view '"+name+"' already opened opened.",log_warn)();
			return;
		}
		this.view_data = _get_view(name,this.data.views);
		if (!this.view_data) {
			_notify(this,"controller => view '"+name+"' not found.",log_warn)();
			return;
		}
		if (!!this.safe_nav) {
			// nav WITH auth
			this.scope.addClass("loading");
			this.auth.on.success.addOnce(_auth_success.bind(this));
			this.auth.run([{
				"viewName" : this.view_data.name
			}]);
			return;
		}
		// nav WITHOU auth
		this.create_view(this.view_data);
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
				.error(_notify(this,"controller got invalid config!",log_error))
				.success(on_success)
				.success(function(result){
					service.dispose();
					this.create(result.value);
				}.bind(this))
				.request(url);
		},

		create : function (data) {
			if (!_controller_vo.implements(data)){
				_notify(this,"controller got invalid data to initialize. check for missing properties!",log_error)(data);
				return;
			}

			this.data = data;
			this.data.start_with = this.data.start_with || 0;

			var blob;
			switch (this.data.start_with.constructor.name) {
				case "Number" : blob = this.data.views[this.data.start_with];
				break;
				case "String" : blob = _get_view(this.data.start_with,this.data.views);
				break;
			}

			if (!blob){
				_notify(this,"controller => failed to find view: "+this.data.start_with,log_error)();
				return;
			}

			this.create_view(blob);
		},

		create_view : function (config) {
			if (!_view_vo.implements(config)) {
				_notify(this,"controller => malformed view template.",log_error)(config);
				return;
			}

			try {
				this.queued_view = view(config);
			} catch (err) {
				_notify(this,"controller => view '"+config.name+"' failed to create.",log_error)(err);
				return;
			}

			var blob_view = this.current_view || {},
				merged_data =  mix_in( {},
					config.data,
					(blob_view.form_result||{}),
					(blob_view.form_data||{})
				);
			_notify(this,"controller => view '"+this.queued_view.name+"' created.")();
			this.render_view(this.queued_view, merged_data);
		},

		render_view : function (view, data) {
			view.on.render.failed.addOnce(_notify(this,"controller => view '"+view.name+"' failed to render.",log_error));
			view.on.render.passed.addOnce(this.close,this);
			// apply mustache helpers here!
			// ---
			//
			view.render(data);
		},

		open : function () {
			if (!this.queued_view) {
				_notify(this,"controller => no queued view to open!",log_error)();
				return;
			}
			if (!this.queued_view.html || !this.queued_view.html.length) {
				_notify(this,"controller => queued view has no html.",log_error)();
				return;
			}
			this.scope.append(this.queued_view.html);
			this.queued_view.on.open.passed.addOnce(_on_open,this);
			this.queued_view.on.open.failed.addOnce(_on_fail,this);
			this.queued_view.open();
		},

		close: function () {
			if (!this.current_view) {
				_notify(this,"controller => no current view to close, open queued.",log_warn)();
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