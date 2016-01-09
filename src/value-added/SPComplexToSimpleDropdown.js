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

    // function to convert complex dropdowns to simple dropdowns
    $.fn.SPServices.SPComplexToSimpleDropdown = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            columnName: "", // The display name of the column in the form
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox("SPServices.SPComplexToSimpleDropdown", "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // If we don't have a complex dropdown, then there is nothing to do
        if (columnSelect.Type !== constants.dropdownType.complex) {
            return;
        }

        // The available options are stored in the choices attribute of the complex dropdown's input element...
        var choices = $(columnSelect.Obj).attr("choices").split("|");

        // We need to know which option is selected already, if any
        var complexSelectSelectedId = columnSelect.optHid.val();

        // Build up the simple dropdown, giving it an easy to select id
        var simpleSelectId = utils.genContainerId("SPComplexToSimpleDropdown", columnSelect.Obj.attr("title"), opt.listName);

        var simpleSelect = "<select id='" + simpleSelectId + "' title='" + opt.columnName + "'>";
        for (var i = 0; i < choices.length; i = i + 2) {
            var simpleSelectSelected = (choices[i + 1] === complexSelectSelectedId) ? " selected='selected' " : " ";
            simpleSelect += "<option" + simpleSelectSelected + "value='" + choices[i + 1] + "'>" + choices[i] + "</option>";
        }
        simpleSelect += "</select>";

        // Append the new simple select to the form
        columnSelect.Obj.closest("td").prepend(simpleSelect);
        var simpleSelectObj = $("#" + simpleSelectId);

        // Remove the complex dropdown functionality since we don't need it anymore...
        columnSelect.Obj.closest("span").find("img").remove();
        // ...and hide the input element
        columnSelect.Obj.closest("span").find("input").hide();

        // When the simple select changes...
        simpleSelectObj.change(function () {
            var thisVal = $(this).val();
            // ...set the optHid input element's value to the valus of the selected option...
            columnSelect.optHid.val(thisVal);
            // ...and save the selected value as the hidden input's value only if the value is not equal to "0" (None)
            $(columnSelect.Obj).val($(this).find("option[value='" + (thisVal !== "0" ? thisVal : "") + "']").html());
        });
        // Trigger a change to ensure that the selected value registers in the complex dropdown
        simpleSelectObj.trigger("change");

        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }

    }; // End $.fn.SPServices.SPConvertToSimpleDropdown

    return $;

});