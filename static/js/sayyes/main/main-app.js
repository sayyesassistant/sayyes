/*
@grunt -task=comp-js -page=app -env=final
*/
require([
	"mod/core",
	"lib/domReady"
], function (
	core,
	domReady
){
	domReady(function(){
		console.log("ready to go");
	});
	console.log("waiting dom ready");
});