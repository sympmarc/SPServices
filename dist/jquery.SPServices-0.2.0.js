/*
 * spservices 0.2 - Work with SharePoint's Web Services using jQuery
 * Version 0.2.0
 * @requires jQuery v1.3.2
 * 
 * Copyright (c) 2009 Sympraxis Consulting LLC
 * Examples and docs at: 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
/**
 * @description Work with SharePoint's Web Services using jQuery
 * @type jQuery
 * @name SPServices
 * @cat Plugins/SPServices
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */

(function($) {

	var thisSite = location.href.substring(0, location.href.lastIndexOf('\/'));

	var WSops = new Array();

	WSops["GetListCollection"]		= "Lists";
	WSops["GetListItems"]			= "Lists";
	WSops["UpdateListItems"]		= "Lists";

	WSops["GetUserInfo"]			= "usergroup";

	WSops["GetWeb"]					= "Webs";
	WSops["GetWebCollection"]		= "Webs";
	WSops["GetAllSubWebCollection"]	= "Webs";


	var SOAPEnvelope = new Object();
	SOAPEnvelope.header = "<?xml version='1.0' encoding='utf-8'?> \
			<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'> \
				<soap:Body>";
	SOAPEnvelope.footer =
				"</soap:Body> \
			</soap:Envelope>";
	SOAPEnvelope.payload = "";

	$.fn.SPServices = function(options) {	

		var opt = $.extend({
			operation: null,								// The Web Service operation
			webURL: null,									// [Optional] URL of the WEb
			listname: null,									// [Optional] Name of the list for list operations
			ID: 1,											// [Optional] ID of the item for list operations
			CAMLViewName: "",								// [Optional] 
			CAMLQuery: "",									// [Optional] If the full query is specified here, then use it rather than the query components
			CAMLViewFields: "",								// [Optional]
     		CAMLRowLimit: "",								// [Optional]
			CAMLQueryOptions: "",							// [Optional] 
			valuepairs: [],									// [Optional] Fielname / Fieldvalue pairs for list operations
			userLoginName: "",								// [Optional] 
			successfunc: null								// Function to call on success
		}, options);

		SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/' >";
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";
		SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/" + opt.operation;

		ajaxURL = thisSite + "/_vti_bin/" + WSops[opt.operation] + ".asmx";
		SOAPEnvelope.payload = "";

		switch(opt.operation) {
			case "GetListCollection":
				break;
			case "GetListItems":
				SOAPEnvelope.payload += "<listName>" + (opt.listname) + "</listName>";
				SOAPEnvelope.payload += "<viewFields>" + opt.CAMLViewFields + "</viewFields>";
				SOAPEnvelope.payload += "<query>" + opt.CAMLQuery + "</query>";
				break;
			case "UpdateListItems":
				SOAPEnvelope.payload += "<listName>" + (opt.listname) + "</listName>";
				SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='Update'>";
				for (i=0; i < opt.valuepairs.length; i++) {
					SOAPEnvelope.payload += "<Field Name='" + (opt.valuepairs[i][0]) + "'>" + (opt.valuepairs[i][1]) +  "</Field>";
				}
				SOAPEnvelope.payload += "<Field Name='ID'>" + (opt.ID) + "</Field>";
				SOAPEnvelope.payload += "</Method></Batch></updates>";
				break;
			case "GetUserInfo":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://schemas.microsoft.com/sharepoint/soap/directory/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/soap/directory/" + opt.operation;
				SOAPEnvelope.payload += "<userLoginName>" + opt.userLoginName + "</userLoginName>";
				break;
			case "GetWeb":
				SOAPEnvelope.payload += "<webUrl>" + opt.webURL + "</webUrl>";
				break;
			case "GetWebCollection":
				break;
			case "GetAllSubWebCollection":
				break;
			default:
				return false;
		}

		var msg = SOAPEnvelope.header +
			SOAPEnvelope.opheader +
			SOAPEnvelope.payload +
			SOAPEnvelope.opfooter +
			SOAPEnvelope.footer;
		goAJAX(msg, opt.successfunc);
	};

	function goAJAX (msg, successfunc) {
		$.ajax({
			url: ajaxURL,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction", SOAPAction);
			},
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\"",
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("textStatus: " + textStatus +
					" errorThrown: " + errorThrown);
			},
			success: successfunc
		});
	}

})(jQuery);