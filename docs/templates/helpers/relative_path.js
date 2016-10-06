var path = require('path');

/**
 * Create Handlebars helper to generate relative links for navigation.
 * See https://github.com/unstoppablecarl/metalsmith-navigation/blob/master/examples/generic/build.js
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
