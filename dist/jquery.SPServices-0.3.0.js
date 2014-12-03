/*
 * SPServices 0.3.0 - Work with SharePoint's Web Services using jQuery
 * Version 0.3.0
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
 * @cat Plugins/SPServices
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */
 
(function($) {

	// Array to store operation / Web Service associations
	var WSops = new Array();

	WSops["GetAlerts"]					= "Alerts";
	WSops["DeleteAlerts"]				= "Alerts";

	WSops["Mode"]							= "Authentication";
	WSops["Login"]							= "Authentication";

	WSops["GetForm"]						= "Forms";
	WSops["GetFormCollection"]				= "Forms";

	WSops["AddList"]						= "Lists";
	WSops["DeleteList"]						= "Lists";
	WSops["GetAttachmentCollection"]		= "Lists";
	WSops["GetList"]						= "Lists";
	WSops["GetListAndView"]					= "Lists";
	WSops["GetListCollection"]				= "Lists";
	WSops["GetListItems"]					= "Lists";
	WSops["UpdateListItems"]				= "Lists";

	WSops["GetPermissionCollection"]		= "Permissions";

	WSops["GetLinks"]						= "PublishedLinksService";

	WSops["GetPortalSearchInfo"]			= "Search";
	WSops["GetSearchMetadata"]				= "Search";
	WSops["Query"]							= "Search";
	WSops["Status"]							= "Search";

	WSops["AddGroup"]								= "usergroup";
	WSops["AddGroupToRole"]							= "usergroup";
	WSops["AddRole"]								= "usergroup";
	WSops["GetAllUserCollectionFromWeb"]			= "usergroup";
	WSops["GetGroupCollection"]						= "usergroup";
	WSops["GetGroupCollectionFromRole"]				= "usergroup";
	WSops["GetGroupCollectionFromSite"]				= "usergroup";
	WSops["GetGroupCollectionFromUser"]				= "usergroup";
	WSops["GetGroupCollectionFromWeb"]				= "usergroup";
	WSops["GetGroupInfo"]							= "usergroup";
	WSops["GetRoleCollection"]						= "usergroup";
	WSops["GetRoleCollectionFromGroup"]				= "usergroup";
	WSops["GetRoleCollectionFromUser"]				= "usergroup";
	WSops["GetRoleCollectionFromWeb"]				= "usergroup";
	WSops["GetRolesAndPermissionsForCurrentUser"]	= "usergroup";
	WSops["GetRolesAndPermissionsForSite"]			= "usergroup";
	WSops["GetUserCollection"]						= "usergroup";
	WSops["GetUserCollectionFromGroup"]				= "usergroup";
	WSops["GetUserCollectionFromRole"]				= "usergroup";
	WSops["GetUserCollectionFromSite"]				= "usergroup";
	WSops["GetUserCollectionFromWeb"]				= "usergroup";
	WSops["GetUserInfo"]							= "usergroup";
	WSops["GetUserLoginFromEmail"]					= "usergroup";
	WSops["RemoveGroup"]							= "usergroup";

	WSops["GetCommonMemberships"]			= "UserProfileService";
	WSops["GetUserColleagues"]				= "UserProfileService";
	WSops["GetUserLinks"]					= "UserProfileService";
	WSops["GetUserMemberships"]				= "UserProfileService";
	WSops["GetUserPinnedLinks"]				= "UserProfileService";
	WSops["GetUserProfileByName"]			= "UserProfileService";
	WSops["GetUserProfileCount"]			= "UserProfileService";
	WSops["GetUserProfileSchema"]			= "UserProfileService";

	WSops["GetViewCollection"]				= "Views";

	WSops["DeleteAllVersions"]				= "Versions";
	WSops["DeleteVersion"]					= "Versions";
	WSops["GetVersions"]					= "Versions";
	WSops["RestoreVersion"]					= "Versions";

	WSops["GetWebPart2"]					= "WebPartPages";
	WSops["GetWebPartPage"]					= "WebPartPages";
	WSops["GetWebPartProperties2"]			= "WebPartPages";

	WSops["GetListTemplates"]				= "Webs";
	WSops["GetWeb"]							= "Webs";
	WSops["GetWebCollection"]				= "Webs";
	WSops["GetAllSubWebCollection"]			= "Webs";
	WSops["WebUrlFromPageUrl"]				= "Webs";

	WSops["GetTemplatesForItem"]			= "Workflow";
	WSops["GetToDosForItem"]				= "Workflow";
	WSops["GetWorkflowDataForItem"]			= "Workflow";
	WSops["GetWorkflowTaskData"]			= "Workflow";
	WSops["StartWorkflow"]					= "Workflow";

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
		switch(WSops[opt.operation]) {
			case "Alerts":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/2002/1/alerts/" + opt.operation;
 				break;
			case "Permissions":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/" + opt.operation;
 				break;
			case "PublishedLinksService":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/" + opt.operation;
 				break;
			case "Search":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='urn:Microsoft.Search' >";
				SOAPAction = "urn:Microsoft.Search/" + opt.operation;
 				break;
			case "usergroup":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/" + opt.operation;
				break;
			case "UserProfileService":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/" + opt.operation;
				break;
			case "WebPartPages":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/sharepoint/webpartpages' >";
				SOAPAction = "http://microsoft.com/sharepoint/webpartpages/" + opt.operation;
				break;
			case "Workflow":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/workflow/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/workflow/" + opt.operation;
				break;
			default:
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/'>";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/" + opt.operation;
 				break;
		}
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";

		// Build the URL for the Ajax call based on which operation we're calling
		// If the webURL has been provided, then use it, else use the current site
		ajaxURL = ((opt.webURL != "") ? opt.webURL : $().SPServices.SPGetCurrentSite()) +
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
					SOAPEnvelope.payload += "<string>" + opt.IDs[i] + "</string>";
				}
				SOAPEnvelope.payload += "</IDs>";
				break;

			// AUTHENTICATION OPERATIONS
			case "Mode":
				break;
			case "Login":
				SOAPEnvelope.payload += "<username>" + opt.username + "</username>";
				SOAPEnvelope.payload += "<password>" + opt.password + "</password>";
				break;

			// FORM OPERATIONS
			case "GetForm":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<formUrl>" + opt.formUrl + "</formUrl>";
				break;
			case "GetFormCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;

			// LIST OPERATIONS
			case "AddList":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<description>" + opt.description + "</description>";
				SOAPEnvelope.payload += "<templateID>" + opt.templateID + "</templateID>";
				break;
			case "DeleteList":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;
			case "GetAttachmentCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<listItemID>" + opt.ID + "</listItemID>";
				break;
			case "GetList":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;
			case "GetListAndView":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<viewName>" + opt.viewName + "</viewName>";
				break;
			case "GetListCollection":
				break;
			case "GetListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<viewFields>" + opt.CAMLViewFields + "</viewFields>";
				SOAPEnvelope.payload += "<query>" + opt.CAMLQuery + "</query>";
				SOAPEnvelope.payload += "<rowLimit>" + opt.CAMLRowLimit + "</rowLimit>";
				SOAPEnvelope.payload += "<queryOptions>" + opt.CAMLQueryOptions + "</queryOptions>";
				break;
			case "UpdateListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				if(opt.updates.length > 0) {
					SOAPEnvelope.payload += "<updates>" + opt.updates + "</updates>";
				} else {
					SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='Update'>";
					for (i=0; i < opt.valuepairs.length; i++) {
						SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + opt.valuepairs[i][1] +  "</Field>";
					}
					SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
					SOAPEnvelope.payload += "</Method></Batch></updates>";
				}
				break;

			// PERMISSION OPERATIONS
			case "GetPermissionCollection":
				SOAPEnvelope.payload += "<objectName>" + opt.objectName + "</objectName>";
				SOAPEnvelope.payload += "<objectType>" + opt.objectType + "</objectType>";
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
				SOAPEnvelope.payload += "<queryXml>" + escapeHTML(opt.queryXml) + "</queryXml>";
				break;
			case "Status":
				break;

			// USERS AND GROUPS OPERATIONS
			case "AddGroup":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				SOAPEnvelope.payload += "<ownerIdentifier>" + opt.ownerIdentifier + "</ownerIdentifier>";
				SOAPEnvelope.payload += "<ownerType>" + opt.ownerType + "</ownerType>";
				SOAPEnvelope.payload += "<defaultUserLoginName>" + opt.defaultUserLoginName + "</defaultUserLoginName>";
				SOAPEnvelope.payload += "<description>" + opt.description + "</description>";
				break;
			case "AddGroupToRole":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				SOAPEnvelope.payload += "<roleName>" + opt.roleName + "</roleName>";
				break;
			case "AddRole":
				SOAPEnvelope.payload += "<roleName>" + opt.roleName + "</roleName>";
				SOAPEnvelope.payload += "<description>" + opt.description + "</description>";
				SOAPEnvelope.payload += "<permissionMask>" + opt.permissionMask + "</permissionMask>";
				break;
			case "GetAllUserCollectionFromWeb":
				break;
			case "GetGroupCollectionFromRole":
				SOAPEnvelope.payload += "<roleName>" + opt.roleName + "</roleName>";
				break;
			case "GetGroupCollection":
				SOAPEnvelope.payload += "<groupNamesXml>" + opt.groupNamesXml + "</groupNamesXml>";
				break;
			case "GetGroupCollectionFromSite":
				break;
			case "GetGroupCollectionFromUser":
				SOAPEnvelope.payload += "<userLoginName>" + opt.userLoginName + "</userLoginName>";
				break;
			case "GetGroupCollectionFromWeb":
				break;
			case "GetGroupInfo":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				break;
			case "GetRoleCollection":
				SOAPEnvelope.payload += "<roleNamesXml>" + opt.roleNamesXml + "</roleNamesXml>";
				break;
			case "GetRoleCollectionFromGroup":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				break;
			case "GetRoleCollectionFromUser":
				SOAPEnvelope.payload += "<userLoginName>" + opt.userLoginName + "</userLoginName>";
				break;
			case "GetRoleCollectionFromWeb":
				break;
			case "GetRoleInfo":
				SOAPEnvelope.payload += "<roleName>" + opt.roleName + "</roleName>";
				break;
			case "GetRolesAndPermissionsForCurrentUser":
				break;
			case "GetRolesAndPermissionsForSite":
				break;
			case "GetUserCollection":
				SOAPEnvelope.payload += "<userLoginNamesXml>" + opt.userLoginNamesXml + "</userLoginNamesXml>";
				break;
			case "GetUserCollectionFromGroup":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				break;
			case "GetUserCollectionFromRole":
				SOAPEnvelope.payload += "<roleName>" + opt.roleName + "</roleName>";
				break;
			case "GetUserCollectionFromSite":
				break;
			case "GetUserCollectionFromWeb":
				break;
			case "GetUserInfo":
				SOAPEnvelope.payload += "<userLoginName>" + opt.userLoginName + "</userLoginName>";
				break;
			case "GetUserLoginFromEmail":
				SOAPEnvelope.payload += "<emailXml>" + opt.emailXml + "</emailXml>";
				break;
			case "RemoveGroup":
				SOAPEnvelope.payload += "<groupName>" + opt.groupName + "</groupName>";
				break;

			// USERPROFILESERVICE OPERATIONS
			case "GetCommonMemberships":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserColleagues":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserLinks":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserMemberships":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserPinnedLinks":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserProfileByName":
				SOAPEnvelope.payload += "<accountName>" + opt.accountName + "</accountName>";
				break;
			case "GetUserProfileCount":
				break;
			case "GetUserProfileSchema":
				break;

			// VIEW OPERATIONS
			case "GetViewCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;

			// VERSIONS OPERATIONS
			case "DeleteAllVersions":
				SOAPEnvelope.payload += "<fileName>" + opt.fileName + "</fileName>";
				break;
			case "DeleteVersion":
				SOAPEnvelope.payload += "<fileName>" + opt.fileName + "</fileName>";
				SOAPEnvelope.payload += "<fileVersion>" + opt.fileVersion + "</fileVersion>";
				break;
			case "GetVersions":
				SOAPEnvelope.payload += "<fileName>" + opt.fileName + "</fileName>";
				break;
			case "RestoreVersion":
				SOAPEnvelope.payload += "<fileName>" + opt.fileName + "</fileName>";
				SOAPEnvelope.payload += "<fileVersion>" + opt.fileVersion + "</fileVersion>";
				break;

			// WEBPARTPAGES OPERATIONS
			case "GetWebPart2":
				SOAPEnvelope.payload += "<pageUrl>" + opt.pageUrl + "</pageUrl>";
				SOAPEnvelope.payload += "<storageKey>" + opt.storageKey + "</storageKey>";
				SOAPEnvelope.payload += "<storage>" + opt.storage + "</storage>";
				SOAPEnvelope.payload += "<behavior>" + opt.behavior + "</behavior>";
				break;
			case "GetWebPartPage":
				SOAPEnvelope.payload += "<documentName>" + opt.documentName + "</documentName>";
				SOAPEnvelope.payload += "<behavior>" + opt.behavior + "</behavior>";
				break;
			case "GetWebPartProperties2":
				SOAPEnvelope.payload += "<pageUrl>" + opt.pageUrl + "</pageUrl>";
				SOAPEnvelope.payload += "<storage>" + opt.storage + "</storage>";
				SOAPEnvelope.payload += "<behavior>" + opt.behavior + "</behavior>";
				break;

			// WEB OPERATIONS
			case "GetWeb":
				SOAPEnvelope.payload += "<webUrl>" + opt.webURL + "</webUrl>";
				break;
			case "GetListTemplates":
				break;
			case "GetWebCollection":
				break;
			case "GetAllSubWebCollection":
				break;
			case "WebUrlFromPageUrl":
				SOAPEnvelope.payload += "<pageUrl>" + opt.pageURL + "</pageUrl>";
				break;

			// WORKFLOW OPERATIONS
			case "GetTemplatesForItem":
				SOAPEnvelope.payload += "<item>" + opt.item + "</item>";
				break;
			case "GetToDosForItem":
				SOAPEnvelope.payload += "<item>" + opt.item + "</item>";
				break;
			case "GetWorkflowDataForItem":
				SOAPEnvelope.payload += "<item>" + opt.item + "</item>";
				break;
			case "GetWorkflowTaskData":
				SOAPEnvelope.payload += "<item>" + opt.item + "</item>";
				SOAPEnvelope.payload += "<listId>" + opt.listId + "</listId>";
				SOAPEnvelope.payload += "<taskId>" + opt.taskId + "</taskId>";
				break;
			case "StartWorkflow":
				SOAPEnvelope.payload += "<item>" + opt.item + "</item>";
				SOAPEnvelope.payload += "<templateId>" + opt.templateId + "</templateId>";
				SOAPEnvelope.payload += "<workflowParameters>" + opt.workflowParameters + "</workflowParameters>";
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
			url: ajaxURL,
			async: opt.async,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction", SOAPAction);
			},
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml; charset='utf-8'",
			complete: opt.completefunc
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

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// View name in CAML format.
		CAMLQuery: "",				// Query in CAML format
		CAMLViewFields: "",			// View fields in CAML format
     	CAMLRowLimit: "",			// Row limit in CAML format
		CAMLQueryOptions: "<QueryOptions></QueryOptions>",		// Query options in CAML format
		
		// Abstractions for CAML syntax
		valuepairs: [],				// Fieldname / Fieldvalue pairs for UpdateListItems

		username: "",				// Username for the Login operation
		password: "",				// Password for the Login operation
		accountName: "",			// User login in domain/user format for UserProfileService operations
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
	}

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
			parentColumn: "",					// The display name of the parent column in the form
			childColumn: ""						// The display name of the child column in the form
		}, options);

		var childTypeLT20 = true;

        // Find the child column's select (dropdown)
        var childSelect = $().find("select:[Title='" + opt.childColumn + "']");
        
        if (childSelect.html() == null) {
            childSelect = $().find("input:[Title='" + opt.childColumn + "']");
            childSelect.attr("readonly", "readonly");
            childTypeLT20 = false;
        }
        // Find the parent column's select (dropdown)
        var parentSelect = $().find("select:[Title='" + opt.parentColumn + "']");
        
        if (parentSelect.html() == null) {
            parentSelect = $().find("input:[Title='" + opt.parentColumn + "']");
            parentSelect.attr("readonly", "readonly");
            // Bind to the parent column's onfocus event
            parentSelect.bind("focus", function() {
                var realSelect = parentSelect.parent().find("#_Select");
                handleEvent(realSelect, childSelect, childTypeLT20, opt);
                realSelect.trigger("change");
            });
            // Trigger the onchange event for the parent column to set the valid values
            parentSelect.parent().find("img").click();
            parentSelect.blur();
        }
        else {
            handleEvent(parentSelect, childSelect, childTypeLT20, opt);
            parentSelect.trigger("change");
        }
	};

	function handleEvent(ctr, childCtr, childTypeLT20, opt) {
		var parentSelectedValue;
		var displayedOnce = false;
		var choices = "";
		
		ctr.bind("change", function() {
        	// Get the current child column selection, if there is one
			var childSelectSelected = null;
			childTypeLT20 ? childSelectSelected = childCtr.find("option:selected").val() :
				childSelectSelected = childCtr.attr("value");
			parentSelectedValue = ctr.find("option:selected").text();

			// When the parent column's selected option changes, get the matching items from the relationship list
			$().SPServices({
				operation: "GetListItems",
				// Force sync so that we have the right values for the child column onchange trigger
				async: false,
				webURL: opt.relationshipWebURL, 
				listName: opt.relationshipList,
				// Filter based on the currently selected parent column's value
				CAMLQuery: "<Query><Where><Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'>" + escapeHTML(parentSelectedValue) + "</Value></Eq></Where></Query>",
				// Only get the parent and child columns
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListParentColumn + "' /><FieldRef Name='" + opt.relationshipListChildColumn + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: "<RowLimit>0</RowLimit>",
				completefunc: function(xData, Status) {
					// Add an explanatory prompt
					if (childTypeLT20) {
						childCtr.attr({ length: 0 }).append("<option value='0'>Choose " + opt.childColumn + "...</option>");
					} else {
						choices = "(None)|0";
						childCtr.attr("value", "");
					}
					// Add an option for each child item
					$(xData.responseXML).find("z\\:row").each(function() {
						if (childTypeLT20) {
							var selected = ($(this).attr("ows_ID") == childSelectSelected) ? " selected='selected'" : "";
							childCtr.append("<option" + selected + " value='" + $(this).attr("ows_ID") + "'>" + $(this).attr("ows_" + opt.relationshipListChildColumn) + "</option>");
						} else {
							if ($(this).attr("ows_" + opt.relationshipListChildColumn) == childSelectSelected) childCtr.attr("value", childSelectSelected);
							choices = choices + "|" + $(this).attr("ows_" + opt.relationshipListChildColumn) + "|" + $(this).attr("ows_ID");
						}
					});
					childCtr.attr("choices", choices);
				}
			});

			// Trigger the child column's onchange event
			if (childTypeLT20)
				childCtr.trigger("change");
			else if (displayedOnce) {
				ctr.blur();
				childCtr.parent().find("img").click();
				childCtr.blur();
			}
			if (ctr.css("display") != "none")
				displayedOnce = true;
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
			displayFormat: "table"				// The format to use in displaying the related information.  Possible values are: "table".
		}, options);


        // Find the column's select (dropdown)
        var columnSelect = $().find("select:[Title='" + opt.columnName + "']");
        
        if (columnSelect.html() == null) {
            columnSelect = $().find("input:[Title='" + opt.columnName + "']");
            columnSelect.attr("readonly", "readonly");
            // Bind to the parent column's onfocus event
            columnSelect.bind("focus", function() {
                var realSelect = columnSelect.parent().find("#_Select");
                showRelated(realSelect, opt);
            });
            // Trigger the onchange event for the column to show the related values
            columnSelect.parent().find("img").click();
            columnSelect.blur();
        }
        else {
            showRelated(columnSelect, opt);
            columnSelect.trigger("change");
        }
	};

	function showRelated(ctr, opt) {
		
		var selectedValue;
		ctr.parent().append("<div id=showRelated_" + encodeColumn(opt.columnName) + "></div>");
		
		ctr.bind("change", function() {
			// When the column's selected option changes, get the matching items from the related list
			selectedValue = ctr.find("option:selected").text();

			// Only get the requested columns
			var relatedColumnsXML = [];

			// Get information about the related list and its columns
			$().SPServices({
				operation: "GetList",
				async: false,
				webURL: opt.relatedWebURL, 
				listName: opt.relatedList,
				completefunc: function(xData, Status) {
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
				CAMLQuery: "<Query><Where><Eq><FieldRef Name='" + opt.relatedListColumn + "'/><Value Type='Text'>" + escapeHTML(selectedValue) + "</Value></Eq></Where></Query>",
				CAMLViewFields: "<ViewFields>" + viewFields +  "</ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: "<RowLimit>0</RowLimit>",
				completefunc: function(xData, Status) {
					// Output each row
					switch(opt.displayFormat) {
						// Only implementing the table format in the first iteration (v0.2.9)
						case "table":
							var outString = "<table>";
							outString += "<tr>";
							for (i=0; i < opt.relatedColumns.length; i++) {
								outString += "<th class='ms-vh2'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
							}
							outString += "</tr>";
							$(xData.responseXML).find("z\\:row").each(function() {
								outString += "<tr>";
								for (i=0; i < opt.relatedColumns.length; i++) {
									outString += "<td class='ms-vb'>" + showColumn(relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
								}
								outString += "</tr>";
							});
							outString += "</table>";
							$("#showRelated_" + encodeColumn(opt.columnName)).html("").append(outString);
							break;
						default:
							break;
					}
				}
			});
		});
	}
	
	// Display a column (field) formatted correctly based on its definition in the list.
	// Currently not dealing with locale differences.
	// columnXML is the XML node for the column from a GetList operation
	// columnValue is the text representation of the column's value
	// opt is the current set of options
	function showColumn(columnXML, columnValue, opt) {
		if(columnValue == undefined) return "";
		var outString = columnValue;
		switch(columnXML.attr("Type")) {
			case "Text":
				outString = columnValue;
 				break;
			case "URL":
				outString = "<img alt='" + columnValue.substring(columnValue.search(",") + 1) +
					"' src='" + columnValue.substring(0, columnValue.search(",")) + "'/>";
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
				alert(columnXML.attr("Type") + " not supported.");
 				break;
		}	
		return outString;
	}

	// Function to display related information when an option is selected on a form.
	$.fn.SPServices.SPDebugXMLHttpResult = function(options) {	

		var opt = $.extend({}, {
			node: null,						// An XMLHttpResult object from an ajax call
			outputId: "",					// The id of the DOM object for output
			indent: 0						// Number of indents
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
					outputId: opt.outputId,
					indent: opt.indent + 1
				});
			}
			outString += "</td></tr>"; 
		}
		outString += "</table>";
		// Return the HTML which we have built up
		return outString;
	}

	// Show a single attribute of a node, enclosed in a table
	function showAttrs(node, opt) {
		var out;
		var outVal;
		out = "<table class='ms-vb' width='100%'>";
		for (var i = 0; i < node.attributes.length; i++) {
			out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
				node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
		}
		out += "</table>";
		return out;
	}
	
	// Format URLs as links
	function checkLink(nodeVal) {
		var outVal = ((nodeVal.indexOf("http") == 0) || (nodeVal.indexOf("/") == 0)) ?
			"<a href='" + nodeVal + "'>" + nodeVal + "</a>" : nodeVal;
		return outVal;
	}

	// Escape characters
	function escapeHTML(str) {
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	// Encode column name
	function encodeColumn(str) {
		return str.replace(/ /g,'_x0020_');
	}

})(jQuery);