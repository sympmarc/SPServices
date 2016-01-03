define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Rearrange radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate
    $.fn.SPServices.SPArrangeChoices = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list name for the current form
            columnName: "", // The display name of the column in the form
            perRow: 99, // Maximum number of choices desired per row.
            randomize: false // If true, randomize the order of the options
        }, options);

        var columnFillInChoice = false;
        var columnOptions = [];

        // Get information about columnName from the list to determine if we're allowing fill-in choices
        var thisGetList = $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName
        });

        // when the promise is available...
        thisGetList.done(function () {
            $(thisGetList.responseXML).find("Field[DisplayName='" + opt.columnName + "']").each(function () {
                // Determine whether columnName allows a fill-in choice
                columnFillInChoice = ($(this).attr("FillInChoice") === "TRUE");
                // Stop looking;we're done
                return false;
            });

            var thisFormField = utils.findFormField(opt.columnName);
            var totalChoices = $(thisFormField).find("tr").length;
            var fillinPrompt;
            var fillinInput;

            // Collect all of the choices
            $(thisFormField).find("tr").each(function (choiceNumber) {
                // If this is the fill-in prompt, save it...
                if (columnFillInChoice && choiceNumber === (totalChoices - 2)) {
                    fillinPrompt = $(this).find("td");
                    // ...or if it is the fill-in input box, save it...
                } else if (columnFillInChoice && choiceNumber === (totalChoices - 1)) {
                    fillinInput = $(this).find("td");
                    // ...else push into the columnOptions array.
                } else {
                    columnOptions.push($(this).find("td"));
                }
            });

            // If randomize is true, randomly sort the options
            if (opt.randomize) {
                columnOptions.sort(utils.randOrd);
            }

            //Create a new choices table to hold the arranged choices.
            var newChoiceTable = $("<table cellpadding='0' cellspacing='1'></table>");

            //Iterate over all available choices placing them in the correct position in the new choices table.
            for (var i = 0; i < columnOptions.length; i++) {
                // If we've already got perRow columnOptions in the row, close off the row
                if ((i + 1) % opt.perRow === 0) {
                    newChoiceTable.append("<tr></tr>");
                }
                newChoiceTable.append(columnOptions[i]);
            }

            //Insert fillInChoices section under available choices.
            if (columnFillInChoice) {
                var fillInRow = $("<tr><td colspan='99'><table cellpadding='0' cellspacing='1'><tr></tr></table></td></tr>");
                fillInRow.find("tr").append(fillinPrompt);
                fillInRow.find("tr").append(fillinInput);
                newChoiceTable.append(fillInRow);
            }

            //Insert new table before the old choice table so that choices will still line up with header.
            var choiceTable = $(thisFormField).find("table:first");
            choiceTable.before(newChoiceTable);

            //Choices table is not removed because validation depends on the table id.
            choiceTable.hide();

        });

    }; // End $.fn.SPServices.SPArrangeChoices


    return $;

});