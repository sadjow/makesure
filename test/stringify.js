var stringify = require('../lib/stringify');
var should = require('should');

describe("stringify()", function(){
  describe("when the value is undefined", function(){
    it("returns a blank string", function(){
      var undefinedVar;
      stringify(undefinedVar).should.eql('');
    });
  });

  describe("when the value is null", function(){
    it("returns a blank string", function(){
      stringify(null).should.eql('');
    });
  });

  describe("when the value has a toString method", function(){
    var obj = {
      toString: function() {
        return 'bar';
      }
    }
    it("returns to result of toString()", function(){
      stringify(obj).should.eql('bar');
    });
  });


  describe("when is a number", function(){
    it("returns to result of toString()", function(){
      stringify(4.88).should.eql('4.88');
    });
  });

  describe("when is a string", function(){
    it("returns to result of toString()", function(){
      stringify('asd').should.eql('asd');
    });
  });
});
