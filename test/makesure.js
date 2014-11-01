var makesure = require('..');
var sinon = require('sinon');
var should = require('should');

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
});
