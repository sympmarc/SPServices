/**
 * General purpose utilities
 *
 * @namespace spservices.utils
 */
define([
    "jquery",
    "./constants"
], function(
    $,
    constants
){

    var utils = /** @lends spservices.utils */{

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

        // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
        /*    $.expr[':'].regex = function (elem, index, match) {
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
         */

        /**
         * Build an error message based on passed parameters
         */
        errBox: function(func, param, msg) {
            var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
                "<b>Parameter</b><br/>" + param + "<br/>" +
                "<b>Message</b><br/>" + msg + "<br/><br/>" +
                "<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
            modalBox(errMsg);
        } // End of function errBox




    }, //end: utils

    //-----------[ PRIVATE METHODS BELOW ]---------------------
    // These should all be defined against a local variable so
    // that we get a smaller minified files

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

    return utils;

});

