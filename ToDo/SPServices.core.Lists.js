/**
 * Lists module
 */
define([
    "jquery",
    "../src/utils/constants",
    "../core/SPServices.utils.js"
], function (
    $,
    utils,
    constants
) {

    "use strict";

    SPServices.WebServices.Lists = "Lists";
    SPServices.WebServices.Lists.WSOps = SPServices.WebServices.Lists.WSOps || {};

    SPServices.WebServices.Lists.WSOps.AddAttachment = [SPServices.WebServices.LISTS, true];
    SPServices.WebServices.Lists.WSOps.AddDiscussionBoardItem = [SPServices.WebServices.LISTS, true];
/*
    WSops.CheckInFile = [webServices.LISTS, true];
    WSops.CheckOutFile = [webServices.LISTS, true];
    WSops.CreateContentType = [webServices.LISTS, true];
    WSops.DeleteAttachment = [webServices.LISTS, true];
    WSops.DeleteContentType = [webServices.LISTS, true];
    WSops.DeleteContentTypeXmlDocument = [webServices.LISTS, true];
    WSops.DeleteList = [webServices.LISTS, true];
    WSops.GetAttachmentCollection = [webServices.LISTS, false];
    WSops.GetList = [webServices.LISTS, false];
    WSops.GetListAndView = [webServices.LISTS, false];
    WSops.GetListCollection = [webServices.LISTS, false];
    WSops.GetListContentType = [webServices.LISTS, false];
    WSops.GetListContentTypes = [webServices.LISTS, false];
    WSops.GetListItemChanges = [webServices.LISTS, false];
    WSops.GetListItemChangesSinceToken = [webServices.LISTS, false];
    WSops.GetListItems = [webServices.LISTS, false];
    WSops.GetVersionCollection = [webServices.LISTS, false];
    WSops.UndoCheckOut = [webServices.LISTS, true];
    WSops.UpdateContentType = [webServices.LISTS, true];
    WSops.UpdateContentTypesXmlDocument = [webServices.LISTS, true];
    WSops.UpdateContentTypeXmlDocument = [webServices.LISTS, true];
    WSops.UpdateList = [webServices.LISTS, true];
    WSops.UpdateListItems = [webServices.LISTS, true];
*/
    utils.utils.SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/'>";
    SPServices.SOAP.Action = constants.SCHEMASharePoint + "/soap/";


    /*
        // Add the operation to the SOAPAction and opfooter
            // LIST OPERATIONS
            case "AddAttachment":
                utils.utils.addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
                break;
            case "AddDiscussionBoardItem":
                utils.utils.addToPayload(opt, ["listName", "message"]);
                break;
            case "AddList":
                utils.addToPayload(opt, ["listName", "description", "templateID"]);
                break;
            case "AddListFromFeature":
                utils.addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
                break;
            case "ApplyContentTypeToList":
                utils.addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
                break;
            case "CheckInFile":
                utils.addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
                break;
            case "CheckOutFile":
                utils.addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                break;
            case "CreateContentType":
                utils.addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                break;
            case "DeleteAttachment":
                utils.addToPayload(opt, ["listName", "listItemID", "url"]);
                break;
            case "DeleteContentType":
                utils.addToPayload(opt, ["listName", "contentTypeId"]);
                break;
            case "DeleteContentTypeXmlDocument":
                utils.addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
                break;
            case "DeleteList":
                utils.addToPayload(opt, ["listName"]);
                break;
            case "GetAttachmentCollection":
                utils.addToPayload(opt, ["listName", ["listItemID", "ID"]]);
                break;
            case "GetList":
                utils.addToPayload(opt, ["listName"]);
                break;
            case "GetListAndView":
                utils.addToPayload(opt, ["listName", "viewName"]);
                break;
            case "GetListCollection":
                break;
            case "GetListContentType":
                utils.addToPayload(opt, ["listName", "contentTypeId"]);
                break;
            case "GetListContentTypes":
                utils.addToPayload(opt, ["listName"]);
                break;
            case "GetListItems":
                utils.addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
                    ["viewFields", "CAMLViewFields"],
                    ["rowLimit", "CAMLRowLimit"],
                    ["queryOptions", "CAMLQueryOptions"]
                ]);
                break;
            case "GetListItemChanges":
                utils.addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
                break;
            case "GetListItemChangesSinceToken":
                utils.addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
                    ["viewFields", "CAMLViewFields"],
                    ["rowLimit", "CAMLRowLimit"],
                    ["queryOptions", "CAMLQueryOptions"], {
                        name: "changeToken",
                        sendNull: false
                    }, {
                        name: "contains",
                        sendNull: false
                    }
                ]);
                break;
            case "GetVersionCollection":
                utils.addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]);
                break;
            case "UndoCheckOut":
                utils.addToPayload(opt, ["pageUrl"]);
                break;
            case "UpdateContentType":
                utils.addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                break;
            case "UpdateContentTypesXmlDocument":
                utils.addToPayload(opt, ["listName", "newDocument"]);
                break;
            case "UpdateContentTypeXmlDocument":
                utils.addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
                break;
            case "UpdateList":
                utils.addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                break;
            case "UpdateListItems":
                utils.addToPayload(opt, ["listName"]);
                if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                    utils.addToPayload(opt, ["updates"]);
                } else {
                    utils.utils.SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
                    for (i = 0; i < opt.valuepairs.length; i++) {
                        utils.utils.SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + utils.escapeColumnValue(opt.valuepairs[i][1]) + "</Field>";
                    }
                    if (opt.batchCmd !== "New") {
                        utils.utils.SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
                    }
                    utils.utils.SOAPEnvelope.payload += "</Method></Batch></updates>";
                }
                break;
*/

});
