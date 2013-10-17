/*
@grunt -task=comp-js -page=app
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

	var VO, ViewVO, ListVO, __cast;

	__cast = function (scope) {
		return function(value){
			scope[value] = null;
		};
	};

	VO = function(){
		if (!!arguments.length){
			var props = Array.prototype.slice.call(arguments);
			this.__dna = props;
			map(props,__cast(this));
		}
	};
	VO.prototype = {

		fromJSON : function (data){
			console.log(data);
		},

		implements : function (value) {
			if (!value){
				return false;
			}
			var props = keys(value),
				diff = difference(this.__dna,props);
			return diff.length===0;
		},

		set : function (prop,value) {

		}
	};

	ViewVO = function() { VO.call(this,"name","template_name"); };
	ViewVO.prototype = new VO();
	ViewVO.prototype.constructor = VO;

	ListVO = function() { VO.call(this,"start_with","views"); };
	ListVO.prototype = new VO();
	ListVO.prototype.constructor = VO;

	ResultVO = function() { VO.call(this,"success","exception", "message", "value"); };
	ResultVO.prototype = new VO();
	ResultVO.prototype.constructor = VO;

	return {
		view : ViewVO,
		list : ListVO,
		result : ResultVO
	};
});