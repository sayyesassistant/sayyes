define(["sayyes/util/model"], function(model) {
	var blob;
	describe("testing sayyes/utils/model", function() {
		it("should not be undefined", function() {
			expect(model).not.toBeUndefined();
		});
		it("should be an object", function() {
			expect(new model()).toEqual(jasmine.any(Object));
		});
		it("should be to check if a model implements another model", function() {
			var foo = new model("a","b");
				blob = new model("a","b");
				bar = new model("a","c");
			expect(foo.implements(blob)).toBe(true);
			expect(foo.implements(bar)).toBe(false);
		});
		it("should be able to create a new model from keys' list", function() {
			blob = new model("foo","bar");
			expect(blob.implements({"foo":null})).not.toBeTruthy();
			expect(blob.implements("foo","bar")).toBeTruthy();
			expect(function(){
				new model("foo",null);
			}).toThrow();
			expect(function(){
				new model("foo",1);
			}).toThrow();
		});
		it("should be able to create a new model from object", function() {
			var blob = new model({"foo":null});
			expect(blob.implements({"foo":null})).toBeTruthy();
			expect(blob.implements("foo")).toBeTruthy();
			expect(blob.implements("foo","bar")).not.toBeTruthy();
		});
		it("should be able to set and get values", function() {
			blob = new model({"foo":"bar","say":null});
			expect(blob.get("foo")).toBe("bar");
			expect(blob.get("say")).toBe(null);
			blob.set("say","yes");
			expect(blob.get("say")).toBe("yes");
		});
		it("should be able to prevent new properties being created via 'set' method", function() {
			blob = new model("foo","bar");
			expect(blob.set).toThrow();
			expect(function(){
				blob.set("hello");
			}).toThrow();
		});
		it("should be able to componse the model already set with more properties", function() {
			blob = new model("foo","bar");
			blob.compose({"loren":"ipsun"});
			expect(blob.implements("foo","bar","loren")).toBeTruthy();
			expect(blob.data()).toEqual({"foo":null,"bar":null,"loren":"ipsun"});
		});
		it("should be able to clone itself", function() {
			blob = new model("foo","bar");
			var c = blob.clone();
			expect(blob.data()).toEqual(c.data());
		});
		it("should be able to return model's data", function() {
			blob = new model({"foo":"bar"});
			expect(blob.data()).toEqual({"foo":"bar"});
		});
	});
});