define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    var SPServices = window.SPServices || {};

    // Function to determine the current Web's URL.  We need this for successful Ajax calls.
    // The function is also available as a public function.
    $.fn.SPServices.SPGetCurrentSite = function () {

        var currentContext = utils.SPServicesContext();

        // We've already determined the current site...
        if (currentContext.thisSite.length > 0) {
            return currentContext.thisSite;
        }

        // If we still don't know the current site, we call WebUrlFromPageUrlResult.
        var msg = SPServices.SOAPEnvelope.header +
            "<WebUrlFromPageUrl xmlns='" + constants.SCHEMASharePoint + "/soap/' ><pageUrl>" +
            ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
            "</pageUrl></WebUrlFromPageUrl>" +
            SPServices.SOAPEnvelope.footer;
        $.ajax({
            async: false, // Need this to be synchronous so we're assured of a valid value
            url: "/_vti_bin/Webs.asmx",
            type: "POST",
            data: msg,
            dataType: "xml",
            contentType: "text/xml;charset=\"utf-8\"",
            complete: function (xData) {
                currentContext.thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
            }
        });

        return currentContext.thisSite; // Return the URL

    }; // End $.fn.SPServices.SPGetCurrentSite


    return $;

});