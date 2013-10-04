exports.bash = function (command, onComplete, grunt) {

	var util = require('util'),
		exec = require('child_process').exec,
		c = command.cmd +" "+ (command.args ? command.args.join(" ") : ""),
		child;

	grunt.log.ok("Running command:");
	console.log(c);

	child = exec(c, function (error, stdout, stderr) {
		if(stdout){
			grunt.log.writeln("\n[outupt]");
			console.log(stdout);
		}
		if(stderr){
			grunt.log.writeln("\n[outupt err]");
			console.log(stderr);
		}
		if(!!onComplete){
			onComplete(error||stderr||stdout);
		}
	});
};