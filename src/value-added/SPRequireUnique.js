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

    // Function which checks to see if the value for a column on the form is unique in the list.
    $.fn.SPServices.SPRequireUnique = function (options) {

        var opt = $.extend({}, {
            columnStaticName: "Title", // Name of the column
            duplicateAction: 0, // 0 = warn, 1 = prevent
            ignoreCase: false, // If set to true, the function ignores case, if false it looks for an exact match
            initMsg: "This value must be unique.", // Initial message to display after setup
            initMsgCSSClass: "ms-vb", // CSS class for initial message
            errMsg: "This value is not unique.", // Error message to display if not unique
            errMsgCSSClass: "ms-formvalidation", // CSS class for error message
            showDupes: false, // If true, show links to the duplicate item(s) after the error message
            completefunc: null // Function to call on completion of rendering the change.
        }, options);

        // Get the current item's ID from the Query String
        var queryStringVals = $().SPServices.SPGetQueryString();
        var thisID = queryStringVals.ID;
        var thisList = $().SPServices.SPListNameFromUrl();

        // Set the messages based on the options provided
        var msg = "<span id='SPRequireUnique" + opt.columnStaticName + "' class='{0}'>{1}</span><br/>";
        var firstMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);

        // We need the DisplayName
        var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
            listName: thisList,
            columnStaticName: opt.columnStaticName
        });
        var columnObj = utils.findFormField(columnDisplayName).find("input[Title^='" + columnDisplayName + "']");
        columnObj.parent().append(firstMsg);

        columnObj.blur(function () {
            var columnValueIDs = [];
            // Get the columnDisplayName's value
            var columnValue = $(this).val();
            if (columnValue.length === 0) {
                return false;
            }

            // Call the Lists Web Service (GetListItems) to see if the value already exists
            $().SPServices({
                operation: "GetListItems",
                async: false,
                listName: thisList,
                // Make sure we get all the items, ignoring any filters on the default view.
                CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + opt.columnStaticName + "'/></IsNotNull></Where></Query>",
                // Filter based on columnStaticName's value
                CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='" + opt.columnStaticName + "' /></ViewFields>",
                // Override the default view rowlimit and get all appropriate rows
                CAMLRowLimit: 0,
                completefunc: function (xData) {
                    var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {
                        var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
                        // If this value already exists in columnStaticName and it's not the current item, then save the ID in the array
                        if ((testValue === thisValue) && ($(this).attr("ows_ID") !== thisID)) {
                            columnValueIDs.push([$(this).attr("ows_ID"), $(this).attr("ows_" + opt.columnStaticName)]);
                        }
                    });
                }
            });
            var newMsg = opt.initMsg;
            var msgContainer = $("#SPRequireUnique" + opt.columnStaticName);
            msgContainer.html(newMsg).attr("class", opt.initMsgCSSClass);

            $("input[value='OK']:disabled, input[value='Save']:disabled").removeAttr("disabled");
            if (columnValueIDs.length > 0) {
                newMsg = opt.errMsg;
                msgContainer.html(newMsg).attr("class", opt.errMsgCSSClass);
                if (opt.duplicateAction === 1) {
                    columnObj.focus();
                    $("input[value='OK'], input[value='Save']").attr("disabled", "disabled");
                }
                if (opt.showDupes) {
                    var out = " " + columnValueIDs.length + " duplicate item" + (columnValueIDs.length > 1 ? "s" : "") + ": ";
                    for (var i = 0; i < columnValueIDs.length; i++) {
                        out += "<a href='DispForm.aspx?ID=" + columnValueIDs[i][0] + "&Source=" + location.href + "'>" + columnValueIDs[i][1] + "</a> ";
                    }
                    $("span#SPRequireUnique" + opt.columnStaticName).append(out);
                }
            }

        });
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPRequireUnique

    return $;

});