var proto = require('../lib/manager');
var merge = require('merge');

describe("manager", function(){
  var manager;

  beforeEach(function(done){
    manager = merge(true, proto);
    manager.init();
    done();
  });

  afterEach(function(done){
    delete manager;
    done();
  });

  describe("init()", function(){
    it("sets the _validations to []", function(){
      manager._validations.should.eql([]);
    });

    it("sets the _permitted to []", function(){
      manager._permitted.should.eql([]);
    });
  });

  describe("execute()", function(){
    describe("when valid", function(){
      xit("returns no error(null) on first callback attribute, but the sanitized object on second attribute", function(){

      });
    });
    describe("when invalid", function(){
      xit("returns the error on first callback attribute and the sanitized object on second attribute", function(){

      });
    });
  });

  describe("permit()", function(){
    it("sets the _permitted attributes with string arg", function(){
      manager.permit('name email')._permitted.should.eql(['name', 'email'])
    });

    it("sets the _permitted attributes with array arg", function(){
      manager.permit(['email', 'name'])._permitted.should.eql(['email', 'name'])
    });

    it("concatenates the permitted attributes", function(){
      manager._permitted = ['name'];
      manager.permit(['email', 'description'])._permitted.should.eql(['name', 'email', 'description']);
    });
  });

  describe("attrs()", function(){
    it("sets the attrs of a new validation", function(){
      manager.attrs('name email')._attrs.should.eql(['name', 'email'])
    });
  });

  describe("attr()", function(){
    it("sets the attrs of a new validation", function(){
      manager.attr('name email')._attrs.should.eql(['name', 'email'])
    });
  });

  describe("validate()", function(){
    it("sets the _validation of a new validation", function(){
      manager.validate('foo')._validation.should.eql('foo')
    });
  });

  describe("is()", function(){
    it("sets the _validation of a new validation", function(){
      manager.is('foo')._validation.should.eql('foo')
    });
  });

  describe("isNot()", function(){
    it("sets the _validation of a new validation", function(){
      manager.isNot('foo')._validation.should.eql('foo')
    });

    it("sets the new validation negative", function(){
      manager.isNot('foo')._negative.should.be.true;
    });
  });
});