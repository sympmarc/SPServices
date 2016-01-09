define([
    'jquery',
    '../utils/constants',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants
) {

    "use strict";

    // Return the current version of SPServices as a string
    $.fn.SPServices.Version = function () {

        return constants.VERSION;

    }; // End $.fn.SPServices.Version

    return $;

});