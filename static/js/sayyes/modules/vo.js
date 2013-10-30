/*
@grunt -task=comp-js-all
*/
define([
	"mout/array/map",
	"mout/array/difference",
	"mout/object/keys"
], function (
	map,
	difference,
	keys
) {

	var model, __cast;

	_cast = function (scope) {
		return function(prop){
			scope.value[prop] = null;
		};
	};

	model = function(){
		this.value = {};
		if (!!arguments.length){
			map(Array.prototype.slice.call(arguments),_cast(this));
		}
	};

	model.prototype = {

		from_json : function (json){
			return new model(keys(json));
		},

		match : function (value) {
			if (!value || typeof value == "object") {
				return false;
			}
			var dna = keys(this.value),
				props = keys(value),
				diff = difference(dna,props);
			return diff.length===0;
		},

		set : function (prop,value) {
			this.value[prop] = value;
		},

		get : function (prop) {
			return this.value[prop];
		}
	};

	// ViewVO = function() { VO.call(this,"name","template_name","data"); };
	// ViewVO.prototype = new VO();
	// ViewVO.prototype.constructor = VO;

	// ControllerVO = function() { VO.call(this,"id","attendant","client","start_with","views"); };
	// ControllerVO.prototype = new VO();
	// ControllerVO.prototype.constructor = VO;

	// ResultVO = function() { VO.call(this,"status","exception", "message", "value"); };
	// ResultVO.prototype = new VO();
	// ResultVO.prototype.constructor = VO;

	return model;
	// {
	// 	constructor : VO,
	// 	view : ViewVO,
	// 	controller : ControllerVO,
	// 	result : ResultVO
	// };
});