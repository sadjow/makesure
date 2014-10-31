var validation = module.exports = {};

validation.init = function(){
  this._negative = false;
  this._required = false;
  this._ifPresent = false;
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
