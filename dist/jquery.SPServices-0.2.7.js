/*
 * SPServices 0.2.6 - Work with SharePoint's Web Services using jQuery
 * Version 0.2.6
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

	WSops["GetFormCollection"]			= "Forms";

	WSops["GetAttachmentCollection"]	= "Lists";
	WSops["GetList"]					= "Lists";
	WSops["GetListCollection"]			= "Lists";
	WSops["GetListItems"]				= "Lists";
	WSops["UpdateListItems"]			= "Lists";

	WSops["GetPermissionCollection"]	= "Permissions";

	WSops["GetUserInfo"]				= "usergroup";

	WSops["GetViewCollection"]			= "Views";

	WSops["DeleteAllVersions"]			= "Versions";
	WSops["DeleteVersion"]				= "Versions";
	WSops["GetVersions"]				= "Versions";
	WSops["RestoreVersion"]				= "Versions";

	WSops["GetWeb"]						= "Webs";
	WSops["GetWebCollection"]			= "Webs";
	WSops["GetAllSubWebCollection"]		= "Webs";
	WSops["WebUrlFromPageUrl"]			= "Webs";

	// Set up SOAP envelope
	var SOAPEnvelope = new Object();
	SOAPEnvelope.header = "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
	SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
	SOAPEnvelope.payload = "";
	
	// Main function, which calls SharePoint's Web Services directly.
	$.fn.SPServices = function(options) {	

		// If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
		var opt = $.extend({}, $.fn.SPServices.defaults, options);

		// Put together operation header for the SOAP call
		SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/'>";
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";
		SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/" + opt.operation;

		// Build the URL for the Ajax call based on which operation we're doing
		// If the webURL has been provided, then use it, else use the current site
		ajaxURL = ((opt.webURL != ".") ? opt.webURL : $().SPServices.SPGetCurrentSite()) +
				"/_vti_bin/" + WSops[opt.operation] + ".asmx";

		SOAPEnvelope.payload = "";

		// Each operation requires a different set of values.  This switch statement
		// sets them up for each operation.
		switch(opt.operation) {
			// FORM OPERATIONS
			case "GetFormCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;
			// LIST OPERATIONS
			case "GetAttachmentCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<listItemID>" + opt.ID + "</listItemID>";
				break;
			case "GetList":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				break;
			case "GetListCollection":
				break;
			case "GetListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<viewFields>" + opt.CAMLViewFields + "</viewFields>";
				SOAPEnvelope.payload += "<query>" + opt.CAMLQuery + "</query>";
				break;
			case "UpdateListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listName + "</listName>";
				SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='Update'>";
				for (i=0; i < opt.valuepairs.length; i++) {
					SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + opt.valuepairs[i][1] +  "</Field>";
				}
				SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
				SOAPEnvelope.payload += "</Method></Batch></updates>";
				break;
			// PERMISSION OPERATIONS
			case "GetPermissionCollection":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/" + opt.operation;
				SOAPEnvelope.payload += "<objectName>" + opt.objectName + "</objectName>";
				SOAPEnvelope.payload += "<objectType>" + opt.objectType + "</objectType>";
				break;
			// USERS AND GROUPS OPERATIONS
			case "GetUserInfo":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/" + opt.operation;
				SOAPEnvelope.payload += "<userLoginName>" + opt.userLoginName + "</userLoginName>";
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
			// WEB OPERATIONS
			case "GetWeb":
				SOAPEnvelope.payload += "<webUrl>" + opt.webURL + "</webUrl>";
				break;
			case "GetWebCollection":
				break;
			case "GetCurrentSite":
				return $().SPServices.SPGetCurrentSite();
				break;
			case "GetAllSubWebCollection":
				break;
			case "WebUrlFromPageUrl":
				SOAPEnvelope.payload += "<pageUrl>" + opt.pageURL + "</pageUrl>";
				break;
			// else...
			default:
				return false;
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
		operation: "",				// [Optional] The Web Service operation
		webURL: ".",				// [Optional] URL of the target Web
		pageURL: "",				// [Optional] URL of the target page
		listName: "",				// [Optional] Name of the list for list operations
		fileName: "",				// [Optional] Name of the file for file operations
		fileVersion: "",			// [Optional] The number of the file version.
		ID: 1,						// [Optional] ID of the item for list operations

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// [Optional] View name in CAML format.
		CAMLQuery: "",				// [Optional] Query in CAML format
		CAMLViewFields: "",			// [Optional] View fields in CAML format
     	CAMLRowLimit: "",			// [Optional] Row limit in CAML format
		CAMLQueryOptions: "",		// [Optional] Query options in CAML format
		
		// Abstractions for CAML syntax
		valuepairs: [],				// [Optional] Fieldname / Fieldvalue pairs for UpdateListItems

		userLoginName: "",			// [Optional] User login in domain/user format for user operations
		objectName: "",				// [Optional] objectName for operations which require it
		objectType: "List",			// [Optional] objectType for operations which require it

		async: true,				// [Optional] Allow the user to force async
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
			relationshipList: "",				// The name of the list which contains the parent/child relationships
			relationshipListParentColumn: "",	// The name of the parent column in the relationship list
			relationshipListChildColumn: "",	// The name of the child column in the relationship list
			parentColumn: "",					// The name of the parent column in the form
			childColumn: ""						// The name of the child column in the form
		}, options);

		// Find the child column's select (dropdown)
		var childSelect = $().find("select:[Title='" + opt.childColumn + "']");
		// Find the parent column's select (dropdown)
		var parentSelect = $().find("select[Title='" + opt.parentColumn + "']");
		// Bind to the parent column's onchange event
		parentSelect.bind("change", function(){
			// Get the current child column selection, if there is one
			var childSelectSelected = childSelect.find("option:selected").val();
			// When the parent column's selected option changes, get the matching items from the relationship list
			$().SPServices({
				operation: "GetListItems",
				// Force async so that we have the right values for the child column onchange trigger
				async: false,
				listName: opt.relationshipList,
				// Filter based on the currently selected parent column's value
				CAMLQuery: "<Query><Where><Eq><FieldRef Name='" + opt.parentColumn + "'/><Value Type='Text'>" + parentSelect.find("option:selected").text() + "</Value></Eq></Where></Query>",
				completefunc: function (xData, Status) {
					// Add an explanatory prompt
					childSelect.attr({length:0}).append("<option value='0'>Choose " + opt.childColumn + "...</option>");
					// Add an option for each child item
					$(xData.responseXML).find("z\\:row").each(function() {
						var selected = ($(this).attr("ows_ID") == childSelectSelected) ? " selected='selected'" : "";
						childSelect.append("<option" + selected + " value='" + $(this).attr("ows_ID") + "'>" + $(this).attr("ows_Title") + "</option>");
				   	});
				}
			});
			// Trigger the child column's onchange event
			childSelect.trigger("change");
		});
		// Trigger the onchange event for the parent column to set the valid values
		parentSelect.trigger("change");
	}
	
})(jQuery);