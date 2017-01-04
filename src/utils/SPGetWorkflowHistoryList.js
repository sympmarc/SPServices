define([
    'jquery',
    '../utils/constants',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants
) {

    "use strict";

    // SPGetListItemsJson retrieves items from a list in JSON format
    $.fn.SPServices.SPGetWorkflowHistoryList = function (options) {
          var opt = $.extend({}, {
            webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
            workflowName: ""  // required name of the Workflow 
        }, $().SPServices.defaults, options);

        var HistoryListID;

        $.ajax({
            async: false,
            url :   opt.webURL+"/Workflows/"+opt.workflowName+"/"+opt.workflowName+".xoml.wfconfig.xml",
            dataType: "xml",
            complete: function(data){
                assoc = $(data.responseXML).find("Association");
                $.each(assoc[0].attributes,function(idx,attr){
                    
                    if (attr.name == "HistoryListID")
                    {
                        HistoryListID = attr.value;
                    }
                });
            }
        });

        return HistoryListID;
    }

    return $;

});