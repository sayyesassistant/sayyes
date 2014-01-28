define([
	"sayyes/plugins/plugin-checkbox"
],function(
	checkbox
){
	return {
		run : function(view){
			checkbox.run();
		},
		dispose : function () {
			checkbox.dispose();
		}
	};
});