define([
    "jquery",
    "./constants"
], function(
    $,
    constants
){

    /**
     * Returns the selected value(s) for a dropdown in an array. Expects a dropdown
     * object as returned by the DropdownCtl function.
     * If matchOnId is true, returns the ids rather than the text values for the
     * selection options(s).
     *
     * @param {Object} columnSelect
     * @param {Object} matchOnId
     */
    var getDropdownSelected = function (columnSelect, matchOnId) {

        var columnSelectSelected = [];

        switch (columnSelect.Type) {
            case constants.dropdownType.simple:
                if (matchOnId) {
                    columnSelectSelected.push(columnSelect.Obj.find("option:selected").val() || []);
                } else {
                    columnSelectSelected.push(columnSelect.Obj.find("option:selected").text() || []);
                }
                break;
            case constants.dropdownType.complex:
                if (matchOnId) {
                    columnSelectSelected.push(columnSelect.optHid.val() || []);
                } else {
                    columnSelectSelected.push(columnSelect.Obj.val() || []);
                }
                break;
            case constants.dropdownType.multiSelect:
                $(columnSelect.master.resultControl).find("option").each(function () {
                    if (matchOnId) {
                        columnSelectSelected.push($(this).val());
                    } else {
                        columnSelectSelected.push($(this).html());
                    }
                });
                break;
            default:
                break;
        }
        return columnSelectSelected;

    }; // End of function getDropdownSelected

    return getDropdownSelected;

});
