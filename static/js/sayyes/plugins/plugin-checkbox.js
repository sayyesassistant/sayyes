/*
@grunt -task=jss
*/
define([
	"sayyes/util/log",
	"mout/array/forEach"
],
function(
	log,
	forEach
){

	var FormCheckBox, instances, active_class;

	active_class = "checked";

	FormCheckBox = function(element){
		this.$radio = $(element);
		this.$label = this.$radio.parents("label.radio");
		this.form = this.$label.parents("form")[0];
		this.name = this.$radio.attr("name");
		this.fn_change = _handle_change(this);
		if (!!this.$label.length && !!this.form){
			this.enableUX();
			return;
		}
		log.warn("FormCheckBox missing elements",this.$label.length,this.form);
	};

	function _handle_change (self) {
		return function (event) {
			forEach(instances,function(closure){
				if (closure!==self && closure.form===self.form && closure.name===self.name){
					closure.uncheck();
				}
			});
			return event.currentTarget.checked ? self.check() : self.uncheck();
		};
	}

	FormCheckBox.prototype = {
		enableUX : function () {
			this.$radio.on("change", this.fn_change);
		},
		disableUX : function () {
			this.$radio.off("change", this.fn_change);
		},
		check : function () {
			this.$label.addClass(active_class);
		},
		uncheck : function () {
			this.$label.removeClass(active_class);
		},
		dispose : function () {
			this.disableUX();
			this.$radio = this.$label = null;
		}
	};

	function _each_radio(index,element){
		instances.push(new FormCheckBox(element));
	}

	function _init(){
		instances = [];
		$("input[type=radio]").filter("[data-toggle=radio]").each(_each_radio);
	}

	function _dispose(closure){
		closure.dispose();
		closure = null;
	}

	return {
		run : function(){
			_init();
		},
		dispose : function(){
			if (!!instances){
				forEach(instances, _dispose);
				instances = null;
			}
		}
	};
});