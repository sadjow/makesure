var merge = require('merge');
var proto = require('./manager');

exports = module.exports = makesure;



function makesure(fn) {
  if(typeof fn == 'undefined') throw('You should pass a function to makesure()');
  var manager = merge(true, proto);
  manager.init();
  fn.apply(manager);

  var validate = function() {
    manager.execute.apply(manager, arguments);
  };
  validate.__proto__ = manager;

  return validate;
}

makesure.registry = {};

makesure.register = function(name, fn) {
  makesure.registry[name] = fn;
}

makesure.verbose = false;
