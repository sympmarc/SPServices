var path = require('path');

/**
 * Indicates that the current link is for the current page or a parent page (via an .active or .active-ancestor class)
 * @param  {String} current     The path to the current page
 * @param  {String} target      The path to the link target
 * @param  {Object} breadcrumbs An optional object with breadcrumbs from metalsmith-navigation nodes
 * @return {String}             Returns 'active' if the link is for the current page
 */
module.exports = function(current, target, breadcrumbs) {

  var className = '';

  if (!current || !target){
    return '';
  }

  // normalize and remove starting slash from path
  current = path.normalize(current).slice(0);
  target = path.normalize(target).slice(0);

  if (current === target) {
    className = 'active';
  } else if (breadcrumbs) {

    for (var key in breadcrumbs) {
      if (breadcrumbs.hasOwnProperty(key)) {
        if (breadcrumbs[key].path && path.normalize(breadcrumbs[key].path).slice(0) === target) {
          className = 'active-ancestor';
        }
      }
    }
  }

  return className;
};
