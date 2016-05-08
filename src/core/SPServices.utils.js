/**
 * General purpose utilities
 *
 * @namespace spservices.utils
 */
define([
    "jquery",
    '../utils/constants'
], function(
    $,
    constants
){
    "use strict";

    var utils = /** @lends spservices.utils */{

        // Get the current context (as much as we can) on startup
        // See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
        SPServicesContext: function(options) {

            var opt = $.extend({}, {
                listName: "", // The list the form is working with. This is useful if the form is not in the list context.
                thisUserId: "" // The current user's id in the site Collection.
            }, options);

            // The SharePoint variables only give us a relative path. to match the result from WebUrlFromPageUrl, we need to add the protocol, host, and (if present) port.
            var siteRoot = location.protocol + "//" + location.host; // + (location.port !== "" ? location.port : "");

            var thisContext = {};
            // SharePoint 2010+ gives us a context variable
            if (typeof _spPageContextInfo !== "undefined") {
                thisContext.thisSite = siteRoot + _spPageContextInfo.webServerRelativeUrl;
                thisContext.thisList = opt.listName ? opt.listName : _spPageContextInfo.pageListId;
                thisContext.thisUserId = opt.thisUserId ? opt.thisUserId : _spPageContextInfo.userId;
                // In SharePoint 2007, we know the UserID only
            } else {
                thisContext.thisSite = (typeof L_Menu_BaseUrl !== "undefined") ? siteRoot + L_Menu_BaseUrl : "";
                thisContext.thisList = opt.listName ? opt.listName : "";
                thisContext.thisUserId = opt.thisUserId ? opt.thisUserId : ((typeof _spUserId !== "undefined") ? _spUserId : undefined);
            }

            return thisContext;

        }, // End of function SPServicesContext

        // Global variables
//        currentContext: new this.SPServicesContext(), // Variable to hold the current context as we figure it out

        /**
         * Wrap an XML node (n) around a value (v)
         *
         */
        wrapNode: function(n, v) {
            var thisValue = typeof v !== "undefined" ? v : "";
            return "<" + n + ">" + thisValue + "</" + n + ">";
        },

        /**
         * Generate a random number for sorting arrays randomly
         */
        randOrd: function() {
            return (Math.round(Math.random()) - 0.5);
        },

        /**
         * If a string is a URL, format it as a link, else return the string as-is
         */
        checkLink: function(s) {
            return ((s.indexOf("http") === 0) || (s.indexOf("/") === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
        },

        /**
         * Get the filename from the full URL
         */
        fileName: function (s) {
            return s.substring(s.lastIndexOf("/") + 1, s.length);
        },

        /**
         * A map of special characters to XML escaped characters.
         * Taken from {@link http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/}
         *
         * @type {Object}
         */
        xml_special_to_escaped_one_map: {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        },

        // Paul T., 2015.05.01: Commented out since its not currently used.
        // var escaped_one_to_xml_special_map = {
        // '&amp;': '&',
        // '&quot;': '"',
        // '&lt;': '<',
        // '&gt;': '>'
        // };

        /**
         * Encode XML characters in a string
         *
         * @param {String} string
         */
        encodeXml: function(string) {
            return string.replace(/([\&"<>])/g, function (str, item) {
                return this.xml_special_to_escaped_one_map[item];
            });
        },

        // Paul T., 2015-05-02: Commented out since its not currently used.
        // function decodeXml(string) {
        // return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        // function (str, item) {
        // return escaped_one_to_xml_special_map[item];
        // });
        // }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */

        /**
         * Escape column values
         */
        escapeColumnValue: function(s) {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            } else {
                return s;
            }
        },

        /**
         * Escape Url
         */
        escapeUrl: function (u) {
            return u.replace(/&/g, '%26');
        },

        /**
         * Split values like 1;#value into id and value
         * @type Class
         */
        SplitIndex: function(s) {
            var spl = s.split(constants.spDelim);
            this.id = spl[0];
            this.value = spl[1];
        },

        /**
         * Pad single digits with a zero
         *
         * @param {Number} n
         */
        pad: function (n) {
            return n < 10 ? "0" + n : n;
        },


        /**
         * Build an error message based on passed parameters
         */
        errBox: function(func, param, msg) {
            var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
                "<b>Parameter</b><br/>" + param + "<br/>" +
                "<b>Message</b><br/>" + msg + "<br/><br/>" +
                "<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
            modalBox(errMsg);
        }, // End of function errBox


        // Finds the td which contains a form field in default forms using the comment which contains:
        //  <!--  FieldName="Title"
        //      FieldInternalName="Title"
        //      FieldType="SPFieldText"
        //  -->
        // as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
        findFormField: function(v) {
            var $formBody = $("td.ms-formbody, td.ms-formbodysurvey"),
                // Borrowed from MDN.
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                escapeRegExp = function (v){
                    return v.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                },
                columnName = escapeRegExp(v),
                rcommentValidation = new RegExp("(?:Field|FieldInternal)Name=\"" + columnName + "\"", "i"),
                $columnNode = $formBody.contents().filter(function () {
                    return this.nodeType === 8 && rcommentValidation.test(this.nodeValue);
                })

            ;

            return $columnNode.parent("td");
        }, // End of function findFormField

        // Show a single attribute of a node, enclosed in a table
        //   node               The XML node
        //   opt                The current set of options
        showAttrs: function(node) {
            var i;
            var out = "<table class='ms-vb' width='100%'>";
            for (i = 0; i < node.attributes.length; i++) {
                out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
                    node.attributes.item(i).nodeName + "</td><td>" + utils.checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
            }
            out += "</table>";
            return out;
        }, // End of function showAttrs

        // Add the option values to the SPServices.SOAPEnvelope.payload for the operation
        //  opt = options for the call
        //  SOAPEnvelope = envelope to add to
        //  paramArray = an array of option names to add to the payload
        //      "paramName" if the parameter name and the option name match
        //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
        //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
        addToPayload: function(opt, SOAPEnvelope, paramArray) {

            var i;

            for (i = 0; i < paramArray.length; i++) {
                // the parameter name and the option name match
                if (typeof paramArray[i] === "string") {
                    SOAPEnvelope.payload += utils.wrapNode(paramArray[i], opt[paramArray[i]]);
                    // the parameter name and the option name are different
                } else if ($.isArray(paramArray[i]) && paramArray[i].length === 2) {
                    SOAPEnvelope.payload += utils.wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
                    // the element not a string or an array and is marked as "add to payload only if non-null"
                } else if ((typeof paramArray[i] === "object") && (paramArray[i].sendNull !== undefined)) {
                    SOAPEnvelope.payload += ((opt[paramArray[i].name] === undefined) || (opt[paramArray[i].name].length === 0)) ? "" : utils.wrapNode(paramArray[i].name, opt[paramArray[i].name]);
                    // something isn't right, so report it
                } else {
                    utils.errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
                }
            }
        }, // End of function addToPayload


        // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
        // the SiteData prefix on their names. This function replaces that name with the right name in the SPServices.SOAPEnvelope.
        siteDataFixSOAPEnvelope: function(SOAPEnvelope, siteDataOperation) {
            var siteDataOp = siteDataOperation.substring(8);
            SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
            SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
            return SOAPEnvelope;
        }, // End of function siteDataFixSOAPEnvelope


        /**
         * Get the URL for a specified form for a list
         *
         * @param {Object} l
         * @param {Object} f
         */
        getListFormUrl: function(l, f) {

            var u;
            $().SPServices({
                operation: "GetFormCollection",
                async: false,
                listName: l,
                completefunc: function (xData) {
                    u = $(xData.responseXML).find("Form[Type='" + f + "']").attr("Url");
                }
            });
            return u;

        }, // End of function getListFormUrl

        /**
         * Returns the selected value(s) for a dropdown in an array. Expects a dropdown
         * object as returned by the DropdownCtl function.
         * If matchOnId is true, returns the ids rather than the text values for the
         * selection options(s).
         *
         * @param {Object} columnSelect
         * @param {Object} matchOnId
         */
        getDropdownSelected: function (columnSelect, matchOnId) {

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

        }, // End of function getDropdownSelected


        /**
         * Generate a unique id for a containing div using the function name and the column display name.
         *
         * @param {Object} funcname
         * @param {Object} columnName
         * @param {Object} listName
         */
        genContainerId: function(funcname, columnName, listName) {
            var l = listName !== undefined ? listName : $().SPServices.SPListNameFromUrl();
            return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
                    listName: l,
                    columnDisplayName: columnName
                });
        } // End of function genContainerId

    }, //end: utils

    //-----------[ PRIVATE METHODS BELOW ]---------------------
    // These should all be defined against a local variable so
    // that we get smaller minified files

    /**
     * Call this function to pop up a branded modal msgBox
     * @private
     */
    modalBox = function(msg) {
        var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
        $("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
        var msgBoxObj = $("#SPServices_msgBox");
        var height = msgBoxObj.height();
        var width = msgBoxObj.width();
        var leftVal = ($(window).width() / 2) - (width / 2) + "px";
        var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
        msgBoxObj.css({
            border: '5px #C02000 solid',
            left: leftVal,
            top: topVal
        }).show().fadeTo("slow", 0.75).click(function () {
            $(this).fadeOut("3000", function () {
                $(this).remove();
            });
        });
    }; // End of function modalBox;

    // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
    $.expr[':'].regex = function (elem, index, match) {
        var matchParams = match[3].split(','),
            validLabels = /^(data|css):/,
            attr = {
                method: matchParams[0].match(validLabels) ?
                    matchParams[0].split(':')[0] : 'attr',
                property: matchParams.shift().replace(validLabels, '')
            },
            regexFlags = 'ig',
            regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        return regex.test($(elem)[attr.method](attr.property));
    };


    return utils;

});

