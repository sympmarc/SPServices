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

    // Function to set up cascading dropdowns on a SharePoint form
    // (Newform.aspx, EditForm.aspx, or any other customized form.)
    $.fn.SPServices.SPCascadeDropdowns = function (options) {

        var opt = $.extend({}, {
            relationshipWebURL: "", // [Optional] The name of the Web (site) which contains the relationships list
            relationshipList: "", // The name of the list which contains the parent/child relationships
            relationshipListParentColumn: "", // The internal name of the parent column in the relationship list
            relationshipListChildColumn: "", // The internal name of the child column in the relationship list
            relationshipListSortColumn: "", // [Optional] If specified, sort the options in the dropdown by this column,
            // otherwise the options are sorted by relationshipListChildColumn
            parentColumn: "", // The display name of the parent column in the form
            childColumn: "", // The display name of the child column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList
            CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>", // [Optional] For power users, ability to specify Query Options
            promptText: "", // [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. Original value "Choose {0}..."
            noneText: "(None)", // [Optional] Text to use for the (None) selection. Provided for non-English language support.
            simpleChild: false, // [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown
            selectSingleOption: false, // [Optional] If set to true and there is only a single child option, select it
            matchOnId: false, // By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);


        var thisParentSetUp = false;
        var thisFunction = "SPServices.SPCascadeDropdowns";

        // Find the parent column's select (dropdown)
        var parentSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.parentColumn
        });
        if (parentSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "parentColumn: " + opt.parentColumn, constants.TXTColumnNotFound);
            return;
        }

        // Find the child column's select (dropdown)
        var childSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.childColumn
        });
        if (childSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "childColumn: " + opt.childColumn, constants.TXTColumnNotFound);
            return;
        }

        // If requested and the childColumn is a complex dropdown, convert to a simple dropdown
        if (opt.simpleChild === true && childSelect.Type === constants.dropdownType.complex) {
            $().SPServices.SPComplexToSimpleDropdown({
                listName: opt.listName,
                columnName: opt.childColumn
            });
            // Set the childSelect to reference the new simple dropdown
            childSelect = $().SPServices.SPDropdownCtl({
                displayName: opt.childColumn
            });
        }

        var childColumnRequired, childColumnStatic;

        // Get information about the childColumn from the current list
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName,
            completefunc: function (xData) {
                $(xData.responseXML).find("Fields").each(function () {
                    $(this).find("Field[DisplayName='" + opt.childColumn + "']").each(function () {
                        // Determine whether childColumn is Required
                        childColumnRequired = ($(this).attr("Required") === "TRUE");
                        childColumnStatic = $(this).attr("StaticName");
                        // Stop looking; we're done
                        return false;
                    });
                });
            }
        });

        // Save data about each child column on the parent
        var childColumn = {
            opt: opt,
            childSelect: childSelect,
            childColumnStatic: childColumnStatic,
            childColumnRequired: childColumnRequired
        };
        var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");

        // If this is the first child for this parent, then create the data object to hold the settings
        if (typeof childColumns === "undefined") {
            parentSelect.Obj.data("SPCascadeDropdownsChildColumns", [childColumn]);
            // If we already have a data object for this parent, then add the setting for this child to it
        } else {
            childColumns.push(childColumn);
            parentSelect.Obj.data("SPCascadeDropdownsChildColumns", childColumns);
            thisParentSetUp = true;
        }

        // We only need to bind to the event(s) if we haven't already done so
        if (!thisParentSetUp) {
            switch (parentSelect.Type) {
                // Plain old select
                case constants.dropdownType.simple:
                    parentSelect.Obj.bind("change", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                // Input / Select hybrid
                case constants.dropdownType.complex:
                    // Bind to any change on the hidden input element
                    parentSelect.optHid.bind("propertychange", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                // Multi-select hybrid
                case constants.dropdownType.multiSelect:
                    // Handle the dblclick on the candidate select
                    $(parentSelect.master.candidateControl).bind("dblclick", function () {
                        cascadeDropdown(parentSelect);
                    });
                    // Handle the dblclick on the selected values
                    $(parentSelect.master.resultControl).bind("dblclick", function () {
                        cascadeDropdown(parentSelect);
                    });
                    // Handle button clicks
                    $(parentSelect.master.addControl).bind("click", function () {
                        cascadeDropdown(parentSelect);
                    });
                    $(parentSelect.master.removeControl).bind("click", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                default:
                    break;
            }
        }
        // Fire the change to set the initially allowable values
        cascadeDropdown(parentSelect);

    }; // End $.fn.SPServices.SPCascadeDropdowns

    function cascadeDropdown(parentSelect) {
        var choices = "";
        var parentSelectSelected;
        var childSelectSelected = null;
        var newMultiLookupPickerdata;
        var numChildOptions;
        var firstChildOptionId;
        var firstChildOptionValue;

        // Filter each child column
        var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");
        $(childColumns).each(function () {

            // Break out the data objects for this child column
            var i;
            var opt = this.opt;
            var childSelect = this.childSelect;
            var childColumnStatic = this.childColumnStatic;
            var childColumnRequired = this.childColumnRequired;

            // Get the parent column selection(s)
            parentSelectSelected = utils.getDropdownSelected(parentSelect, opt.matchOnId);

            // If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
            // the number of Web Service calls when the parentSelect.Type = constants.dropdownType.complex or constants.dropdownType.multiSelect, as there are multiple propertychanges
            // which don't require any action.  The attribute will be unique per child column in case there are
            // multiple children for a given parent.
            var allParentSelections = parentSelectSelected.join(constants.spDelim);
            if (parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic) === allParentSelections) {
                return;
            }
            parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic, allParentSelections);

            // Get the current child column selection(s)
            childSelectSelected = utils.getDropdownSelected(childSelect, true);

            // When the parent column's selected option changes, get the matching items from the relationship list
            // Get the list items which match the current selection
            var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
            var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where><And>";
            if (opt.CAMLQuery.length > 0) {
                camlQuery += "<And>";
            }

            // Build up the criteria for inclusion
            if (parentSelectSelected.length === 0) {
                // Handle the case where no values are selected in multi-selects
                camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
            } else if (parentSelectSelected.length === 1) {
                // Only one value is selected
                camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
                    (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                    utils.escapeColumnValue(parentSelectSelected[0]) + "</Value></Eq>";
            } else {
                var compound = (parentSelectSelected.length > 2);
                for (i = 0; i < (parentSelectSelected.length - 1); i++) {
                    camlQuery += "<Or>";
                }
                for (i = 0; i < parentSelectSelected.length; i++) {
                    camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
                        (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                        utils.escapeColumnValue(parentSelectSelected[i]) + "</Value></Eq>";
                    if (i > 0 && (i < (parentSelectSelected.length - 1)) && compound) {
                        camlQuery += "</Or>";
                    }
                }
                camlQuery += "</Or>";
            }

            if (opt.CAMLQuery.length > 0) {
                camlQuery += opt.CAMLQuery + "</And>";
            }

            // Make sure we don't get any items which don't have the child value
            camlQuery += "<IsNotNull><FieldRef Name='" + opt.relationshipListChildColumn + "' /></IsNotNull>";

            camlQuery += "</And></Where></Query>";

            $().SPServices({
                operation: "GetListItems",
                // Force sync so that we have the right values for the child column onchange trigger
                async: false,
                webURL: opt.relationshipWebURL,
                listName: opt.relationshipList,
                // Filter based on the currently selected parent column's value
                CAMLQuery: camlQuery,
                // Only get the parent and child columns
                CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListParentColumn + "' /><FieldRef Name='" + opt.relationshipListChildColumn + "' /></ViewFields>",
                // Override the default view rowlimit and get all appropriate rows
                CAMLRowLimit: 0,
                // Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
                CAMLQueryOptions: opt.CAMLQueryOptions,
                completefunc: function (xData) {

                    // Handle errors
                    $(xData.responseXML).find("errorstring").each(function () {
                        var thisFunction = "SPServices.SPCascadeDropdowns";
                        var errorText = $(this).text();
                        if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                            utils.errBox(thisFunction,
                                "relationshipListParentColumn: " + opt.relationshipListParentColumn + " or " +
                                "relationshipListChildColumn: " + opt.relationshipListChildColumn,
                                "Not found in relationshipList " + opt.relationshipList);
                        } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                            utils.errBox(thisFunction,
                                "relationshipList: " + opt.relationshipList,
                                "List not found");
                        }

                    });

                    // Add an explanatory prompt
                    switch (childSelect.Type) {
                        case constants.dropdownType.simple:
                            // Remove all of the existing options
                            childSelect.Obj[0].innerHTML = "";
//                            $(childSelect.Obj).find("option").remove();
                            // If the column is required or the promptText option is empty, don't add the prompt text
                            if (!childColumnRequired && (opt.promptText.length > 0)) {
                                childSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.childColumn) + "</option>");
                            } else if (!childColumnRequired) {
                                childSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
                            }
                            break;
                        case constants.dropdownType.complex:
                            // If the column is required, don't add the "(None)" option
                            choices = childColumnRequired ? "" : opt.noneText + "|0";
                            childSelect.Obj.val("");
                            break;
                        case constants.dropdownType.multiSelect:
                            // Remove all of the existing options
                            $(childSelect.master.candidateControl).find("option").remove();
                            newMultiLookupPickerdata = "";
                            break;
                        default:
                            break;
                    }
                    // Get the count of items returned and save it so that we can select if it's a single option
                    // The item count is stored thus: <rs:data ItemCount="1">
                    numChildOptions = parseFloat($(xData.responseXML).SPFilterNode("rs:data").attr("ItemCount"));

                    // Add an option for each child item
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {

                        var thisOption = {};

                        // If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
                        // else the ID of the relationshipList item
                        var thisValue = $(this).attr("ows_" + opt.relationshipListChildColumn);

                        if (typeof thisValue !== "undefined" && thisValue.indexOf(constants.spDelim) > 0) {
                            thisOption = new utils.SplitIndex(thisValue);
                        } else {
                            thisOption.id = $(this).attr("ows_ID");
                            thisOption.value = thisValue;
                        }

                        // If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
                        // but by the datatype.  In this case, thisOption.id should be the ID of the relationshipList item.
                        // e.g., float;#12345.67
                        if (isNaN(thisOption.id)) {
                            thisOption.id = $(this).attr("ows_ID");
                        }

                        // Save the id and value for the first child option in case we need to select it (selectSingleOption option is true)
                        firstChildOptionId = thisOption.id;
                        firstChildOptionValue = thisOption.value;

                        switch (childSelect.Type) {
                            case constants.dropdownType.simple:
                                var selected = ($(this).attr("ows_ID") === childSelectSelected[0]) ? " selected='selected'" : "";
                                childSelect.Obj.append("<option" + selected + " value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                                break;
                            case constants.dropdownType.complex:
                                if (thisOption.id === childSelectSelected[0]) {
                                    childSelect.Obj.val(thisOption.value);
                                }
                                choices = choices + ((choices.length > 0) ? "|" : "") + thisOption.value + "|" + thisOption.id;
                                break;
                            case constants.dropdownType.multiSelect:
                                $(childSelect.master.candidateControl).append("<option value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                                newMultiLookupPickerdata += thisOption.id + "|t" + thisOption.value + "|t |t |t";
                                break;
                            default:
                                break;
                        }
                    });

                    switch (childSelect.Type) {
                        case constants.dropdownType.simple:
                            childSelect.Obj.trigger("change");
                            // If there is only one option and the selectSingleOption option is true, then select it
                            if (numChildOptions === 1 && opt.selectSingleOption === true) {
                                $(childSelect.Obj).find("option[value!='0']:first").attr("selected", "selected");
                            }
                            break;
                        case constants.dropdownType.complex:
                            // Set the allowable choices
                            childSelect.Obj.attr("choices", choices);
                            // If there is only one option and the selectSingleOption option is true, then select it
                            if (numChildOptions === 1 && opt.selectSingleOption === true) {
                                // Set the input element value
                                $(childSelect.Obj).val(firstChildOptionValue);
                                // Set the value of the optHid input element
                                childSelect.optHid.val(firstChildOptionId);
                            }
                            // If there's no selection, then remove the value in the associated hidden input element (optHid)
                            if (childSelect.Obj.val() === "") {
                                childSelect.optHid.val("");
                            }
                            break;
                        case constants.dropdownType.multiSelect:
                            // Clear the master
                            childSelect.master.data = "";
                            childSelect.MultiLookupPickerdata.val(newMultiLookupPickerdata);

                            // Clear any prior selections that are no longer valid or aren't selected
                            $(childSelect.master.resultControl).find("option").each(function () {
                                var thisSelected = $(this);
                                thisSelected.prop("selected", true);
                                $(childSelect.master.candidateControl).find("option[value='" + thisSelected.val() + "']").each(function () {
                                    thisSelected.prop("selected", false);
                                });
                            });
                            GipRemoveSelectedItems(childSelect.master);

                            // Hide any options in the candidate list which are already selected
                            $(childSelect.master.candidateControl).find("option").each(function () {
                                var thisSelected = $(this);
                                $(childSelect.master.resultControl).find("option[value='" + thisSelected.val() + "']").each(function () {
                                    thisSelected.remove();
                                });
                            });
                            GipAddSelectedItems(childSelect.master);

                            // Set master.data to the newly allowable values
                            childSelect.master.data = GipGetGroupData(newMultiLookupPickerdata);

                            // Trigger a dblclick so that the child will be cascaded if it is a multiselect.
                            $(childSelect.master.candidateControl).trigger("dblclick");

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
        }); // $(childColumns).each(function()

    } // End cascadeDropdown

    return $;

});