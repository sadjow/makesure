var merge = require('merge');
var proto = require('./manager');

exports = module.exports = makesure;

var register = {};

function makesure(fn) {
  if(typeof fn == 'undefined') throw('You should pass a function to makesure()');
  var manager = merge(true, proto);
  manager.init();
  fn.apply(manager);

  var validate = function() {
    manager.execute.apply(manager, arguments);
  };

  return validate;
}

makesure.register = function(name, fn) {
  register[name] = fn;
}

makesure.verbose = false;
