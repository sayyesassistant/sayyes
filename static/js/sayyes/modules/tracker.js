/*
@grunt -task=comp-js-all
*/
define([
	"sayyes/util/ajax",
	"sayyes/util/log"
], function (
	ajax,
	log
) {

	var AppTracker, form;

	AppTracker = function(controller){

		form = document.getElementsByClassName("session-tracker");

		if (!form){
			log.error("AppTracker failed to find 'session-tracker' form");
			return;
		}

		form = $(form[0]);

		this.controller = controller;
		this.service = new ajax();
	};

	function _on_nav (view) {

		var hiddeName = form.find("input[name=viewName]"),
			data;

		if (!!hiddeName.length){
			hiddeName.attr("value",view.name);
		}

		data = form.serialize();

		if (!data || (!!data && !data.length)) {
			log.error("AppTracker._on_nav failed to track. for has no data");
			return;
		}

		this.service
			.method(form.attr("method"))
			.request(form.attr("action"),data);
	}

	AppTracker.prototype = {
		start : function (){
			if (!!this.service){
				this.controller.on.nav.add( _on_nav.bind(this) );
			}
		},
		stop : function () {
			this.controller.on.nav.remove( _on_nav.bind(this) );
		}
	};

	return AppTracker;
});