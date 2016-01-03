/**
 * SPServices main module. Simply loads all other modules. Those modules should
 * all add themselves to the jQuery object (likely $.fn namespace)... This module
 * only needs to reference those modules as dependencies.
 *
 * @namespace spservices
 *
 * @example
 *
 * require(['jquery', "src/SPServices"], function($){
 *      // $.fn.SPServices() should now be available here.
 *      // Notice how there is no need to define a second function parameter
 *      // for the `SPServices` module - that's because all SPServices methods
 *      // utilities add themselves to the jQuery namespace.
 * })
 *
 */
define([
    "jquery",
    "./utils/constants",
    "./core/SPServices.utils",
    "./core/SPServices.core",
    "./core/Version",
    "./utils/SPConvertDateToISO",
    "./utils/SPDropdownCtl",
    "./utils/SPFilterNode",
    "./utils/SPGetCurrentSite",
    "./utils/SPGetCurrentUser",
    "./utils/SPGetDisplayFromStatic",
    "./utils/SPGetLastItemId",
    "./utils/SPGetListItemsJson",
    "./utils/SPGetQueryString",
    "./utils/SPGetStaticFromDisplay",
    "./utils/SPListNameFromUrl",
    "./utils/SPXmlToJson",
    "./value-added/SPArrangeChoices",
    "./value-added/SPAutocomplete",
    "./value-added/SPCascadeDropdowns",
    "./value-added/SPComplexToSimpleDropdown",
    "./value-added/SPUpdateMultipleListItems"
], function($){
    return $;
});
