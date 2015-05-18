define([
    "jquery"
], function(
    $
){


    /**
     * Generate a unique id for a containing div using the function name and the column display name.
     *
     * @param {Object} funcname
     * @param {Object} columnName
     * @param {Object} listName
     */
    var genContainerId = function(funcname, columnName, listName) {
        var l = listName !== undefined ? listName : $().SPServices.SPListNameFromUrl();
        return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
                listName: l,
                columnDisplayName: columnName
            });
    }; // End of function genContainerId


    return genContainerId;

});
