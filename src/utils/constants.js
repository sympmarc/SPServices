define([], function(){

    /**
     * Maintains a set of constants for SPServices.
     *
     * @namespace constants
     */
    var constants = {

        // Version info
        VERSION: "2.00.00", // TODO: Update version

        // Simple strings
        spDelim:            ";#",
        SLASH: "/",
        TXTColumnNotFound:  "Column not found on page",

        // Dropdown Types
        dropdownType: {
            simple:         "S",
            complex:        "C",
            multiSelect:    "M"
        }

    };

    return constants;

});
