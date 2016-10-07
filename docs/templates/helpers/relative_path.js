var path = require('path');

/**
 * Provides a relative link for navigation.
 * See https://github.com/unstoppablecarl/metalsmith-navigation/blob/master/examples/generic/build.js
 *
 * @param {String} current  The path of the current page
 * @param {String} target   The path of the target page
 * @return {String}         The path to the target page relative to the current page
 */
module.exports = function(current, target) {
   // normalize and remove starting slash from path
   if(!current || !target){
       return '';
   }
   current = path.normalize(current).slice(0);
   target = path.normalize(target).slice(0);
   current = path.dirname(current);
   return path.relative(current, target).replace(/\\/g, '/');
};
