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
    $.fn.SPServices.SPGetListWorkflows = function (options) {
          var opt = $.extend({}, {
            webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
            listName: ""
        }, $().SPServices.defaults, options);

        var workflowNames =[];  //names of all workflows associated with this list;

         soapBody ='<?xml version="1.0" encoding="utf-8"?>'+
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
        '<soap12:Body>' +
        '<GetList xmlns="http://schemas.microsoft.com/sharepoint/soap/"> ' +
        '<strListName>'+opt.listName+'</strListName>' +
        '</GetList>' +
        '</soap12:Body> ' +
        '</soap12:Envelope>';
        $.ajax({
            async: false,
            method: "POST",
            url: opt.webURL+"/_vti_bin/SiteData.asmx",
            contentType: "application/soap+xml; charset=utf-8",
            dataType:"xml",
            data: soapBody,
            complete: function (data) {
                $( data.responseXML ) .find("_sProperty").each(function(idx,property){
                    if ( $(property).find("Type").text() == "WorkflowStatus")
                    workflowNames.push($(property).find("Title").text())
                })
            }

        });
        return workflowNames;
    }

    return $;

});