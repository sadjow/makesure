var proto = require('./node');
var mixin = require('utils-merge');

exports = module.exports = makesure;

function makesure() {
  var validationNode = {}
  mixin(validationNode, proto);

  validationNode.init();

  return validationNode;
}