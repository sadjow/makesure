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

    it('sets itself as the first node', function(){
      expect(node.first).to.equal(node);
    });

    describe('when pass the previous node as argument', function() {
      var secondNode = merge({}, proto);

      before(function(){
        secondNode.init(node);
      });

      it('associates the previous node', function(){
        expect(secondNode.prev).to.equal(node);
      });

      it("associates marks the previous' first node as the first node", function(){
        expect(secondNode.prev.first).to.equal(node.first);
      });
    });
  });

  describe('that()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns the node', function(){
      expect(node.that('foo')).to.equal(node);
    });

    it('assigns the rest of arguments to the validationArgs', function () {
      var password = '123';
      var passwordConfirmation = '1234';

      node.that(function(x, y){ 
        return x == y;
      }, password, passwordConfirmation);

      expect(node.validationArgs).to.eql(['123', '1234']);
    });

    describe('when the first argument is a string', function(){
      it('assigns the attr to that string', function () {
        expect(node.that('name').attr).to.equal('name');
      });
    });

    describe('when the first argument is a function', function(){
      it('assigns the validation to that function', function () {
        var foo = function(){ return 'bar' }
        expect(node.that(foo).validation).to.eql(foo);
      });
    });

    describe('when pass no argument', function(){
      it('assigns the validation to that function', function () {
        expect(node.that.bind(node)).to.throw("It's needed to define at least one argument to that()")
      });
    });
  });
});