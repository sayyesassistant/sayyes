exports.bash = function (command, onComplete, grunt) {

	var util = require('util'),
		exec = require('child_process').exec,
		c = command.cmd +" "+ (command.args ? command.args.join(" ") : ""),
		child;

	grunt.log.ok("Running command:");
	grunt.log.writeln(c);

	child = exec(c, function (error, stdout, stderr) {
		if(stdout){
			grunt.log.writeln("\n[outupt]");
			grunt.log.writeln(stdout);
		}
		if(stderr){
			grunt.log.writeln("\n[outupt err]");
			grunt.log.writeln(stderr);
		}
		onComplete(error||stderr||stdout);
	});
};