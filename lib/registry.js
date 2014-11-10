exports = module.exports = {};

var _data = {};

exports.register = function(name, fn) {
  _data[name] = fn;
}

exports.registerSync = function(name, fn) {
  _data[name] = function() {
     var args = Array.prototype.slice.call(arguments, 0);
     var callback = args.pop(); // The makesure's validation will pass the callback on the last argument.
     callback(null, fn.apply(null, args));
  }
}

exports.registry = function(name) {
  if(typeof _data[name] == 'undefined') {
    throw("There is no function called '" + name + "' on the makesure's registry");
  } else {
    return _data[name];
  }
}
