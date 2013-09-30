/*
@grunt -task:comp-js -page:app
*/
define([], function () {

	var Queue = function () {

	};

	return function (arr) {
		return new Queue(arr);
	};
});