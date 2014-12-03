/*
 * SPServices - Work with SharePoint's Web Services using jQuery
 * Version 0.4.5
 * @requires jQuery v1.3.2
 *
 * Copyright (c) 2009 Sympraxis Consulting LLC
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

	// Arrays to store Web Service / operation associations
	var WS = new Array();
	WS["Alerts"]				= "Alerts";
	WS["Authentication"]		= "Authentication";
	WS["Copy"]					= "Copy";
	WS["Forms"]					= "Forms";
	WS["Lists"]					= "Lists";
	WS["Permissions"]			= "Permissions";
	WS["PublishedLinksService"] = "PublishedLinksService";
	WS["Search"]				= "Search";
	WS["usergroup"]				= "usergroup";
	WS["UserProfileService"]	= "UserProfileService";
	WS["Views"]					= "Views";
	WS["Versions"]				= "Versions";
	WS["WebPartPages"]			= "WebPartPages";
	WS["Webs"]					= "Webs";
	WS["Workflow"]				= "Workflow";
	
	var WSops = new Array();

	WSops["GetAlerts"]								= WS["Alerts"];
	WSops["DeleteAlerts"]							= WS["Alerts"];

	WSops["Mode"]									= WS["Authentication"];
	WSops["Login"]									= WS["Authentication"];

	WSops["CopyIntoItemsLocal"]						= WS["Copy"];

	WSops["GetForm"]								= WS["Forms"];
	WSops["GetFormCollection"]						= WS["Forms"];

	WSops["AddList"]								= WS["Lists"];
	WSops["CheckInFile"]							= WS["Lists"];
	WSops["CheckOutFile"]							= WS["Lists"];
	WSops["DeleteList"]								= WS["Lists"];
	WSops["GetAttachmentCollection"]				= WS["Lists"];
	WSops["GetList"]								= WS["Lists"];
	WSops["GetListAndView"]							= WS["Lists"];
	WSops["GetListCollection"]						= WS["Lists"];
	WSops["GetListItems"]							= WS["Lists"];
	WSops["UpdateListItems"]						= WS["Lists"];

	WSops["GetPermissionCollection"]				= WS["Permissions"];

	WSops["GetLinks"]								= WS["PublishedLinksService"];

	WSops["GetPortalSearchInfo"]					= WS["Search"];
	WSops["GetSearchMetadata"]						= WS["Search"];
	WSops["Query"]									= WS["Search"];
	WSops["Status"]									= WS["Search"];

	WSops["AddGroup"]								= WS["usergroup"];
	WSops["AddGroupToRole"]							= WS["usergroup"];
	WSops["AddRole"]								= WS["usergroup"];
	WSops["GetAllUserCollectionFromWeb"]			= WS["usergroup"];
	WSops["GetGroupCollection"]						= WS["usergroup"];
	WSops["GetGroupCollectionFromRole"]				= WS["usergroup"];
	WSops["GetGroupCollectionFromSite"]				= WS["usergroup"];
	WSops["GetGroupCollectionFromUser"]				= WS["usergroup"];
	WSops["GetGroupCollectionFromWeb"]				= WS["usergroup"];
	WSops["GetGroupInfo"]							= WS["usergroup"];
	WSops["GetRoleCollection"]						= WS["usergroup"];
	WSops["GetRoleCollectionFromGroup"]				= WS["usergroup"];
	WSops["GetRoleCollectionFromUser"]				= WS["usergroup"];
	WSops["GetRoleCollectionFromWeb"]				= WS["usergroup"];
	WSops["GetRolesAndPermissionsForCurrentUser"]	= WS["usergroup"];
	WSops["GetRolesAndPermissionsForSite"]			= WS["usergroup"];
	WSops["GetUserCollection"]						= WS["usergroup"];
	WSops["GetUserCollectionFromGroup"]				= WS["usergroup"];
	WSops["GetUserCollectionFromRole"]				= WS["usergroup"];
	WSops["GetUserCollectionFromSite"]				= WS["usergroup"];
	WSops["GetUserCollectionFromWeb"]				= WS["usergroup"];
	WSops["GetUserInfo"]							= WS["usergroup"];
	WSops["GetUserLoginFromEmail"]					= WS["usergroup"];
	WSops["RemoveGroup"]							= WS["usergroup"];

	WSops["GetCommonMemberships"]					= WS["UserProfileService"];
	WSops["GetUserColleagues"]						= WS["UserProfileService"];
	WSops["GetUserLinks"]							= WS["UserProfileService"];
	WSops["GetUserMemberships"]						= WS["UserProfileService"];
	WSops["GetUserPinnedLinks"]						= WS["UserProfileService"];
	WSops["GetUserProfileByName"]					= WS["UserProfileService"];
	WSops["GetUserProfileCount"]					= WS["UserProfileService"];
	WSops["GetUserProfileSchema"]					= WS["UserProfileService"];

	WSops["GetViewCollection"]						= WS["Views"];

	WSops["DeleteAllVersions"]						= WS["Versions"];
	WSops["DeleteVersion"]							= WS["Versions"];
	WSops["GetVersions"]							= WS["Versions"];
	WSops["RestoreVersion"]							= WS["Versions"];

	WSops["GetWebPart2"]							= WS["WebPartPages"];
	WSops["GetWebPartPage"]							= WS["WebPartPages"];
	WSops["GetWebPartProperties"]					= WS["WebPartPages"];
	WSops["GetWebPartProperties2"]					= WS["WebPartPages"];

	WSops["GetListTemplates"]						= WS["Webs"];
	WSops["GetWeb"]									= WS["Webs"];
	WSops["GetWebCollection"]						= WS["Webs"];
	WSops["GetAllSubWebCollection"]					= WS["Webs"];
	WSops["WebUrlFromPageUrl"]						= WS["Webs"];

	WSops["GetTemplatesForItem"]					= WS["Workflow"];
	WSops["GetToDosForItem"]						= WS["Workflow"];
	WSops["GetWorkflowDataForItem"]					= WS["Workflow"];
	WSops["GetWorkflowTaskData"]					= WS["Workflow"];
	WSops["StartWorkflow"]							= WS["Workflow"];

	// Set up SOAP envelope
	var SOAPEnvelope = new Object();
	SOAPEnvelope.header = "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
	SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
	SOAPEnvelope.payload = "";

	// Main function, which calls SharePoint's Web Services directly.
	$.fn.SPServices = function(options) {

		// If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
		var opt = $.extend({}, $.fn.SPServices.defaults, options);

		// Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
		SOAPEnvelope.opheader = "<" + opt.operation + " ";
		switch(WSops[opt.operation]) {
			case WS["Alerts"]:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/";
 				break;
			case WS["Permissions"]:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/";
 				break;
			case WS["PublishedLinksService"]:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
 				break;
			case WS["Search"]:
				SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
				SOAPAction = "urn:Microsoft.Search/";
 				break;
			case WS["usergroup"]:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/";
				break;
			case WS["UserProfileService"]:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
				break;
			case WS["WebPartPages"]:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
				SOAPAction = "http://microsoft.com/sharepoint/webpartpages/";
				break;
			case WS["Workflow"]:
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
		var ajaxURL = ((opt.webURL != "") ? opt.webURL : $().SPServices.SPGetCurrentSite()) +
				"/_vti_bin/" + WSops[opt.operation] + ".asmx";

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
			case "CopyIntoItemsLocal":
				SOAPEnvelope.payload += wrapNode("SourceUrl", opt.SourceUrl);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
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
			case "GetListItems":
				SOAPEnvelope.payload += wrapNode("listName", opt.listName);
				SOAPEnvelope.payload += wrapNode("viewFields", opt.CAMLViewFields);
				SOAPEnvelope.payload += wrapNode("query", opt.CAMLQuery);
				SOAPEnvelope.payload += wrapNode("rowLimit", opt.CAMLRowLimit);
				SOAPEnvelope.payload += wrapNode("queryOptions", opt.CAMLQueryOptions);
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

			// PERMISSION OPERATIONS
			case "GetPermissionCollection":
				SOAPEnvelope.payload += wrapNode("objectName", opt.objectName);
				SOAPEnvelope.payload += wrapNode("objectType", opt.objectType);
				break;

			// PUBLISHEDLINKSSERVICE OPERATIONS
			case "GetLinks":
				break;

			// SEARCH OPERATIONS
			case "GetPortalSearchInfo":
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'/>";
				break;
			case "GetSearchMetadata":
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'/>";
				break;
			case "Query":
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
				xhr.setRequestHeader("SOAPAction", SOAPAction);
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

		username: "",				// Username for the Login operation
		password: "",				// Password for the Login operation
		accountName: "",			// User login in domain/user format for UserProfileService operations
		AccountName: "",			// User login in domain/user format for UserProfileService operations
		userLoginName: "",			// User login in domain/user format for user operations
		groupNamesXml: "",			// XML that specifies one or more group definition names
		groupName: "",				// A string that contains the name of the group definition
		ownerIdentifier: "",		// A string that contains the user name (DOMAIN\User_Alias) of the owner for the group
		ownerType: "",				// A string that specifies the type of owner, which can be either user or group
		defaultUserLoginName: "",	// A string that contains the user name (DOMAIN\User_Alias) of the default user for the group
		roleNamesXml: "",			// XML that specifies one or more role definition names
		roleName: "",				// A string that contains the name of the role definition
		permissionMask: "",			// A string representation of the 32-bit integer in decimal format that represents a Microsoft.SharePoint.SPRights value
		userLoginNamesXml: "",		// XML that contains information about the users
		emailXml: "",				// A string that contains email address
		objectName: "",				// objectName for operations which require it
		objectType: "List",			// objectType for operations which require it
		IDs: null,					// List of GUIDs

		SourceUrl: "",				// Source URL for copy operations
		DestinationUrls: [],		// Array of destination URLs for copy operations

		documentName: "",			// The name of the Web Part Page.
		behavior: "Version3", 		// An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
		storageKey: "",				// A GUID that identifies the Web Part
		storage: "Shared",			// A Storage value indicating how the Web Part is stored: {None | Personal | Shared}

		item: "",					// The URL location of an item on which a workflow is being run.
		listId: "",					// Globally unique identifier (GUID) of a task list containing the task
		taskId: "",					// Unique identifier (ID) of a task
		templateId: "",				// Globally unique identifier (GUID) of a template
		workflowParameters: "",		// The initiation form data
		fClaim: false,				// Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.

		queryXml: "",				// A string specifying the search query XML

		async: true,				// Allow the user to force async
		completefunc: null			// Function to call on completion
	};

	// Function to determine the current Web's URL.  We need this for successful Ajax calls.
	// The function is also available as a public function.
	$.fn.SPServices.SPGetCurrentSite = function() {
		var thisSite = "";
		var msg = SOAPEnvelope.header +
				"<WebUrlFromPageUrl xmlns='http://schemas.microsoft.com/sharepoint/soap/' ><pageUrl>" +
				((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
				"</pageUrl></WebUrlFromPageUrl>" +
				SOAPEnvelope.footer;
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: "/_vti_bin/Webs.asmx",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
					"http://schemas.microsoft.com/sharepoint/soap/WebUrlFromPageUrl");
			},
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
				cascadeDropdown(opt);
				break;
			default:
				break;
		}
	};

	function cascadeDropdown(opt) {
		var choices = "";
		var childSelectSelected = null;
		var parentSelectSelected = null;

		// Find the parent column's select (dropdown)
		var parentSelect = new dropdownCtl(opt.parentColumn);

		// Find the child column's select (dropdown)
		var childSelect = new dropdownCtl(opt.childColumn);
		if(childSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPCascadeDropdowns", "childColumn: " + opt.childColumn, "Column not found on page"); return; }

		// Get the current column selection(s)
		switch(parentSelect.Type) {
			case "S":
				parentSelectSelected = parentSelect.Obj.find("option:selected").text();
				break;
			case "C":
				parentSelectSelected = parentSelect.Obj.attr("value");
				break;
			case "M":
				//parentSelectSelected = parentSelect.Obj.find("option:selected").text();
				break;
			default:
				break;
		}

		// Get the current child column selection, if there is one
		switch(childSelect.Type) {
			case "S":
				childSelectSelected = childSelect.Obj.find("option:selected").val();
				break;
			case "C":
				childSelectSelected = childSelect.Obj.attr("value");
				break;
			case "M":
				break;
			default:
				break;
		}

		// When the parent column's selected option changes, get the matching items from the relationship list
		var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
		
		$().SPServices({
			operation: "GetListItems",
			// Force sync so that we have the right values for the child column onchange trigger
			async: false,
			webURL: opt.relationshipWebURL,
			listName: opt.relationshipList,
			// Filter based on the currently selected parent column's value
			CAMLQuery: "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where><Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'>" + parentSelectSelected + "</Value></Eq></Where></Query>",
			// Only get the parent and child columns
			CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListParentColumn + "' /><FieldRef Name='" + opt.relationshipListChildColumn + "' /></ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
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
						childSelect.Obj.attr({ length: 0 }).append("<option value='0'>Choose " + opt.childColumn + "...</option>");
						break;
					case "C":
						choices = "(None)|0";
						childSelect.Obj.attr("value", "");
						break;
					case "M":
						childSelect.Obj.attr({ length: 0 });
						multiSelectedValuesObj.attr({ length: 0 });
						break;
					default:
						break;
				}
				var rows = getZRows(xData.responseXML);
				// Add an option for each child item
				$(rows).each(function() {
					switch(childSelect.Type) {
						case "S":
							var selected = ($(this).attr("ows_ID") == childSelectSelected) ? " selected='selected'" : "";
							childSelect.Obj.append("<option" + selected + " value='" + $(this).attr("ows_ID") + "'>" + $(this).attr("ows_" + opt.relationshipListChildColumn) + "</option>");
							break;
						case "C":
							if ($(this).attr("ows_" + opt.relationshipListChildColumn) == childSelectSelected) childSelect.Obj.attr("value", childSelectSelected);
							choices = choices + "|" + $(this).attr("ows_" + opt.relationshipListChildColumn) + "|" + $(this).attr("ows_ID");
							break;
						case "M":
							childSelect.Obj.append("<option value='" + $(this).attr("ows_ID") + "'>" + $(this).attr("ows_" + opt.relationshipListChildColumn) + "</option>");
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
						break;
					default:
						break;
				}
			}
		});
	}

	// Function to display related information when an option is selected on a form.
	$.fn.SPServices.SPDisplayRelatedInfo = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the parent in the form
			relatedWebURL: "",					// [Optional] The name of the Web (site) which contains the relationships list
			relatedList: "",					// The name of the list which contains the additional information
			relatedListColumn: "",				// The internal name of the parent column in the related list
			relatedColumns: [],					// An array of related columns to display
			displayFormat: "table",				// The format to use in displaying the related information.  Possible values are: "table".
			headerCSSClass: "ms-vh2",			// CSS class for the table headers
			rowCSSClass: "ms-vb",				// CSS class for the table rows
			debug: false						// If true, show error messages; if false, run silent
		}, options);

		// Find the column's select (dropdown)
		var columnSelect = new dropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPDisplayRelatedInfo", "columnName: " + opt.columnName, "Column not found on page"); return; }

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
					"Multi-select columns not support by this function");
				break;
			default:
				break;
		}
	};

	function showRelated(opt) {

		var columnSelectSelected = null;

		// Find the column's select (dropdown)
		var columnSelect = new dropdownCtl(opt.columnName);
		var divId = "showRelated_" + encodeColumn(opt.columnName);
		$("#" + divId).remove();
		columnSelect.Obj.parent().append("<div id=" + divId + "></div>");

		// Get the current column selection(s)
		switch(columnSelect.Type) {
			case "S":
				columnSelectSelected = columnSelect.Obj.find("option:selected").text();
				break;
			case "C":
				columnSelectSelected = columnSelect.Obj.attr("value");
				break;
			case "M":
				break;
			default:
				break;
		}

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
			CAMLQuery: "<Query><Where><Eq><FieldRef Name='" + opt.relatedListColumn + "'/><Value Type='Text'>" + columnSelectSelected + "</Value></Eq></Where></Query>",
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
				// Output each row
				switch(opt.displayFormat) {
					// Only implementing the table format in the first iteration (v0.2.9)
					case "table":
						var outString = "<table>";
						outString += "<tr>";
						for (i=0; i < opt.relatedColumns.length; i++) {
							outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
						}
						outString += "</tr>";
						var rows = getZRows(xData.responseXML);
						// Add an option for each child item
						$(rows).each(function() {
							outString += "<tr>";
							for (i=0; i < opt.relatedColumns.length; i++) {
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
							}
							outString += "</tr>";
						});
						outString += "</table>";
						$("#showRelated_" + encodeColumn(opt.columnName)).html("").append(outString);
						break;
					// list format implemented in v0.5.0. Still table-based, but vertical orientation.
					case "list":
						var outString = "<table>";
						for (i=0; i < opt.relatedColumns.length; i++) {
							$(xData.responseXML).find("z\\:row").each(function() {
								outString += "<tr>";
								outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
								outString += "</tr>";
							});
						}
						outString += "</table>";
						$("#showRelated_" + encodeColumn(opt.columnName)).html("").append(outString);
						break;
					default:
						break;
				}
			}
		});
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
					indent: opt.indent + 1
				});
			}
			outString += "</td></tr>";
		}
		outString += "</table>";
		// Return the HTML which we have built up
		return outString;
	};

	// Function which returns the account name for the current user in DOMAIN\username format
	$.fn.SPServices.SPGetCurrentUser = function() {
		var username = "";
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: "/_layouts/userdisp.aspx?Force=True",
			complete: function (xData, Status) {
				$(xData.responseText).find("table.ms-formtable td#SPFieldText").each(function() {
					if(/FieldInternalName=\"Name\"/.test($(this).html())) username = $(this).text();
				});
			}
		});
		return username.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '');
	};

	// Function which provides a link on a Lookup column for the user to follow
	// which allows them to add a new value to the Lookup list.
	// Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
	// by Waldek Mastykarz
	$.fn.SPServices.SPLookupAddNew = function(options) {

		var opt = $.extend({}, {
			lookupColumn: "",				// The display name of the Lookup column
			promptText: "Add new {0}",		// Text to use as prompt + column name
			debug: false					// If true, show error messages; if false, run silent
		}, options);

		// Find the lookup column's select (dropdown)
		var lookupSelect = new dropdownCtl(opt.lookupColumn);
		if(lookupSelect.Obj.html() == null && opt.debug) { errBox("SPServices.SPLookupAddNew", "lookupColumn: " + opt.lookupColumn, "Column not found on page"); return; }

		var newUrl = "";
		var lookupListUrl = "";
		// Use GetList for the current list to determine the details for the Lookup column
		$().SPServices({
			operation: "GetList",
			async: false,
			listName: listNameFromUrl(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("Field").each(function() {
					if($(this).attr("DisplayName") == opt.lookupColumn) {
						// Use GetList for the Lookup column's list to determine the list's URL
						$().SPServices({
							operation: "GetList",
							async: false,
							listName: $(this).attr("List"),
							completefunc: function (xData, Status) {
								$(xData.responseXML).find("List").each(function() {
									lookupListUrl = $(this).attr("WebFullUrl");
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
					}
				});
			}
		});
		if(newUrl.length > 0) {
			// Build the link to the Lookup column's list
			newLink = "<a href='" + lookupListUrl + "/" + newUrl + "?Source=" + escapeUrl(location.href) + "'>" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a>";

			// Append the link to the Lookup columns's formbody table cell
			$(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
		}
	};

	// Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
	// between list forms
	$.fn.SPServices.SPGetLastItemId = function(options) {

		var opt = $.extend({}, {
			webURL: "",				// URL of the target Web.  If not specified, the current Web is used.
			listName: "",			// The name or GUID of the list
			userAccount: ""			// The account for the user in DOMAIN\username format. If not specified, the current user is used.
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
		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: "<Query><Where><Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq></Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>",
			CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
			CAMLRowLimit: 1,
			completefunc: function(xData, Status) {
				var rows = getZRows(xData.responseXML);
				$(rows).each(function() {
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
			ignoreCase: "false",						// If set to true, the function ignores case, if false it looks for an exact match
			initMsg: "This value must be unique.",		// Initial message to display after setup
			initMsgCSSClass: "ms-vb",					// CSS class for initial message
			errMsg: "This value is not unique.",		// Error message to display if not unique
			errMsgCSSClass: "ms-formvalidation"			// CSS class for error message
		}, options);

		var msg = "<span id='SPRequireUnique' class='{0}'>{1}<br/></span>";
		var initMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);
		var errMsg =  msg.replace(/\{0\}/g, opt.errMsgCSSClass).replace(/\{1\}/g, opt.errMsg);
		var thisList = listNameFromUrl();
		var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
			listName: thisList,
			columnStaticName: opt.columnStaticName
		});
		var columnObj = $("input:[Title='" + columnDisplayName + "']");
		$(columnObj).parent().append(initMsg);

		$(columnObj).change(function () {
			var columnValueCount = 0;
			// Get the columnDisplayName's value
			var columnValue = $(this).attr("value");

			// Call the Lists Web Service (GetListItems) to see if the value already exists
			$().SPServices({
				operation: "GetListItems",
				async: false,
				listName: listNameFromUrl(),
				// Filter based on columnDisplayName's value
				CAMLViewFields: "<ViewFields><FieldRef Name='" + columnDisplayName + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					var rows = getZRows(xData.responseXML);
					$(rows).each(function() {
						var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
						if(testValue == thisValue) columnValueCount++;
					});
				}
			});

			var newMsg = initMsg;
			var buttonsDisabled = "";
			if(columnValueCount > 0) {
				newMsg = errMsg;
				buttonsDisabled = "disabled";
				if(opt.duplicateAction == 1) $("input:[Title='" + columnDisplayName + "']").focus();
			}
			$("span#SPRequireUnique").html(newMsg);
			$("input:[value='OK']").attr("disabled", buttonsDisabled);

		});
	};

	// This function returns the DisplayName for a column based on the StaticName.
	$.fn.SPServices.SPGetDisplayFromStatic = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnStaticName: ""			// StaticName of the column
		}, options);

		var staticName = "";
		$().SPServices({
			operation: "GetList",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Field").each(function() {
					if($(this).attr("StaticName") == opt.columnStaticName) displayName = $(this).attr("DisplayName");
				});
			}
		});
		return displayName;
	};

	// This function allows you to redirect to a another page from a new item form with the new
	// item's ID. This allows chaining of forms from item creation onward. 
	$.fn.SPServices.SPRedirectWithID = function (options) {

		var opt = $.extend({}, {
			redirectUrl: ""				// Page for the redirect
		}, options);

		var thisList = listNameFromUrl();
		var vals = getQS();
		var lastID = vals["ID"];

		// On first load, change the form actions to redirect back to this page with the current lastID for this user and the
		// original Source.
		if(vals["ID"] == undefined) {
			lastID = $().SPServices.SPGetLastItemId({
				listName: thisList
			});
			$().find("form[name='aspnetForm']").each(function() {
				// This page...
				var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
				// ... plus the Source if it exists
				var thisSource = (typeof vals["Source"] == "string") ?
					"Source=" + vals["Source"].replace(/\//g, "%2f").replace(/:/g, "%3a") : "";
				var newAction = thisUrl + "?Source=" + thisUrl + "?ID=" + lastID +
					((thisSource.length > 0) ? ("%26RealSource=" + vals["Source"]) : "") +
					((typeof vals["RedirectURL"] == "string") ? ("%26RedirectURL=" + vals["RedirectURL"]) : "");
				$(this).attr("action", newAction);
			});
		// If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
		// then do the redirect to redirectUrl with the new lastID, passing along the original Source.
		} else {
			while(vals["ID"] == lastID) {
				lastID = $().SPServices.SPGetLastItemId({
					listName: thisList
				});
			}
			// If there is a RedirectURL parameter on the Query String, then redirect there instead of the value
			// specified in the options (opt.redirectUrl)
			var thisRedirectUrl = (typeof vals["RedirectURL"] == "string") ? vals["RedirectURL"] : opt.redirectUrl;
			location.href = thisRedirectUrl + "?ID=" + lastID +
				((typeof vals["RealSource"] == "string") ? ("&Source=" + vals["RealSource"]) : "");
		}
	};

	//PRIVATE FUNCTIONS

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
			case "Number":
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
							if($(this).attr("Type") == "DisplayForm") dispUrl = $(this).attr("Url");
						});
					}
				});
				outString = "<a href='" + opt.relatedWebURL + "/" + dispUrl +
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

	// Get the current list name from the URL
	function listNameFromUrl() {
		var thisSite = $().SPServices.SPGetCurrentSite();
		var listPath = location.href.replace(thisSite, "").replace("/Lists/", "");
		var thisList = unescapeUrl(listPath.substr(0,listPath.search("/")));
		return thisList;
	}

	// Find a dropdown (or multi-select) in the DOM. Returns the dropdown onject and its type:
	// S = Simple (seelct); C = Compound (input + select hybrid); M = Multi-select (select hybrid)
	function dropdownCtl(colName) {
		if((this.Obj = $().find("select:[Title='" + colName + "']")).html() != null) {
			this.Type = "S";
		} else if((this.Obj = $().find("input:[Title='" + colName + "']")).html() != null) {
			this.Type = "C";
		} else if((this.Obj = $().find("select:[Title='" + colName + " possible values']")).html() != null) {
			this.Type = "M";
		} else
			this.Type = null;
	}
	
	// Find the rows in an XMLHttpRequest.  This includes a workaround for Safari and Chrome's
	// aversion to the z:row namespace.
	function getZRows(rXML) {
		var rows;
		var itemCount = $(rXML).find("rs\\:data").attr("ItemCount");
		if (rXML.getElementsByTagName("z:row").length == 0 && itemCount == undefined) {
			rows = rXML.getElementsByTagNameNS('*', 'row');
		} else {
			rows = rXML.getElementsByTagName("z:row");
		}
		return rows;
	}

	// Build an error message based on passed parameters
	function errBox(func, param, msg) {
		var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" + 
			"<b>Parameter</b><br/>" + param + "<br/>" +
			"<b>Message</b><br/>" + msg + "<br/><br/>" +
			"<span style='width=100%;text-align:right;'>Click to continue</span></div>";
		modalBox(errMsg);
	}

	// Call this function to pop up a branded modal msgBox
	function modalBox(msg) {
		var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
		$().find("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
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

	function getQS() {
		var vals = new Object();
		var qs = location.search.substring(1, location.search.length);
		var args = qs.split("&");
		for (var i=0; i < args.length; i++) {
			var nameVal = args[i].split("=");
			var temp = unescape(nameVal[1]).split('+');
			nameVal[1] = temp.join(' ');
			vals[nameVal[0]] = nameVal[1];
		}
		return vals;
	}

	// If a string is a URL, format it as a link, else return the string as-is
	function checkLink(s) {
		return ((s.indexOf("http") == 0) || (s.indexOf("/") == 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
	}

	// Escape string characters
	function escapeHTML(s) {
		return s.replace(/"/g,'&quot;').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	// Unescape Url
	function unescapeUrl(u) {
		return u.replace(/%20/g,' ');
	}

	// Escape Url
	function escapeUrl(u) {
		return u.replace(/&/g,'%26');
	}

	// Encode a column name
	function encodeColumn(s) {
		return s.replace(/ /g,'_x0020_');
	}

	// Wrap an XML node (n) around a value (v)
	function wrapNode(n, v) {
		return "<" + n + ">" + v + "</" + n + ">";
	}

})(jQuery);