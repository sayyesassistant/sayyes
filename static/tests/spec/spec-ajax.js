define(["sayyes/util/ajax"], function(ajax) {
	var xhr;
	describe("testing sayyes/utils/ajax", function() {
		it("should not be undefined", function() {
			expect(ajax).not.toBeUndefined();
		});
		it("should be an object", function() {
			expect(new ajax()).toEqual(jasmine.any(Object));
		});
		it("should be able to set the request's method", function() {
			xhr = new ajax();
			xhr.method("post");
			expect(xhr.options.type).toEqual("post");
			xhr.method(null);
			expect(xhr.options.type).toEqual("post");
		});
		it("should be able to set request's type (ie: json, jsonp, xml, html, text)", function() {
			xhr = new ajax();
			xhr.type("text");
			expect(xhr.options.dataType).toEqual("text");
			expect(function(){xhr.type(null);}).toThrow();
		});
		it("should not be able to set unsupported types (ie: json, jsonp, xml, html, text)", function() {
			xhr = new ajax();
			expect(function(){xhr.type(null);}).toThrow();
		});
		it("should be able to allow request's cache", function() {
			xhr = new ajax();
			xhr.allow_cache(true);
			expect(xhr.options.cache).toEqual(true);
			xhr.allow_cache(false);
			expect(xhr.options.cache).toEqual(false);
		});
		it("should be able to define success callbacks", function() {
			xhr = new ajax();
			expect(xhr.success(function(){})).toEqual(xhr);
		});
		it("should not be able to define invalid success callbacks", function() {
			xhr = new ajax();
			expect(xhr.success).toThrow();
		});
		it("should be able to define error callbacks", function() {
			xhr = new ajax();
			expect(xhr.error(function(){})).toEqual(xhr);
		});
		it("should not be able to define invalid error callbacks", function() {
			xhr = new ajax();
			expect(xhr.error).toThrow();
		});
		it("should be able to mock ajax's resquest", function() {
			xhr = new ajax();
			xhr.success(function(result){
				expect(result).toEqual({"foo":"bar"});
			})
			.mock({"foo":"bar"})
			.request("foo/url");
		});
		it("should be able to match expected JSON result", function() {
			var result;

			xhr = new ajax();
			xhr.success(function(val){
				result = val;
			})
			.mock({"foo":"bar","hello":"world"})
			.expect("foo","bar")
			.expect("hello",function(val){
				return val === "world";
			});

			runs(function(){
				xhr.request("foo/url");
			});

			waitsFor(function(){
				return !!result;
			},"success callback to be trigged", 100);

			runs(function(){
				expect(result).toEqual({"foo":"bar","hello":"world"});
			});
		});
		it("should fail when expected JSON result doesn't match", function() {
			var result;

			xhr = new ajax();
			xhr.error(function(val){
				result = val;
			})
			.mock({"foo":"bar"})
			.expect("foo","hello");

			runs(function(){
				xhr.request("foo/url");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 100);

			runs(function(){
				expect(result.status).toEqual("error");
			});
		});
		it("should be able load JSON services", function() {
			var result;

			xhr = new ajax();
			xhr.success(function(val){
				result = val;
			});

			runs(function(){
				xhr.request("/mock-data/mock-view.json");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 500);

			runs(function(){
				expect(result).toEqual(jasmine.any(Object));
			});
		});
		it("should be able to handle crossdomain errors", function() {
			var result;

			xhr = new ajax();
			xhr.error(function(val){
				result = val;
			});

			runs(function(){
				xhr.request("https://raw.github.com/sayyesassistant/sayyes/master/static/mock/mock-view.json");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 1500);

			runs(function(){
				expect(result.exception).toEqual(0);
			});
		});
		it("should be able to handle 404 urls", function() {
			var result;

			xhr = new ajax();
			xhr.error(function(val){
				result = val;
			});

			runs(function(){
				xhr.request("/foo/bar.json");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 500);

			runs(function(){
				expect(result.exception).toEqual(404);
			});
		});
		it("should be able to load jsonp services", function() {
			var result;

			xhr = new ajax();
			xhr.type("jsonp","jsonFlickrFeed");
			xhr.success(function(val){
				result = val;
			});

			runs(function(){
				xhr.request("http://api.flickr.com/services/feeds/photos_public.gne?format=json");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 1500);

			runs(function(){
				expect(result).toEqual(jasmine.any(Object));
			});
		});
		it("should be able to load xml", function() {
			var result;

			xhr = new ajax();
			xhr.type("xml");
			xhr.success(function(val){
				result = val;
			});

			runs(function(){
				xhr.request("/mock-data/crossdomain.xml");
			});

			waitsFor(function(){
				return !!result;
			},"error callback to be trigged", 1500);

			runs(function(){
				expect(result).toEqual(jasmine.any(Object));
			});
		});
	});
});