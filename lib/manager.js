var merge = require('merge');
var vproto = require('./validation');
var async = require('async');
var util = require('util');

var manager = module.exports = {};

function newValidation(){
  return merge.recursive(true, vproto).init();
}

/* Initialize the entire object */
manager.init = function() {
  this._validations = [];
  this._sanitizers = {};
  this._permitted = [];
  this._alert = null;
}

/* Run the validations */
manager.execute = function(obj, callback) {
  var self = this;
  obj = merge(true, obj);

  setImmediate(function(){
    obj = self.executeSanitize(obj);
    self.executeValidations(obj, function(err, result){
      callback(result, obj);
    });
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
  this._validations.push(validation);
  return validation;
}
manager.attr = manager.attrs;

manager.validate = function(validationFunc){
  var validation = newValidation();
  validation.setValidation(validationFunc);
  this._validations.push(validation);
  return validation;
}
manager.is = manager.validate;
manager.isNot = function(){
  return manager.is.apply(this, arguments).negative();
}

manager.sanitize = function(attr, func) {
  this._sanitizers[attr] = this._sanitizers[attr] || []
  this._sanitizers[attr].push(func);
}

manager.alert = function(arg) {
  this._alert = arg;
  return this;
}

manager.executeSanitize = function(obj) {
  var _permitted = this._permitted;
  var _sanitizers = this._sanitizers;
  if(_permitted.length > 0) {
    Object.keys(obj).forEach(function(key){
      if(_permitted.indexOf(key) == -1) {
        delete obj[key]
      }
    });
  }

  Object.keys(_sanitizers).forEach(function(attr){
    if (typeof obj[attr] != 'undefined') {
      _sanitizers[attr].forEach(function(sanitizeFunc){
        obj[attr] = sanitizeFunc(obj[attr]);
      });
    }
  });

  return obj;
}

manager.executeValidations = function(obj, callback) {
  var fns = [];
  for(var i = 0; i < this._validations.length; i++) {
    fns.push(function(obj, v){
      v = merge(true, v);
      return function(cb) {
        v.execute(obj, cb);
      }
    }(obj, this._validations[i]));
  }

  async.parallel(fns, function(err, results) {
    var result = {};
    for(var i = 0; i < results.length; i++) {
      result = merge.recursive(result, results[i]);
    }
    result = (Object.keys(result).length > 0) ? result : null;
    callback(err, result);
  });

  return obj;
}
