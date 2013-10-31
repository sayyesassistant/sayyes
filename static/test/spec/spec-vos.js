define([
	"sayyes/util/vo/result-vo",
	"sayyes/util/vo/controller-vo",
	"sayyes/util/vo/view-vo"
], function(
	result_vo,
	controller_vo,
	view_vo
) {
	var blob;
	describe("testing sayyes/util/vo/result-vo", function() {
		it("should not be undefined", function() {
			expect(result_vo).not.toBeUndefined();
		});
		it("should be an object", function() {
			expect(new result_vo()).toEqual(jasmine.any(Object));
		});
		it("should be an object that implements: 'status','exception', 'message', 'value'", function() {
			blob = new result_vo();
			expect(blob.implements("status","exception", "message", "value")).toBeTruthy();
		});
	});
	describe("testing sayyes/util/vo/controller-vo", function() {
		it("should not be undefined", function() {
			expect(controller_vo).not.toBeUndefined();
		});
		it("should be an object", function() {
			expect(new controller_vo()).toEqual(jasmine.any(Object));
		});
		it("should be an object that implements: 'id','attendant','client','start_with','views'", function() {
			blob = new controller_vo();
			expect(blob.implements("id","attendant","client","start_with","views")).toBeTruthy();
		});
	});
	describe("testing sayyes/util/vo/view-vo", function() {
		it("should not be undefined", function() {
			expect(view_vo).not.toBeUndefined();
		});
		it("should be an object", function() {
			expect(new view_vo()).toEqual(jasmine.any(Object));
		});
		it("should be an object that implements: 'name','template_name','data'", function() {
			blob = new view_vo();
			expect(blob.implements("name","template_name","data")).toBeTruthy();
		});
	});
});