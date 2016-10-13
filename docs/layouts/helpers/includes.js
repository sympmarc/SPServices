/**
 * Returns true if an array includes a value provided
 * @param  {Array} array   The array to check
 * @param  {String} item   The item to check for
 * @return {Boolean}       Returns true if the item is in the array
 */
module.exports = function(array, item) {
  if (!array || !item) {
    return false;
  }
  return array.indexOf(item) !== -1 ? true : false;
};
