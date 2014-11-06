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
        this.attrs('street number').isNot(function(v) { return v.length == 0 })
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
        this.attrs('street number').isNot(function(v) { return v.length == 0 })
        this.attrs('country').isNot(function(v) { return v.length == 0 }).notRequired()
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
      var empty = function(v){
        return String(v).length == 0
      }

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(empty);
      });

      var validateUserRegistration = makesure(function(){
        this.attrs('name email description').isNot(empty);
        this.attr('address').is(validateAddress);
        this.attr('email').is(validator.isEmail);
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          error: {
            attrs: {
              name: {
                messages: {"invalid": "invalid"}
              },
              email: {
                messages: {"invalid": "invalid"}
              },
              address: {
                attrs: {
                  street: {
                    messages: {"invalid": "invalid"}
                  },
                  number: {
                    messages: {"invalid": "invalid"}
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
    it("returns the defined validation messages", function(done){
      var empty = function(v){
        return String(v).length == 0
      }

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(empty).alert("please, enter a value.").tag('empty');
      });

      var validateUserRegistration = makesure(function(){
        this.attrs('name email description').isNot(empty).alert("can't be empty").tag('empty');
        this.attr('address').is(validateAddress);
        this.attr('email').is(validator.isEmail).alert('invalid e-mail').tag('email');
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          error: {
            attrs: {
              name: {
                messages: { "can't be empty": "empty" }
              },
              email: {
                messages: { "can't be empty": "empty", "invalid e-mail": "email" }
              },
              address: {
                attrs: {
                  street: {
                    messages: { "please, enter a value.": "empty" }
                  },
                  number: {
                    messages: { "please, enter a value.": "empty" }
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
