define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // This function converts an XML node set to JSON
    // Initial implementation focuses only on GetListItems
    $.fn.SPXmlToJson = function (options) {

        var opt = $.extend({}, {
            mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
            includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
            removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
            sparse: false // If true, empty ("") values will not be returned
        }, options);

        var attrNum;
        var jsonObject = [];

        this.each(function () {
            var row = {};
            var rowAttrs = this.attributes;

            if (!opt.sparse) {
                // Bring back all mapped columns, even those with no value
                $.each(opt.mapping, function () {
                    row[this.mappedName] = "";
                });
            }

            // Parse through the element's attributes
            for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
                var thisAttrName = rowAttrs[attrNum].name;
                var thisMapping = opt.mapping[thisAttrName];
                var thisObjectName = thisMapping && thisMapping.mappedName ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
                var thisObjectType = thisMapping !== undefined ? thisMapping.objectType : undefined;
                if (opt.includeAllAttrs || thisMapping !== undefined) {
                    row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType);
                }
            }
            // Push this item into the JSON Object
            jsonObject.push(row);

        });

        // Return the JSON object
        return jsonObject;

    }; // End $.fn.SPServices.SPXmlToJson


    function attrToJson(v, objectType) {
        function identity(x) { return x; }

        var result = {

            /* Generic [Reusable] Functions */
            "Integer": intToJsonObject,
            "Number": floatToJsonObject,
            "Boolean": booleanToJsonObject,
            "DateTime": dateToJsonObject,
            "User": userToJsonObject,
            "UserMulti": userMultiToJsonObject,
            "Lookup": lookupToJsonObject,
            "lookupMulti": lookupMultiToJsonObject,
            "MultiChoice": choiceMultiToJsonObject,
            "Calculated": calcToJsonObject,
            "Attachments": attachmentsToJsonObject,
            "URL": urlToJsonObject,
            "JSON": jsonToJsonObject, // Special case for text JSON stored in text columns

            /* These objectTypes reuse above functions */
            "Text": result.Default,
            "Counter": result.Integer,
            "datetime": result.DateTime,    // For calculated columns, stored as datetime;#value
            "AllDayEvent": result.Boolean,
            "Recurrence": result.Boolean,
            "Currency": result.Number,
            "float": result.Number, // For calculated columns, stored as float;#value
            "RelatedItems": result.JSON,

            "Default": identity
        };

        return (result[objectType] || identity)(v);

/*
        switch (objectType) {

            case "Text":
                colValue = v;
                break;
            case "DateTime":
            case "datetime": // For calculated columns, stored as datetime;#value
                // Dates have dashes instead of slashes: ows_Created="2009-08-25 14:24:48"
                colValue = dateToJsonObject(v);
                break;
            case "User":
                colValue = userToJsonObject(v);
                break;
            case "UserMulti":
                colValue = userMultiToJsonObject(v);
                break;
            case "Lookup":
                colValue = lookupToJsonObject(v);
                break;

            case "LookupMulti":
                colValue = lookupMultiToJsonObject(v);
                break;
            case "Boolean":
            case "AllDayEvent":
            case "Recurrence":
                colValue = booleanToJsonObject(v);
                break;

            case "Integer":
                colValue = intToJsonObject(v);
                break;

            case "Counter":
                colValue = intToJsonObject(v);
                break;

            case "MultiChoice":
                colValue = choiceMultiToJsonObject(v);
                break;
            case "Number":
            case "Currency":
            case "float": // For calculated columns, stored as float;#value
                colValue = floatToJsonObject(v);
                break;
            case "Calculated":
                colValue = calcToJsonObject(v);
                break;
            case "Attachments":
                colValue = attachmentsToJsonObject(v);
                break;
            case "URL":
                colValue = urlToJsonObject(v);
                break;
            case "JSON":
            case "RelatedItems":
                colValue = jsonToJsonObject(v); // Special case for text JSON stored in text columns
                break;

            default:
                // All other objectTypes will be simple strings
                colValue = v;
                break;
        }
        return colValue;
 */
    }

    function intToJsonObject(s) {
        return parseInt(s, 10);
    }

    function floatToJsonObject(s) {
        return parseFloat(s);
    }

    function booleanToJsonObject(s) {
        return s !== "0";
    }

    function dateToJsonObject(s) {

        var dt = s.split("T")[0] !== s ? s.split("T") : s.split(" ");
        var d = dt[0].split("-");
        var t = dt[1].split(":");
        var t3 = t[2].split("Z");
        return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t3[0]);
    }

    function userToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUser = new utils.SplitIndex(s);
            var thisUserExpanded = thisUser.value.split(",#");
            if (thisUserExpanded.length === 1) {
                return {
                    userId: thisUser.id,
                    userName: thisUser.value
                };
            } else {
                return {
                    userId: thisUser.id,
                    userName: thisUserExpanded[0].replace(/(,,)/g, ","),
                    loginName: thisUserExpanded[1].replace(/(,,)/g, ","),
                    email: thisUserExpanded[2].replace(/(,,)/g, ","),
                    sipAddress: thisUserExpanded[3].replace(/(,,)/g, ","),
                    title: thisUserExpanded[4].replace(/(,,)/g, ",")
                };
            }
        }
    }

    function userMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUserMultiObject = [];
            var thisUserMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                var thisUser = userToJsonObject(thisUserMulti[i] + constants.spDelim + thisUserMulti[i + 1]);
                thisUserMultiObject.push(thisUser);
            }
            return thisUserMultiObject;
        }
    }

    function lookupToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisLookup = s.split(constants.spDelim);
            return {
                lookupId: thisLookup[0],
                lookupValue: thisLookup[1]
            };
        }
    }

    function lookupMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisLookupMultiObject = [];
            var thisLookupMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                var thisLookup = lookupToJsonObject(thisLookupMulti[i] + constants.spDelim + thisLookupMulti[i + 1]);
                thisLookupMultiObject.push(thisLookup);
            }
            return thisLookupMultiObject;
        }
    }

    function choiceMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisChoiceMultiObject = [];
            var thisChoiceMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisChoiceMulti.length; i++) {
                if (thisChoiceMulti[i].length !== 0) {
                    thisChoiceMultiObject.push(thisChoiceMulti[i]);
                }
            }
            return thisChoiceMultiObject;
        }
    }

    function attachmentsToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else if (s === "0" || s === "1") {
            return s;
        } else {
            var thisObject = [];
            var thisString = s.split(constants.spDelim);
            for (var i = 0; i < thisString.length; i++) {
                if (thisString[i].length !== 0) {
                    var fileName = thisString[i];
                    if (thisString[i].lastIndexOf("/") !== -1) {
                        var tokens = thisString[i].split("/");
                        fileName = tokens[tokens.length - 1];
                    }
                    thisObject.push({
                        attachment: thisString[i],
                        fileName: fileName
                    });
                }
            }
            return thisObject;
        }
    }

    function urlToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUrl = s.split(", ");
            return {
                Url: thisUrl[0],
                Description: thisUrl[1]
            };
        }
    }

    function calcToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisCalc = s.split(constants.spDelim);
            // The first value will be the calculated column value type, the second will be the value
            return attrToJson(thisCalc[1], thisCalc[0]);
        }
    }

    function jsonToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            return $.parseJSON(s);
        }
    }

    return $;

});