var path = require('path');

/**
 * Indicates that the current link is for the current page (via an .active class)
 * @param  {String} current     The path to the current page
 * @param  {String} target      The path to the link target
 * @return {String}             Returns 'active' if the link is for the current page
 */
module.exports = function(current, target) {

  var className = '';

  if (!current || !target){
    return '';
  }

  // normalize and remove starting slash from path
  current = path.normalize(current).slice(0);
  target = path.normalize(target).slice(0);

  if (current === target) {
    className = 'active';
  }

  return className;
};
