var path = require('path');

module.exports = function(current, target) {
   // normalize and remove starting slash from path
   if(!current || !target){
       return '';
   }
   current = path.normalize(current).slice(0);
   target = path.normalize(target).slice(0);
   return current === target ? 'active' : '';
};
