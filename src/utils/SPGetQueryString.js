define([
    'jquery'
], function (
    $
) {

    "use strict";

    // Get the Query String parameters and their values and return in an array
    // Includes code from http://www.developerdrive.com/2013/08/turning-the-querystring-into-a-json-object-using-javascript/
    // Simplified in 2014.01 using this code
    $.fn.SPServices.SPGetQueryString = function (options) {

        var opt = $.extend({}, {
            lowercase: false // If true, parameter names will be converted to lowercase
        }, options);

        var queryStringVals = {};

        var qs = location.search.slice(1).split('&');

        for (var i = 0; i < qs.length; i++) {
            var param = qs[i].split('=');
            var paramName = opt.lowercase ? param[0].toLowerCase() : param[0];
            queryStringVals[paramName] = decodeURIComponent(param[1] || "");
        }

        return queryStringVals;

    }; // End $.fn.SPServices.SPGetQueryString

    return $;

});