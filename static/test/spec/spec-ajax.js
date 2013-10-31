describe("testing ajax module", function() {

	var ajax = null;

	beforeEach(function() {
		ajax = {};
	});

	it("should not be undefined", function() {
		expect(ajax).not.toBeUndefined();
	});
});