var validation = module.exports = {};

validation.init = function(){
  this._negative = false;
  this._required = false;
  this._ifPresent = false;
  this._attrs = [];
  this._alert = 'invalid';
  this._requiredMessage = 'required';
  this._validation = null;
  return this;
}

validation.isNot = function() {
  this._negative = true;
  return this;
}

validation.isPresent = function() {
  this._required = true;
  return this;
}

validation.ifPresent = function() {
  this._ifPresent = true;
  return this;
}

validation.with = function(validation) {
  this._validation = validation;
  return this;
}
validation.is = validation.with;
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

validation.execute = function(obj, callback) {
  self = this;
  var error = {};
  setImmediate(function(){

    for(var i = 0; i < self._attrs.length; i++){
      var attrName = self._attrs[i];
      if(typeof obj[attrName] == 'undefined') {
        if(self._required) {
          error.attrs = error.attrs || {};
          error.attrs[attrName] = error.attrs[attrName] || { messages: [] };
          error.attrs[attrName].messages.push(self._requiredMessage);
        }
      } else {
        var vResult = self._validation(obj[attrName]);
        if(self._negative) vResult = !vResult;
        if(!vResult) {
          error.attrs = error.attrs || {};
          error.attrs[attrName] = error.attrs[attrName] || { messages: [] };
          error.attrs[attrName].messages.push(self._alert);
        }
      }
    }
    callback(null, { error: error });
  });
}
