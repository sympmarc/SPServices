define([], function(){

    /**
     * Maintains a set of constants for SPServices.
     *
     * @namespace constants
     */
    var constants = {

        // Version info
        VERSION: "2.0.0", // TODO: Update version

        // Simple strings
        spDelim:            ";#",
        SLASH: "/",
        TXTColumnNotFound:  "Column not found on page",

        // String constants
        //   General
        SCHEMASharePoint: "http://schemas.microsoft.com/sharepoint",
        multiLookupPrefix: "MultiLookupPicker",
        multiLookupPrefix2013:"MultiLookup",


    // Dropdown Types
        dropdownType: {
            simple:         "S",
            complex:        "C",
            multiSelect:    "M"
        },

        // Known list field types - See: http://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.spfieldtype(v=office.15).aspx
        spListFieldTypes: [
            "Integer",
            "Text",
            "Note",
            "DateTime",
            "Counter",
            "Choice",
            "Lookup",
            "Boolean",
            "Number",
            "Currency",
            "URL",
//        "Computed", // NEW
//        "Threading", // NEW
//        "Guid", // NEW
            "MultiChoice",
//        "GridChoice", // NEW
            "Calculated",
            "File",
            "Attachments",
            "User",
//        "Recurrence", // NEW
//        "CrossProjectLink", // NEW
            "ModStat",
            "ContentTypeId",
//        "PageSeparator", // NEW
//        "ThreadIndex", // NEW
            "WorkflowStatus", // NEW
//      "AllDayEvent", // NEW
//      "WorkflowEventType", // NEW
//        "Geolocation", // NEW
//        "OutcomeChoice", // NEW
            "RelatedItems", // Related Items in a Workflow Tasks list

            // Also seen
            "UserMulti", // Multiselect users
            "LookupMulti", // Multi-select lookup
            "datetime", // Calculated date/time result
            "float", // Calculated float
            "Calc" // General calculated
        ]


};

    return constants;

});
