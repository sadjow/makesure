var proto = require('../lib/makesure-node')
var chai = require('chai');
var merge = require('merge');
var expect = chai.expect;

describe('makesure node', function() {
  describe('initialization', function() {
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('sets the prev node to null', function(){
      expect(node.prev).to.equal(null);
    });

    it('sets the next node to null', function(){
      expect(node.next).to.equal(null);
    });

    it('sets the attr to null', function(){
      expect(node.attr).to.equal(null);
    });

    it('sets the message to "invalid"', function(){
      expect(node.message).to.equal('invalid');
    });

    it('sets the args to [] (a empty array)', function(){
      expect(node.validationArgs).to.eql([]);
    });

    it('sets the negative flag to false', function(){
      expect(node.negative).to.equal(false);
    });
  });
});