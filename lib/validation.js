var validation = module.exports = {};

validation.init = function(){
  this._negative = false;
  this._required = false;
  this._ifPresent = false;
  this._attrs = [];
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
