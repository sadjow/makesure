var makesure = require('..');
var sinon = require('sinon');
var should = require('should');
var validator = require('validator');

describe("Makesure API", function(){

  it("has a verbose option", function(){
    makesure.verbose.should.be.false;
  });

  describe("makesure()", function(){
    it("returns a function", function(){
      (typeof makesure(function(){})).should.eql('function');
    });

    it("executes the functions to define validations", function(){
      var spy = sinon.spy();
      makesure(spy);
      sinon.assert.called(spy);
    });
  });

  describe("makesure()'s validation function", function(){
    it("remove the unpermitted attributes from object", function(done){
      var validate = makesure(function(){
        this.permit('name email');
      })
      validate({name: 'foo', email: 'foo@bar.com', description: 'Haaaaaaa!'}, function(err, obj){
        should.not.exist(err);
        obj.should.eql({name: 'foo', email: 'foo@bar.com'});
        done();
      });
    });
  });

  it("sets the attrs on validation", function(){
    var v = makesure(function(){
      this.attrs('test test2');
    });
    v._validations[0]._attrs.should.eql(['test', 'test2']);
  });


  describe("simple validation", function(){
    it("returns the errors on callback", function(done){
      var address = { street: '', number: '' };
      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(function(v, cb) { cb(null, v.length == 0) })
      });

      validateAddress(address, function(errors, obj){
        should.exist(errors);
        should.exist(obj);
        errors.should.eql({
          'street': [{ code: 'INVALID', message: 'invalid'}],
          'number': [{ code: 'INVALID', message: 'invalid'}]
        });
        done();
      })
    });
  });

  describe("required attributes", function(){
    it("returns the errors on callback", function(done){
      var address = {};
      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(function(v, cb) { cb (null, v.length == 0) })
        this.attrs('country').isNot(function(v, cb) { cb(null, v.length == 0) }).notRequired()
      });

      validateAddress(address, function(errors, obj){
        should.exist(errors);
        should.exist(obj);
        errors.should.eql({
          'street': [{ code: 'REQUIRED', message: 'required'}],
          'number': [{ code: 'REQUIRED', message: 'required'}]
        });
        done();
      })
    });
  });


  describe("nested validation", function(){
    it("returns the error on first callback attribute and the sanitized object on second attribute", function(done){
      makesure.registerSync('empty', validator.isNull);
      makesure.registerSync('email', validator.isEmail);

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot('empty');
      });

      var validateUserRegistration = makesure(function(){
        this.attrs('name email description').isNot('empty');
        this.attr('address').is(validateAddress);
        this.attr('email').is('email');
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          'name': [{ code: "EMPTY", message: "invalid" }],
          'email': [{ code: "EMPTY", message: "invalid" }, { code: "EMAIL", message: "invalid" }],
          'address.street': [{ code: "EMPTY", message: "invalid" }],
          'address.number': [{ code: "EMPTY", message: "invalid" }]
        });
        done();
      });
    });
  });

  describe("include other attributes on validation function", function(){
    var validatePasswordConfirmation = makesure(function(){
      this.attr('password').takeIn('passwordConfirmation').with(function(a, b, callback){
        callback(null, a == b);
      });
    });

    it("when valid", function(done){
      var user = { password: 'abc', passwordConfirmation: 'abc' };

      validatePasswordConfirmation(user, function(err, obj){
        should.not.exist(err);
        obj.should.eql(user);
        done();
      })
    });

    it("when invalid", function(done){
      var user = { password: 'abc', passwordConfirmation: 'ab' };

      validatePasswordConfirmation(user, function(err, obj){
        should.exist(err);
        err.should.eql({
          'password': [{code: "INVALID", message: "invalid"}]
        });

        done();
      })
    });
  });

  describe("changing validation errors messages", function(){
    it("returns the defined validation messages", function(done){
      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot('empty').alert("please, enter a value");
      });

      var validateUserRegistration = makesure(function(){
        this.attrs('name email description').isNot('empty').alert("can't be empty");
        this.attr('address').is(validateAddress);
        this.attr('email').is('email').alert('invalid e-mail');
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          'name': [{code: "EMPTY", message: "can't be empty"}],
          'email': [{code: "EMPTY", message: "can't be empty"}, {code: "EMAIL", message: "invalid e-mail"}],
          'address.street': [{code: "EMPTY", message: "please, enter a value"}],
          'address.number': [{code: "EMPTY", message: "please, enter a value"}]
        });
        done();
      });
    });
  });
});
