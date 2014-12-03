/*
 * SPServices - Work with SharePoint's Web Services using jQuery
 * Version 0.5.5
 * @requires jQuery v1.3.2 or greater
 *
 * Copyright (c) 2009-2010 Sympraxis Consulting LLC
 * Examples and docs at:
 * http://spservices.codeplex.com
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @description Work with SharePoint's Web Services using jQuery
 * @type jQuery
 * @name SPServices
 * @category Plugins/SPServices
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */

(function($) {

	// String constants
	//   General
	var SLASH					= "/";

	//   Web Service names
	var ALERTS					= "Alerts";
	var AUTHENTICATION			= "Authentication";
	var COPY					= "Copy";
	var FORMS					= "Forms";
	var LISTS					= "Lists";
	var MEETINGS				= "Meetings";
	var PEOPLE					= "People";
	var PERMISSIONS				= "Permissions";
	var PUBLISHEDLINKSSERVICE	= "PublishedLinksService";
	var SEARCH					= "Search";
	var USERGROUP				= "usergroup";
	var USERPROFILESERVICE		= "UserProfileService";
	var VERSIONS				= "Versions";
	var VIEWS					= "Views";
	var WEBPARTPAGES			= "WebPartPages";
	var WEBS					= "Webs";
	var WORKFLOW				= "Workflow";

	// Global variables
	var thisSite = "";

	// Array to store Web Service / operation associations and whether each operation
	// needs to have the SOAPAction passed in the setRequestHeaderfunction.
	// 	WSops["OpName"] = [WebService, needs_SOAPAction]; 
	var WSops = new Array();

	WSops["GetAlerts"]								= [ALERTS, false];
	WSops["DeleteAlerts"]							= [ALERTS, true];

	WSops["Mode"]									= [AUTHENTICATION, false];
	WSops["Login"]									= [AUTHENTICATION, false];

	WSops["CopyIntoItems"]							= [COPY, true];
	WSops["CopyIntoItemsLocal"]						= [COPY, true];
	WSops["GetItem"]								= [COPY, false];

	WSops["GetForm"]								= [FORMS, false];
	WSops["GetFormCollection"]						= [FORMS, false];

	WSops["AddAttachment"]							= [LISTS, true];
	WSops["AddList"]								= [LISTS, true];
	WSops["CheckInFile"]							= [LISTS, true];
	WSops["CheckOutFile"]							= [LISTS, true];
	WSops["DeleteList"]								= [LISTS, true];
	WSops["GetAttachmentCollection"]				= [LISTS, false];
	WSops["GetList"]								= [LISTS, false];
	WSops["GetListAndView"]							= [LISTS, false];
	WSops["GetListCollection"]						= [LISTS, false];
	WSops["GetListContentType"]						= [LISTS, false];
	WSops["GetListContentTypes"]					= [LISTS, false];
	WSops["GetListItems"]							= [LISTS, false];
	WSops["UpdateList"]								= [LISTS, true];
	WSops["UpdateListItems"]						= [LISTS, true];

	WSops["AddMeeting"]								= [MEETINGS, true];
	WSops["CreateWorkspace"]						= [MEETINGS, true];
	WSops["RemoveMeeting"]							= [MEETINGS, true];
	WSops["SetWorkSpaceTitle"]						= [MEETINGS, true];

	WSops["SearchPrincipals"]						= [PEOPLE, false];

	WSops["AddPermission"]							= [PERMISSIONS, true];
	WSops["AddPermissionCollection"]				= [PERMISSIONS, true];
	WSops["GetPermissionCollection"]				= [PERMISSIONS, true];
	WSops["RemovePermission"]						= [PERMISSIONS, true];
	WSops["RemovePermissionCollection"]				= [PERMISSIONS, true];
	WSops["UpdatePermission"]						= [PERMISSIONS, true];

	WSops["GetLinks"]								= [PUBLISHEDLINKSSERVICE, true];

	WSops["GetPortalSearchInfo"]					= [SEARCH, false];
	WSops["GetSearchMetadata"]						= [SEARCH, false];
	WSops["Query"]									= [SEARCH, false];
	WSops["QueryEx"]								= [SEARCH, false];
	WSops["Status"]									= [SEARCH, false];

	WSops["AddGroup"]								= [USERGROUP, true];
	WSops["AddGroupToRole"]							= [USERGROUP, true];
	WSops["AddRole"]								= [USERGROUP, true];
	WSops["GetAllUserCollectionFromWeb"]			= [USERGROUP, false];
	WSops["GetGroupCollection"]						= [USERGROUP, false];
	WSops["GetGroupCollectionFromRole"]				= [USERGROUP, false];
	WSops["GetGroupCollectionFromSite"]				= [USERGROUP, false];
	WSops["GetGroupCollectionFromUser"]				= [USERGROUP, false];
	WSops["GetGroupCollectionFromWeb"]				= [USERGROUP, false];
	WSops["GetGroupInfo"]							= [USERGROUP, false];
	WSops["GetRoleCollection"]						= [USERGROUP, false];
	WSops["GetRoleCollectionFromGroup"]				= [USERGROUP, false];
	WSops["GetRoleCollectionFromUser"]				= [USERGROUP, false];
	WSops["GetRoleCollectionFromWeb"]				= [USERGROUP, false];
	WSops["GetRolesAndPermissionsForCurrentUser"]	= [USERGROUP, false];
	WSops["GetRolesAndPermissionsForSite"]			= [USERGROUP, false];
	WSops["GetUserCollection"]						= [USERGROUP, false];
	WSops["GetUserCollectionFromGroup"]				= [USERGROUP, false];
	WSops["GetUserCollectionFromRole"]				= [USERGROUP, false];
	WSops["GetUserCollectionFromSite"]				= [USERGROUP, false];
	WSops["GetUserCollectionFromWeb"]				= [USERGROUP, false];
	WSops["GetUserInfo"]							= [USERGROUP, false];
	WSops["GetUserLoginFromEmail"]					= [USERGROUP, false];
	WSops["RemoveGroup"]							= [USERGROUP, true];

	WSops["GetCommonMemberships"]					= [USERPROFILESERVICE, false];
	WSops["GetUserColleagues"]						= [USERPROFILESERVICE, false];
	WSops["GetUserLinks"]							= [USERPROFILESERVICE, false];
	WSops["GetUserMemberships"]						= [USERPROFILESERVICE, false];
	WSops["GetUserPinnedLinks"]						= [USERPROFILESERVICE, false];
	WSops["GetUserProfileByName"]					= [USERPROFILESERVICE, false];
	WSops["GetUserProfileCount"]					= [USERPROFILESERVICE, false];
	WSops["GetUserProfileSchema"]					= [USERPROFILESERVICE, false];
	WSops["ModifyUserPropertyByAccountName"]		= [USERPROFILESERVICE, true];

	WSops["DeleteAllVersions"]						= [VERSIONS, true];
	WSops["DeleteVersion"]							= [VERSIONS, true];
	WSops["GetVersions"]							= [VERSIONS, false];
	WSops["RestoreVersion"]							= [VERSIONS, true];

	WSops["GetViewCollection"]						= [VIEWS, false];

	WSops["AddWebPart"]								= [WEBPARTPAGES, true];
	WSops["GetWebPart2"]							= [WEBPARTPAGES, false];
	WSops["GetWebPartPage"]							= [WEBPARTPAGES, false];
	WSops["GetWebPartProperties"]					= [WEBPARTPAGES, false];
	WSops["GetWebPartProperties2"]					= [WEBPARTPAGES, false];

	WSops["GetListTemplates"]						= [WEBS, false];
	WSops["GetWeb"]									= [WEBS, false];
	WSops["GetWebCollection"]						= [WEBS, false];
	WSops["GetAllSubWebCollection"]					= [WEBS, false];
	WSops["WebUrlFromPageUrl"]						= [WEBS, false];

	WSops["GetTemplatesForItem"]					= [WORKFLOW, false];
	WSops["GetToDosForItem"]						= [WORKFLOW, false];
	WSops["GetWorkflowDataForItem"]					= [WORKFLOW, false];
	WSops["GetWorkflowTaskData"]					= [WORKFLOW, false];
	WSops["StartWorkflow"]							= [WORKFLOW, true];

	// Set up SOAP envelope
	var SOAPEnvelope = new Object();
	SOAPEnvelope.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
	SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
	SOAPEnvelope.payload = "";

	// Main function, which calls SharePoint's Web Services directly.
	$.fn.SPServices = function(options) {

		// If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
		var opt = $.extend({}, $.fn.SPServices.defaults, options);

		// Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
		SOAPEnvelope.opheader = "<" + opt.operation + " ";
		switch(WSops[opt.operation][0]) {
			case ALERTS:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/";
 				break;
			case MEETINGS:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/meetings/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/meetings/";
 				break;
			case PERMISSIONS:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/";
 				break;
			case PUBLISHEDLINKSSERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
 				break;
			case SEARCH:
				SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
				SOAPAction = "urn:Microsoft.Search/";
 				break;
			case USERGROUP:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/";
				break;
			case USERPROFILESERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
				break;
			case WEBPARTPAGES:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
				SOAPAction = "http://microsoft.com/sharepoint/webpartpages/";
				break;
			case WORKFLOW:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/workflow/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/workflow/";
				break;
			default:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/'>";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/";
 				break;
		}
		SOAPAction += opt.operation;
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";
		// Build the URL for the Ajax call based on which operation we're calling
		// If the webURL has been provided, then use it, else use the current site
		var ajaxURL = ((opt.webURL.length > 0) ? opt.webURL : $().SPServices.SPGetCurrentSite()) +
				"/_vti_bin/" + WSops[opt.operation][0] + ".asmx";

		SOAPEnvelope.payload = "";
		// Each operation requires a different set of values.  This switch statement sets them up in the SOAPEnvelope.payload.
		switch(opt.operation) {
			// ALERT OPERATIONS
			case "GetAlerts":
				break;
			case "DeleteAlerts":
				SOAPEnvelope.payload += "<IDs>";
				for (i=0; i < opt.IDs.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.IDs[i]);
				}
				SOAPEnvelope.payload += "</IDs>";
				break;

			// AUTHENTICATION OPERATIONS
			case "Mode":
				break;
			case "Login":
				SOAPEnvelope.payload += wrapNode("username", opt.username);
				SOAPEnvelope.payload += wrapNode("password", opt.password);
				break;

			// COPY OPERATIONS
			case "CopyIntoItems":
				SOAPEnvelope.payload += wrapNode("SourceUrl", opt.SourceUrl);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				SOAPEnvelope.payload += wrapNode("Fields", opt.Fields);
				SOAPEnvelope.payload += wrapNode("Stream", opt.Stream);
				SOAPEnvelope.payload += wrapNode("Results", opt.Results);
				break;
			case "CopyIntoItemsLocal":
				SOAPEnvelope.payload += wrapNode("SourceUrl", opt.SourceUrl);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				break;
			case "GetItem":
				SOAPEnvelope.payload += wrapNode("Url", opt.Url);
				SOAPEnvelope.payload += wrapNode("Fields", opt.Fields);
				SOAPEnvelope.payload += wrapNode("Stream", opt.Stream);
				break;

			// FORM OPERATIONS
			case "GetForm":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("formUrl", opt.formUrl);
				break;
			case "GetFormCollection":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				break;

			// LIST OPERATIONS
			case "AddAttachment":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("listItemID", opt.listItemID);
				SOAPEnvelope.payload += wrapNode("fileName", opt.fileName);
				SOAPEnvelope.payload += wrapNode("attachment", opt.attachment);
				break;
			case "AddList":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("description", opt.description);
				SOAPEnvelope.payload += wrapNode("templateID", opt.templateID);
				break;
			case "CheckInFile":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("comment", opt.comment);
				SOAPEnvelope.payload += wrapNode("CheckinType", opt.CheckinType);
				break;
			case "CheckOutFile":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("checkoutToLocal", opt.checkoutToLocal);
				SOAPEnvelope.payload += wrapNode("lastmodified", opt.lastmodified);
				break;
			case "DeleteList":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				break;
			case "GetAttachmentCollection":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("listItemID", opt.ID);
				break;
			case "GetList":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				break;
			case "GetListAndView":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("viewName", opt.viewName);
				break;
			case "GetListCollection":
				break;
			case "GetListContentType":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("contentTypeId", opt.contentTypeId);
				break;
			case "GetListContentTypes":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				break;
			case "GetListItems":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("viewName", opt.viewName);
				SOAPEnvelope.payload += wrapNode("query", opt.CAMLQuery);
				SOAPEnvelope.payload += wrapNode("viewFields", opt.CAMLViewFields);
				SOAPEnvelope.payload += wrapNode("rowLimit", opt.CAMLRowLimit);
				SOAPEnvelope.payload += wrapNode("queryOptions", opt.CAMLQueryOptions);
				break;
			case "UpdateList":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("listProperties", opt.listProperties);
				SOAPEnvelope.payload += wrapNode("newFields", opt.newFields);
				SOAPEnvelope.payload += wrapNode("updateFields", opt.updateFields);
				SOAPEnvelope.payload += wrapNode("deleteFields", opt.deleteFields);
				SOAPEnvelope.payload += wrapNode("listVersion", opt.listVersion);
				break;
			case "UpdateListItems":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				if(opt.updates.length > 0) {
					SOAPEnvelope.payload += wrapNode("updates", opt.updates);
				} else {
					SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
					for (i=0; i < opt.valuepairs.length; i++) {
						SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + opt.valuepairs[i][1] + "</Field>";
					}
					SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
					SOAPEnvelope.payload += "</Method></Batch></updates>";
				}
				break;

			// MEETINGS OPERATIONS
			case "AddMeeting":
				SOAPEnvelope.payload += wrapNode("organizerEmail", opt.organizerEmail);
				SOAPEnvelope.payload += wrapNode("uid", opt.uid);
				SOAPEnvelope.payload += wrapNode("sequence", opt.sequence);
				SOAPEnvelope.payload += wrapNode("utcDateStamp", opt.utcDateStamp);
				SOAPEnvelope.payload += wrapNode("title", opt.title);
				SOAPEnvelope.payload += wrapNode("location", opt.location);
				SOAPEnvelope.payload += wrapNode("utcDateStart", opt.utcDateStart);
				SOAPEnvelope.payload += wrapNode("utcDateEnd", opt.utcDateEnd);
				SOAPEnvelope.payload += wrapNode("nonGregorian", opt.nonGregorian);
				break;
			case "CreateWorkspace":
				SOAPEnvelope.payload += wrapNode("title", opt.title);
				SOAPEnvelope.payload += wrapNode("templateName", opt.templateName);
				SOAPEnvelope.payload += wrapNode("lcid", opt.lcid);
				SOAPEnvelope.payload += wrapNode("timeZoneInformation", opt.timeZoneInformation);
			case "RemoveMeeting":
				SOAPEnvelope.payload += wrapNode("recurrenceId", opt.recurrenceId);
				SOAPEnvelope.payload += wrapNode("uid", opt.uid);
				SOAPEnvelope.payload += wrapNode("sequence", opt.sequence);
				SOAPEnvelope.payload += wrapNode("utcDateStamp", opt.utcDateStamp);
				SOAPEnvelope.payload += wrapNode("cancelMeeting", opt.cancelMeeting);
			case "SetWorkspaceTitle":
				SOAPEnvelope.payload += wrapNode("title", opt.title);

			// PEOPLE OPERATIONS
			case "SearchPrincipals":
				SOAPEnvelope.payload += wrapNode("searchText", opt.searchText);
				SOAPEnvelope.payload += wrapNode("maxResults", opt.maxResults);
				SOAPEnvelope.payload += wrapNode("principalType", opt.principalType);
				break;

			// PERMISSION OPERATIONS
			case "AddPermission":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				SOAPEnvelope.payload += wrapNode("permissionIdentifier", opt.permissionIdentifier);
				SOAPEnvelope.payload += wrapNode("permissionType", opt.permissionType);
				SOAPEnvelope.payload += wrapNode("permissionMask", opt.permissionMask);
				break;
			case "AddPermissionCollection":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				SOAPEnvelope.payload += wrapNode("permissionsInfoXml", opt.permissionsInfoXml);
				break;
			case "GetPermissionCollection":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				break;
			case "RemovePermission":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				SOAPEnvelope.payload += wrapNode("permissionIdentifier", opt.permissionIdentifier);
				SOAPEnvelope.payload += wrapNode("permissionType", opt.permissionType);
				break;
			case "RemovePermissionCollection":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				SOAPEnvelope.payload += wrapNode("memberIdsXml", opt.memberIdsXml);
				break;
			case "UpdatePermission":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				SOAPEnvelope.payload += wrapNode("permissionIdentifier", opt.permissionIdentifier);
				SOAPEnvelope.payload += wrapNode("permissionType", opt.permissionType);
				SOAPEnvelope.payload += wrapNode("permissionMask", opt.permissionMask);
				break;

			// PUBLISHEDLINKSSERVICE OPERATIONS
			case "GetLinks":
				break;

			// SEARCH OPERATIONS
			case "GetPortalSearchInfo":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'/>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				break;
			case "GetSearchMetadata":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'/>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				break;
			case "Query":
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "QueryEx":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "Status":
				break;

			// USERS AND GROUPS OPERATIONS
			case "AddGroup":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				SOAPEnvelope.payload += wrapNode("ownerIdentifier", opt.ownerIdentifier);
				SOAPEnvelope.payload += wrapNode("ownerType", opt.ownerType);
				SOAPEnvelope.payload += wrapNode("defaultUserLoginName", opt.defaultUserLoginName);
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				SOAPEnvelope.payload += wrapNode("description", opt.description);
				break;
			case "AddGroupToRole":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				SOAPEnvelope.payload += wrapNode("roleName", opt.roleName);
				break;
			case "AddRole":
				SOAPEnvelope.payload += wrapNode("roleName", opt.roleName);
				SOAPEnvelope.payload += wrapNode("description", opt.description);
				SOAPEnvelope.payload += wrapNode("permissionMask", opt.permissionMask);
				break;
			case "GetAllUserCollectionFromWeb":
				break;
			case "GetGroupCollectionFromRole":
				SOAPEnvelope.payload += wrapNode("roleName", opt.roleName);
				break;
			case "GetGroupCollection":
				SOAPEnvelope.payload += wrapNode("groupNamesXml", opt.groupNamesXml);
				break;
			case "GetGroupCollectionFromSite":
				break;
			case "GetGroupCollectionFromUser":
				SOAPEnvelope.payload += wrapNode("userLoginName", opt.userLoginName);
				break;
			case "GetGroupCollectionFromWeb":
				break;
			case "GetGroupInfo":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				break;
			case "GetRoleCollection":
				SOAPEnvelope.payload += wrapNode("roleNamesXml", opt.roleNamesXml);
				break;
			case "GetRoleCollectionFromGroup":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				break;
			case "GetRoleCollectionFromUser":
				SOAPEnvelope.payload += wrapNode("userLoginName", opt.userLoginName);
				break;
			case "GetRoleCollectionFromWeb":
				break;
			case "GetRoleInfo":
				SOAPEnvelope.payload += wrapNode("roleName", opt.roleName);
				break;
			case "GetRolesAndPermissionsForCurrentUser":
				break;
			case "GetRolesAndPermissionsForSite":
				break;
			case "GetUserCollection":
				SOAPEnvelope.payload += wrapNode("userLoginNamesXml", opt.userLoginNamesXml);
				break;
			case "GetUserCollectionFromGroup":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				break;
			case "GetUserCollectionFromRole":
				SOAPEnvelope.payload += wrapNode("roleName", opt.roleName);
				break;
			case "GetUserCollectionFromSite":
				break;
			case "GetUserCollectionFromWeb":
				break;
			case "GetUserInfo":
				SOAPEnvelope.payload += wrapNode("userLoginName", opt.userLoginName);
				break;
			case "GetUserLoginFromEmail":
				SOAPEnvelope.payload += wrapNode("emailXml", opt.emailXml);
				break;
			case "RemoveGroup":
				SOAPEnvelope.payload += wrapNode("groupName", opt.groupName);
				break;

			// USERPROFILESERVICE OPERATIONS
			case "GetCommonMemberships":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				break;
			case "GetUserColleagues":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				break;
			case "GetUserLinks":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				break;
			case "GetUserMemberships":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				break;
			case "GetUserPinnedLinks":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				break;
			case "GetUserProfileByName":
				// Note that this operation is inconsistent with the others, using AccountName rather than accountName
				if(opt.accountName.length > 0)
					SOAPEnvelope.payload += wrapNode("AccountName", opt.accountName)
				else
					SOAPEnvelope.payload += wrapNode("AccountName", opt.AccountName);
				break;
			case "GetUserProfileCount":
				break;
			case "GetUserProfileSchema":
				break;
			case "ModifyUserPropertyByAccountName":
				SOAPEnvelope.payload += wrapNode("accountName", opt.accountName);
				SOAPEnvelope.payload += wrapNode("newData", opt.newData);
				break;

			// VIEW OPERATIONS
			case "GetViewCollection":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				break;

			// VERSIONS OPERATIONS
			case "DeleteAllVersions":
				SOAPEnvelope.payload += wrapNode("fileName", opt.fileName);
				break;
			case "DeleteVersion":
				SOAPEnvelope.payload += wrapNode("fileName", opt.fileName);
				SOAPEnvelope.payload += wrapNode("fileVersion", opt.fileVersion);
				break;
			case "GetVersions":
				SOAPEnvelope.payload += wrapNode("fileName", opt.fileName);
				break;
			case "RestoreVersion":
				SOAPEnvelope.payload += wrapNode("fileName", opt.fileName);
				SOAPEnvelope.payload += wrapNode("fileVersion", opt.fileVersion);
				break;

			// WEBPARTPAGES OPERATIONS
			case "AddWebPart":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("webPartXml", opt.webPartXml);
				SOAPEnvelope.payload += wrapNode("storage", opt.storage);
				break;
			case "GetWebPart2":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("storageKey", opt.storageKey);
				SOAPEnvelope.payload += wrapNode("storage", opt.storage);
				SOAPEnvelope.payload += wrapNode("behavior", opt.behavior);
				break;
			case "GetWebPartPage":
				SOAPEnvelope.payload += wrapNode("documentName", opt.documentName);
				SOAPEnvelope.payload += wrapNode("behavior", opt.behavior);
				break;
			case "GetWebPartProperties":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("storage", opt.storage);
				break;
			case "GetWebPartProperties2":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageUrl);
				SOAPEnvelope.payload += wrapNode("storage", opt.storage);
				SOAPEnvelope.payload += wrapNode("behavior", opt.behavior);
				break;

			// WEB OPERATIONS
			case "GetWeb":
				SOAPEnvelope.payload += wrapNode("webUrl", opt.webURL);
				break;
			case "GetListTemplates":
				break;
			case "GetWebCollection":
				break;
			case "GetAllSubWebCollection":
				break;
			case "WebUrlFromPageUrl":
				SOAPEnvelope.payload += wrapNode("pageUrl", opt.pageURL);
				break;

			// WORKFLOW OPERATIONS
			case "GetTemplatesForItem":
				SOAPEnvelope.payload += wrapNode("item", opt.item);
				break;
			case "GetToDosForItem":
				SOAPEnvelope.payload += wrapNode("item", opt.item);
				break;
			case "GetWorkflowDataForItem":
				SOAPEnvelope.payload += wrapNode("item", opt.item);
				break;
			case "GetWorkflowTaskData":
				SOAPEnvelope.payload += wrapNode("item", opt.item);
				SOAPEnvelope.payload += wrapNode("listId", opt.listId);
				SOAPEnvelope.payload += wrapNode("taskId", opt.taskId);
				break;
			case "StartWorkflow":
				SOAPEnvelope.payload += wrapNode("item", opt.item);
				SOAPEnvelope.payload += wrapNode("templateId", opt.templateId);
				SOAPEnvelope.payload += wrapNode("workflowParameters", opt.workflowParameters);
				break;

			default:
				break;
		}

		// Glue together the pieces of the SOAP message
		var msg = SOAPEnvelope.header +
			SOAPEnvelope.opheader +
			SOAPEnvelope.payload +
			SOAPEnvelope.opfooter +
			SOAPEnvelope.footer;

		// Make the Ajax call
		$.ajax({
			url: ajaxURL,											// The relative URL for the AJAX call
			async: opt.async,										// By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
			beforeSend: function (xhr) {							// Before sending the msg, need to send the request header
				// If we need to pass the SOAPAction, do so
				if(WSops[opt.operation][1]) xhr.setRequestHeader("SOAPAction", SOAPAction);
			},
			type: "POST",											// This is a POST
			data: msg,												// Here is the SOAP request we've built above
			dataType: "xml",										// We're sending XML
			contentType: "text/xml; charset='utf-8'",				// and this is its content type
			complete: opt.completefunc								// When the call is complete, do this
		});
	};

	// Defaults added as a function in our library means that the caller can override the defaults
	// for their session by calling this function.  Each operation requires a different set of options;
	// we allow for all in a standardized way.
	$.fn.SPServices.defaults = {
		operation: "",				// The Web Service operation
		webURL: "",					// URL of the target Web
		pageURL: "",				// URL of the target page
		listName: "",				// Name of the list for list operations
		description: "",			// Description field (used by many operations)
		templateID: "",				// An integer that specifies the list template to use
		viewName: "",				// Name of the view for list operations
		formUrl: "",				// URL of the form for form operations
		fileName: "",				// Name of the file for file operations
		fileVersion: "",			// The number of the file version.
		ID: 1,						// ID of the item for list operations
		updates: "",				// A Batch element that contains one or more methods for adding, modifying, or deleting items and that can be assigned to a System.Xml.XmlNode object.
		comment: "",				// Comment for checkins
		CheckinType: "",			// One of the values 0, 1 or 2, where 0 = MinorCheckIn, 1 = MajorCheckIn, and 2 = OverwriteCheckIn.
		checkoutToLocal: "",		// A string containing "true" or "false" that designates whether the file is to be flagged as checked out for offline editing.
		lastmodified: "",			// A string in RFC 1123 date format representing the date and time of the last modification to the file; for example, "20 Jun 1982 12:00:00 GMT".

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// View name in CAML format.
		CAMLQuery: "",				// Query in CAML format
		CAMLViewFields: "",			// View fields in CAML format
	 	CAMLRowLimit: 0,			// Row limit as a string representation of an integer
		CAMLQueryOptions: "<QueryOptions></QueryOptions>",		// Query options in CAML format

		// Abstractions for CAML syntax
		batchCmd: "Update",			// Method Cmd for UpdateListItems
		valuepairs: [],				// Fieldname / Fieldvalue pairs for UpdateListItems

		// List options
		listProperties: "",			// An XML fragment that contains all the list properties to be updated.
		newFields: "",				// An XML fragment that contains Field elements inside method blocks so that the add operations can be tracked individually.
		updateFields: "",			// An XML fragment that contains Field elements inside method blocks so that the update operations can be tracked individually.
		deleteFields: "",			// An XML fragment that contains Field elements specifying the names of the fields to delete inside method blocks so that the delete operations can be tracked individually.
		listVersion: "",			// A string that contains the version of the list that is being updated so that conflict detection can be performed.
		contentTypeId: "",			// A string that represents the content type ID of the content type.

		username: "",				// Username for the Login operation
		password: "",				// Password for the Login operation
		accountName: "",			// User login in domain/user format for UserProfileService operations
		newData: "",				// New property name and values.
		AccountName: "",			// User login in domain/user format for UserProfileService operations
		userLoginName: "",			// User login in domain/user format for user operations
		groupNamesXml: "",			// XML that specifies one or more group definition names
		groupName: "",				// A string that contains the name of the group definition
		ownerIdentifier: "",		// A string that contains the user name (DOMAIN\User_Alias) of the owner for the group
		ownerType: "",				// A string that specifies the type of owner, which can be either user or group
		defaultUserLoginName: "",	// A string that contains the user name (DOMAIN\User_Alias) of the default user for the group
		roleNamesXml: "",			// XML that specifies one or more role definition names
		roleName: "",				// A string that contains the name of the role definition
		permissionIdentifier: "",	// A string that contains the name of the site group, the name of the cross-site group, or the user name (DOMAIN\User_Alias) of the user to whom the permission applies.
		permissionType: "",			// A string that specifies user, group (cross-site group), or role (site group). The user or cross-site group has to be valid, and the site group has to already exist on the site.
		permissionMask: "",			// A string representation of the 32-bit integer in decimal format that represents a Microsoft.SharePoint.SPRights value
		permissionsInfoXml: "",		// An XML fragment that specifies the permissions to add and that can be passed as a System.Xml.XmlNode object
		memberIdsXml: "",			// An XML fragment that specifies the permissions to remove and that can be passed as a System.Xml.XmlNode object
		userLoginNamesXml: "",		// XML that contains information about the users
		emailXml: "",				// A string that contains email address
		objectName: "",				// objectName for operations which require it
		objectType: "List",			// objectType for operations which require it
		IDs: null,					// List of GUIDs
		listItemID: "",				// A string that contains the ID of the item to which attachments are added. This value does not correspond to the index of the item within the collection of list items.
		attachment: "",				// A byte array that contains the file to attach by using base-64 encoding.

		SourceUrl: "",				// Source URL for copy operations
		Url: "",					// String that contains the absolute source (on the server to which the SOAP request is sent) of the document that is to be retrieved. 
		DestinationUrls: [],		// Array of destination URLs for copy operations
		Fields: "",					// An array of FieldInformation objects, passed as an out parameter, that represent the fields and the corresponding field values that can be copied from the retrieved document.
		Stream: "",					// An array of Bytes, passed as an out parameter, that is a base-64 representation of the retrieved document's binary data.
		Results: "",				// An array of CopyResult objects, passed as an out parameter.

		documentName: "",			// The name of the Web Part Page.
		behavior: "Version3", 		// An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
		storageKey: "",				// A GUID that identifies the Web Part
		storage: "Shared",			// A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
		webPartXml: "",				// A string containing the XML of the Web Part.

		item: "",					// The URL location of an item on which a workflow is being run.
		listId: "",					// Globally unique identifier (GUID) of a task list containing the task
		taskId: "",					// Unique identifier (ID) of a task
		templateId: "",				// Globally unique identifier (GUID) of a template
		workflowParameters: "",		// The initiation form data
		fClaim: false,				// Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.

		queryXml: "",				// A string specifying the search query XML

		cancelMeeting: true,		// true to delete a meeting; false to remove its association with a Meeting Workspace site
		lcid: "",					// The LCID (locale identifier) to use when the site is created.
		location: "",				// The location of the meeting.
		nonGregorian: false,		// true if the calendar is set to a format other than Gregorian; otherwise, false.
		organizerEmail: "",			// The e-mail address, specified as email_address@domain.ext, for the meeting organizer.
		recurrenceId: 0,			// The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings. 
		sequence: 0,				// An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
		templateName: "",			// The name of the template to use when the site is created. See Windows SharePoint Services template naming guidelines for specifying a configuration within a template.
		timeZoneInformation: "",	// The time zone information to use when the site is created.
		title: "",					// The title (subject) of the meeting OR The title for the Meeting Workspace site that will be created.
		uid: "",					// A persistent GUID for the calendar component.
		utcDateStamp: "",			// This parameter needs to be in the UTC format (for example, 2003-03-04T04:45:22-08:00).
		utcDateStart: "",			// The start date and time for the meeting, expressed in UTC.
		utcDateEnd: "",				// The end date and time for the meeting, expressed in Coordinated Universal Time (UTC).

		searchText: "",				// Principal logon name.
		maxResults: 10,				// Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
		principalType: "User",		// Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

		async: true,				// Allow the user to force async
		completefunc: null			// Function to call on completion
	};

	// Function to determine the current Web's URL.  We need this for successful Ajax calls.
	// The function is also available as a public function.
	$.fn.SPServices.SPGetCurrentSite = function() {
		// Do we already know the current site?
		if(thisSite.length > 0) return thisSite;
		
		var msg = SOAPEnvelope.header +
				"<WebUrlFromPageUrl xmlns='http://schemas.microsoft.com/sharepoint/soap/' ><pageUrl>" +
				((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
				"</pageUrl></WebUrlFromPageUrl>" +
				SOAPEnvelope.footer;
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: "/_vti_bin/Webs.asmx",
//			beforeSend: function (xhr) {
//				xhr.setRequestHeader("SOAPAction",
//					"http://schemas.microsoft.com/sharepoint/soap/WebUrlFromPageUrl");
//			},
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\"",
			complete: function (xData, Status) {
				thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
			}
		});
		return thisSite; // Return the URL
	};

	// Function to set up cascading dropdowns on a SharePoint form
	// (Newform.aspx, EditForm.aspx, or any other customized form.)
	$.fn.SPServices.SPCascadeDropdowns = function(options) {

		var opt = $.extend({}, {
			relationshipWebURL: "",				// [Optional] The name of the Web (site) which contains the relationships list
			relationshipList: "",				// The name of the list which contains the parent/child relationships
			relationshipListParentColumn: "",	// The internal name of the parent column in the relationship list
			relationshipListChildColumn: "",	// The internal name of the child column in the relationship list
			relationshipListSortColumn: "",		// [Optional] If specified, sort the options in the dropdown by this column,
												// otherwise the options are sorted by relationshipListChildColumn
			parentColumn: "",					// The display name of the parent column in the form
			childColumn: "",					// The display name of the child column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			promptText: "Choose {0}...",		// [Optional] Text to use as prompt. If included, {0} will be replaced with the value of childColumn
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages; if false, run silent
		}, options);

		// Find the parent column's select (dropdown)
		var parentSelect = new dropdownCtl(opt.parentColumn);
		if(parentSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPCascadeDropdowns", "parentColumn: " + opt.parentColumn, "Column not found on page"); return; }

		switch(parentSelect.Type) {
			// Plain old select
			case "S":
				parentSelect.Obj.bind("change", function() {
					cascadeDropdown(opt);
				});
				// Fire the change to set the allowable values
				parentSelect.Obj.change();
				break;
			// Input / Select hybrid
			case "C":
				parentSelect.Obj.bind("propertychange", function() {
					cascadeDropdown(opt);
				});
				// Fire the change to set the allowable values
				parentSelect.Obj.trigger("propertychange");
				break;
			// Multi-select hybrid
			case "M":
				// Handle the dblclick on the candidate select
				parentSelect.Obj.bind("dblclick", function() {
					cascadeDropdown(opt);
				});
				// Handle the dblclick on the selected values
				parentSelections = parentSelect.Obj.closest("span").find("select[ID$='SelectResult'][Title^='" + opt.parentColumn + " ']");
				parentSelections.bind("dblclick", function() {
					cascadeDropdown(opt);
				});
				// Handle a button click
				parentSelect.Obj.closest("span").find("button").each(function() {
					$(this).bind("click", function() {
						cascadeDropdown(opt);
					});
				});
				// Fire the change to set the allowable values initially
				cascadeDropdown(opt);
				break;
			default:
				break;
		}
	};

	function cascadeDropdown(opt) {
		var choices = "";
		var childSelectSelected = null;
		var parentSelectSelected = [];
		var master;
		var MultiLookupPickerdata;
		var newMultiLookupPickerdata;
		var childColumnRequired;

		// Find the parent column's select (dropdown)
		var parentSelect = new dropdownCtl(opt.parentColumn);
		// Get the parent column selection(s)
		switch(parentSelect.Type) {
			case "S":
				parentSelectSelected.push(parentSelect.Obj.find("option:selected").text());
				break;
			case "C":
				parentSelectSelected.push(parentSelect.Obj.attr("value"));
				break;
			case "M":
				parentSelections = parentSelect.Obj.closest("span").find("select[ID$='SelectResult'][Title^='" + opt.parentColumn + " ']");
				$(parentSelections).find("option").each(function() {
					parentSelectSelected.push($(this).html());
				});
				break;
			default:
				break;
		}

		// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
		// the number of Web Service calls when the parentSelect.Type = "C" or "M", as there are multiple propertychanges
		// which don't require any action.  The attribute will be unique per child column in case there are
		// multiple children for a given parent.
		if(parentSelect.Obj.attr("cascadeDropdownSelected_" + opt.childColumn) == parentSelectSelected.join(";#")) return;
		parentSelect.Obj.attr("cascadeDropdownSelected_" + opt.childColumn, parentSelectSelected.join(";#"));

		// Find the child column's select (dropdown)
		var childSelect = new dropdownCtl(opt.childColumn);
		if(childSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPCascadeDropdowns", "childColumn: " + opt.childColumn, "Column not found on page"); return; }

		// Get the current child column selection, if there is one
		switch(childSelect.Type) {
			case "S":
				childSelectSelected = childSelect.Obj.find("option:selected").val();
				break;
			case "C":
				childSelectSelected = childSelect.Obj.attr("value");
				break;
			case "M":
				MultiLookupPickerdata = childSelect.Obj.closest("span").find("input[name$='MultiLookupPicker$data']");
				master = window[childSelect.Obj.closest("tr").find("button[id$='AddButton']").attr("id").replace(/AddButton/,'MultiLookupPicker_m')];
				currentSelection = childSelect.Obj.closest("span").find("select[ID$='SelectResult'][Title^='" + opt.childColumn + " ']");
				// Clear the master
				master.data = "";
				break;
			default:
				break;
		}

		// When the parent column's selected option changes, get the matching items from the relationship list
		// Get the list items which match the current selection
		var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
		var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where>";
		if(opt.CAMLQuery.length > 0) camlQuery += "<And>";

		// Build up the criteria for inclusion
		if(parentSelectSelected.length == 0) {
			// Handle the case where no values are selected in multi-selects
			camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
		} else if(parentSelectSelected.length == 1) {
			// Only one value is selected
			camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'>" + escapeColumnValue(parentSelectSelected[0]) + "</Value></Eq>";
		} else {
			var compound = (parentSelectSelected.length > 2) ? true : false;
			for(i=0; i < (parentSelectSelected.length - 1); i++) {
				camlQuery += "<Or>";
			}
			for(i=0; i < parentSelectSelected.length; i++) {
				camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'>" + escapeColumnValue(parentSelectSelected[i]) + "</Value></Eq>";
				if(i>0 && (i < (parentSelectSelected.length - 1)) && compound) camlQuery += "</Or>";
			}
			camlQuery += "</Or>";
		}

		if(opt.CAMLQuery.length > 0) camlQuery += opt.CAMLQuery + "</And>";
		camlQuery += "</Where></Query>";

		// Get information about the childColumn from the current list
		$().SPServices({
			operation: "GetList",
			async: false,
			listName: listNameFromUrl(),
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field").each(function() {
						// Determine whether childColumn is Required
						if($(this).attr("DisplayName") == opt.childColumn) {
							childColumnRequired = ($(this).attr("Required") == "TRUE") ? true : false;
							// Stop looking; we're done
							return false;
						}
					});
				});
			}
		});
		
		$().SPServices({
			operation: "GetListItems",
			// Force sync so that we have the right values for the child column onchange trigger
			async: false,
			webURL: opt.relationshipWebURL,
			listName: opt.relationshipList,
			// Filter based on the currently selected parent column's value
			CAMLQuery: camlQuery,
			// Only get the parent and child columns
			CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListParentColumn + "' /><FieldRef Name='" + opt.relationshipListChildColumn + "' /></ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
			// Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
			CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>",
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("faultcode").each(function() {
					if(opt.debug) errBox("SPServices.SPCascadeDropdowns",
						"relationshipListParentColumn: " + opt.relationshipListParentColumn + " or " +
						"relationshipListChildColumn: " + opt.relationshipListChildColumn,
						"Not found in relationshipList " + opt.relationshipList);
					return;
				});

				// Add an explanatory prompt
				switch(childSelect.Type) {
					case "S":
						childSelect.Obj.attr({ length: 0 })
						// If the column is required or the promptText option is empty, don't add the "(None) option
						if(!childColumnRequired && (opt.promptText.length > 0)) childSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.childColumn) + "</option>");
						break;
					case "C":
						// If the column is required, don't add the "(None)" option
						choices = childColumnRequired ? "" : "(None)|0";
						childSelect.Obj.attr("value", "");
						break;
					case "M":
						childSelect.Obj.attr({ length: 0 });
						newMultiLookupPickerdata = "";
						break;
					default:
						break;
				}
				// Add an option for each child item
				$(xData.responseXML).find("[nodeName=z:row]").each(function() {
					
					// If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
					// else the ID of the relationshipList item
					var thisOptionId = ($(this).attr("ows_" + opt.relationshipListChildColumn).indexOf(";#") > 0) ?
							$(this).attr("ows_" + opt.relationshipListChildColumn).split(";#")[0] :
							$(this).attr("ows_ID");
					// If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
					// but by the datatype.  In this case, thisOptionId should be the ID of the relationshipList item.
					if(isNaN(thisOptionId)) thisOptionId = $(this).attr("ows_ID");
					
					// If relationshipListChildColumn is a Lookup column, then strip off the leading ID;# on the value
					var thisOptionValue = ($(this).attr("ows_" + opt.relationshipListChildColumn).indexOf(";#") > 0) ?
							$(this).attr("ows_" + opt.relationshipListChildColumn).split(";#")[1] :
							$(this).attr("ows_" + opt.relationshipListChildColumn);
					
					switch(childSelect.Type) {
						case "S":
							var selected = ($(this).attr("ows_ID") == childSelectSelected) ? " selected='selected'" : "";
							childSelect.Obj.append("<option" + selected + " value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							break;
						case "C":
							if (thisOptionValue == childSelectSelected) childSelect.Obj.attr("value", childSelectSelected);
							choices = choices + ((choices.length > 0) ? "|" : "") + thisOptionValue + "|" + thisOptionId;
							break;
						case "M":
							childSelect.Obj.append("<option value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							newMultiLookupPickerdata += thisOptionId + "|t" + thisOptionValue + "|t |t |t";
							break;
						default:
							break;
					}
				});

				switch(childSelect.Type) {
					case "S":
						childSelect.Obj.trigger("change");
						break;
					case "C":
						childSelect.Obj.attr("choices", choices);
						childSelect.Obj.trigger("propertychange");
						break;
					case "M":
						MultiLookupPickerdata.attr("value", newMultiLookupPickerdata);
						// Clear any prior selections that are no longer valid
						$(currentSelection).find("option").each(function() {
							var thisSelected = $(this);
							$(this).attr("selected", "selected");
							$(childSelect.Obj).find("option").each(function() {
								if($(this).html() == thisSelected.html()) thisSelected.attr("selected", "");
							});
						});
						GipRemoveSelectedItems(master);
						// Hide any options in the candidate list which are already selected
						$(childSelect.Obj).find("option").each(function() {
							var thisSelected = $(this);
							$(currentSelection).find("option").each(function() {
								if($(this).html() == thisSelected.html()) thisSelected.remove();
							});
						});
						GipAddSelectedItems(master);
						// Set master.data to the newly allowable values
						master.data = GipGetGroupData(newMultiLookupPickerdata);
						break;
					default:
						break;
				}
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc != null) opt.completefunc();
	}

	// Function to display related information when an option is selected on a form.
	$.fn.SPServices.SPDisplayRelatedInfo = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the column in the form
			relatedWebURL: "",					// [Optional] The name of the Web (site) which contains the related list
			relatedList: "",					// The name of the list which contains the additional information
			relatedListColumn: "",				// The internal name of the related column in the related list
			relatedColumns: [],					// An array of related columns to display
			displayFormat: "table",				// The format to use in displaying the related information.  Possible values are: "table".
			headerCSSClass: "ms-vh2",			// CSS class for the table headers
			rowCSSClass: "ms-vb",				// CSS class for the table rows
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be <And>ed with the default query on the relatedList
			numChars: 0,						// If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered
			matchType: "Eq",					// If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith"
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages; if false, run silent
		}, options);

		// Find the column's select (dropdown)
		var columnSelect = new dropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() == null && opt.debug) {
			errBox("SPServices.SPDisplayRelatedInfo",
				"columnName: " + opt.columnName,
				"Column not found on page");
			return;
		}

		switch(columnSelect.Type) {
			// Plain old select
			case "S":
				columnSelect.Obj.bind("change", function() {
					showRelated(opt);
				});
				// Fire the change to set the allowable values
				columnSelect.Obj.change();
				break;
			// Input / Select hybrid
			case "C":
				columnSelect.Obj.bind("propertychange", function() {
					showRelated(opt);
				});
				// Fire the change to set the allowable values
				columnSelect.Obj.trigger("propertychange");
				break;
			// Multi-select hybrid
			case "M":
				if(opt.debug) errBox("SPServices.SPDisplayRelatedInfo",
					"columnName: " + opt.columnName,
					"Multi-select columns not supported by this function");
				break;
			default:
				break;
		}
	};

	function showRelated(opt) {

		var columnSelectSelected = null;

		// Find the column's select (dropdown)
		var columnSelect = new dropdownCtl(opt.columnName);

		// Get the current column selection(s)
		switch(columnSelect.Type) {
			case "S":
				columnSelectSelected = columnSelect.Obj.find("option:selected").text();
				break;
			case "C":
				columnSelectSelected = columnSelect.Obj.attr("value");
				// Check to see if at least opt.numChars have been typed (if specified)
				if(opt.numChars > 0 && columnSelectSelected.length < opt.numChars) return;
				break;
			case "M":
				break;
			default:
				break;
		}

		// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
		// the number of Web Service calls when the parentSelect.Type = "C", as there are multiple propertychanges
		// which don't require any action.
		if(columnSelect.Obj.attr("showRelatedSelected") == columnSelectSelected) return;
		columnSelect.Obj.attr("showRelatedSelected", columnSelectSelected);
		var divId = genContainerId("SPDisplayRelatedInfo", opt.columnName);
		$("#" + divId).remove();
		columnSelect.Obj.parent().append("<div id=" + divId + "></div>");


		// Only get the requested columns
		var relatedColumnsXML = [];

		// Get information about the related list and its columns
		$().SPServices({
			operation: "GetList",
			async: false,
			webURL: opt.relatedWebURL,
			listName: opt.relatedList,
			completefunc: function(xData, Status) {
				// If debug is on, notify about an error
				$(xData.responseXML).find("faultcode").each(function() {
					if(opt.debug) errBox("SPServices.SPDisplayRelatedInfo",
						"relatedList: " + opt.relatedList,
						"List not found");
					return;
				});
				// Output each row
				$(xData.responseXML).find("Fields").each(function() {
					$(xData.responseXML).find("Field").each(function() {
						for (i=0; i < opt.relatedColumns.length; i++) {
							// If this is one of the columns we want to display, save the XML node
							if($(this).attr("Name") == opt.relatedColumns[i]) relatedColumnsXML[i] = $(this);
						}
					});
				});
			}
		});

		// Get the list items which match the current selection
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) camlQuery += "<And>";
		camlQuery += "<" + opt.matchType + "><FieldRef Name='" + opt.relatedListColumn + "'/><Value Type='Text'>" + escapeColumnValue(columnSelectSelected) + "</Value></" + opt.matchType + ">";
		if(opt.CAMLQuery.length > 0) camlQuery += opt.CAMLQuery + "</And>";
		camlQuery += "</Where></Query>";

		var viewFields = " ";
		for (i=0; i < opt.relatedColumns.length; i++) {
			viewFields += "<FieldRef Name='" + opt.relatedColumns[i] + "' />";
		}
		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.relatedWebURL,
			listName: opt.relatedList,
			// Filter based on the column's currently selected value
			CAMLQuery: camlQuery,
			CAMLViewFields: "<ViewFields>" + viewFields +  "</ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("faultcode").each(function() {
					if(opt.debug) errBox("SPServices.SPDisplayRelatedInfo",
						"relatedListColumn: " + opt.relatedListColumn,
						"Column not found in relatedList " + opt.relatedList);
					return;
				});
				
				var outString;
				// Output each row
				switch(opt.displayFormat) {
					// Only implementing the table format in the first iteration (v0.2.9)
					case "table":
						outString = "<table>";
						outString += "<tr>";
						for (i=0; i < opt.relatedColumns.length; i++) {
							if(relatedColumnsXML[i] == undefined && opt.debug) {
								errBox("SPServices.SPDisplayRelatedInfo",
									"columnName: " + opt.relatedColumns[i],
									"Column not found in relatedList");
								return;
							}
							outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
						}
						outString += "</tr>";
						// Add an option for each child item
						$(xData.responseXML).find("[nodeName=z:row]").each(function() {
							outString += "<tr>";
							for (i=0; i < opt.relatedColumns.length; i++) {
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
							}
							outString += "</tr>";
						});
						outString += "</table>";
						break;
					// list format implemented in v0.5.0. Still table-based, but vertical orientation.
					case "list":
						outString = "<table>";
						for (i=0; i < opt.relatedColumns.length; i++) {
							$(xData.responseXML).find("[nodeName=z:row]").each(function() {
								outString += "<tr>";
								outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
								outString += "</tr>";
							});
						}
						outString += "</table>";
						break;
					default:
						break;
				}
				$("#" + divId).html("").append(outString);
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc != null) opt.completefunc();
	}

	// Utility function to show the results of a Web Service call formatted well in the browser.
	$.fn.SPServices.SPDebugXMLHttpResult = function(options) {

		var opt = $.extend({}, {
			node: null,							// An XMLHttpResult object from an ajax call
			indent: 0							// Number of indents
		}, options);

		var NODE_TEXT = 3;
		var NODE_CDATA_SECTION = 4;

		var outString = "";
		// For each new subnode, begin rendering a new TABLE
		outString += "<table class='ms-vb' style='margin-left:" + opt.indent * 3 + "px;' width='100%'>";
		// DisplayPatterns are a bit unique, so let's handle them differently
		if(opt.node.nodeName == "DisplayPattern") {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.xml + "</textarea></td></tr>";
		// A node which has no children
		} else if (!opt.node.hasChildNodes()) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + ((opt.node.nodeValue != null) ? checkLink(opt.node.nodeValue) : "&nbsp;") + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>";
				outString += showAttrs(opt.node, opt);
				outString += "</td></tr>";
			}
		// A CDATA_SECTION node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType == NODE_CDATA_SECTION) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.parentNode.text + "</textarea></td></tr>";
		// A TEXT node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType == NODE_TEXT) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + checkLink(opt.node.firstChild.nodeValue) + "</td></tr>";
		// Handle child nodes
 		} else {
			outString += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + opt.node.nodeName + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>";
				outString += showAttrs(opt.node, opt);
				outString += "</td></tr>";
			}
			// Since the node has child nodes, recurse
			outString += "<tr><td>";
			for (var i = 0; i < opt.node.childNodes.length; i++) {
				outString += $().SPServices.SPDebugXMLHttpResult({
					node: opt.node.childNodes.item(i),
					indent: opt.indent++
				});
			}
			outString += "</td></tr>";
		}
		outString += "</table>";
		// Return the HTML which we have built up
		return outString;
	};

	// Function which returns the account name for the current user in DOMAIN\username format
	$.fn.SPServices.SPGetCurrentUser = function(options) {

		var opt = $.extend({}, {
			fieldName: "Name",				// Specifies which field to return from the userdisp.aspx page
			debug: false					// If true, show error messages; if false, run silent
		}, options);

		var thisField = "";
		var thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
		$.ajax({
 			// Need this to be synchronous so we're assured of a valid value
 			async: false,
 			// Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
 			// Adding the extra Qjuery String parameter with the current date/time forces the server to view this as a new request.
 			url: $().SPServices.SPGetCurrentSite() + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
			complete: function (xData, Status) {
				$(xData.responseText).find("table.ms-formtable td[id^='SPField']").each(function() {
					if(thisTextValue.test($(this).html())) {
						// Each fieldtype contains a different data type, as indicated by the id
						switch($(this).attr("id")) {
							case "SPFieldText":
								thisField = $(this).text();
				 				break;
							case "SPFieldNote":
								thisField = $(this).find("div").html();
				 				break;
							case "SPFieldURL":
								thisField = $(this).find("img").attr("src");
				 				break;
				 			// Just in case
				 			default:
								thisField = $(this).text();
		 						break;		 				
						}
						// Stop looking; we're done
						return false;
					}
				});
			}
		});
		return thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
	};

	// Function which provides a link on a Lookup column for the user to follow
	// which allows them to add a new value to the Lookup list.
	// Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
	// by Waldek Mastykarz
	$.fn.SPServices.SPLookupAddNew = function(options) {

		var opt = $.extend({}, {
			lookupColumn: "",				// The display name of the Lookup column
			promptText: "Add new {0}",		// Text to use as prompt + column name
			completefunc: null,				// Function to call on completion of rendering the change.
			debug: false					// If true, show error messages; if false, run silent
		}, options);

		// Find the lookup column's select (dropdown)
		var lookupSelect = new dropdownCtl(opt.lookupColumn);
		if(lookupSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPLookupAddNew", "lookupColumn: " + opt.lookupColumn, "Column not found on page"); return; }

		var newUrl = "";
		var lookupListUrl = "";
		var lookupColumnStaticName = "";
		// Use GetList for the current list to determine the details for the Lookup column
		$().SPServices({
			operation: "GetList",
			async: false,
			listName: listNameFromUrl(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("Field").each(function() {
					if($(this).attr("DisplayName") == opt.lookupColumn) {
						lookupColumnStaticName = $(this).attr("StaticName");
						// Use GetList for the Lookup column's list to determine the list's URL
						$().SPServices({
							operation: "GetList",
							async: false,
							listName: $(this).attr("List"),
							completefunc: function (xData, Status) {
								$(xData.responseXML).find("List").each(function() {
									lookupListUrl = $(this).attr("WebFullUrl");
									// Need to handle when list is in the root site
									lookupListUrl = lookupListUrl != SLASH ? lookupListUrl + SLASH : lookupListUrl;
								});
							}
						});
						// Get the NewItem form for the Lookup column's list
						$().SPServices({
							operation: "GetFormCollection",
							async: false,
							listName: $(this).attr("List"),
							completefunc: function (xData, Status) {
								$(xData.responseXML).find("Form").each(function() {
									if($(this).attr("Type") == "NewForm") newUrl = $(this).attr("Url");
								});
							}
						});
						// Stop looking; we're done
						return false;
					}
				});
			}
		});

		if(lookupListUrl.length == 0 && opt.debug) {
			errBox("SPServices.SPLookupAddNew",
				"lookupColumn: " + opt.lookupColumn,
				"This column does not appear to be a lookup column");
			return;
		}
		if(newUrl.length > 0) {
			// Build the link to the Lookup column's list enclosed in a div with the id="SPLookupAddNew_" + lookupColumnStaticName
			newLink = "<div id='SPLookupAddNew_" + lookupColumnStaticName + "'><a href='" + lookupListUrl + newUrl + "?Source=" + escapeUrl(location.href) + "'>" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a></div>";
			// Append the link to the Lookup columns's formbody table cell
			$(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
		} else if(opt.debug) {
			errBox("SPServices.SPLookupAddNew",
				"lookupColumn: " + opt.lookupColumn,
				"NewForm cannot be found");
			return;
		}
		// If present, call completefunc when all else is done
		if(opt.completefunc != null) opt.completefunc();
	};

	// Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
	// between list forms
	$.fn.SPServices.SPGetLastItemId = function(options) {

		var opt = $.extend({}, {
			webURL: "",				// URL of the target Web.  If not specified, the current Web is used.
			listName: "",			// The name or GUID of the list
			userAccount: "",		// The account for the user in DOMAIN\username format. If not specified, the current user is used.
			CAMLQuery: ""			// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
		}, options);

		var userId;
		var lastId = 0;
		$().SPServices({
			operation: "GetUserInfo",
			async: false,
			userLoginName: (opt.userAccount != "") ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("User").each(function() {
					userId = $(this).attr("ID");
				});
			}
		});

		// Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
		// the existing Where clause
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) camlQuery += "<And>";
		camlQuery += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq>";
		if(opt.CAMLQuery.length > 0) camlQuery += opt.CAMLQuery + "</And>";
		camlQuery += "</Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>";

		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: camlQuery,
			CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
			CAMLRowLimit: 1,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("[nodeName=z:row]").each(function() {
					lastId = $(this).attr("ows_ID");
				});
			}
		});
		return lastId;
	};
	
	// Function which checks to see if the value for a column on the form is unique in the list. 
	$.fn.SPServices.SPRequireUnique = function (options) {

		var opt = $.extend({}, {
			columnStaticName: "Title",					// Name of the column
			duplicateAction: 0,							// 0 = warn, 1 = prevent
			ignoreCase: false,							// If set to true, the function ignores case, if false it looks for an exact match
			initMsg: "This value must be unique.",		// Initial message to display after setup
			initMsgCSSClass: "ms-vb",					// CSS class for initial message
			errMsg: "This value is not unique.",		// Error message to display if not unique
			errMsgCSSClass: "ms-formvalidation",		// CSS class for error message
			completefunc: null							// Function to call on completion of rendering the change.
		}, options);

		// Get the current item's ID from the Query String
		var queryStringVals = $().SPServices.SPGetQueryString();
		var thisID = queryStringVals["ID"];

		// Set the messages based on the options provided
		var msg = "<span id='SPRequireUnique" + opt.columnStaticName + "' class='{0}'>{1}<br/></span>";
		var initMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);
		var errMsg =  msg.replace(/\{0\}/g, opt.errMsgCSSClass).replace(/\{1\}/g, opt.errMsg);
		
		// We need the DisplayName
		var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
			listName: listNameFromUrl(),
			columnStaticName: opt.columnStaticName
		});
		var columnObj = $("input[Title='" + columnDisplayName + "']");
		$(columnObj).parent().append(initMsg);

		$(columnObj).blur(function () {
			var columnValueCount = 0;
			// Get the columnDisplayName's value
			var columnValue = $(this).attr("value");

			// Call the Lists Web Service (GetListItems) to see if the value already exists
			$().SPServices({
				operation: "GetListItems",
				async: false,
				listName: listNameFromUrl(),
				// Make sure we get all the items, ignoring any filters on the default view.
				CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + opt.columnStaticName + "'/></IsNotNull></Where></Query>",
				// Filter based on columnStaticName's value
				CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='" + opt.columnStaticName + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					$(xData.responseXML).find("[nodeName=z:row]").each(function() {
						var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
						// If this value already exists in columnStaticName and it's not the current item, then increment the counter for matches
						if((testValue == thisValue) && ($(this).attr("ows_ID") != thisID)) columnValueCount++;
					});
				}
			});

			var newMsg = initMsg;
			$("input[value='OK']").attr("disabled", "");
			if(columnValueCount > 0) {
				newMsg = errMsg;
				if(opt.duplicateAction == 1) {
					$("input[Title='" + opt.columnDisplayName + "']").focus();
					$("input[value='OK']").attr("disabled", "disabled");
				}
			}
			$("span#SPRequireUnique" + opt.columnStaticName).html(newMsg);

		});
		// If present, call completefunc when all else is done
		if(opt.completefunc != null) opt.completefunc();
	};

	// This function returns the DisplayName for a column based on the StaticName.
	$.fn.SPServices.SPGetDisplayFromStatic = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnStaticName: ""			// StaticName of the column
		}, options);

		var staticName = "";
		var displayName = "";
		$().SPServices({
			operation: "GetList",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Field").each(function() {
					if($(this).attr("StaticName") == opt.columnStaticName) {
						displayName = $(this).attr("DisplayName");
						// Stop looking; we're done
						return false;
					}
				});
			}
		});
		return displayName;
	};

	// This function returns the StaticName for a column based on the DisplayName.
	$.fn.SPServices.SPGetStaticFromDisplay = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnDisplayName: ""			// DisplayName of the column
		}, options);

		var Name = "";
		var staticName = "";
		$().SPServices({
			operation: "GetList",
			async: false,
			//webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Field").each(function() {
					if($(this).attr("DisplayName") == opt.columnDisplayName) {
						staticName = $(this).attr("StaticName");
						// Stop looking; we're done
						return false;
					}
				});
			}
		});
		return staticName;
	};

	// This function allows you to redirect to a another page from a new item form with the new
	// item's ID. This allows chaining of forms from item creation onward. 
	$.fn.SPServices.SPRedirectWithID = function (options) {

		var opt = $.extend({}, {
			redirectUrl: ""				// Page for the redirect
		}, options);

		var thisList = listNameFromUrl();
		var queryStringVals = $().SPServices.SPGetQueryString();
		var lastID = queryStringVals["ID"];
		var QSList = queryStringVals["List"];
		var QSRootFolder = queryStringVals["RootFolder"];
		var QSContentTypeId = queryStringVals["ContentTypeId"];
		
		// On first load, change the form actions to redirect back to this page with the current lastID for this user and the
		// original Source.
		if(queryStringVals["ID"] == undefined) {
			lastID = $().SPServices.SPGetLastItemId({
				listName: thisList
			});
			$("form[name='aspnetForm']").each(function() {
				// This page...
				var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
				// ... plus the Source if it exists
				var thisSource = (typeof queryStringVals["Source"] == "string") ?
					"Source=" + queryStringVals["Source"].replace(/\//g, "%2f").replace(/:/g, "%3a") : "";
				
				var newQS = new Array();
				if(QSList != undefined) newQS.push("List=" + QSList);
				if(QSRootFolder != undefined) newQS.push("RootFolder=" + QSRootFolder);
				if(QSContentTypeId != undefined) newQS.push("ContentTypeId=" + QSContentTypeId);

				var newAction = thisUrl +
					((newQS.length > 0) ? ("?" + newQS.join("&") + "&") : "?") +
					// Set the Source to point back to this page with the lastID this user has added
					"Source=" + thisUrl +
					"?ID=" + lastID +
					// Pass the original source as RealSource, if present
					((thisSource.length > 0) ? ("%26RealSource=" + queryStringVals["Source"]) : "") +
					// Pass the override RedirectURL, if present
					((typeof queryStringVals["RedirectURL"] == "string") ? ("%26RedirectURL=" + queryStringVals["RedirectURL"]) : "");
				$(this).attr("action", newAction);
			});
		// If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
		// then do the redirect to redirectUrl with the new lastID, passing along the original Source.
		} else {
			while(queryStringVals["ID"] == lastID) {
				lastID = $().SPServices.SPGetLastItemId({
					listName: thisList
				});
			}
			// If there is a RedirectURL parameter on the Query String, then redirect there instead of the value
			// specified in the options (opt.redirectUrl)
			var thisRedirectUrl = (typeof queryStringVals["RedirectURL"] == "string") ? queryStringVals["RedirectURL"] : opt.redirectUrl;
			location.href = thisRedirectUrl + "?ID=" + lastID +
				((typeof queryStringVals["RealSource"] == "string") ? ("&Source=" + queryStringVals["RealSource"]) : "");
		}
	};

	// The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically
	// based on the values they contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
	$.fn.SPServices.SPSetMultiSelectSizes = function (options) {

		var opt = $.extend({}, {
			multiSelectColumn: "",
			minWidth: 0,
			maxWidth: 0
		}, options);

		// Create a temporary clone of the select to use to determine the appropriate width settings.
		// We'll append it to the end of the enclosing span.
		var possibleValues = $("select[ID$='SelectCandidate'][Title^='" + opt.multiSelectColumn + " ']");
		var selectedValues = possibleValues.closest("span").find("select[ID$='SelectResult'][Title^='" + opt.multiSelectColumn + " ']");
		var cloneId = genContainerId("SPSetMultiSelectSizes", opt.multiSelectColumn);
		possibleValues.clone().appendTo(possibleValues.closest("span")).css({
			"width": "auto",		// We want the clone to resize its width based on the contents
			"height": 0,			// Just to keep the page clean while we are using the clone
			"visibility": "hidden"	// And let's keep it hidden
		}).attr({
			id: cloneId,			// We don't want the clone to have the same id as its source
			length: 0				// And let's start with no options
		});
		var cloneObj = $("#" + cloneId);

		// Add all the values to the cloned select.  First the left (possible values) select...
		possibleValues.find("option").each(function() {
			cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
		});
		// ...then the right (selected values) select (in case some values have already been selected)
		selectedValues.find("option").each(function() {
			cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
		});

		// We'll add 5px for a little padding on the right.
		var divWidth = $("#" + cloneId).width() + 5;
		var newDivWidth = divWidth;
		if(opt.minWidth > 0 || opt.maxWidth > 0)
		{
			if(divWidth < opt.minWidth) divWidth = opt.minWidth;
			if(newDivWidth < opt.minWidth) newDivWidth = opt.minWidth;
			if(newDivWidth > opt.maxWidth) newDivWidth = opt.maxWidth;
		}
		// Subtract 17 from divWidth to allow for the scrollbar for the select
		var selectWidth = divWidth - 17;

		// Set the new widths
		possibleValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");
		selectedValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");

		// Remove the select's clone, since we're done with it
		$("#" + cloneId).remove();
	};

	// Does an audit of a site's list forms to show where script is in use.
	$.fn.SPServices.SPScriptAudit = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// [Optional] The name of the Web (site) to audit
			listName: "",					// [Optional] The name of a specific list to audit. If not present, all lists in the site are audited.
			outputId: "",					// The id of the DOM object for output
			auditForms: true,				// Audit the form pages
			auditViews: true,				// Audit the view pages
			auditPages: true,				// Audit the Pages Document Library
			auditPagesListName: "Pages",	// The Pages Document Library, if desired
			showHiddenLists: false,			// Show output for hidden lists
			showNoScript: false,			// Show output for lists with no scripts (effectively "verbose")
			showSrc: true					// Show the source location for included scripts
		}, options);

		var formTypes = ["Display", "Edit", "New"]; 
		var listXml;

		// Build the table to contain the results
		$("#" + opt.outputId)
			.append("<table id='SPScriptAudit' width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>" +
					"<tr>" + 
						"<th></th>" +
						"<th>List</th>" +
						"<th>Page Class</th>" +
						"<th>Page Type</th>" +
						"<th>Page</th>" +
						(opt.showSrc ? "<th>Script in the Page</th><th>Script in a Web Part</th>" : "") +
						"<th>jQuery</th>" +
					"</tr>" +
				"</table>");
		// Apply the CSS class to the headers
		$("#SPScriptAudit th").attr("class", "ms-vh2-nofilter");
		
		// Don't bother with the lists if the options don't require them
		if(opt.auditForms || opt.auditViews) {
			// First, get all of the lists within the site
			$().SPServices({
				operation: "GetListCollection",
				webURL: opt.webURL,
				async: false, // Need this to be synchronous so we're assured of a valid value
				completefunc: function (xData, Status) {
					$(xData.responseXML).find(LISTS).each(function() {
						$(this).find("List").each(function() {
							listXml = $(this);

							// Don't work with hidden lists unless we're asked to
							if((opt.showHiddenLists && listXml.attr("Hidden") == "False") || !opt.showHiddenLists) {
	
								// Audit the list's customized forms
								if(opt.auditForms) {
									// Get the list's Content Types, therefore the form pages
									$().SPServices({
										operation: "GetListContentTypes",
										webURL: opt.webURL,
										listName: listXml.attr("ID"),
										async: false, // Need this to be synchronous so we're assured of a valid value
										completefunc: function (xData, Status) {
											$(xData.responseXML).find("ContentType").each(function() {
												// Don't deal with folders
												if($(this).attr("ID").substring(0,6) != "0x0120") {
													$(this).find("FormUrls").each(function() {
														for(var i=0; i < formTypes.length; i++) {
															$(this).find(formTypes[i]).each(function() {
																// For each form page, check for scripts
																SPScriptAuditPage(opt, listXml, "Form", formTypes[i],
																	((opt.webURL.length > 0) ? opt.webURL : $().SPServices.SPGetCurrentSite()) + SLASH + $(this).text());
															});
														}
													});
												}
											});
										}
									});
								}
	
								// Audit the list's views
								if(opt.auditViews) {
									// Get the list's Views
									$().SPServices({
										operation: "GetViewCollection",
										webURL: opt.webURL,
										listName: listXml.attr("ID"),
										async: false, // Need this to be synchronous so we're assured of a valid value
										completefunc: function (xData, Status) {
											$(xData.responseXML).find("View").each(function() {
												SPScriptAuditPage(opt, listXml, "View", $(this).attr("DisplayName"), $(this).attr("Url"));
											});
										}
									});
								}
							}
						});
					});
				}
			});
		}

		// Don't bother with auditPagesListName if the options don't require it
		if(opt.auditPages) {
			$().SPServices({
				operation: "GetList",
				async: false,
				webURL: opt.webURL,
				listName: opt.auditPagesListName,
				completefunc: function (xData, Status) {
					$(xData.responseXML).find("List").each(function() {
						listXml = $(this);
					});
				}
			});
			// Get all of the items from the auditPagesListName list
			$().SPServices({
				operation: "GetListItems",
				async: false,
				webURL: opt.webURL,
				listName: opt.auditPagesListName,
				CAMLQuery: "<Query><Where><Neq><FieldRef Name='ContentType'/><Value Type='Text'>Folder</Value></Neq></Where></Query>",
				CAMLViewFields: "<ViewFields><FieldRef Name='Title'/><FieldRef Name='FileRef'/></ViewFields>",
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					$(xData.responseXML).find("[nodeName=z:row]").each(function() {
						var thisPageUrl = $(this).attr("ows_FileRef").split(";#")[1];
						var thisPageType = ($(this).attr("ows_Title") != undefined) ? $(this).attr("ows_Title") : "";
						if(thisPageUrl.indexOf(".aspx") > 0) SPScriptAuditPage(opt, listXml, "Page", thisPageType, SLASH + thisPageUrl);
					});
				}
			});
		}
		// Remove progress indicator and make the output pretty by cleaning up the ms-alternating CSS class
		$("#SPScriptAudit tr[class='ms-alternating']:even").attr("class", "");
	}; // End of function SPScriptAudit

	// Displays the usage of scripts in a site
	function SPScriptAuditPage(opt, listXml, pageClass, pageType, pageUrl) {

		var jQueryPage = 0;
		var jQueryWP = 0;
		var wpScriptSrc = new Object();
		wpScriptSrc.type = [];
		wpScriptSrc.src = [];
		wpScriptSrc.script = [];
		var pageScriptSrc = new Object();
		pageScriptSrc.type = [];
		pageScriptSrc.src = [];
		pageScriptSrc.script = [];
		var jQueryMarker = "$(";
		var headRegex = RegExp("<head[\\s\\S]*?/head>", "gi");
		var scriptRegex = RegExp("<script[\\s\\S]*?/script>", "gi");
		var arrMatch;

		// Fetch the page
		$.ajax({
			type: "GET",
			url: pageUrl,
			dataType: "text",
			success: function(xData) {

				// Process scripts in the <HEAD>
				headHtml = headRegex.exec(xData);
				while (scriptMatch = scriptRegex.exec(headHtml)) {
					var scriptLanguage = getScriptAttribute(scriptMatch, "language");
					var scriptType = getScriptAttribute(scriptMatch, "type");
					var scriptSrc = getScriptAttribute(scriptMatch, "src");
					if(scriptSrc != null && scriptSrc.length > 0 && !coreScript(scriptSrc)) {
						pageScriptSrc.type.push((scriptLanguage != null && scriptLanguage.length > 0) ? scriptLanguage : scriptType);
						pageScriptSrc.src.push(scriptSrc);
					}
					var scriptScript = scriptMatch.innerHTML;
					if(scriptScript != undefined && scriptScript.indexOf(jQueryMarker) > -1) {
						pageScriptSrc.script.push(scriptMatch.innerHTML);
						jQueryPage++;
					}
				}
				// Process scripts in the <BODY> 
				$(xData).find("script").each(function() {
					// Script outside Web Parts
					if($(this).closest("td[id^='MSOZoneCell_WebPartWP']").html() == null) {
						// Exclude SharePoint's scripts: WebResource.axd and anything in _layouts
						if(($(this).attr("src") != undefined) && ($(this).attr("src").length > 0) && !coreScript($(this).attr("src"))) {
							pageScriptSrc.type.push($(this).attr("language").length > 0 ? $(this).attr("language") : $(this).attr("type"));
							pageScriptSrc.src.push($(this).attr("src"));
						}
						if($(this).html().indexOf(jQueryMarker) > -1) {
							pageScriptSrc.script.push($(this).html());
							jQueryPage++;
						}
					// Script inside Web Parts
					} else {
						if($(this).attr("src") != undefined && $(this).attr("src").length > 0) {
							wpScriptSrc.type.push($(this).attr("language").length > 0 ? $(this).attr("language") : $(this).attr("type"));
							wpScriptSrc.src.push($(this).attr("src"));
						}
						if($(this).html().indexOf(jQueryMarker) > -1) {
							wpScriptSrc.script.push($(this).html());
							jQueryWP++;
						}
					}
				});

				// Only show pages without script if we've been asked to do so.
				if((!opt.showNoScript && (wpScriptSrc.type.length > 0 || pageScriptSrc.type.length > 0)) || opt.showNoScript)  {
					var pagePath = pageUrl.substring(0, pageUrl.lastIndexOf(SLASH)+1);
					var out = "<tr class=ms-alternating>" +
						"<td class=ms-vb-icon><a href='" + listXml.attr("DefaultViewUrl") + "'><IMG border=0 src='" + listXml.attr("ImageUrl") + "'width=16 height=16></A></TD>" +
						"<td class=ms-vb2><a href='" + listXml.attr("DefaultViewUrl") + "'>" + listXml.attr("Title") + ((listXml.attr("Hidden") == "True") ? '(Hidden)' : '')+ "</td>" +
						"<td class=ms-vb2>" + pageClass + "</td>" +
						"<td class=ms-vb2>" + pageType + "</td>" +
						"<td class=ms-vb2><a href='" + pageUrl + "'>" + fileName(pageUrl) + "</td>";
					if(opt.showSrc) {
						out += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
						for(var i=0; i < pageScriptSrc.type.length; i++) {
							var thisSrcPath = (pageScriptSrc.src[i].substr(0,1) != SLASH) ? pagePath + pageScriptSrc.src[i] : pageScriptSrc.src[i];
							out += "<tr><td class=ms-vb2 width='30%'>" + pageScriptSrc.type[i] + "</td>";
							out += "<td class=ms-vb2 width='70%'><a href='" + thisSrcPath + "'>" + fileName(pageScriptSrc.src[i]) + "</td></tr>";
						}
						if(jQueryPage > 0) {
							for(var i=0; i < pageScriptSrc.script.length; i++) {
								out += "<tr><td class=ms-vb2 colspan=99><textarea class=ms-vb2 readonly='readonly' rows='5' cols='50'>" + pageScriptSrc.script[i] + "</textarea></td></tr>";
							}
						}
						out += "</table></td>";
						out += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
						for(var i=0; i < wpScriptSrc.type.length; i++) {
							var thisSrcPath = (wpScriptSrc.src[i].substr(0,1) != SLASH) ? pagePath + wpScriptSrc.src[i] : wpScriptSrc.src[i];
							out += "<tr><td class=ms-vb2 width='30%'>" + wpScriptSrc.type[i] + "</td>";
							out += "<td class=ms-vb2 width='70%'><a href='" + thisSrcPath + "'>" + fileName(wpScriptSrc.src[i]) + "</td></tr>";
						}
						if(jQueryWP > 0) {
							for(var i=0; i < wpScriptSrc.script.length; i++) {
								out += "<tr><td class=ms-vb2 colspan=99><textarea class=ms-vb2 readonly='readonly' rows='5' cols='50'>" + wpScriptSrc.script[i] + "</textarea></td></tr>";
							}
						}
						out += "</table></td>";
					}
					out += "<td class=ms-vb2>" + (((jQueryPage + jQueryWP) > 0) ? 'Yes' : 'No') + "</td></tr>";		
					$("#SPScriptAudit").append(out);
				}
			}
		});
	}; // End of function SPScriptAuditPage
	
	function getScriptAttribute(source, attribute) {
		var regex = RegExp(attribute + "=(\"([^\"]*)\")|('([^']*)')", "gi");
		if(matches = regex.exec(source)) return matches[2];
		return null;
	}

	function coreScript(src) {
		var coreScriptLocations = ["WebResource.axd", "_layouts"];
		for(var i=0; i < coreScriptLocations.length; i++) {
			if(src.indexOf(coreScriptLocations[i]) > -1) return true;	
		}
		return false;
	}

	// Rearrange radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate
	$.fn.SPServices.SPArrangeChoices = function (options) {

		var opt = $.extend({}, {
			columnName: "",					// The display name of the column in the form
			perRow: 99,						// Maximum number of choices desired per row.
			randomize: false				// If true, randomize the order of the options
		}, options);

		var columnFillInChoice = false;
		var options = new Array();
		var out;
		
		// Get information about columnName from the list to determine if we're allowing fill-in choices
		$().SPServices({
			operation: "GetList",
			async: false,
			listName: listNameFromUrl(),
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field").each(function() {
						// Determine whether columnName allows a fill-in choice
						if($(this).attr("DisplayName") == opt.columnName) {
							columnFillInChoice = ($(this).attr("FillInChoice") == "TRUE") ? true : false;
							// Stop looking; we're done
							return false;
						}
					});
				});
			}
		});

		// There's no easy way to find one of these columns; we'll look for the comment with the columnName
		var searchText = RegExp("FieldName=\"" + opt.columnName + "\"", "gi");
		// Loop through all of the ms-formbody table cells
		$("td.ms-formbody").each(function() {
			// Check for the right comment
			if(searchText.test($(this).html())) {
				var totalChoices = $(this).find("tr").length;
				var choiceNumber = 0;
				var fillinPrompt;
				var fillinInput;
				// Collect all of the choices
				$(this).find("tr").each(function() {
					choiceNumber++;
					// If this is the fill-in prompt, save it...
					if(columnFillInChoice && choiceNumber == totalChoices - 1) {
						fillinPrompt = $(this).find("td").html();
					// ...or if it is the fill-in input box, save it...
					} else if(columnFillInChoice && choiceNumber == totalChoices) {
						fillinInput = $(this).find("td").html();
					// ...else push into the options array.
					} else options.push($(this).html());
				});
				out = "<TR>";

				// If randomize is true, randomly sort the options
				if(opt.randomize) options.sort(randOrd);

				// Add all of the options to the out string
				for(i=0; i < options.length; i++) {
					out += options[i];
					// If we've already got perRow options in the row, close off the row
					if((i+1) % opt.perRow == 0) out += "</TR><TR>"
				}
				out += "</TR>";

				// If we are allowing a fill-in choice, add that option in a separate row at the bottom
				if(columnFillInChoice) out += "<TR><TD colspan='99'>" + fillinPrompt + fillinInput + "</TD></TR>";

				// Remove the existing rows...
				$(this).find("tr").remove();
				// ...and append the out string
				$(this).find("table").append(out);
				// Stop looking; we're done
				return false;
			}
		});
	}; // End of function SPArrangeChoices

	// Provide suggested values from a list for in input column based on characters typed
	$.fn.SPServices.SPAutocomplete = function (options) {

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "<img src='_layouts/images/REFRESH.GIF'/>",				// If present, show this while processing
			debug: false						// If true, show error messages; if false, run silent
		}, options);

		// Find the input control for the column and save some of its attributes
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = $(columnObj).attr("ID");
		var columnObjColor = $(columnObj).css("color");

		if(columnObj.html() == null && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Column is not an input control or is not found on page");
			return;
		}

		// Create a div to contain the results
		var containerId = genContainerId("SPAutocomplete", opt.columnName);

		// Add the container for the matching values		
		columnObj.after("<ul id='" + containerId + "' style='display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'>");
		// Set the width to match the width of the input control
		$("#" + containerId).css("width", columnObj.width());                  

		// Wrap the input control in a table
		columnObj.wrap("<table id='" + containerId + "container' cellpadding='0' cellspacing='0' width='100%'><tr><td width='" + columnObj.width() + "'></td></tr></table>");
		// Add a table cell to the right to show the processingIndicator
		columnObj.closest("tr").append("<td id='" + containerId + "processingIndicator' style='display:none;'>" + opt.processingIndicator + "</td>");

		// Handle keypresses
		$(columnObj).keyup(function () {

			// Get the column's value
			var columnValue = $(this).val();

			// Have enough characters been typed yet?
			if(columnValue.length < opt.numChars) {
				$("#" + containerId).hide();
				return false;
			}

			// Hide the container while we're working on it
			$("#" + containerId).hide();

			// Show the the processingIndicator
			$("#" + containerId + "processingIndicator").show();

			// Array to hold the matched values
			var matchArray = new Array();
			
			// Build the appropriate CAMLQuery
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			if(opt.CAMLQuery.length > 0) camlQuery += "<And>";
			camlQuery += "<IsNotNull><FieldRef Name='" + opt.sourceColumn + "'/></IsNotNull>";			
			if(opt.CAMLQuery.length > 0) camlQuery += opt.CAMLQuery + "</And>";
			camlQuery += "</Where></Query>";

			// Call GetListItems to find all of the potential values
			$().SPServices({
				operation: "GetListItems",
				async: false,
				listName: opt.sourceList,
				// Make sure we get all the items, ignoring any filters on the default view.
				//CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + opt.sourceColumn + "'/></IsNotNull></Where><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy></Query>",
				CAMLQuery: camlQuery,
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.sourceColumn + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					// Handle upper/lower case if ignoreCase = true
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					// See which values match and add the ones that do to matchArray
					$(xData.responseXML).find("[nodeName=z:row]").each(function() {
						var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
						if(testValue == thisValue.substr(0,testValue.length)) {
							matchArray.push($(this).attr("ows_" + opt.sourceColumn));
						}
					});
				}
			});

			// Build out the set of list elements to contain the available values
			var out = "";
			for (i=0; i < matchArray.length; i++) {
				out += "<li style='display: block; position: relative; cursor: pointer;'>" + matchArray[i] + "</li>";
			}
			
			// Add all the list element to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () {
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).html());
			}).mouseover(function () {
				var mouseoverCss = { 
					"cursor": "hand",
		            "color": "#ffffff",
		            "background": "#3399ff"
				};
				$(this).css(mouseoverCss);
			}).mouseout(function () {
				var mouseoutCss = {
					"cursor": "inherit",
		            "color": columnObjColor,
		            "background": "transparent"
				};
				$(this).css(mouseoutCss);
			});

			// If we've got some values to show, then show 'em!
			$("#" + containerId + "processingIndicator").fadeOut("slow");
			if(matchArray.length > 0) $("#" + containerId).slideDown(opt.slideDownSpeed);
		});

	}; // End of function SPAutocomplete

	$.fn.SPServices.SPGetQueryString = function () {
		var queryStringVals = new Object();
		var qs = location.search.substring(1, location.search.length);
		var args = qs.split("&");
		for (var i = 0; i < args.length; i++) {
			var rxQS = /^([^=]+)=(.+)/i,
			matches = rxQS.exec(args[i]);
			if (rxQS.test(location.href))
			if (matches.length > 2) queryStringVals[matches[1]] = unescape(matches[2]).replace('+', ' ');
		}
		return queryStringVals;
	};

	// Display a column (field) formatted correctly based on its definition in the list.
	// NOTE: Currently not dealing with locale differences.
	//   columnXML			The XML node for the column from a GetList operation
	//   columnValue	 	The text representation of the column's value
	//   opt				The current set of options
	function showColumn(columnXML, columnValue, opt) {
		if(columnValue == undefined) return "";
		var outString;
		switch(columnXML.attr("Type")) {
			case "Text":
				outString = columnValue;
 				break;
			case "URL":
				switch(columnXML.attr("Format")) {
					// URL as hyperlink
					case "Hyperlink":
						outString = "<a href='" + columnValue.substring(0, columnValue.search(",")) + "'>" +
							columnValue.substring(columnValue.search(",") + 1) + "</a>";
		 				break;
		 			// URL as image
					case "Image":
						outString = "<img alt='" + columnValue.substring(columnValue.search(",") + 1) +
							"' src='" + columnValue.substring(0, columnValue.search(",")) + "'/>";
		 				break;
		 			// Just in case
		 			default:
						outString = columnValue;
 						break;		 				
				}
				break;
			case "User":
				outString = "<a href='/_layouts/userdisp.aspx?ID=" + columnValue.substring(0, columnValue.search(";#")) +
					"&Source=" + escapeUrl(location.href) + "'>" +
					columnValue.substring(columnValue.search(";#") + 2) + "</a>";
 				break;
			case "Calculated":
				var calcColumn = columnValue.split(";#");
				outString = calcColumn[1];
				break;
 			case "Number":
				outString = parseFloat(columnValue).toFixed(columnXML.attr("Decimals")).toString();
 				break;
 			case "Currency":
				outString = parseFloat(columnValue).toFixed(columnXML.attr("Decimals")).toString();
 				break;
			case "Lookup":
				// Get the display form URL for the lookup source list
				var dispUrl;
				$().SPServices({
					operation: "GetFormCollection",
					async: false,
					listName: columnXML.attr("List"),
					completefunc: function (xData, Status) {
						$(xData.responseXML).find("Form").each(function() {
							if($(this).attr("Type") == "DisplayForm") {
								dispUrl = $(this).attr("Url");
								// Stop looking; we're done
								return false;
							}
						});
					}
				});
				outString = "<a href='" + opt.relatedWebURL + SLASH + dispUrl +
					"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*'>" +
					columnValue.substring(columnValue.search(";#") + 2) + "</a>";
 				break;
			case "Counter":
				outString = columnValue;
 				break;
			default:
				outString = columnValue;
 				break;
		}
		return outString;
	}

	// Show a single attribute of a node, enclosed in a table
	//   node				The XML node
	//   opt				The current set of options
	function showAttrs(node, opt) {
		var out = "<table class='ms-vb' width='100%'>";
		for (var i = 0; i < node.attributes.length; i++) {
			out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
				node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
		}
		out += "</table>";
		return out;
	}

	// Get the current list's GUID (ID) from the current URL.  Use of this function only makes sense if we're in a list's context,
	// and we assume that we are calling it from an aspx page which is a form or view for the list.
	function listNameFromUrl() {

		// Parse out the list's root URL from the current location
		var thisPage = location.href;
		var thisPageBaseName = thisPage.substring(0, thisPage.indexOf(".aspx"));
		var listPath = unescapeUrl(thisPageBaseName.substring(0, thisPageBaseName.lastIndexOf(SLASH))).toUpperCase();

		// Call GetListCollection and loop through the results to find a match with the list's URL to get the list's GUID (ID)
		var thisList = "";
		$().SPServices({
			operation: "GetListCollection",
			async: false,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("List").each(function() {
					var defaultViewUrl = $(this).attr("DefaultViewUrl");
					var listCollList = defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(SLASH)).toUpperCase();
					if(listPath.indexOf(listCollList) > 0) thisList = $(this).attr("ID");
				});
			}
		});

		// Return the GUID (ID)
		return thisList;
	}

	// Find a dropdown (or multi-select) in the DOM. Returns the dropdown onject and its type:
	// S = Simple (select); C = Compound (input + select hybrid); M = Multi-select (select hybrid)
	function dropdownCtl(colName) {
		// Simple
		if((this.Obj = $("select[Title='" + colName + "']")).html() != null) {
			this.Type = "S";
		// Compound
		} else if((this.Obj = $("input[Title='" + colName + "']")).html() != null) {
			this.Type = "C";
		// Multi-select: This will find the multi-select column control on English and most other languages sites where the Title looks like 'Column Name possible values'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title^='" + colName + " ']")).html() != null) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like 'Выбранных значений: Column Name'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=': " + colName + "']")).html() != null) {
			this.Type = "M";
		} else
			this.Type = null;
	}

	// Build an error message based on passed parameters
	function errBox(func, param, msg) {
		var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" + 
			"<b>Parameter</b><br/>" + param + "<br/>" +
			"<b>Message</b><br/>" + msg + "<br/><br/>" +
			"<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
		modalBox(errMsg);
	}

	// Call this function to pop up a branded modal msgBox
	function modalBox(msg) {
		var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
		$("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
		var height = $("#SPServices_msgBox").height();
		var width = $("#SPServices_msgBox").width();
		var leftVal = ($(window).width() / 2) - (width / 2) + "px";
		var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
		$("#SPServices_msgBox").css({border:'5px #C02000 solid', left:leftVal, top:topVal}).show().fadeTo("slow", 0.75).click(function () {
			$(this).fadeOut("3000", function () {
				$(this).remove();
			});
		});
	}

	// Generate a unique id for a containing div using the function name and the column name
	function genContainerId(funcname, columnName) {
		return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
			listName: listNameFromUrl(),
			columnDisplayName: columnName
		});
	}

	// Generate a random number for sorting arrays randomly
	function randOrd() {
		return (Math.round(Math.random())-0.5);
	} 

	// If a string is a URL, format it as a link, else return the string as-is
	function checkLink(s) {
		return ((s.indexOf("http") == 0) || (s.indexOf(SLASH) == 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
	}

	// Get the filename from the full URL
	function fileName(s) {
		return s.substring(s.lastIndexOf(SLASH)+1,s.length);
	}

	// Escape string characters
	function escapeHTML(s) {
		return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	// Escape column values
	function escapeColumnValue(s) {
		return s.replace(/&/g,'&amp;');
	}

	// Unescape Url
	function unescapeUrl(u) {
		return u.replace(/%20/g,' ');
	}

	// Escape Url
	function escapeUrl(u) {
		return u.replace(/&/g,'%26');
	}

	// Wrap an XML node (n) around a value (v)
	function wrapNode(n, v) {
		return "<" + n + ">" + v + "</" + n + ">";
	}

})(jQuery);