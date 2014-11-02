var validation = module.exports = {};

validation.init = function(){
  this._negative = false;
  this._required = false;
  this._ifPresent = false;
  this._attrs = [];
  this._alert = 'invalid';
  this._validation = null;
  return this;
}

validation.is = function() {
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
    self._attrs.forEach(function(attrName){
      if(typeof obj[attrName] == 'undefined') {
        if(self._required) {
          error.attrs[attrName] = error.attrs[attrName] || { messages: [] };
          error.attrs[attrName].messages.push(self._alert);
        }
      }
    });
  });
}
