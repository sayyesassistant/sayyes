exports.run = function(grunt, scope) {

	var env = null,
		storeConfig = require("../modules/mod-utils").getStoreConfig( grunt),
		conf = require("../modules/mod-utils").getStoreConfig(grunt) || grunt.config.get("constants"),
		command = null,
		done = null,
		blob = null ;

	command = require("../modules/mod-utils").getCommandByEnv("comp-sass", grunt);

	if (!command){
		grunt.fail.warn("Command not found comp-sass command to env:"+grunt.config.get("constants").env);
		return;
	}

	require("../modules/mod-utils").render(command.args, grunt.config.get("constants"), grunt);

	if(!!storeConfig && !!storeConfig.sass_sources && !!storeConfig.dest_css_folder){
		command.args.push(storeConfig.sass_sources+":"+storeConfig.dest_css_folder);
	}

	done =  scope.async();

	function compSASS(){
		grunt.log.errorlns("hold on, it takes a while to finish....");
		require("../modules/mod-run").bash( command, done, grunt );
	}

	if(grunt.config.get("arguments").reset==="true"){
		grunt.log.ok("Refreshing all sass cached files...");
		require("../modules/mod-run").bash( {
			cmd : "find . -name *.scss; touch `find . -name *.scss`"
		}, compSASS, grunt );
	} else {
		grunt.log.ok("Refreshing sass cache...");
		require("../modules/mod-run").bash( {
			cmd : "svn st | grep [MA]*.scss; touch `svn st | grep [MA]*.scss | awk '{print$NF}'`"
		}, compSASS, grunt );
	}
};