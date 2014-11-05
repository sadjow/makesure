var makesure = require('../');
var should = require('should');

describe("makesure's registry", function(){
  it("saves something on the registry", function(){
    var func = 'foo';
    makesure.register('bar', func);
    makesure.registry('bar').should.eql(func);
  });

  it("saves the function on the register", function(){
    var func = function() { return 'hello' }
    makesure.register('empty', func);
    makesure.registry('empty').should.eql(func);
    makesure.registry('empty')().should.eql('hello');
  });

  describe("registry()", function(){
    it("throws a exception when the function is undefined", function(){
      try {
        makesure.registry('this_does_not_exist');
      } catch (e) {
        e.should.eql("There is no function called 'this_does_not_exist' on the makesure's registry")
      }
    });
  });
});
