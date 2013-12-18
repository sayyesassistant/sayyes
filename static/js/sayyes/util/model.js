/*
@grunt -task=comp-js-all
*/
define([
	"mout/array/map",
	"mout/array/difference",
	"mout/object/keys",
	"mout/object/hasOwn",
	"mout/object/mixIn",
	"mout/lang/isString"
], function (
	map,
	difference,
	keys,
	has_own,
	mix_in,
	is_string
) {
	function _cast(data) {
		return function(prop){
			if (!is_string(prop)){
				throw  "attempt to create a property that isn't a String";
			}
			data[prop] = null;
		};
	}

	var model = function () {

		var value = {};

		if (!!arguments.length){
			if (arguments.length===1 && typeof arguments[0] === "object"){
				value = arguments[0];
			} else {
				map(Array.prototype.slice.call(arguments),_cast(value));
			}
		}

		this.implements = function () {
			if (!arguments.length) {
				return false;
			}

			var dna = keys(value),
				props = null,
				diff = null;

			if (!!arguments.length) {
				if (arguments.length===1 && arguments[0]  instanceof model) {
					props = arguments[0].keys();
				} else if (arguments.length===1 && typeof arguments[0] === "object") {
					props = keys(arguments[0]);
				} else {
					props = Array.prototype.slice.call(arguments);
				}
			}
			return dna.length === props.length && difference(props,dna).length===0;
		};

		this.set = function (prop,val) {
			if (!this.has(prop)){
				throw "attempt to create new prop '"+prop+"'";
			}
			value[prop] = val;
		};

		this.has = function(prop){
			return has_own(value,prop);
		};

		this.get = function (prop) {
			return value[prop];
		};

		this.keys = function () {
			return keys(value);
		};

		this.compose = function (object) {
			mix_in(value,object);
		};

		this.clone = function () {
			return new model(value);
		};

		this.data = function () {
			return value;
		};
	};

	return model;
});