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

	var Controller, _viewVO, _notifyRederFail;

	_viewVO = new vo.view();

	_notifyReder = function(scope,status) {
		return function(event,args){
			log.warn("controller _notifyReder:",event.type,args);
			scope.events.trigger("render_view:"+status,[event.type]);
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
		create_view : function (data) {
			if (_viewVO.implements(data)) {
				try {
					this.queued = view(data);
				} catch (err) {
					this.events.trigger("create_view:fail",[err]);
					return;
				}
				this.events.trigger("create_view:ok");
				return;
			} else {
				this.events.trigger("create_view:fail");
			}
		},
		render_view : function (data) {
			if (!this.queued || !data){
				_notifyReder(this,"fail");
				return;
			}
			this.queued.events.one("render:fail",_notifyReder(this,"fail"));
			this.queued.events.one("render:ok",_notifyReder(this,"ok"));
			this.queued.render(data);
		},
		open : function () {
			if (!this.queued){
				this.events.trigger("open:fail",["no queued view found"]);
				return;
			}
			this.scope.append(this.queued.html);
			this.queued.events.one("open:ok",this._onOpen.bind(this));
			this.queued.events.one("open:fail",this._onFail.bind(this));
			this.queued.open();
		},
		close : function () {
			if (!this.current){
				this.events.trigger("close:fail");
				return;
			}
			this.queued.events.one("close:ok",this._onClose.bind(this));
			this.queued.events.one("close:fail",this._onFail.bind(this));
			this.queued.close();
		},
		_onFail : function (event) {
			log.warn("fail:",event);
		},
		_onClose : function () {
			this.previous = this.current;
			this.previous.dispose();
			this.current = null;
		},
		_onOpen : function () {
			this.current = this.queued;
			this.queued = null;
			this.current.enable_ux();
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