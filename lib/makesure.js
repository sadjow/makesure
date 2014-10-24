var proto = require('./validation-node');
var mixin = require('utils-merge');

exports = module.exports = makesure;

function makesure() {
  var validationNode = proto.validate;

  mixin(validationNode, proto);

  validationNode.init();

  return validationNode;
}