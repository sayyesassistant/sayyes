/*
@grunt -task=jss
*/
require([
	"sayyes/util/log",
	"sayyes/modules/core",
	"lib/domReady",
	"sayyes/modules/controller"
], function (
	log,
	core,
	domReady,
	controller
){

	var instance, form;

	function create_controller(url) {
		try {
			instance = controller(document.getElementById("sayyes-assistant"));
		} catch (error) {
			log.error("error to create controller",error);
			return;
		}
		instance.load_config(url, remove_form, show_alert);
	}

	function remove_form(){
		$(form).remove();
	}

	function show_alert(value){
		alert("Failed to load service.\nCheck you console to see the result");
		console.dir(value);
	}

	function init(){
		form = document.getElementById("load-config");
		if (!form){
			log.error("error to find form to load config");
			return;
		}

		$(form).on("submit",function(event){
			event.preventDefault();
			event.stopPropagation();
			create_controller($(this).find("#service").val());
		});
	}

	domReady(init);
});