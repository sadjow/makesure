var merge = require('merge');
var proto = require('./manager');

exports = module.exports = makesure;

var register = {};

function makesure(fn) {
  if(typeof fn == 'undefined') throw('You should pass a function to makesure()');
  var manager = merge(true, proto);
  manager.init();
  fn.apply(manager);
  return manager.execute;
}

makesure.register = function(name, fn) {
  register[name] = fn;
}
