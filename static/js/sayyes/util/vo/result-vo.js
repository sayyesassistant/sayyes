define(["sayyes/util/model"], function (model) {
	var vo = function() {
		return new model("status","exception", "message", "value");
	};
	return vo;
});