exports = module.exports = {};

var _data = {};

exports.register = function(name, fn) {
  _data[name] = fn;
}

exports.registry = function(name) {
  if(typeof _data[name] == 'undefined') {
    throw("There is no function called '" + name + "' on the makesure's registry");
  } else {
    return _data[name];
  }
}
