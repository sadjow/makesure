var proto = require('./node');
var merge = require('merge');

exports = module.exports = makesure;

function makesure() {
  var validationNode = {}
  merge(validationNode, proto);

  validationNode.init();

  return validationNode;
}