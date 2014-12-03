/*
 * SPServices - Work with SharePoint's Web Services using jQuery
 * Version 0.7.2 -> Note to Marc: Also change var VERSION below.
 * @requires jQuery v1.4.2 or greater - jQuery 1.7+ recommended
 *
 * Copyright (c) 2009-2012 Sympraxis Consulting LLC
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

(function ($) {

	// Version info
	var VERSION					= "0.7.2";

	// String constants
	//   General
	var SLASH					= "/";
	var TXTColumnNotFound		= "Column not found on page";
	var SCHEMASharePoint		= "http://schemas.microsoft.com/sharepoint";

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
	var SHAREPOINTDIAGNOSTICS	= "SharePointDiagnostics";
	var SITEDATA				= "SiteData";
	var SITES					= "Sites";
	var SOCIALDATASERVICE		= "SocialDataService";
	var SPELLCHECK				= "SpellCheck";
    var TAXONOMYSERVICE			= "TaxonomyClientService";
	var USERGROUP				= "usergroup";
	var USERPROFILESERVICE		= "UserProfileService";
	var VERSIONS				= "Versions";
	var VIEWS					= "Views";
	var WEBPARTPAGES			= "WebPartPages";
	var WEBS					= "Webs";
	var WORKFLOW				= "Workflow";

	// Global variables
	var thisSite = "";		// The current site
	var thisList = "";		// The current list when in a list context
	var i = 0;				// Generic loop counter
	var t = "";				// Temporary string variable

	// Array to store Web Service information
	//	WSops.OpName = [WebService, needs_SOAPAction];
	//		OpName				The name of the Web Service operation -> These names are unique
	//		WebService			The name of the WebService this operation belongs to
	//		needs_SOAPAction	Boolean indicating whether the operatio needs to have the SOAPAction passed in the setRequestHeaderfunction.
	//							true if the operation does a write, else false

	var WSops = [];

	WSops.GetAlerts									= [ALERTS, false];
	WSops.DeleteAlerts								= [ALERTS, true];

	WSops.Mode										= [AUTHENTICATION, false];
	WSops.Login										= [AUTHENTICATION, false];

	WSops.CopyIntoItems								= [COPY, true];
	WSops.CopyIntoItemsLocal						= [COPY, true];
	WSops.GetItem									= [COPY, false];

	WSops.GetForm									= [FORMS, false];
	WSops.GetFormCollection							= [FORMS, false];

	WSops.AddAttachment								= [LISTS, true];
	WSops.AddDiscussionBoardItem					= [LISTS, true];
	WSops.AddList									= [LISTS, true];
	WSops.AddListFromFeature						= [LISTS, true];
	WSops.ApplyContentTypeToList					= [LISTS, true];
	WSops.CheckInFile								= [LISTS, true];
	WSops.CheckOutFile								= [LISTS, true];
	WSops.CreateContentType							= [LISTS, true];
	WSops.DeleteAttachment							= [LISTS, true];
	WSops.DeleteContentType							= [LISTS, true];
	WSops.DeleteContentTypeXmlDocument				= [LISTS, true];
	WSops.DeleteList								= [LISTS, true];
	WSops.GetAttachmentCollection					= [LISTS, false];
	WSops.GetList									= [LISTS, false];
	WSops.GetListAndView							= [LISTS, false];
	WSops.GetListCollection							= [LISTS, false];
	WSops.GetListContentType						= [LISTS, false];
	WSops.GetListContentTypes						= [LISTS, false];
	WSops.GetListItemChanges						= [LISTS, false];
	WSops.GetListItemChangesSinceToken				= [LISTS, false];
	WSops.GetListItems								= [LISTS, false];
	WSops.GetVersionCollection						= [LISTS, false];
	WSops.UndoCheckOut								= [LISTS, true];
	WSops.UpdateContentType							= [LISTS, true];
	WSops.UpdateContentTypesXmlDocument				= [LISTS, true];
	WSops.UpdateContentTypeXmlDocument				= [LISTS, true];
	WSops.UpdateList								= [LISTS, true];
	WSops.UpdateListItems							= [LISTS, true];

	WSops.AddMeeting								= [MEETINGS, true];
	WSops.CreateWorkspace							= [MEETINGS, true];
	WSops.RemoveMeeting								= [MEETINGS, true];
	WSops.SetWorkSpaceTitle							= [MEETINGS, true];

	WSops.ResolvePrincipals							= [PEOPLE, false];
	WSops.SearchPrincipals							= [PEOPLE, false];

	WSops.AddPermission								= [PERMISSIONS, true];
	WSops.AddPermissionCollection					= [PERMISSIONS, true];
	WSops.GetPermissionCollection					= [PERMISSIONS, true];
	WSops.RemovePermission							= [PERMISSIONS, true];
	WSops.RemovePermissionCollection				= [PERMISSIONS, true];
	WSops.UpdatePermission							= [PERMISSIONS, true];

	WSops.GetLinks									= [PUBLISHEDLINKSSERVICE, true];

	WSops.GetPortalSearchInfo						= [SEARCH, false];
	WSops.GetQuerySuggestions						= [SEARCH, false];
	WSops.GetSearchMetadata							= [SEARCH, false];
	WSops.Query										= [SEARCH, false];
	WSops.QueryEx									= [SEARCH, false];
	WSops.Registration								= [SEARCH, false];
	WSops.Status									= [SEARCH, false];

	WSops.SendClientScriptErrorReport				= [SHAREPOINTDIAGNOSTICS,true];

	WSops.GetAttachments							= [SITEDATA, false];
	WSops.EnumerateFolder							= [SITEDATA, false];
	WSops.SiteDataGetList							= [SITEDATA, false];
	WSops.SiteDataGetListCollection					= [SITEDATA, false];
	WSops.SiteDataGetSite							= [SITEDATA, false];
	WSops.SiteDataGetSiteUrl						= [SITEDATA, false];
	WSops.SiteDataGetWeb							= [SITEDATA, false];

	WSops.CreateWeb									= [SITES, true];
	WSops.DeleteWeb									= [SITES, false];
	WSops.GetSite									= [SITES, false];
	WSops.GetSiteTemplates							= [SITES, false];

	WSops.AddComment								= [SOCIALDATASERVICE, true];
	WSops.AddTag									= [SOCIALDATASERVICE, true];
	WSops.AddTagByKeyword							= [SOCIALDATASERVICE, true];
	WSops.CountCommentsOfUser						= [SOCIALDATASERVICE, false];
	WSops.CountCommentsOfUserOnUrl					= [SOCIALDATASERVICE, false];
	WSops.CountCommentsOnUrl						= [SOCIALDATASERVICE, false];
	WSops.CountRatingsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.CountTagsOfUser							= [SOCIALDATASERVICE, false];
	WSops.DeleteComment								= [SOCIALDATASERVICE, true];
	WSops.DeleteRating								= [SOCIALDATASERVICE, true];
	WSops.DeleteTag									= [SOCIALDATASERVICE, true];
	WSops.DeleteTagByKeyword						= [SOCIALDATASERVICE, true];
	WSops.DeleteTags								= [SOCIALDATASERVICE, true];
	WSops.GetAllTagTerms							= [SOCIALDATASERVICE, false];
	WSops.GetAllTagTermsForUrlFolder				= [SOCIALDATASERVICE, false];
	WSops.GetAllTagUrls								= [SOCIALDATASERVICE, false];
	WSops.GetAllTagUrlsByKeyword					= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOfUser							= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOfUserOnUrl					= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetRatingAverageOnUrl						= [SOCIALDATASERVICE, false];
	WSops.GetRatingOfUserOnUrl						= [SOCIALDATASERVICE, false];
	WSops.GetRatingOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetRatingsOfUser							= [SOCIALDATASERVICE, false];
	WSops.GetRatingsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetSocialDataForFullReplication			= [SOCIALDATASERVICE, false];
	WSops.GetTags									= [SOCIALDATASERVICE, true];
	WSops.GetTagsOfUser								= [SOCIALDATASERVICE, true];
	WSops.GetTagTerms								= [SOCIALDATASERVICE, true];
	WSops.GetTagTermsOfUser							= [SOCIALDATASERVICE, true];
	WSops.GetTagTermsOnUrl							= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsOfUser							= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsOfUserByKeyword					= [SOCIALDATASERVICE, true];
	WSops.GetTagUrls								= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsByKeyword						= [SOCIALDATASERVICE, true];
	WSops.SetRating									= [SOCIALDATASERVICE, true];
	WSops.UpdateComment								= [SOCIALDATASERVICE, true];

	WSops.SpellCheck								= [SPELLCHECK, false];

    // Taxonomy Service Calls
    // Updated 2011.01.27 by Thomas McMillan
    WSops.AddTerms									= [TAXONOMYSERVICE, true];
    WSops.GetChildTermsInTerm						= [TAXONOMYSERVICE, false];
    WSops.GetChildTermsInTermSet					= [TAXONOMYSERVICE, false];
    WSops.GetKeywordTermsByGuids					= [TAXONOMYSERVICE, false];
    WSops.GetTermsByLabel							= [TAXONOMYSERVICE, false];
    WSops.GetTermSets								= [TAXONOMYSERVICE, false];

	WSops.AddGroup									= [USERGROUP, true];
	WSops.AddGroupToRole							= [USERGROUP, true];
	WSops.AddRole									= [USERGROUP, true];
	WSops.AddRoleDef								= [USERGROUP, true];
	WSops.AddUserCollectionToGroup					= [USERGROUP, true];
	WSops.AddUserCollectionToRole					= [USERGROUP, true];
	WSops.AddUserToGroup							= [USERGROUP, true];
	WSops.AddUserToRole								= [USERGROUP, true];
	WSops.GetAllUserCollectionFromWeb				= [USERGROUP, false];
	WSops.GetGroupCollection						= [USERGROUP, false];
	WSops.GetGroupCollectionFromRole				= [USERGROUP, false];
	WSops.GetGroupCollectionFromSite				= [USERGROUP, false];
	WSops.GetGroupCollectionFromUser				= [USERGROUP, false];
	WSops.GetGroupCollectionFromWeb					= [USERGROUP, false];
	WSops.GetGroupInfo								= [USERGROUP, false];
	WSops.GetRoleCollection							= [USERGROUP, false];
	WSops.GetRoleCollectionFromGroup				= [USERGROUP, false];
	WSops.GetRoleCollectionFromUser					= [USERGROUP, false];
	WSops.GetRoleCollectionFromWeb					= [USERGROUP, false];
	WSops.GetRoleInfo								= [USERGROUP, false];
	WSops.GetRolesAndPermissionsForCurrentUser		= [USERGROUP, false];
	WSops.GetRolesAndPermissionsForSite				= [USERGROUP, false];
	WSops.GetUserCollection							= [USERGROUP, false];
	WSops.GetUserCollectionFromGroup				= [USERGROUP, false];
	WSops.GetUserCollectionFromRole					= [USERGROUP, false];
	WSops.GetUserCollectionFromSite					= [USERGROUP, false];
	WSops.GetUserCollectionFromWeb					= [USERGROUP, false];
	WSops.GetUserInfo								= [USERGROUP, false];
	WSops.GetUserLoginFromEmail						= [USERGROUP, false];
	WSops.RemoveGroup								= [USERGROUP, true];
	WSops.RemoveGroupFromRole						= [USERGROUP, true];
	WSops.RemoveRole								= [USERGROUP, true];
	WSops.RemoveUserCollectionFromGroup				= [USERGROUP, true];
	WSops.RemoveUserCollectionFromRole				= [USERGROUP, true];
	WSops.RemoveUserCollectionFromSite				= [USERGROUP, true];
	WSops.RemoveUserFromGroup						= [USERGROUP, true];
	WSops.RemoveUserFromRole						= [USERGROUP, true];
	WSops.RemoveUserFromSite						= [USERGROUP, true];
	WSops.RemoveUserFromWeb							= [USERGROUP, true];
	WSops.UpdateGroupInfo							= [USERGROUP, true];
	WSops.UpdateRoleDefInfo							= [USERGROUP, true];
	WSops.UpdateRoleInfo							= [USERGROUP, true];
	WSops.UpdateUserInfo							= [USERGROUP, true];

	WSops.AddColleague								= [USERPROFILESERVICE, true]; 
	WSops.AddLink									= [USERPROFILESERVICE, true];
	WSops.AddMembership								= [USERPROFILESERVICE, true]; 
	WSops.AddPinnedLink								= [USERPROFILESERVICE, true];
	WSops.CreateMemberGroup							= [USERPROFILESERVICE, true]; 
	WSops.CreateUserProfileByAccountName			= [USERPROFILESERVICE, true];
	WSops.GetCommonColleagues						= [USERPROFILESERVICE, false];
	WSops.GetCommonManager							= [USERPROFILESERVICE, false];
	WSops.GetCommonMemberships						= [USERPROFILESERVICE, false];
	WSops.GetInCommon								= [USERPROFILESERVICE, false];
	WSops.GetPropertyChoiceList						= [USERPROFILESERVICE, false];
	WSops.GetUserColleagues							= [USERPROFILESERVICE, false];
	WSops.GetUserLinks								= [USERPROFILESERVICE, false];
	WSops.GetUserMemberships						= [USERPROFILESERVICE, false];
	WSops.GetUserPinnedLinks						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByGuid						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByIndex						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByName						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileCount						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileSchema						= [USERPROFILESERVICE, false];
	WSops.ModifyUserPropertyByAccountName			= [USERPROFILESERVICE, true];
	WSops.RemoveAllColleagues						= [USERPROFILESERVICE, true];
	WSops.RemoveAllLinks							= [USERPROFILESERVICE, true];
	WSops.RemoveAllMemberships						= [USERPROFILESERVICE, true];
	WSops.RemoveAllPinnedLinks						= [USERPROFILESERVICE, true];
	WSops.RemoveColleague							= [USERPROFILESERVICE, true];
	WSops.RemoveLink								= [USERPROFILESERVICE, true];
	WSops.RemoveMembership							= [USERPROFILESERVICE, true];
	WSops.RemovePinnedLink							= [USERPROFILESERVICE, true]; 
	WSops.UpdateColleaguePrivacy					= [USERPROFILESERVICE, true];
	WSops.UpdateLink								= [USERPROFILESERVICE, true];
	WSops.UpdateMembershipPrivacy					= [USERPROFILESERVICE, true];
	WSops.UpdatePinnedLink							= [USERPROFILESERVICE, true];

	WSops.DeleteAllVersions							= [VERSIONS, true];
	WSops.DeleteVersion								= [VERSIONS, true];
	WSops.GetVersions								= [VERSIONS, false];
	WSops.RestoreVersion							= [VERSIONS, true];

	WSops.AddView									= [VIEWS, true];
	WSops.DeleteView								= [VIEWS, true];
	WSops.GetView									= [VIEWS, false];
	WSops.GetViewHtml								= [VIEWS, false];
	WSops.GetViewCollection							= [VIEWS, false];
	WSops.UpdateView								= [VIEWS, true];
	WSops.UpdateViewHtml							= [VIEWS, true];

	WSops.AddWebPart								= [WEBPARTPAGES, true];
	WSops.AddWebPartToZone							= [WEBPARTPAGES, true];
	WSops.GetWebPart2								= [WEBPARTPAGES, false];
	WSops.GetWebPartPage							= [WEBPARTPAGES, false];
	WSops.GetWebPartProperties						= [WEBPARTPAGES, false];
	WSops.GetWebPartProperties2						= [WEBPARTPAGES, false];

	WSops.CreateContentType							= [WEBS, true];
	WSops.GetColumns								= [WEBS, false];
	WSops.GetContentType							= [WEBS, false];
	WSops.GetContentTypes							= [WEBS, false];
	WSops.GetCustomizedPageStatus					= [WEBS, false];
	WSops.GetListTemplates							= [WEBS, false];
	WSops.GetObjectIdFromUrl						= [WEBS, false]; // 2010
	WSops.GetWeb									= [WEBS, false];
	WSops.GetWebCollection							= [WEBS, false];
	WSops.GetAllSubWebCollection					= [WEBS, false];
	WSops.UpdateColumns								= [WEBS, true];
	WSops.UpdateContentType							= [WEBS, true];
	WSops.WebUrlFromPageUrl							= [WEBS, false];

	WSops.AlterToDo									= [WORKFLOW, true];
	WSops.GetTemplatesForItem						= [WORKFLOW, false];
	WSops.GetToDosForItem							= [WORKFLOW, false];
	WSops.GetWorkflowDataForItem					= [WORKFLOW, false];
	WSops.GetWorkflowTaskData						= [WORKFLOW, false];
	WSops.StartWorkflow								= [WORKFLOW, true];

	// Set up SOAP envelope
	var SOAPEnvelope = {};
	SOAPEnvelope.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
	SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
	SOAPEnvelope.payload = "";
	var SOAPAction;


	// Main function, which calls SharePoint's Web Services directly.
	$.fn.SPServices = function(options) {

		// If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
		var opt = $.extend({}, $.fn.SPServices.defaults, options);

		// Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
		SOAPEnvelope.opheader = "<" + opt.operation + " ";
		switch(WSops[opt.operation][0]) {
			case ALERTS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/2002/1/alerts/' >";
				SOAPAction = SCHEMASharePoint + "/soap/2002/1/alerts/";
				break;
			case MEETINGS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/meetings/' >";
				SOAPAction = SCHEMASharePoint + "/soap/meetings/";
				break;
			case PERMISSIONS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
				SOAPAction = SCHEMASharePoint + "/soap/directory/";
				break;
			case PUBLISHEDLINKSSERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
				break;
			case SEARCH:
				SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
				SOAPAction = "urn:Microsoft.Search/";
				break;
			case SHAREPOINTDIAGNOSTICS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/diagnostics/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/diagnostics/";
				break;
			case SOCIALDATASERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
				break;
			case SPELLCHECK:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/'";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
				break;
            case TAXONOMYSERVICE:
                SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/taxonomy/soap/' >";
                SOAPAction = SCHEMASharePoint + "/taxonomy/soap/";
                break;
			case USERGROUP:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
				SOAPAction = SCHEMASharePoint + "/soap/directory/";
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
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/workflow/' >";
				SOAPAction = SCHEMASharePoint + "/soap/workflow/";
				break;
			default:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/'>";
				SOAPAction = SCHEMASharePoint + "/soap/";
				break;
		}
		
		// Add the operation to the SOAPAction and opfooter
		SOAPAction += opt.operation;
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";

		// Build the URL for the Ajax call based on which operation we're calling
		// If the webURL has been provided, then use it, else use the current site
		var ajaxURL = "_vti_bin/" + WSops[opt.operation][0] + ".asmx";
		if(opt.webURL.charAt(opt.webURL.length - 1) === SLASH) {
			ajaxURL = opt.webURL + ajaxURL;
		} else if(opt.webURL.length > 0) {
			ajaxURL = opt.webURL + SLASH + ajaxURL;
		} else {
			ajaxURL = $().SPServices.SPGetCurrentSite() + SLASH + ajaxURL;
		}

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
				addToPayload(opt, ["username", "password"]);
				break;

			// COPY OPERATIONS
			case "CopyIntoItems":
				addToPayload(opt, ["SourceUrl"]);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				addToPayload(opt, ["Fields", "Stream", "Results"]);
				break;
			case "CopyIntoItemsLocal":
				addToPayload(opt, ["SourceUrl"]);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				break;
			case "GetItem":
				addToPayload(opt, ["Url", "Fields", "Stream"]);
				break;

			// FORM OPERATIONS
			case "GetForm":
				addToPayload(opt, ["listName", "formUrl"]);
				break;
			case "GetFormCollection":
				addToPayload(opt, ["listName"]);
				break;

			// LIST OPERATIONS
			case "AddAttachment":
				addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
				break;
			case "AddDiscussionBoardItem":
				addToPayload(opt, ["listName", "message"]);
				break;
			case "AddList":
				addToPayload(opt, ["listName", "description", "templateID"]);
				break;
			case "AddListFromFeature":
				addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
				break;
			case "ApplyContentTypeToList":
				addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
				break;
			case "CheckInFile":
				addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
				break;
			case "CheckOutFile":
				addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
				break;
			case "CreateContentType":
				addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
				break;
			case "DeleteAttachment":
				addToPayload(opt, ["listName", "listItemID", "url"]);
				break;
			case "DeleteContentType":
				addToPayload(opt, ["listName", "contentTypeId"]);
				break;
			case "DeleteContentTypeXmlDocument":
				addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
				break;
			case "DeleteList":
				addToPayload(opt, ["listName"]);
				break;
			case "GetAttachmentCollection":
				addToPayload(opt, ["listName", ["listItemID", "ID"]]);
				break;
			case "GetList":
				addToPayload(opt, ["listName"]);
				break;
			case "GetListAndView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetListCollection":
				break;
			case "GetListContentType":
				addToPayload(opt, ["listName", "contentTypeId"]);
				break;
			case "GetListContentTypes":
				addToPayload(opt, ["listName"]);
				break;
			case "GetListItems":
				addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"], ["viewFields", "CAMLViewFields"], ["rowLimit", "CAMLRowLimit"], ["queryOptions", "CAMLQueryOptions"]]);
				break;
			case "GetListItemChanges":
				addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
				break;
			case "GetListItemChangesSinceToken":
				addToPayload(opt, ["listName", "viewName", "query", "viewFields", "rowLimit", "queryOptions", "changeToken", "contains"]);
				break;
			case "GetVersionCollection":
				addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]);
				break;
			case "UndoCheckOut":
				addToPayload(opt, ["pageUrl"]);
				break;
			case "UpdateContentType":
				addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
				break;
			case "UpdateContentTypesXmlDocument":
				addToPayload(opt, ["listName", "newDocument"]);
				break;
			case "UpdateContentTypeXmlDocument":
				addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
				break;
			case "UpdateList":
				addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
				break;
			case "UpdateListItems":
				addToPayload(opt, ["listName"]);
				if(opt.updates !== undefined && opt.updates.length > 0) {
					addToPayload(opt, ["updates"]);
				} else {
					SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
					for (i=0; i < opt.valuepairs.length; i++) { 
						SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + escapeColumnValue(opt.valuepairs[i][1]) + "</Field>";
					}
					if(opt.batchCmd !== "New") {
						SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
					}
					SOAPEnvelope.payload += "</Method></Batch></updates>";
				}
				break;

			// MEETINGS OPERATIONS
			case "AddMeeting":
				addToPayload(opt, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
				break;
			case "CreateWorkspace":
				addToPayload(opt, ["title", "templateName", "lcid", "timeZoneInformation"]);
				break;
			case "RemoveMeeting":
				addToPayload(opt, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
				break;
			case "SetWorkspaceTitle":
				addToPayload(opt, ["title"]);
				break;

			// PEOPLE OPERATIONS
			case "ResolvePrincipals":
				addToPayload(opt, ["principalKeys", "principalType", "addToUserInfoList"]);
				break;
			case "SearchPrincipals":
				addToPayload(opt, ["searchText", "maxResults", "principalType"]);
				break;

			// PERMISSION OPERATIONS
			case "AddPermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
				break;
			case "AddPermissionCollection":
				addToPayload(opt, ["objectName", "objectType", "permissionsInfoXml"]);
				break;
			case "GetPermissionCollection":
				addToPayload(opt, ["objectName", "objectType"]);
				break;
			case "RemovePermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
				break;
			case "RemovePermissionCollection":
				addToPayload(opt, ["objectName", "objectType", "memberIdsXml"]);
				break;
			case "UpdatePermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
				break;

			// PUBLISHEDLINKSSERVICE OPERATIONS
			case "GetLinks":
				break;

			// SEARCH OPERATIONS
			case "GetPortalSearchInfo":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				break;
			case "GetQuerySuggestions":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "GetSearchMetadata":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
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
			case "Registration":
				SOAPEnvelope.payload += wrapNode("registrationXml", escapeHTML(opt.registrationXml));
				break;
			case "Status":
				break;

			// SHAREPOINTDIAGNOSTICS OPERATIONS
			case "SendClientScriptErrorReport":
				addToPayload(opt, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
				break;

			// SITEDATA OPERATIONS
			case "EnumerateFolder":
				addToPayload(opt, ["strFolderUrl"]);
				break;
			case "GetAttachments":
				addToPayload(opt, ["strListName", "strItemId"]);
				break;
			case "SiteDataGetList":
				addToPayload(opt, ["strListName"]);
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetListCollection":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetSite":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetSiteUrl":
				addToPayload(opt, ["Url"]);
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetWeb":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;

			// SITES OPERATIONS
			case "CreateWeb":
				addToPayload(opt, ["urlType", "titleType", "descriptionType", "templateNameType", "languageType", "languageSpecifiedType",
					"localeType", "localeSpecifiedType", "collationLocaleType", "collationLocaleSpecifiedType", "uniquePermissionsType",
					"uniquePermissionsSpecifiedType", "anonymousType", "anonymousSpecifiedType", "presenceType", "presenceSpecifiedType"]);
				break;
			case "DeleteWeb":
				addToPayload(opt, ["url"]);
				break;
			case "GetSite":
				addToPayload(opt, ["SiteUrl"]);
				break;
			case "GetSiteTemplates":
				addToPayload(opt, ["LCID", "TemplateList"]);
				break;

			// SOCIALDATASERVICE OPERATIONS
			case "AddComment":
				addToPayload(opt, ["url", "comment", "isHighPriority", "title"]);
				break;
			case "AddTag":
				addToPayload(opt, ["url", "termID", "title", "isPrivate"]);
				break;
			case "AddTagByKeyword":
				addToPayload(opt, ["url", "keyword", "title", "isPrivate"]);
				break;
			case "CountCommentsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "CountCommentsOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "CountCommentsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "CountRatingsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "CountTagsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "DeleteComment":
				addToPayload(opt, ["url", "lastModifiedTime"]);
				break;
			case "DeleteRating":
				addToPayload(opt, ["url"]);
				break;
			case "DeleteTag":
				addToPayload(opt, ["url", "termID"]);
				break;
			case "DeleteTagByKeyword":
				addToPayload(opt, ["url", "keyword"]);
				break;
			case "DeleteTags":
				addToPayload(opt, ["url"]);
				break;
			case "GetAllTagTerms":
				addToPayload(opt, ["maximumItemsToReturn"]);
				break;
			case "GetAllTagTermsForUrlFolder":
				addToPayload(opt, ["urlFolder", "maximumItemsToReturn"]);
				break;
			case "GetAllTagUrls":
				addToPayload(opt, ["termID"]);
				break;
			case "GetAllTagUrlsByKeyword":
				addToPayload(opt, ["keyword"]);
				break;
			case "GetCommentsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
				break;
			case "GetCommentsOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "GetCommentsOnUrl":
				addToPayload(opt, ["url", "maximumItemsToReturn", "startIndex"]);
				if(opt.excludeItemsTime !== undefined && opt.excludeItemsTime.length > 0) {
					SOAPEnvelope.payload += wrapNode("excludeItemsTime", opt.excludeItemsTime);
				}
				break;
			case "GetRatingAverageOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetRatingOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "GetRatingOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetRatingsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "GetRatingsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetSocialDataForFullReplication":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "GetTags":
				addToPayload(opt, ["url"]);
				break;
			case "GetTagsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
				break;
			case "GetTagTerms":
				addToPayload(opt, ["maximumItemsToReturn"]);
				break;
			case "GetTagTermsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn"]);
				break;
			case "GetTagTermsOnUrl":
				addToPayload(opt, ["url", "maximumItemsToReturn"]);
				break;
			case "GetTagUrls":
				addToPayload(opt, ["termID"]);
				break;
			case "GetTagUrlsByKeyword":
				addToPayload(opt, ["keyword"]);
				break;
			case "GetTagUrlsOfUser":
				addToPayload(opt, ["termID", "userAccountName"]);
				break;
			case "GetTagUrlsOfUserByKeyword":
				addToPayload(opt, ["keyword", "userAccountName"]);
				break;
			case "SetRating":
				addToPayload(opt, ["url", "rating", "title", "analysisDataEntry"]);
				break;
			case "UpdateComment":
				addToPayload(opt, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
				break;

			// SPELLCHECK OPERATIONS 
            case "SpellCheck":
				addToPayload(opt, ["chunksToSpell", "declaredLanguage", "useLad"]);
                break;

           // TAXONOMY OPERATIONS 
            case "AddTerms":
				addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                break;
            case "GetChildTermsInTerm":
				addToPayload(opt, ["sspId", "lcid", "termId", "termSetId"]);
                break;
            case "GetChildTermsInTermSet":
				addToPayload(opt, ["sspId", "lcid", "termSetId"]);
                break;
            case "GetKeywordTermsByGuids":
				addToPayload(opt, ["termIds", "lcid"]);
                break;
            case "GetTermsByLabel":
				addToPayload(opt, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                break;
            case "GetTermSets":
				addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                break;

			// USERS AND GROUPS OPERATIONS
			case "AddGroup":
				addToPayload(opt, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
				break;
			case "AddGroupToRole":
				addToPayload(opt, ["groupName", "roleName"]);
				break;
			case "AddRole":
				addToPayload(opt, ["roleName", "description", "permissionMask"]);
				break;
			case "AddRoleDef":
				addToPayload(opt, ["roleName", "description", "permissionMask"]);
				break;
			case "AddUserCollectionToGroup":
				addToPayload(opt, ["groupName", "usersInfoXml"]);
				break;
			case "AddUserCollectionToRole":
				addToPayload(opt, ["roleName", "usersInfoXml"]);
				break;
			case "AddUserToGroup":
				addToPayload(opt, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
				break;
			case "AddUserToRole":
				addToPayload(opt, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
				break;
			case "GetAllUserCollectionFromWeb":
				break;
			case "GetGroupCollection":
				addToPayload(opt, ["groupNamesXml"]);
				break;
			case "GetGroupCollectionFromRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetGroupCollectionFromSite":
				break;
			case "GetGroupCollectionFromUser":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetGroupCollectionFromWeb":
				break;
			case "GetGroupInfo":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetRoleCollection":
				addToPayload(opt, ["roleNamesXml"]);
				break;
			case "GetRoleCollectionFromGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetRoleCollectionFromUser":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetRoleCollectionFromWeb":
				break;
			case "GetRoleInfo":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetRolesAndPermissionsForCurrentUser":
				break;
			case "GetRolesAndPermissionsForSite":
				break;
			case "GetUserCollection":
				addToPayload(opt, ["userLoginNamesXml"]);
				break;
			case "GetUserCollectionFromGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetUserCollectionFromRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetUserCollectionFromSite":
				break;
			case "GetUserCollectionFromWeb":
				break;
			case "GetUserInfo":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetUserLoginFromEmail":
				addToPayload(opt, ["emailXml"]);
				break;
			case "RemoveGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "RemoveGroupFromRole":
				addToPayload(opt, ["roleName", "groupName"]);
				break;
			case "RemoveRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "RemoveUserCollectionFromGroup":
				addToPayload(opt, ["groupName", "userLoginNamesXml"]);
				break;
			case "RemoveUserCollectionFromRole":
				addToPayload(opt, ["roleName", "userLoginNamesXml"]);
				break;
			case "RemoveUserCollectionFromSite":
				addToPayload(opt, ["userLoginNamesXml"]);
				break;
			case "RemoveUserFromGroup":
				addToPayload(opt, ["groupName", "userLoginName"]);
				break;
			case "RemoveUserFromRole":
				addToPayload(opt, ["roleName", "userLoginName"]);
				break;
			case "RemoveUserFromSite":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "RemoveUserFromWeb":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "UpdateGroupInfo":
				addToPayload(opt, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
				break;
			case "UpdateRoleDefInfo":
				addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
				break;
			case "UpdateRoleInfo":
				addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
				break;
			case "UpdateUserInfo":
				addToPayload(opt, ["userLoginName", "userName", "userEmail", "userNotes"]);
				break;

			// USERPROFILESERVICE OPERATIONS
			case "AddColleague":
				addToPayload(opt, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
				break;																			
			case "AddLink":
				addToPayload(opt, ["accountName", "name", "url", "group", "privacy"]);
				break;																						
			case "AddMembership":
				addToPayload(opt, ["accountName", "membershipInfo", "group", "privacy"]);
				break;															
			case "AddPinnedLink":
				addToPayload(opt, ["accountName", "name", "url"]);
				break;
			case "CreateMemberGroup":
				addToPayload(opt, ["membershipInfo"]);
				break;
			case "CreateUserProfileByAccountName":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonManager":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetInCommon":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetPropertyChoiceList":
				addToPayload(opt, ["propertyName"]);
				break;
			case "GetUserColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserPinnedLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserProfileByGuid":
				addToPayload(opt, ["guid"]);
				break;
			case "GetUserProfileByIndex":
				addToPayload(opt, ["index"]);
				break;
			case "GetUserProfileByName":
				// Note that this operation is inconsistent with the others, using AccountName rather than accountName
				if(opt.accountName !== undefined && opt.accountName.length > 0) {
					addToPayload(opt, [["AccountName", "accountName"]]);
				} else {
					addToPayload(opt, ["AccountName"]);
				}
				break;
			case "GetUserProfileCount":
				break;
			case "GetUserProfileSchema":
				break;
			case "ModifyUserPropertyByAccountName":
				addToPayload(opt, ["accountName", "newData"]);
				break;
			case "RemoveAllColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllPinnedLinks":
				addToPayload(opt, ["accountName"]);
				break;	
			case "RemoveColleague":
				addToPayload(opt, ["accountName", "colleagueAccountName"]);
				break;	
			case "RemoveLink":
				addToPayload(opt, ["accountName", "id"]);
				break;
			case "RemoveMembership":
				addToPayload(opt, ["accountName", "sourceInternal", "sourceReference"]);
				break;
			case "RemovePinnedLink":
				addToPayload(opt, ["accountName", "id"]);
				break;																							
			case "UpdateColleaguePrivacy":
				addToPayload(opt, ["accountName", "colleagueAccountName", "newPrivacy"]);
				break;
			case "UpdateLink":
				addToPayload(opt, ["accountName", "data"]);
				break;			
			case "UpdateMembershipPrivacy":  
				addToPayload(opt, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
				break;
			case "UpdatePinnedLink ":
				addToPayload(opt, ["accountName", "data"]);
				break;

			// VERSIONS OPERATIONS
			case "DeleteAllVersions":
				addToPayload(opt, ["fileName"]);
				break;
			case "DeleteVersion":
				addToPayload(opt, ["fileName", "fileVersion"]);
				break;
			case "GetVersions":
				addToPayload(opt, ["fileName"]);
				break;
			case "RestoreVersion":
				addToPayload(opt, ["fileName", "fileVersion"]);
				break;

			// VIEW OPERATIONS
			case "AddView":
				addToPayload(opt, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
				break;
			case "DeleteView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetViewCollection":
				addToPayload(opt, ["listName"]);
				break;
			case "GetViewHtml":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "UpdateView":
				addToPayload(opt, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
				break;
			case "UpdateViewHtml":
				addToPayload(opt, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
					"query", "viewFields", "aggregations", "formats", "rowLimit"]);
				break;

			// WEBPARTPAGES OPERATIONS
			case "AddWebPart":
				addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
				break;
			case "AddWebPartToZone":
				addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
				break;
			case "GetWebPart2":
				addToPayload(opt, ["pageUrl", "storageKey", "storage", "behavior"]);
				break;
			case "GetWebPartPage":
				addToPayload(opt, ["documentName", "behavior"]);
				break;
			case "GetWebPartProperties":
				addToPayload(opt, ["pageUrl", "storage"]);
				break;
			case "GetWebPartProperties2":
				addToPayload(opt, ["pageUrl", "storage", "behavior"]);
				break;

			// WEBS OPERATIONS
			case "Webs.CreateContentType":
				addToPayload(opt, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
				break;
			case "GetColumns":
				addToPayload(opt, ["webUrl"]);
				break;
			case "GetContentType":
				addToPayload(opt, ["contentTypeId"]);
				break;
			case "GetContentTypes":
				break;
			case "GetCustomizedPageStatus":
				addToPayload(opt, ["fileUrl"]);
				break;
			case "GetListTemplates":
				break;
			case "GetObjectIdFromUrl":
				addToPayload(opt, ["objectUrl"]);
				break;
			case "GetWeb":
				addToPayload(opt, [["webUrl", "webURL"]]);
				break;
			case "GetWebCollection":
				break;
			case "GetAllSubWebCollection":
				break;
			case "UpdateColumns":
				addToPayload(opt, ["newFields", "updateFields", "deleteFields"]);
				break;				
			case "Webs.UpdateContentType":
				addToPayload(opt, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
				break;				
			case "WebUrlFromPageUrl":
				addToPayload(opt, [["pageUrl", "pageURL"]]);
				break;

			// WORKFLOW OPERATIONS
			case "AlterToDo":
				addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
				break;
			case "GetTemplatesForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetToDosForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetWorkflowDataForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetWorkflowTaskData":
				addToPayload(opt, ["item", "listId", "taskId"]);
				break;
			case "StartWorkflow":
				addToPayload(opt, ["item", "templateId", "workflowParameters"]);
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

		var cachedXML;
		var status = null;

		if(opt.cacheXML) {
			cachedXML = $("body").data(msg);
		}
		
		if(cachedXML === undefined) {
			// Make the Ajax call
			$.ajax({
				url: ajaxURL,											// The relative URL for the AJAX call
				async: opt.async,										// By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
				beforeSend: function (xhr) {							// Before sending the msg, need to send the request header
					// If we need to pass the SOAPAction, do so
					if(WSops[opt.operation][1]) {
						xhr.setRequestHeader("SOAPAction", SOAPAction);
					}
				},
				type: "POST",											// This is a POST
				data: msg,												// Here is the SOAP request we've built above
				dataType: "xml",										// We're getting XML; tell jQuery so that it doesn't need to do a best guess
				contentType: "text/xml;charset='utf-8'",				// and this is its content type
				complete: function(xData, Status) {
					if(opt.cacheXML) {
						$("body").data(msg, xData);				// Cache the results
					}
					cachedXML = xData;
					status = Status;
					opt.completefunc(cachedXML, status);				// When the call is complete, do this
				}
			});

		} else {
			opt.completefunc(cachedXML, status);						// Call the completefunc
		}

	}; // End $.fn.SPServices

	// Defaults added as a function in our library means that the caller can override the defaults
	// for their session by calling this function.  Each operation requires a different set of options;
	// we allow for all in a standardized way.
	$.fn.SPServices.defaults = {

		cacheXML: false,				// If true, we'll cache the XML results with jQuery's .data() function
		operation: "",				// The Web Service operation
		webURL: "",					// URL of the target Web
		makeViewDefault: false,		// true to make the view the default view for the list

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// View name in CAML format.
		CAMLQuery: "",				// Query in CAML format
		CAMLViewFields: "",			// View fields in CAML format
		CAMLRowLimit: 0,			// Row limit as a string representation of an integer
		CAMLQueryOptions: "<QueryOptions></QueryOptions>",		// Query options in CAML format

		// Abstractions for CAML syntax
		batchCmd: "Update",			// Method Cmd for UpdateListItems
		valuepairs: [],				// Fieldname / Fieldvalue pairs for UpdateListItems

		// As of v0.7.1, removed all options which were assigned an empty string ("")
		DestinationUrls: [],		// Array of destination URLs for copy operations
		behavior: "Version3",		// An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
		storage: "Shared",			// A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
		objectType: "List",			// objectType for operations which require it
		cancelMeeting: true,		// true to delete a meeting;false to remove its association with a Meeting Workspace site
		nonGregorian: false,		// true if the calendar is set to a format other than Gregorian;otherwise, false.
		fClaim: false,				// Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
		recurrenceId: 0,			// The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
		sequence: 0,				// An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
		maximumItemsToReturn: 0,	// SocialDataService maximumItemsToReturn
		startIndex: 0,				// SocialDataService startIndex
		isHighPriority: false,		// SocialDataService isHighPriority
		isPrivate: false,			// SocialDataService isPrivate
		rating: 1,					// SocialDataService rating
		maxResults: 10,				// Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
		principalType: "User",		// Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

		async: true,				// Allow the user to force async
		completefunc: null			// Function to call on completion

	}; // End $.fn.SPServices.defaults

	// Function to determine the current Web's URL.  We need this for successful Ajax calls.
	// The function is also available as a public function.
	$.fn.SPServices.SPGetCurrentSite = function() {

		// Do we already know the current site?
		if(thisSite.length > 0) {
			return thisSite;
		}

		// SharePoint 2010 provides the current context, so if available, let's use it
//		thisSite = (typeof SP !== "undefined") ? SP.ClientContext.get_current().get_url() : undefined;
//		if(thisSite !== undefined) return thisSite = location.protocol + "//" + location.hostname + thisSite;
		
		var msg = SOAPEnvelope.header +
				"<WebUrlFromPageUrl xmlns='" + SCHEMASharePoint + "/soap/' ><pageUrl>" +
				((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
				"</pageUrl></WebUrlFromPageUrl>" +
				SOAPEnvelope.footer;
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: "/_vti_bin/Webs.asmx",
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml;charset=\"utf-8\"",
			complete: function (xData, Status) {
				thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
			}
		});
		return thisSite; // Return the URL
	}; // End $.fn.SPServices.SPGetCurrentSite

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
			listName: $().SPServices.SPListNameFromUrl(),		// The list the form is working with. This is useful if the form is not in the list context.
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList
			promptText: "",						// [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. IOrignal value "Choose {0}..."
			noneText: "(None)",					// [Optional] Text to use for the (None) selection. Provided for non-English language support.
			simpleChild: false,					// [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown
			selectSingleOption: false,			// [Optional] If set to true and there is only a single child option, select it
			matchOnId: false,					// By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);


		var thisParentSetUp = false;
		var thisFunction = "SPServices.SPCascadeDropdowns";

		// Find the parent column's select (dropdown)
		var parentSelect = new DropdownCtl(opt.parentColumn);
		if(parentSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "parentColumn: " + opt.parentColumn , TXTColumnNotFound);return;}

		// Find the child column's select (dropdown)
		var childSelect = new DropdownCtl(opt.childColumn);
		if(childSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "childColumn: " + opt.childColumn, TXTColumnNotFound);return;}

		// If requested and the childColumn is a complex dropdown, convert to a simple dropdown
		if(opt.simpleChild === true && childSelect.Type === "C") {
			$().SPServices.SPComplexToSimpleDropdown({
				columnName: opt.childColumn
			});
			// Set the childSelect to reference the new simple dropdown
			childSelect = new DropdownCtl(opt.childColumn);
		}

		// Get information about the childColumn from the current list
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.childColumn + "']").each(function() {
						// Determine whether childColumn is Required
						childColumnRequired = ($(this).attr("Required") === "TRUE") ? true : false;
						childColumnStatic = $(this).attr("StaticName");
						// Stop looking; we're done
						return false;
					});
				});
			}
		});

		// Save data about each child column on the parent
		var childColumn = {opt: opt, childSelect: childSelect, childColumnStatic: childColumnStatic, childColumnRequired: childColumnRequired};
		var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");

		// If this is the first child for this parent, then create the data object to hold the settings
		if(childColumns === undefined) {
			parentSelect.Obj.data("SPCascadeDropdownsChildColumns", [childColumn]);
		// If we already have a data object for this parent, then add the setting for this child to it
		} else {
			childColumns.push(childColumn);
			parentSelect.Obj.data("SPCascadeDropdownsChildColumns", childColumns);
			thisParentSetUp = true;
		}

		// We only need to bind to the event(s) if we haven't already done so
		if(!thisParentSetUp) {
			switch(parentSelect.Type) {
				// Plain old select
				case "S":
					parentSelect.Obj.bind("change", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					break;
				// Input / Select hybrid
				case "C":
					// Bind to any change on the hidden input element
					$("input[id='"+ parentSelect.Obj.attr("optHid") + "']").bind("propertychange", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					break;
				// Multi-select hybrid
				case "M":
					// Handle the dblclick on the candidate select
					parentSelect.Obj.bind("dblclick", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					// Handle the dblclick on the selected values
					parentSelections = parentSelect.Obj.closest("span").find("select[id$='SelectResult']");
					parentSelections.bind("dblclick", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					// Handle a button click
					parentSelect.Obj.closest("span").find("button").each(function() {
						$(this).bind("click", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
						});
					});
					break;
				default:
					break;
			}
		}
		// Fire the change to set the initially allowable values
		cascadeDropdown(opt.parentColumn, parentSelect);

	}; // End $.fn.SPServices.SPCascadeDropdowns

	function cascadeDropdown(parentColumn, parentSelect) {
		var choices = "";
		var parentSelectSelected;
		var childSelectSelected = null;
		var master;
		var MultiLookupPickerdata;
		var newMultiLookupPickerdata;
		var numChildOptions;
		var firstChildOptionId;
		var firstChildOptionValue;

		// Filter each child column
		var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");
		$(childColumns).each(function() {

			// Break out the data objects for this child column
			var opt = this.opt;
			var childSelect = this.childSelect;
			var childColumnStatic = this.childColumnStatic;
			var childColumnRequired = this.childColumnRequired;

			// Get the parent column selection(s)
			parentSelectSelected = getDropdownSelected(parentSelect, opt.matchOnId);

			// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
			// the number of Web Service calls when the parentSelect.Type = "C" or "M", as there are multiple propertychanges
			// which don't require any action.  The attribute will be unique per child column in case there are
			// multiple children for a given parent.
			var allParentSelections = parentSelectSelected.join(";#");
			if(parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic) === allParentSelections) {
				return;
			}
			parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic, allParentSelections);

			// Get the current child column selection(s)
			childSelectSelected = getDropdownSelected(childSelect, true);

			// Find the important bits of the multi-select
			if(childSelect.Type === "M") {
				MultiLookupPickerdata = childSelect.Obj.closest("span").find("input[name$='MultiLookupPicker$data']");
				master = window[childSelect.Obj.closest("tr").find("button[id$='AddButton']").attr("id").replace(/AddButton/,'MultiLookupPicker_m')];
				currentSelection = childSelect.Obj.closest("span").find("select[ID$='SelectResult']");
			}

			// When the parent column's selected option changes, get the matching items from the relationship list
			// Get the list items which match the current selection
			var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where><And>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}

			// Build up the criteria for inclusion
			if(parentSelectSelected.length === 0) {
				// Handle the case where no values are selected in multi-selects
				camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
			} else if(parentSelectSelected.length === 1) {
				// Only one value is selected
				camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
					(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
					escapeColumnValue(parentSelectSelected[0]) + "</Value></Eq>";
			} else {
				var compound = (parentSelectSelected.length > 2) ? true : false;
				for(i=0; i < (parentSelectSelected.length - 1); i++) {
					camlQuery += "<Or>";
				}
				for(i=0; i < parentSelectSelected.length; i++) {
					camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
						(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
						escapeColumnValue(parentSelectSelected[i]) + "</Value></Eq>";
					if(i>0 && (i < (parentSelectSelected.length - 1)) && compound) {
						camlQuery += "</Or>";
					}
				}
				camlQuery += "</Or>";
			}

			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}

			// Make sure we don't get any items which don't have the child value
			camlQuery += "<IsNotNull><FieldRef Name='" + opt.relationshipListChildColumn + "' /></IsNotNull>";

			camlQuery += "</And></Where></Query>";
		
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

					// Handle errors
					$(xData.responseXML).find("errorstring").each(function() {
						var thisFunction = "SPServices.SPCascadeDropdowns";
						var errorText = $(this).text();
						if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
							errBox(thisFunction,
								"relationshipListParentColumn: " + opt.relationshipListParentColumn + " or " +
								"relationshipListChildColumn: " + opt.relationshipListChildColumn,
								"Not found in relationshipList " + opt.relationshipList);
						} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
							errBox(thisFunction,
								"relationshipList: " + opt.relationshipList,
								"List not found");
						}
						return;
					});

					// Add an explanatory prompt
					switch(childSelect.Type) {
						case "S":
							// Remove all of the existing options
							$(childSelect.Obj).find("option").remove();
							// If the column is required or the promptText option is empty, don't add the prompt text
							if(!childColumnRequired && (opt.promptText.length > 0)) {
								childSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.childColumn) + "</option>");
							} else if(!childColumnRequired){
								childSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
							}
							break;
						case "C":
							// If the column is required, don't add the "(None)" option
							choices = childColumnRequired ? "" : opt.noneText + "|0";
							childSelect.Obj.attr("value", "");
							break;
						case "M":
							// Remove all of the existing options
							$(childSelect.Obj).find("option").remove();
							newMultiLookupPickerdata = "";
							break;
						default:
							break;
					}
					// Get the count of items returned and save it so that we can select if it's a single option 
					// The item count is stored thus: <rs:data ItemCount="1">
					numChildOptions = parseFloat($(xData.responseXML).SPFilterNode("rs:data").attr("ItemCount"));

					// Add an option for each child item
					$(xData.responseXML).SPFilterNode("z:row").each(function() {

						var thisOptionId, thisOptionValue;

						// If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
						// else the ID of the relationshipList item
						var thisValue = $(this).attr("ows_" + opt.relationshipListChildColumn);
						
						if(thisValue !== undefined && thisValue.indexOf(";#") > 0) {
							var splitValue = thisValue.split(";#");
							thisOptionId = splitValue[0];
							thisOptionValue = splitValue[1];
						} else {
							thisOptionId = $(this).attr("ows_ID");
							thisOptionValue = thisValue;						
						}

						// If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
						// but by the datatype.  In this case, thisOptionId should be the ID of the relationshipList item.
						// e.g., float;#12345.67
						if(isNaN(thisOptionId)) {
							thisOptionId = $(this).attr("ows_ID");
						}
					
						// Save the id and value for the first child option in case we need to select it (selectSingleOption option is true)
						firstChildOptionId = thisOptionId;
						firstChildOptionValue = thisOptionValue;
					
						switch(childSelect.Type) {
							case "S":
								var selected = ($(this).attr("ows_ID") === childSelectSelected[0]) ? " selected='selected'" : "";
								childSelect.Obj.append("<option" + selected + " value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
								break;
							case "C":
								if(thisOptionId === childSelectSelected[0]) {
									childSelect.Obj.attr("value", thisOptionValue);
								}
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
							// If there is only one option and the selectSingleOption option is true, then select it
							if(numChildOptions === 1 && opt.selectSingleOption === true) {
								$(childSelect.Obj).find("option[value!='0']:first").attr("selected", "selected");
							}
							break;
						case "C":
							// Set the allowable choices
							childSelect.Obj.attr("choices", choices);
							// If there is only one option and the selectSingleOption option is true, then select it
							if(numChildOptions === 1 && opt.selectSingleOption === true) {
								// Set the input element value
								$(childSelect.Obj).attr("value", firstChildOptionValue);
								// Set the value of the optHid input element
								$("input[id='" + childSelect.Obj.attr("optHid") + "']").val(firstChildOptionId);
							}
							// If there's no selection, then remove the value in the associated hidden input element (optHid)
							if(childSelect.Obj.val() === "") {
								$("input[id='" + childSelect.Obj.attr("optHid") + "']").val("");
							}
							break;
						case "M":
							// Clear the master
							master.data = "";
							MultiLookupPickerdata.attr("value", newMultiLookupPickerdata);

							// Clear any prior selections that are no longer valid or aren't selected
							$(currentSelection).find("option").each(function() {
								var thisSelected = $(this);
								var thisValue = $(this).html();
								$(this).attr("selected", "selected");
								$(childSelect.Obj).find("option").filter(function() {
									return $(this).text() == thisValue.replace(/&amp;/, "&");	
								}).each(function() {
									if($(this).html() === thisValue) {
										thisSelected.removeAttr("selected");
									}
								});
							});
							GipRemoveSelectedItems(master);

							// Hide any options in the candidate list which are already selected
							$(childSelect.Obj).find("option").each(function() {
								var thisSelected = $(this);
								$(currentSelection).find("option").each(function() {
									if($(this).html() === thisSelected.html()) {
										thisSelected.remove();
									}
								});
							});
							GipAddSelectedItems(master);

							// Set master.data to the newly allowable values
							master.data = GipGetGroupData(newMultiLookupPickerdata);

							// Trigger a dblclick so that the child will be cascaded if it is a multiselect.
							childSelect.Obj.trigger("dblclick");

							break;
						default:
							break;
					}
				}
			});
			// If present, call completefunc when all else is done
			if(opt.completefunc !== null) {
				opt.completefunc();
			}
		}); // $(childColumns).each(function()

	} // End cascadeDropdown


	// function to convert complex dropdowns to simple dropdowns
	$.fn.SPServices.SPComplexToSimpleDropdown = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the column in the form
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox("SPServices.SPComplexToSimpleDropdown", "columnName: " + opt.columnName, TXTColumnNotFound); return;	}

		// If we don't have a complex dropdown, then there is nothing to do
		if(columnSelect.Type !== "C") { return; }
		
		// The available options are stored in the choices attribute of the complex dropdowns's input element...
		var choices = $(columnSelect.Obj).attr("choices").split("|");
		// The optHid attribute contains the id of a hidden input element which stores the selected value for the commit
		var columnOptHid = $(columnSelect.Obj).attr("optHid");
		var columnOptHidInput = $("input[id='" + columnOptHid + "']");
		// We need to know which option is selected already, if any
		var complexSelectSelectedId = $("input[id='" + columnOptHid + "']").val();

		// Build up the simple dropdown, giving it an easy to select id
		var simpleSelectId = genContainerId("SPComplexToSimpleDropdown", opt.columnName);

		var simpleSelect = "<select id='" + simpleSelectId + "' title='" + opt.columnName + "'>";		
		for(i=0; i < choices.length; i=i+2) {
			var simpleSelectSelected = (choices[i+1] === complexSelectSelectedId) ? " selected='selected' " : " ";
			simpleSelect += "<option" + simpleSelectSelected + "value='" + choices[i+1] + "'>" + choices[i] + "</option>";
		}
		simpleSelect += "</select>";
		
		// Append the new simple select to the form
		$(columnSelect.Obj).closest("td").prepend(simpleSelect);

		// Remove the complex dropdown functionality since we don't need it anymore...
		$(columnSelect.Obj).closest("span").find("img").remove();
		// ...and hide the input element
		$(columnSelect.Obj).closest("span").find("input").hide();

		// When the simple select changes...
		$("#" + simpleSelectId).change(function() {
			var thisVal = $(this).val();
			// ...set the optHid input element's value to the valus of the selected option...
			columnOptHidInput.val(thisVal);
			// ...and save the selected value as the hidden input's value only if the value is not equal to "0" (None)
			$(columnSelect.Obj).val($(this).find("option[value='" + (thisVal !== "0" ? thisVal : "") + "']").html());
		});
		// Trigger a change to ensure that the selected value registers in the complex dropdown
		$("#" + simpleSelectId).trigger("change");

		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}

	}; // End $.fn.SPServices.SPConvertToSimpleDropdown


	// Function to display related information when an option is selected on a form.
	$.fn.SPServices.SPDisplayRelatedInfo = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the column in the form
			relatedWebURL: "",					// [Optional] The name of the Web (site) which contains the related list
			relatedList: "",					// The name of the list which contains the additional information
			relatedListColumn: "",				// The internal name of the related column in the related list
			relatedColumns: [],					// An array of related columns to display
			displayFormat: "table",				// The format to use in displaying the related information.  Possible values are: [table, list]
			headerCSSClass: "ms-vh2",			// CSS class for the table headers
			rowCSSClass: "ms-vb",				// CSS class for the table rows
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be <And>ed with the default query on the relatedList
			numChars: 0,						// If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered
			matchType: "Eq",					// If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith"
			matchOnId: false,					// By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var divId;
		var relatedColumnsXML = [];
		var relatedListXML;
		var thisFunction = "SPServices.SPDisplayRelatedInfo";

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, TXTColumnNotFound); return; }

		// Generate a unique id for the container
		divId = genContainerId("SPDisplayRelatedInfo", opt.columnName);

		// Get information about the related list and its columns
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.relatedWebURL,
			listName: opt.relatedList,
			completefunc: function(xData, Status) {
				// If debug is on, notify about an error
				$(xData.responseXML).find("faultcode").each(function() {
					if(opt.debug) {errBox(thisFunction, "relatedList: " + opt.relatedList, "List not found"); return; }
				});
				// Get info about the related list
				relatedListXML = $(xData.responseXML).find("List");
				// Save the information about each column requested
				for (i=0; i < opt.relatedColumns.length; i++) {
					relatedColumnsXML[i] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedColumns[i] + "']");
				}
			}
		});

		switch(columnSelect.Type) {
			// Plain old select
			case "S":
				columnSelect.Obj.bind("change", function() {
					showRelated(opt, divId, relatedListXML, relatedColumnsXML);
				});
				break;
			// Input / Select hybrid
			case "C":
				// Bind to any change on the hidden input element
                $("input[id='" + columnSelect.Obj.attr("optHid") + "']").bind("propertychange", function() {
					showRelated(opt, divId, relatedListXML, relatedColumnsXML);
				});
				break;
			// Multi-select hybrid
			case "M":
				if(opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, "Multi-select columns not supported by this function"); }
				break;
			default:
				break;
		}
		// Fire the change to set the initially allowable values
		showRelated(opt, divId, relatedListXML, relatedColumnsXML);

	}; // End $.fn.SPServices.SPDisplayRelatedInfo

	function showRelated(opt, divId, relatedListXML, relatedColumnsXML) {

		var columnSelectSelected = null;
		var thisFunction = "SPServices.SPDisplayRelatedInfo";

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);

		// Get the current column selection(s)
		columnSelectSelected = getDropdownSelected(columnSelect, opt.matchOnId);
		if(columnSelect.Type === "C" && opt.numChars > 0 && columnSelectSelected[0].length < opt.numChars) {
			return;
		}

		// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
		// the number of Web Service calls when the parentSelect.Type = "C", as there are multiple propertychanges
		// which don't require any action.
		if(columnSelect.Obj.attr("showRelatedSelected") === columnSelectSelected[0]) {
			return;
		}
		columnSelect.Obj.attr("showRelatedSelected", columnSelectSelected[0]);

		// Remove the old container...
		$("#" + divId).remove();
		// ...and append a new, empty one
		columnSelect.Obj.parent().append("<div id=" + divId + "></div>");

		// Get the list items which match the current selection
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += "<And>";
		}

		camlQuery += "<Eq><FieldRef Name='" + opt.relatedListColumn +
			(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
			escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";

		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery + "</And>";
		}
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

				// Handle errors
				$(xData.responseXML).find("errorstring").each(function() {
					var errorText = $(this).text();
					if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
						errBox(thisFunction,
							"relatedListColumn: " + opt.relatedListColumn,
							"Column not found in relatedList " + opt.relatedList);
					} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
						errBox(thisFunction,
							"relatedList: " + opt.relatedList,
							"List not found");
					}
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
							if(typeof relatedColumnsXML[i] === 'undefined' && opt.debug) {errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList"); return; }
							outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
						}
						outString += "</tr>";
						// Add an option for each child item
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							outString += "<tr>";
							for (i=0; i < opt.relatedColumns.length; i++) {
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
							}
							outString += "</tr>";
						});
						outString += "</table>";
						break;
					// list format implemented in v0.5.0. Still table-based, but vertical orientation.
					case "list":
						outString = "<table>";
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							for (i=0; i < opt.relatedColumns.length; i++) {
								if(typeof relatedColumnsXML[i] === 'undefined' && opt.debug) {errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList"); return; }
								outString += "<tr>";
								outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
								outString += "</tr>";
							}
						});
						outString += "</table>";
						break;
					default:
						break;
				}
				// Write out the results
				$("#" + divId).html(outString);
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	} // End showRelated

	// Function to filter a lookup based dropdown 
	$.fn.SPServices.SPFilterDropdown = function(options) {
		var opt = $.extend({}, {
			relationshipWebURL: "",				// [Optional] The name of the Web (site) which contains the relationshipList
			relationshipList: "",				// The name of the list which contains the lookup values
			relationshipListColumn: "",			// The internal name of the column in the relationship list
			relationshipListSortColumn: "",		// [Optional] If specified, sort the options in the dropdown by this column,
												// otherwise the options are sorted by relationshipListColumn
			columnName: "",						// The display name of the column in the form
			listName: $().SPServices.SPListNameFromUrl(),		// The list the form is working with. This is useful if the form is not in the list context.
			promptText: "",						// [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of columnName. IOrignal value "Choose {0}..."
			noneText: "(None)",					// [Optional] Text to use for the (None) selection. Provided for non-English language support.
			CAMLQuery: "",						// This CAML fragment will be applied to the relationshipList
			CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><ViewAttributes Scope='RecursiveAll'/></QueryOptions>", // Need this to mirror SharePoint's behavior, but it can be overridden
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages; if false, run silent
		}, options);
	
		var choices = "";
		var columnSelectSelected = null;
		var master;
		var MultiLookupPickerdata;
		var newMultiLookupPickerdata;
		var columnColumnRequired;
		var thisFunction = "SPServices.SPFilterDropdown";
	
		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, TXTColumnNotFound); return;}
	
		// Get the current column selection(s)
		columnSelectSelected = getDropdownSelected(columnSelect, true);

		// Get the relationshipList items which match the current selection
		var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListColumn;
		var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery;
		}
		camlQuery += "</Where></Query>";
	
		// Get information about columnName from the current list
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.columnName + "']").each(function() {
						// Determine whether columnName is Required
						columnColumnRequired = ($(this).attr("Required") === "TRUE") ? true : false;
						// Stop looking; we're done
						return false;
					});
				});
			}
		});
		
		$().SPServices({
			operation: "GetListItems",
			// Force sync so that we have the right values for the column onchange trigger
			async: false,
			webURL: opt.relationshipWebURL,
			listName: opt.relationshipList,
			// Filter based on the specified CAML
			CAMLQuery: camlQuery,
			// Only get the columnName's data (plus columns we can't prevent)
			CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListColumn + "' /></ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
			// Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
			CAMLQueryOptions: opt.CAMLQueryOptions,
			completefunc: function(xData, Status) {

				// Handle errors
				$(xData.responseXML).find("errorstring").each(function() {
					var errorText = $(this).text();
					if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
						errBox(thisFunction,
							"relationshipListColumn: " + opt.relationshipListColumn,
							"Not found in relationshipList " + opt.relationshipList);
					} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
						errBox(thisFunction,
							"relationshipList: " + opt.relationshipList,
							"List not found");
					}
					return;
				});

				// Add an explanatory prompt
				switch(columnSelect.Type) {
					case "S":
						// Remove all of the existing options
						$(columnSelect.Obj).find("option").remove();
						// If the column is required or the promptText option is empty, don't add the prompt text
						if(!columnColumnRequired && (opt.promptText.length > 0)) {
							columnSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.columnName) + "</option>");
						} else if(!columnColumnRequired){
							columnSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
						}
						break;
					case "C":
						// If the column is required, don't add the "(None)" option
						choices = columnColumnRequired ? "" : opt.noneText + "|0";
						columnSelect.Obj.attr("value", "");
						break;
					case "M":
						// Remove all of the existing options
						$(columnSelect.Obj).find("option").remove();
						newMultiLookupPickerdata = "";
						break;
					default:
						break;
				}

				// Add an option for each item
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					
					var thisOptionId, thisOptionValue;

					// If relationshipListColumn is a Lookup column, then the ID should be for the Lookup value,
					// else the ID of the relationshipList item
					var thisValue = $(this).attr("ows_" + opt.relationshipListColumn);
					
					if(thisValue !== undefined && thisValue.indexOf(";#") > 0) {
						var splitValue = thisValue.split(";#");
						thisOptionId = splitValue[0];
						thisOptionValue = splitValue[1];
					} else {
						thisOptionId = $(this).attr("ows_ID");
						thisOptionValue = thisValue;						
					}

					// If the relationshipListColumn is a calculated column, then the value isn't preceded by the ID,
					// but by the datatype.  In this case, thisOptionId should be the ID of the relationshipList item.
					// e.g., float;#12345.67
					if(isNaN(thisOptionId)) {
						thisOptionId = $(this).attr("ows_ID");
					}
					
					switch(columnSelect.Type) {
						case "S":
							var selected = ($(this).attr("ows_ID") === columnSelectSelected[0]) ? " selected='selected'" : "";
							columnSelect.Obj.append("<option" + selected + " value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							break;
						case "C":
							if(thisOptionId === columnSelectSelected[0]) {
								columnSelect.Obj.attr("value", thisOptionValue);
							}
							choices = choices + ((choices.length > 0) ? "|" : "") + thisOptionValue + "|" + thisOptionId;
							break;
						case "M":
							columnSelect.Obj.append("<option value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							newMultiLookupPickerdata += thisOptionId + "|t" + thisOptionValue + "|t |t |t";
							break;
						default:
							break;
					}
				});
	
				switch(columnSelect.Type) {
					case "S":
						columnSelect.Obj.trigger("change");
						break;
					case "C":
						columnSelect.Obj.attr("choices", choices);
						columnSelect.Obj.trigger("propertychange");
						break;
					case "M":
						// Find the important bits of the multi-select
						MultiLookupPickerdata = columnSelect.Obj.closest("span").find("input[name$='MultiLookupPicker$data']");
						master = window[columnSelect.Obj.closest("tr").find("button[id$='AddButton']").attr("id").replace(/AddButton/,'MultiLookupPicker_m')];
						currentSelection = columnSelect.Obj.closest("span").find("select[ID$='SelectResult']");
						// Clear the master
						master.data = "";

						MultiLookupPickerdata.attr("value", newMultiLookupPickerdata);
						// Clear any prior selections that are no longer valid
						$(currentSelection).find("option").each(function() {
							var thisSelected = $(this);
							$(this).attr("selected", "selected");
							$(columnSelect.Obj).find("option").each(function() {
								if($(this).html() === thisSelected.html()) {
									thisSelected.removeAttr("selected");
								}
							});
						});
						GipRemoveSelectedItems(master);
						// Hide any options in the candidate list which are already selected
						$(columnSelect.Obj).find("option").each(function() {
							var thisSelected = $(this);
							$(currentSelection).find("option").each(function() {
								if($(this).html() === thisSelected.html()) {
									thisSelected.remove();
								}
							});
						});
						GipAddSelectedItems(master);
						// Set master.data to the newly allowable values
						master.data = GipGetGroupData(newMultiLookupPickerdata);

						// Trigger a dblclick so that the child will be cascaded if it is a multiselect.
						columnSelect.Obj.trigger("dblclick");

						break;
					default:
						break;
				}
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPFilterDropdown


	// Utility function to show the results of a Web Service call formatted well in the browser.
	$.fn.SPServices.SPDebugXMLHttpResult = function(options) {

		var opt = $.extend({}, {
			node: null,							// An XMLHttpResult object from an ajax call
			indent: 0							// Number of indents
		}, options);

		var i;
		var NODE_TEXT = 3;
		var NODE_CDATA_SECTION = 4;

		var outString = "";
		// For each new subnode, begin rendering a new TABLE
		outString += "<table class='ms-vb' style='margin-left:" + opt.indent * 3 + "px;' width='100%'>";
		// DisplayPatterns are a bit unique, so let's handle them differently
		if(opt.node.nodeName === "DisplayPattern") {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.xml + "</textarea></td></tr>";
		// A node which has no children
		} else if (!opt.node.hasChildNodes()) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + ((opt.node.nodeValue !== null) ? checkLink(opt.node.nodeValue) : "&nbsp;") + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>" + showAttrs(opt.node, opt) + "</td></tr>";
			}
		// A CDATA_SECTION node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_CDATA_SECTION) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.parentNode.text + "</textarea></td></tr>";
		// A TEXT node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_TEXT) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + checkLink(opt.node.firstChild.nodeValue) + "</td></tr>";
		// Handle child nodes
		} else {
			outString += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + opt.node.nodeName + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>" + showAttrs(opt.node, opt) + "</td></tr>";
			}
			// Since the node has child nodes, recurse
			outString += "<tr><td>";
			for (i = 0;i < opt.node.childNodes.length; i++) {
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
	}; // End $.fn.SPServices.SPDebugXMLHttpResult

	// Function which returns the account name for the current user in DOMAIN\username format
	$.fn.SPServices.SPGetCurrentUser = function(options) {

		var opt = $.extend({}, {
			fieldName: "Name",				// Specifies which field to return from the userdisp.aspx page
			fieldNames: {},					// Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
			debug: false					// If true, show error messages; if false, run silent
		}, options);

		// The current user's ID is reliably available in an existing JavaScript variable
		if(opt.fieldName === "ID" && _spUserId != undefined) {
			return _spUserId;
		}

		var thisField = "";
		var theseFields = {};
		var fieldCount = opt.fieldNames.length > 0 ? opt.fieldNames.length : 1;
		var thisUserDisp;

		// Get the UserDisp.aspx page using AJAX
		$.ajax({
			// Need this to be synchronous so we're assured of a valid value
			async: false,
			// Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
			// Adding the extra Query String parameter with the current date/time forces the server to view this as a new request.
			url: $().SPServices.SPGetCurrentSite() + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
			complete: function (xData, Status) {
				thisUserDisp = xData;
			}
		});

		for(i=0; i < fieldCount; i++) {

			// The current user's ID is reliably available in an existing JavaScript variable
			if(opt.fieldNames[i] === "ID") {
				thisField = _spUserId;
			} else {
				var thisTextValue;
				if(fieldCount > 1) {
					thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldNames[i] + "\"", "gi");
				} else {
					thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
				}
				$(thisUserDisp.responseText).find("table.ms-formtable td[id^='SPField']").each(function() {
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
			if(opt.fieldNames[i] !== "ID") {
				thisField = (thisField !== undefined) ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
			}
			if(fieldCount > 1) {
				theseFields[opt.fieldNames[i]] = thisField;
			}
		}

		return (fieldCount > 1) ? theseFields : thisField;

	}; // End $.fn.SPServices.SPGetCurrentUser


	// Function which provides a link on a Lookup column for the user to follow
	// which allows them to add a new value to the Lookup list.
	// Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
	// by Waldek Mastykarz
	$.fn.SPServices.SPLookupAddNew = function(options) {

		var opt = $.extend({}, {
			lookupColumn: "",				// The display name of the Lookup column
			promptText: "Add new {0}",		// Text to use as prompt + column name
			newWindow: false,				// If true, the link will open in a new window *without* passing the Source.
			ContentTypeID: "",				// [Optional] Pass the ContentTypeID if you'd like to specify it
			completefunc: null,				// Function to call on completion of rendering the change.
			debug: false					// If true, show error messages;if false, run silent
		}, options);

		var thisFunction = "SPServices.SPLookupAddNew";

		// Find the lookup column's select (dropdown)
		var lookupSelect = new DropdownCtl(opt.lookupColumn);
		if(lookupSelect.Obj.html() === null && opt.debug) { errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, TXTColumnNotFound);return;}

		var newUrl = "";
		var lookupListUrl = "";
		var lookupColumnStaticName = "";
		// Use GetList for the current list to determine the details for the Lookup column
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: $().SPServices.SPListNameFromUrl(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("Field[DisplayName='" + opt.lookupColumn + "']").each(function() {
					lookupColumnStaticName = $(this).attr("StaticName");
					// Use GetList for the Lookup column's list to determine the list's URL
					$().SPServices({
						operation: "GetList",
						async: false,
						cacheXML: true,
						listName: $(this).attr("List"),
						completefunc: function (xData, Status) {
							$(xData.responseXML).find("List").each(function() {
								lookupListUrl = $(this).attr("WebFullUrl");
								// Need to handle when list is in the root site
								lookupListUrl = lookupListUrl !== SLASH ? lookupListUrl + SLASH : lookupListUrl;
							});
						}
					});
					// Get the NewItem form for the Lookup column's list
					newUrl = getListFormUrl($(this).attr("List"), "NewForm");
					// Stop looking;we're done
					return false;
				});
			}
		});

		if(lookupListUrl.length === 0 && opt.debug) {
			errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "This column does not appear to be a lookup column");
			return;
		}
		if(newUrl.length > 0) {
			// Build the link to the Lookup column's list enclosed in a div with the id="SPLookupAddNew_" + lookupColumnStaticName
			var newHref = lookupListUrl + newUrl;
			// If requested, open the link in a new window and if requested, pass the ContentTypeID
			newHref += opt.newWindow ?
					((opt.ContentTypeID.length > 0) ? "?ContentTypeID=" + opt.ContentTypeID : "") + "' target='_blank'" :
					"?" + ((opt.ContentTypeID.length > 0) ? "ContentTypeID=" + opt.ContentTypeID + "&" : "") + "Source=" + escapeUrl(location.href) + "'";
			newLink = "<div id='SPLookupAddNew_" + lookupColumnStaticName + "'>" + "<a href='" + newHref + ">" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a></div>";
			// Append the link to the Lookup columns's formbody table cell
			$(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
		} else if(opt.debug) {
			errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "NewForm cannot be found");
			return;
		}
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPLookupAddNew

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
			webURL: opt.webURL,
			async: false,
			userLoginName: (opt.userAccount !== "") ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("User").each(function() {
					userId = $(this).attr("ID");
				});
			}
		});

		// Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
		// the existing Where clause
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += "<And>";
		}
		camlQuery += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery + "</And>";
		}
		camlQuery += "</Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>";

		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: camlQuery,
			CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
			CAMLRowLimit: 1,
			CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
			completefunc: function(xData, Status) {
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					lastId = $(this).attr("ows_ID");
				});
			}
		});
		return lastId;
	}; // End $.fn.SPServices.SPGetLastItemId
	
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
			showDupes: false,							// If true, show links to the duplicate item(s) after the error message
			completefunc: null							// Function to call on completion of rendering the change.
		}, options);

		// Get the current item's ID from the Query String
		var queryStringVals = $().SPServices.SPGetQueryString();
		var thisID = queryStringVals.ID;
		var thisList = $().SPServices.SPListNameFromUrl();

		// Set the messages based on the options provided
		var msg = "<span id='SPRequireUnique" + opt.columnStaticName + "' class='{0}'>{1}</span><br/>";
		var firstMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);
		
		// We need the DisplayName
		var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
			listName: thisList,
			columnStaticName: opt.columnStaticName
		});
		var columnObj = $("input[Title='" + columnDisplayName + "']");
		$(columnObj).parent().append(firstMsg);

		$(columnObj).blur(function () {
			var columnValueIDs = [];
			// Get the columnDisplayName's value
			var columnValue = $(this).attr("value");
			if(columnValue.length === 0) { return false; }

			// Call the Lists Web Service (GetListItems) to see if the value already exists
			$().SPServices({
				operation: "GetListItems",
				async: false,
				listName: thisList,
				// Make sure we get all the items, ignoring any filters on the default view.
				CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + opt.columnStaticName + "'/></IsNotNull></Where></Query>",
				// Filter based on columnStaticName's value
				CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='" + opt.columnStaticName + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					$(xData.responseXML).SPFilterNode("z:row").each(function() {
						var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
						// If this value already exists in columnStaticName and it's not the current item, then save the ID in the array
						if((testValue === thisValue) && ($(this).attr("ows_ID") !== thisID)) {
							columnValueIDs.push([$(this).attr("ows_ID"), $(this).attr("ows_" + opt.columnStaticName)]);
						}
					});
				}
			});
			var newMsg = opt.initMsg;
			$("span#SPRequireUnique" + opt.columnStaticName).html(newMsg).attr("class", opt.initMsgCSSClass);

			$("input[value='OK']:disabled, input[value='Save']:disabled").removeAttr("disabled");
			if(columnValueIDs.length > 0) {
				newMsg = opt.errMsg;
				$("span#SPRequireUnique" + opt.columnStaticName).html(newMsg).attr("class", opt.errMsgCSSClass);
				if(opt.duplicateAction === 1) {
					$("input[Title='" + opt.columnDisplayName + "']").focus();
					$("input[value='OK'], input[value='Save']").attr("disabled", "disabled");
				}
				if(opt.showDupes) {
					var out = " " + columnValueIDs.length + " duplicate item" + (columnValueIDs.length > 1 ? "s" : "") + ": ";
					for (i=0;i < columnValueIDs.length; i++) {
						out += "<a href='DispForm.aspx?ID=" + columnValueIDs[i][0] + "&Source=" + location.href + "'>" + columnValueIDs[i][1] + "</a> ";
					}
					$("span#SPRequireUnique" + opt.columnStaticName).append(out);
				}
			}

		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPRequireUnique

	// This function returns the DisplayName for a column based on the StaticName.
	$.fn.SPServices.SPGetDisplayFromStatic = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnStaticName: "",			// StaticName of the column
			columnStaticNames: {}			// StaticName of the columns - added in v0.7.2 to allow multiple columns
		}, options);

		var displayName = "";
		var displayNames = {};
		var nameCount = opt.columnStaticNames.length > 0 ? opt.columnStaticNames.length : 1;

		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				if(nameCount > 1) {
					for(i=0; i < nameCount; i++) {
						displayNames[opt.columnStaticNames[i]] = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticNames[i] + "']").attr("DisplayName");
					}
				} else {
					displayName = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticName + "']").attr("DisplayName");
				}
			}
		});

		return (nameCount > 1) ? displayNames : displayName;

	}; // End $.fn.SPServices.SPGetDisplayFromStatic

	// This function returns the StaticName for a column based on the DisplayName.
	$.fn.SPServices.SPGetStaticFromDisplay = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnDisplayName: "",			// DisplayName of the column
			columnDisplayNames: {}			// DisplayNames of the columns - added in v0.7.2 to allow multiple columns
		}, options);

		var staticName = "";
		var staticNames = {};
		var nameCount = opt.columnDisplayNames.length > 0 ? opt.columnDisplayNames.length : 1;

		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				if(nameCount > 1) {
					for(i=0; i < nameCount; i++) {
						staticNames[opt.columnDisplayNames[i]] = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayNames[i] + "']").attr("StaticName");
					}
				} else {
					staticName = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayName + "']").attr("StaticName");
				}
			}
		});

		return (nameCount > 1) ? staticNames : staticName;

	}; // End $.fn.SPServices.SPGetStaticFromDisplay

	// This function allows you to redirect to a another page from a new item form with the new
	// item's ID. This allows chaining of forms from item creation onward.
	$.fn.SPServices.SPRedirectWithID = function (options) {

		var opt = $.extend({}, {
			redirectUrl: "",			// Page for the redirect
			qsParamName: "ID"			// In some cases, you may want to pass the newly created item's ID with a different
										// parameter name than ID. Specify that name here, if needed.
		}, options);

		var thisList = $().SPServices.SPListNameFromUrl();
		var queryStringVals = $().SPServices.SPGetQueryString();
		var lastID = queryStringVals.ID;
		var QSList = queryStringVals.List;
		var QSRootFolder = queryStringVals.RootFolder;
		var QSContentTypeId = queryStringVals.ContentTypeId;
		
		// On first load, change the form actions to redirect back to this page with the current lastID for this user and the
		// original Source.
		if(typeof queryStringVals.ID === 'undefined') {
			lastID = $().SPServices.SPGetLastItemId({
				listName: thisList
			});
			$("form[name='aspnetForm']").each(function() {
				// This page...
				var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
				// ... plus the Source if it exists
				var thisSource = (typeof queryStringVals.Source === "string") ?
					"Source=" + queryStringVals.Source.replace(/\//g, "%2f").replace(/:/g, "%3a") : "";
				
				var newQS = [];
				if(typeof QSList !== 'undefined') {
					newQS.push("List=" + QSList);
				}
				if(typeof QSRootFolder !== 'undefined') {
					newQS.push("RootFolder=" + QSRootFolder);
				}
				if(typeof QSContentTypeId !== 'undefined') {
					newQS.push("ContentTypeId=" + QSContentTypeId);
				}

				var newAction = thisUrl +
					((newQS.length > 0) ? ("?" + newQS.join("&") + "&") : "?") +
					// Set the Source to point back to this page with the lastID this user has added
					"Source=" + thisUrl +
					"?ID=" + lastID +
					// Pass the original source as RealSource, if present
					((thisSource.length > 0) ? ("%26RealSource=" + queryStringVals.Source) : "") +
					// Pass the override RedirectURL, if present
					((typeof queryStringVals.RedirectURL === "string") ? ("%26RedirectURL=" + queryStringVals.RedirectURL) : "");
				$(this).attr("action", newAction);
			});
		// If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
		// then do the redirect to redirectUrl with the new lastID, passing along the original Source.
		} else {
			while(queryStringVals.ID === lastID) {
				lastID = $().SPServices.SPGetLastItemId({
					listName: thisList
				});
			}
			// If there is a RedirectURL parameter on the Query String, then redirect there instead of the value
			// specified in the options (opt.redirectUrl)
			var thisRedirectUrl = (typeof queryStringVals.RedirectURL === "string") ? queryStringVals.RedirectURL : opt.redirectUrl;
			location.href = thisRedirectUrl + "?" + opt.qsParamName + "=" + lastID +
				((typeof queryStringVals.RealSource === "string") ? ("&Source=" + queryStringVals.RealSource) : "");
		}
	}; // End $.fn.SPServices.SPRedirectWithID

	// The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically
	// based on the values they contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
	$.fn.SPServices.SPSetMultiSelectSizes = function (options) {

		var opt = $.extend({}, {
			multiSelectColumn: "",
			minWidth: 0,
			maxWidth: 0,
			debug: false
		}, options);

		var thisFunction = "SPServices.SPSetMultiSelectSizes";

		// Find the multi-select column
		var thisMultiSelect = new DropdownCtl(opt.multiSelectColumn);
		if(thisMultiSelect.Obj.html() === null && opt.debug) { errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, TXTColumnNotFound);return;}
		if(thisMultiSelect.Type !== "M" && opt.debug) { errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, "Column is not multi-select.");return;}

		var possibleValues = thisMultiSelect.Obj;
		var selectedValues = possibleValues.closest("span").find("select[ID$='SelectResult']");

		// Create a temporary clone of the select to use to determine the appropriate width settings.
		// We'll append it to the end of the enclosing span.
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
		if(opt.minWidth > 0 || opt.maxWidth > 0) {
			if(divWidth < opt.minWidth) {
				divWidth = opt.minWidth;
			}
			if(newDivWidth < opt.minWidth) {
				newDivWidth = opt.minWidth;
			}
			if(newDivWidth > opt.maxWidth) {
				newDivWidth = opt.maxWidth;
			}
		}
		var selectWidth = divWidth;

		// Set the new widths
		possibleValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");
		selectedValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");

		// Remove the select's clone, since we're done with it
		$("#" + cloneId).remove();
	}; // End $.fn.SPServices.SPSetMultiSelectSizes

	// Does an audit of a site's list forms to show where script is in use.
	$.fn.SPServices.SPScriptAudit = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// [Optional] The name of the Web (site) to audit
			listName: "",					// [Optional] The name of a specific list to audit. If not present, all lists in the site are audited.
			outputId: "",					// The id of the DOM object for output
			auditForms: true,				// Audit the form pages
			auditViews: true,				// Audit the view pages
			auditPages: true,				// Audit the Pages Document Library
			auditPagesListName: "Pages",	// The Pages Document Library(ies), if desired. Either a single string or an array of strings.
			showHiddenLists: false,			// Show output for hidden lists
			showNoScript: false,			// Show output for lists with no scripts (effectively "verbose")
			showSrc: true					// Show the source location for included scripts
		}, options);

		var formTypes = [["New", "NewForm.aspx", false], ["Display", "DispForm.aspx", false], ["Edit", "EditForm.aspx", false]];
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
						(opt.showSrc ? "<th>Script References</th>" : "") +
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
					$(xData.responseXML).find("List").each(function() {
						listXml = $(this);
							
						// If listName has been specified, then only return results for that list
						if((opt.listName.length === 0) || (listXml.attr("Title") === opt.listName)) {
							// Don't work with hidden lists unless we're asked to
							if((opt.showHiddenLists && listXml.attr("Hidden") === "False") || !opt.showHiddenLists) {
	
								// Audit the list's forms
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
												if($(this).attr("ID").substring(0,6) !== "0x0120") {
													var formUrls = $(this).find("FormUrls");
													for(i=0; i < formTypes.length; i++) {
														// Look for a customized form...
														$(formUrls).find(formTypes[i][0]).each(function() {
															SPScriptAuditPage(opt, listXml, "Form", this.nodeName,
																((opt.webURL.length > 0) ? opt.webURL : $().SPServices.SPGetCurrentSite()) + SLASH + $(this).text());
															formTypes[i][2] = true;
														});
														// ...else the uncustomized form
														if(!formTypes[i][2]) {
															var defaultViewUrl = listXml.attr("DefaultViewUrl");
															SPScriptAuditPage(opt, listXml, "Form", formTypes[i][0],
																defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(SLASH)+1) + formTypes[i][1]);
														}
													}
													// Reset the form types
													for(i=0; i < formTypes.length; i++) {
														formTypes[i][2] = false;
													}
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
						}
					});
				}
			});
		}

		// Don't bother with auditing pages if the options don't require it
		var numLists = 0;
		var listsArray = [];
		if(typeof opt.auditPagesListName === "string") {
			numLists = 1;
			listsArray.push(opt.auditPagesListName);
		} else {
			numLists = opt.auditPagesListName.length;
			listsArray = opt.auditPagesListName;
		}
		
		if(opt.auditPages) {
			for(i=0; i < numLists; i++) {
				$().SPServices({
					operation: "GetList",
					async: false,
					cacheXML: true,
					webURL: opt.webURL,
					listName: listsArray[i],
					completefunc: function (xData, Status) {
						$(xData.responseXML).find("List").each(function() {
							listXml = $(this);
						});
					}
				});
				// Get all of the items from the Document Library
				$().SPServices({
					operation: "GetListItems",
					async: false,
					webURL: opt.webURL,
					listName: listsArray[i],
					CAMLQuery: "<Query><Where><Neq><FieldRef Name='ContentType'/><Value Type='Text'>Folder</Value></Neq></Where></Query>",
					CAMLViewFields: "<ViewFields><FieldRef Name='Title'/><FieldRef Name='FileRef'/></ViewFields>",
					CAMLRowLimit: 0,
					completefunc: function(xData, Status) {
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							var thisPageUrl = $(this).attr("ows_FileRef").split(";#")[1];
							var thisPageType = (typeof $(this).attr("ows_Title") !== 'undefined') ? $(this).attr("ows_Title") : "";
							if(thisPageUrl.indexOf(".aspx") > 0) {
								SPScriptAuditPage(opt, listXml, "Page", thisPageType, SLASH + thisPageUrl);
							}
						});
					}
				});
			}
		}
		// Remove progress indicator and make the output pretty by cleaning up the ms-alternating CSS class
		$("#SPScriptAudit tr[class='ms-alternating']:even").removeAttr("class");
	}; // End $.fn.SPServices.SPScriptAudit

	// Displays the usage of scripts in a site
	function SPScriptAuditPage(opt, listXml, pageClass, pageType, pageUrl) {

		var i = 0;
		var jQueryPage = 0;
		var pageScriptSrc = {};
		pageScriptSrc.type = [];
		pageScriptSrc.src = [];
		pageScriptSrc.script = [];
		var scriptRegex = RegExp("<script[\\s\\S]*?/script>", "gi");

		// Fetch the page
		$.ajax({
			type: "GET",
			url: pageUrl,
			dataType: "text",
			async: false,
			success: function(xData) {

				while (scriptMatch = scriptRegex.exec(xData)) {
					var scriptLanguage = getScriptAttribute(scriptMatch, "language");
					var scriptType = getScriptAttribute(scriptMatch, "type");
					var scriptSrc = getScriptAttribute(scriptMatch, "src");
					if(scriptSrc !== null && scriptSrc.length > 0 && !coreScript(scriptSrc)) {
						pageScriptSrc.type.push((scriptLanguage !== null && scriptLanguage.length > 0) ? scriptLanguage : scriptType);
						pageScriptSrc.src.push(scriptSrc);
						jQueryPage++;
					}
				}

				// Only show pages without script if we've been asked to do so.
				if((!opt.showNoScript && (pageScriptSrc.type.length > 0)) || opt.showNoScript)  {
					var pagePath = pageUrl.substring(0, pageUrl.lastIndexOf(SLASH)+1);
					var out = "<tr class=ms-alternating>" +
						"<td class=ms-vb-icon><a href='" + listXml.attr("DefaultViewUrl") + "'><IMG border=0 src='" + listXml.attr("ImageUrl") + "'width=16 height=16></A></TD>" +
						"<td class=ms-vb2><a href='" + listXml.attr("DefaultViewUrl") + "'>" + listXml.attr("Title") + ((listXml.attr("Hidden") === "True") ? '(Hidden)' : '')+ "</td>" +
						"<td class=ms-vb2>" + pageClass + "</td>" +
						"<td class=ms-vb2>" + pageType + "</td>" +
						"<td class=ms-vb2><a href='" + pageUrl + "'>" + fileName(pageUrl) + "</td>";
					if(opt.showSrc) {
						var thisSrcPath; 
						out += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
						for(i=0; i < pageScriptSrc.type.length; i++) {
							thisSrcPath = (pageScriptSrc.src[i].substr(0,1) !== SLASH) ? pagePath + pageScriptSrc.src[i] : pageScriptSrc.src[i];
							out += "<tr><td class=ms-vb2 width='30%'>" + pageScriptSrc.type[i] + "</td>";
							out += "<td class=ms-vb2 width='70%'><a href='" + thisSrcPath + "'>" + fileName(pageScriptSrc.src[i]) + "</td></tr>";
						}
						out += "</table></td>";
					}
					$("#SPScriptAudit").append(out);
				}
			}
		});
	} // End of function SPScriptAuditPage
	
	function getScriptAttribute(source, attribute) {
		var regex = RegExp(attribute + "=(\"([^\"]*)\")|('([^']*)')", "gi");
		if(matches = regex.exec(source)) {
			return matches[2];
		}
		return null;
	} // End of function getScriptAttribute

	// Check to see if the script reference is part of SharePoint core so that we can ignore it
	function coreScript(src) {
		var i;
		var coreScriptLocations = ["WebResource.axd", "_layouts"];
		for(i=0; i < coreScriptLocations.length; i++) {
			if(src.indexOf(coreScriptLocations[i]) > -1) {
				return true;	
			}
		}
		return false;
	} // End of function coreScript

	// Rearrange radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate
	$.fn.SPServices.SPArrangeChoices = function (options) {

		var opt = $.extend({}, {
			listName: "",					// The list name for the current form
			columnName: "",					// The display name of the column in the form
			perRow: 99,						// Maximum number of choices desired per row.
			randomize: false				// If true, randomize the order of the options
		}, options);

		var columnFillInChoice = false;
		var columnOptions = [];
		var out;
		
		// Get information about columnName from the list to determine if we're allowing fill-in choices
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: (opt.listName.length > 0) ? opt.listName : $().SPServices.SPListNameFromUrl(),
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.columnName + "']").each(function() {
						// Determine whether columnName allows a fill-in choice
						columnFillInChoice = ($(this).attr("FillInChoice") === "TRUE") ? true : false;
						// Stop looking;we're done
						return false;
					});
				});
			}
		});

		var thisFormField = findFormField(opt.columnName);
		
		var totalChoices = $(thisFormField).find("tr").length;
		var choiceNumber = 0;
		var fillinPrompt;
		var fillinInput;
		// Collect all of the choices
		$(thisFormField).find("tr").each(function() {
			choiceNumber++;
			// If this is the fill-in prompt, save it...
			if(columnFillInChoice && choiceNumber === (totalChoices - 1)) {
				fillinPrompt = $(this).find("td").html();
			// ...or if it is the fill-in input box, save it...
			} else if(columnFillInChoice && choiceNumber === totalChoices) {
				fillinInput = $(this).find("td").html();
			// ...else push into the columnOptions array.
			} else {
				columnOptions.push($(this).html());
			}
		});
		out = "<TR>";

		// If randomize is true, randomly sort the options
		if(opt.randomize) {
			columnOptions.sort(randOrd);
		}

		// Add all of the options to the out string
		for(i=0; i < columnOptions.length; i++) {
			out += columnOptions[i];
			// If we've already got perRow columnOptions in the row, close off the row
			if((i+1) % opt.perRow === 0) {
				out += "</TR><TR>";
			}
		}
		out += "</TR>";

		// If we are allowing a fill-in choice, add that option in a separate row at the bottom
		if(columnFillInChoice) {
			out += "<TR><TD colspan='99'>" + fillinPrompt + fillinInput + "</TD></TR>";
		}

		// Remove the existing rows...
		$(thisFormField).find("tr").remove();
		// ...and append the out string
		$(thisFormField).find("table").append(out);

	}; // End $.fn.SPServices.SPArrangeChoices

	// Provide suggested values from a list for in input column based on characters typed
	$.fn.SPServices.SPAutocomplete = function (options) {

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: false,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;

		// Find the input control for the column and save some of its attributes
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");

		if(columnObj.html() === null && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Column is not an input control or is not found on page");
			return;
		}

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
		columnObj.wrap("<div>");

		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		columnObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");

		// Set the width to match the width of the input control
		$("#" + containerId).css("width", columnObjWidth);		

		// Handle keypresses
		$(columnObj).keyup(function () {

			// Get the column's value
			var columnValue = $(this).val();

			// Hide the container while we're working on it
			$("#" + containerId).hide();

			// Have enough characters been typed yet?
			if(columnValue.length < opt.numChars) {
				return false;
			}

			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});

			// Array to hold the matched values
			var matchArray = [];
			
			// Build the appropriate CAMLQuery
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}
			camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";			
			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}
			camlQuery += "</Where></Query>";

			// Call GetListItems to find all of the potential values
			$().SPServices({
				operation: "GetListItems",
				async: false,
				webURL: opt.WebURL,
				listName: opt.sourceList,
				CAMLQuery: camlQuery,
				CAMLQueryOptions: opt.CAMLQueryOptions,
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.sourceColumn + "' /></ViewFields>",
				CAMLRowLimit: opt.CAMLRowLimit,
				completefunc: function(xData, Status) {
					// Handle upper/lower case if ignoreCase = true
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					// See which values match and add the ones that do to matchArray
					$(xData.responseXML).SPFilterNode("z:row").each(function() {
						var thisValue = $(this).attr("ows_" + opt.sourceColumn);
						var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
						// Make sure we have a match...
						if(opt.filterType === "Contains") {
							var firstMatch = thisValueTest.indexOf(testValue);
							if((firstMatch >= 0) &&
								// ...and that the match is not already in the array if we want uniqueness
								(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						} else {
							// Handles normal case, which is BeginsWith and and other unknown values
							if(testValue === thisValueTest.substr(0,testValue.length) &&
									// ...and that the match is not already in the array if we want uniqueness
									(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						}
					});
				}
			});

			// Build out the set of list elements to contain the available values
			var out = "";
			for (i=0; i < matchArray.length; i++) {
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
			}
			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () {
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text());
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
			if(matchArray.length > 0) {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			}
			// Remove the processing indicator
			columnObj.css("background-image", "");
		});

	}; // End $.fn.SPServices.SPAutocomplete

	// Get the Query String parameters and their values and return in an array
	$.fn.SPServices.SPGetQueryString = function () {

		var i;
		var queryStringVals = {};

		var qs = location.search.substring(1, location.search.length);
		var args = qs.split("&");
		var rxQS = /^([^=]+)=(.*)/i;

		for (i=0; i < args.length; i++) {
			matches = rxQS.exec(args[i]);
			if (rxQS.test(location.href)) {
				if (matches !== null && matches.length > 2) {
					queryStringVals[matches[1]] = unescape(matches[2]).replace(/\+/g,' ');
				}
			}
		}
		return queryStringVals;

	}; // End $.fn.SPServices.SPGetQueryString

	// Get the current list's GUID (ID) from the current URL.  Use of this function only makes sense if we're in a list's context,
	// and we assume that we are calling it from an aspx page which is a form or view for the list.
	$.fn.SPServices.SPListNameFromUrl = function (options) {

		var opt = $.extend({}, {
			listName: ""		// [Optional] Pass in the name or GUID of a list if you are not in its context. e.g., on a Web Part pages in the Pages library
		}, options);

		// Has the name or GUID been passed in?
		if(opt.listName.length > 0) {
			thisList = opt.listName;
			return thisList;
		// Do we already know the current list?
		} else if(thisList.length > 0) {
			return thisList;
		}

		// Parse out the list's root URL from the current location or the passed url
		var thisPage = location.href;
		var thisPageBaseName = thisPage.substring(0, thisPage.indexOf(".aspx"));
		var listPath = decodeURIComponent(thisPageBaseName.substring(0, thisPageBaseName.lastIndexOf(SLASH) + 1)).toUpperCase();

		// Call GetListCollection and loop through the results to find a match with the list's URL to get the list's GUID
		$().SPServices({
			operation: "GetListCollection",
			async: false,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("List").each(function() {
					var defaultViewUrl = $(this).attr("DefaultViewUrl");
					var listCollList = defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(SLASH) + 1).toUpperCase();
					if(listPath.indexOf(listCollList) > 0) {
						thisList = $(this).attr("ID");
						return false;
					}
				});
			}
		});

		// Return the GUID (ID)
		return thisList;
	}; // End $.fn.SPServices.SPListNameFromUrl

	// SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.
	$.fn.SPServices.SPUpdateMultipleListItems = function(options) {

		var opt = $.extend({}, {
			webURL: "",			// [Optional] URL of the target Web.  If not specified, the current Web is used.
			listName: "",		// The list to operate on.
			CAMLQuery: "",		// A CAML fragment specifying which items in the list will be selected and updated
			batchCmd: "Update",	// The operation to perform. By default, Update.
			valuepairs: [],		// Valuepairs for the update in the form [[fieldname1, fieldvalue1], [fieldname2, fieldvalue2]...]
			completefunc: null,	// Function to call on completion of rendering the change.
			debug: false		// If true, show error messages;if false, run silent
		}, options);

		var i;
		var itemsToUpdate = [];
		var documentsToUpdate = [];

		// Call GetListItems to find all of the items matching the CAMLQuery
		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: opt.CAMLQuery,
			CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
			completefunc: function(xData, Status) {
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					itemsToUpdate.push($(this).attr("ows_ID"));
					var fileRef = $(this).attr("ows_FileRef");
					fileRef = "/" + fileRef.substring(fileRef.indexOf(";#")+2);
					documentsToUpdate.push(fileRef);
				});
			}
		});

		var fieldNum;
		var batch = "<Batch OnError='Continue'>";
		for(i=0; i < itemsToUpdate.length; i++) {
			batch += "<Method ID='" + i + "' Cmd='" + opt.batchCmd + "'>";
			for (fieldNum=0; fieldNum < opt.valuepairs.length; fieldNum++) {
				batch += "<Field Name='" + opt.valuepairs[fieldNum][0] + "'>" + escapeColumnValue(opt.valuepairs[fieldNum][1]) + "</Field>";
			}
			batch += "<Field Name='ID'>" + itemsToUpdate[i] + "</Field>";
			if(documentsToUpdate[i].length > 0) {
				batch += "<Field Name='FileRef'>" + documentsToUpdate[i] + "</Field>";
			}
			batch += "</Method>";
		}
		batch += "</Batch>";

		// Call UpdateListItems to update all of the items matching the CAMLQuery
		$().SPServices({
			operation: "UpdateListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			updates: batch,
			completefunc: function(xData, Status) {
				// If present, call completefunc when all else is done
				if(opt.completefunc !== null) {
					opt.completefunc(xData, Status);
				}
			}
		});

	}; // End $.fn.SPServices.SPUpdateMultipleListItems

	// This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
	// http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
	// for performance details.
	$.fn.SPFilterNode = function(name) {
		return this.find('*').filter(function() {
			return this.nodeName === name;
		});
	}; // End $.fn.SPFilterNode


	// This function converts an XML node set to JSON
	// Initial implementation focuses only on GetListItems
	$.fn.SPXmlToJson = function(options) {

		var opt = $.extend({}, {
			mapping: {},			// columnName: mappedName: "mappedName", objectType: "objectType"
			includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
			removeOws: true			// Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
		}, options);

		var colNum;
		var jsonObject = [];

		this.each(function() {
			var row = {};
			var colValue;
			var rowAttrs = this.attributes;

			// Bring back all mapped columns, even those with no value
			$.each(opt.mapping, function() { 
				row[this.mappedName] = ""; 
			});

			// Parse through the element's attributes
			for(attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
				var thisAttrName = rowAttrs[attrNum].name;
				var thisMapping = opt.mapping[thisAttrName];
				var thisObjectName = thisMapping !== undefined ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
				var thisObjectType = thisMapping !== undefined ? thisMapping.objectType : undefined;
				if(opt.includeAllAttrs || thisMapping !== undefined) {
					row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType);
				}
			}
			// Push this item into the JSON Object			
			jsonObject.push(row);

		});

		// Return the JSON object
		return jsonObject;

	}; // End $.fn.SPServices.SPXmlToJson


	function attrToJson(v, objectType) {

		switch (objectType) {
			case "DateTime":
			case "datetime": 							// For calculated columns, stored as datetime;#value
				// Dates have dashes instead of slashes: ows_Created="2009-08-25 14:24:48"
				colValue = dateToJsonObject(v);
				break;
			case "User":
				colValue = userToJsonObject(v);
				break;
			case "UserMulti":
				colValue = userMultiToJsonObject(v);
				break;
			case "Lookup":
				colValue = lookupToJsonObject(v);
				break;
			case "LookupMulti":
				colValue = lookupMultiToJsonObject(v);
				break;
			case "Boolean":
				colValue = booleanToJsonObject(v);
				break;
			case "Integer":
				colValue = intToJsonObject(v);
				break;
			case "Counter":
				colValue = intToJsonObject(v);
				break;
			case "MultiChoice":
				colValue = choiceMultiToJsonObject(v);
				break;
			case "Currency":
			case "float":							// For calculated columns, stored as float;#value
				colValue = floatToJsonObject(v);
				break;
			case "Calc":
				colValue = calcToJsonObject(v);
				break;
			default:
				// All other objectTypes will be simple strings
				colValue = stringToJsonObject(v);
				break;
		}
		return colValue;
	}

	function stringToJsonObject(s) {
		return s;
	}
	function intToJsonObject(s) {
		return parseInt(s, 10);
	}
	function floatToJsonObject(s) {
		return parseFloat(s);
	}
	function booleanToJsonObject(s) {
		var out = s === "0" ? false : true;
		return out;
	}
	function dateToJsonObject(s) {
		return new Date(s.replace(/-/g, "/"));
	}
   function userToJsonObject(s) {
        if (s.length === 0) {
			return null;
        } else {
            var thisUser = s.split(";#"); 
            var thisUserExpanded = thisUser[1].split(",#");
            if(thisUserExpanded.length == 1) {
                return {userId: thisUser[0], userName: thisUser[1]};
            } else {
                return {
					userId: thisUser[0], 
					userName: thisUserExpanded[0].replace( /(,,)/g, ","), 
					loginName: thisUserExpanded[1].replace( /(,,)/g, ","), 
					email: thisUserExpanded[2].replace( /(,,)/g, ","), 
					sipAddress: thisUserExpanded[3].replace( /(,,)/g, ","), 
					title: thisUserExpanded[4].replace( /(,,)/g, ",")
				};
            }
        }
    }
	function userMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisUserMultiObject = [];
			var thisUserMulti = s.split(";#");
			for(i=0; i < thisUserMulti.length; i=i+2) {
				var thisUser = userToJsonObject(thisUserMulti[i] + ";#" + thisUserMulti[i+1]);
				thisUserMultiObject.push(thisUser);
			}
			return thisUserMultiObject;
		}
	}
	function lookupToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisLookup = s.split(";#");
			return {lookupId: thisLookup[0], lookupValue: thisLookup[1]};
		}
	}
	function lookupMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisLookupMultiObject = [];
			var thisLookupMulti = s.split(";#");
			for(i=0; i < thisLookupMulti.length; i=i+2) {
				var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ";#" + thisLookupMulti[i+1]);
				thisLookupMultiObject.push(thisLookup);
			}
			return thisLookupMultiObject;
		}
	}
	function choiceMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisChoiceMultiObject = [];
			var thisChoiceMulti = s.split(";#");
			for(i=0; i < thisChoiceMulti.length; i++) {
				if(thisChoiceMulti[i].length !== 0) {
					thisChoiceMultiObject.push(thisChoiceMulti[i]);
				}
			}
			return thisChoiceMultiObject;
		}
	}
	function calcToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisCalc = s.split(";#");
			// The first value will be the calculated column value type, the second will be the value
			return attrToJson(thisCalc[1], thisCalc[0]);
		}
	}

	// Find a People Picker in the page
	// Returns references to:
	//   row - The TR which contains the People Picker (useful if you'd like to hide it at some point)
	//   contents - The element which contains the current value
	//   currentValue - The current value if it is set
	//   checkNames - The Check Names image (in case you'd like to click it at some point)
	$.fn.SPFindPeoplePicker = function(options) {

		var opt = $.extend({}, {
			peoplePickerDisplayName: "",	// The displayName of the People Picker on the form
			valueToSet: "",					// The value to set the People Picker to. Should be a string containing each username or groupname separated by semi-colons.
			checkNames: true				// If set to true, the Check Names image will be clicked to resolve the names
		}, options);

		var thisRow = $("nobr").filter(function() {
			// Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
			return $(this).contents().eq(0).text() === opt.peoplePickerDisplayName;	
		}).closest("tr");

		var thisContents = thisRow.find("div[name='upLevelDiv']");
		var thisCheckNames = thisRow.find("img[Title='Check Names']:first");

		// If a value was provided, set the value
		if(opt.valueToSet.length > 0) {
			thisContents.html(opt.valueToSet);
		}

		// If checkName is true, click the check names icon
		if(opt.checkNames) {
			thisCheckNames.click();
		}
		var thisCurrentValue = $.trim(thisContents.text());

		// Parse the entity data
		var dictionaryEntries = [];

		// IE
		thisContents.children("span").each(function() {
		
			// Grab the entity data
			var thisData = $(this).find("div[data]").attr("data");

			var dictionaryEntry = {};

			// Entity data is only available in IE
			if(thisData != undefined) {
				var arrayOfDictionaryEntry = $.parseXML(thisData);
				$xml = $(arrayOfDictionaryEntry);

				$xml.find("DictionaryEntry").each(function() {
					var key = $(this).find("Key").text();
					var value = $(this).find("Value").text();
					dictionaryEntry[key] = value;
				});
				dictionaryEntries.push(dictionaryEntry);
			// For other browsers, we'll call GetUserInfo to get the data
			} else {
				$().SPServices({
					operation: "GetUserInfo",
					async: false,
					cacheXML: true,
					userLoginName: $(this).attr("title"),
					completefunc: function(xData, Status) {

						$(xData.responseXML).find("User").each(function() {
						
							$.each(this.attributes, function(i, attrib){ 
								var key = attrib.name; 
								var value = attrib.value; 
								dictionaryEntry[key] = value;
							});						
							dictionaryEntries.push(dictionaryEntry);
						});
					}
				});
			}	
		});
	
		return {row: thisRow, contents: thisContents, currentValue: thisCurrentValue, checkNames: thisCheckNames, dictionaryEntries: dictionaryEntries};
	};

	// Return the current version of SPServices as a string
	$.fn.SPServices.Version = function () {

		return VERSION;

	}; // End $.fn.SPServices.Version



////// PRIVATE FUNCTIONS ////////

	// Display a column (field) formatted correctly based on its definition in the list.
	// NOTE: Currently not dealing with locale differences.
	//   columnXML			The XML node for the column from a GetList operation
	//   columnValue		The text representation of the column's value
	//   opt				The current set of options
	function showColumn(listXML, columnXML, columnValue, opt) {

		if(typeof columnValue === 'undefined') {
			return "";
		}

		var i;
		var outString = "";
		var dispUrl;
		var numDecimals;
		var outArray =[];
		var webUrl = opt.relatedWebURL.length > 0 ? opt.relatedWebURL : $().SPServices.SPGetCurrentSite();

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
			case "UserMulti":
				var userMultiValues = columnValue.split(";#");
				for(i=0; i < userMultiValues.length; i = i+2) {
					outArray.push("<a href='/_layouts/userdisp.aspx?ID=" + userMultiValues[i] +
						"&Source=" + escapeUrl(location.href) + "'>" +
						userMultiValues[i+1] +  "</a>");
				}
				outString = outArray.join(", ");
				break;
			case "Calculated":
				var calcColumn = columnValue.split(";#");
				outString = calcColumn[1];
				break;
			case "Number":
				numDecimals = columnXML.attr("Decimals");
				outString = numDecimals === undefined ?
					parseFloat(columnValue).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Currency":
				numDecimals = columnXML.attr("Decimals");
				outString = numDecimals === undefined ?
					parseFloat(columnValue).toFixed(2).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Lookup":
				switch(columnXML.attr("Name")) {
					case "FileRef":
						// Get the display form URL for the lookup source list
						dispUrl = listXML.attr("BaseType") === "1" ? listXML.attr("RootFolder") + SLASH + "Forms/DispForm.aspx" :
							listXML.attr("RootFolder") + SLASH + "DispForm.aspx";
						outString = "<a href='" + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					case "FileDirRef":
						// Get the display form URL for the lookup source list
						dispUrl = SLASH + columnValue.substring(columnValue.search(";#") + 2);
						outString = "<a href='" + dispUrl + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					// Any other lookup column
					default:
						// Get the display form URL for the lookup source list
						dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
						outString = "<a href='" + opt.relatedWebURL + SLASH + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;						
				}
				break;
			case "LookupMulti":
				// Get the display form URL for the lookup source list
				dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
				// Show all the values as links to the items, separated by commas
				outString = "";
				if(columnValue.length > 0) {
					var lookupMultiValues = columnValue.split(";#");
					for(i=0; i < lookupMultiValues.length / 2; i++) {
						outArray.push("<a href='" + webUrl + SLASH + dispUrl +
							"?ID=" + lookupMultiValues[i * 2] + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							lookupMultiValues[(i * 2) + 1] + "</a>");
					}
				}
				outString = outArray.join(", ");
				break;
			case "File":
				fileName = columnValue.substring(columnValue.search(";#") + 2);
				outString = "<a href='" + listXML.attr("RootFolder") + SLASH + fileName + "'>" + fileName + "</a>";
				break;
			case "Counter":
				outString = columnValue;
				break;
			case "DateTime":
				outString = columnValue;
				break;
			default:
				outString = columnValue;
				break;
		}
		return outString;
	} // End of function showColumn

	// Show a single attribute of a node, enclosed in a table
	//   node				The XML node
	//   opt				The current set of options
	function showAttrs(node, opt) {
		var i;
		var out = "<table class='ms-vb' width='100%'>";
		for (i=0; i < node.attributes.length; i++) {
			out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
				node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
		}
		out += "</table>";
		return out;
	} // End of function showAttrs

	// Find a dropdown (or multi-select) in the DOM. Returns the dropdown onject and its type:
	// S = Simple (select);C = Compound (input + select hybrid);M = Multi-select (select hybrid)
	function DropdownCtl(colName) {
		// Simple
		if((this.Obj = $("select[Title='" + colName + "']")).length === 1) {
			this.Type = "S";
		// Compound
		} else if((this.Obj = $("input[Title='" + colName + "']")).length === 1) {
			this.Type = "C";
		// Multi-select: This will find the multi-select column control in English and most other languages sites where the Title looks like 'Column Name possible values'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title^='" + colName + " ']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like 'Выбранных значений: Column Name'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=': " + colName + "']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a German site (and perhaps others) where the Title looks like 'Mögliche Werte für &quot;Column name&quot;.'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$='\"" + colName + "\".']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Italian site (and perhaps others) where the Title looks like "Valori possibili Column name"
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=' " + colName + "']")).length === 1) {
			this.Type = "M";
		} else {
			this.Type = null;
		}
	} // End of function DropdownCtl

	// Returns the selected value(s) for a dropdown in an array. Expects a dropdown object as returned by the DropdownCtl function.
	// If matchOnId is true, returns the ids rather than the text values for the selection options(s).
	function getDropdownSelected(columnSelect, matchOnId) {

		var columnSelectSelected = [];
		
		switch(columnSelect.Type) {
			case "S":
				if(matchOnId) {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").text() || []);
				}
				break;
			case "C":
				if(matchOnId) {
					columnSelectSelected.push($("input[id='"+ columnSelect.Obj.attr("optHid") + "']").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.attr("value") || []);
				}				
				break;
			case "M":
				var columnSelections = columnSelect.Obj.closest("span").find("select[ID$='SelectResult']");
				$(columnSelections).find("option").each(function() {
					columnSelectSelected.push($(this).html());
				});
				break;
			default:
				break;
		}
		return columnSelectSelected;

	} // End of function getDropdownSelected
	
	// Build an error message based on passed parameters
	function errBox(func, param, msg) {
		var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
			"<b>Parameter</b><br/>" + param + "<br/>" +
			"<b>Message</b><br/>" + msg + "<br/><br/>" +
			"<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
		modalBox(errMsg);
	} // End of function errBox

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
	} // End of function modalBox

	// Generate a unique id for a containing div using the function name and the column display name
	function genContainerId(funcname, columnName) {
		return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
			listName: $().SPServices.SPListNameFromUrl(),
			columnDisplayName: columnName
		});
	} // End of function genContainerId
	
	// Get the URL for a specified form for a list
	function getListFormUrl(l, f) {

		var thisForm, u;

		$().SPServices({
			operation: "GetFormCollection",
			async: false,
			listName: l,
			completefunc: function (xData, Status) {
				u = $(xData.responseXML).find("Form[Type='" + f + "']").attr("Url");;
			}
		});
		return u;

	} // End of function getListFormUrl

	// Add the option values to the SOAPEnvelope.payload for the operation
	//	opt = options for the call
	//	paramArray = an array of option names to add to the payload
	//		"paramName" if the parameter name and the option name match
	//		["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
	function addToPayload(opt, paramArray) {

		var i;

		for (i=0; i < paramArray.length; i++) {
			// the parameter name and the option name match
			if(typeof paramArray[i] === "string") {
				SOAPEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
			// the parameter name and the option name are different 
			} else if(paramArray[i].length === 2) {
				SOAPEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
			// something isn't right, so report it
			} else {
				errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
			}
		}
	} // End of function addToPayload

	// Finds the td which contains a form field in default forms using the comment which contains:
	//   <!--  FieldName="Title"
	//		 FieldInternalName="Title"
	//		 FieldType="SPFieldText"
	//	   -->
	// as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
	function findFormField(columnName) {
		var thisFormBody;
		// There's no easy way to find one of these columns; we'll look for the comment with the columnName
		var searchText = RegExp("FieldName=\"" + columnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\"", "gi");
		// Loop through all of the ms-formbody table cells
		$("td.ms-formbody, td.ms-formbodysurvey").each(function() {
			// Check for the right comment
			if(searchText.test($(this).html())) {
				thisFormBody = $(this);
				// Found it, so we're done
				return false;
			}
		});
		return thisFormBody;
	} // End of function findFormField
	
	// The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
	// the SiteData prefix on their names. This function replaces that name with the right name in the SOAPEnvelope.
	function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
		var siteDataOp = siteDataOperation.substring(8);
		SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
		SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
		return SOAPEnvelope;
	} // End of function siteDataFixSOAPEnvelope

	// Wrap an XML node (n) around a value (v)
	function wrapNode(n, v) {
		var thisValue = v !== undefined ? v : "";
		return "<" + n + ">" + thisValue + "</" + n + ">";
	}

	// Generate a random number for sorting arrays randomly
	function randOrd() {
		return (Math.round(Math.random())-0.5);
	}

	// If a string is a URL, format it as a link, else return the string as-is
	function checkLink(s) {
		return ((s.indexOf("http") === 0) || (s.indexOf(SLASH) === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
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
		if(typeof s === "string") {
			return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
		} else {
			return s;
		}
	}

	// Escape Url
	function escapeUrl(u) {
		return u.replace(/&/g,'%26');
	}

})(jQuery);