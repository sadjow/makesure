var makesure = require('../..')
var expect = require('chai').expect;
var request = require('supertest');
var app = require('./index');

describe('Validating a express request (example)', function() {
  describe('when invalid', function() {
    var product = {
      name: '',
      description: 'A great',
      value: 100.00
    }

    xit('returns 422 status and the error object', function(done){
      request(app)
      .post('/products')
      .send({ product: product })
      .expect(422)
      .end(function(err, res) {
        expect(res.body.error.attrs.product.attrs.name).to.eql(['invalid'])
        expect(res.body.error.attrs.product.attrs.description).to.eql(['invalid']);
        done();
      })
    })
  })

  describe('when valid but with a intrusive attribute', function() {
    var product = {
      name: 'Smartphone',
      description: 'A great product',
      value: 100.00,
      intrusiveAttribute: 'intrusive'
    }

    xit('returns 201 status and the sanitized product on body', function(done){
      request(app)
      .post('/products')
      .send({ product: product })
      .expect(201)
      .end(function(err, res) {
        expect(res.body.product.name).to.eql('Smartphone')
        expect(res.body.product.description).to.eql('A great product');
        expect(res.body.product.value).to.eql(100.00);
        done();
      })
    })
  })
})
