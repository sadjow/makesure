var async = require('async');
var merge = require('merge');
var util = require('util');
var registry = require('./registry');

var validation = module.exports = {};

validation.init = function(){
  this._negative = false;
  this._required = true;
  this._attrs = [];
  this._alert = 'invalid';
  this._alertTag = 'invalid';
  this._requiredMessage = 'required';
  this._requiredTag = 'required';
  this._validation = null;
  this._validationArgs = [];
  return this;
}

validation.required = function() {
  this._required = true;
  return this;
}
validation.isPresent = validation.required;

validation.notRequired = function() {
  this._required = false;
  return this;
}
validation.ifPresent = validation.notRequired;

validation.setValidation = function() {
  this._validation = arguments[0];
  this._validationArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
  return this;
}

validation.with = validation.setValidation;
validation.is = validation.setValidation;
validation.isNot = function(){
  this._negative = true;
  return this.is.apply(this, arguments);
}

validation.negative = function(){
  this._negative = true;
  return this;
}

validation.attrs = function(arg) {
  if (typeof arg == 'string') {
    this._attrs = this._attrs.concat(arg.split(' '));
  } else if (arg instanceof Array) {
    this._attrs = this._attrs.concat(arg);
  } else {
    throw('You need to pass a string or array.');
  }
  return this;
}

validation.alert = function(value) {
  this._alert = value;
  return this;
}
validation.orSay = validation.alert;

validation.tag = function(value) {
  this._alertTag = value;
  return this;
}

validation.requiredTag = function(value) {
  this._requiredTag = value;
  return this;
}

validation.execute = function(obj, callback) {
  var self = this;
  setImmediate(function(){
    var fns = [];
    for(var i = 0; i < self._attrs.length; i++) {
      var attrName = self._attrs[i];
      fns.push(function(attrName){
        return function(cb) {
          self.executeOnAttr(attrName, obj, cb);
        }
      }(attrName));
    }

    async.parallel(fns, function(err, results){
      var result = {};
      for(var i = 0; i < results.length; i++) {
        result = merge.recursive(result, results[i]);
      }
      result = (Object.keys(result).length > 0) ? result : null;
      callback(err, result);
    });
  });
}

validation.executeOnAttr = function(attrName, obj, callback) {
  if (typeof this._validation.execute == 'function') {
    this._validation(obj[attrName], function(result, obj){
      if(result) {
        var r = { error: { attrs: {} } };
        r.error.attrs[attrName] = result.error;
        callback(null, r);
      } else {
        callback(null, null);
      }

    });
  } else {
    var error = null;
    if(typeof obj[attrName] == 'undefined') {
      if(this._required) {
        error = error || {};
        error.attrs = error.attrs || {};
        error.attrs[attrName] = error.attrs[attrName] || { messages: {} };
        error.attrs[attrName].messages[this._requiredMessage] = this._requiredTag;
      }
    } else {
      var validationFunction = (typeof this._validation == 'string') ? registry.registry(this._validation) : this._validation;
      var vResult = validationFunction.apply(null, [obj[attrName]].concat(this._validationArgs));
      if(this._negative) vResult = !vResult;
      if(!vResult) {
        error = error || {};
        error.attrs = error.attrs || {};
        error.attrs[attrName] = error.attrs[attrName] || { messages: {} };
        error.attrs[attrName].messages[this._alert] = this._alertTag;
      }
    }
    callback(null, (error ? { error: error } : null));
  }
}
