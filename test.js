var ultimateValidation = require('./index')
var validator = require('validator');
var chai = require('chai');
var expect = chai.expect;
var _ = require('underscore');

describe('simple validation', function() {
  it('returns the errors on attrs', function() {
    var obj = {
      name: ''
    }
    var result;
    ultimateValidation(obj).validates('name', 'Minimum length is 3 and max is 200', validator.isLength, [3, 200]).validate(function(err) {
      result = err;
    });

    var expectedError = {
      attrs: {
        name: ['Minimum length is 3 and max is 200']
      }
    }
    expect(result).to.equal(expectedError);
  })

  it('returns null when is valid', function () {
    var obj = {
      name: 'Wolverine'
    }

    var result;
    ultimateValidation(obj).validates('name', 'Minimum length is 3 and max is 200', validator.isLength, [3, 200]).validate(function(err) {
      result = err;
    });
    expect(result).to.equal(null);
  })
})

describe('nested validation', function() {
  var obj = {
    name: 'Spider Man',
    address: {
      street: ''
    }
  }

  var result;
  addressValidator = ultimateValidation().validates('street', "Can't be empty", validator.isLength, [1])

  ultimateValidation(obj)
    .validates('name', 'Tem que ser no mínimo 3', validator.isLength, [3])
    .validates('address', 'Endereço inválido', addressValidator)
    .validate(function(err) {
      result = err;
    })




  var expectedError = {
    attrs: {
      address: {
        attrs: {
          street: "Can't be empty"
        }
      }
    }
  }

  expect(result).to.equal(expectedError)
})