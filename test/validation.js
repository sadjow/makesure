var proto = require('../lib/validation');
var merge = require('merge');

describe("validation", function(){
  var validation;

  beforeEach(function(done){
    validation = merge(true, proto);
    validation.init();
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

    it("sets the _required to false", function(){
      validation.init()._required.should.be.false;
    });

    it("has a _validation undefined", function(){
      (typeof validation.init()._validation).should.eql('undefined');
    });

    it("sets the _attrs to []", function(){
      validation.init()._attrs.should.eql([]);
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

  describe("negative()", function(){
    it("set _negative to true", function(){
      validation.negative()._negative.should.be.true;
    });
  });

  describe("attrs()", function(){
    it("set _attrs with a string", function(){
      validation.attrs('name email')._attrs.should.eql(['name', 'email']);
    });

    it("set _attrs with a array", function(){
      validation.attrs(['name', 'email'])._attrs.should.eql(['name', 'email']);
    });

    it("concatenates the _attrs", function(){
      validation._attrs = ['description'];
      validation.attrs(['name', 'email'])._attrs.should.eql(['description', 'name', 'email']);
    });
  });
});
