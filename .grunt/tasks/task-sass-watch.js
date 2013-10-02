exports.run = function(grunt, scope) {

	var env = null,
		command = require("../modules/mod-utils").getCommandByEnv("sass-watch", grunt),
		storeConfig = require("../modules/mod-utils").getStoreConfig( grunt);

	require("../modules/mod-utils").render(command.args, grunt.config.get("constants"), grunt);

	if(!!storeConfig && !!storeConfig.sass_sources && !!storeConfig.dest_css_folder){
		command.args.push(storeConfig.sass_sources+":"+storeConfig.dest_css_folder);
	}

	grunt.log.errorlns("This command won't output results");
	require("../modules/mod-run").bash( command, scope.async(), grunt );
};