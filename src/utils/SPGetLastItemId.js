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

    // Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
    // between list forms
    $.fn.SPServices.SPGetLastItemId = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The name or GUID of the list
            userAccount: "", // The account for the user in DOMAIN\username format. If not specified, the current user is used.
            CAMLQuery: "" // [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
        }, options);

        var userId;
        var lastId = 0;
        $().SPServices({
            operation: "GetUserInfo",
            webURL: opt.webURL,
            async: false,
            userLoginName: (opt.userAccount !== "") ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
            completefunc: function (xData) {
                $(xData.responseXML).find("User").each(function () {
                    userId = $(this).attr("ID");
                });
            }
        });

        // Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
        // the existing Where clause
        var camlQuery = "<Query><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += "<And>";
        }
        camlQuery += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += opt.CAMLQuery + "</And>";
        }
        camlQuery += "</Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>";

        $().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: opt.webURL,
            listName: opt.listName,
            CAMLQuery: camlQuery,
            CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
            CAMLRowLimit: 1,
            CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
            completefunc: function (xData) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    lastId = $(this).attr("ows_ID");
                });
            }
        });
        return lastId;
    }; // End $.fn.SPServices.SPGetLastItemId

    return $;

});