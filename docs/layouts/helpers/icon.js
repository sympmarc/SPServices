var Handlebars = require('handlebars');

/**
 * Returns an HTML string with the markup needed to display a Font Awesome icon
 * @param  {String} icon The name of the icon (without the 'fa-'' prefix)
 * @return {String}      A Handlebars SafeString with the icon HTML markup
 */
module.exports = function(icon) {
   return new Handlebars.SafeString('<span class="fa fa-fw fa-' + icon + '" aria-hidden="true"></span>');
};
