var proto = require('../lib/makesure-node');
var merge = require('merge');
var expect = require('chai').expect;

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

    it('sets required to true', function(){
      expect(node.required).to.equal(true);
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
      it('throws a exception', function () {
        expect(node.that.bind(node)).to.throw("It's needed to define at least one argument to that()")
      });
    });
  });

 describe('is()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns the node', function(){
      expect(node.is(function(){})).to.equal(node);
    });

    it('assigns the rest of arguments to the validationArgs', function () {
      var password = '123';
      var passwordConfirmation = '1234';

      node.is(function(x, y){
        return x == y;
      }, password, passwordConfirmation);

      expect(node.validationArgs).to.eql(['123', '1234']);
    });

    describe('when the first argument is a function', function(){
      it('assigns the function to the validation', function () {
        var foo = function(){ return 'bar' }
        expect(node.is(foo).validation).to.eql(foo);
      });
    });

    describe('when pass no argument', function(){
      it('throws a exception', function () {
        expect(node.is.bind(node)).to.throw("It's needed to define at least one argument to is()")
      });
    });
  });

 describe('isNot()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns the node', function(){
      expect(node.isNot(function(){})).to.equal(node);
    });

    it('assigns the rest of arguments to the validationArgs', function () {
      var password = '123';
      var passwordConfirmation = '1234';

      node.isNot(function(x, y){
        return x != y;
      }, password, passwordConfirmation);

      expect(node.validationArgs).to.eql(['123', '1234']);
    });

    describe('when the first argument is a function', function(){
      it('assigns the function to the validation', function () {
        var foo = function(){ return 'bar' }
        expect(node.isNot(foo).validation).to.eql(foo);
      });
    });

    describe('when pass no argument', function(){
      it('throws a exception', function () {
        expect(node.isNot.bind(node)).to.throw("It's needed to define at least one argument to isNot()")
      });
    });
  });

 describe('orSay()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns the node', function(){
      expect(node.orSay('You are wrong!')).to.equal(node);
    });

    it('assigns the first argument to the message', function(){
      expect(node.orSay('You are wrong!').message).to.equal('You are wrong!');
    });

    describe('when pass no argument', function(){
      it('throws a exception', function () {
        expect(node.orSay.bind(node)).to.throw("It's needed to define at least one argument to orSay()")
      });
    });
  });

  describe('and()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns a new node with the prev link to this node', function(){
      expect(node.and().prev).to.equal(node);
    });
  });

  describe('end()', function(){
    var node = merge({}, proto);

    before(function(){
      node.init();
    });

    it('returns the first', function(){
      expect(node.end()).to.equal(node.first);
    });
  });
});
