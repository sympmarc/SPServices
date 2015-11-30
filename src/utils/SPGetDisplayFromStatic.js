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

    // This function returns the DisplayName for a column based on the StaticName.
    $.fn.SPServices.SPGetDisplayFromStatic = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The name or GUID of the list
            columnStaticName: "", // StaticName of the column
            columnStaticNames: {} // StaticName of the columns - added in v0.7.2 to allow multiple columns
        }, options);

        var displayName = "";
        var displayNames = {};
        var nameCount = opt.columnStaticNames.length > 0 ? opt.columnStaticNames.length : 1;

        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: opt.webURL,
            listName: opt.listName,
            completefunc: function (xData) {
                if (nameCount > 1) {
                    for (var i = 0; i < nameCount; i++) {
                        displayNames[opt.columnStaticNames[i]] = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticNames[i] + "']").attr("DisplayName");
                    }
                } else {
                    displayName = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticName + "']").attr("DisplayName");
                }
            }
        });

        return (nameCount > 1) ? displayNames : displayName;

    }; // End $.fn.SPServices.SPGetDisplayFromStatic

    return $;

});