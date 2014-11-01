var merge = require('merge');
var vproto = require('./validation');

var manager = module.exports = {};

function newValidation(){
  return merge(true, vproto).init();
}

/* Initialize the entire object */
manager.init = function() {
  this._validations = [];
  this._permitted = [];
}

/* Run the validations */
manager.execute = function(obj, callback) {

  var self = this;
  obj = merge(true, obj);

  process.nextTick(function(){
    obj = self.executeSanitize(obj);
    errors = self.executeValidations(obj);
    callback(null, obj);
  });
  return callback;
}

/* Permit the attributes */
manager.permit = function(arg) {
  if (typeof arg == 'string') {
    this._permitted = this._permitted.concat(arg.split(' '));
  } else if (arg instanceof Array) {
    this._permitted = this._permitted.concat(arg);
  } else {
    throw('You need to pass a string or array to permit()');
  }
  return this;
}

/* create a new validation */
manager.attrs = function() {
  var validation = newValidation();
  validation.attrs.apply(validation, arguments);
  return validation;
}
manager.attr = manager.attrs;

manager.validate = function(arg){
  var validation = newValidation();
  validation.with(arg);
  return validation;
}
manager.is = manager.validate;
manager.isNot = function(){
  return manager.is.apply(null, arguments).negative();
}

manager.executeSanitize = function(obj) {
  var _permitted = this._permitted;
  Object.keys(obj).forEach(function(key){
    if(_permitted.indexOf(key) == -1) {
      delete obj[key]
    }
  });

  return obj;
}

manager.executeValidations = function(obj) {
  var error, _validations = this._validations;
  _validations.forEach(function(validation){

  });

  return obj;
}
