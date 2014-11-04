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

  it("HERE2 sets the attrs on validation", function(){
    var v = makesure(function(){
      this.attrs('test test2');
    })
    console.log(v);
    v._validations[0]._attrs.should.eql(['test', 'test2']);
  });


  describe("nested validation", function(){
    it("HERE returns the error on first callback attribute and the sanitized object on second attribute", function(done){
      var empty = function(v){
        return v.length == 0
      }

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.attrs('street number').isNot(empty);
      });

      var validateUserRegistration = makesure(function(){
        this.alert('Invalid registration.');
        this.attrs('name email description').isNot(empty).orSay("can't be empty");
        this.attr('email').is(validator.isEmail).ifPresent().orSay("invalid e-mail");
        this.validate('street').with(validateAddress).orSay('invalid address');
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          error: {
            messages: ["invalid registration."],
            attrs: {
              name: {
                messages: ["can't be empty"]
              },
              email: {
                messages: ["can't be empty"]
              },
              address: {
                messages: ['invalid address'],
                attrs: {
                  street: ["can't be empty"],
                  number: ["can't be empty"]
                }
              }
            }
          }
        });
      });
    });
  });
});
