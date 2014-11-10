module.exports = function (value) {
  if(value == null || typeof value == 'undefined') {
    return '';
  } else if (typeof value.toString != 'undefined') {
    return value.toString();
  } else {
    return value + '';
  }
}
