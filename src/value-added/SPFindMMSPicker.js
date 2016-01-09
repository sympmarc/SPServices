define([
    'jquery',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core.js'
], function (
    $
) {

    "use strict";

    // Find an MMS Picker in the page
    // Returns references to:
    //   terms - The aaray of terms as value/guid pairs
    $.fn.SPServices.SPFindMMSPicker = function (options) {

        var opt = $.extend({}, {
            MMSDisplayName: "" // The displayName of the MMS Picker on the form
        }, options);

        var thisTerms = [];

        // Find the div for the column which contains the entered data values
        var thisDiv = $("div[title='" + opt.MMSDisplayName + "']");
        var thisHiddenInput = thisDiv.closest("td").find("input[type='hidden']");
        var thisTermArray = thisHiddenInput.val().split(";");

        for (var i = 0; i < thisTermArray.length; i++) {
            var thisOne = thisTermArray[i].split("|");
            thisTerms.push({
                value: thisOne[0],
                guid: thisOne[1]
            });

        }

        return {
            terms: thisTerms
        };

    }; // End $.fn.SPServices.SPFindMMSPicker

    return $;

});