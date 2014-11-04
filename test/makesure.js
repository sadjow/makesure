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
                messages: ['invalid']
              },
              number: {
                messages: ['invalid']
              }
            }
          }
        });
        done();
      })
    });
  });


  describe("nested validation", function(){
    it("HERE1 returns the error on first callback attribute and the sanitized object on second attribute", function(done){
      var empty = function(v){
        return v.length == 0
      }

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(empty);
      });

      var validateUserRegistration = makesure(function(){
        this.attrs('name email description').isNot(empty)
        //this.attr('email').is(validator.isEmail)
        this.attr('address').is(validateAddress)
        this.attr('email').is(validator.isEmail)
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          error: {
            attrs: {
              name: {
                messages: ["invalid"]
              },
              email: {
                messages: ["invalid"]
              },
              address: {
                attrs: {
                  street: {
                    messages: ["invalid"]
                  },
                  number: {
                    messages: ["invalid"]
                  }
                }
              }
            }
          }
        });
      });
    });
  });
});
