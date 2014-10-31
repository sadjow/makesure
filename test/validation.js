var proto = require('../lib/validation');
var merge = require('merge');

describe("validation", function(){
  var validation;

  beforeEach(function(done){
    validation = merge(true, proto);
    done();
  });

  afterEach(function(done){
    delete validation;
    done();
  });

  describe("init()", function(){
    it("sets the negative to false", function(){
      validation.init()._negative.should.be.false;
    });

    it("sets the isPresent to false", function(){
      validation.init()._ifPresent.should.be.false;
    });
  });

  describe("isPresent()", function(){
    it("mark the attrs to be required", function(){
      validation.isPresent()._required.should.be.true;
    });
  });

  describe("ifPresent()", function(){
    it("flag to execute the validation only if present", function(){
      validation.ifPresent()._ifPresent.should.be.true;
    });
  });

  describe("with()", function(){
    it("set the validation", function(){
      validation.with('foo')._validation.should.eql('foo');
    });
  });
});
