_ = require('underscore');
var proto = require('./validation');
var mixin = require('utils-merge');

exports = module.exports = createValidation;

function createValidation(ctx) {
  var validation = function() {

  };

  mixin(validation, proto);

  validation.init(ctx);
  return validation;
}