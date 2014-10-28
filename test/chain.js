var makesure = require('..')
var expect = require('chai').expect;
var empty = function(value){
  return value.length == 0;
};

describe('chain validation definition', function() {
  var aValidProduct = makesure()
  .that('Name').isNot(empty).and()
  .that('Email').isNot(empty).and()
  .that('Code').isNot(empty).and()
  .that('Description').isNot(empty).and()
  .that('Value').isNot(empty)

  describe('when invalid', function() {
    var invalidProduct = {
      Name: '',
      Code: '',
      Email: '',
      Description: '',
      Value: ''
    }
    var result;

    before(function(done) {
      aValidProduct.validate(invalidProduct, function(error){
        result = JSON.stringify(error);
        done();
      });
    });

    it('returns the errors', function(){
      var expectedErrors = JSON.stringify({
        attrs: {
          Name: ['invalid'],
          Email: ['invalid'],
          Code: ['invalid'],
          Description: ['invalid'],
          Value: ['invalid']
        }
      });

      expect(result).to.equal(expectedErrors);
    });
  });
});
