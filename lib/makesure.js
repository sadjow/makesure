var proto = require('./validation-node');
var mixin = require('utils-merge');
var q = require('q');

exports = module.exports = makesure;

function makesure() {
  var validationNode = {}
  mixin(validationNode, proto);

  validationNode.init();

  return validationNode;
}