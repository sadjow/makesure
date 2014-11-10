var merge = require('merge');
var proto = require('./manager');
var registry = require('./registry');
var validator = require('validator');

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

makesure.register = registry.register;
makesure.registerSync = registry.registerSync;
makesure.registry = registry.registry;

makesure.verbose = false;

makesure.registerSync('empty', validator.isNull);
makesure.registerSync('length', validator.isLength);
makesure.registerSync('email', validator.isEmail);
