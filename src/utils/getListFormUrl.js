define([
    "jquery"
], function(
    $
){

    /**
     * Get the URL for a specified form for a list
     *
     * @param {Object} l
     * @param {Object} f
     */
    var getListFormUrl = function(l, f) {

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

    }; // End of function getListFormUrl


    return getListFormUrl;

});
