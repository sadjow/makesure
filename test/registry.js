var makesure = require('../');
var should = require('should');

describe("makesure's registry", function(){
  it("saves something on the registry", function(){
    var func = 'foo';
    makesure.register('bar', func);
    makesure.registry.bar.should.eql(func);
  });

  it("saves the function on the register", function(){
    var func = function() { return 'hello' }
    makesure.register('empty', func);
    makesure.registry.empty.should.eql(func);
    makesure.registry.empty().should.eql('hello');
  });
});
