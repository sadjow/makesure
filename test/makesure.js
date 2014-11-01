var makesure = require('..');
var sinon = require('sinon');
var should = require('should');
var validator = require('validator');

describe("Makesure API", function(){
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


  describe("nested validation", function(){
    it("returns the error on first callback attribute and the sanitized object on second attribute", function(done){
      var empty = function(v){
        this.message = "can't be empty";
        return v.length == 0
      }

      validEmail = validator.isEmail;
      validEmail.message = 'invalid e-mail';

      var user = { name: '', email: '', description: 'Haaaaaaa!', address: { street: '', number: '' } };

      var validateAddress = makesure(function(){
        this.message = 'Invalid address!';
        this.attrs('street number').isNot(empty);
      });

      var validateUserRegistration = makesure(function(){
        this.message = 'Invalid user registration!';
        this.attrs('name email description').isNot(empty)
        this.attr('email').is(validEmail).ifPresent();
        this.validate('street').with(validateAddress);
      });

      validateUserRegistration(user, function(err, result){
        should.exist(err);
        err.should.eql({
          error: {
            message: 'Invalid user registration!',
            attrs: {
              name: ["can't be empty"],
              email: ["can't be empty"],
              address: {
                message: 'Invalid address!',
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
