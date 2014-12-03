/*
 * 
 * spservices 0.1 - Work with SharePoint's Web Services using jQuery
 * Version 0.1.0
 * @requires jQuery v1.3.2
 * 
 * Copyright (c) 2009 Sympraxis Consulting LLC
 * Examples and docs at: 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
/**
 *
 * @description Work with SharePoint's Web Services using jQuery
 * 
 * @type jQuery
 *
 * @name SPServices
 * 
 * @cat Plugins/SPServices
 * 
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */

(function($) {

	var thisSite = location.href.substring(0, location.href.lastIndexOf('\/'));

	var SOAPEnvelope = new Object();
	SOAPEnvelope.header = "<?xml version='1.0' encoding='utf-8'?> \
			<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'> \
				<soap:Body>";
	SOAPEnvelope.footer =
				"</soap:Body> \
			</soap:Envelope>";

	$.fn.UpdateListItems = function(options) {	

		var opt = $.extend({
			listname: "Test List",
			ID: "1",
			setQuery: "", // If the full query is specified here, then use it rather than the query components
			valuepairs: []
		}, options);

		var SOAPEnvelopeServiceTop = "<UpdateListItems xmlns='http://schemas.microsoft.com/sharepoint/soap/'>";
		var ListName = "<listName>" + (opt.listname) + "</listName>";
		var updatesTop = "<updates><Batch OnError='Continue'><Method ID='1' Cmd='Update'>";

		var field_value1 = ""
		for (i=0; i < opt.valuepairs.length; i++) {
			field_value1 = field_value1 + "<Field Name='" + (opt.valuepairs[i][0]) + "'>" + (opt.valuepairs[i][1]) +  "</Field>";
		}
		var field_value2 = "<Field Name='ID'>" + (opt.ID) + "</Field>";
		var updatesBottom = "</Method></Batch></updates>";
		var SOAPEnvelopeServiceBottom = "</UpdateListItems>";

		var msg = SOAPEnvelope.header + 
			SOAPEnvelopeServiceTop +
			ListName +
			updatesTop +
			field_value1 +
			field_value2 +
			updatesBottom +
			SOAPEnvelopeServiceBottom +
			SOAPEnvelope.footer;
			
		goAJAX(thisSite + "/_vti_bin/Lists.asmx", "UpdateListItems", msg);
		return true;
	};
	
	$.fn.GetListCollection = function(options) {

		var opt = $.extend({
		}, options);

		var msg =SOAPEnvelope.header +
				"<GetListCollection xmlns='http://schemas.microsoft.com/sharepoint/soap/' />" +
				SOAPEnvelope.footer;

		$.ajax({
			url: thisSite + "/_vti_bin/Lists.asmx",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
				"http://schemas.microsoft.com/sharepoint/soap/GetListCollection");
			},
			type: "POST",
			dataType: "xml",
			data: msg,
			complete: processResultGetListCollection,
			contentType: "text/xml; charset=\"utf-8\""
		});
		return true;
	};

	function processResultGetListCollection(xData, status) {
		$("#WSOutput").html("");
		$("#WSOutput").append("<b>This is the output from the GetListCollection operation:</b>");
		$(xData.responseXML).find("List").each(function() {
			$("#WSOutput").append("<li>DocTemplateUrl: " + $(this).attr("DocTemplateUrl") + "</li>");
			$("#WSOutput").append("<li>DefaultViewUrl: " + $(this).attr("DefaultViewUrl") + "</li>");
			$("#WSOutput").append("<li>ID: " + $(this).attr("ID") + "</li>");
			$("#WSOutput").append("<li>Title: " + $(this).attr("Title") + "</li>");
			$("#WSOutput").append("<li>Description: " + $(this).attr("Description") + "</li>");
			$("#WSOutput").append("<hr/>");
		});
	}

/* This is just here to show what the XML returned from this ajax call looks like.

<Lists xmlns="http://schemas.microsoft.com/sharepoint/soap/">
   <List
   		DocTemplateUrl=""
   		DefaultViewUrl="/TestWeb1/Lists/Announcements/AllItems.aspx" 
      	ID="{8A98E2E5-B377-4D0E-931B-3AC25BD09926}"
      	Title="Announcements" 
      	Description="Use the Announcements list to post messages on the home page of your site." 
      	ImageUrl="/_layouts/images/itann.gif" 
      	Name="{8A98E2E5-B377-4D0E-931B-3AC25BD09926}" 
      	BaseType="0"
      	ServerTemplate="104" 
        Created="20030613 18:47:12" Modified="20030613 18:47:12" 
      	LastDeleted="20030613 18:47:12" Version="0" Direction="none" 
        ThumbnailSize="" WebImageWidth="" 
      	WebImageHeight="" Flags="4096" ItemCount="1" 
      	AnonymousPermMask="" RootFolder="" ReadSecurity="1" 
      	WriteSecurity="1" Author="1" 
      	EventSinkAssembly="" EventSinkClass="" 
      	EventSinkData="" EmailInsertsFolder="" 
      	AllowDeletion="True" AllowMultiResponses="False" 
      	EnableAttachments="True" EnableModeration="False" 
      	EnableVersioning="False" Hidden="False" MultipleDataList="False" 
      	Ordered="False" ShowUser="True" />
*/


	$.fn.GetWeb = function(options) {

		var opt = $.extend({
			webURL: "."
		}, options);

		var msg =SOAPEnvelope.header +
				"<GetWeb xmlns='http://schemas.microsoft.com/sharepoint/soap/'> \
					<webUrl>http://www.sympraxisconsulting.com/Intranet/JQueryLib</webUrl> \
				</GetWeb>" +
				SOAPEnvelope.footer;

		$.ajax({
			url: thisSite + "/_vti_bin/Webs.asmx",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
				"http://schemas.microsoft.com/sharepoint/soap/GetWeb");
			},
			type: "POST",
			dataType: "xml",
			data: msg,
			complete: processResultGetWeb,
			contentType: "text/xml; charset=\"utf-8\""
		});
		return true;
	};

	function processResultGetWeb(xData, status) {
		$("#WSOutput").html("");
		$("#WSOutput").append("<b>This is the output from the GetWeb operation:</b>");
		$(xData.responseXML).find("Web").each(function() {
			$("#WSOutput").append("<li>Title: " + $(this).attr("Title") + "</li>");
			$("#WSOutput").append("<li>Url: " + $(this).attr("Url") + "</li>");
			$("#WSOutput").append("<li>Description: " + $(this).attr("Description") + "</li>");
			$("#WSOutput").append("<li>Language: " + $(this).attr("Language") + "</li>");
			$("#WSOutput").append("<li>Theme: " + $(this).attr("Theme") + "</li>");
			$("#WSOutput").append("<hr/>");
		});
	}
	
	$.fn.GetWebCollection = function(options) {

		var opt = $.extend({
		}, options);

		var msg =SOAPEnvelope.header +
				"<GetWebCollection xmlns='http://schemas.microsoft.com/sharepoint/soap/'/>" +
				SOAPEnvelope.footer;

		$.ajax({
			url: thisSite + "/_vti_bin/Webs.asmx",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
					"http://schemas.microsoft.com/sharepoint/soap/GetWebCollection");
			},
			type: "POST",
			data: msg,
//			success: function(list) {
//				alert(list.xml);
//			},
			complete: processResultGetWebCollection,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\""
		});
		return true;
	};

	function processResultGetWebCollection(xData, status) {
		$("#WSOutput").html("");
		$("#WSOutput").append("<b>This is the output from the GetWebCollection operation:</b>");
		$(xData.responseXML).find("Webs").each(function() {
			$(this).find("Web").each(function() {
				$("#WSOutput").append("<li>Title: " + $(this).attr("Title") + "</li>");
				$("#WSOutput").append("<li>Url: " + $(this).attr("Url") + "</li>");
				$("#WSOutput").append("<hr/>");
			});
		});
	}

	$.fn.GetAllSubWebCollection = function(options) {

		var opt = $.extend({
		}, options);

		var msg =SOAPEnvelope.header +
				"<GetAllSubWebCollection xmlns='http://schemas.microsoft.com/sharepoint/soap/'/>" +
				SOAPEnvelope.footer;

		$.ajax({
			url: thisSite + "/_vti_bin/Webs.asmx",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
				"http://schemas.microsoft.com/sharepoint/soap/GetAllSubWebCollection");
			},
			type: "POST",
			data: msg,
      		complete: processResultGetWebCollection,
			dataType: "xml",
			contentType: "text/xml; charset=\"utf-8\""
		});
		return true;
	};
	
	function goAJAX (WSurl, operation, msg) {
		$.ajax({
			url: WSurl,
			beforeSend: function (xhr) {
				xhr.setRequestHeader("SOAPAction",
				"http://schemas.microsoft.com/sharepoint/soap/" + operation);
			},
			type: "POST",
			dataType: "xml",
			data: msg,
			contentType: "text/xml; charset=\"utf-8\""
		});
	}

})(jQuery);