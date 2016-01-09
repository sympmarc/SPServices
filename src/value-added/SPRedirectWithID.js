define([
    'jquery',
   //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $
) {

    "use strict";

    // This function allows you to redirect to a another page from a new item form with the new
    // item's ID. This allows chaining of forms from item creation onward.
    $.fn.SPServices.SPRedirectWithID = function (options) {

        var opt = $.extend({}, {
            redirectUrl: "", // Page for the redirect
            qsParamName: "ID" // In some cases, you may want to pass the newly created item's ID with a different
            // parameter name than ID. Specify that name here, if needed.
        }, options);

        var thisList = $().SPServices.SPListNameFromUrl();
        var queryStringVals = $().SPServices.SPGetQueryString();
        var lastID = queryStringVals.ID;
        var QSList = queryStringVals.List;
        var QSRootFolder = queryStringVals.RootFolder;
        var QSContentTypeId = queryStringVals.ContentTypeId;

        // On first load, change the form actions to redirect back to this page with the current lastID for this user and the
        // original Source.
        if (typeof queryStringVals.ID === "undefined") {
            lastID = $().SPServices.SPGetLastItemId({
                listName: thisList
            });
            $("form[id='aspnetForm']").each(function () {
                // This page...
                var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
                // ... plus the Source if it exists
                var thisSource = (typeof queryStringVals.Source === "string") ?
                "Source=" + queryStringVals.Source.replace(/\//g, "%2f").replace(/:/g, "%3a") : "";

                var newQS = [];
                if (typeof QSList !== "undefined") {
                    newQS.push("List=" + QSList);
                }
                if (typeof QSRootFolder !== "undefined") {
                    newQS.push("RootFolder=" + QSRootFolder);
                }
                if (typeof QSContentTypeId !== "undefined") {
                    newQS.push("ContentTypeId=" + QSContentTypeId);
                }

                var newAction = thisUrl +
                    ((newQS.length > 0) ? ("?" + newQS.join("&") + "&") : "?") +
                        // Set the Source to point back to this page with the lastID this user has added
                    "Source=" + thisUrl +
                    "?ID=" + lastID +
                        // Pass the original source as RealSource, if present
                    ((thisSource.length > 0) ? ("%26RealSource=" + queryStringVals.Source) : "") +
                        // Pass the override RedirectURL, if present
                    ((typeof queryStringVals.RedirectURL === "string") ? ("%26RedirectURL=" + queryStringVals.RedirectURL) : "");

                // Set the new form action
                setTimeout(function() {
                    document.forms.aspnetForm.action = newAction;
                }, 0);
            });
            // If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
            // then do the redirect to redirectUrl with the new lastID, passing along the original Source.
        } else {
            while (queryStringVals.ID === lastID) {
                lastID = $().SPServices.SPGetLastItemId({
                    listName: thisList
                });
            }
            // If there is a RedirectURL parameter on the Query String, then redirect there instead of the value
            // specified in the options (opt.redirectUrl)
            var thisRedirectUrl = (typeof queryStringVals.RedirectURL === "string") ? queryStringVals.RedirectURL : opt.redirectUrl;
            location.href = thisRedirectUrl + "?" + opt.qsParamName + "=" + lastID +
                ((typeof queryStringVals.RealSource === "string") ? ("&Source=" + queryStringVals.RealSource) : "");
        }
    }; // End $.fn.SPServices.SPRedirectWithID

    return $;

});