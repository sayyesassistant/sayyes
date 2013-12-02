define(["sayyes/util/log"], function(log) {
	window.log = log;
	describe("testing sayyes/util/log", function() {
		it("should not be undefined", function() {
			expect(log).not.toBeUndefined();
		});
		it("should be a singleton", function() {
			expect(function(){new log();}).toThrow();
		});
		it("should be a singleton", function() {
			expect(function(){new log();}).toThrow();
		});
		it("should not keep history by default", function() {
			log.info("this log shouldn't be kept by history");
			expect(log.history.length).toBe(0);
		});
		it("should keep history when keep_history is true", function() {
			log.keep_history = true;
			log.info("this log should be kept");
			expect(log.history.length).toBe(1);
		});
		it("should respect max_history property", function() {
			log.keep_history = true;
			log.max_history = 2;
			log.info("foo1");
			log.info("foo2");
			log.info("foo3");
			expect(log.history.length).toBe(2);
		});
		it("should clear history after reset", function() {
			log.clear();
			expect(log.history.length).toBe(0);
		});
	});
});