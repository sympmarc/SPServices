define([
    'jquery',
    '../core/SPServices.utils',
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

    "use strict";

    // Find a dropdown (or multi-select) in the DOM. Returns the dropdown object and its type:
    // S = Simple (select)
    // C = Compound (input + select hybrid)
    // M = Multi-select (select hybrid)
    $.fn.SPServices.SPDropdownCtl = function (options) {

        var opt = $.extend({}, {
            displayName: "" // The displayName of the column on the form
        }, options);

        var columnObj = {};

// Paul T., 2015.05.02: Commented out since is not currently used
        // var colStaticName = $().SPServices.SPGetStaticFromDisplay({
        // listName: $().SPServices.SPListNameFromUrl(),
        // columnDisplayName: opt.displayName
        // });

        // Simple, where the select's title attribute is colName (DisplayName)
        //  Examples:
        //      SP2013 <select title="Country" id="Country_d578ed64-2fa7-4c1e-8b41-9cc1d524fc28_$LookupField">
        //      SP2010: <SELECT name=ctl00$m$g_d10479d7_6965_4da0_b162_510bbbc58a7f$ctl00$ctl05$ctl01$ctl00$ctl00$ctl04$ctl00$Lookup title=Country id=ctl00_m_g_d10479d7_6965_4da0_b162_510bbbc58a7f_ctl00_ctl05_ctl01_ctl00_ctl00_ctl04_ctl00_Lookup>
        //      SP2007: <select name="ctl00$m$g_e845e690_00da_428f_afbd_fbe804787763$ctl00$ctl04$ctl04$ctl00$ctl00$ctl04$ctl00$Lookup" Title="Country" id="ctl00_m_g_e845e690_00da_428f_afbd_fbe804787763_ctl00_ctl04_ctl04_ctl00_ctl00_ctl04_ctl00_Lookup">
        if ((columnObj.Obj = $("select[Title='" + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.simple;
            // Compound
        } else if ((columnObj.Obj = $("input[Title='" + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.complex;
            // Simple, where the select's id begins with colStaticName (StaticName) - needed for required columns where title="DisplayName Required Field"
            //   Example: SP2013 <select title="Region Required Field" id="Region_59566f6f-1c3b-4efb-9b7b-6dbc35fe3b0a_$LookupField" showrelatedselected="3">
//        } else if ((columnObj.Obj = $("select:regex(id, (" + colStaticName + ")(_)[0-9a-fA-F]{8}(-))")).length === 1) {
//            columnObj.Type = constants.dropdownType.simple;
            // Multi-select: This will find the multi-select column control in English and most other language sites where the Title looks like 'Column Name possible values'
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title^='" + opt.displayName + " ']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like '????????? ????????: Column Name'
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$=': " + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a German site (and perhaps others)
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$='\"" + opt.displayName + "\".']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a Italian site (and perhaps others) where the Title looks like "Valori possibili Column name"
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$=' " + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
        } else {
            columnObj.Type = null;
        }

        // Last ditch effort
        // Simple, finding based on the comment text at the top of the td.ms-formbody where the select's title begins with DisplayName - needed for required columns where title="DisplayName Required Field"
        //   Examples: SP2010 <select name="ctl00$m$g_308135f8_3f59_4d67_b5f8_c26776c498b7$ff51$ctl00$Lookup" id="ctl00_m_g_308135f8_3f59_4d67_b5f8_c26776c498b7_ff51_ctl00_Lookup" title="Region Required Field">
        //            SP2013 <select id="Soort_x0020_medicijn_ded19932-0b4f-4d71-bc3b-2d510e5f297a_$LookupField" title="Soort medicijn Vereist veld">
        if (columnObj.Type === null) {
            var fieldContainer = utils.findFormField(opt.displayName);
            if (fieldContainer !== undefined) {
                var fieldSelect1 = fieldContainer.find("select[title^='" + opt.displayName + " '][id$='_Lookup']");
                var fieldSelect2 = fieldContainer.find("select[title^='" + opt.displayName + " '][id$='LookupField']");
                var fieldSelect = fieldSelect1.length > 0 ? fieldSelect1 : fieldSelect2;

                if (fieldSelect && fieldSelect.length === 1) {
                    columnObj.Type = constants.dropdownType.simple;
                    columnObj.Obj = fieldSelect;
                }
            }
        }

        if (columnObj.Type === constants.dropdownType.complex) {
            columnObj.optHid = $("input[id='" + columnObj.Obj.attr("optHid") + "']");
        } else if (columnObj.Type === constants.dropdownType.multiSelect) {
            // Find the important bits of the multiselect control
            columnObj.container = columnObj.Obj.closest("span");
            columnObj.MultiLookupPickerdata = columnObj.container.find("input[id$='" + utils.multiLookupPrefix + "_data'], input[id$='" + utils.multiLookupPrefix2013 + "_data']");
            var addButtonId = columnObj.container.find("[id$='AddButton']").attr("id");
            columnObj.master =
                window[addButtonId.replace(/AddButton/, constants.multiLookupPrefix + "_m")] || // SharePoint 2007
                window[addButtonId.replace(/AddButton/, constants.multiLookupPrefix2013 + "_m")]; // SharePoint 2013
        }

        return columnObj;

    }; // End of function $.fn.SPServices.SPDropdownCtl

    return $;

});