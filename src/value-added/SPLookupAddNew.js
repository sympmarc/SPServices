define([
    'jquery',
    "../utils/constants",
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

    // Function which provides a link on a Lookup column for the user to follow
    // which allows them to add a new value to the Lookup list.
    // Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
    // by Waldek Mastykarz
    $.fn.SPServices.SPLookupAddNew = function (options) {

        var opt = $.extend({}, {
            lookupColumn: "", // The display name of the Lookup column
            promptText: "Add new {0}", // Text to use as prompt + column name
            newWindow: false, // If true, the link will open in a new window *without* passing the Source.
            ContentTypeID: "", // [Optional] Pass the ContentTypeID if you'd like to specify it
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var thisFunction = "SPServices.SPLookupAddNew";

        // Find the lookup column's select (dropdown)
        var lookupSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.lookupColumn
        });
        if (lookupSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, constants.TXTColumnNotFound);
            return;
        }

        var newUrl = "";
        var lookupListUrl = "";
        var lookupColumnStaticName = "";
        // Use GetList for the current list to determine the details for the Lookup column
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: $().SPServices.SPListNameFromUrl(),
            completefunc: function (xData) {
                $(xData.responseXML).find("Field[DisplayName='" + opt.lookupColumn + "']").each(function () {
                    lookupColumnStaticName = $(this).attr("StaticName");
                    // Use GetList for the Lookup column's list to determine the list's URL
                    $().SPServices({
                        operation: "GetList",
                        async: false,
                        cacheXML: true,
                        listName: $(this).attr("List"),
                        completefunc: function (xData) {
                            $(xData.responseXML).find("List").each(function () {
                                lookupListUrl = $(this).attr("WebFullUrl");
                                // Need to handle when list is in the root site
                                lookupListUrl = lookupListUrl !== constants.SLASH ? lookupListUrl + constants.SLASH : lookupListUrl;
                            });
                        }
                    });
                    // Get the NewItem form for the Lookup column's list
                    newUrl = utils.getListFormUrl($(this).attr("List"), "NewForm");
                    // Stop looking;we're done
                    return false;
                });
            }
        });

        if (lookupListUrl.length === 0 && opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "This column does not appear to be a lookup column");
            return;
        }
        if (newUrl.length > 0) {
            // Build the link to the Lookup column's list enclosed in a div with the id="SPLookupAddNew_" + lookupColumnStaticName
            var newHref = lookupListUrl + newUrl;
            // If requested, open the link in a new window and if requested, pass the ContentTypeID
            newHref += opt.newWindow ?
            ((opt.ContentTypeID.length > 0) ? "?ContentTypeID=" + opt.ContentTypeID : "") + "' target='_blank'" :
            "?" + ((opt.ContentTypeID.length > 0) ? "ContentTypeID=" + opt.ContentTypeID + "&" : "") + "Source=" + utils.escapeUrl(location.href) + "'";
            var newLink = "<div id='SPLookupAddNew_" + lookupColumnStaticName + "'>" + "<a href='" + newHref + ">" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a></div>";
            // Append the link to the Lookup columns's formbody table cell
            $(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
        } else if (opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "NewForm cannot be found");
            return;
        }
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPLookupAddNew

    return $;

});