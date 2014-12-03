/*
 * SPServices 0.2.3 - Work with SharePoint's Web Services using jQuery
 * Version 0.2.3
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

	// Take a guess at the current site URL based on the current location.href
	var thisSite = location.href.substring(0, location.href.lastIndexOf('\/'));

	// Array to store operation / Web Service associations
	var WSops = new Array();

	WSops["GetFormCollection"]			= "Forms";

	WSops["GetList"]					= "Lists";
	WSops["GetListCollection"]			= "Lists";
	WSops["GetListItems"]				= "Lists";
	WSops["UpdateListItems"]			= "Lists";

	WSops["GetPermissionCollection"]	= "Permissions";

	WSops["GetUserInfo"]				= "usergroup";

	WSops["GetViewCollection"]			= "Views";

	WSops["GetWeb"]						= "Webs";
	WSops["GetWebCollection"]			= "Webs";
	WSops["GetAllSubWebCollection"]		= "Webs";


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

		// Get the current site URL.  This is needed for several of the operations.
		$().SPServices.SPGetCurrentSite();
		// Build the URL for the Ajax call based on which operation we're doing
		ajaxURL = thisSite + "/_vti_bin/" + WSops[opt.operation] + ".asmx";
		SOAPEnvelope.payload = "";

		// Each operation requires a different set of values.  This switch statement sets them up for each operation.
		switch(opt.operation) {
			// FORM OPERATIONS
			case "GetFormCollection":
				SOAPEnvelope.payload += "<listName>" + opt.listname + "</listName>";
				break;
			// LIST OPERATIONS
			case "GetList":
				SOAPEnvelope.payload += "<listName>" + opt.listname + "</listName>";
				break;
			case "GetListCollection":
				break;
			case "GetListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listname + "</listName>";
				SOAPEnvelope.payload += "<viewFields>" + opt.CAMLViewFields + "</viewFields>";
				SOAPEnvelope.payload += "<query>" + opt.CAMLQuery + "</query>";
				break;
			case "UpdateListItems":
				SOAPEnvelope.payload += "<listName>" + opt.listname + "</listName>";
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
				SOAPEnvelope.payload += "<listName>" + opt.listname + "</listName>";
				break;
			// WEB OPERATIONS
			case "GetWeb":
				SOAPEnvelope.payload += "<webUrl>" + opt.webURL + "</webUrl>";
				break;
			case "GetWebCollection":
				break;
			case "GetCurrentSite":
				return thisSite;
				break;
			case "GetAllSubWebCollection":
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
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction", SOAPAction);
			},
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\"",
			complete: opt.completefunc
		});
	};

	// Defaults added as a function in our library means that the caller can override the defaults for their session by calling this function.
	// Each operation requires a different set of options; we allow for all in a standardized way
	$.fn.SPServices.defaults = {
		operation: null,			// [Optional] The Web Service operation
		webURL: ".",				// [Optional] URL of the Web
		listname: null,				// [Optional] Name of the list for list operations
		ID: 1,						// [Optional] ID of the item for list operations

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// [Optional] View name in CAML format.
		CAMLQuery: "",				// [Optional] Query in CAML format
		CAMLViewFields: "",			// [Optional] View fields in CAML format
     	CAMLRowLimit: "",			// [Optional] Row limit in CAML format
		CAMLQueryOptions: "",		// [Optional] Query options in CAML format
		
		// Abstractions for CAML syntax
		valuepairs: [],				// [Optional] Fieldname / Fieldvalue pairs for list operations

		userLoginName: "",			// [Optional] User login in domain/user format for user operations
		objectName: "",				// [Optional] objectName for operations which require it
		objectType: "List",			// [Optional] objectType for operations which require it
		completefunc: null			// Function to call on completion
	}

	// Function to determine the current Web's URL.  We need this for successful Ajax calls.
	// The function is also available as a public function.
	$.fn.SPServices.SPGetCurrentSite = function() {	
		var msg = SOAPEnvelope.header +
				"<GetWeb xmlns='http://schemas.microsoft.com/sharepoint/soap/' ><webUrl>.</webUrl></GetWeb>" +
				SOAPEnvelope.footer;
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: thisSite + "/_vti_bin/Webs.asmx",
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\"",
			success: function (xData, Status) {
				$(xData.xml).find("Web").each(function() {
					thisSite = $(this).attr("Url");
				});
			},
			// If we get an error, then trim the last URL segment (we're probably in a list or library context) and try again.
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				thisSite = thisSite.substring(0, thisSite.lastIndexOf('\/'));
				$().SPServices.SPGetCurrentSite();
			}
		});
		return thisSite; // Return the URL
	};

})(jQuery);