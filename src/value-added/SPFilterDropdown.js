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

    /* jshint undef: true */
    /* global GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */

    // Function to filter a lookup based dropdown
    $.fn.SPServices.SPFilterDropdown = function (options) {

        var opt = $.extend({}, {
            relationshipWebURL: "", // [Optional] The name of the Web (site) which contains the relationshipList
            relationshipList: "", // The name of the list which contains the lookup values
            relationshipListColumn: "", // The internal name of the column in the relationship list
            relationshipListSortColumn: "", // [Optional] If specified, sort the options in the dropdown by this column,
            // otherwise the options are sorted by relationshipListColumn
            relationshipListSortAscending: true, // [Optional] By default, the sort is ascending. If false, descending
            columnName: "", // The display name of the column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            promptText: "", // [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of columnName. IOrignal value "Choose {0}..."
            noneText: "(None)", // [Optional] Text to use for the (None) selection. Provided for non-English language support.
            CAMLQuery: "", // This CAML fragment will be applied to the relationshipList
            CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><ViewAttributes Scope='RecursiveAll'/></QueryOptions>", // Need this to mirror SharePoint's behavior, but it can be overridden
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages; if false, run silent
        }, options);

        var choices = "";
        var columnSelectSelected = null;
        var newMultiLookupPickerdata;
        var columnColumnRequired;
        var thisFunction = "SPServices.SPFilterDropdown";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // Get the current column selection(s)
        columnSelectSelected = utils.getDropdownSelected(columnSelect, true);

        // Get the relationshipList items which match the current selection
        var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListColumn;
        var sortOrder = (opt.relationshipListSortAscending === true) ? "" : "Ascending='FALSE'";
        var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "' " + sortOrder + "/></OrderBy><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += opt.CAMLQuery;
        }
        camlQuery += "</Where></Query>";

        // Get information about columnName from the current list
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName,
            completefunc: function (xData) {
                $(xData.responseXML).find("Fields").each(function () {
                    $(this).find("Field[DisplayName='" + opt.columnName + "']").each(function () {
                        // Determine whether columnName is Required
                        columnColumnRequired = ($(this).attr("Required") === "TRUE");
                        // Stop looking; we're done
                        return false;
                    });
                });
            }
        });

        $().SPServices({
            operation: "GetListItems",
            // Force sync so that we have the right values for the column onchange trigger
            async: false,
            webURL: opt.relationshipWebURL,
            listName: opt.relationshipList,
            // Filter based on the specified CAML
            CAMLQuery: camlQuery,
            // Only get the columnName's data (plus columns we can't prevent)
            CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListColumn + "' /></ViewFields>",
            // Override the default view rowlimit and get all appropriate rows
            CAMLRowLimit: 0,
            // Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
            CAMLQueryOptions: opt.CAMLQueryOptions,
            completefunc: function (xData) {

                // Handle errors
                $(xData.responseXML).find("errorstring").each(function () {
                    var errorText = $(this).text();
                    if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                        utils.errBox(thisFunction,
                            "relationshipListColumn: " + opt.relationshipListColumn,
                            "Not found in relationshipList " + opt.relationshipList);
                    } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                        utils.errBox(thisFunction,
                            "relationshipList: " + opt.relationshipList,
                            "List not found");
                    }

                });

                // Add an explanatory prompt
                switch (columnSelect.Type) {
                    case constants.dropdownType.simple:
                        // Remove all of the existing options
                        $(columnSelect.Obj).find("option").remove();
                        // If the column is required or the promptText option is empty, don't add the prompt text
                        if (!columnColumnRequired && (opt.promptText.length > 0)) {
                            columnSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.columnName) + "</option>");
                        } else if (!columnColumnRequired) {
                            columnSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
                        }
                        break;
                    case constants.dropdownType.complex:
                        // If the column is required, don't add the "(None)" option
                        choices = columnColumnRequired ? "" : opt.noneText + "|0";
                        columnSelect.Obj.val("");
                        break;
                    case constants.dropdownType.multiSelect:
                        // Remove all of the existing options
                        $(columnSelect.master.candidateControl).find("option").remove();
                        newMultiLookupPickerdata = "";
                        break;
                    default:
                        break;
                }

                // Add an option for each item
                $(xData.responseXML).SPFilterNode("z:row").each(function () {

                    var thisOption = {};

                    // If relationshipListColumn is a Lookup column, then the ID should be for the Lookup value,
                    // else the ID of the relationshipList item
                    var thisValue = $(this).attr("ows_" + opt.relationshipListColumn);

                    if (typeof thisValue !== "undefined" && thisValue.indexOf(constants.spDelim) > 0) {
                        thisOption = new utils.SplitIndex(thisValue);
                    } else {
                        thisOption.id = $(this).attr("ows_ID");
                        thisOption.value = thisValue;
                    }

                    // If the relationshipListColumn is a calculated column, then the value isn't preceded by the ID,
                    // but by the datatype.  In this case, thisOption.id should be the ID of the relationshipList item.
                    // e.g., float;#12345.67
                    if (isNaN(thisOption.id)) {
                        thisOption.id = $(this).attr("ows_ID");
                    }

                    switch (columnSelect.Type) {
                        case constants.dropdownType.simple:
                            var selected = ($(this).attr("ows_ID") === columnSelectSelected[0]) ? " selected='selected'" : "";
                            columnSelect.Obj.append("<option" + selected + " value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                            break;
                        case constants.dropdownType.complex:
                            if (thisOption.id === columnSelectSelected[0]) {
                                columnSelect.Obj.val(thisOption.value);
                            }
                            choices = choices + ((choices.length > 0) ? "|" : "") + thisOption.value + "|" + thisOption.id;
                            break;
                        case constants.dropdownType.multiSelect:
                            $(columnSelect.master.candidateControl).append("<option value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                            newMultiLookupPickerdata += thisOption.id + "|t" + thisOption.value + "|t |t |t";
                            break;
                        default:
                            break;
                    }
                });

                switch (columnSelect.Type) {
                    case constants.dropdownType.simple:
                        columnSelect.Obj.trigger("change");
                        break;
                    case constants.dropdownType.complex:
                        columnSelect.Obj.attr("choices", choices);
                        columnSelect.Obj.trigger("propertychange");
                        break;
                    case constants.dropdownType.multiSelect:
                        // Clear the master
                        columnSelect.master.data = "";

                        columnSelect.MultiLookupPickerdata.val(newMultiLookupPickerdata);
                        // Clear any prior selections that are no longer valid
                        $(columnSelect.master.resultControl).find("option").each(function () {
                            var thisSelected = $(this);
                            $(this).attr("selected", "selected");
                            $(columnSelect.master.candidateControl).find("option").each(function () {
                                if ($(this).html() === thisSelected.html()) {
                                    thisSelected.removeAttr("selected");
                                }
                            });
                        });
                        GipRemoveSelectedItems(columnSelect.master);
                        // Hide any options in the candidate list which are already selected
                        $(columnSelect.master.candidateControl).find("option").each(function () {
                            var thisSelected = $(this);
                            $(columnSelect.master.resultControl).find("option").each(function () {
                                if ($(this).html() === thisSelected.html()) {
                                    thisSelected.remove();
                                }
                            });
                        });
                        GipAddSelectedItems(columnSelect.master);
                        // Set master.data to the newly allowable values
                        columnSelect.master.data = GipGetGroupData(newMultiLookupPickerdata);

                        // Trigger a dblclick so that the child will be cascaded if it is a multiselect.
                        $(columnSelect.master.candidateControl).trigger("dblclick");

                        break;
                    default:
                        break;
                }
            }
        });
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPFilterDropdown

    return $;

});