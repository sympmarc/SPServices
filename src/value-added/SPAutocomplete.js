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

    // Provide suggested values from a list for in input column based on characters typed
    $.fn.SPServices.SPAutocomplete = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] The name of the Web (site) which contains the sourceList
            sourceList: "", // The name of the list which contains the values
            sourceColumn: "", // The static name of the column which contains the values
            columnName: "", // The display name of the column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
            CAMLQueryOptions: "<QueryOptions></QueryOptions>", // [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
            CAMLRowLimit: 0, // [Optional] Override the default view rowlimit and get all appropriate rows
            filterType: "BeginsWith", // Type of filtering: [BeginsWith, Contains]
            numChars: 0, // Wait until this number of characters has been typed before attempting any actions
            ignoreCase: false, // If set to true, the function ignores case, if false it looks for an exact match
            highlightClass: "", // If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
            uniqueVals: false, // If set to true, the function only adds unique values to the list (no duplicates)
            maxHeight: 99999, // Sets the maximum number of values to display before scrolling occurs
            slideDownSpeed: "fast", // Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
            processingIndicator: "_layouts/images/REFRESH.GIF", // If present, show this while processing
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var matchNum;

        // Find the input control for the column and save some of its attributes
        var columnObj = utils.findFormField(opt.columnName).find("input[Title^='" + opt.columnName + "']");
        columnObj.css("position", "");
        var columnObjColor = columnObj.css("color");
        var columnObjWidth = columnObj.css("width");

        if (columnObj.html() === null && opt.debug) {
            utils.errBox("SPServices.SPAutocomplete",
                "columnName: " + opt.columnName,
                "Column is not an input control or is not found on page");
            return;
        }

        // Remove the <br/> which isn't needed and messes up the formatting
        columnObj.closest("span").find("br").remove();
        columnObj.wrap("<div>");

        // Create a div to contain the matching values and add it to the DOM
        var containerId = utils.genContainerId("SPAutocomplete", opt.columnName, opt.listName);
        columnObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");

        // Set the width to match the width of the input control
        var containerObj = $("#" + containerId);
        containerObj.css("width", columnObjWidth);

        // Handle keypresses
        $(columnObj).keyup(function () {

            // Get the column's value
            var columnValue = $(this).val();

            // Hide the container while we're working on it
            containerObj.hide();

            // Have enough characters been typed yet?
            if (columnValue.length < opt.numChars) {
                return false;
            }

            // Show the the processingIndicator as a background image in the input element
            columnObj.css({
                "background-image": "url(" + opt.processingIndicator + ")",
                "background-position": "right",
                "background-repeat": "no-repeat"
            });

            // Array to hold the matched values
            var matchArray = [];

            // Build the appropriate CAMLQuery
            var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
            if (opt.CAMLQuery.length > 0) {
                camlQuery += "<And>";
            }
            camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";
            if (opt.CAMLQuery.length > 0) {
                camlQuery += opt.CAMLQuery + "</And>";
            }
            camlQuery += "</Where></Query>";

            // Call GetListItems to find all of the potential values
            $().SPServices({
                operation: "GetListItems",
                async: false,
                webURL: opt.WebURL,
                listName: opt.sourceList,
                CAMLQuery: camlQuery,
                CAMLQueryOptions: opt.CAMLQueryOptions,
                CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.sourceColumn + "' /></ViewFields>",
                CAMLRowLimit: opt.CAMLRowLimit,
                completefunc: function (xData) {
                    // Handle upper/lower case if ignoreCase = true
                    var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
                    // See which values match and add the ones that do to matchArray
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {
                        var thisValue = $(this).attr("ows_" + opt.sourceColumn);
                        var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
                        // Make sure we have a match...
                        if (opt.filterType === "Contains") {
                            var firstMatch = thisValueTest.indexOf(testValue);
                            if ((firstMatch >= 0) &&
                                    // ...and that the match is not already in the array if we want uniqueness
                                (!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
                                matchArray.push($(this).attr("ows_" + opt.sourceColumn));
                            }
                        } else {
                            // Handles normal case, which is BeginsWith and and other unknown values
                            if (testValue === thisValueTest.substr(0, testValue.length) &&
                                    // ...and that the match is not already in the array if we want uniqueness
                                (!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
                                matchArray.push($(this).attr("ows_" + opt.sourceColumn));
                            }
                        }
                    });
                }
            });

            // Build out the set of list elements to contain the available values
            var out = "";
            for (var i = 0; i < matchArray.length; i++) {
                // If a highlightClass has been supplied, wrap a span around each match
                if (opt.highlightClass.length > 0) {
                    // Set up Regex based on whether we want to ignore case
                    var thisRegex = new RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
                    // Look for all occurrences
                    var matches = matchArray[i].match(thisRegex);
                    var startLoc = 0;
                    // Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
                    for (matchNum = 0; matchNum < matches.length; matchNum++) {
                        var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
                        var endPos = thisPos + matches[matchNum].length;
                        var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
                        matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
                        startLoc = thisPos + thisSpan.length;
                    }
                }
                // Add the value to the markup for the container
                out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
            }

            // Add all the list elements to the containerId container
            containerObj.html(out);
            // Set up hehavior for the available values in the list element
            $("#" + containerId + " li").click(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                columnObj.val($(this).text());
            }).mouseover(function () {
                var mouseoverCss = {
                    "cursor": "hand",
                    "color": "#ffffff",
                    "background": "#3399ff"
                };
                $(this).css(mouseoverCss);
            }).mouseout(function () {
                var mouseoutCss = {
                    "cursor": "inherit",
                    "color": columnObjColor,
                    "background": "transparent"
                };
                $(this).css(mouseoutCss);
            });

            // If we've got some values to show, then show 'em!
            if (matchArray.length > 0) {
                $("#" + containerId).slideDown(opt.slideDownSpeed);
            }
            // Remove the processing indicator
            columnObj.css("background-image", "");
        });

    }; // End $.fn.SPServices.SPAutocomplete

    return $;

});