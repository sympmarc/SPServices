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

    // SPGetListItemsJson retrieves items from a list in JSON format
    $.fn.SPServices.SPGetListItemsJson = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
            listName: "",
            viewName: "",
            CAMLQuery: "",
            CAMLViewFields: "",
            CAMLRowLimit: "",
            CAMLQueryOptions: "",
            changeToken: "", // [Optional] If provided, will be passed with the request
            contains: "", // CAML snippet for an additional filter
            mapping: null, // If provided, use this mapping rather than creating one automagically from the list schema
            mappingOverrides: null, // Pass in specific column overrides here
            debug: false // If true, show error messages;if false, run silent
        }, $().SPServices.defaults, options);

        var newChangeToken;
        var thisListJsonMapping = {};
        var deletedIds = [];
        var result = $.Deferred();

        // Call GetListItems to find all of the items matching the CAMLQuery
        var thisData = $().SPServices({
            operation: "GetListItemChangesSinceToken",
            webURL: opt.webURL,
            listName: opt.listName,
            viewName: opt.viewName,
            CAMLQuery: opt.CAMLQuery,
            CAMLViewFields: opt.CAMLViewFields,
            CAMLRowLimit: opt.CAMLRowLimit,
            CAMLQueryOptions: opt.CAMLQueryOptions,
            changeToken: opt.changeToken,
            contains: opt.contains
        });

        thisData.then(function () {

            var mappingKey = "SPGetListItemsJson" + opt.webURL + opt.listName;

            // We're going to use this multiple times
            var responseXml = $(thisData.responseXML);

            // Get the changeToken
            newChangeToken = responseXml.find("Changes").attr("LastChangeToken");

            // Some of the existing items may have been deleted
            responseXml.find("listitems Changes Id[ChangeType='Delete']").each(function () {
                deletedIds.push($(this).text());
            });

            if (opt.mapping === null) {
                // Automagically create the mapping
                responseXml.find("List > Fields > Field").each(function () {
                    var thisField = $(this);
                    var thisType = thisField.attr("Type");
                    // Only work with known column types
                    if ($.inArray(thisType, constants.spListFieldTypes) >= 0) {
                        thisListJsonMapping["ows_" + thisField.attr("Name")] = {
                            mappedName: thisField.attr("Name"),
                            objectType: thisField.attr("Type")
                        };
                    }

                });

            } else {
                thisListJsonMapping = opt.mapping;
            }

            // Implement any mappingOverrides
            // Example: { ows_JSONTextColumn: { mappedName: "JTC", objectType: "JSON" } }
            if (opt.mappingOverrides !== null) {
                // For each mappingOverride, override the list schema
                for (var mapping in opt.mappingOverrides) {
                    thisListJsonMapping[mapping] = opt.mappingOverrides[mapping];
                }
            }

            // If we haven't retrieved the list schema in this call, try to grab it from the saved data from a prior call
            if ($.isEmptyObject(thisListJsonMapping)) {
                thisListJsonMapping = $(document).data(mappingKey);
            } else {
                $(document).data(mappingKey, thisListJsonMapping);
            }

            var jsonData = responseXml.SPFilterNode("z:row").SPXmlToJson({
                mapping: thisListJsonMapping,
                sparse: true
            });

            var thisResult = {
                changeToken: newChangeToken,
                mapping: thisListJsonMapping,
                data: jsonData,
                deletedIds: deletedIds
            };

            result.resolveWith(thisResult);

        },
        function (err) { 
            result.rejectWith(err);
        });

        return result.promise();

    }; // End $.fn.SPServices.SPGetListItemsJson

    return $;

});
