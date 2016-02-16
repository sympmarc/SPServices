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

    // Function to display related information when an option is selected on a form.
    $.fn.SPServices.SPDisplayRelatedInfo = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            columnName: "", // The display name of the column in the form
            relatedWebURL: "", // [Optional] The name of the Web (site) which contains the related list
            relatedList: "", // The name of the list which contains the additional information
            relatedListColumn: "", // The internal name of the related column in the related list
            relatedColumns: [], // An array of related columns to display
            displayFormat: "table", // The format to use in displaying the related information.  Possible values are: [table, list, none]
            headerCSSClass: "ms-vh2", // CSS class for the table headers
            rowCSSClass: "ms-vb", // CSS class for the table rows
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be <And>ed with the default query on the relatedList
            numChars: 0, // If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered
            matchType: "Eq", // If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith"
            matchOnId: false, // By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var i;
        var relatedColumnsXML = [];
        var relatedListXML;
        var thisFunction = "SPServices.SPDisplayRelatedInfo";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // Get information about the related list and its columns
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: opt.relatedWebURL,
            listName: opt.relatedList,
            completefunc: function (xData) {
                // If debug is on, notify about an error
                $(xData.responseXML).find("faultcode").each(function () {
                    if (opt.debug) {
                        utils.errBox(thisFunction, "relatedList: " + opt.relatedList, "List not found");

                    }
                });
                // Get info about the related list
                relatedListXML = $(xData.responseXML).find("List");
                // Save the information about each column requested
                for (i = 0; i < opt.relatedColumns.length; i++) {
                    relatedColumnsXML[opt.relatedColumns[i]] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedColumns[i] + "']");
                }
                relatedColumnsXML[opt.relatedListColumn] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedListColumn + "']");
            }
        });

        switch (columnSelect.Type) {
            // Plain old select
            case constants.dropdownType.simple:
                columnSelect.Obj.bind("change", function () {
                    showRelated(opt, relatedListXML, relatedColumnsXML);
                });
                break;
            // Input / Select hybrid
            case constants.dropdownType.complex:
                // Bind to any change on the hidden input element
                columnSelect.optHid.bind("propertychange", function () {
                    showRelated(opt, relatedListXML, relatedColumnsXML);
                });
                break;
            // Multi-select hybrid
            case constants.dropdownType.multiSelect:
                if (opt.debug) {
                    utils.errBox(thisFunction, "columnName: " + opt.columnName, "Multi-select columns not supported by this function");
                }
                break;
            default:
                break;
        }
        // Fire the change to set the initially allowable values
        showRelated(opt, relatedListXML, relatedColumnsXML);

    }; // End $.fn.SPServices.SPDisplayRelatedInfo

    function showRelated(opt, relatedListXML, relatedColumnsXML) {

        var i;
        var columnSelectSelected;
        var thisFunction = "SPServices.SPDisplayRelatedInfo";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });

        // Get the current column selection(s)
        columnSelectSelected = utils.getDropdownSelected(columnSelect, opt.matchOnId);
        if (columnSelect.Type === constants.dropdownType.complex && opt.numChars > 0 && columnSelectSelected[0].length < opt.numChars) {
            return;
        }

        // If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
        // the number of Web Service calls when the parentSelect.Type = constants.dropdownType.complex, as there are multiple propertychanges
        // which don't require any action.
        if (columnSelect.Obj.attr("showRelatedSelected") === columnSelectSelected[0]) {
            return;
        }
        columnSelect.Obj.attr("showRelatedSelected", columnSelectSelected[0]);

        if(opt.displayFormat !== "none") {
            // Generate a unique id for the container
            var divId = utils.genContainerId("SPDisplayRelatedInfo", opt.columnName, opt.listName);
            // Remove the old container...
            $("#" + divId).remove();
            // ...and append a new, empty one
            columnSelect.Obj.parent().append("<div id=" + divId + "></div>");
        }

        // Get the list items which match the current selection
        var camlQuery = "<Query><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += "<And>";
        }

        // Need to handle Lookup columns differently than static columns
        var relatedListColumnType = relatedColumnsXML[opt.relatedListColumn].attr("Type");
        if (relatedListColumnType === "Lookup") {
            camlQuery += "<Eq><FieldRef Name='" + opt.relatedListColumn +
                (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                utils.escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";
        } else {
            camlQuery += "<Eq><FieldRef Name='" +
                (opt.matchOnId ? "ID' /><Value Type='Counter'>" : opt.relatedListColumn + "'/><Value Type='Text'>") +
                utils.escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";
        }

        if (opt.CAMLQuery.length > 0) {
            camlQuery += opt.CAMLQuery + "</And>";
        }
        camlQuery += "</Where></Query>";

        var viewFields = " ";
        for (i = 0; i < opt.relatedColumns.length; i++) {
            viewFields += "<FieldRef Name='" + opt.relatedColumns[i] + "' />";
        }

        $().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: opt.relatedWebURL,
            listName: opt.relatedList,
            // Filter based on the column's currently selected value
            CAMLQuery: camlQuery,
            CAMLViewFields: "<ViewFields>" + viewFields + "</ViewFields>",
            // Override the default view rowlimit and get all appropriate rows
            CAMLRowLimit: 0,
            completefunc: function (xData) {

                // Handle errors
                $(xData.responseXML).find("errorstring").each(function () {
                    var errorText = $(this).text();
                    if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                        utils.errBox(thisFunction,
                            "relatedListColumn: " + opt.relatedListColumn,
                            "Column not found in relatedList " + opt.relatedList);
                    } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                        utils.errBox(thisFunction,
                            "relatedList: " + opt.relatedList,
                            "List not found");
                    }

                });

                var outString;
                // Output each row
                switch (opt.displayFormat) {
                    // Only implementing the table format in the first iteration (v0.2.9)
                    case "table":
                        outString = "<table>";
                        outString += "<tr>";
                        for (i = 0; i < opt.relatedColumns.length; i++) {
                            if (typeof relatedColumnsXML[opt.relatedColumns[i]] === "undefined" && opt.debug) {
                                utils.errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList");
                                return;
                            }
                            outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[opt.relatedColumns[i]].attr("DisplayName") + "</th>";
                        }
                        outString += "</tr>";
                        // Add an option for each child item
                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                            outString += "<tr>";
                            for (i = 0; i < opt.relatedColumns.length; i++) {
                                outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[opt.relatedColumns[i]], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
                            }
                            outString += "</tr>";
                        });
                        outString += "</table>";
                        break;
                    // list format implemented in v0.5.0. Still table-based, but vertical orientation.
                    case "list":
                        outString = "<table>";
                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                            for (i = 0; i < opt.relatedColumns.length; i++) {
                                if (typeof relatedColumnsXML[opt.relatedColumns[i]] === "undefined" && opt.debug) {
                                    utils.errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList");
                                    return;
                                }
                                outString += "<tr>";
                                outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[opt.relatedColumns[i]].attr("DisplayName") + "</th>";
                                outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[opt.relatedColumns[i]], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
                                outString += "</tr>";
                            }
                        });
                        outString += "</table>";
                        break;
                    case "none":
                        break;
                    default:
                        break;
                }
                // Write out the results
                if(opt.displayFormat !== "none") {
                    $("#" + divId).html(outString);
                }

                // If present, call completefunc when all else is done
                if (opt.completefunc !== null) {
                    opt.completefunc(xData);
                }

            }
        });
    } // End showRelated

    // Display a column (field) formatted correctly based on its definition in the list.
    // NOTE: Currently not dealing with locale differences.
    //   columnXML          The XML node for the column from a GetList operation
    //   columnValue        The text representation of the column's value
    //   opt                The current set of options
    function showColumn(listXML, columnXML, columnValue, opt) {

        if (typeof columnValue === "undefined") {
            return "";
        }

        var i;
        var outString = "";
        var fileName = "";
        var dispUrl;
        var numDecimals;
        var outArray = [];
        var webUrl = opt.relatedWebURL.length > 0 ? opt.relatedWebURL : $().SPServices.SPGetCurrentSite();







        switch (columnXML.attr("Type")) {
            case "Text":
                outString = columnValue;
                break;
            case "URL":
                switch (columnXML.attr("Format")) {
                    // URL as hyperlink
                    case "Hyperlink":
                        outString = "<a href='" + columnValue.substring(0, columnValue.search(",")) + "'>" +
                            columnValue.substring(columnValue.search(",") + 1) + "</a>";
                        break;
                    // URL as image
                    case "Image":
                        outString = "<img alt='" + columnValue.substring(columnValue.search(",") + 1) +
                            "' src='" + columnValue.substring(0, columnValue.search(",")) + "'/>";
                        break;
                    // Just in case
                    default:
                        outString = columnValue;
                        break;
                }
                break;
            case "User":
            case "UserMulti":
                var userMultiValues = columnValue.split(constants.spDelim);
                for (i = 0; i < userMultiValues.length; i = i + 2) {
                    outArray.push("<a href='/_layouts/userdisp.aspx?ID=" + userMultiValues[i] +
                        "&Source=" + utils.escapeUrl(location.href) + "'>" +
                        userMultiValues[i + 1] + "</a>");
                }
                outString = outArray.join(", ");
                break;
            case "Calculated":
                var calcColumn = columnValue.split(constants.spDelim);
                outString = calcColumn[1];
                break;
            case "Number":
                numDecimals = columnXML.attr("Decimals");
                outString = typeof numDecimals === "undefined" ?
                    parseFloat(columnValue).toString() :
                    parseFloat(columnValue).toFixed(numDecimals).toString();
                break;
            case "Currency":
                numDecimals = columnXML.attr("Decimals");
                outString = typeof numDecimals === "undefined" ?
                    parseFloat(columnValue).toFixed(2).toString() :
                    parseFloat(columnValue).toFixed(numDecimals).toString();
                break;
            case "Lookup":
                switch (columnXML.attr("Name")) {
                    case "FileRef":
                        // Get the display form URL for the lookup source list
                        dispUrl = listXML.attr("BaseType") === "1" ? listXML.attr("RootFolder") + constants.SLASH + "Forms/DispForm.aspx" :
                        listXML.attr("RootFolder") + constants.SLASH + "DispForm.aspx";
                        outString = "<a href='" + dispUrl +
                            "?ID=" + columnValue.substring(0, columnValue.search(constants.spDelim)) + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                    case "FileDirRef":
                        // Get the display form URL for the lookup source list
                        dispUrl = constants.SLASH + columnValue.substring(columnValue.search(constants.spDelim) + 2);
                        outString = "<a href='" + dispUrl + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                    // Any other lookup column
                    default:
                        // Get the display form URL for the lookup source list
                        dispUrl = utils.getListFormUrl(columnXML.attr("List"), "DisplayForm");
                        outString = "<a href='" + opt.relatedWebURL + constants.SLASH + dispUrl +
                            "?ID=" + columnValue.substring(0, columnValue.search(constants.spDelim)) + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                }
                break;
            case "LookupMulti":
                // Get the display form URL for the lookup source list
                dispUrl = utils.getListFormUrl(columnXML.attr("List"), "DisplayForm");
                // Show all the values as links to the items, separated by commas
                outString = "";
                if (columnValue.length > 0) {
                    var lookupMultiValues = columnValue.split(constants.spDelim);
                    for (i = 0; i < lookupMultiValues.length / 2; i++) {
                        outArray.push("<a href='" + webUrl + constants.SLASH + dispUrl +
                            "?ID=" + lookupMultiValues[i * 2] + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            lookupMultiValues[(i * 2) + 1] + "</a>");
                    }
                }
                outString = outArray.join(", ");
                break;
            case "File":
                fileName = columnValue.substring(columnValue.search(constants.spDelim) + 2);
                outString = "<a href='" + listXML.attr("RootFolder") + constants.SLASH + fileName + "'>" + fileName + "</a>";
                break;
            case "Counter":
                outString = columnValue;
                break;
            case "DateTime":
                outString = columnValue;
                break;
            default:
                outString = columnValue;
                break;
        }
        return outString;
    } // End of function showColumn

    return $;

});