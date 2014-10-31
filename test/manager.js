var manager = require('../lib/manager');
var merge = require('merge');

describe("manager", function(){
  var m = merge(true, manager);

  describe("init()", function(){
    it("sets the _validations to []", function(){
      m.init();
      m._validations.should.eql([]);
    });
  });
});
