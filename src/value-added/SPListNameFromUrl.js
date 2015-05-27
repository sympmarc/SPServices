define([
    'jquery',
    '../utils/SPServices.utils',
    "../utils/constants",
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils,
    constants
) {
    // Get the current list's GUID (ID) from the current URL.  Use of this function only makes sense if we're in a list's context,
    // and we assume that we are calling it from an aspx page which is a form or view for the list.
    $.fn.SPServices.SPListNameFromUrl = function (options) {

        var opt = $.extend({}, {
            listName: "" // [Optional] Pass in the name or GUID of a list if you are not in its context. e.g., on a Web Part pages in the Pages library
        }, options);

        // Has the list name or GUID been passed in?
        if (opt.listName.length > 0) {
            utils.currentContext.thisList = opt.listName;
            return utils.currentContext.thisList;
            // Do we already know the current list?
        } else if (utils.currentContext.thisList !== undefined && utils.currentContext.thisList.length > 0) {
            return utils.currentContext.thisList;
        }

        // Parse out the list's root URL from the current location or the passed url
        var thisPage = location.href;
        var thisPageBaseName = thisPage.substring(0, thisPage.indexOf(".aspx"));
        var listPath = decodeURIComponent(thisPageBaseName.substring(0, thisPageBaseName.lastIndexOf(constants.SLASH) + 1)).toUpperCase();

        // Call GetListCollection and loop through the results to find a match with the list's URL to get the list's GUID
        $().SPServices({
            operation: "GetListCollection",
            async: false,
            completefunc: function (xData) {
                $(xData.responseXML).find("List").each(function () {
                    var defaultViewUrl = $(this).attr("DefaultViewUrl");
                    var listCollList = defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(constants.SLASH) + 1).toUpperCase();
                    if (listPath.indexOf(listCollList) > 0) {
                        utils.currentContext.thisList = $(this).attr("ID");
                        return false;
                    }
                });
            }
        });

        // Return the list GUID (ID)
        return utils.currentContext.thisList;

    }; // End $.fn.SPServices.SPListNameFromUrl

    return $;

});