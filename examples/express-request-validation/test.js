var makesure = require('../..')
var request = require('supertest');
var app = require('./index');
var should = require('should');

describe('Validating a express request (example)', function() {
  describe('when invalid', function() {
    var product = {
      name: '',
      description: 'A great',
      value: 100.00
    }

    it('returns 422 status and the error object', function(done){
      request(app)
      .post('/products')
      .send({ product: product })
      .expect(422)
      .end(function(err, res) {
        should.exist(res.body.error);
        res.body.error.attrs.product.attrs.name.messages.should.eql(['invalid'])
        res.body.error.attrs.product.attrs.description.messages.should.eql(['invalid']);
        should.not.exist(res.body.error.attrs.product.attrs.value)
        done();
      })
    })
  })

  describe('when valid but with a intrusive attribute', function() {
    it('returns 201 status and the sanitized product on body', function(done){
      var product = {
        name: 'Smartphone',
        description: 'A great product',
        value: 100.00,
        intrusiveAttribute: 'intrusive'
      }
      request(app)
      .post('/products')
      .send({ product: product })
      .expect(201)
      .end(function(err, res) {
        should.exist(res.body.product);
        should.not.exist(res.body.error);
        res.body.product.name.should.eql('Smartphone')
        res.body.product.description.should.eql('A great product');
        res.body.product.value.should.eql(100.00);
        done();
      })
    })
  })
})
