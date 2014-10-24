var makesure = require('./index')
var validator = require('validator');
var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');

describe('simple validation', function() {

  var validUser = makesure()
    .that('name').is(validator.isLength, 3, 4).orSay('Minimum length is 3 and max is 200')

  it('returns the errors on attrs', function(done) {
    var user = {
      name: ''
    }

    var expectedError = {
      attrs: {
        name: ['Minimum length is 3 and max is 200']
      }
    }
    expectedError = JSON.stringify(expectedError);

    validUser(user)
    .catch(function(err){
      err = JSON.stringify(err);
      expect(err).to.equal(expectedError);
      done()
    });
  })

  it('doesnt catch the error when valid', function (done) {
    var user = {
      name: 'Wolverine'
    }

    validUser(user).then(function(){
      done();
    }).catch(function(err){
      done(err);
    });
  })
})
/*
describe('nested validation catch', function() {
  var validAddress = makesure().that('street').isNot(_.empty)
                        .orSay("Can't be empty");
  var validUser = makesure()
    .that('name').is(validator.isLength, 3, 4).orSay('Minimum length is 3 and max is 200')
    .and().that('address').is(validAddress);

  it('returns nested errors', function(done) {
    var user = {
      name: 'Spider Man',
      address: {
        street: ''
      }
    }

    var expectedError = {
      attrs: {
        address: {
          attrs: {
            street: ["Can't be empty"]
          }
        }
      }
    }
    expectedError = JSON.stringify(expectedError);
    validUser(user).catch(function(err){
      err = JSON.stringify(err);
      expect(err).to.eql(expectedError)
    });
  })

  it('doesnt catch the error when valid', function() {
    var user = {
      name: 'Spider Man',
      address: {
        street: 'sadsad'
      }
    }

    validUser(user).then(function(){
      done();
    });
  })

  describe('general validation', function() {

    var valid = makesure().that(function() {
        return 7 != 3; // TODO mock that new Date().getDay() ;
    }).orSay("The operation can't be performed on sunday.")

    it('returns a general error message when a general validation', function(done) {
      var expectedError = {
        messages: ['The operation cant be performed on sunday.']
      }
      expectedError = JSON.stringify(expectedError);

      valid().catch(function(err){
        err = JSON.stringify(err);
        expect(err).to.equal(expectedError);
        done();
      })
    })
  })
})*/