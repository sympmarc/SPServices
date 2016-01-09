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

    // The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically
    // based on the values they contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
    $.fn.SPServices.SPSetMultiSelectSizes = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            multiSelectColumn: "",
            minWidth: 0,
            maxWidth: 0,
            debug: false
        }, options);

        var thisFunction = "SPServices.SPSetMultiSelectSizes";

        // Find the multi-select column
        var thisMultiSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.multiSelectColumn
        });
        if (thisMultiSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, constants.TXTColumnNotFound);
            return;
        }
        if (thisMultiSelect.Type !== constants.dropdownType.multiSelect && opt.debug) {
            utils.errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, "Column is not multi-select.");
            return;
        }

        // Create a temporary clone of the select to use to determine the appropriate width settings.
        // We'll append it to the end of the enclosing span.
        var cloneId = utils.genContainerId("SPSetMultiSelectSizes", opt.multiSelectColumn, opt.listName);
        var cloneObj = $("<select id='" + cloneId + "' ></select>").appendTo(thisMultiSelect.container);
        cloneObj.css({
            "width": "auto", // We want the clone to resize its width based on the contents
            "height": 0, // Just to keep the page clean while we are using the clone
            "visibility": "hidden" // And let's keep it hidden
        });

        // Add all the values to the cloned select.  First the left (possible values) select...
        $(thisMultiSelect.master.candidateControl).find("option").each(function () {
            cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
        });
        // ...then the right (selected values) select (in case some values have already been selected)
        $(thisMultiSelect.master.resultControl).find("option").each(function () {
            cloneObj.append("<option value='" + $(this).val() + "'>" + $(this).html() + "</option>");
        });

        // We'll add 5px for a little padding on the right.
        var divWidth = cloneObj.width() + 5;
        var newDivWidth = divWidth;
        if (opt.minWidth > 0 || opt.maxWidth > 0) {
            if (divWidth < opt.minWidth) {
                divWidth = opt.minWidth;
            }
            if (newDivWidth < opt.minWidth) {
                newDivWidth = opt.minWidth;
            }
            if (newDivWidth > opt.maxWidth) {
                newDivWidth = opt.maxWidth;
            }
        }
        var selectWidth = divWidth;

        // Set the new widths
        $(thisMultiSelect.master.candidateControl).css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");
        $(thisMultiSelect.master.resultControl).css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");

        // Remove the select's clone, since we're done with it
        cloneObj.remove();

    }; // End $.fn.SPServices.SPSetMultiSelectSizes

    return $;

});