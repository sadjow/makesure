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
          error: {
            attrs: {
              street: {
                messages: { 'invalid': 'invalid'}
              },
              number: {
                messages: { 'invalid': 'invalid'}
              }
            }
          }
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
          error: {
            attrs: {
              street: {
                messages: {'required': 'required'}
              },
              number: {
                messages: {'required': 'required'}
              }
            }
          }
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
          error: {
            attrs: {
              name: {
                messages: {"empty": "invalid"}
              },
              email: {
                messages: {"empty": "invalid", "email": "invalid"}
              },
              address: {
                attrs: {
                  street: {
                    messages: {"empty": "invalid"}
                  },
                  number: {
                    messages: {"empty": "invalid"}
                  }
                }
              }
            }
          }
        });
        done();
      });
    });
  });

  describe("changing validation errors messages", function(){
    it("HERE! returns the defined validation messages", function(done){
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
          error: {
            attrs: {
              name: {
                messages: { "empty": "can't be empty" }
              },
              email: {
                messages: { "empty": "can't be empty", "email": "invalid e-mail" }
              },
              address: {
                attrs: {
                  street: {
                    messages: { "empty": "please, enter a value" }
                  },
                  number: {
                    messages: { "empty": "please, enter a value" }
                  }
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
