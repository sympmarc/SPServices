/**
 * SPServices main module. Simply loads all other modules. Those modules should
 * all add themselves to the jQuery object (likely $.fn namespace)... This modules
 * only needs to reference those modules as dependencies.
 *
 * @namespace spservices
 */
define([
    "jquery",
    "./core/SPServices.core"
], function($){
    return $;
});
