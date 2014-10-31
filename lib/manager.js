var merge = require('merge');
var vproto = require('./validation');

var manager = module.exports = {};

/* Initialize the entire object */
manager.init = function() {
  this._validations = [];
}

/* Run the validations */
manager.execute = function(obj) {

}

/* Removes the extra attributes */
manager.only = function() {

}

/* create a new validation */
manager.attrs = function() {
  var validation = merge(true, vproto);
  return validation;
}
manager.attr = manager.attrs;
manager.validate = manager.attrs;

manager.validate = function(fn){
  var validation = merge(true, vproto);
  validation.with(fn);
  return validation;
}
manager.is = manager.validate;
manager.isNot = function(){
  return manager.is.apply(null, arguments).negative();
}
