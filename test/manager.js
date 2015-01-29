var proto = require('../lib/manager');
var merge = require('merge');
var should = require('should');

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

    it("sets the _alert to null", function(){
      should(manager._alert).be.eql(null);
    });
  });

  describe("execute()", function(){
    it("remove the unpermitted attributes from object", function(done){
      manager.permit('name email');
      var obj = {name: 'foo', email: 'foo@bar.com', description: 'Haaaaaaa!'};
      manager.execute(obj, function(err, result){
        should.not.exist(err);
        result.should.eql({name: 'foo', email: 'foo@bar.com'});
        should.not.exist(result.description);

        // ensure obj is the same.
        should.exist(obj.description);
        done();
      });
    });

    describe("when valid", function(){
      it("returns no error(null) on first callback attribute, but the sanitized object on second attribute", function(){

      });
    });
    describe("when invalid", function(){
      it("returns the error on first callback attribute and the sanitized object on second attribute", function(done){
        var obj = {name: '', email: '', description: 'Haaaaaaa!'};
        //manager.ifErrorSay('')
        manager.attrs('name email description').isNot('empty');

        manager.execute(obj, function(err, result){
          should.exist(err);
          err.should.eql({
            'name': [{code: 'EMPTY', message: 'invalid'}],
            'email': [{code: 'EMPTY', message: 'invalid'}]
          });
          done();
        });
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

  describe("alert()", function(){
    it("sets the manager alert", function(){
      manager.alert('foo')._alert.should.eql('foo');
    });
  });
});
