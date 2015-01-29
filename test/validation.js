var proto = require('../lib/validation');
var makesure = require('..');
var merge = require('merge');
var should = require('should');

describe("validation", function(){
  beforeEach(function(done){
    this.validation = merge(true, proto);
    this.validation.init();
    done();
  });

  afterEach(function(done){
    delete this.validation;
    done();
  });

  describe("init()", function(){
    it("sets the negative to false", function(){
      this.validation.init()._negative.should.be.false;
    });

    it("sets the _required to true", function(){
      this.validation.init()._required.should.be.true;
    });

    it("sets the _validation to null", function(){
      (this.validation.init()._validation == null).should.be.true;
    });

    it("sets the _validationArgs to []", function(){
      (this.validation.init()._validationArgs).should.eql([]);
    });

    it("sets the _attrs to []", function(){
      this.validation.init()._attrs.should.eql([]);
    });

    it("sets the _alert to 'invalid'", function(){
      this.validation.init()._alert.should.eql('invalid');
    });

    it("sets the _requiredMessage to 'required'", function(){
      this.validation.init()._requiredMessage.should.eql('required');
    });

    it("sets the _requiredTag to 'required'", function(){
      this.validation.init()._requiredTag.should.eql('required');
    });

    it("sets the _takeIn to []", function(){
      (this.validation.init()._takeIn).should.eql([]);
    });
  });

  describe("isPresent()", function(){
    it("mark the attrs to be required", function(){
      this.validation._required = false;
      this.validation.isPresent()._required.should.be.true;
    });
  });

  describe("required()", function(){
    it("mark the attrs to be required", function(){
      this.validation._required = false;
      this.validation.required()._required.should.be.true;
    });
  });

  describe("ifPresent()", function(){
    it("flag to execute the validation only if present", function(){
      this.validation._required = true;
      this.validation.ifPresent()._required.should.be.false;
    });
  });

  describe("notRequired()", function(){
    it("flag to execute the validation only if present", function(){
      this.validation._required = true;
      this.validation.notRequired()._required.should.be.false;
    });
  });

  describe("with()", function(){
    it("set the validation", function(){
      this.validation.with('foo')._validation.should.eql('foo');
    });
  });

  describe("negative()", function(){
    it("set _negative to true", function(){
      this.validation.negative()._negative.should.be.true;
    });
  });

  describe('takeIn()', function() {
    it('sets a list of attribute to be included later', function() {
      this.validation.takeIn('foo', 'bar')._takeIn.should.eql(['foo', 'bar']);
    });
  });

  describe("attrs()", function(){
    it("set _attrs with a string", function(){
      this.validation.attrs('name email')._attrs.should.eql(['name', 'email']);
    });

    it("set _attrs with a array", function(){
      this.validation.attrs(['name', 'email'])._attrs.should.eql(['name', 'email']);
    });

    it("concatenates the _attrs", function(){
      this.validation._attrs = ['description'];
      this.validation.attrs(['name', 'email'])._attrs.should.eql(['description', 'name', 'email']);
    });
  });

  describe("alert()", function(){
    it("sets the _alert", function(){
      this.validation.alert('foo')._alert.should.eql('foo');
    });
  });

  describe("tag()", function(){
    it("sets the _alertTag", function(){
      this.validation.tag('foo')._alertTag.should.eql('foo');
    });
  });

  describe("requiredTag()", function(){
    it("sets the _requiredTag", function(){
      this.validation.requiredTag('foo')._requiredTag.should.eql('foo');
    });
  });

  describe("orSay()", function(){
    it("sets the _alert", function(){
      this.validation.orSay('foo')._alert.should.eql('foo');
    });
  });

  describe("validation.execute() a manager execute()", function(){
    var validateAddress;
    beforeEach(function(done){
      validateAddress = makesure(function(){
        this.attrs('street number').isNot(function(v, cb){ cb(null, v.length == 0) });
      })
      this.validation.attrs('address').is(validateAddress);
      done();
    });

    describe("when invalid", function(){
      it("returns the errors on callback", function(done){
        this.validation.execute({ address: { street: '', number: '' } }, function(err, result){
          should.not.exist(err);
          should.exist(result);
          result.should.eql({
            'address.street': [{code: 'INVALID', message: 'invalid'}],
            'address.number': [{code: 'INVALID', message: 'invalid'}]
          });
          done();
        });
      });
    });
  });

  describe("validation.execute()", function(){
    beforeEach(function(done){
      this.validation.attrs('name email description').isNot(function(v, cb){ cb(null, v.length == 0) })
      done();
    });

    describe("when invalid", function(){
      it("returns the errors on callback", function(done){
        this.validation.execute({ name: '', email: '', description: '' }, function(err, result){
          should.not.exist(err);
          should.exist(result);
          result.should.eql({
            'name': [{ code: 'INVALID', message: 'invalid' }],
            'email': [{ code: 'INVALID', message: 'invalid' }],
            'description': [{ code: 'INVALID', message: 'invalid' }]
          });
          done();
        });
      });
    });
  });

  describe("validation.executeOnAttr()", function(){
    beforeEach(function(done){
      this.validation._validation= function(v, cb){
        cb(null, v.length == 0)
      };
      this.validation._negative = true;
      done();
    });

    describe("when valid", function(){
      var user = { name: 'a' };
      it("returns null on errors", function(done){
        this.validation.executeOnAttr('name', user, function(err, result){
          should.not.exist(err);
          should.not.exist(result);
          done();
        });
      });
    });

    describe("when invalid", function(){
      it("returns the errors", function(done){
        var user = { name: '' };

        this.validation.executeOnAttr('name', user, function(err, result){
          should.not.exist(err);
          result.should.eql({
            'name': [{code: 'INVALID', message: 'invalid'}]
          });
          done();
        });
      });
    });
  });

  var shouldBehaveLikeSetValidation = function(fnName) {
    it("sets the _validation", function(){
      this.validation[fnName]('foobar')._validation.should.eql('foobar');
    });

    it("sets the validation args on rest of args", function(){
      this.validation[fnName]('foobar', 1, 2)._validationArgs.should.eql([1, 2]);
      this.validation[fnName]('foobar', 'bar', 2)._validationArgs.should.eql(['bar', 2]);
    });

    it("sets the tag to the validation name when uses tre string", function(){
      this.validation[fnName]('some_validation', 3, 2)._alertTag.should.eql('some_validation');
    });
  }

  describe("setValidation()", function(){
    shouldBehaveLikeSetValidation('setValidation');
  });

  describe("is()", function(){
    shouldBehaveLikeSetValidation('is');
  });

  describe("isNot()", function(){
    shouldBehaveLikeSetValidation('isNot');
  });

  describe("with()", function(){
    shouldBehaveLikeSetValidation('with');
  });
});
