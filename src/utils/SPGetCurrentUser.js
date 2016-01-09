define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Function which returns the account name for the current user in DOMAIN\username format
    $.fn.SPServices.SPGetCurrentUser = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Site Collection.  If not specified, the current Web is used.
            fieldName: "Name", // Specifies which field to return from the userdisp.aspx page
            fieldNames: {}, // Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
            debug: false // If true, show error messages; if false, run silent
        }, options);

        var currentContext = utils.SPServicesContext();

        // The current user's ID is reliably available in an existing JavaScript variable
        if (opt.fieldName === "ID" && typeof currentContext.thisUserId !== "undefined") {
            return currentContext.thisUserId;
        }

        var thisField = "";
        var theseFields = {};
        var fieldCount = opt.fieldNames.length > 0 ? opt.fieldNames.length : 1;
        var thisUserDisp;
        var thisWeb = opt.webURL.length > 0 ? opt.webURL : $().SPServices.SPGetCurrentSite();

        // Get the UserDisp.aspx page using AJAX
        $.ajax({
            // Need this to be synchronous so we're assured of a valid value
            async: false,
            // Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
            // Adding the extra Query String parameter with the current date/time forces the server to view this as a new request.
            url: ((thisWeb === "/") ? "" : thisWeb) + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
            complete: function (xData) {
                thisUserDisp = xData;
            }
        });

        for (var i = 0; i < fieldCount; i++) {

            // The current user's ID is reliably available in an existing JavaScript variable
            if (opt.fieldNames[i] === "ID") {
                thisField = currentContext.thisUserId;
            } else {
                var thisTextValue;
                if (fieldCount > 1) {
                    thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldNames[i] + "\"", "gi");
                } else {
                    thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
                }
                $(thisUserDisp.responseText).find("table.ms-formtable td[id^='SPField']").each(function () {
                    if (thisTextValue.test($(this).html())) {
                        // Each fieldtype contains a different data type, as indicated by the id
                        switch ($(this).attr("id")) {
                            case "SPFieldText":
                                thisField = $(this).text();
                                break;
                            case "SPFieldNote":
                                thisField = $(this).find("div").html();
                                break;
                            case "SPFieldURL":
                                thisField = $(this).find("img").attr("src");
                                break;
                            // Just in case
                            default:
                                thisField = $(this).text();
                                break;
                        }
                        // Stop looking; we're done
                        return false;
                    }
                });
            }
            if (opt.fieldNames[i] !== "ID") {
                thisField = (typeof thisField !== "undefined") ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
            }
            if (fieldCount > 1) {
                theseFields[opt.fieldNames[i]] = thisField;
            }
        }

        return (fieldCount > 1) ? theseFields : thisField;

    }; // End $.fn.SPServices.SPGetCurrentUser

    return $;

});