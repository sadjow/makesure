var makesure = require('../..')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../examples/express-request-validation')

describe('Validating a express request (example)', function() {
  describe('when invalid', function() {
    var product = {
      name: '',
      description: 'A great product',
      value: 100.00
    }

    it('returns 422 status and the error object', function(done){
      request(app)
      .post('/products')
      .send({ product: product })
      .expect(422)
      .end(function(err, res) {
        expect(res.body.error.attrs.product.attrs.name).to.eql(['invalid'])
        done();
      })
    })
  })
})
