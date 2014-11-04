var proto = require('../lib/validation');
var makesure = require('..');
var merge = require('merge');
var should = require('should');

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

    it("sets the _required to true", function(){
      validation.init()._required.should.be.true;
    });

    it("sets the _validation to null", function(){
      (validation.init()._validation == null).should.be.true;
    });

    it("sets the _attrs to []", function(){
      validation.init()._attrs.should.eql([]);
    });

    it("sets the _alert to 'invalid'", function(){
      validation.init()._alert.should.eql('invalid');
    });

    it("sets the _requiredMessage to 'required'", function(){
      validation.init()._requiredMessage.should.eql('required');
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

  describe("alert()", function(){
    it("sets the _alert", function(){
      validation.alert('foo')._alert.should.eql('foo');
    });
  });

  describe("orSay()", function(){
    it("sets the _alert", function(){
      validation.orSay('foo')._alert.should.eql('foo');
    });
  });

  describe("validation.execute() a manager execute()", function(){
    var validateAddress;
    beforeEach(function(done){
      validateAddress = makesure(function(){
        this.attrs('street number').isNot(function(v){ return v.length == 0 });
      })
      validation.attrs('address').is(validateAddress);
      done();
    });

    describe("when invalid", function(){
      it("returns the errors on callback", function(done){
        validation.execute({ address: { street: '', number: '' } }, function(err, result){
          should.not.exist(err);
          should.exist(result);
          result.should.eql({
            error: {
              attrs: {
                address: {
                  attrs: {
                    street: {
                      messages: ['invalid']
                    },
                    number: {
                      messages: ['invalid']
                    },
                  }
                }
              }
            }
          });
          done();
        });
      });
    });
  });

  describe("validation.execute()", function(){
    beforeEach(function(done){
      validation.attrs('name email description').isNot(function(v){ return v.length == 0 })
      done();
    });

    describe("when invalid", function(){
      it("returns the errors on callback", function(done){
        validation.execute({ name: '', email: '', description: '' }, function(err, result){
          should.not.exist(err);
          should.exist(result);
          result.should.eql({
            error: {
              attrs: {
                name: {
                  messages: ['invalid']
                },
                email: {
                  messages: ['invalid']
                },
                description: {
                  messages: ['invalid']
                }
              }
            }
          });
          done();
        });
      });
    });
  });

  describe("validation.executeOnAttr()", function(){
    beforeEach(function(done){
      validation._validation= function(v){
        return v.length == 0
      };
      validation._negative = true;
      done();
    });

    describe("when valid", function(){
      var user = { name: 'a' };
      it("returns null on errors", function(done){
        validation.executeOnAttr('name', user, function(err, result){
          should.not.exist(err);
          should.not.exist(result);
          done();
        });
      });
    });

    describe("when invalid", function(){
      it("returns the errors", function(done){
        var user = { name: '' };

        validation.executeOnAttr('name', user, function(err, result){
          should.not.exist(err);
          result.should.eql({
            error: {
              attrs: {
                name: {
                  messages: ['invalid']
                }
              }
            }
          })
          done();
        });
      });
    });
  });
});
