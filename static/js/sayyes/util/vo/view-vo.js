define(["sayyes/util/model"], function (model) {
	var vo = function() {
		return new model("name","template_name","data");
	};
	return vo;
});