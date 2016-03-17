/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
/**
 * Original SPServices core modules...
 */
define([
    "jquery",
    "../utils/constants",
    "../core/SPServices.utils"
], function (
    $,
    constants,
    utils
) {

    /* jshint undef: true */

    "use strict";

    var SOAPAction = "";
    var SOAPEnvelope = {
        header: "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>",
        footer: "</soap:Body></soap:Envelope>",
        payload: ""
    };

    // Caching
    var promisesCache = {};

    //   Web Service names
    var webServices = {
        ALERTS: "Alerts",
        AUTHENTICATION: "Authentication",
        COPY: "Copy",
        FORMS: "Forms",
        LISTS: "Lists",
        MEETINGS: "Meetings",
        OFFICIALFILE: "OfficialFile",
        PEOPLE: "People",
        PERMISSIONS: "Permissions",
        PUBLISHEDLINKSSERVICE: "PublishedLinksService",
        SEARCH: "Search",
        SHAREPOINTDIAGNOSTICS: "SharePointDiagnostics",
        SITEDATA: "SiteData",
        SITES: "Sites",
        SOCIALDATASERVICE: "SocialDataService",
        SPELLCHECK: "SpellCheck",
        TAXONOMYSERVICE: "TaxonomyClientService",
        USERGROUP: "usergroup",
        USERPROFILESERVICE: "UserProfileService",
        VERSIONS: "Versions",
        VIEWS: "Views",
        WEBPARTPAGES: "WebPartPages",
        WEBS: "Webs",
        WORKFLOW: "Workflow",
        /* Nintex Web Service*/
        NINTEXWORKFLOW: "NintexWorkflow/Workflow"        
    };

    var encodeOptionList = ["listName", "description"]; // Used to encode options which may contain special characters


    // Array to store Web Service information
    //  WSops.OpName = [WebService, needs_SOAPAction];
    //      OpName              The name of the Web Service operation -> These names are unique
    //      WebService          The name of the WebService this operation belongs to
    //      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
    //                          true if the operation does a write, else false

    var WSops = {};

    WSops.GetAlerts = [webServices.ALERTS, false];
    WSops.DeleteAlerts = [webServices.ALERTS, true];

    WSops.Mode = [webServices.AUTHENTICATION, false];
    WSops.Login = [webServices.AUTHENTICATION, false];

    WSops.CopyIntoItems = [webServices.COPY, true];
    WSops.CopyIntoItemsLocal = [webServices.COPY, true];
    WSops.GetItem = [webServices.COPY, false];

    WSops.GetForm = [webServices.FORMS, false];
    WSops.GetFormCollection = [webServices.FORMS, false];

    WSops.AddAttachment = [webServices.LISTS, true];
    WSops.AddDiscussionBoardItem = [webServices.LISTS, true];
    WSops.AddList = [webServices.LISTS, true];
    WSops.AddListFromFeature = [webServices.LISTS, true];
    WSops.ApplyContentTypeToList = [webServices.LISTS, true];
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

    WSops.AddMeeting = [webServices.MEETINGS, true];
    WSops.CreateWorkspace = [webServices.MEETINGS, true];
    WSops.RemoveMeeting = [webServices.MEETINGS, true];
    WSops.SetWorkSpaceTitle = [webServices.MEETINGS, true];

    WSops.GetRecordRouting = [webServices.OFFICIALFILE, false];
    WSops.GetRecordRoutingCollection = [webServices.OFFICIALFILE, false];
    WSops.GetServerInfo = [webServices.OFFICIALFILE, false];
    WSops.SubmitFile = [webServices.OFFICIALFILE, true];

    WSops.ResolvePrincipals = [webServices.PEOPLE, true];
    WSops.SearchPrincipals = [webServices.PEOPLE, false];

    WSops.AddPermission = [webServices.PERMISSIONS, true];
    WSops.AddPermissionCollection = [webServices.PERMISSIONS, true];
    WSops.GetPermissionCollection = [webServices.PERMISSIONS, true];
    WSops.RemovePermission = [webServices.PERMISSIONS, true];
    WSops.RemovePermissionCollection = [webServices.PERMISSIONS, true];
    WSops.UpdatePermission = [webServices.PERMISSIONS, true];

    WSops.GetLinks = [webServices.PUBLISHEDLINKSSERVICE, true];

    WSops.GetPortalSearchInfo = [webServices.SEARCH, false];
    WSops.GetQuerySuggestions = [webServices.SEARCH, false];
    WSops.GetSearchMetadata = [webServices.SEARCH, false];
    WSops.Query = [webServices.SEARCH, false];
    WSops.QueryEx = [webServices.SEARCH, false];
    WSops.Registration = [webServices.SEARCH, false];
    WSops.Status = [webServices.SEARCH, false];

    WSops.SendClientScriptErrorReport = [webServices.SHAREPOINTDIAGNOSTICS, true];

    WSops.GetAttachments = [webServices.SITEDATA, false];
    WSops.EnumerateFolder = [webServices.SITEDATA, false];
    WSops.SiteDataGetList = [webServices.SITEDATA, false];
    WSops.SiteDataGetListCollection = [webServices.SITEDATA, false];
    WSops.SiteDataGetSite = [webServices.SITEDATA, false];
    WSops.SiteDataGetSiteUrl = [webServices.SITEDATA, false];
    WSops.SiteDataGetWeb = [webServices.SITEDATA, false];

    WSops.CreateWeb = [webServices.SITES, true];
    WSops.DeleteWeb = [webServices.SITES, true];
    WSops.GetSite = [webServices.SITES, false];
    WSops.GetSiteTemplates = [webServices.SITES, false];

    WSops.AddComment = [webServices.SOCIALDATASERVICE, true];
    WSops.AddTag = [webServices.SOCIALDATASERVICE, true];
    WSops.AddTagByKeyword = [webServices.SOCIALDATASERVICE, true];
    WSops.CountCommentsOfUser = [webServices.SOCIALDATASERVICE, false];
    WSops.CountCommentsOfUserOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.CountCommentsOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.CountRatingsOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.CountTagsOfUser = [webServices.SOCIALDATASERVICE, false];
    WSops.DeleteComment = [webServices.SOCIALDATASERVICE, true];
    WSops.DeleteRating = [webServices.SOCIALDATASERVICE, true];
    WSops.DeleteTag = [webServices.SOCIALDATASERVICE, true];
    WSops.DeleteTagByKeyword = [webServices.SOCIALDATASERVICE, true];
    WSops.DeleteTags = [webServices.SOCIALDATASERVICE, true];
    WSops.GetAllTagTerms = [webServices.SOCIALDATASERVICE, false];
    WSops.GetAllTagTermsForUrlFolder = [webServices.SOCIALDATASERVICE, false];
    WSops.GetAllTagUrls = [webServices.SOCIALDATASERVICE, false];
    WSops.GetAllTagUrlsByKeyword = [webServices.SOCIALDATASERVICE, false];
    WSops.GetCommentsOfUser = [webServices.SOCIALDATASERVICE, false];
    WSops.GetCommentsOfUserOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetCommentsOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetRatingAverageOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetRatingOfUserOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetRatingOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetRatingsOfUser = [webServices.SOCIALDATASERVICE, false];
    WSops.GetRatingsOnUrl = [webServices.SOCIALDATASERVICE, false];
    WSops.GetSocialDataForFullReplication = [webServices.SOCIALDATASERVICE, false];
    WSops.GetTags = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagsOfUser = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagTerms = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagTermsOfUser = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagTermsOnUrl = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagUrlsOfUser = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagUrlsOfUserByKeyword = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagUrls = [webServices.SOCIALDATASERVICE, true];
    WSops.GetTagUrlsByKeyword = [webServices.SOCIALDATASERVICE, true];
    WSops.SetRating = [webServices.SOCIALDATASERVICE, true];
    WSops.UpdateComment = [webServices.SOCIALDATASERVICE, true];

    WSops.SpellCheck = [webServices.SPELLCHECK, false];

    // Taxonomy Service Calls
    // Updated 2011.01.27 by Thomas McMillan
    WSops.AddTerms = [webServices.TAXONOMYSERVICE, true];
    WSops.GetChildTermsInTerm = [webServices.TAXONOMYSERVICE, false];
    WSops.GetChildTermsInTermSet = [webServices.TAXONOMYSERVICE, false];
    WSops.GetKeywordTermsByGuids = [webServices.TAXONOMYSERVICE, false];
    WSops.GetTermsByLabel = [webServices.TAXONOMYSERVICE, false];
    WSops.GetTermSets = [webServices.TAXONOMYSERVICE, false];

    WSops.AddGroup = [webServices.USERGROUP, true];
    WSops.AddGroupToRole = [webServices.USERGROUP, true];
    WSops.AddRole = [webServices.USERGROUP, true];
    WSops.AddRoleDef = [webServices.USERGROUP, true];
    WSops.AddUserCollectionToGroup = [webServices.USERGROUP, true];
    WSops.AddUserCollectionToRole = [webServices.USERGROUP, true];
    WSops.AddUserToGroup = [webServices.USERGROUP, true];
    WSops.AddUserToRole = [webServices.USERGROUP, true];
    WSops.GetAllUserCollectionFromWeb = [webServices.USERGROUP, false];
    WSops.GetGroupCollection = [webServices.USERGROUP, false];
    WSops.GetGroupCollectionFromRole = [webServices.USERGROUP, false];
    WSops.GetGroupCollectionFromSite = [webServices.USERGROUP, false];
    WSops.GetGroupCollectionFromUser = [webServices.USERGROUP, false];
    WSops.GetGroupCollectionFromWeb = [webServices.USERGROUP, false];
    WSops.GetGroupInfo = [webServices.USERGROUP, false];
    WSops.GetRoleCollection = [webServices.USERGROUP, false];
    WSops.GetRoleCollectionFromGroup = [webServices.USERGROUP, false];
    WSops.GetRoleCollectionFromUser = [webServices.USERGROUP, false];
    WSops.GetRoleCollectionFromWeb = [webServices.USERGROUP, false];
    WSops.GetRoleInfo = [webServices.USERGROUP, false];
    WSops.GetRolesAndPermissionsForCurrentUser = [webServices.USERGROUP, false];
    WSops.GetRolesAndPermissionsForSite = [webServices.USERGROUP, false];
    WSops.GetUserCollection = [webServices.USERGROUP, false];
    WSops.GetUserCollectionFromGroup = [webServices.USERGROUP, false];
    WSops.GetUserCollectionFromRole = [webServices.USERGROUP, false];
    WSops.GetUserCollectionFromSite = [webServices.USERGROUP, false];
    WSops.GetUserCollectionFromWeb = [webServices.USERGROUP, false];
    WSops.GetUserInfo = [webServices.USERGROUP, false];
    WSops.GetUserLoginFromEmail = [webServices.USERGROUP, false];
    WSops.RemoveGroup = [webServices.USERGROUP, true];
    WSops.RemoveGroupFromRole = [webServices.USERGROUP, true];
    WSops.RemoveRole = [webServices.USERGROUP, true];
    WSops.RemoveUserCollectionFromGroup = [webServices.USERGROUP, true];
    WSops.RemoveUserCollectionFromRole = [webServices.USERGROUP, true];
    WSops.RemoveUserCollectionFromSite = [webServices.USERGROUP, true];
    WSops.RemoveUserFromGroup = [webServices.USERGROUP, true];
    WSops.RemoveUserFromRole = [webServices.USERGROUP, true];
    WSops.RemoveUserFromSite = [webServices.USERGROUP, true];
    WSops.RemoveUserFromWeb = [webServices.USERGROUP, true];
    WSops.UpdateGroupInfo = [webServices.USERGROUP, true];
    WSops.UpdateRoleDefInfo = [webServices.USERGROUP, true];
    WSops.UpdateRoleInfo = [webServices.USERGROUP, true];
    WSops.UpdateUserInfo = [webServices.USERGROUP, true];

    WSops.AddColleague = [webServices.USERPROFILESERVICE, true];
    WSops.AddLink = [webServices.USERPROFILESERVICE, true];
    WSops.AddMembership = [webServices.USERPROFILESERVICE, true];
    WSops.AddPinnedLink = [webServices.USERPROFILESERVICE, true];
    WSops.CreateMemberGroup = [webServices.USERPROFILESERVICE, true];
    WSops.CreateUserProfileByAccountName = [webServices.USERPROFILESERVICE, true];
    WSops.GetCommonColleagues = [webServices.USERPROFILESERVICE, false];
    WSops.GetCommonManager = [webServices.USERPROFILESERVICE, false];
    WSops.GetCommonMemberships = [webServices.USERPROFILESERVICE, false];
    WSops.GetInCommon = [webServices.USERPROFILESERVICE, false];
    WSops.GetPropertyChoiceList = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserColleagues = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserLinks = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserMemberships = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserPinnedLinks = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserProfileByGuid = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserProfileByIndex = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserProfileByName = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserProfileCount = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserProfileSchema = [webServices.USERPROFILESERVICE, false];
    WSops.GetUserPropertyByAccountName = [webServices.USERPROFILESERVICE, false];
    WSops.ModifyUserPropertyByAccountName = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveAllColleagues = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveAllLinks = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveAllMemberships = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveAllPinnedLinks = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveColleague = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveLink = [webServices.USERPROFILESERVICE, true];
    WSops.RemoveMembership = [webServices.USERPROFILESERVICE, true];
    WSops.RemovePinnedLink = [webServices.USERPROFILESERVICE, true];
    WSops.UpdateColleaguePrivacy = [webServices.USERPROFILESERVICE, true];
    WSops.UpdateLink = [webServices.USERPROFILESERVICE, true];
    WSops.UpdateMembershipPrivacy = [webServices.USERPROFILESERVICE, true];
    WSops.UpdatePinnedLink = [webServices.USERPROFILESERVICE, true];

    WSops.DeleteAllVersions = [webServices.VERSIONS, true];
    WSops.DeleteVersion = [webServices.VERSIONS, true];
    WSops.GetVersions = [webServices.VERSIONS, false];
    WSops.RestoreVersion = [webServices.VERSIONS, true];

    WSops.AddView = [webServices.VIEWS, true];
    WSops.DeleteView = [webServices.VIEWS, true];
    WSops.GetView = [webServices.VIEWS, false];
    WSops.GetViewHtml = [webServices.VIEWS, false];
    WSops.GetViewCollection = [webServices.VIEWS, false];
    WSops.UpdateView = [webServices.VIEWS, true];
    WSops.UpdateViewHtml = [webServices.VIEWS, true];

    WSops.AddWebPart = [webServices.WEBPARTPAGES, true];
    WSops.AddWebPartToZone = [webServices.WEBPARTPAGES, true];
    WSops.DeleteWebPart = [webServices.WEBPARTPAGES, true];
    WSops.GetWebPart2 = [webServices.WEBPARTPAGES, false];
    WSops.GetWebPartPage = [webServices.WEBPARTPAGES, false];
    WSops.GetWebPartProperties = [webServices.WEBPARTPAGES, false];
    WSops.GetWebPartProperties2 = [webServices.WEBPARTPAGES, false];
    WSops.SaveWebPart2 = [webServices.WEBPARTPAGES, true];

    WSops.WebsCreateContentType = [webServices.WEBS, true];
    WSops.GetColumns = [webServices.WEBS, false];
    WSops.GetContentType = [webServices.WEBS, false];
    WSops.GetContentTypes = [webServices.WEBS, false];
    WSops.GetCustomizedPageStatus = [webServices.WEBS, false];
    WSops.GetListTemplates = [webServices.WEBS, false];
    WSops.GetObjectIdFromUrl = [webServices.WEBS, false]; // 2010
    WSops.GetWeb = [webServices.WEBS, false];
    WSops.GetWebCollection = [webServices.WEBS, false];
    WSops.GetAllSubWebCollection = [webServices.WEBS, false];
    WSops.UpdateColumns = [webServices.WEBS, true];
    WSops.WebsUpdateContentType = [webServices.WEBS, true];
    WSops.WebUrlFromPageUrl = [webServices.WEBS, false];

    WSops.AlterToDo = [webServices.WORKFLOW, true];
    WSops.ClaimReleaseTask = [webServices.WORKFLOW, true];
    WSops.GetTemplatesForItem = [webServices.WORKFLOW, false];
    WSops.GetToDosForItem = [webServices.WORKFLOW, false];
    WSops.GetWorkflowDataForItem = [webServices.WORKFLOW, false];
    WSops.GetWorkflowTaskData = [webServices.WORKFLOW, false];
    WSops.StartWorkflow = [webServices.WORKFLOW, true];

	//Nintex 
    WSops.AddLongTermDelegationRule = [webServices.NINTEXWORKFLOW, true];
    WSops.AddWorkflowSchedule = [webServices.NINTEXWORKFLOW, true];
    WSops.AddWorkflowScheduleOnListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.CheckGlobalReuseStatus = [webServices.NINTEXWORKFLOW, true];
	WSops.CheckInForms = [webServices.NINTEXWORKFLOW, true];
	WSops.DelegateAllTasks = [webServices.NINTEXWORKFLOW, true];
	WSops.DelegateTask = [webServices.NINTEXWORKFLOW, true];
	WSops.DeleteLongTermDelegationRule = [webServices.NINTEXWORKFLOW, true];
	WSops.DeleteSnippet = [webServices.NINTEXWORKFLOW, true];
	WSops.DeleteWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.ExportWorkflow = [webServices.NINTEXWORKFLOW, true];
    WSops.FixWorkflowsInSiteFromTemplate = [webServices.NINTEXWORKFLOW, true];
	WSops.GetFolders = [webServices.NINTEXWORKFLOW, true];
	WSops.GetItemsPendingMyApproval = [webServices.NINTEXWORKFLOW, true];
	WSops.GetListContentTypes = [webServices.NINTEXWORKFLOW, true];
	WSops.GetOutcomesForFlexiTask = [webServices.NINTEXWORKFLOW, true];
	WSops.GetRunningWorkflowTasks = [webServices.NINTEXWORKFLOW, true];
	WSops.GetRunningWorkflowTasksCollection = [webServices.NINTEXWORKFLOW, true];
	WSops.GetRunningWorkflowTasksForCurrentUser = [webServices.NINTEXWORKFLOW, true];
	WSops.GetRunningWorkflowTasksForCurrentUserForListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.GetRunningWorkflowTasksForListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.GetTaskDetailsUsingStub = [webServices.NINTEXWORKFLOW, true];
	WSops.GetTaskStubsForCurrentUser = [webServices.NINTEXWORKFLOW, true];
	WSops.GetWorkflowHistory = [webServices.NINTEXWORKFLOW, true];
	WSops.GetWorkflowHistoryForListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.HideTaskForApprover = [webServices.NINTEXWORKFLOW, true];
	WSops.HideWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessFlexiTaskResponse = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessFlexiTaskResponse2 = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessTaskResponse = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessTaskResponse2 = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessTaskResponse3 = [webServices.NINTEXWORKFLOW, true];
	WSops.ProcessTaskResponseUsingToken = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWF = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFSkipValidation = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFSkipValidationNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFXml = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFXmlNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFXmlSkipValidation = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishFromNWFXmlSkipValidationNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.PublishWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.QueryForMessages = [webServices.NINTEXWORKFLOW, true];
	WSops.RemoveWorkflowSchedule = [webServices.NINTEXWORKFLOW, true];
	WSops.RemoveWorkflowScheduleOnListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveFromNWF = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveFromNWFNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveFromNWFXml = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveFromNWFXmlNoOverwrite = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveSnippet = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveTemplate = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveTemplate2 = [webServices.NINTEXWORKFLOW, true];
	WSops.SaveWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.SnippetExists = [webServices.NINTEXWORKFLOW, true];
	WSops.StartSiteWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.NintexStartWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.StartWorkflowOnListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.TemplateExists = [webServices.NINTEXWORKFLOW, true];
	WSops.TerminateWorkflow = [webServices.NINTEXWORKFLOW, true];
	WSops.TerminateWorkflowByName = [webServices.NINTEXWORKFLOW, true];
	WSops.TerminateWorkflowByNameForListItem = [webServices.NINTEXWORKFLOW, true];
	WSops.WorkflowExists = [webServices.NINTEXWORKFLOW, true];
	WSops.WorkflowFormProductSelected = [webServices.NINTEXWORKFLOW, true];


    // Main function, which calls SharePoint's Web Services directly.
    $.fn.SPServices = function (options) {

        // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
        var opt = $.extend({}, $.fn.SPServices.defaults, options);

        // Encode options which may contain special character, esp. ampersand
        for (var i = 0; i < encodeOptionList.length; i++) {
            if (typeof opt[encodeOptionList[i]] === "string") {
                opt[encodeOptionList[i]] = utils.encodeXml(opt[encodeOptionList[i]]);
            }
        }

        // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
        SOAPEnvelope.opheader = "<" + opt.operation + " ";



        switch (WSops[opt.operation][0]) {
            case webServices.ALERTS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/2002/1/alerts/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/2002/1/alerts/";
                break;
            case webServices.MEETINGS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/meetings/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/meetings/";
                break;
            case webServices.OFFICIALFILE:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/recordsrepository/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/recordsrepository/";
                break;
            case webServices.PERMISSIONS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/directory/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/directory/";
                break;
            case webServices.PUBLISHEDLINKSSERVICE:
                SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
                SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
                break;
            case webServices.SEARCH:
                SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
                SOAPAction = "urn:Microsoft.Search/";
                break;
            case webServices.SHAREPOINTDIAGNOSTICS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/diagnostics/' >";
                SOAPAction = "http://schemas.microsoft.com/sharepoint/diagnostics/";
                break;
            case webServices.SOCIALDATASERVICE:
                SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
                SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
                break;
            case webServices.SPELLCHECK:
                SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/' >";
                SOAPAction = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
                break;
            case webServices.TAXONOMYSERVICE:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/taxonomy/soap/' >";
                SOAPAction = constants.SCHEMASharePoint + "/taxonomy/soap/";
                break;
            case webServices.USERGROUP:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/directory/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/directory/";
                break;
            case webServices.USERPROFILESERVICE:
                SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
                SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
                break;
            case webServices.WEBPARTPAGES:
                SOAPEnvelope.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
                SOAPAction = "http://microsoft.com/sharepoint/webpartpages/";
                break;
            case webServices.WORKFLOW:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/workflow/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/workflow/";
                break;
            default:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/'>";
                SOAPAction = constants.SCHEMASharePoint + "/soap/";
                break;
        }

        // Add the operation to the SOAPAction and opfooter
        SOAPAction += opt.operation;
        SOAPEnvelope.opfooter = "</" + opt.operation + ">";

        // Build the URL for the Ajax call based on which operation we're calling
        // If the webURL has been provided, then use it, else use the current site
        var ajaxURL = "_vti_bin/" + WSops[opt.operation][0] + ".asmx";
        var webURL = opt.webURL !== undefined ? opt.webURL : opt.webUrl;
        if (webURL.charAt(webURL.length - 1) === constants.SLASH) {
            ajaxURL = webURL + ajaxURL;
        } else if (webURL.length > 0) {
            ajaxURL = webURL + constants.SLASH + ajaxURL;
        } else {
            var thisSite = $().SPServices.SPGetCurrentSite();
            ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === constants.SLASH) ? ajaxURL : (constants.SLASH + ajaxURL));
        }

        SOAPEnvelope.payload = "";
        // Each operation requires a different set of values.  This switch statement sets them up in the SOAPEnvelope.payload.
        switch (opt.operation) {
            // ALERT OPERATIONS
            case "GetAlerts":
                break;
            case "DeleteAlerts":
                SOAPEnvelope.payload += "<IDs>";
                for (i = 0; i < opt.IDs.length; i++) {
                    SOAPEnvelope.payload += constants.wrapNode("string", opt.IDs[i]);
                }
                SOAPEnvelope.payload += "</IDs>";
                break;

            // AUTHENTICATION OPERATIONS
            case "Mode":
                break;
            case "Login":
                utils.addToPayload(opt, SOAPEnvelope, ["username", "password"]);
                break;

            // COPY OPERATIONS
            case "CopyIntoItems":
                utils.addToPayload(opt, SOAPEnvelope, ["SourceUrl"]);
                SOAPEnvelope.payload += "<DestinationUrls>";
                for (i = 0; i < opt.DestinationUrls.length; i++) {
                    SOAPEnvelope.payload += utils.wrapNode("string", opt.DestinationUrls[i]);
                }
                SOAPEnvelope.payload += "</DestinationUrls>";
                utils.addToPayload(opt, SOAPEnvelope, ["Fields", "Stream", "Results"]);
                break;
            case "CopyIntoItemsLocal":
                utils.addToPayload(opt, SOAPEnvelope, ["SourceUrl"]);
                SOAPEnvelope.payload += "<DestinationUrls>";
                for (i = 0; i < opt.DestinationUrls.length; i++) {
                    SOAPEnvelope.payload += utils.wrapNode("string", opt.DestinationUrls[i]);
                }
                SOAPEnvelope.payload += "</DestinationUrls>";
                break;
            case "GetItem":
                utils.addToPayload(opt, SOAPEnvelope, ["Url", "Fields", "Stream"]);
                break;

            // FORM OPERATIONS
            case "GetForm":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "formUrl"]);
                break;
            case "GetFormCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                break;

            // LIST OPERATIONS
            case "AddAttachment":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "listItemID", "fileName", "attachment"]);
                break;
            case "AddDiscussionBoardItem":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "message"]);
                break;
            case "AddList":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "description", "templateID"]);
                break;
            case "AddListFromFeature":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "description", "featureID", "templateID"]);
                break;
            case "ApplyContentTypeToList":
                utils.addToPayload(opt, SOAPEnvelope, ["webUrl", "contentTypeId", "listName"]);
                break;
            case "CheckInFile":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "comment", "CheckinType"]);
                break;
            case "CheckOutFile":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "checkoutToLocal", "lastmodified"]);
                break;
            case "CreateContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
                break;
            case "DeleteAttachment":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "listItemID", "url"]);
                break;
            case "DeleteContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "contentTypeId"]);
                break;
            case "DeleteContentTypeXmlDocument":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "contentTypeId", "documentUri"]);
                break;
            case "DeleteList":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                break;
            case "GetAttachmentCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", ["listItemID", "ID"]]);
                break;
            case "GetList":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                break;
            case "GetListAndView":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName"]);
                break;
            case "GetListCollection":
                break;
            case "GetListContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "contentTypeId"]);
                break;
            case "GetListContentTypes":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                break;
            case "GetListItems":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName", ["query", "CAMLQuery"],
                    ["viewFields", "CAMLViewFields"],
                    ["rowLimit", "CAMLRowLimit"],
                    ["queryOptions", "CAMLQueryOptions"]
                ]);
                break;
            case "GetListItemChanges":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewFields", "since", "contains"]);
                break;
            case "GetListItemChangesSinceToken":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName", ["query", "CAMLQuery"],
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
                utils.addToPayload(opt, SOAPEnvelope, ["strlistID", "strlistItemID", "strFieldName"]);
                break;
            case "UndoCheckOut":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl"]);
                break;
            case "UpdateContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
                break;
            case "UpdateContentTypesXmlDocument":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "newDocument"]);
                break;
            case "UpdateContentTypeXmlDocument":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "contentTypeId", "newDocument"]);
                break;
            case "UpdateList":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
                break;
            case "UpdateListItems":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                    utils.addToPayload(opt, SOAPEnvelope, ["updates"]);
                } else {
                    SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
                    for (i = 0; i < opt.valuepairs.length; i++) {
                        SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + utils.escapeColumnValue(opt.valuepairs[i][1]) + "</Field>";
                    }
                    if (opt.batchCmd !== "New") {
                        SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
                    }
                    SOAPEnvelope.payload += "</Method></Batch></updates>";
                }
                break;

            // MEETINGS OPERATIONS
            case "AddMeeting":
                utils.addToPayload(opt, SOAPEnvelope, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
                break;
            case "CreateWorkspace":
                utils.addToPayload(opt, SOAPEnvelope, ["title", "templateName", "lcid", "timeZoneInformation"]);
                break;
            case "RemoveMeeting":
                utils.addToPayload(opt, SOAPEnvelope, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
                break;
            case "SetWorkspaceTitle":
                utils.addToPayload(opt, SOAPEnvelope, ["title"]);
                break;

            // OFFICIALFILE OPERATIONS
            case "GetRecordRouting":
                utils.addToPayload(opt, SOAPEnvelope, ["recordRouting"]);
                break;
            case "GetRecordRoutingCollection":
                break;
            case "GetServerInfo":
                break;
            case "SubmitFile":
                utils.addToPayload(opt, SOAPEnvelope, ["fileToSubmit"], ["properties"], ["recordRouting"], ["sourceUrl"], ["userName"]);
                break;


            // PEOPLE OPERATIONS
            case "ResolvePrincipals":
                utils.addToPayload(opt, SOAPEnvelope, ["principalKeys", "principalType", "addToUserInfoList"]);
                break;
            case "SearchPrincipals":
                utils.addToPayload(opt, SOAPEnvelope, ["searchText", "maxResults", "principalType"]);
                break;

            // PERMISSION OPERATIONS
            case "AddPermission":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
                break;
            case "AddPermissionCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType", "permissionsInfoXml"]);
                break;
            case "GetPermissionCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType"]);
                break;
            case "RemovePermission":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
                break;
            case "RemovePermissionCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType", "memberIdsXml"]);
                break;
            case "UpdatePermission":
                utils.addToPayload(opt, SOAPEnvelope, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
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
                SOAPEnvelope.payload += utils.wrapNode("queryXml", constants.encodeXml(opt.queryXml));
                break;
            case "GetSearchMetadata":
                SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                break;
            case "Query":
                SOAPEnvelope.payload += utils.wrapNode("queryXml", constants.encodeXml(opt.queryXml));
                break;
            case "QueryEx":
                SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                SOAPEnvelope.payload += utils.wrapNode("queryXml", constants.encodeXml(opt.queryXml));
                break;
            case "Registration":
                SOAPEnvelope.payload += utils.wrapNode("registrationXml", constants.encodeXml(opt.registrationXml));
                break;
            case "Status":
                break;

            // SHAREPOINTDIAGNOSTICS OPERATIONS
            case "SendClientScriptErrorReport":
                utils.addToPayload(opt, SOAPEnvelope, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
                break;

            // SITEDATA OPERATIONS
            case "EnumerateFolder":
                utils.addToPayload(opt, SOAPEnvelope, ["strFolderUrl"]);
                break;
            case "GetAttachments":
                utils.addToPayload(opt, SOAPEnvelope, ["strListName", "strItemId"]);
                break;
            case "SiteDataGetList":
                utils.addToPayload(opt, SOAPEnvelope, ["strListName"]);
                // Because this operation has a name which duplicates the Lists WS, need to handle
                SOAPEnvelope = constants.siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
                break;
            case "SiteDataGetListCollection":
                // Because this operation has a name which duplicates the Lists WS, need to handle
                SOAPEnvelope = constants.siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
                break;
            case "SiteDataGetSite":
                // Because this operation has a name which duplicates the Lists WS, need to handle
                SOAPEnvelope = constants.siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
                break;
            case "SiteDataGetSiteUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["Url"]);
                // Because this operation has a name which duplicates the Lists WS, need to handle
                SOAPEnvelope = constants.siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
                break;
            case "SiteDataGetWeb":
                // Because this operation has a name which duplicates the Lists WS, need to handle
                SOAPEnvelope = constants.siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
                break;

            // SITES OPERATIONS
            case "CreateWeb":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "title", "description", "templateName", "language", "languageSpecified",
                    "locale", "localeSpecified", "collationLocale", "collationLocaleSpecified", "uniquePermissions",
                    "uniquePermissionsSpecified", "anonymous", "anonymousSpecified", "presence", "presenceSpecified"
                ]);
                break;
            case "DeleteWeb":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetSite":
                utils.addToPayload(opt, SOAPEnvelope, ["SiteUrl"]);
                break;
            case "GetSiteTemplates":
                utils.addToPayload(opt, SOAPEnvelope, ["LCID", "TemplateList"]);
                break;

            // SOCIALDATASERVICE OPERATIONS
            case "AddComment":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "comment", "isHighPriority", "title"]);
                break;
            case "AddTag":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "termID", "title", "isPrivate"]);
                break;
            case "AddTagByKeyword":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "keyword", "title", "isPrivate"]);
                break;
            case "CountCommentsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName"]);
                break;
            case "CountCommentsOfUserOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "url"]);
                break;
            case "CountCommentsOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "CountRatingsOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "CountTagsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName"]);
                break;
            case "DeleteComment":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "lastModifiedTime"]);
                break;
            case "DeleteRating":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "DeleteTag":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "termID"]);
                break;
            case "DeleteTagByKeyword":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "keyword"]);
                break;
            case "DeleteTags":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetAllTagTerms":
                utils.addToPayload(opt, SOAPEnvelope, ["maximumItemsToReturn"]);
                break;
            case "GetAllTagTermsForUrlFolder":
                utils.addToPayload(opt, SOAPEnvelope, ["urlFolder", "maximumItemsToReturn"]);
                break;
            case "GetAllTagUrls":
                utils.addToPayload(opt, SOAPEnvelope, ["termID"]);
                break;
            case "GetAllTagUrlsByKeyword":
                utils.addToPayload(opt, SOAPEnvelope, ["keyword"]);
                break;
            case "GetCommentsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                break;
            case "GetCommentsOfUserOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "url"]);
                break;
            case "GetCommentsOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "maximumItemsToReturn", "startIndex"]);
                if (typeof opt.excludeItemsTime !== "undefined" && opt.excludeItemsTime.length > 0) {
                    SOAPEnvelope.payload += utils.wrapNode("excludeItemsTime", opt.excludeItemsTime);
                }
                break;
            case "GetRatingAverageOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetRatingOfUserOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "url"]);
                break;
            case "GetRatingOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetRatingsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName"]);
                break;
            case "GetRatingsOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetSocialDataForFullReplication":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName"]);
                break;
            case "GetTags":
                utils.addToPayload(opt, SOAPEnvelope, ["url"]);
                break;
            case "GetTagsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
                break;
            case "GetTagTerms":
                utils.addToPayload(opt, SOAPEnvelope, ["maximumItemsToReturn"]);
                break;
            case "GetTagTermsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userAccountName", "maximumItemsToReturn"]);
                break;
            case "GetTagTermsOnUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "maximumItemsToReturn"]);
                break;
            case "GetTagUrls":
                utils.addToPayload(opt, SOAPEnvelope, ["termID"]);
                break;
            case "GetTagUrlsByKeyword":
                utils.addToPayload(opt, SOAPEnvelope, ["keyword"]);
                break;
            case "GetTagUrlsOfUser":
                utils.addToPayload(opt, SOAPEnvelope, ["termID", "userAccountName"]);
                break;
            case "GetTagUrlsOfUserByKeyword":
                utils.addToPayload(opt, SOAPEnvelope, ["keyword", "userAccountName"]);
                break;
            case "SetRating":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "rating", "title", "analysisDataEntry"]);
                break;
            case "UpdateComment":
                utils.addToPayload(opt, SOAPEnvelope, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
                break;

            // SPELLCHECK OPERATIONS
            case "SpellCheck":
                utils.addToPayload(opt, SOAPEnvelope, ["chunksToSpell", "declaredLanguage", "useLad"]);
                break;

            // TAXONOMY OPERATIONS
            case "AddTerms":
                utils.addToPayload(opt, SOAPEnvelope, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                break;
            case "GetChildTermsInTerm":
                utils.addToPayload(opt, SOAPEnvelope, ["sspId", "lcid", "termId", "termSetId"]);
                break;
            case "GetChildTermsInTermSet":
                utils.addToPayload(opt, SOAPEnvelope, ["sspId", "lcid", "termSetId"]);
                break;
            case "GetKeywordTermsByGuids":
                utils.addToPayload(opt, SOAPEnvelope, ["termIds", "lcid"]);
                break;
            case "GetTermsByLabel":
                utils.addToPayload(opt, SOAPEnvelope, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                break;
            case "GetTermSets":
                utils.addToPayload(opt, SOAPEnvelope, ["sharedServiceIds", "termSetIds", "lcid", "clientTimeStamps", "clientVersions"]);
                break;

            // USERS AND GROUPS OPERATIONS
            case "AddGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
                break;
            case "AddGroupToRole":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "roleName"]);
                break;
            case "AddRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "description", "permissionMask"]);
                break;
            case "AddRoleDef":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "description", "permissionMask"]);
                break;
            case "AddUserCollectionToGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "usersInfoXml"]);
                break;
            case "AddUserCollectionToRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "usersInfoXml"]);
                break;
            case "AddUserToGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
                break;
            case "AddUserToRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
                break;
            case "GetAllUserCollectionFromWeb":
                break;
            case "GetGroupCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["groupNamesXml"]);
                break;
            case "GetGroupCollectionFromRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName"]);
                break;
            case "GetGroupCollectionFromSite":
                break;
            case "GetGroupCollectionFromUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName"]);
                break;
            case "GetGroupCollectionFromWeb":
                break;
            case "GetGroupInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName"]);
                break;
            case "GetRoleCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["roleNamesXml"]);
                break;
            case "GetRoleCollectionFromGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName"]);
                break;
            case "GetRoleCollectionFromUser":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName"]);
                break;
            case "GetRoleCollectionFromWeb":
                break;
            case "GetRoleInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName"]);
                break;
            case "GetRolesAndPermissionsForCurrentUser":
                break;
            case "GetRolesAndPermissionsForSite":
                break;
            case "GetUserCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginNamesXml"]);
                break;
            case "GetUserCollectionFromGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName"]);
                break;
            case "GetUserCollectionFromRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName"]);
                break;
            case "GetUserCollectionFromSite":
                break;
            case "GetUserCollectionFromWeb":
                break;
            case "GetUserInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName"]);
                break;
            case "GetUserLoginFromEmail":
                utils.addToPayload(opt, SOAPEnvelope, ["emailXml"]);
                break;
            case "RemoveGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName"]);
                break;
            case "RemoveGroupFromRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "groupName"]);
                break;
            case "RemoveRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName"]);
                break;
            case "RemoveUserCollectionFromGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "userLoginNamesXml"]);
                break;
            case "RemoveUserCollectionFromRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "userLoginNamesXml"]);
                break;
            case "RemoveUserCollectionFromSite":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginNamesXml"]);
                break;
            case "RemoveUserFromGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["groupName", "userLoginName"]);
                break;
            case "RemoveUserFromRole":
                utils.addToPayload(opt, SOAPEnvelope, ["roleName", "userLoginName"]);
                break;
            case "RemoveUserFromSite":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName"]);
                break;
            case "RemoveUserFromWeb":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName"]);
                break;
            case "UpdateGroupInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
                break;
            case "UpdateRoleDefInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["oldRoleName", "roleName", "description", "permissionMask"]);
                break;
            case "UpdateRoleInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["oldRoleName", "roleName", "description", "permissionMask"]);
                break;
            case "UpdateUserInfo":
                utils.addToPayload(opt, SOAPEnvelope, ["userLoginName", "userName", "userEmail", "userNotes"]);
                break;

            // USERPROFILESERVICE OPERATIONS
            case "AddColleague":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
                break;
            case "AddLink":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "name", "url", "group", "privacy"]);
                break;
            case "AddMembership":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "membershipInfo", "group", "privacy"]);
                break;
            case "AddPinnedLink":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "name", "url"]);
                break;
            case "CreateMemberGroup":
                utils.addToPayload(opt, SOAPEnvelope, ["membershipInfo"]);
                break;
            case "CreateUserProfileByAccountName":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetCommonColleagues":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetCommonManager":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetCommonMemberships":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetInCommon":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetPropertyChoiceList":
                utils.addToPayload(opt, SOAPEnvelope, ["propertyName"]);
                break;
            case "GetUserColleagues":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetUserLinks":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetUserMemberships":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetUserPinnedLinks":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "GetUserProfileByGuid":
                utils.addToPayload(opt, SOAPEnvelope, ["guid"]);
                break;
            case "GetUserProfileByIndex":
                utils.addToPayload(opt, SOAPEnvelope, ["index"]);
                break;
            case "GetUserProfileByName":
                // Note that this operation is inconsistent with the others, using AccountName rather than accountName
                if (typeof opt.accountName !== "undefined" && opt.accountName.length > 0) {
                    utils.addToPayload(opt, SOAPEnvelope, [
                        ["AccountName", "accountName"]
                    ]);
                } else {
                    utils.addToPayload(opt, SOAPEnvelope, ["AccountName"]);
                }
                break;
            case "GetUserProfileCount":
                break;
            case "GetUserProfileSchema":
                break;
            case "GetUserPropertyByAccountName":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "propertyName"]);
                break;
            case "ModifyUserPropertyByAccountName":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "newData"]);
                break;
            case "RemoveAllColleagues":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "RemoveAllLinks":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "RemoveAllMemberships":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "RemoveAllPinnedLinks":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName"]);
                break;
            case "RemoveColleague":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "colleagueAccountName"]);
                break;
            case "RemoveLink":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "id"]);
                break;
            case "RemoveMembership":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "sourceInternal", "sourceReference"]);
                break;
            case "RemovePinnedLink":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "id"]);
                break;
            case "UpdateColleaguePrivacy":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "colleagueAccountName", "newPrivacy"]);
                break;
            case "UpdateLink":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "data"]);
                break;
            case "UpdateMembershipPrivacy":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
                break;
            case "UpdatePinnedLink ":
                utils.addToPayload(opt, SOAPEnvelope, ["accountName", "data"]);
                break;

            // VERSIONS OPERATIONS
            case "DeleteAllVersions":
                utils.addToPayload(opt, SOAPEnvelope, ["fileName"]);
                break;
            case "DeleteVersion":
                utils.addToPayload(opt, SOAPEnvelope, ["fileName", "fileVersion"]);
                break;
            case "GetVersions":
                utils.addToPayload(opt, SOAPEnvelope, ["fileName"]);
                break;
            case "RestoreVersion":
                utils.addToPayload(opt, SOAPEnvelope, ["fileName", "fileVersion"]);
                break;

            // VIEW OPERATIONS
            case "AddView":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName", "viewFields", "query", "rowLimit", "type", "makeViewDefault"]);
                break;
            case "DeleteView":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName"]);
                break;
            case "GetView":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName"]);
                break;
            case "GetViewCollection":
                utils.addToPayload(opt, SOAPEnvelope, ["listName"]);
                break;
            case "GetViewHtml":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName"]);
                break;
            case "UpdateView":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
                break;
            case "UpdateViewHtml":
                utils.addToPayload(opt, SOAPEnvelope, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
                    "query", "viewFields", "aggregations", "formats", "rowLimit"
                ]);
                break;

            // WEBPARTPAGES OPERATIONS
            case "AddWebPart":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "webPartXml", "storage"]);
                break;
            case "AddWebPartToZone":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                break;
            case "DeleteWebPart":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "storageKey", "storage"]);
                break;
            case "GetWebPart2":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "storageKey", "storage", "behavior"]);
                break;
            case "GetWebPartPage":
                utils.addToPayload(opt, SOAPEnvelope, ["documentName", "behavior"]);
                break;
            case "GetWebPartProperties":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "storage"]);
                break;
            case "GetWebPartProperties2":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "storage", "behavior"]);
                break;
            case "SaveWebPart2":
                utils.addToPayload(opt, SOAPEnvelope, ["pageUrl", "storageKey", "webPartXml", "storage", "allowTypeChange"]);
                break;

            // WEBS OPERATIONS
            case "WebsCreateContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
                break;
            case "GetColumns":
                utils.addToPayload(opt, SOAPEnvelope, ["webUrl"]);
                break;
            case "GetContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["contentTypeId"]);
                break;
            case "GetContentTypes":
                break;
            case "GetCustomizedPageStatus":
                utils.addToPayload(opt, SOAPEnvelope, ["fileUrl"]);
                break;
            case "GetListTemplates":
                break;
            case "GetObjectIdFromUrl":
                utils.addToPayload(opt, SOAPEnvelope, ["objectUrl"]);
                break;
            case "GetWeb":
                utils.addToPayload(opt, SOAPEnvelope, [
                    ["webUrl", "webURL"]
                ]);
                break;
            case "GetWebCollection":
                break;
            case "GetAllSubWebCollection":
                break;
            case "UpdateColumns":
                utils.addToPayload(opt, SOAPEnvelope, ["newFields", "updateFields", "deleteFields"]);
                break;
            case "WebsUpdateContentType":
                utils.addToPayload(opt, SOAPEnvelope, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
                break;
            case "WebUrlFromPageUrl":
                utils.addToPayload(opt, SOAPEnvelope, [
                    ["pageUrl", "pageURL"]
                ]);
                break;

            // WORKFLOW OPERATIONS
            case "AlterToDo":
                utils.addToPayload(opt, SOAPEnvelope, ["item", "todoId", "todoListId", "taskData"]);
                break;
            case "ClaimReleaseTask":
                utils.addToPayload(opt, SOAPEnvelope, ["item", "taskId", "listId", "fClaim"]);
                break;
            case "GetTemplatesForItem":
                utils.addToPayload(opt, SOAPEnvelope, ["item"]);
                break;
            case "GetToDosForItem":
                utils.addToPayload(opt, SOAPEnvelope, ["item"]);
                break;
            case "GetWorkflowDataForItem":
                utils.addToPayload(opt, SOAPEnvelope, ["item"]);
                break;
            case "GetWorkflowTaskData":
                utils.addToPayload(opt, SOAPEnvelope, ["item", "listId", "taskId"]);
                break;
            case "StartWorkflow":
                utils.addToPayload(opt, SOAPEnvelope, ["item", "templateId", "workflowParameters"]);
                break;

            default:
                break;
        }

        // Glue together the pieces of the SOAP message
        var msg = SOAPEnvelope.header + SOAPEnvelope.opheader + SOAPEnvelope.payload + SOAPEnvelope.opfooter + SOAPEnvelope.footer;

        // Check to see if we've already cached the results
        var cachedPromise;
        if (opt.cacheXML) {
            cachedPromise = promisesCache[msg];
        }

        // Do we have any customHeaders?
        var headers = opt.customHeaders ? opt.customHeaders : {};

        if (typeof cachedPromise === "undefined") {

            // Finally, make the Ajax call
            var p = $.ajax({
                // The relative URL for the AJAX call
                url: ajaxURL,
                // By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
                async: opt.async,
                // Optionally, pass in headers
                headers: headers,
                // Before sending the msg, need to send the request header
                beforeSend: function (xhr) {
                    // If we need to pass the SOAPAction, do so
                    if (WSops[opt.operation][1]) {
                        xhr.setRequestHeader("SOAPAction", SOAPAction);
                    }
                },
                // Always a POST
                type: "POST",
                // Here is the SOAP request we've built above
                data: msg,
                // We're getting XML; tell jQuery so that it doesn't need to do a best guess
                dataType: "xml",
                // and this is its content type
                contentType: "text/xml;charset='utf-8'",
                complete: function (xData, Status) {
                    // When the call is complete, call the completefunc if there is one
                    if ($.isFunction(opt.completefunc)) {
                        opt.completefunc(xData, Status);

                    }
                }
            });
            if(opt.cacheXML) {
                promisesCache[msg] = p;
            }

            // Return the promise
            return p;

        } else {

            // Call the completefunc if there is one
            if ($.isFunction(opt.completefunc)) {
                cachedPromise.done(function(data, status, jqXHR){
                    opt.completefunc(jqXHR, status);
                });
            }
            // Return the cached promise
            return cachedPromise;
        }

    }; // End $.fn.SPServices
    
    //Main function which calls Nintex's Web Services directly
    $.fn.NintexServices = function (options)
    {
        // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
        var opt = $.extend({}, $.fn.SPServices.defaults, options);

        // Encode options which may contain special character, esp. ampersand
        for (var i = 0; i < encodeOptionList.length; i++) {
            if (typeof opt[encodeOptionList[i]] === "string") {
                opt[encodeOptionList[i]] = utils.encodeXml(opt[encodeOptionList[i]]);
            }
        }//end for
        
        // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
        SOAPEnvelope.opheader = "<" + opt.operation + " ";
        switch (WSops[opt.operation][0]) {
            case webServices.NINTEXWORKFLOW:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMANintex + "'>";
                SOAPAction = constants.SCHEMANintex + "/";
                break;            	
            default:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMANintex + "/soap/'>";
                SOAPAction = constants.SCHEMANintex + "/soap/";
                break;
        }//end switch
        
        // Add the operation to the SOAPAction and opfooter
        SOAPAction += opt.operation;
        SOAPEnvelope.opfooter = "</" + opt.operation + ">";

        // Build the URL for the Ajax call based on which operation we're calling
        // If the webURL has been provided, then use it, else use the current site
        var ajaxURL = "_vti_bin/" + WSops[opt.operation][0] + ".asmx";
        var thisSite = $().SPServices.SPGetCurrentSite();
        var webURL = opt.webURL !== undefined ? opt.webURL : opt.webUrl;
        if (webURL.charAt(webURL.length - 1) === constants.SLASH) {
            ajaxURL = webURL + ajaxURL;
        } else if (webURL.length > 0) {
            ajaxURL = webURL + constants.SLASH + ajaxURL;
        } else {
            ajaxURL = thisSite + ((thisSite.charAt(thisSite.length - 1) === constants.SLASH) ? ajaxURL : (constants.SLASH + ajaxURL));
        }

        SOAPEnvelope.payload = "";
        // Each operation requires a different set of values.  This switch statement sets them up in the SOAPEnvelope.payload.
        switch (opt.operation) {
            //NINTEX WORKFLOW OPERATIONS
            case "AddLongTermDelegationRule":
            	utils.addToPayload(opt,["fromTheBeginningOf","untilTheEndOf","delegateFrom","delegateTo","currentSiteOnly"]);
            	break;
			case "AddWorkflowSchedule":
				utils.addToPayload(opt,["fileUrl","workflowName","startDataXml"]);
				SOAPEnvelope.payload += "<schedule>";
				utils.addToPayload(opt,["MaximumRepeats","WorkdaysOnly"]);
				SOAPEnvelope.payload += "<RepeatInterval>";
				utils.addToPayload(opt,["Type","CountBetweenIntervals"]);
				SOAPEnvelope.payload += "</RepeatInterval>";
				utils.addToPayload(opt,["EndOn","StartTime","EndTime"]);
				SOAPEnvelope.payload += "</schedule>";
				utils.addToPayload(opt,["updateIfExists"]);
				break;
			case "AddWorkflowScheduleOnListItem":
				utils.addToPayload(opt,["itemId","listName","workflowName","startDataXML"]);
				SOAPEnvelope.payload += "<schedule>";
				utils.addToPayload(opt,["MaximumRepeats","WorkdaysOnly"]);
				SOAPEnvelope.payload += "<RepeatInterval>";
				utils.addToPayload(opt,["Type","CountBetweenIntervals"]);
				SOAPEnvelope.payload += "</RepeatInterval>";
				utils.addToPayload(opt,["EndOn","StartTime","EndTime"]);
				SOAPEnvelope.payload += "</schedule>";
				utils.addToPayload(opt,["updateIfExists"]);
				break;		
			case "CheckGlobalReuseStatus":
				utils.addToPayload(opt,["workflowName"]);
				break;		
			case "CheckInForms":
				utils.addToPayload(opt,["workflowConfiguration","activityConfiguration","formType"]);
				break;					
			case "DelegateAllTasks":
				utils.addToPayload(opt,["currentUser","newUser","sendNotification","comments","global"]);
				break;		
			case "DelegateTask":
				utils.addToPayload(opt,["spTaskId","taskListName","targetUserName","comments","sendNotification"]);
				break;						
			case "DeleteLongTermDelegationRule":
				utils.addToPayload(opt,["id"]);
				break;	
			case "DeleteSnippet":
				utils.addToPayload(opt,["snippetId"]);
				break;	
			case "DeleteWorkflow":
				utils.addToPayload(opt,["listId","workflowId","workflowType"]);
				break;	
            case "ExportWorkflow":
            	utils.addToPayload(opt,["listName","workflowType","workflowName"]);
            	break;				
			case "FixWorkflowsInSiteFromTemplate":
				utils.addToPayload(opt,["FixWorkflowsInSiteFromTemplate"]);
				break;	
			case "GetFolders":
				utils.addToPayload(opt,["listGuid"]);
				break;	
			case "GetItemsPendingMyApproval":
				utils.addToPayload(opt,["uniquenessInfo"]);
				break;	
			case "GetListContentTypes":
				utils.addToPayload(opt,["listGuid"]);
				break;	
			case "GetOutcomesForFlexiTask":
				utils.addToPayload(opt,["spTaskId","taskListName"]);
				break;	
			case "GetRunningWorkflowTasks":
				utils.addToPayload(opt,["fileUrl"]);
				break;	
			case "GetRunningWorkflowTasksCollection":
				utils.addToPayload(opt,["userlogin","teamsiteUrl","listName"]);
				break;	
			case "GetRunningWorkflowTasksForCurrentUser":
				utils.addToPayload(opt,["fileUrl"]);
				break;	
			case "GetRunningWorkflowTasksForCurrentUserForListItem":
				utils.addToPayload(opt,["itemId","listName"]);
				break;	
			case "GetRunningWorkflowTasksForListItem":
				utils.addToPayload(opt,["itemId","listName"]);
				break;	
			case "GetTaskDetailsUsingStub":
				utils.addToPayload(opt,["taskToken"]);
				break;	
			case "GetTaskStubsForCurrentUser":
				break;	
			case "GetWorkflowHistory":
				utils.addToPayload(opt,["fileUrl","stateFilter","workflowNameFilter"]);
				break;	
			case "GetWorkflowHistoryForListItem":
				utils.addToPayload(opt,["itemId","listName","stateFilter","workflowNameFilter"]);
				break;	
			case "HideTaskForApprover":
				utils.addToPayload(opt,["approverId","contentDbId"]);
				break;	
			case "HideWorkflow":
				utils.addToPayload(opt,["siteId","instanceId"]);
				break;	
			case "ProcessFlexiTaskResponse":
				utils.addToPayload(opt,["comments","outcome","spTaskId","taskListName"]);
				break;	
			case "ProcessFlexiTaskResponse2":
				utils.addToPayload(opt,["comments","outcome","spTaskId","taskListName"]);
				break;	
			case "ProcessTaskResponse":
				utils.addToPayload(opt,["comments","outcome","spTaskId"]);
				break;
			case "ProcessTaskResponse2":
				utils.addToPayload(opt,["comments","outcome","spTaskId","taskListName"]);
				break;		
			case "ProcessTaskResponse3":
				utils.addToPayload(opt,["comments","outcome","spTaskId","taskListName"]);
				break;								
			case "ProcessTaskResponseUsingToken":
				utils.addToPayload(opt,["comments","outcome","taskToken","customOutcome"]);
				break;	
			case "PublishFromNWF":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishFromNWFNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishFromNWFSkipValidation":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishFromNWFSkipValidationNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishFromNWFXml":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishFromNWFXmlNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;																									
			case "PublishFromNWFXmlSkipValidation":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;		
			case "PublishFromNWFXmlSkipValidationNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName","saveIfCannotPublish"]);
				break;	
			case "PublishWorkflow":
				utils.addToPayload(opt,["wfName","activityConfigs","listId","contentTypeId","changeNotes"]);
				break;	
			case "QueryForMessages":
				utils.addToPayload(opt,["workflowInstanceId","messageId"]);
				break;	
			case "RemoveWorkflowSchedule":
				utils.addToPayload(opt,["fileUrl","workflowName"]);
				break;																									
			case "RemoveWorkflowScheduleOnListItem":
				utils.addToPayload(opt,["itemId","listName","workflowName"]);
				break;		
			case "SaveFromNWF":
				utils.addToPayload(opt,["workflowFile","listName","workflowName"]);
				break;	
			case "SaveFromNWFNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName"]);
				break;	
			case "SaveFromNWFXml":
				utils.addToPayload(opt,["workflowFile","listName","workflowName"]);
				break;	
			case "SaveFromNWFXmlNoOverwrite":
				utils.addToPayload(opt,["workflowFile","listName","workflowName"]);
				break;																									
			case "SaveSnippet":
				utils.addToPayload(opt,["snippetName","activityConfigs"]);
				break;		
			case "SaveTemplate":
				utils.addToPayload(opt,["templateName","templateDescription","category","activityConfigs"]);
				break;	
			case "SaveTemplate2":
				utils.addToPayload(opt,["templateName","templateDescription","category","activityConfigs","lcid"]);
				break;				
			case "SaveWorkflow":
				utils.addToPayload(opt,["wfName","activityConfigs","listId","contentTypeId","changeNotes"]);
				break;	
			case "SnippetExists":
				utils.addToPayload(opt,["snippetName"]);
				break;	
			case "StartSiteWorkflow":
				utils.addToPayload(opt,["workflowName","associationData"]);
				break;																									
			case "StartWorkflow":
				utils.addToPayload(opt,["fileUrl","workflowName","associationData"]);
				break;																						
			case "StartWorkflowOnListItem":
				utils.addToPayload(opt,["itemId","listName","workflowName","associationData"]);
				break;	
			case "TemplateExists":
				utils.addToPayload(opt,["templateName"]);
				break;																									
			case "TerminateWorkflow":
				utils.addToPayload(opt,["listId","itemId","instanceId"]);
				break;																						
			case "TerminateWorkflowByName":
				utils.addToPayload(opt,["fileUrl","workflowName","terminatePreviousInstances"]);
				break;	
			case "TerminateWorkflowByNameForListItem":
				utils.addToPayload(opt,["listName","itemId","workflowName","terminatePreviousInstances"]);
				break;																									
			case "WorkflowExists":
				utils.addToPayload(opt,["workflowName","listId","workflowType"]);
				break;																						
			case "WorkflowFormProductSelected":
				utils.addToPayload(opt,["workflowConfiguration","activityConfiguration","product","formType"]);
				break;																									
            default:
                break;
        }//end switch

        // Glue together the pieces of the SOAP message
        var msg = SOAPEnvelope.header + SOAPEnvelope.opheader + SOAPEnvelope.payload + SOAPEnvelope.opfooter + SOAPEnvelope.footer;

        // Check to see if we've already cached the results
        var cachedPromise;
        if (opt.cacheXML) {
            cachedPromise = promisesCache[msg];
        }

        if (typeof cachedPromise === "undefined") {

            // Finally, make the Ajax call
            var p = $.ajax({
                // The relative URL for the AJAX call
                url: ajaxURL,
                // By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
                async: opt.async,
                // Before sending the msg, need to send the request header
                beforeSend: function (xhr) {
                    // If we need to pass the SOAPAction, do so
                    if (WSops[opt.operation][1]) {
                        xhr.setRequestHeader("SOAPAction", SOAPAction);
                    }
                },
                // Always a POST
                type: "POST",
                // Here is the SOAP request we've built above
                data: msg,
                // We're getting XML; tell jQuery so that it doesn't need to do a best guess
                dataType: "xml",
                // and this is its content type
                contentType: "text/xml;charset='utf-8'",
                complete: function (xData, Status) {
                    // When the call is complete, call the completefunc if there is one
                    if ($.isFunction(opt.completefunc)) {
                        opt.completefunc(xData, Status);

                    }
                }
            });
            if(opt.cacheXML) {
                promisesCache[msg] = p;
            }

            // Return the promise
            return p;

        } else {

            // Call the completefunc if there is one
            if ($.isFunction(opt.completefunc)) {
                cachedPromise.done(function(data, status, jqXHR){
                    opt.completefunc(jqXHR, status);
                });

            }
            // Return the cached promise
            return cachedPromise;
        }        
    };//end NintexServices
    

    // Defaults added as a function in our library means that the caller can override the defaults
    // for their session by calling this function.  Each operation requires a different set of options;
    // we allow for all in a standardized way.
    $.fn.SPServices.defaults = {

        cacheXML: false, // If true, we'll cache the XML results with jQuery's .data() function
        operation: "", // The Web Service operation
        webURL: "", // URL of the target Web
        customHeaders: {},
        makeViewDefault: false, // true to make the view the default view for the list

        // For operations requiring CAML, these options will override any abstractions
        viewName: "", // View name in CAML format.
        CAMLQuery: "", // Query in CAML format
        CAMLViewFields: "", // View fields in CAML format
        CAMLRowLimit: 0, // Row limit as a string representation of an integer
        CAMLQueryOptions: "<QueryOptions></QueryOptions>", // Query options in CAML format

        // Abstractions for CAML syntax
        batchCmd: "Update", // Method Cmd for UpdateListItems
        valuepairs: [], // Fieldname / Fieldvalue pairs for UpdateListItems

        // As of v0.7.1, removed all options which were assigned an empty string ("")
        DestinationUrls: [], // Array of destination URLs for copy operations
        behavior: "Version3", // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
        storage: "Shared", // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
        objectType: "List", // objectType for operations which require it
        cancelMeeting: true, // true to delete a meeting;false to remove its association with a Meeting Workspace site
        nonGregorian: false, // true if the calendar is set to a format other than Gregorian;otherwise, false.
        fClaim: false, // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
        recurrenceId: 0, // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
        sequence: 0, // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
        maximumItemsToReturn: 0, // SocialDataService maximumItemsToReturn
        startIndex: 0, // SocialDataService startIndex
        isHighPriority: false, // SocialDataService isHighPriority
        isPrivate: false, // SocialDataService isPrivate
        rating: 1, // SocialDataService rating
        maxResults: 10, // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
        principalType: "User", // Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

        async: true, // Allow the user to force async
        completefunc: null // Function to call on completion

    }; // End $.fn.SPServices.defaults

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
/**
 * General purpose utilities
 *
 * @namespace spservices.utils
 */
define([
    "jquery",
    '../utils/constants'
], function(
    $,
    constants
){
    "use strict";

    var utils = /** @lends spservices.utils */{

        // Get the current context (as much as we can) on startup
        // See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
        SPServicesContext: function(options) {

            var opt = $.extend({}, {
                listName: "", // The list the form is working with. This is useful if the form is not in the list context.
                thisUserId: "" // The current user's id in the site Collection.
            }, options);

            // The SharePoint variables only give us a relative path. to match the result from WebUrlFromPageUrl, we need to add the protocol, host, and (if present) port.
            var siteRoot = location.protocol + "//" + location.host; // + (location.port !== "" ? location.port : "");

            var thisContext = {};
            // SharePoint 2010+ gives us a context variable
            if (typeof _spPageContextInfo !== "undefined") {
                thisContext.thisSite = siteRoot + _spPageContextInfo.webServerRelativeUrl;
                thisContext.thisList = opt.listName ? opt.listName : _spPageContextInfo.pageListId;
                thisContext.thisUserId = opt.thisUserId ? opt.thisUserId : _spPageContextInfo.userId;
                // In SharePoint 2007, we know the UserID only
            } else {
                thisContext.thisSite = (typeof L_Menu_BaseUrl !== "undefined") ? siteRoot + L_Menu_BaseUrl : "";
                thisContext.thisList = opt.listName ? opt.listName : "";
                thisContext.thisUserId = opt.thisUserId ? opt.thisUserId : ((typeof _spUserId !== "undefined") ? _spUserId : undefined);
            }

            return thisContext;

        }, // End of function SPServicesContext

        // Global variables
//        currentContext: new this.SPServicesContext(), // Variable to hold the current context as we figure it out

        /**
         * Wrap an XML node (n) around a value (v)
         *
         */
        wrapNode: function(n, v) {
            var thisValue = typeof v !== "undefined" ? v : "";
            return "<" + n + ">" + thisValue + "</" + n + ">";
        },

        /**
         * Generate a random number for sorting arrays randomly
         */
        randOrd: function() {
            return (Math.round(Math.random()) - 0.5);
        },

        /**
         * If a string is a URL, format it as a link, else return the string as-is
         */
        checkLink: function(s) {
            return ((s.indexOf("http") === 0) || (s.indexOf("/") === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
        },

        /**
         * Get the filename from the full URL
         */
        fileName: function (s) {
            return s.substring(s.lastIndexOf("/") + 1, s.length);
        },

        /**
         * A map of special characters to XML escaped characters.
         * Taken from {@link http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/}
         *
         * @type {Object}
         */
        xml_special_to_escaped_one_map: {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        },

        // Paul T., 2015.05.01: Commented out since its not currently used.
        // var escaped_one_to_xml_special_map = {
        // '&amp;': '&',
        // '&quot;': '"',
        // '&lt;': '<',
        // '&gt;': '>'
        // };

        /**
         * Encode XML characters in a string
         *
         * @param {String} string
         */
        encodeXml: function(string) {
            return string.replace(/([\&"<>])/g, function (str, item) {
                return this.xml_special_to_escaped_one_map[item];
            });
        },

        // Paul T., 2015-05-02: Commented out since its not currently used.
        // function decodeXml(string) {
        // return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
        // function (str, item) {
        // return escaped_one_to_xml_special_map[item];
        // });
        // }

        /* Taken from http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ */

        /**
         * Escape column values
         */
        escapeColumnValue: function(s) {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            } else {
                return s;
            }
        },

        /**
         * Escape Url
         */
        escapeUrl: function (u) {
            return u.replace(/&/g, '%26');
        },

        /**
         * Split values like 1;#value into id and value
         * @type Class
         */
        SplitIndex: function(s) {
            var spl = s.split(constants.spDelim);
            this.id = spl[0];
            this.value = spl[1];
        },

        /**
         * Pad single digits with a zero
         *
         * @param {Number} n
         */
        pad: function (n) {
            return n < 10 ? "0" + n : n;
        },
// TODO
        // James Padolsey's Regex Selector for jQuery http://james.padolsey.com/javascript/regex-selector-for-jquery/
        /*    $.expr[':'].regex = function (elem, index, match) {
         var matchParams = match[3].split(','),
         validLabels = /^(data|css):/,
         attr = {
         method: matchParams[0].match(validLabels) ?
         matchParams[0].split(':')[0] : 'attr',
         property: matchParams.shift().replace(validLabels, '')
         },
         regexFlags = 'ig',
         regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
         return regex.test($(elem)[attr.method](attr.property));
         };
         */

        /**
         * Build an error message based on passed parameters
         */
        errBox: function(func, param, msg) {
            var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
                "<b>Parameter</b><br/>" + param + "<br/>" +
                "<b>Message</b><br/>" + msg + "<br/><br/>" +
                "<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
            modalBox(errMsg);
        }, // End of function errBox


        // Finds the td which contains a form field in default forms using the comment which contains:
        //  <!--  FieldName="Title"
        //      FieldInternalName="Title"
        //      FieldType="SPFieldText"
        //  -->
        // as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
        findFormField: function(v) {
            var $formBody = $("td.ms-formbody, td.ms-formbodysurvey"),
                // Borrowed from MDN.
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
                escapeRegExp = function (v){
                    return v.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                },
                columnName = escapeRegExp(v),
                rcommentValidation = new RegExp("(?:Field|FieldInternal)Name=\"" + columnName + "\"", "i"),
                $columnNode = $formBody.contents().filter(function () {
                    return this.nodeType === 8 && rcommentValidation.test(this.nodeValue);
                })

            ;

            return $columnNode.parent("td");
        }, // End of function findFormField

        // Show a single attribute of a node, enclosed in a table
        //   node               The XML node
        //   opt                The current set of options
        showAttrs: function(node) {
            var i;
            var out = "<table class='ms-vb' width='100%'>";
            for (i = 0; i < node.attributes.length; i++) {
                out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
                    node.attributes.item(i).nodeName + "</td><td>" + utils.checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
            }
            out += "</table>";
            return out;
        }, // End of function showAttrs

        // Add the option values to the SPServices.SOAPEnvelope.payload for the operation
        //  opt = options for the call
        //  SOAPEnvelope = envelope to add to
        //  paramArray = an array of option names to add to the payload
        //      "paramName" if the parameter name and the option name match
        //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
        //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
        addToPayload: function(opt, SOAPEnvelope, paramArray) {

            var i;

            for (i = 0; i < paramArray.length; i++) {
                // the parameter name and the option name match
                if (typeof paramArray[i] === "string") {
                    SOAPEnvelope.payload += utils.wrapNode(paramArray[i], opt[paramArray[i]]);
                    // the parameter name and the option name are different
                } else if ($.isArray(paramArray[i]) && paramArray[i].length === 2) {
                    SOAPEnvelope.payload += utils.wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
                    // the element not a string or an array and is marked as "add to payload only if non-null"
                } else if ((typeof paramArray[i] === "object") && (paramArray[i].sendNull !== undefined)) {
                    SOAPEnvelope.payload += ((opt[paramArray[i].name] === undefined) || (opt[paramArray[i].name].length === 0)) ? "" : utils.wrapNode(paramArray[i].name, opt[paramArray[i].name]);
                    // something isn't right, so report it
                } else {
                    utils.errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
                }
            }
        }, // End of function addToPayload


        // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
        // the SiteData prefix on their names. This function replaces that name with the right name in the SPServices.SOAPEnvelope.
        siteDataFixSOAPEnvelope: function(SOAPEnvelope, siteDataOperation) {
            var siteDataOp = siteDataOperation.substring(8);
            SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
            SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
            return SOAPEnvelope;
        }, // End of function siteDataFixSOAPEnvelope


        /**
         * Get the URL for a specified form for a list
         *
         * @param {Object} l
         * @param {Object} f
         */
        getListFormUrl: function(l, f) {

            var u;
            $().SPServices({
                operation: "GetFormCollection",
                async: false,
                listName: l,
                completefunc: function (xData) {
                    u = $(xData.responseXML).find("Form[Type='" + f + "']").attr("Url");
                }
            });
            return u;

        }, // End of function getListFormUrl

        /**
         * Returns the selected value(s) for a dropdown in an array. Expects a dropdown
         * object as returned by the DropdownCtl function.
         * If matchOnId is true, returns the ids rather than the text values for the
         * selection options(s).
         *
         * @param {Object} columnSelect
         * @param {Object} matchOnId
         */
        getDropdownSelected: function (columnSelect, matchOnId) {

            var columnSelectSelected = [];

            switch (columnSelect.Type) {
                case constants.dropdownType.simple:
                    if (matchOnId) {
                        columnSelectSelected.push(columnSelect.Obj.find("option:selected").val() || []);
                    } else {
                        columnSelectSelected.push(columnSelect.Obj.find("option:selected").text() || []);
                    }
                    break;
                case constants.dropdownType.complex:
                    if (matchOnId) {
                        columnSelectSelected.push(columnSelect.optHid.val() || []);
                    } else {
                        columnSelectSelected.push(columnSelect.Obj.val() || []);
                    }
                    break;
                case constants.dropdownType.multiSelect:
                    $(columnSelect.master.resultControl).find("option").each(function () {
                        if (matchOnId) {
                            columnSelectSelected.push($(this).val());
                        } else {
                            columnSelectSelected.push($(this).html());
                        }
                    });
                    break;
                default:
                    break;
            }
            return columnSelectSelected;

        }, // End of function getDropdownSelected


        /**
         * Generate a unique id for a containing div using the function name and the column display name.
         *
         * @param {Object} funcname
         * @param {Object} columnName
         * @param {Object} listName
         */
        genContainerId: function(funcname, columnName, listName) {
            var l = listName !== undefined ? listName : $().SPServices.SPListNameFromUrl();
            return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
                    listName: l,
                    columnDisplayName: columnName
                });
        } // End of function genContainerId

    }, //end: utils

    //-----------[ PRIVATE METHODS BELOW ]---------------------
    // These should all be defined against a local variable so
    // that we get smaller minified files

    /**
     * Call this function to pop up a branded modal msgBox
     * @private
     */
    modalBox = function(msg) {
        var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
        $("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
        var msgBoxObj = $("#SPServices_msgBox");
        var height = msgBoxObj.height();
        var width = msgBoxObj.width();
        var leftVal = ($(window).width() / 2) - (width / 2) + "px";
        var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
        msgBoxObj.css({
            border: '5px #C02000 solid',
            left: leftVal,
            top: topVal
        }).show().fadeTo("slow", 0.75).click(function () {
            $(this).fadeOut("3000", function () {
                $(this).remove();
            });
        });
    }; // End of function modalBox;


    return utils;

});


/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
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

    // Return the current version of SPServices as a string
    $.fn.SPServices.Version = function () {

        return constants.VERSION;

    }; // End $.fn.SPServices.Version

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([], function () {

    "use strict";

    /**
     * Maintains a set of constants for SPServices.
     *
     * @namespace constants
     */

    var constants = {

        // Version info
        VERSION: "@VERSION", // update it in package.json... build takes care of the rest

        // Simple strings
        spDelim: ";#",
        SLASH: "/",
        TXTColumnNotFound: "Column not found on page",

        // String constants
        //   General
        SCHEMASharePoint: "http://schemas.microsoft.com/sharepoint",
        SCHEMANintex: "http://nintex.com",
        multiLookupPrefix: "MultiLookupPicker",
        multiLookupPrefix2013: "MultiLookup",

        // Dropdown Types
        dropdownType: {
            simple: "S",
            complex: "C",
            multiSelect: "M"
        },

        // Known list field types - See: http://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.spfieldtype(v=office.15).aspx
        spListFieldTypes: [
            "Integer",
            "Text",
            "Note",
            "DateTime",
            "Counter",
            "Choice",
            "Lookup",
            "Boolean",
            "Number",
            "Currency",
            "URL",
//        "Computed", // NEW
//        "Threading", // NEW
//        "Guid", // NEW
            "MultiChoice",
//        "GridChoice", // NEW
            "Calculated",
            "File",
            "Attachments",
            "User",
            "Recurrence", // Recurring event indicator (boolean) [0 | 1]
//        "CrossProjectLink", // NEW
            "ModStat",
            "ContentTypeId",
//        "PageSeparator", // NEW
//        "ThreadIndex", // NEW
            "WorkflowStatus", // NEW
            "AllDayEvent", // All day event indicator (boolean) [0 | 1]
//      "WorkflowEventType", // NEW
//        "Geolocation", // NEW
//        "OutcomeChoice", // NEW
            "RelatedItems", // Related Items in a Workflow Tasks list

            // Also seen
            "UserMulti", // Multiselect users
            "LookupMulti", // Multi-select lookup
            "datetime", // Calculated date/time result
            "float", // Calculated float
            "Calc" // General calculated
        ]

    };

    return constants;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items
    $.fn.SPServices.SPConvertDateToISO = function (options) {

        var opt = $.extend({}, {
            dateToConvert: new Date(), // The JavaScript date we'd like to convert. If no date is passed, the function returns the current date/time
            dateOffset: "-05:00" // The time zone offset requested. Default is EST
        }, options);

        //Generate ISO 8601 date/time formatted string
        var s = "";
        var d = opt.dateToConvert;
        s += d.getFullYear() + "-";
        s += utils.pad(d.getMonth() + 1) + "-";
        s += utils.pad(d.getDate());
        s += "T" + utils.pad(d.getHours()) + ":";
        s += utils.pad(d.getMinutes()) + ":";
        s += utils.pad(d.getSeconds()) + "Z" + opt.dateOffset;
        //Return the ISO8601 date string
        return s;

    }; // End $.fn.SPServices.SPConvertDateToISO

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
   //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core.js'
], function (
    $,
    utils
) {

    "use strict";

    // Utility function to show the results of a Web Service call formatted well in the browser.
    $.fn.SPServices.SPDebugXMLHttpResult = function (options) {

        var opt = $.extend({}, {
            node: null, // An XMLHttpResult object from an ajax call
            indent: 0 // Number of indents
        }, options);

        var i;
        var NODE_TEXT = 3;
        var NODE_CDATA_SECTION = 4;

        var outString = "";
        // For each new subnode, begin rendering a new TABLE
        outString += "<table class='ms-vb' style='margin-left:" + opt.indent * 3 + "px;' width='100%'>";
        // DisplayPatterns are a bit unique, so let's handle them differently
        if (opt.node.nodeName === "DisplayPattern") {
            outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
                "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.xml + "</textarea></td></tr>";
            // A node which has no children
        } else if (!opt.node.hasChildNodes()) {
            outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
                "</td><td>" + ((opt.node.nodeValue !== null) ? utils.checkLink(opt.node.nodeValue) : "&nbsp;") + "</td></tr>";
            if (opt.node.attributes) {
                outString += "<tr><td colspan='99'>" + utils.showAttrs(opt.node) + "</td></tr>";
            }
            // A CDATA_SECTION node
        } else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_CDATA_SECTION) {
            outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
                "</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.parentNode.text + "</textarea></td></tr>";
            // A TEXT node
        } else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_TEXT) {
            outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
                "</td><td>" + utils.checkLink(opt.node.firstChild.nodeValue) + "</td></tr>";
            // Handle child nodes
        } else {
            outString += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + opt.node.nodeName + "</td></tr>";
            if (opt.node.attributes) {
                outString += "<tr><td colspan='99'>" + utils.showAttrs(opt.node) + "</td></tr>";
            }
            // Since the node has child nodes, recurse
            outString += "<tr><td>";
            for (i = 0; i < opt.node.childNodes.length; i++) {
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

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
    "../utils/constants",
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils,
    constants
) {

    "use strict";

    // Find a dropdown (or multi-select) in the DOM. Returns the dropdown object and its type:
    // S = Simple (select)
    // C = Compound (input + select hybrid)
    // M = Multi-select (select hybrid)
    $.fn.SPServices.SPDropdownCtl = function (options) {

        var opt = $.extend({}, {
            displayName: "" // The displayName of the column on the form
        }, options);

        var columnObj = {};

// Paul T., 2015.05.02: Commented out since is not currently used
        // var colStaticName = $().SPServices.SPGetStaticFromDisplay({
        // listName: $().SPServices.SPListNameFromUrl(),
        // columnDisplayName: opt.displayName
        // });

        // Simple, where the select's title attribute is colName (DisplayName)
        //  Examples:
        //      SP2013 <select title="Country" id="Country_d578ed64-2fa7-4c1e-8b41-9cc1d524fc28_$LookupField">
        //      SP2010: <SELECT name=ctl00$m$g_d10479d7_6965_4da0_b162_510bbbc58a7f$ctl00$ctl05$ctl01$ctl00$ctl00$ctl04$ctl00$Lookup title=Country id=ctl00_m_g_d10479d7_6965_4da0_b162_510bbbc58a7f_ctl00_ctl05_ctl01_ctl00_ctl00_ctl04_ctl00_Lookup>
        //      SP2007: <select name="ctl00$m$g_e845e690_00da_428f_afbd_fbe804787763$ctl00$ctl04$ctl04$ctl00$ctl00$ctl04$ctl00$Lookup" Title="Country" id="ctl00_m_g_e845e690_00da_428f_afbd_fbe804787763_ctl00_ctl04_ctl04_ctl00_ctl00_ctl04_ctl00_Lookup">
        if ((columnObj.Obj = $("select[Title='" + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.simple;
            // Compound
        } else if ((columnObj.Obj = $("input[Title='" + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.complex;
            // Simple, where the select's id begins with colStaticName (StaticName) - needed for required columns where title="DisplayName Required Field"
            //   Example: SP2013 <select title="Region Required Field" id="Region_59566f6f-1c3b-4efb-9b7b-6dbc35fe3b0a_$LookupField" showrelatedselected="3">
//        } else if ((columnObj.Obj = $("select:regex(id, (" + colStaticName + ")(_)[0-9a-fA-F]{8}(-))")).length === 1) {
//            columnObj.Type = constants.dropdownType.simple;
            // Multi-select: This will find the multi-select column control in English and most other language sites where the Title looks like 'Column Name possible values'
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title^='" + opt.displayName + " ']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like '????????? ????????: Column Name'
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$=': " + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a German site (and perhaps others)
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$='\"" + opt.displayName + "\".']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
            // Multi-select: This will find the multi-select column control on a Italian site (and perhaps others) where the Title looks like "Valori possibili Column name"
        } else if ((columnObj.Obj = $("select[ID$='SelectCandidate'][Title$=' " + opt.displayName + "']")).length === 1) {
            columnObj.Type = constants.dropdownType.multiSelect;
        } else {
            columnObj.Type = null;
        }

        // Last ditch effort
        // Simple, finding based on the comment text at the top of the td.ms-formbody where the select's title begins with DisplayName - needed for required columns where title="DisplayName Required Field"
        //   Examples: SP2010 <select name="ctl00$m$g_308135f8_3f59_4d67_b5f8_c26776c498b7$ff51$ctl00$Lookup" id="ctl00_m_g_308135f8_3f59_4d67_b5f8_c26776c498b7_ff51_ctl00_Lookup" title="Region Required Field">
        //            SP2013 <select id="Soort_x0020_medicijn_ded19932-0b4f-4d71-bc3b-2d510e5f297a_$LookupField" title="Soort medicijn Vereist veld">
        if (columnObj.Type === null) {
            var fieldContainer = utils.findFormField(opt.displayName);
            if (fieldContainer !== undefined) {
                var fieldSelect1 = fieldContainer.find("select[title^='" + opt.displayName + " '][id$='_Lookup']");
                var fieldSelect2 = fieldContainer.find("select[title^='" + opt.displayName + " '][id$='LookupField']");
                var fieldSelect = fieldSelect1.length > 0 ? fieldSelect1 : fieldSelect2;

                if (fieldSelect && fieldSelect.length === 1) {
                    columnObj.Type = constants.dropdownType.simple;
                    columnObj.Obj = fieldSelect;
                }
            }
        }

        if (columnObj.Type === constants.dropdownType.complex) {
            columnObj.optHid = $("input[id='" + columnObj.Obj.attr("optHid") + "']");
        } else if (columnObj.Type === constants.dropdownType.multiSelect) {
            // Find the important bits of the multiselect control
            columnObj.container = columnObj.Obj.closest("span");
            columnObj.MultiLookupPickerdata = columnObj.container.find("input[id$='" + utils.multiLookupPrefix + "_data'], input[id$='" + utils.multiLookupPrefix2013 + "_data']");
            var addButtonId = columnObj.container.find("[id$='AddButton']").attr("id");
            columnObj.master =
                window[addButtonId.replace(/AddButton/, constants.multiLookupPrefix + "_m")] || // SharePoint 2007
                window[addButtonId.replace(/AddButton/, constants.multiLookupPrefix2013 + "_m")]; // SharePoint 2013
        }

        return columnObj;

    }; // End of function $.fn.SPServices.SPDropdownCtl

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery'
], function (
    $
) {
    "use strict";

    // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
    // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
    // for performance details.
    $.fn.SPFilterNode = function (name) {
        return this.find('*').filter(function () {
            return this.nodeName === name;
        });
    }; // End $.fn.SPFilterNode

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    var SPServices = window.SPServices || {};

    // Function to determine the current Web's URL.  We need this for successful Ajax calls.
    // The function is also available as a public function.
    $.fn.SPServices.SPGetCurrentSite = function () {

        var currentContext = utils.SPServicesContext();

        // We've already determined the current site...
        if (currentContext.thisSite.length > 0) {
            return currentContext.thisSite;
        }

        // If we still don't know the current site, we call WebUrlFromPageUrlResult.
        var msg = SPServices.SOAPEnvelope.header +
            "<WebUrlFromPageUrl xmlns='" + constants.SCHEMASharePoint + "/soap/' ><pageUrl>" +
            ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
            "</pageUrl></WebUrlFromPageUrl>" +
            SPServices.SOAPEnvelope.footer;
        $.ajax({
            async: false, // Need this to be synchronous so we're assured of a valid value
            url: "/_vti_bin/Webs.asmx",
            type: "POST",
            data: msg,
            dataType: "xml",
            contentType: "text/xml;charset=\"utf-8\"",
            complete: function (xData) {
                currentContext.thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
            }
        });

        return currentContext.thisSite; // Return the URL

    }; // End $.fn.SPServices.SPGetCurrentSite


    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Function which returns the account name for the current user in DOMAIN\username format
    $.fn.SPServices.SPGetCurrentUser = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Site Collection.  If not specified, the current Web is used.
            fieldName: "Name", // Specifies which field to return from the userdisp.aspx page
            fieldNames: {}, // Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
            debug: false // If true, show error messages; if false, run silent
        }, options);

        var currentContext = utils.SPServicesContext();

        // The current user's ID is reliably available in an existing JavaScript variable
        if (opt.fieldName === "ID" && typeof currentContext.thisUserId !== "undefined") {
            return currentContext.thisUserId;
        }

        var thisField = "";
        var theseFields = {};
        var fieldCount = opt.fieldNames.length > 0 ? opt.fieldNames.length : 1;
        var thisUserDisp;
        var thisWeb = opt.webURL.length > 0 ? opt.webURL : $().SPServices.SPGetCurrentSite();

        // Get the UserDisp.aspx page using AJAX
        $.ajax({
            // Need this to be synchronous so we're assured of a valid value
            async: false,
            // Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
            // Adding the extra Query String parameter with the current date/time forces the server to view this as a new request.
            url: ((thisWeb === "/") ? "" : thisWeb) + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
            complete: function (xData) {
                thisUserDisp = xData;
            }
        });

        for (var i = 0; i < fieldCount; i++) {

            // The current user's ID is reliably available in an existing JavaScript variable
            if (opt.fieldNames[i] === "ID") {
                thisField = currentContext.thisUserId;
            } else {
                var thisTextValue;
                if (fieldCount > 1) {
                    thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldNames[i] + "\"", "gi");
                } else {
                    thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
                }
                $(thisUserDisp.responseText).find("table.ms-formtable td[id^='SPField']").each(function () {
                    if (thisTextValue.test($(this).html())) {
                        // Each fieldtype contains a different data type, as indicated by the id
                        switch ($(this).attr("id")) {
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
            if (opt.fieldNames[i] !== "ID") {
                thisField = (typeof thisField !== "undefined") ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
            }
            if (fieldCount > 1) {
                theseFields[opt.fieldNames[i]] = thisField;
            }
        }

        return (fieldCount > 1) ? theseFields : thisField;

    }; // End $.fn.SPServices.SPGetCurrentUser

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
   //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $
) {

    "use strict";

    // This function returns the DisplayName for a column based on the StaticName.
    $.fn.SPServices.SPGetDisplayFromStatic = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The name or GUID of the list
            columnStaticName: "", // StaticName of the column
            columnStaticNames: {} // StaticName of the columns - added in v0.7.2 to allow multiple columns
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
            completefunc: function (xData) {
                if (nameCount > 1) {
                    for (var i = 0; i < nameCount; i++) {
                        displayNames[opt.columnStaticNames[i]] = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticNames[i] + "']").attr("DisplayName");
                    }
                } else {
                    displayName = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticName + "']").attr("DisplayName");
                }
            }
        });

        return (nameCount > 1) ? displayNames : displayName;

    }; // End $.fn.SPServices.SPGetDisplayFromStatic

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',

    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $
) {

    "use strict";

    // Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
    // between list forms
    $.fn.SPServices.SPGetLastItemId = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The name or GUID of the list
            userAccount: "", // The account for the user in DOMAIN\username format. If not specified, the current user is used.
            CAMLQuery: "" // [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
        }, options);

        var userId;
        var lastId = 0;
        $().SPServices({
            operation: "GetUserInfo",
            webURL: opt.webURL,
            async: false,
            userLoginName: (opt.userAccount !== "") ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
            completefunc: function (xData) {
                $(xData.responseXML).find("User").each(function () {
                    userId = $(this).attr("ID");
                });
            }
        });

        // Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
        // the existing Where clause
        var camlQuery = "<Query><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += "<And>";
        }
        camlQuery += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq>";
        if (opt.CAMLQuery.length > 0) {
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
            completefunc: function (xData) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    lastId = $(this).attr("ows_ID");
                });
            }
        });
        return lastId;
    }; // End $.fn.SPServices.SPGetLastItemId

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
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
    $.fn.SPServices.SPGetListItemsJson = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
            listName: "",
            viewName: "",
            CAMLQuery: "",
            CAMLViewFields: "",
            CAMLRowLimit: "",
            CAMLQueryOptions: "",
            changeToken: "", // [Optional] If provided, will be passed with the request
            contains: "", // CAML snippet for an additional filter
            mapping: null, // If provided, use this mapping rather than creating one automagically from the list schema
            mappingOverrides: null, // Pass in specific column overrides here
            debug: false // If true, show error messages;if false, run silent
        }, $().SPServices.defaults, options);

        var newChangeToken;
        var thisListJsonMapping = {};
        var deletedIds = [];
        var result = $.Deferred();

        // Call GetListItems to find all of the items matching the CAMLQuery
        var thisData = $().SPServices({
            operation: "GetListItemChangesSinceToken",
            webURL: opt.webURL,
            listName: opt.listName,
            viewName: opt.viewName,
            CAMLQuery: opt.CAMLQuery,
            CAMLViewFields: opt.CAMLViewFields,
            CAMLRowLimit: opt.CAMLRowLimit,
            CAMLQueryOptions: opt.CAMLQueryOptions,
            changeToken: opt.changeToken,
            contains: opt.contains
        });

        thisData.then(function () {

            var mappingKey = "SPGetListItemsJson" + opt.webURL + opt.listName;

            // We're going to use this multiple times
            var responseXml = $(thisData.responseXML);

            // Get the changeToken
            newChangeToken = responseXml.find("Changes").attr("LastChangeToken");

            // Some of the existing items may have been deleted
            responseXml.find("listitems Changes Id[ChangeType='Delete']").each(function () {
                deletedIds.push($(this).text());
            });

            if (opt.mapping === null) {
                // Automagically create the mapping
                responseXml.find("List > Fields > Field").each(function () {
                    var thisField = $(this);
                    var thisType = thisField.attr("Type");
                    // Only work with known column types
                    if ($.inArray(thisType, constants.spListFieldTypes) >= 0) {
                        thisListJsonMapping["ows_" + thisField.attr("Name")] = {
                            mappedName: thisField.attr("Name"),
                            objectType: thisField.attr("Type")
                        };
                    }

                });

            } else {
                thisListJsonMapping = opt.mapping;
            }

            // Implement any mappingOverrides
            // Example: { ows_JSONTextColumn: { mappedName: "JTC", objectType: "JSON" } }
            if (opt.mappingOverrides !== null) {
                // For each mappingOverride, override the list schema
                for (var mapping in opt.mappingOverrides) {
                    thisListJsonMapping[mapping] = opt.mappingOverrides[mapping];
                }
            }

            // If we haven't retrieved the list schema in this call, try to grab it from the saved data from a prior call
            if ($.isEmptyObject(thisListJsonMapping)) {
                thisListJsonMapping = $(document).data(mappingKey);
            } else {
                $(document).data(mappingKey, thisListJsonMapping);
            }

            var jsonData = responseXml.SPFilterNode("z:row").SPXmlToJson({
                mapping: thisListJsonMapping,
                sparse: true
            });

            var thisResult = {
                changeToken: newChangeToken,
                mapping: thisListJsonMapping,
                data: jsonData,
                deletedIds: deletedIds
            };

            result.resolveWith(thisResult);

        },
        function (err) { 
            result.rejectWith(err);
        });

        return result.promise();

    }; // End $.fn.SPServices.SPGetListItemsJson

    return $;

});

/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery'
], function (
    $
) {

    "use strict";

    // Get the Query String parameters and their values and return in an array
    // Includes code from http://www.developerdrive.com/2013/08/turning-the-querystring-into-a-json-object-using-javascript/
    // Simplified in 2014.01 using this code
    $.fn.SPServices.SPGetQueryString = function (options) {

        var opt = $.extend({}, {
            lowercase: false // If true, parameter names will be converted to lowercase
        }, options);

        var queryStringVals = {};

        var qs = location.search.slice(1).split('&');

        for (var i = 0; i < qs.length; i++) {
            var param = qs[i].split('=');
            var paramName = opt.lowercase ? param[0].toLowerCase() : param[0];
            queryStringVals[paramName] = decodeURIComponent(param[1] || "");
        }

        return queryStringVals;

    }; // End $.fn.SPServices.SPGetQueryString

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
   //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $
) {

    "use strict";

    // This function returns the StaticName for a column based on the DisplayName.
    $.fn.SPServices.SPGetStaticFromDisplay = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The name or GUID of the list
            columnDisplayName: "", // DisplayName of the column
            columnDisplayNames: {} // DisplayNames of the columns - added in v0.7.2 to allow multiple columns
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
            completefunc: function (xData) {
                if (nameCount > 1) {
                    for (var i = 0; i < nameCount; i++) {
                        staticNames[opt.columnDisplayNames[i]] = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayNames[i] + "']").attr("StaticName");
                    }
                } else {
                    staticName = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayName + "']").attr("StaticName");
                }
            }
        });

        return (nameCount > 1) ? staticNames : staticName;

    }; // End $.fn.SPServices.SPGetStaticFromDisplay

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    $.fn.SPServices.SPListNameFromUrl = function (options) {

        var opt = $.extend({}, {
            listName: "" // [Optional] Pass in the name or GUID of a list if you are not in its context. e.g., on a Web Part pages in the Pages library
        }, options);

        var currentContext = utils.SPServicesContext();

        // Has the list name or GUID been passed in?
        if (opt.listName.length > 0) {
// TODO            currentContext({ listName: opt.listName });
            return opt.listName;
            // Do we already know the current list?
        } else if (currentContext.thisList !== undefined && currentContext.thisList.length > 0) {
            return currentContext.thisList;
        }

        // Parse out the list's root URL from the current location or the passed url
        var thisPage = location.href;
        var thisPageBaseName = thisPage.substring(0, thisPage.indexOf(".aspx"));
        var listPath = decodeURIComponent(thisPageBaseName.substring(0, thisPageBaseName.lastIndexOf(constants.SLASH) + 1)).toUpperCase();

        // Call GetListCollection and loop through the results to find a match with the list's URL to get the list's GUID
        $().SPServices({
            operation: "GetListCollection",
            async: false,
            completefunc: function (xData) {
                $(xData.responseXML).find("List").each(function () {
                    var defaultViewUrl = $(this).attr("DefaultViewUrl");
                    var listCollList = defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(constants.SLASH) + 1).toUpperCase();
                    if (listPath.indexOf(listCollList) > 0) {
                        currentContext.thisList = $(this).attr("ID");
                        return false;
                    }
                });
            }
        });

        // Return the list GUID (ID)
        return currentContext.thisList;

    }; // End $.fn.SPServices.SPListNameFromUrl

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // This function converts an XML node set to JSON
    // Initial implementation focuses only on GetListItems
    $.fn.SPXmlToJson = function (options) {

        var opt = $.extend({}, {
            mapping: {}, // columnName: mappedName: "mappedName", objectType: "objectType"
            includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
            removeOws: true, // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
            sparse: false // If true, empty ("") values will not be returned
        }, options);

        var attrNum;
        var jsonObject = [];

        this.each(function () {
            var row = {};
            var rowAttrs = this.attributes;

            if (!opt.sparse) {
                // Bring back all mapped columns, even those with no value
                $.each(opt.mapping, function () {
                    row[this.mappedName] = "";
                });
            }

            // Parse through the element's attributes
            for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
                var thisAttrName = rowAttrs[attrNum].name;
                var thisMapping = opt.mapping[thisAttrName];
                var thisObjectName = thisMapping && thisMapping.mappedName ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
                var thisObjectType = thisMapping !== undefined ? thisMapping.objectType : undefined;
                if (opt.includeAllAttrs || thisMapping !== undefined) {
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
        function identity(x) { return x; }

        var result = {

            /* Generic [Reusable] Functions */
            "Integer": intToJsonObject,
            "Number": floatToJsonObject,
            "Boolean": booleanToJsonObject,
            "DateTime": dateToJsonObject,
            "User": userToJsonObject,
            "UserMulti": userMultiToJsonObject,
            "Lookup": lookupToJsonObject,
            "lookupMulti": lookupMultiToJsonObject,
            "MultiChoice": choiceMultiToJsonObject,
            "Calculated": calcToJsonObject,
            "Attachments": attachmentsToJsonObject,
            "URL": urlToJsonObject,
            "JSON": jsonToJsonObject, // Special case for text JSON stored in text columns

            /* These objectTypes reuse above functions */
            "Text": result.Default,
            "Counter": result.Integer,
            "datetime": result.DateTime,    // For calculated columns, stored as datetime;#value
            "AllDayEvent": result.Boolean,
            "Recurrence": result.Boolean,
            "Currency": result.Number,
            "float": result.Number, // For calculated columns, stored as float;#value
            "RelatedItems": result.JSON,

            "Default": identity
        };

        return (result[objectType] || identity)(v);

/*
        switch (objectType) {

            case "Text":
                colValue = v;
                break;
            case "DateTime":
            case "datetime": // For calculated columns, stored as datetime;#value
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
            case "AllDayEvent":
            case "Recurrence":
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
            case "Number":
            case "Currency":
            case "float": // For calculated columns, stored as float;#value
                colValue = floatToJsonObject(v);
                break;
            case "Calculated":
                colValue = calcToJsonObject(v);
                break;
            case "Attachments":
                colValue = attachmentsToJsonObject(v);
                break;
            case "URL":
                colValue = urlToJsonObject(v);
                break;
            case "JSON":
            case "RelatedItems":
                colValue = jsonToJsonObject(v); // Special case for text JSON stored in text columns
                break;

            default:
                // All other objectTypes will be simple strings
                colValue = v;
                break;
        }
        return colValue;
 */
    }

    function intToJsonObject(s) {
        return parseInt(s, 10);
    }

    function floatToJsonObject(s) {
        return parseFloat(s);
    }

    function booleanToJsonObject(s) {
        return s !== "0";
    }

    function dateToJsonObject(s) {

        var dt = s.split("T")[0] !== s ? s.split("T") : s.split(" ");
        var d = dt[0].split("-");
        var t = dt[1].split(":");
        var t3 = t[2].split("Z");
        return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t3[0]);
    }

    function userToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUser = new utils.SplitIndex(s);
            var thisUserExpanded = thisUser.value.split(",#");
            if (thisUserExpanded.length === 1) {
                return {
                    userId: thisUser.id,
                    userName: thisUser.value
                };
            } else {
                return {
                    userId: thisUser.id,
                    userName: thisUserExpanded[0].replace(/(,,)/g, ","),
                    loginName: thisUserExpanded[1].replace(/(,,)/g, ","),
                    email: thisUserExpanded[2].replace(/(,,)/g, ","),
                    sipAddress: thisUserExpanded[3].replace(/(,,)/g, ","),
                    title: thisUserExpanded[4].replace(/(,,)/g, ",")
                };
            }
        }
    }

    function userMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUserMultiObject = [];
            var thisUserMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisUserMulti.length; i = i + 2) {
                var thisUser = userToJsonObject(thisUserMulti[i] + constants.spDelim + thisUserMulti[i + 1]);
                thisUserMultiObject.push(thisUser);
            }
            return thisUserMultiObject;
        }
    }

    function lookupToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisLookup = s.split(constants.spDelim);
            return {
                lookupId: thisLookup[0],
                lookupValue: thisLookup[1]
            };
        }
    }

    function lookupMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisLookupMultiObject = [];
            var thisLookupMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisLookupMulti.length; i = i + 2) {
                var thisLookup = lookupToJsonObject(thisLookupMulti[i] + constants.spDelim + thisLookupMulti[i + 1]);
                thisLookupMultiObject.push(thisLookup);
            }
            return thisLookupMultiObject;
        }
    }

    function choiceMultiToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisChoiceMultiObject = [];
            var thisChoiceMulti = s.split(constants.spDelim);
            for (var i = 0; i < thisChoiceMulti.length; i++) {
                if (thisChoiceMulti[i].length !== 0) {
                    thisChoiceMultiObject.push(thisChoiceMulti[i]);
                }
            }
            return thisChoiceMultiObject;
        }
    }

    function attachmentsToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else if (s === "0" || s === "1") {
            return s;
        } else {
            var thisObject = [];
            var thisString = s.split(constants.spDelim);
            for (var i = 0; i < thisString.length; i++) {
                if (thisString[i].length !== 0) {
                    var fileName = thisString[i];
                    if (thisString[i].lastIndexOf("/") !== -1) {
                        var tokens = thisString[i].split("/");
                        fileName = tokens[tokens.length - 1];
                    }
                    thisObject.push({
                        attachment: thisString[i],
                        fileName: fileName
                    });
                }
            }
            return thisObject;
        }
    }

    function urlToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisUrl = s.split(", ");
            return {
                Url: thisUrl[0],
                Description: thisUrl[1]
            };
        }
    }

    function calcToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            var thisCalc = s.split(constants.spDelim);
            // The first value will be the calculated column value type, the second will be the value
            return attrToJson(thisCalc[1], thisCalc[0]);
        }
    }

    function jsonToJsonObject(s) {
        if (s.length === 0) {
            return null;
        } else {
            return $.parseJSON(s);
        }
    }

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Rearrange radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate
    $.fn.SPServices.SPArrangeChoices = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list name for the current form
            columnName: "", // The display name of the column in the form
            perRow: 99, // Maximum number of choices desired per row.
            randomize: false // If true, randomize the order of the options
        }, options);

        var columnFillInChoice = false;
        var columnOptions = [];

        // Get information about columnName from the list to determine if we're allowing fill-in choices
        var thisGetList = $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName
        });

        // when the promise is available...
        thisGetList.done(function () {
            $(thisGetList.responseXML).find("Field[DisplayName='" + opt.columnName + "']").each(function () {
                // Determine whether columnName allows a fill-in choice
                columnFillInChoice = ($(this).attr("FillInChoice") === "TRUE");
                // Stop looking;we're done
                return false;
            });

            var thisFormField = utils.findFormField(opt.columnName);
            var totalChoices = $(thisFormField).find("tr").length;
            var fillinPrompt;
            var fillinInput;

            // Collect all of the choices
            $(thisFormField).find("tr").each(function (choiceNumber) {
                // If this is the fill-in prompt, save it...
                if (columnFillInChoice && choiceNumber === (totalChoices - 2)) {
                    fillinPrompt = $(this).find("td");
                    // ...or if it is the fill-in input box, save it...
                } else if (columnFillInChoice && choiceNumber === (totalChoices - 1)) {
                    fillinInput = $(this).find("td");
                    // ...else push into the columnOptions array.
                } else {
                    columnOptions.push($(this).find("td"));
                }
            });

            // If randomize is true, randomly sort the options
            if (opt.randomize) {
                columnOptions.sort(utils.randOrd);
            }

            //Create a new choices table to hold the arranged choices.
            var newChoiceTable = $("<table cellpadding='0' cellspacing='1'></table>");

            //Iterate over all available choices placing them in the correct position in the new choices table.
            for (var i = 0; i < columnOptions.length; i++) {
                // If we've already got perRow columnOptions in the row, close off the row
                if ((i + 1) % opt.perRow === 0) {
                    newChoiceTable.append("<tr></tr>");
                }
                newChoiceTable.append(columnOptions[i]);
            }

            //Insert fillInChoices section under available choices.
            if (columnFillInChoice) {
                var fillInRow = $("<tr><td colspan='99'><table cellpadding='0' cellspacing='1'><tr></tr></table></td></tr>");
                fillInRow.find("tr").append(fillinPrompt);
                fillInRow.find("tr").append(fillinInput);
                newChoiceTable.append(fillInRow);
            }

            //Insert new table before the old choice table so that choices will still line up with header.
            var choiceTable = $(thisFormField).find("table:first");
            choiceTable.before(newChoiceTable);

            //Choices table is not removed because validation depends on the table id.
            choiceTable.hide();

        });

    }; // End $.fn.SPServices.SPArrangeChoices


    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Provide suggested values from a list for in input column based on characters typed
    $.fn.SPServices.SPAutocomplete = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] The name of the Web (site) which contains the sourceList
            sourceList: "", // The name of the list which contains the values
            sourceColumn: "", // The static name of the column which contains the values
            columnName: "", // The display name of the column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
            CAMLQueryOptions: "<QueryOptions></QueryOptions>", // [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
            CAMLRowLimit: 0, // [Optional] Override the default view rowlimit and get all appropriate rows
            filterType: "BeginsWith", // Type of filtering: [BeginsWith, Contains]
            numChars: 0, // Wait until this number of characters has been typed before attempting any actions
            ignoreCase: false, // If set to true, the function ignores case, if false it looks for an exact match
            highlightClass: "", // If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
            uniqueVals: false, // If set to true, the function only adds unique values to the list (no duplicates)
            maxHeight: 99999, // Sets the maximum number of values to display before scrolling occurs
            slideDownSpeed: "fast", // Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
            processingIndicator: "_layouts/images/REFRESH.GIF", // If present, show this while processing
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var matchNum;

        // Find the input control for the column and save some of its attributes
        var columnObj = utils.findFormField(opt.columnName).find("input[Title^='" + opt.columnName + "']");
        columnObj.css("position", "");
        var columnObjColor = columnObj.css("color");
        var columnObjWidth = columnObj.css("width");

        if (columnObj.html() === null && opt.debug) {
            utils.errBox("SPServices.SPAutocomplete",
                "columnName: " + opt.columnName,
                "Column is not an input control or is not found on page");
            return;
        }

        // Remove the <br/> which isn't needed and messes up the formatting
        columnObj.closest("span").find("br").remove();
        columnObj.wrap("<div>");

        // Create a div to contain the matching values and add it to the DOM
        var containerId = utils.genContainerId("SPAutocomplete", opt.columnName, opt.listName);
        columnObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");

        // Set the width to match the width of the input control
        var containerObj = $("#" + containerId);
        containerObj.css("width", columnObjWidth);

        // Handle keypresses
        $(columnObj).keyup(function () {

            // Get the column's value
            var columnValue = $(this).val();

            // Hide the container while we're working on it
            containerObj.hide();

            // Have enough characters been typed yet?
            if (columnValue.length < opt.numChars) {
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
            if (opt.CAMLQuery.length > 0) {
                camlQuery += "<And>";
            }
            camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";
            if (opt.CAMLQuery.length > 0) {
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
                completefunc: function (xData) {
                    // Handle upper/lower case if ignoreCase = true
                    var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
                    // See which values match and add the ones that do to matchArray
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {
                        var thisValue = $(this).attr("ows_" + opt.sourceColumn);
                        var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
                        // Make sure we have a match...
                        if (opt.filterType === "Contains") {
                            var firstMatch = thisValueTest.indexOf(testValue);
                            if ((firstMatch >= 0) &&
                                    // ...and that the match is not already in the array if we want uniqueness
                                (!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
                                matchArray.push($(this).attr("ows_" + opt.sourceColumn));
                            }
                        } else {
                            // Handles normal case, which is BeginsWith and and other unknown values
                            if (testValue === thisValueTest.substr(0, testValue.length) &&
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
            for (var i = 0; i < matchArray.length; i++) {
                // If a highlightClass has been supplied, wrap a span around each match
                if (opt.highlightClass.length > 0) {
                    // Set up Regex based on whether we want to ignore case
                    var thisRegex = new RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
                    // Look for all occurrences
                    var matches = matchArray[i].match(thisRegex);
                    var startLoc = 0;
                    // Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
                    for (matchNum = 0; matchNum < matches.length; matchNum++) {
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
            containerObj.html(out);
            // Set up hehavior for the available values in the list element
            $("#" + containerId + " li").click(function () {
                $("#" + containerId).fadeOut(opt.slideUpSpeed);
                columnObj.val($(this).text());
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
            if (matchArray.length > 0) {
                $("#" + containerId).slideDown(opt.slideDownSpeed);
            }
            // Remove the processing indicator
            columnObj.css("background-image", "");
        });

    }; // End $.fn.SPServices.SPAutocomplete

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // Function to set up cascading dropdowns on a SharePoint form
    // (Newform.aspx, EditForm.aspx, or any other customized form.)
    $.fn.SPServices.SPCascadeDropdowns = function (options) {

        var opt = $.extend({}, {
            relationshipWebURL: "", // [Optional] The name of the Web (site) which contains the relationships list
            relationshipList: "", // The name of the list which contains the parent/child relationships
            relationshipListParentColumn: "", // The internal name of the parent column in the relationship list
            relationshipListChildColumn: "", // The internal name of the child column in the relationship list
            relationshipListSortColumn: "", // [Optional] If specified, sort the options in the dropdown by this column,
            // otherwise the options are sorted by relationshipListChildColumn
            parentColumn: "", // The display name of the parent column in the form
            childColumn: "", // The display name of the child column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList
            CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>", // [Optional] For power users, ability to specify Query Options
            promptText: "", // [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. Original value "Choose {0}..."
            noneText: "(None)", // [Optional] Text to use for the (None) selection. Provided for non-English language support.
            simpleChild: false, // [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown
            selectSingleOption: false, // [Optional] If set to true and there is only a single child option, select it
            matchOnId: false, // By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);


        var thisParentSetUp = false;
        var thisFunction = "SPServices.SPCascadeDropdowns";

        // Find the parent column's select (dropdown)
        var parentSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.parentColumn
        });
        if (parentSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "parentColumn: " + opt.parentColumn, constants.TXTColumnNotFound);
            return;
        }

        // Find the child column's select (dropdown)
        var childSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.childColumn
        });
        if (childSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "childColumn: " + opt.childColumn, constants.TXTColumnNotFound);
            return;
        }

        // If requested and the childColumn is a complex dropdown, convert to a simple dropdown
        if (opt.simpleChild === true && childSelect.Type === constants.dropdownType.complex) {
            $().SPServices.SPComplexToSimpleDropdown({
                listName: opt.listName,
                columnName: opt.childColumn
            });
            // Set the childSelect to reference the new simple dropdown
            childSelect = $().SPServices.SPDropdownCtl({
                displayName: opt.childColumn
            });
        }

        var childColumnRequired, childColumnStatic;

        // Get information about the childColumn from the current list
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName,
            completefunc: function (xData) {
                $(xData.responseXML).find("Fields").each(function () {
                    $(this).find("Field[DisplayName='" + opt.childColumn + "']").each(function () {
                        // Determine whether childColumn is Required
                        childColumnRequired = ($(this).attr("Required") === "TRUE");
                        childColumnStatic = $(this).attr("StaticName");
                        // Stop looking; we're done
                        return false;
                    });
                });
            }
        });

        // Save data about each child column on the parent
        var childColumn = {
            opt: opt,
            childSelect: childSelect,
            childColumnStatic: childColumnStatic,
            childColumnRequired: childColumnRequired
        };
        var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");

        // If this is the first child for this parent, then create the data object to hold the settings
        if (typeof childColumns === "undefined") {
            parentSelect.Obj.data("SPCascadeDropdownsChildColumns", [childColumn]);
            // If we already have a data object for this parent, then add the setting for this child to it
        } else {
            childColumns.push(childColumn);
            parentSelect.Obj.data("SPCascadeDropdownsChildColumns", childColumns);
            thisParentSetUp = true;
        }

        // We only need to bind to the event(s) if we haven't already done so
        if (!thisParentSetUp) {
            switch (parentSelect.Type) {
                // Plain old select
                case constants.dropdownType.simple:
                    parentSelect.Obj.bind("change", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                // Input / Select hybrid
                case constants.dropdownType.complex:
                    // Bind to any change on the hidden input element
                    parentSelect.optHid.bind("propertychange", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                // Multi-select hybrid
                case constants.dropdownType.multiSelect:
                    // Handle the dblclick on the candidate select
                    $(parentSelect.master.candidateControl).bind("dblclick", function () {
                        cascadeDropdown(parentSelect);
                    });
                    // Handle the dblclick on the selected values
                    $(parentSelect.master.resultControl).bind("dblclick", function () {
                        cascadeDropdown(parentSelect);
                    });
                    // Handle button clicks
                    $(parentSelect.master.addControl).bind("click", function () {
                        cascadeDropdown(parentSelect);
                    });
                    $(parentSelect.master.removeControl).bind("click", function () {
                        cascadeDropdown(parentSelect);
                    });
                    break;
                default:
                    break;
            }
        }
        // Fire the change to set the initially allowable values
        cascadeDropdown(parentSelect);

    }; // End $.fn.SPServices.SPCascadeDropdowns

    function cascadeDropdown(parentSelect) {
        var choices = "";
        var parentSelectSelected;
        var childSelectSelected = null;
        var newMultiLookupPickerdata;
        var numChildOptions;
        var firstChildOptionId;
        var firstChildOptionValue;

        // Filter each child column
        var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");
        $(childColumns).each(function () {

            // Break out the data objects for this child column
            var i;
            var opt = this.opt;
            var childSelect = this.childSelect;
            var childColumnStatic = this.childColumnStatic;
            var childColumnRequired = this.childColumnRequired;

            // Get the parent column selection(s)
            parentSelectSelected = utils.getDropdownSelected(parentSelect, opt.matchOnId);

            // If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
            // the number of Web Service calls when the parentSelect.Type = constants.dropdownType.complex or constants.dropdownType.multiSelect, as there are multiple propertychanges
            // which don't require any action.  The attribute will be unique per child column in case there are
            // multiple children for a given parent.
            var allParentSelections = parentSelectSelected.join(constants.spDelim);
            if (parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic) === allParentSelections) {
                return;
            }
            parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic, allParentSelections);

            // Get the current child column selection(s)
            childSelectSelected = utils.getDropdownSelected(childSelect, true);

            // When the parent column's selected option changes, get the matching items from the relationship list
            // Get the list items which match the current selection
            var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
            var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where><And>";
            if (opt.CAMLQuery.length > 0) {
                camlQuery += "<And>";
            }

            // Build up the criteria for inclusion
            if (parentSelectSelected.length === 0) {
                // Handle the case where no values are selected in multi-selects
                camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
            } else if (parentSelectSelected.length === 1) {
                // Only one value is selected
                camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
                    (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                    utils.escapeColumnValue(parentSelectSelected[0]) + "</Value></Eq>";
            } else {
                var compound = (parentSelectSelected.length > 2);
                for (i = 0; i < (parentSelectSelected.length - 1); i++) {
                    camlQuery += "<Or>";
                }
                for (i = 0; i < parentSelectSelected.length; i++) {
                    camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
                        (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                        utils.escapeColumnValue(parentSelectSelected[i]) + "</Value></Eq>";
                    if (i > 0 && (i < (parentSelectSelected.length - 1)) && compound) {
                        camlQuery += "</Or>";
                    }
                }
                camlQuery += "</Or>";
            }

            if (opt.CAMLQuery.length > 0) {
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
                CAMLQueryOptions: opt.CAMLQueryOptions,
                completefunc: function (xData) {

                    // Handle errors
                    $(xData.responseXML).find("errorstring").each(function () {
                        var thisFunction = "SPServices.SPCascadeDropdowns";
                        var errorText = $(this).text();
                        if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                            utils.errBox(thisFunction,
                                "relationshipListParentColumn: " + opt.relationshipListParentColumn + " or " +
                                "relationshipListChildColumn: " + opt.relationshipListChildColumn,
                                "Not found in relationshipList " + opt.relationshipList);
                        } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                            utils.errBox(thisFunction,
                                "relationshipList: " + opt.relationshipList,
                                "List not found");
                        }

                    });

                    // Add an explanatory prompt
                    switch (childSelect.Type) {
                        case constants.dropdownType.simple:
                            // Remove all of the existing options
                            childSelect.Obj[0].innerHTML = "";
//                            $(childSelect.Obj).find("option").remove();
                            // If the column is required or the promptText option is empty, don't add the prompt text
                            if (!childColumnRequired && (opt.promptText.length > 0)) {
                                childSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.childColumn) + "</option>");
                            } else if (!childColumnRequired) {
                                childSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
                            }
                            break;
                        case constants.dropdownType.complex:
                            // If the column is required, don't add the "(None)" option
                            choices = childColumnRequired ? "" : opt.noneText + "|0";
                            childSelect.Obj.val("");
                            break;
                        case constants.dropdownType.multiSelect:
                            // Remove all of the existing options
                            $(childSelect.master.candidateControl).find("option").remove();
                            newMultiLookupPickerdata = "";
                            break;
                        default:
                            break;
                    }
                    // Get the count of items returned and save it so that we can select if it's a single option
                    // The item count is stored thus: <rs:data ItemCount="1">
                    numChildOptions = parseFloat($(xData.responseXML).SPFilterNode("rs:data").attr("ItemCount"));

                    // Add an option for each child item
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {

                        var thisOption = {};

                        // If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
                        // else the ID of the relationshipList item
                        var thisValue = $(this).attr("ows_" + opt.relationshipListChildColumn);

                        if (typeof thisValue !== "undefined" && thisValue.indexOf(constants.spDelim) > 0) {
                            thisOption = new utils.SplitIndex(thisValue);
                        } else {
                            thisOption.id = $(this).attr("ows_ID");
                            thisOption.value = thisValue;
                        }

                        // If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
                        // but by the datatype.  In this case, thisOption.id should be the ID of the relationshipList item.
                        // e.g., float;#12345.67
                        if (isNaN(thisOption.id)) {
                            thisOption.id = $(this).attr("ows_ID");
                        }

                        // Save the id and value for the first child option in case we need to select it (selectSingleOption option is true)
                        firstChildOptionId = thisOption.id;
                        firstChildOptionValue = thisOption.value;

                        switch (childSelect.Type) {
                            case constants.dropdownType.simple:
                                var selected = ($(this).attr("ows_ID") === childSelectSelected[0]) ? " selected='selected'" : "";
                                childSelect.Obj.append("<option" + selected + " value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                                break;
                            case constants.dropdownType.complex:
                                if (thisOption.id === childSelectSelected[0]) {
                                    childSelect.Obj.val(thisOption.value);
                                }
                                choices = choices + ((choices.length > 0) ? "|" : "") + thisOption.value + "|" + thisOption.id;
                                break;
                            case constants.dropdownType.multiSelect:
                                $(childSelect.master.candidateControl).append("<option value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                                newMultiLookupPickerdata += thisOption.id + "|t" + thisOption.value + "|t |t |t";
                                break;
                            default:
                                break;
                        }
                    });

                    switch (childSelect.Type) {
                        case constants.dropdownType.simple:
                            childSelect.Obj.trigger("change");
                            // If there is only one option and the selectSingleOption option is true, then select it
                            if (numChildOptions === 1 && opt.selectSingleOption === true) {
                                $(childSelect.Obj).find("option[value!='0']:first").attr("selected", "selected");
                            }
                            break;
                        case constants.dropdownType.complex:
                            // Set the allowable choices
                            childSelect.Obj.attr("choices", choices);
                            // If there is only one option and the selectSingleOption option is true, then select it
                            if (numChildOptions === 1 && opt.selectSingleOption === true) {
                                // Set the input element value
                                $(childSelect.Obj).val(firstChildOptionValue);
                                // Set the value of the optHid input element
                                childSelect.optHid.val(firstChildOptionId);
                            }
                            // If there's no selection, then remove the value in the associated hidden input element (optHid)
                            if (childSelect.Obj.val() === "") {
                                childSelect.optHid.val("");
                            }
                            break;
                        case constants.dropdownType.multiSelect:
                            // Clear the master
                            childSelect.master.data = "";
                            childSelect.MultiLookupPickerdata.val(newMultiLookupPickerdata);

                            // Clear any prior selections that are no longer valid or aren't selected
                            $(childSelect.master.resultControl).find("option").each(function () {
                                var thisSelected = $(this);
                                thisSelected.prop("selected", true);
                                $(childSelect.master.candidateControl).find("option[value='" + thisSelected.val() + "']").each(function () {
                                    thisSelected.prop("selected", false);
                                });
                            });
                            GipRemoveSelectedItems(childSelect.master);

                            // Hide any options in the candidate list which are already selected
                            $(childSelect.master.candidateControl).find("option").each(function () {
                                var thisSelected = $(this);
                                $(childSelect.master.resultControl).find("option[value='" + thisSelected.val() + "']").each(function () {
                                    thisSelected.remove();
                                });
                            });
                            GipAddSelectedItems(childSelect.master);

                            // Set master.data to the newly allowable values
                            childSelect.master.data = GipGetGroupData(newMultiLookupPickerdata);

                            // Trigger a dblclick so that the child will be cascaded if it is a multiselect.
                            $(childSelect.master.candidateControl).trigger("dblclick");

                            break;
                        default:
                            break;
                    }
                }
            });
            // If present, call completefunc when all else is done
            if (opt.completefunc !== null) {
                opt.completefunc();
            }
        }); // $(childColumns).each(function()

    } // End cascadeDropdown

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // function to convert complex dropdowns to simple dropdowns
    $.fn.SPServices.SPComplexToSimpleDropdown = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            columnName: "", // The display name of the column in the form
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox("SPServices.SPComplexToSimpleDropdown", "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // If we don't have a complex dropdown, then there is nothing to do
        if (columnSelect.Type !== constants.dropdownType.complex) {
            return;
        }

        // The available options are stored in the choices attribute of the complex dropdown's input element...
        var choices = $(columnSelect.Obj).attr("choices").split("|");

        // We need to know which option is selected already, if any
        var complexSelectSelectedId = columnSelect.optHid.val();

        // Build up the simple dropdown, giving it an easy to select id
        var simpleSelectId = utils.genContainerId("SPComplexToSimpleDropdown", columnSelect.Obj.attr("title"), opt.listName);

        var simpleSelect = "<select id='" + simpleSelectId + "' title='" + opt.columnName + "'>";
        for (var i = 0; i < choices.length; i = i + 2) {
            var simpleSelectSelected = (choices[i + 1] === complexSelectSelectedId) ? " selected='selected' " : " ";
            simpleSelect += "<option" + simpleSelectSelected + "value='" + choices[i + 1] + "'>" + choices[i] + "</option>";
        }
        simpleSelect += "</select>";

        // Append the new simple select to the form
        columnSelect.Obj.closest("td").prepend(simpleSelect);
        var simpleSelectObj = $("#" + simpleSelectId);

        // Remove the complex dropdown functionality since we don't need it anymore...
        columnSelect.Obj.closest("span").find("img").remove();
        // ...and hide the input element
        columnSelect.Obj.closest("span").find("input").hide();

        // When the simple select changes...
        simpleSelectObj.change(function () {
            var thisVal = $(this).val();
            // ...set the optHid input element's value to the valus of the selected option...
            columnSelect.optHid.val(thisVal);
            // ...and save the selected value as the hidden input's value only if the value is not equal to "0" (None)
            $(columnSelect.Obj).val($(this).find("option[value='" + (thisVal !== "0" ? thisVal : "") + "']").html());
        });
        // Trigger a change to ensure that the selected value registers in the complex dropdown
        simpleSelectObj.trigger("change");

        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }

    }; // End $.fn.SPServices.SPConvertToSimpleDropdown

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // Function to display related information when an option is selected on a form.
    $.fn.SPServices.SPDisplayRelatedInfo = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            columnName: "", // The display name of the column in the form
            relatedWebURL: "", // [Optional] The name of the Web (site) which contains the related list
            relatedList: "", // The name of the list which contains the additional information
            relatedListColumn: "", // The internal name of the related column in the related list
            relatedColumns: [], // An array of related columns to display
            displayFormat: "table", // The format to use in displaying the related information.  Possible values are: [table, list, none]
            headerCSSClass: "ms-vh2", // CSS class for the table headers
            rowCSSClass: "ms-vb", // CSS class for the table rows
            CAMLQuery: "", // [Optional] For power users, this CAML fragment will be <And>ed with the default query on the relatedList
            numChars: 0, // If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered
            matchType: "Eq", // If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith"
            matchOnId: false, // By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var i;
        var relatedColumnsXML = [];
        var relatedListXML;
        var thisFunction = "SPServices.SPDisplayRelatedInfo";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // Get information about the related list and its columns
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            webURL: opt.relatedWebURL,
            listName: opt.relatedList,
            completefunc: function (xData) {
                // If debug is on, notify about an error
                $(xData.responseXML).find("faultcode").each(function () {
                    if (opt.debug) {
                        utils.errBox(thisFunction, "relatedList: " + opt.relatedList, "List not found");

                    }
                });
                // Get info about the related list
                relatedListXML = $(xData.responseXML).find("List");
                // Save the information about each column requested
                for (i = 0; i < opt.relatedColumns.length; i++) {
                    relatedColumnsXML[opt.relatedColumns[i]] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedColumns[i] + "']");
                }
                relatedColumnsXML[opt.relatedListColumn] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedListColumn + "']");
            }
        });

        switch (columnSelect.Type) {
            // Plain old select
            case constants.dropdownType.simple:
                columnSelect.Obj.bind("change", function () {
                    showRelated(opt, relatedListXML, relatedColumnsXML);
                });
                break;
            // Input / Select hybrid
            case constants.dropdownType.complex:
                // Bind to any change on the hidden input element
                columnSelect.optHid.bind("propertychange", function () {
                    showRelated(opt, relatedListXML, relatedColumnsXML);
                });
                break;
            // Multi-select hybrid
            case constants.dropdownType.multiSelect:
                if (opt.debug) {
                    utils.errBox(thisFunction, "columnName: " + opt.columnName, "Multi-select columns not supported by this function");
                }
                break;
            default:
                break;
        }
        // Fire the change to set the initially allowable values
        showRelated(opt, relatedListXML, relatedColumnsXML);

    }; // End $.fn.SPServices.SPDisplayRelatedInfo

    function showRelated(opt, relatedListXML, relatedColumnsXML) {

        var i;
        var columnSelectSelected;
        var thisFunction = "SPServices.SPDisplayRelatedInfo";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });

        // Get the current column selection(s)
        columnSelectSelected = utils.getDropdownSelected(columnSelect, opt.matchOnId);
        if (columnSelect.Type === constants.dropdownType.complex && opt.numChars > 0 && columnSelectSelected[0].length < opt.numChars) {
            return;
        }

        // If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
        // the number of Web Service calls when the parentSelect.Type = constants.dropdownType.complex, as there are multiple propertychanges
        // which don't require any action.
        if (columnSelect.Obj.attr("showRelatedSelected") === columnSelectSelected[0]) {
            return;
        }
        columnSelect.Obj.attr("showRelatedSelected", columnSelectSelected[0]);

        if(opt.displayFormat !== "none") {
            // Generate a unique id for the container
            var divId = utils.genContainerId("SPDisplayRelatedInfo", opt.columnName, opt.listName);
            // Remove the old container...
            $("#" + divId).remove();
            // ...and append a new, empty one
            columnSelect.Obj.parent().append("<div id=" + divId + "></div>");
        }

        // Get the list items which match the current selection
        var camlQuery = "<Query><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += "<And>";
        }

        // Need to handle Lookup columns differently than static columns
        var relatedListColumnType = relatedColumnsXML[opt.relatedListColumn].attr("Type");
        if (relatedListColumnType === "Lookup") {
            camlQuery += "<Eq><FieldRef Name='" + opt.relatedListColumn +
                (opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
                utils.escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";
        } else {
            camlQuery += "<Eq><FieldRef Name='" +
                (opt.matchOnId ? "ID' /><Value Type='Counter'>" : opt.relatedListColumn + "'/><Value Type='Text'>") +
                utils.escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";
        }

        if (opt.CAMLQuery.length > 0) {
            camlQuery += opt.CAMLQuery + "</And>";
        }
        camlQuery += "</Where></Query>";

        var viewFields = " ";
        for (i = 0; i < opt.relatedColumns.length; i++) {
            viewFields += "<FieldRef Name='" + opt.relatedColumns[i] + "' />";
        }

        $().SPServices({
            operation: "GetListItems",
            async: false,
            webURL: opt.relatedWebURL,
            listName: opt.relatedList,
            // Filter based on the column's currently selected value
            CAMLQuery: camlQuery,
            CAMLViewFields: "<ViewFields>" + viewFields + "</ViewFields>",
            // Override the default view rowlimit and get all appropriate rows
            CAMLRowLimit: 0,
            completefunc: function (xData) {

                // Handle errors
                $(xData.responseXML).find("errorstring").each(function () {
                    var errorText = $(this).text();
                    if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                        utils.errBox(thisFunction,
                            "relatedListColumn: " + opt.relatedListColumn,
                            "Column not found in relatedList " + opt.relatedList);
                    } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                        utils.errBox(thisFunction,
                            "relatedList: " + opt.relatedList,
                            "List not found");
                    }

                });

                var outString;
                // Output each row
                switch (opt.displayFormat) {
                    // Only implementing the table format in the first iteration (v0.2.9)
                    case "table":
                        outString = "<table>";
                        outString += "<tr>";
                        for (i = 0; i < opt.relatedColumns.length; i++) {
                            if (typeof relatedColumnsXML[opt.relatedColumns[i]] === "undefined" && opt.debug) {
                                utils.errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList");
                                return;
                            }
                            outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[opt.relatedColumns[i]].attr("DisplayName") + "</th>";
                        }
                        outString += "</tr>";
                        // Add an option for each child item
                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                            outString += "<tr>";
                            for (i = 0; i < opt.relatedColumns.length; i++) {
                                outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[opt.relatedColumns[i]], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
                            }
                            outString += "</tr>";
                        });
                        outString += "</table>";
                        break;
                    // list format implemented in v0.5.0. Still table-based, but vertical orientation.
                    case "list":
                        outString = "<table>";
                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                            for (i = 0; i < opt.relatedColumns.length; i++) {
                                if (typeof relatedColumnsXML[opt.relatedColumns[i]] === "undefined" && opt.debug) {
                                    utils.errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList");
                                    return;
                                }
                                outString += "<tr>";
                                outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[opt.relatedColumns[i]].attr("DisplayName") + "</th>";
                                outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[opt.relatedColumns[i]], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
                                outString += "</tr>";
                            }
                        });
                        outString += "</table>";
                        break;
                    case "none":
                        break;
                    default:
                        break;
                }
                // Write out the results
                if(opt.displayFormat !== "none") {
                    $("#" + divId).html(outString);
                }

                // If present, call completefunc when all else is done
                if (opt.completefunc !== null) {
                    opt.completefunc(xData);
                }

            }
        });
    } // End showRelated

    // Display a column (field) formatted correctly based on its definition in the list.
    // NOTE: Currently not dealing with locale differences.
    //   columnXML          The XML node for the column from a GetList operation
    //   columnValue        The text representation of the column's value
    //   opt                The current set of options
    function showColumn(listXML, columnXML, columnValue, opt) {

        if (typeof columnValue === "undefined") {
            return "";
        }

        var i;
        var outString = "";
        var fileName = "";
        var dispUrl;
        var numDecimals;
        var outArray = [];
        var webUrl = opt.relatedWebURL.length > 0 ? opt.relatedWebURL : $().SPServices.SPGetCurrentSite();







        switch (columnXML.attr("Type")) {
            case "Text":
                outString = columnValue;
                break;
            case "URL":
                switch (columnXML.attr("Format")) {
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
                var userMultiValues = columnValue.split(constants.spDelim);
                for (i = 0; i < userMultiValues.length; i = i + 2) {
                    outArray.push("<a href='/_layouts/userdisp.aspx?ID=" + userMultiValues[i] +
                        "&Source=" + utils.escapeUrl(location.href) + "'>" +
                        userMultiValues[i + 1] + "</a>");
                }
                outString = outArray.join(", ");
                break;
            case "Calculated":
                var calcColumn = columnValue.split(constants.spDelim);
                outString = calcColumn[1];
                break;
            case "Number":
                numDecimals = columnXML.attr("Decimals");
                outString = typeof numDecimals === "undefined" ?
                    parseFloat(columnValue).toString() :
                    parseFloat(columnValue).toFixed(numDecimals).toString();
                break;
            case "Currency":
                numDecimals = columnXML.attr("Decimals");
                outString = typeof numDecimals === "undefined" ?
                    parseFloat(columnValue).toFixed(2).toString() :
                    parseFloat(columnValue).toFixed(numDecimals).toString();
                break;
            case "Lookup":
                switch (columnXML.attr("Name")) {
                    case "FileRef":
                        // Get the display form URL for the lookup source list
                        dispUrl = listXML.attr("BaseType") === "1" ? listXML.attr("RootFolder") + constants.SLASH + "Forms/DispForm.aspx" :
                        listXML.attr("RootFolder") + constants.SLASH + "DispForm.aspx";
                        outString = "<a href='" + dispUrl +
                            "?ID=" + columnValue.substring(0, columnValue.search(constants.spDelim)) + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                    case "FileDirRef":
                        // Get the display form URL for the lookup source list
                        dispUrl = constants.SLASH + columnValue.substring(columnValue.search(constants.spDelim) + 2);
                        outString = "<a href='" + dispUrl + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                    // Any other lookup column
                    default:
                        // Get the display form URL for the lookup source list
                        dispUrl = utils.getListFormUrl(columnXML.attr("List"), "DisplayForm");
                        outString = "<a href='" + opt.relatedWebURL + constants.SLASH + dispUrl +
                            "?ID=" + columnValue.substring(0, columnValue.search(constants.spDelim)) + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            columnValue.substring(columnValue.search(constants.spDelim) + 2) + "</a>";
                        break;
                }
                break;
            case "LookupMulti":
                // Get the display form URL for the lookup source list
                dispUrl = utils.getListFormUrl(columnXML.attr("List"), "DisplayForm");
                // Show all the values as links to the items, separated by commas
                outString = "";
                if (columnValue.length > 0) {
                    var lookupMultiValues = columnValue.split(constants.spDelim);
                    for (i = 0; i < lookupMultiValues.length / 2; i++) {
                        outArray.push("<a href='" + webUrl + constants.SLASH + dispUrl +
                            "?ID=" + lookupMultiValues[i * 2] + "&RootFolder=*&Source=" + utils.escapeUrl(location.href) + "'>" +
                            lookupMultiValues[(i * 2) + 1] + "</a>");
                    }
                }
                outString = outArray.join(", ");
                break;
            case "File":
                fileName = columnValue.substring(columnValue.search(constants.spDelim) + 2);
                outString = "<a href='" + listXML.attr("RootFolder") + constants.SLASH + fileName + "'>" + fileName + "</a>";
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

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    /* jshint undef: true */
    /* global GipAddSelectedItems, GipRemoveSelectedItems, GipGetGroupData */

    // Function to filter a lookup based dropdown
    $.fn.SPServices.SPFilterDropdown = function (options) {

        var opt = $.extend({}, {
            relationshipWebURL: "", // [Optional] The name of the Web (site) which contains the relationshipList
            relationshipList: "", // The name of the list which contains the lookup values
            relationshipListColumn: "", // The internal name of the column in the relationship list
            relationshipListSortColumn: "", // [Optional] If specified, sort the options in the dropdown by this column,
            // otherwise the options are sorted by relationshipListColumn
            relationshipListSortAscending: true, // [Optional] By default, the sort is ascending. If false, descending
            columnName: "", // The display name of the column in the form
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            promptText: "", // [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of columnName. IOrignal value "Choose {0}..."
            noneText: "(None)", // [Optional] Text to use for the (None) selection. Provided for non-English language support.
            CAMLQuery: "", // This CAML fragment will be applied to the relationshipList
            CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><ViewAttributes Scope='RecursiveAll'/></QueryOptions>", // Need this to mirror SharePoint's behavior, but it can be overridden
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages; if false, run silent
        }, options);

        var choices = "";
        var columnSelectSelected = null;
        var newMultiLookupPickerdata;
        var columnColumnRequired;
        var thisFunction = "SPServices.SPFilterDropdown";

        // Find the column's select (dropdown)
        var columnSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.columnName
        });
        if (columnSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "columnName: " + opt.columnName, constants.TXTColumnNotFound);
            return;
        }

        // Get the current column selection(s)
        columnSelectSelected = utils.getDropdownSelected(columnSelect, true);

        // Get the relationshipList items which match the current selection
        var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListColumn;
        var sortOrder = (opt.relationshipListSortAscending === true) ? "" : "Ascending='FALSE'";
        var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "' " + sortOrder + "/></OrderBy><Where>";
        if (opt.CAMLQuery.length > 0) {
            camlQuery += opt.CAMLQuery;
        }
        camlQuery += "</Where></Query>";

        // Get information about columnName from the current list
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: opt.listName,
            completefunc: function (xData) {
                $(xData.responseXML).find("Fields").each(function () {
                    $(this).find("Field[DisplayName='" + opt.columnName + "']").each(function () {
                        // Determine whether columnName is Required
                        columnColumnRequired = ($(this).attr("Required") === "TRUE");
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
            completefunc: function (xData) {

                // Handle errors
                $(xData.responseXML).find("errorstring").each(function () {
                    var errorText = $(this).text();
                    if (opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
                        utils.errBox(thisFunction,
                            "relationshipListColumn: " + opt.relationshipListColumn,
                            "Not found in relationshipList " + opt.relationshipList);
                    } else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
                        utils.errBox(thisFunction,
                            "relationshipList: " + opt.relationshipList,
                            "List not found");
                    }

                });

                // Add an explanatory prompt
                switch (columnSelect.Type) {
                    case constants.dropdownType.simple:
                        // Remove all of the existing options
                        $(columnSelect.Obj).find("option").remove();
                        // If the column is required or the promptText option is empty, don't add the prompt text
                        if (!columnColumnRequired && (opt.promptText.length > 0)) {
                            columnSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.columnName) + "</option>");
                        } else if (!columnColumnRequired) {
                            columnSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
                        }
                        break;
                    case constants.dropdownType.complex:
                        // If the column is required, don't add the "(None)" option
                        choices = columnColumnRequired ? "" : opt.noneText + "|0";
                        columnSelect.Obj.val("");
                        break;
                    case constants.dropdownType.multiSelect:
                        // Remove all of the existing options
                        $(columnSelect.master.candidateControl).find("option").remove();
                        newMultiLookupPickerdata = "";
                        break;
                    default:
                        break;
                }

                // Add an option for each item
                $(xData.responseXML).SPFilterNode("z:row").each(function () {

                    var thisOption = {};

                    // If relationshipListColumn is a Lookup column, then the ID should be for the Lookup value,
                    // else the ID of the relationshipList item
                    var thisValue = $(this).attr("ows_" + opt.relationshipListColumn);

                    if (typeof thisValue !== "undefined" && thisValue.indexOf(constants.spDelim) > 0) {
                        thisOption = new utils.SplitIndex(thisValue);
                    } else {
                        thisOption.id = $(this).attr("ows_ID");
                        thisOption.value = thisValue;
                    }

                    // If the relationshipListColumn is a calculated column, then the value isn't preceded by the ID,
                    // but by the datatype.  In this case, thisOption.id should be the ID of the relationshipList item.
                    // e.g., float;#12345.67
                    if (isNaN(thisOption.id)) {
                        thisOption.id = $(this).attr("ows_ID");
                    }

                    switch (columnSelect.Type) {
                        case constants.dropdownType.simple:
                            var selected = ($(this).attr("ows_ID") === columnSelectSelected[0]) ? " selected='selected'" : "";
                            columnSelect.Obj.append("<option" + selected + " value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                            break;
                        case constants.dropdownType.complex:
                            if (thisOption.id === columnSelectSelected[0]) {
                                columnSelect.Obj.val(thisOption.value);
                            }
                            choices = choices + ((choices.length > 0) ? "|" : "") + thisOption.value + "|" + thisOption.id;
                            break;
                        case constants.dropdownType.multiSelect:
                            $(columnSelect.master.candidateControl).append("<option value='" + thisOption.id + "'>" + thisOption.value + "</option>");
                            newMultiLookupPickerdata += thisOption.id + "|t" + thisOption.value + "|t |t |t";
                            break;
                        default:
                            break;
                    }
                });

                switch (columnSelect.Type) {
                    case constants.dropdownType.simple:
                        columnSelect.Obj.trigger("change");
                        break;
                    case constants.dropdownType.complex:
                        columnSelect.Obj.attr("choices", choices);
                        columnSelect.Obj.trigger("propertychange");
                        break;
                    case constants.dropdownType.multiSelect:
                        // Clear the master
                        columnSelect.master.data = "";

                        columnSelect.MultiLookupPickerdata.val(newMultiLookupPickerdata);
                        // Clear any prior selections that are no longer valid
                        $(columnSelect.master.resultControl).find("option").each(function () {
                            var thisSelected = $(this);
                            $(this).attr("selected", "selected");
                            $(columnSelect.master.candidateControl).find("option").each(function () {
                                if ($(this).html() === thisSelected.html()) {
                                    thisSelected.removeAttr("selected");
                                }
                            });
                        });
                        GipRemoveSelectedItems(columnSelect.master);
                        // Hide any options in the candidate list which are already selected
                        $(columnSelect.master.candidateControl).find("option").each(function () {
                            var thisSelected = $(this);
                            $(columnSelect.master.resultControl).find("option").each(function () {
                                if ($(this).html() === thisSelected.html()) {
                                    thisSelected.remove();
                                }
                            });
                        });
                        GipAddSelectedItems(columnSelect.master);
                        // Set master.data to the newly allowable values
                        columnSelect.master.data = GipGetGroupData(newMultiLookupPickerdata);

                        // Trigger a dblclick so that the child will be cascaded if it is a multiselect.
                        $(columnSelect.master.candidateControl).trigger("dblclick");

                        break;
                    default:
                        break;
                }
            }
        });
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPFilterDropdown

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core.js'
], function (
    $
) {

    "use strict";

    // Find an MMS Picker in the page
    // Returns references to:
    //   terms - The aaray of terms as value/guid pairs
    $.fn.SPServices.SPFindMMSPicker = function (options) {

        var opt = $.extend({}, {
            MMSDisplayName: "" // The displayName of the MMS Picker on the form
        }, options);

        var thisTerms = [];

        // Find the div for the column which contains the entered data values
        var thisDiv = $("div[title='" + opt.MMSDisplayName + "']");
        var thisHiddenInput = thisDiv.closest("td").find("input[type='hidden']");
        var thisTermArray = thisHiddenInput.val().split(";");

        for (var i = 0; i < thisTermArray.length; i++) {
            var thisOne = thisTermArray[i].split("|");
            thisTerms.push({
                value: thisOne[0],
                guid: thisOne[1]
            });

        }

        return {
            terms: thisTerms
        };

    }; // End $.fn.SPServices.SPFindMMSPicker

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core.js'
], function (
    $
) {

    "use strict";

    // Find a People Picker in the page
    // Returns references to:
    //   row - The TR which contains the People Picker (useful if you'd like to hide it at some point)
    //   contents - The element which contains the current value
    //   currentValue - The current value if it is set
    //   checkNames - The Check Names image (in case you'd like to click it at some point)
    //   checkNamesPhrase - you can pass your local phrase here to check names, like in russian it would be - ????????? ?????
    $.fn.SPServices.SPFindPeoplePicker = function (options) {

        var opt = $.extend({}, {
            peoplePickerDisplayName: "", // The displayName of the People Picker on the form
            valueToSet: "", // The value to set the People Picker to. Should be a string containing each username or groupname separated by semi-colons.
            checkNames: true, // If set to true, the Check Names image will be clicked to resolve the names
            checkNamesPhrase: 'Check Names' // English default
        }, options);

        var thisRow = $("nobr").filter(function () {
            // Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
            return $(this).contents().eq(0).text() === opt.peoplePickerDisplayName;
        }).closest("tr");

        var thisContents = thisRow.find("div[name='upLevelDiv']");
        var thisCheckNames = thisRow.find("img[Title='" + opt.checkNamesPhrase + "']:first");

        // If a value was provided, set the value
        if (opt.valueToSet.length > 0) {
            thisContents.html(opt.valueToSet);
        }

        // If checkName is true, click the check names icon
        if (opt.checkNames) {
            thisCheckNames.click();
        }
        var thisCurrentValue = $.trim(thisContents.text());

        // Parse the entity data
        var dictionaryEntries = [];

        // IE
        thisContents.children("span").each(function () {

            // Grab the entity data
            var thisData = $(this).find("div[data]").attr("data");

            var dictionaryEntry = {};

            // Entity data is only available in IE
            if (typeof thisData !== "undefined") {
                var arrayOfDictionaryEntry = $.parseXML(thisData);
                var $xml = $(arrayOfDictionaryEntry);

                $xml.find("DictionaryEntry").each(function () {
                    var key = $(this).find("Key").text();
                    dictionaryEntry[key] = $(this).find("Value").text();
                });
                dictionaryEntries.push(dictionaryEntry);
                // For other browsers, we'll call GetUserInfo to get the data
            } else {
                $().SPServices({
                    operation: "GetUserInfo",
                    async: false,
                    cacheXML: true,
                    userLoginName: $(this).attr("title"),
                    completefunc: function (xData) {

                        $(xData.responseXML).find("User").each(function () {

                            $.each(this.attributes, function (i, attrib) {
                                dictionaryEntry[attrib.name] = attrib.value;
                            });
                            dictionaryEntries.push(dictionaryEntry);
                        });
                    }
                });
            }
        });

        return {
            row: thisRow,
            contents: thisContents,
            currentValue: thisCurrentValue,
            checkNames: thisCheckNames,
            dictionaryEntries: dictionaryEntries
        };
    }; // End $.fn.SPServices.SPFindPeoplePicker

    // Mistakenly released previously outside the SPServices namespace. This takes care of offering both.
    $.fn.SPFindPeoplePicker = function (options) {
        return $().SPServices.SPFindPeoplePicker(options);
    }; // End $.fn.SPFindPeoplePicker

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // Function which provides a link on a Lookup column for the user to follow
    // which allows them to add a new value to the Lookup list.
    // Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
    // by Waldek Mastykarz
    $.fn.SPServices.SPLookupAddNew = function (options) {

        var opt = $.extend({}, {
            lookupColumn: "", // The display name of the Lookup column
            promptText: "Add new {0}", // Text to use as prompt + column name
            newWindow: false, // If true, the link will open in a new window *without* passing the Source.
            ContentTypeID: "", // [Optional] Pass the ContentTypeID if you'd like to specify it
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
        }, options);

        var thisFunction = "SPServices.SPLookupAddNew";

        // Find the lookup column's select (dropdown)
        var lookupSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.lookupColumn
        });
        if (lookupSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, constants.TXTColumnNotFound);
            return;
        }

        var newUrl = "";
        var lookupListUrl = "";
        var lookupColumnStaticName = "";
        // Use GetList for the current list to determine the details for the Lookup column
        $().SPServices({
            operation: "GetList",
            async: false,
            cacheXML: true,
            listName: $().SPServices.SPListNameFromUrl(),
            completefunc: function (xData) {
                $(xData.responseXML).find("Field[DisplayName='" + opt.lookupColumn + "']").each(function () {
                    lookupColumnStaticName = $(this).attr("StaticName");
                    // Use GetList for the Lookup column's list to determine the list's URL
                    $().SPServices({
                        operation: "GetList",
                        async: false,
                        cacheXML: true,
                        listName: $(this).attr("List"),
                        completefunc: function (xData) {
                            $(xData.responseXML).find("List").each(function () {
                                lookupListUrl = $(this).attr("WebFullUrl");
                                // Need to handle when list is in the root site
                                lookupListUrl = lookupListUrl !== constants.SLASH ? lookupListUrl + constants.SLASH : lookupListUrl;
                            });
                        }
                    });
                    // Get the NewItem form for the Lookup column's list
                    newUrl = utils.getListFormUrl($(this).attr("List"), "NewForm");
                    // Stop looking;we're done
                    return false;
                });
            }
        });

        if (lookupListUrl.length === 0 && opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "This column does not appear to be a lookup column");
            return;
        }
        if (newUrl.length > 0) {
            // Build the link to the Lookup column's list enclosed in a div with the id="SPLookupAddNew_" + lookupColumnStaticName
            var newHref = lookupListUrl + newUrl;
            // If requested, open the link in a new window and if requested, pass the ContentTypeID
            newHref += opt.newWindow ?
            ((opt.ContentTypeID.length > 0) ? "?ContentTypeID=" + opt.ContentTypeID : "") + "' target='_blank'" :
            "?" + ((opt.ContentTypeID.length > 0) ? "ContentTypeID=" + opt.ContentTypeID + "&" : "") + "Source=" + utils.escapeUrl(location.href) + "'";
            var newLink = "<div id='SPLookupAddNew_" + lookupColumnStaticName + "'>" + "<a href='" + newHref + ">" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a></div>";
            // Append the link to the Lookup columns's formbody table cell
            $(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
        } else if (opt.debug) {
            utils.errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "NewForm cannot be found");
            return;
        }
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPLookupAddNew

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
   //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $
) {

    "use strict";

    // This function allows you to redirect to a another page from a new item form with the new
    // item's ID. This allows chaining of forms from item creation onward.
    $.fn.SPServices.SPRedirectWithID = function (options) {

        var opt = $.extend({}, {
            redirectUrl: "", // Page for the redirect
            qsParamName: "ID" // In some cases, you may want to pass the newly created item's ID with a different
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
        if (typeof queryStringVals.ID === "undefined") {
            lastID = $().SPServices.SPGetLastItemId({
                listName: thisList
            });
            $("form[id='aspnetForm']").each(function () {
                // This page...
                var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
                // ... plus the Source if it exists
                var thisSource = (typeof queryStringVals.Source === "string") ?
                "Source=" + queryStringVals.Source.replace(/\//g, "%2f").replace(/:/g, "%3a") : "";

                var newQS = [];
                if (typeof QSList !== "undefined") {
                    newQS.push("List=" + QSList);
                }
                if (typeof QSRootFolder !== "undefined") {
                    newQS.push("RootFolder=" + QSRootFolder);
                }
                if (typeof QSContentTypeId !== "undefined") {
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

                // Set the new form action
                setTimeout(function() {
                    document.forms.aspnetForm.action = newAction;
                }, 0);
            });
            // If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
            // then do the redirect to redirectUrl with the new lastID, passing along the original Source.
        } else {
            while (queryStringVals.ID === lastID) {
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

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    utils
) {

    "use strict";

    // Function which checks to see if the value for a column on the form is unique in the list.
    $.fn.SPServices.SPRequireUnique = function (options) {

        var opt = $.extend({}, {
            columnStaticName: "Title", // Name of the column
            duplicateAction: 0, // 0 = warn, 1 = prevent
            ignoreCase: false, // If set to true, the function ignores case, if false it looks for an exact match
            initMsg: "This value must be unique.", // Initial message to display after setup
            initMsgCSSClass: "ms-vb", // CSS class for initial message
            errMsg: "This value is not unique.", // Error message to display if not unique
            errMsgCSSClass: "ms-formvalidation", // CSS class for error message
            showDupes: false, // If true, show links to the duplicate item(s) after the error message
            completefunc: null // Function to call on completion of rendering the change.
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
        var columnObj = utils.findFormField(columnDisplayName).find("input[Title^='" + columnDisplayName + "']");
        columnObj.parent().append(firstMsg);

        columnObj.blur(function () {
            var columnValueIDs = [];
            // Get the columnDisplayName's value
            var columnValue = $(this).val();
            if (columnValue.length === 0) {
                return false;
            }

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
                completefunc: function (xData) {
                    var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
                    $(xData.responseXML).SPFilterNode("z:row").each(function () {
                        var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
                        // If this value already exists in columnStaticName and it's not the current item, then save the ID in the array
                        if ((testValue === thisValue) && ($(this).attr("ows_ID") !== thisID)) {
                            columnValueIDs.push([$(this).attr("ows_ID"), $(this).attr("ows_" + opt.columnStaticName)]);
                        }
                    });
                }
            });
            var newMsg = opt.initMsg;
            var msgContainer = $("#SPRequireUnique" + opt.columnStaticName);
            msgContainer.html(newMsg).attr("class", opt.initMsgCSSClass);

            $("input[value='OK']:disabled, input[value='Save']:disabled").removeAttr("disabled");
            if (columnValueIDs.length > 0) {
                newMsg = opt.errMsg;
                msgContainer.html(newMsg).attr("class", opt.errMsgCSSClass);
                if (opt.duplicateAction === 1) {
                    columnObj.focus();
                    $("input[value='OK'], input[value='Save']").attr("disabled", "disabled");
                }
                if (opt.showDupes) {
                    var out = " " + columnValueIDs.length + " duplicate item" + (columnValueIDs.length > 1 ? "s" : "") + ": ";
                    for (var i = 0; i < columnValueIDs.length; i++) {
                        out += "<a href='DispForm.aspx?ID=" + columnValueIDs[i][0] + "&Source=" + location.href + "'>" + columnValueIDs[i][1] + "</a> ";
                    }
                    $("span#SPRequireUnique" + opt.columnStaticName).append(out);
                }
            }

        });
        // If present, call completefunc when all else is done
        if (opt.completefunc !== null) {
            opt.completefunc();
        }
    }; // End $.fn.SPServices.SPRequireUnique

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // Does an audit of a site's list forms to show where script is in use.
    $.fn.SPServices.SPScriptAudit = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] The name of the Web (site) to audit
            listName: "", // [Optional] The name of a specific list to audit. If not present, all lists in the site are audited.
            outputId: "", // The id of the DOM object for output
            auditForms: true, // Audit the form pages
            auditViews: true, // Audit the view pages
            auditPages: true, // Audit the Pages Document Library
            auditPagesListName: "Pages", // The Pages Document Library(ies), if desired. Either a single string or an array of strings.
            showHiddenLists: false, // Show output for hidden lists
            showNoScript: false, // Show output for lists with no scripts (effectively "verbose")
            showSrc: true // Show the source location for included scripts
        }, options);

        var formTypes = [
            ["New", "NewForm.aspx", false],
            ["Display", "DispForm.aspx", false],
            ["Edit", "EditForm.aspx", false]
        ];
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
        var scriptAuditContainer = $("#SPScriptAudit");
        scriptAuditContainer.find("th").attr("class", "ms-vh2-nofilter");

        // Don't bother with the lists if the options don't require them
        if (opt.auditForms || opt.auditViews) {
            // First, get all of the lists within the site
            $().SPServices({
                operation: "GetListCollection",
                webURL: opt.webURL,
                async: false, // Need this to be synchronous so we're assured of a valid value
                completefunc: function (xData) {
                    $(xData.responseXML).find("List").each(function () {
                        listXml = $(this);

                        // If listName has been specified, then only return results for that list
                        if ((opt.listName.length === 0) || (listXml.attr("Title") === opt.listName)) {
                            // Don't work with hidden lists unless we're asked to
                            if ((opt.showHiddenLists && listXml.attr("Hidden") === "False") || !opt.showHiddenLists) {

                                // Audit the list's forms
                                if (opt.auditForms) {
                                    // Get the list's Content Types, therefore the form pages
                                    $().SPServices({
                                        operation: "GetListContentTypes",
                                        webURL: opt.webURL,
                                        listName: listXml.attr("ID"),
                                        async: false, // Need this to be synchronous so we're assured of a valid value
                                        completefunc: function (xData) {
                                            $(xData.responseXML).find("ContentType").each(function () {
                                                // Don't deal with folders
                                                if ($(this).attr("ID").substring(0, 6) !== "0x0120") {
                                                    var formUrls = $(this).find("FormUrls");
                                                    for (var i = 0; i < formTypes.length; i++) {
                                                        // Look for a customized form...
                                                        $(formUrls).find(formTypes[i][0]).each(function () {
                                                            SPScriptAuditPage(opt, listXml, "Form", this.nodeName, ((opt.webURL.length > 0) ? opt.webURL : $().SPServices.SPGetCurrentSite()) + constants.SLASH + $(this).text());
                                                            formTypes[i][2] = true;
                                                        });
                                                        // ...else the uncustomized form
                                                        if (!formTypes[i][2]) {
                                                            var defaultViewUrl = listXml.attr("DefaultViewUrl");
                                                            SPScriptAuditPage(opt, listXml, "Form", formTypes[i][0],
                                                                defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(constants.SLASH) + 1) + formTypes[i][1]);
                                                        }
                                                    }
                                                    // Reset the form types
                                                    for (i = 0; i < formTypes.length; i++) {
                                                        formTypes[i][2] = false;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }

                                // Audit the list's views
                                if (opt.auditViews) {
                                    // Get the list's Views
                                    $().SPServices({
                                        operation: "GetViewCollection",
                                        webURL: opt.webURL,
                                        listName: listXml.attr("ID"),
                                        async: false, // Need this to be synchronous so we're assured of a valid value
                                        completefunc: function (xData) {
                                            $(xData.responseXML).find("View").each(function () {
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
        if (typeof opt.auditPagesListName === "string") {
            numLists = 1;
            listsArray.push(opt.auditPagesListName);
        } else {
            numLists = opt.auditPagesListName.length;
            listsArray = opt.auditPagesListName;
        }

        if (opt.auditPages) {
            for (var i = 0; i < numLists; i++) {
                $().SPServices({
                    operation: "GetList",
                    async: false,
                    cacheXML: true,
                    webURL: opt.webURL,
                    listName: listsArray[i],
                    completefunc: function (xData) {
                        $(xData.responseXML).find("List").each(function () {
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
                    completefunc: function (xData) {
                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                            var thisPageUrl = $(this).attr("ows_FileRef").split(constants.spDelim)[1];
                            var thisTitle = $(this).attr("ows_Title");
                            var thisPageType = (typeof thisTitle !== "undefined") ? thisTitle : "";
                            if (thisPageUrl.indexOf(".aspx") > 0) {
                                SPScriptAuditPage(opt, listXml, "Page", thisPageType, constants.SLASH + thisPageUrl);
                            }
                        });
                    }
                });
            }
        }
        // Remove progress indicator and make the output pretty by cleaning up the ms-alternating CSS class
        scriptAuditContainer.find("tr[class='ms-alternating']:even").removeAttr("class");
    }; // End $.fn.SPServices.SPScriptAudit

    // Displays the usage of scripts in a site
    function SPScriptAuditPage(opt, listXml, pageClass, pageType, pageUrl) {

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
            success: function (xData) {

                var scriptMatch;

                while (scriptMatch = scriptRegex.exec(xData)) {
                    var scriptLanguage = getScriptAttribute(scriptMatch, "language");
                    var scriptType = getScriptAttribute(scriptMatch, "type");
                    var scriptSrc = getScriptAttribute(scriptMatch, "src");
                    if (scriptSrc !== null && scriptSrc.length > 0 && !coreScript(scriptSrc)) {
                        pageScriptSrc.type.push((scriptLanguage !== null && scriptLanguage.length > 0) ? scriptLanguage : scriptType);
                        pageScriptSrc.src.push(scriptSrc);
                        jQueryPage++;
                    }
                }

                // Only show pages without script if we've been asked to do so.
                if ((!opt.showNoScript && (pageScriptSrc.type.length > 0)) || opt.showNoScript) {
                    var pagePath = pageUrl.substring(0, pageUrl.lastIndexOf(constants.SLASH) + 1);
                    var out = "<tr class=ms-alternating>" +
                        "<td class=ms-vb-icon><a href='" + listXml.attr("DefaultViewUrl") + "'><IMG border=0 src='" + listXml.attr("ImageUrl") + "'width=16 height=16></A></TD>" +
                        "<td class=ms-vb2><a href='" + listXml.attr("DefaultViewUrl") + "'>" + listXml.attr("Title") + ((listXml.attr("Hidden") === "True") ? '(Hidden)' : '') + "</td>" +
                        "<td class=ms-vb2>" + pageClass + "</td>" +
                        "<td class=ms-vb2>" + pageType + "</td>" +
                        "<td class=ms-vb2><a href='" + pageUrl + "'>" + utils.fileName(pageUrl) + "</td>";
                    if (opt.showSrc) {
                        var thisSrcPath;
                        out += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
                        for (var i = 0; i < pageScriptSrc.type.length; i++) {
                            thisSrcPath = (pageScriptSrc.src[i].substr(0, 1) !== constants.SLASH) ? pagePath + pageScriptSrc.src[i] : pageScriptSrc.src[i];
                            out += "<tr><td class=ms-vb2 width='30%'>" + pageScriptSrc.type[i] + "</td>";
                            out += "<td class=ms-vb2 width='70%'><a href='" + thisSrcPath + "'>" + utils.fileName(pageScriptSrc.src[i]) + "</td></tr>";
                        }
                        out += "</table></td>";
                    }
                    $("#SPScriptAudit").append(out);
                }
            }
        });
    } // End of function SPScriptAuditPage

    function getScriptAttribute(source, attribute) {
        var matches;
        var regex = RegExp(attribute + "=(\"([^\"]*)\")|('([^']*)')", "gi");
        if (matches = regex.exec(source)) {
            return matches[2];
        }
        return null;
    } // End of function getScriptAttribute

    // Check to see if the script reference is part of SharePoint core so that we can ignore it
    function coreScript(src) {
        var coreScriptLocations = ["WebResource.axd", "_layouts"];
        for (var i = 0; i < coreScriptLocations.length; i++) {
            if (src.indexOf(coreScriptLocations[i]) > -1) {
                return true;
            }
        }
        return false;
    } // End of function coreScript

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    "../utils/constants",
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically
    // based on the values they contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
    $.fn.SPServices.SPSetMultiSelectSizes = function (options) {

        var opt = $.extend({}, {
            listName: $().SPServices.SPListNameFromUrl(), // The list the form is working with. This is useful if the form is not in the list context.
            multiSelectColumn: "",
            minWidth: 0,
            maxWidth: 0,
            debug: false
        }, options);

        var thisFunction = "SPServices.SPSetMultiSelectSizes";

        // Find the multi-select column
        var thisMultiSelect = $().SPServices.SPDropdownCtl({
            displayName: opt.multiSelectColumn
        });
        if (thisMultiSelect.Obj.html() === null && opt.debug) {
            utils.errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, constants.TXTColumnNotFound);
            return;
        }
        if (thisMultiSelect.Type !== constants.dropdownType.multiSelect && opt.debug) {
            utils.errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, "Column is not multi-select.");
            return;
        }

        // Create a temporary clone of the select to use to determine the appropriate width settings.
        // We'll append it to the end of the enclosing span.
        var cloneId = utils.genContainerId("SPSetMultiSelectSizes", opt.multiSelectColumn, opt.listName);
        var cloneObj = $("<select id='" + cloneId + "' ></select>").appendTo(thisMultiSelect.container);
        cloneObj.css({
            "width": "auto", // We want the clone to resize its width based on the contents
            "height": 0, // Just to keep the page clean while we are using the clone
            "visibility": "hidden" // And let's keep it hidden
        });

        // Add all the values to the cloned select.  First the left (possible values) select...
        $(thisMultiSelect.master.candidateControl).find("option").each(function () {
            cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
        });
        // ...then the right (selected values) select (in case some values have already been selected)
        $(thisMultiSelect.master.resultControl).find("option").each(function () {
            cloneObj.append("<option value='" + $(this).val() + "'>" + $(this).html() + "</option>");
        });

        // We'll add 5px for a little padding on the right.
        var divWidth = cloneObj.width() + 5;
        var newDivWidth = divWidth;
        if (opt.minWidth > 0 || opt.maxWidth > 0) {
            if (divWidth < opt.minWidth) {
                divWidth = opt.minWidth;
            }
            if (newDivWidth < opt.minWidth) {
                newDivWidth = opt.minWidth;
            }
            if (newDivWidth > opt.maxWidth) {
                newDivWidth = opt.maxWidth;
            }
        }
        var selectWidth = divWidth;

        // Set the new widths
        $(thisMultiSelect.master.candidateControl).css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");
        $(thisMultiSelect.master.resultControl).css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");

        // Remove the select's clone, since we're done with it
        cloneObj.remove();

    }; // End $.fn.SPServices.SPSetMultiSelectSizes

    return $;

});
/*
* spservices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0-pre-alpha
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2016 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name spservices
* @category Plugins/spservices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
*/
define([
    'jquery',
    '../utils/constants',
    '../core/SPServices.utils',
    //---------------------------
    // We don't need local variables for these dependencies
    // because they are added to the jQuery namespace.
    '../core/SPServices.core'
], function (
    $,
    constants,
    utils
) {

    "use strict";

    // SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.
    $.fn.SPServices.SPUpdateMultipleListItems = function (options) {

        var opt = $.extend({}, {
            webURL: "", // [Optional] URL of the target Web.  If not specified, the current Web is used.
            listName: "", // The list to operate on.
            CAMLQuery: "", // A CAML fragment specifying which items in the list will be selected and updated
            batchCmd: "Update", // The operation to perform. By default, Update.
            valuepairs: [], // Valuepairs for the update in the form [[fieldname1, fieldvalue1], [fieldname2, fieldvalue2]...]
            completefunc: null, // Function to call on completion of rendering the change.
            debug: false // If true, show error messages;if false, run silent
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
            completefunc: function (xData) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    itemsToUpdate.push($(this).attr("ows_ID"));
                    var fileRef = $(this).attr("ows_FileRef");
                    fileRef = "/" + fileRef.substring(fileRef.indexOf(constants.spDelim) + 2);
                    documentsToUpdate.push(fileRef);
                });
            }
        });

        var fieldNum;
        var batch = "<Batch OnError='Continue'>";
        for (i = 0; i < itemsToUpdate.length; i++) {
            batch += "<Method ID='" + i + "' Cmd='" + opt.batchCmd + "'>";
            for (fieldNum = 0; fieldNum < opt.valuepairs.length; fieldNum++) {
                batch += "<Field Name='" + opt.valuepairs[fieldNum][0] + "'>" + utils.escapeColumnValue(opt.valuepairs[fieldNum][1]) + "</Field>";
            }
            batch += "<Field Name='ID'>" + itemsToUpdate[i] + "</Field>";
            if (documentsToUpdate[i].length > 0) {
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
            completefunc: function (xData) {
                // If present, call completefunc when all else is done
                if (opt.completefunc !== null) {
                    opt.completefunc(xData);
                }
            }
        });

    }; // End $.fn.SPServices.SPUpdateMultipleListItems

    return $;

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNQU2VydmljZXMuY29yZS5qcyIsImNvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzIiwiU1BTZXJ2aWNlcy51dGlscy5qcyIsImNvcmUvU1BTZXJ2aWNlcy51dGlscy5qcyIsIlZlcnNpb24uanMiLCJjb3JlL1ZlcnNpb24uanMiLCJjb25zdGFudHMuanMiLCJ1dGlscy9jb25zdGFudHMuanMiLCJTUENvbnZlcnREYXRlVG9JU08uanMiLCJ1dGlscy9TUENvbnZlcnREYXRlVG9JU08uanMiLCJTUERlYnVnWE1MSHR0cFJlc3VsdC5qcyIsInV0aWxzL1NQRGVidWdYTUxIdHRwUmVzdWx0LmpzIiwiU1BEcm9wZG93bkN0bC5qcyIsInV0aWxzL1NQRHJvcGRvd25DdGwuanMiLCJTUEZpbHRlck5vZGUuanMiLCJ1dGlscy9TUEZpbHRlck5vZGUuanMiLCJTUEdldEN1cnJlbnRTaXRlLmpzIiwidXRpbHMvU1BHZXRDdXJyZW50U2l0ZS5qcyIsIlNQR2V0Q3VycmVudFVzZXIuanMiLCJ1dGlscy9TUEdldEN1cnJlbnRVc2VyLmpzIiwiU1BHZXREaXNwbGF5RnJvbVN0YXRpYy5qcyIsInV0aWxzL1NQR2V0RGlzcGxheUZyb21TdGF0aWMuanMiLCJTUEdldExhc3RJdGVtSWQuanMiLCJ1dGlscy9TUEdldExhc3RJdGVtSWQuanMiLCJTUEdldExpc3RJdGVtc0pzb24uanMiLCJ1dGlscy9TUEdldExpc3RJdGVtc0pzb24uanMiLCJTUEdldFF1ZXJ5U3RyaW5nLmpzIiwidXRpbHMvU1BHZXRRdWVyeVN0cmluZy5qcyIsIlNQR2V0U3RhdGljRnJvbURpc3BsYXkuanMiLCJ1dGlscy9TUEdldFN0YXRpY0Zyb21EaXNwbGF5LmpzIiwiU1BMaXN0TmFtZUZyb21VcmwuanMiLCJ1dGlscy9TUExpc3ROYW1lRnJvbVVybC5qcyIsIlNQWG1sVG9Kc29uLmpzIiwidXRpbHMvU1BYbWxUb0pzb24uanMiLCJTUEFycmFuZ2VDaG9pY2VzLmpzIiwidmFsdWUtYWRkZWQvU1BBcnJhbmdlQ2hvaWNlcy5qcyIsIlNQQXV0b2NvbXBsZXRlLmpzIiwidmFsdWUtYWRkZWQvU1BBdXRvY29tcGxldGUuanMiLCJTUENhc2NhZGVEcm9wZG93bnMuanMiLCJ2YWx1ZS1hZGRlZC9TUENhc2NhZGVEcm9wZG93bnMuanMiLCJTUENvbXBsZXhUb1NpbXBsZURyb3Bkb3duLmpzIiwidmFsdWUtYWRkZWQvU1BDb21wbGV4VG9TaW1wbGVEcm9wZG93bi5qcyIsIlNQRGlzcGxheVJlbGF0ZWRJbmZvLmpzIiwidmFsdWUtYWRkZWQvU1BEaXNwbGF5UmVsYXRlZEluZm8uanMiLCJTUEZpbHRlckRyb3Bkb3duLmpzIiwidmFsdWUtYWRkZWQvU1BGaWx0ZXJEcm9wZG93bi5qcyIsIlNQRmluZE1NU1BpY2tlci5qcyIsInZhbHVlLWFkZGVkL1NQRmluZE1NU1BpY2tlci5qcyIsIlNQRmluZFBlb3BsZVBpY2tlci5qcyIsInZhbHVlLWFkZGVkL1NQRmluZFBlb3BsZVBpY2tlci5qcyIsIlNQTG9va3VwQWRkTmV3LmpzIiwidmFsdWUtYWRkZWQvU1BMb29rdXBBZGROZXcuanMiLCJTUFJlZGlyZWN0V2l0aElELmpzIiwidmFsdWUtYWRkZWQvU1BSZWRpcmVjdFdpdGhJRC5qcyIsIlNQUmVxdWlyZVVuaXF1ZS5qcyIsInZhbHVlLWFkZGVkL1NQUmVxdWlyZVVuaXF1ZS5qcyIsIlNQU2NyaXB0QXVkaXQuanMiLCJ2YWx1ZS1hZGRlZC9TUFNjcmlwdEF1ZGl0LmpzIiwiU1BTZXRNdWx0aVNlbGVjdFNpemVzLmpzIiwidmFsdWUtYWRkZWQvU1BTZXRNdWx0aVNlbGVjdFNpemVzLmpzIiwiU1BVcGRhdGVNdWx0aXBsZUxpc3RJdGVtcy5qcyIsInZhbHVlLWFkZGVkL1NQVXBkYXRlTXVsdGlwbGVMaXN0SXRlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9UQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoialF1ZXJ5LlNQU2VydmljZXMtMi4wLjAtcHJlLWFscGhhLmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIvKipcclxuICogT3JpZ2luYWwgU1BTZXJ2aWNlcyBjb3JlIG1vZHVsZXMuLi5cclxuICovXHJcbmRlZmluZShbXHJcbiAgICBcImpxdWVyeVwiLFxyXG4gICAgXCIuLi91dGlscy9jb25zdGFudHNcIixcclxuICAgIFwiLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzXCJcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIC8qIGpzaGludCB1bmRlZjogdHJ1ZSAqL1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTT0FQQWN0aW9uID0gXCJcIjtcclxuICAgIHZhciBTT0FQRW52ZWxvcGUgPSB7XHJcbiAgICAgICAgaGVhZGVyOiBcIjxzb2FwOkVudmVsb3BlIHhtbG5zOnhzaT0naHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnIHhtbG5zOnhzZD0naHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEnIHhtbG5zOnNvYXA9J2h0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3NvYXAvZW52ZWxvcGUvJz48c29hcDpCb2R5PlwiLFxyXG4gICAgICAgIGZvb3RlcjogXCI8L3NvYXA6Qm9keT48L3NvYXA6RW52ZWxvcGU+XCIsXHJcbiAgICAgICAgcGF5bG9hZDogXCJcIlxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBDYWNoaW5nXHJcbiAgICB2YXIgcHJvbWlzZXNDYWNoZSA9IHt9O1xyXG5cclxuICAgIC8vICAgV2ViIFNlcnZpY2UgbmFtZXNcclxuICAgIHZhciB3ZWJTZXJ2aWNlcyA9IHtcclxuICAgICAgICBBTEVSVFM6IFwiQWxlcnRzXCIsXHJcbiAgICAgICAgQVVUSEVOVElDQVRJT046IFwiQXV0aGVudGljYXRpb25cIixcclxuICAgICAgICBDT1BZOiBcIkNvcHlcIixcclxuICAgICAgICBGT1JNUzogXCJGb3Jtc1wiLFxyXG4gICAgICAgIExJU1RTOiBcIkxpc3RzXCIsXHJcbiAgICAgICAgTUVFVElOR1M6IFwiTWVldGluZ3NcIixcclxuICAgICAgICBPRkZJQ0lBTEZJTEU6IFwiT2ZmaWNpYWxGaWxlXCIsXHJcbiAgICAgICAgUEVPUExFOiBcIlBlb3BsZVwiLFxyXG4gICAgICAgIFBFUk1JU1NJT05TOiBcIlBlcm1pc3Npb25zXCIsXHJcbiAgICAgICAgUFVCTElTSEVETElOS1NTRVJWSUNFOiBcIlB1Ymxpc2hlZExpbmtzU2VydmljZVwiLFxyXG4gICAgICAgIFNFQVJDSDogXCJTZWFyY2hcIixcclxuICAgICAgICBTSEFSRVBPSU5URElBR05PU1RJQ1M6IFwiU2hhcmVQb2ludERpYWdub3N0aWNzXCIsXHJcbiAgICAgICAgU0lURURBVEE6IFwiU2l0ZURhdGFcIixcclxuICAgICAgICBTSVRFUzogXCJTaXRlc1wiLFxyXG4gICAgICAgIFNPQ0lBTERBVEFTRVJWSUNFOiBcIlNvY2lhbERhdGFTZXJ2aWNlXCIsXHJcbiAgICAgICAgU1BFTExDSEVDSzogXCJTcGVsbENoZWNrXCIsXHJcbiAgICAgICAgVEFYT05PTVlTRVJWSUNFOiBcIlRheG9ub215Q2xpZW50U2VydmljZVwiLFxyXG4gICAgICAgIFVTRVJHUk9VUDogXCJ1c2VyZ3JvdXBcIixcclxuICAgICAgICBVU0VSUFJPRklMRVNFUlZJQ0U6IFwiVXNlclByb2ZpbGVTZXJ2aWNlXCIsXHJcbiAgICAgICAgVkVSU0lPTlM6IFwiVmVyc2lvbnNcIixcclxuICAgICAgICBWSUVXUzogXCJWaWV3c1wiLFxyXG4gICAgICAgIFdFQlBBUlRQQUdFUzogXCJXZWJQYXJ0UGFnZXNcIixcclxuICAgICAgICBXRUJTOiBcIldlYnNcIixcclxuICAgICAgICBXT1JLRkxPVzogXCJXb3JrZmxvd1wiLFxyXG4gICAgICAgIC8qIE5pbnRleCBXZWIgU2VydmljZSovXHJcbiAgICAgICAgTklOVEVYV09SS0ZMT1c6IFwiTmludGV4V29ya2Zsb3cvV29ya2Zsb3dcIiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBlbmNvZGVPcHRpb25MaXN0ID0gW1wibGlzdE5hbWVcIiwgXCJkZXNjcmlwdGlvblwiXTsgLy8gVXNlZCB0byBlbmNvZGUgb3B0aW9ucyB3aGljaCBtYXkgY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnNcclxuXHJcblxyXG4gICAgLy8gQXJyYXkgdG8gc3RvcmUgV2ViIFNlcnZpY2UgaW5mb3JtYXRpb25cclxuICAgIC8vICBXU29wcy5PcE5hbWUgPSBbV2ViU2VydmljZSwgbmVlZHNfU09BUEFjdGlvbl07XHJcbiAgICAvLyAgICAgIE9wTmFtZSAgICAgICAgICAgICAgVGhlIG5hbWUgb2YgdGhlIFdlYiBTZXJ2aWNlIG9wZXJhdGlvbiAtPiBUaGVzZSBuYW1lcyBhcmUgdW5pcXVlXHJcbiAgICAvLyAgICAgIFdlYlNlcnZpY2UgICAgICAgICAgVGhlIG5hbWUgb2YgdGhlIFdlYlNlcnZpY2UgdGhpcyBvcGVyYXRpb24gYmVsb25ncyB0b1xyXG4gICAgLy8gICAgICBuZWVkc19TT0FQQWN0aW9uICAgIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBvcGVyYXRpb24gbmVlZHMgdG8gaGF2ZSB0aGUgU09BUEFjdGlvbiBwYXNzZWQgaW4gdGhlIHNldFJlcXVlc3RIZWFkZXJmdW5jdGlvbi5cclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIGlmIHRoZSBvcGVyYXRpb24gZG9lcyBhIHdyaXRlLCBlbHNlIGZhbHNlXHJcblxyXG4gICAgdmFyIFdTb3BzID0ge307XHJcblxyXG4gICAgV1NvcHMuR2V0QWxlcnRzID0gW3dlYlNlcnZpY2VzLkFMRVJUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuRGVsZXRlQWxlcnRzID0gW3dlYlNlcnZpY2VzLkFMRVJUUywgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuTW9kZSA9IFt3ZWJTZXJ2aWNlcy5BVVRIRU5USUNBVElPTiwgZmFsc2VdO1xyXG4gICAgV1NvcHMuTG9naW4gPSBbd2ViU2VydmljZXMuQVVUSEVOVElDQVRJT04sIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5Db3B5SW50b0l0ZW1zID0gW3dlYlNlcnZpY2VzLkNPUFksIHRydWVdO1xyXG4gICAgV1NvcHMuQ29weUludG9JdGVtc0xvY2FsID0gW3dlYlNlcnZpY2VzLkNPUFksIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0SXRlbSA9IFt3ZWJTZXJ2aWNlcy5DT1BZLCBmYWxzZV07XHJcblxyXG4gICAgV1NvcHMuR2V0Rm9ybSA9IFt3ZWJTZXJ2aWNlcy5GT1JNUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Rm9ybUNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuRk9STVMsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5BZGRBdHRhY2htZW50ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZERpc2N1c3Npb25Cb2FyZEl0ZW0gPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkTGlzdCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRMaXN0RnJvbUZlYXR1cmUgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuQXBwbHlDb250ZW50VHlwZVRvTGlzdCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5DaGVja0luRmlsZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5DaGVja091dEZpbGUgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuQ3JlYXRlQ29udGVudFR5cGUgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlQXR0YWNobWVudCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVDb250ZW50VHlwZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVDb250ZW50VHlwZVhtbERvY3VtZW50ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZUxpc3QgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0QXR0YWNobWVudENvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3QgPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RBbmRWaWV3ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRMaXN0Q29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdENvbnRlbnRUeXBlID0gW3dlYlNlcnZpY2VzLkxJU1RTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRMaXN0Q29udGVudFR5cGVzID0gW3dlYlNlcnZpY2VzLkxJU1RTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRMaXN0SXRlbUNoYW5nZXMgPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RJdGVtQ2hhbmdlc1NpbmNlVG9rZW4gPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RJdGVtcyA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VmVyc2lvbkNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLlVuZG9DaGVja091dCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVDb250ZW50VHlwZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVDb250ZW50VHlwZXNYbWxEb2N1bWVudCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVDb250ZW50VHlwZVhtbERvY3VtZW50ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUxpc3QgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlTGlzdEl0ZW1zID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5BZGRNZWV0aW5nID0gW3dlYlNlcnZpY2VzLk1FRVRJTkdTLCB0cnVlXTtcclxuICAgIFdTb3BzLkNyZWF0ZVdvcmtzcGFjZSA9IFt3ZWJTZXJ2aWNlcy5NRUVUSU5HUywgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVNZWV0aW5nID0gW3dlYlNlcnZpY2VzLk1FRVRJTkdTLCB0cnVlXTtcclxuICAgIFdTb3BzLlNldFdvcmtTcGFjZVRpdGxlID0gW3dlYlNlcnZpY2VzLk1FRVRJTkdTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5HZXRSZWNvcmRSb3V0aW5nID0gW3dlYlNlcnZpY2VzLk9GRklDSUFMRklMRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0UmVjb3JkUm91dGluZ0NvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuT0ZGSUNJQUxGSUxFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRTZXJ2ZXJJbmZvID0gW3dlYlNlcnZpY2VzLk9GRklDSUFMRklMRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuU3VibWl0RmlsZSA9IFt3ZWJTZXJ2aWNlcy5PRkZJQ0lBTEZJTEUsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLlJlc29sdmVQcmluY2lwYWxzID0gW3dlYlNlcnZpY2VzLlBFT1BMRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5TZWFyY2hQcmluY2lwYWxzID0gW3dlYlNlcnZpY2VzLlBFT1BMRSwgZmFsc2VdO1xyXG5cclxuICAgIFdTb3BzLkFkZFBlcm1pc3Npb24gPSBbd2ViU2VydmljZXMuUEVSTUlTU0lPTlMsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkUGVybWlzc2lvbkNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuUEVSTUlTU0lPTlMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0UGVybWlzc2lvbkNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuUEVSTUlTU0lPTlMsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlUGVybWlzc2lvbiA9IFt3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVQZXJtaXNzaW9uQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVQZXJtaXNzaW9uID0gW3dlYlNlcnZpY2VzLlBFUk1JU1NJT05TLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5HZXRMaW5rcyA9IFt3ZWJTZXJ2aWNlcy5QVUJMSVNIRURMSU5LU1NFUlZJQ0UsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkdldFBvcnRhbFNlYXJjaEluZm8gPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRRdWVyeVN1Z2dlc3Rpb25zID0gW3dlYlNlcnZpY2VzLlNFQVJDSCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0U2VhcmNoTWV0YWRhdGEgPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcbiAgICBXU29wcy5RdWVyeSA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuICAgIFdTb3BzLlF1ZXJ5RXggPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcbiAgICBXU29wcy5SZWdpc3RyYXRpb24gPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcbiAgICBXU29wcy5TdGF0dXMgPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcblxyXG4gICAgV1NvcHMuU2VuZENsaWVudFNjcmlwdEVycm9yUmVwb3J0ID0gW3dlYlNlcnZpY2VzLlNIQVJFUE9JTlRESUFHTk9TVElDUywgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuR2V0QXR0YWNobWVudHMgPSBbd2ViU2VydmljZXMuU0lURURBVEEsIGZhbHNlXTtcclxuICAgIFdTb3BzLkVudW1lcmF0ZUZvbGRlciA9IFt3ZWJTZXJ2aWNlcy5TSVRFREFUQSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuU2l0ZURhdGFHZXRMaXN0ID0gW3dlYlNlcnZpY2VzLlNJVEVEQVRBLCBmYWxzZV07XHJcbiAgICBXU29wcy5TaXRlRGF0YUdldExpc3RDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlNJVEVEQVRBLCBmYWxzZV07XHJcbiAgICBXU29wcy5TaXRlRGF0YUdldFNpdGUgPSBbd2ViU2VydmljZXMuU0lURURBVEEsIGZhbHNlXTtcclxuICAgIFdTb3BzLlNpdGVEYXRhR2V0U2l0ZVVybCA9IFt3ZWJTZXJ2aWNlcy5TSVRFREFUQSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuU2l0ZURhdGFHZXRXZWIgPSBbd2ViU2VydmljZXMuU0lURURBVEEsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5DcmVhdGVXZWIgPSBbd2ViU2VydmljZXMuU0lURVMsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlV2ViID0gW3dlYlNlcnZpY2VzLlNJVEVTLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFNpdGUgPSBbd2ViU2VydmljZXMuU0lURVMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFNpdGVUZW1wbGF0ZXMgPSBbd2ViU2VydmljZXMuU0lURVMsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5BZGRDb21tZW50ID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFRhZyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRUYWdCeUtleXdvcmQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQ291bnRDb21tZW50c09mVXNlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuQ291bnRDb21tZW50c09mVXNlck9uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5Db3VudENvbW1lbnRzT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkNvdW50UmF0aW5nc09uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5Db3VudFRhZ3NPZlVzZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkRlbGV0ZUNvbW1lbnQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlUmF0aW5nID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZVRhZyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVUYWdCeUtleXdvcmQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlVGFncyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRBbGxUYWdUZXJtcyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0QWxsVGFnVGVybXNGb3JVcmxGb2xkZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEFsbFRhZ1VybHMgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEFsbFRhZ1VybHNCeUtleXdvcmQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbW1lbnRzT2ZVc2VyID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDb21tZW50c09mVXNlck9uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDb21tZW50c09uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSYXRpbmdBdmVyYWdlT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJhdGluZ09mVXNlck9uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSYXRpbmdPblVybCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0UmF0aW5nc09mVXNlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0UmF0aW5nc09uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRTb2NpYWxEYXRhRm9yRnVsbFJlcGxpY2F0aW9uID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRUYWdzID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFRhZ3NPZlVzZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnVGVybXMgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnVGVybXNPZlVzZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnVGVybXNPblVybCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdVcmxzT2ZVc2VyID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFRhZ1VybHNPZlVzZXJCeUtleXdvcmQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnVXJscyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdVcmxzQnlLZXl3b3JkID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlNldFJhdGluZyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVDb21tZW50ID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5TcGVsbENoZWNrID0gW3dlYlNlcnZpY2VzLlNQRUxMQ0hFQ0ssIGZhbHNlXTtcclxuXHJcbiAgICAvLyBUYXhvbm9teSBTZXJ2aWNlIENhbGxzXHJcbiAgICAvLyBVcGRhdGVkIDIwMTEuMDEuMjcgYnkgVGhvbWFzIE1jTWlsbGFuXHJcbiAgICBXU29wcy5BZGRUZXJtcyA9IFt3ZWJTZXJ2aWNlcy5UQVhPTk9NWVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0Q2hpbGRUZXJtc0luVGVybSA9IFt3ZWJTZXJ2aWNlcy5UQVhPTk9NWVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENoaWxkVGVybXNJblRlcm1TZXQgPSBbd2ViU2VydmljZXMuVEFYT05PTVlTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRLZXl3b3JkVGVybXNCeUd1aWRzID0gW3dlYlNlcnZpY2VzLlRBWE9OT01ZU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VGVybXNCeUxhYmVsID0gW3dlYlNlcnZpY2VzLlRBWE9OT01ZU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VGVybVNldHMgPSBbd2ViU2VydmljZXMuVEFYT05PTVlTRVJWSUNFLCBmYWxzZV07XHJcblxyXG4gICAgV1NvcHMuQWRkR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZEdyb3VwVG9Sb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRSb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRSb2xlRGVmID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRVc2VyQ29sbGVjdGlvblRvR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFVzZXJDb2xsZWN0aW9uVG9Sb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRVc2VyVG9Hcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkVXNlclRvUm9sZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0QWxsVXNlckNvbGxlY3Rpb25Gcm9tV2ViID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0R3JvdXBDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0R3JvdXBDb2xsZWN0aW9uRnJvbVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRHcm91cENvbGxlY3Rpb25Gcm9tU2l0ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEdyb3VwQ29sbGVjdGlvbkZyb21Vc2VyID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0R3JvdXBDb2xsZWN0aW9uRnJvbVdlYiA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEdyb3VwSW5mbyA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJvbGVDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Um9sZUNvbGxlY3Rpb25Gcm9tR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlQ29sbGVjdGlvbkZyb21Vc2VyID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Um9sZUNvbGxlY3Rpb25Gcm9tV2ViID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Um9sZUluZm8gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlc0FuZFBlcm1pc3Npb25zRm9yQ3VycmVudFVzZXIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlc0FuZFBlcm1pc3Npb25zRm9yU2l0ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckNvbGxlY3Rpb25Gcm9tR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyQ29sbGVjdGlvbkZyb21Sb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckNvbGxlY3Rpb25Gcm9tU2l0ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJDb2xsZWN0aW9uRnJvbVdlYiA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJJbmZvID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckxvZ2luRnJvbUVtYWlsID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuUmVtb3ZlR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZUdyb3VwRnJvbVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJDb2xsZWN0aW9uRnJvbUdyb3VwID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVVc2VyQ29sbGVjdGlvbkZyb21Sb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVVc2VyQ29sbGVjdGlvbkZyb21TaXRlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVVc2VyRnJvbUdyb3VwID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVVc2VyRnJvbVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJGcm9tU2l0ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlVXNlckZyb21XZWIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUdyb3VwSW5mbyA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlUm9sZURlZkluZm8gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZVJvbGVJbmZvID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVVc2VySW5mbyA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkFkZENvbGxlYWd1ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkTWVtYmVyc2hpcCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkUGlubmVkTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQ3JlYXRlTWVtYmVyR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkNyZWF0ZVVzZXJQcm9maWxlQnlBY2NvdW50TmFtZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0Q29tbW9uQ29sbGVhZ3VlcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbW1vbk1hbmFnZXIgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDb21tb25NZW1iZXJzaGlwcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEluQ29tbW9uID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0UHJvcGVydHlDaG9pY2VMaXN0ID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckNvbGxlYWd1ZXMgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyTGlua3MgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyTWVtYmVyc2hpcHMgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyUGlubmVkTGlua3MgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyUHJvZmlsZUJ5R3VpZCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJQcm9maWxlQnlJbmRleCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJQcm9maWxlQnlOYW1lID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlclByb2ZpbGVDb3VudCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJQcm9maWxlU2NoZW1hID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlclByb3BlcnR5QnlBY2NvdW50TmFtZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLk1vZGlmeVVzZXJQcm9wZXJ0eUJ5QWNjb3VudE5hbWUgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZUFsbENvbGxlYWd1ZXMgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZUFsbExpbmtzID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVBbGxNZW1iZXJzaGlwcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlQWxsUGlubmVkTGlua3MgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZUNvbGxlYWd1ZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlTWVtYmVyc2hpcCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlUGlubmVkTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlQ29sbGVhZ3VlUHJpdmFjeSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlTWVtYmVyc2hpcFByaXZhY3kgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZVBpbm5lZExpbmsgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5EZWxldGVBbGxWZXJzaW9ucyA9IFt3ZWJTZXJ2aWNlcy5WRVJTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVWZXJzaW9uID0gW3dlYlNlcnZpY2VzLlZFUlNJT05TLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFZlcnNpb25zID0gW3dlYlNlcnZpY2VzLlZFUlNJT05TLCBmYWxzZV07XHJcbiAgICBXU29wcy5SZXN0b3JlVmVyc2lvbiA9IFt3ZWJTZXJ2aWNlcy5WRVJTSU9OUywgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuQWRkVmlldyA9IFt3ZWJTZXJ2aWNlcy5WSUVXUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVWaWV3ID0gW3dlYlNlcnZpY2VzLlZJRVdTLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFZpZXcgPSBbd2ViU2VydmljZXMuVklFV1MsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFZpZXdIdG1sID0gW3dlYlNlcnZpY2VzLlZJRVdTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRWaWV3Q29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5WSUVXUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuVXBkYXRlVmlldyA9IFt3ZWJTZXJ2aWNlcy5WSUVXUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVWaWV3SHRtbCA9IFt3ZWJTZXJ2aWNlcy5WSUVXUywgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuQWRkV2ViUGFydCA9IFt3ZWJTZXJ2aWNlcy5XRUJQQVJUUEFHRVMsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkV2ViUGFydFRvWm9uZSA9IFt3ZWJTZXJ2aWNlcy5XRUJQQVJUUEFHRVMsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlV2ViUGFydCA9IFt3ZWJTZXJ2aWNlcy5XRUJQQVJUUEFHRVMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0V2ViUGFydDIgPSBbd2ViU2VydmljZXMuV0VCUEFSVFBBR0VTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRXZWJQYXJ0UGFnZSA9IFt3ZWJTZXJ2aWNlcy5XRUJQQVJUUEFHRVMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFdlYlBhcnRQcm9wZXJ0aWVzID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0V2ViUGFydFByb3BlcnRpZXMyID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuU2F2ZVdlYlBhcnQyID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuV2Vic0NyZWF0ZUNvbnRlbnRUeXBlID0gW3dlYlNlcnZpY2VzLldFQlMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0Q29sdW1ucyA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDb250ZW50VHlwZSA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDb250ZW50VHlwZXMgPSBbd2ViU2VydmljZXMuV0VCUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Q3VzdG9taXplZFBhZ2VTdGF0dXMgPSBbd2ViU2VydmljZXMuV0VCUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdFRlbXBsYXRlcyA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRPYmplY3RJZEZyb21VcmwgPSBbd2ViU2VydmljZXMuV0VCUywgZmFsc2VdOyAvLyAyMDEwXHJcbiAgICBXU29wcy5HZXRXZWIgPSBbd2ViU2VydmljZXMuV0VCUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0V2ViQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRBbGxTdWJXZWJDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUNvbHVtbnMgPSBbd2ViU2VydmljZXMuV0VCUywgdHJ1ZV07XHJcbiAgICBXU29wcy5XZWJzVXBkYXRlQ29udGVudFR5cGUgPSBbd2ViU2VydmljZXMuV0VCUywgdHJ1ZV07XHJcbiAgICBXU29wcy5XZWJVcmxGcm9tUGFnZVVybCA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcblxyXG4gICAgV1NvcHMuQWx0ZXJUb0RvID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCB0cnVlXTtcclxuICAgIFdTb3BzLkNsYWltUmVsZWFzZVRhc2sgPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGVtcGxhdGVzRm9ySXRlbSA9IFt3ZWJTZXJ2aWNlcy5XT1JLRkxPVywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VG9Eb3NGb3JJdGVtID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRXb3JrZmxvd0RhdGFGb3JJdGVtID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRXb3JrZmxvd1Rhc2tEYXRhID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCBmYWxzZV07XHJcbiAgICBXU29wcy5TdGFydFdvcmtmbG93ID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCB0cnVlXTtcclxuXHJcblx0Ly9OaW50ZXggXHJcbiAgICBXU29wcy5BZGRMb25nVGVybURlbGVnYXRpb25SdWxlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFdvcmtmbG93U2NoZWR1bGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkV29ya2Zsb3dTY2hlZHVsZU9uTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkNoZWNrR2xvYmFsUmV1c2VTdGF0dXMgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkNoZWNrSW5Gb3JtcyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuRGVsZWdhdGVBbGxUYXNrcyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuRGVsZWdhdGVUYXNrID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5EZWxldGVMb25nVGVybURlbGVnYXRpb25SdWxlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5EZWxldGVTbmlwcGV0ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5EZWxldGVXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuRXhwb3J0V29ya2Zsb3cgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG4gICAgV1NvcHMuRml4V29ya2Zsb3dzSW5TaXRlRnJvbVRlbXBsYXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRGb2xkZXJzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRJdGVtc1BlbmRpbmdNeUFwcHJvdmFsID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRMaXN0Q29udGVudFR5cGVzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRPdXRjb21lc0ZvckZsZXhpVGFzayA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0UnVubmluZ1dvcmtmbG93VGFza3MgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldFJ1bm5pbmdXb3JrZmxvd1Rhc2tzQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0UnVubmluZ1dvcmtmbG93VGFza3NGb3JDdXJyZW50VXNlciA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0UnVubmluZ1dvcmtmbG93VGFza3NGb3JDdXJyZW50VXNlckZvckxpc3RJdGVtID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0Zvckxpc3RJdGVtID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRUYXNrRGV0YWlsc1VzaW5nU3R1YiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0VGFza1N0dWJzRm9yQ3VycmVudFVzZXIgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldFdvcmtmbG93SGlzdG9yeSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0V29ya2Zsb3dIaXN0b3J5Rm9yTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkhpZGVUYXNrRm9yQXBwcm92ZXIgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkhpZGVXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHJvY2Vzc0ZsZXhpVGFza1Jlc3BvbnNlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Qcm9jZXNzRmxleGlUYXNrUmVzcG9uc2UyID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Qcm9jZXNzVGFza1Jlc3BvbnNlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Qcm9jZXNzVGFza1Jlc3BvbnNlMiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHJvY2Vzc1Rhc2tSZXNwb25zZTMgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlByb2Nlc3NUYXNrUmVzcG9uc2VVc2luZ1Rva2VuID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZOb092ZXJ3cml0ZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZTa2lwVmFsaWRhdGlvbiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZTa2lwVmFsaWRhdGlvbk5vT3ZlcndyaXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlhtbCA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZYbWxOb092ZXJ3cml0ZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZYbWxTa2lwVmFsaWRhdGlvbiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHVibGlzaEZyb21OV0ZYbWxTa2lwVmFsaWRhdGlvbk5vT3ZlcndyaXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoV29ya2Zsb3cgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlF1ZXJ5Rm9yTWVzc2FnZXMgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlJlbW92ZVdvcmtmbG93U2NoZWR1bGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlJlbW92ZVdvcmtmbG93U2NoZWR1bGVPbkxpc3RJdGVtID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TYXZlRnJvbU5XRiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZUZyb21OV0ZOb092ZXJ3cml0ZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZUZyb21OV0ZYbWwgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVGcm9tTldGWG1sTm9PdmVyd3JpdGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVTbmlwcGV0ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TYXZlVGVtcGxhdGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVUZW1wbGF0ZTIgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU25pcHBldEV4aXN0cyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU3RhcnRTaXRlV29ya2Zsb3cgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLk5pbnRleFN0YXJ0V29ya2Zsb3cgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlN0YXJ0V29ya2Zsb3dPbkxpc3RJdGVtID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5UZW1wbGF0ZUV4aXN0cyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuVGVybWluYXRlV29ya2Zsb3cgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlRlcm1pbmF0ZVdvcmtmbG93QnlOYW1lID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5UZXJtaW5hdGVXb3JrZmxvd0J5TmFtZUZvckxpc3RJdGVtID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Xb3JrZmxvd0V4aXN0cyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuV29ya2Zsb3dGb3JtUHJvZHVjdFNlbGVjdGVkID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHJcblxyXG4gICAgLy8gTWFpbiBmdW5jdGlvbiwgd2hpY2ggY2FsbHMgU2hhcmVQb2ludCdzIFdlYiBTZXJ2aWNlcyBkaXJlY3RseS5cclxuICAgICQuZm4uU1BTZXJ2aWNlcyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBvcHRpb25zIHBhc3NlZCBpbiwgdXNlIHRoZSBkZWZhdWx0cy4gIEV4dGVuZCByZXBsYWNlcyBlYWNoIGRlZmF1bHQgd2l0aCB0aGUgcGFzc2VkIG9wdGlvbi5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sICQuZm4uU1BTZXJ2aWNlcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZSBvcHRpb25zIHdoaWNoIG1heSBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVyLCBlc3AuIGFtcGVyc2FuZFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jb2RlT3B0aW9uTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdFtlbmNvZGVPcHRpb25MaXN0W2ldXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgb3B0W2VuY29kZU9wdGlvbkxpc3RbaV1dID0gdXRpbHMuZW5jb2RlWG1sKG9wdFtlbmNvZGVPcHRpb25MaXN0W2ldXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFB1dCB0b2dldGhlciBvcGVyYXRpb24gaGVhZGVyIGFuZCBTT0FQQWN0aW9uIGZvciB0aGUgU09BUCBjYWxsIGJhc2VkIG9uIHdoaWNoIFdlYiBTZXJ2aWNlIHdlJ3JlIGNhbGxpbmdcclxuICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgPSBcIjxcIiArIG9wdC5vcGVyYXRpb24gKyBcIiBcIjtcclxuXHJcblxyXG5cclxuICAgICAgICBzd2l0Y2ggKFdTb3BzW29wdC5vcGVyYXRpb25dWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuQUxFUlRTOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwLzIwMDIvMS9hbGVydHMvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwLzIwMDIvMS9hbGVydHMvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5NRUVUSU5HUzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9tZWV0aW5ncy8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvbWVldGluZ3MvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5PRkZJQ0lBTEZJTEU6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvcmVjb3Jkc3JlcG9zaXRvcnkvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL3JlY29yZHNyZXBvc2l0b3J5L1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuUEVSTUlTU0lPTlM6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvZGlyZWN0b3J5LycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9kaXJlY3RvcnkvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5QVUJMSVNIRURMSU5LU1NFUlZJQ0U6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0naHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvU2hhcmVQb2ludFBvcnRhbFNlcnZlci9QdWJsaXNoZWRMaW5rc1NlcnZpY2UvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9TaGFyZVBvaW50UG9ydGFsU2VydmVyL1B1Ymxpc2hlZExpbmtzU2VydmljZS9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLlNFQVJDSDpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSd1cm46TWljcm9zb2Z0LlNlYXJjaCcgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwidXJuOk1pY3Jvc29mdC5TZWFyY2gvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5TSEFSRVBPSU5URElBR05PU1RJQ1M6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL2RpYWdub3N0aWNzLycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS9zaGFyZXBvaW50L2RpYWdub3N0aWNzL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0U6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0naHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvU2hhcmVQb2ludFBvcnRhbFNlcnZlci9Tb2NpYWxEYXRhU2VydmljZScgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwiaHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvU2hhcmVQb2ludFBvcnRhbFNlcnZlci9Tb2NpYWxEYXRhU2VydmljZS9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLlNQRUxMQ0hFQ0s6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0naHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS9zaGFyZXBvaW50L3B1Ymxpc2hpbmcvc3BlbGxpbmcvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3NoYXJlcG9pbnQvcHVibGlzaGluZy9zcGVsbGluZy9TcGVsbENoZWNrXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5UQVhPTk9NWVNFUlZJQ0U6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3RheG9ub215L3NvYXAvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi90YXhvbm9teS9zb2FwL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuVVNFUkdST1VQOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL2RpcmVjdG9yeS8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvZGlyZWN0b3J5L1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J2h0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL1NoYXJlUG9pbnRQb3J0YWxTZXJ2ZXIvVXNlclByb2ZpbGVTZXJ2aWNlJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9TaGFyZVBvaW50UG9ydGFsU2VydmVyL1VzZXJQcm9maWxlU2VydmljZS9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLldFQlBBUlRQQUdFUzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS9zaGFyZXBvaW50L3dlYnBhcnRwYWdlcycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwiaHR0cDovL21pY3Jvc29mdC5jb20vc2hhcmVwb2ludC93ZWJwYXJ0cGFnZXMvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5XT1JLRkxPVzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC93b3JrZmxvdy8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvd29ya2Zsb3cvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC8nPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSBvcGVyYXRpb24gdG8gdGhlIFNPQVBBY3Rpb24gYW5kIG9wZm9vdGVyXHJcbiAgICAgICAgU09BUEFjdGlvbiArPSBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgIFNPQVBFbnZlbG9wZS5vcGZvb3RlciA9IFwiPC9cIiArIG9wdC5vcGVyYXRpb24gKyBcIj5cIjtcclxuXHJcbiAgICAgICAgLy8gQnVpbGQgdGhlIFVSTCBmb3IgdGhlIEFqYXggY2FsbCBiYXNlZCBvbiB3aGljaCBvcGVyYXRpb24gd2UncmUgY2FsbGluZ1xyXG4gICAgICAgIC8vIElmIHRoZSB3ZWJVUkwgaGFzIGJlZW4gcHJvdmlkZWQsIHRoZW4gdXNlIGl0LCBlbHNlIHVzZSB0aGUgY3VycmVudCBzaXRlXHJcbiAgICAgICAgdmFyIGFqYXhVUkwgPSBcIl92dGlfYmluL1wiICsgV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMF0gKyBcIi5hc214XCI7XHJcbiAgICAgICAgdmFyIHdlYlVSTCA9IG9wdC53ZWJVUkwgIT09IHVuZGVmaW5lZCA/IG9wdC53ZWJVUkwgOiBvcHQud2ViVXJsO1xyXG4gICAgICAgIGlmICh3ZWJVUkwuY2hhckF0KHdlYlVSTC5sZW5ndGggLSAxKSA9PT0gY29uc3RhbnRzLlNMQVNIKSB7XHJcbiAgICAgICAgICAgIGFqYXhVUkwgPSB3ZWJVUkwgKyBhamF4VVJMO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2ViVVJMLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYWpheFVSTCA9IHdlYlVSTCArIGNvbnN0YW50cy5TTEFTSCArIGFqYXhVUkw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNTaXRlID0gJCgpLlNQU2VydmljZXMuU1BHZXRDdXJyZW50U2l0ZSgpO1xyXG4gICAgICAgICAgICBhamF4VVJMID0gdGhpc1NpdGUgKyAoKHRoaXNTaXRlLmNoYXJBdCh0aGlzU2l0ZS5sZW5ndGggLSAxKSA9PT0gY29uc3RhbnRzLlNMQVNIKSA/IGFqYXhVUkwgOiAoY29uc3RhbnRzLlNMQVNIICsgYWpheFVSTCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgPSBcIlwiO1xyXG4gICAgICAgIC8vIEVhY2ggb3BlcmF0aW9uIHJlcXVpcmVzIGEgZGlmZmVyZW50IHNldCBvZiB2YWx1ZXMuICBUaGlzIHN3aXRjaCBzdGF0ZW1lbnQgc2V0cyB0aGVtIHVwIGluIHRoZSBTT0FQRW52ZWxvcGUucGF5bG9hZC5cclxuICAgICAgICBzd2l0Y2ggKG9wdC5vcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy8gQUxFUlQgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxlcnRzXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZUFsZXJ0c1wiOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8SURzPlwiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5JRHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBjb25zdGFudHMud3JhcE5vZGUoXCJzdHJpbmdcIiwgb3B0LklEc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvSURzPlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBBVVRIRU5USUNBVElPTiBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJNb2RlXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvZ2luXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJuYW1lXCIsIFwicGFzc3dvcmRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBDT1BZIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkNvcHlJbnRvSXRlbXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiU291cmNlVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPERlc3RpbmF0aW9uVXJscz5cIjtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQuRGVzdGluYXRpb25VcmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUoXCJzdHJpbmdcIiwgb3B0LkRlc3RpbmF0aW9uVXJsc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvRGVzdGluYXRpb25VcmxzPlwiO1xyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJGaWVsZHNcIiwgXCJTdHJlYW1cIiwgXCJSZXN1bHRzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ29weUludG9JdGVtc0xvY2FsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIlNvdXJjZVVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxEZXN0aW5hdGlvblVybHM+XCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0LkRlc3RpbmF0aW9uVXJscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKFwic3RyaW5nXCIsIG9wdC5EZXN0aW5hdGlvblVybHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8L0Rlc3RpbmF0aW9uVXJscz5cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0SXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJVcmxcIiwgXCJGaWVsZHNcIiwgXCJTdHJlYW1cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBGT1JNIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkdldEZvcm1cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJmb3JtVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Rm9ybUNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBMSVNUIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZEF0dGFjaG1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJsaXN0SXRlbUlEXCIsIFwiZmlsZU5hbWVcIiwgXCJhdHRhY2htZW50XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkRGlzY3Vzc2lvbkJvYXJkSXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcIm1lc3NhZ2VcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRMaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJ0ZW1wbGF0ZUlEXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkTGlzdEZyb21GZWF0dXJlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJmZWF0dXJlSURcIiwgXCJ0ZW1wbGF0ZUlEXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQXBwbHlDb250ZW50VHlwZVRvTGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ3ZWJVcmxcIiwgXCJjb250ZW50VHlwZUlkXCIsIFwibGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDaGVja0luRmlsZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwiY29tbWVudFwiLCBcIkNoZWNraW5UeXBlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ2hlY2tPdXRGaWxlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJjaGVja291dFRvTG9jYWxcIiwgXCJsYXN0bW9kaWZpZWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDcmVhdGVDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImRpc3BsYXlOYW1lXCIsIFwicGFyZW50VHlwZVwiLCBcImZpZWxkc1wiLCBcImNvbnRlbnRUeXBlUHJvcGVydGllc1wiLCBcImFkZFRvVmlld1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZUF0dGFjaG1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJsaXN0SXRlbUlEXCIsIFwidXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQ29udGVudFR5cGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJjb250ZW50VHlwZUlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQ29udGVudFR5cGVYbWxEb2N1bWVudFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImNvbnRlbnRUeXBlSWRcIiwgXCJkb2N1bWVudFVyaVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZUxpc3RcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBdHRhY2htZW50Q29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBbXCJsaXN0SXRlbUlEXCIsIFwiSURcIl1dKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RBbmRWaWV3XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwidmlld05hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0Q29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0Q29udGVudFR5cGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJjb250ZW50VHlwZUlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlzdENvbnRlbnRUeXBlc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RJdGVtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCIsIFtcInF1ZXJ5XCIsIFwiQ0FNTFF1ZXJ5XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInZpZXdGaWVsZHNcIiwgXCJDQU1MVmlld0ZpZWxkc1wiXSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJyb3dMaW1pdFwiLCBcIkNBTUxSb3dMaW1pdFwiXSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJxdWVyeU9wdGlvbnNcIiwgXCJDQU1MUXVlcnlPcHRpb25zXCJdXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlzdEl0ZW1DaGFuZ2VzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwidmlld0ZpZWxkc1wiLCBcInNpbmNlXCIsIFwiY29udGFpbnNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0SXRlbUNoYW5nZXNTaW5jZVRva2VuXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwidmlld05hbWVcIiwgW1wicXVlcnlcIiwgXCJDQU1MUXVlcnlcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1widmlld0ZpZWxkc1wiLCBcIkNBTUxWaWV3RmllbGRzXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInJvd0xpbWl0XCIsIFwiQ0FNTFJvd0xpbWl0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInF1ZXJ5T3B0aW9uc1wiLCBcIkNBTUxRdWVyeU9wdGlvbnNcIl0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjaGFuZ2VUb2tlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kTnVsbDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiY29udGFpbnNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZE51bGw6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFZlcnNpb25Db2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInN0cmxpc3RJRFwiLCBcInN0cmxpc3RJdGVtSURcIiwgXCJzdHJGaWVsZE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVbmRvQ2hlY2tPdXRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbnRlbnRUeXBlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiY29udGVudFR5cGVJZFwiLCBcImNvbnRlbnRUeXBlUHJvcGVydGllc1wiLCBcIm5ld0ZpZWxkc1wiLCBcInVwZGF0ZUZpZWxkc1wiLCBcImRlbGV0ZUZpZWxkc1wiLCBcImFkZFRvVmlld1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbnRlbnRUeXBlc1htbERvY3VtZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwibmV3RG9jdW1lbnRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVDb250ZW50VHlwZVhtbERvY3VtZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiY29udGVudFR5cGVJZFwiLCBcIm5ld0RvY3VtZW50XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlTGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImxpc3RQcm9wZXJ0aWVzXCIsIFwibmV3RmllbGRzXCIsIFwidXBkYXRlRmllbGRzXCIsIFwiZGVsZXRlRmllbGRzXCIsIFwibGlzdFZlcnNpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVMaXN0SXRlbXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQudXBkYXRlcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQudXBkYXRlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cGRhdGVzXCJdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8dXBkYXRlcz48QmF0Y2ggT25FcnJvcj0nQ29udGludWUnPjxNZXRob2QgSUQ9JzEnIENtZD0nXCIgKyBvcHQuYmF0Y2hDbWQgKyBcIic+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC52YWx1ZXBhaXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPEZpZWxkIE5hbWU9J1wiICsgb3B0LnZhbHVlcGFpcnNbaV1bMF0gKyBcIic+XCIgKyB1dGlscy5lc2NhcGVDb2x1bW5WYWx1ZShvcHQudmFsdWVwYWlyc1tpXVsxXSkgKyBcIjwvRmllbGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuYmF0Y2hDbWQgIT09IFwiTmV3XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8RmllbGQgTmFtZT0nSUQnPlwiICsgb3B0LklEICsgXCI8L0ZpZWxkPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvTWV0aG9kPjwvQmF0Y2g+PC91cGRhdGVzPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBNRUVUSU5HUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRNZWV0aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9yZ2FuaXplckVtYWlsXCIsIFwidWlkXCIsIFwic2VxdWVuY2VcIiwgXCJ1dGNEYXRlU3RhbXBcIiwgXCJ0aXRsZVwiLCBcImxvY2F0aW9uXCIsIFwidXRjRGF0ZVN0YXJ0XCIsIFwidXRjRGF0ZUVuZFwiLCBcIm5vbkdyZWdvcmlhblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNyZWF0ZVdvcmtzcGFjZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ0aXRsZVwiLCBcInRlbXBsYXRlTmFtZVwiLCBcImxjaWRcIiwgXCJ0aW1lWm9uZUluZm9ybWF0aW9uXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlTWVldGluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyZWN1cnJlbmNlSWRcIiwgXCJ1aWRcIiwgXCJzZXF1ZW5jZVwiLCBcInV0Y0RhdGVTdGFtcFwiLCBcImNhbmNlbE1lZXRpbmdcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTZXRXb3Jrc3BhY2VUaXRsZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ0aXRsZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIE9GRklDSUFMRklMRSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSZWNvcmRSb3V0aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJlY29yZFJvdXRpbmdcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSZWNvcmRSb3V0aW5nQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRTZXJ2ZXJJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlN1Ym1pdEZpbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZmlsZVRvU3VibWl0XCJdLCBbXCJwcm9wZXJ0aWVzXCJdLCBbXCJyZWNvcmRSb3V0aW5nXCJdLCBbXCJzb3VyY2VVcmxcIl0sIFtcInVzZXJOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIFBFT1BMRSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJSZXNvbHZlUHJpbmNpcGFsc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwcmluY2lwYWxLZXlzXCIsIFwicHJpbmNpcGFsVHlwZVwiLCBcImFkZFRvVXNlckluZm9MaXN0XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2VhcmNoUHJpbmNpcGFsc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJzZWFyY2hUZXh0XCIsIFwibWF4UmVzdWx0c1wiLCBcInByaW5jaXBhbFR5cGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBQRVJNSVNTSU9OIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFBlcm1pc3Npb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib2JqZWN0TmFtZVwiLCBcIm9iamVjdFR5cGVcIiwgXCJwZXJtaXNzaW9uSWRlbnRpZmllclwiLCBcInBlcm1pc3Npb25UeXBlXCIsIFwicGVybWlzc2lvbk1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRQZXJtaXNzaW9uQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3ROYW1lXCIsIFwib2JqZWN0VHlwZVwiLCBcInBlcm1pc3Npb25zSW5mb1htbFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFBlcm1pc3Npb25Db2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9iamVjdE5hbWVcIiwgXCJvYmplY3RUeXBlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlUGVybWlzc2lvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3ROYW1lXCIsIFwib2JqZWN0VHlwZVwiLCBcInBlcm1pc3Npb25JZGVudGlmaWVyXCIsIFwicGVybWlzc2lvblR5cGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVQZXJtaXNzaW9uQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3ROYW1lXCIsIFwib2JqZWN0VHlwZVwiLCBcIm1lbWJlcklkc1htbFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVBlcm1pc3Npb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib2JqZWN0TmFtZVwiLCBcIm9iamVjdFR5cGVcIiwgXCJwZXJtaXNzaW9uSWRlbnRpZmllclwiLCBcInBlcm1pc3Npb25UeXBlXCIsIFwicGVybWlzc2lvbk1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBQVUJMSVNIRURMSU5LU1NFUlZJQ0UgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlua3NcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gU0VBUkNIIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkdldFBvcnRhbFNlYXJjaEluZm9cIjpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIHhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlJz5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UvXCIgKyBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRRdWVyeVN1Z2dlc3Rpb25zXCI6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgPSBcIjxcIiArIG9wdC5vcGVyYXRpb24gKyBcIiB4bWxucz0naHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvT2ZmaWNlU2VydmVyL1F1ZXJ5U2VydmljZSc+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlL1wiICsgb3B0Lm9wZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKFwicXVlcnlYbWxcIiwgY29uc3RhbnRzLmVuY29kZVhtbChvcHQucXVlcnlYbWwpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0U2VhcmNoTWV0YWRhdGFcIjpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIHhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlJz5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UvXCIgKyBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJRdWVyeVwiOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUoXCJxdWVyeVhtbFwiLCBjb25zdGFudHMuZW5jb2RlWG1sKG9wdC5xdWVyeVhtbCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJRdWVyeUV4XCI6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgPSBcIjxcIiArIG9wdC5vcGVyYXRpb24gKyBcIiB4bWxucz0naHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvT2ZmaWNlU2VydmVyL1F1ZXJ5U2VydmljZSc+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlL1wiICsgb3B0Lm9wZXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKFwicXVlcnlYbWxcIiwgY29uc3RhbnRzLmVuY29kZVhtbChvcHQucXVlcnlYbWwpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVnaXN0cmF0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSB1dGlscy53cmFwTm9kZShcInJlZ2lzdHJhdGlvblhtbFwiLCBjb25zdGFudHMuZW5jb2RlWG1sKG9wdC5yZWdpc3RyYXRpb25YbWwpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU3RhdHVzXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFNIQVJFUE9JTlRESUFHTk9TVElDUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJTZW5kQ2xpZW50U2NyaXB0RXJyb3JSZXBvcnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibWVzc2FnZVwiLCBcImZpbGVcIiwgXCJsaW5lXCIsIFwiY2xpZW50XCIsIFwic3RhY2tcIiwgXCJ0ZWFtXCIsIFwib3JpZ2luYWxGaWxlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gU0lURURBVEEgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiRW51bWVyYXRlRm9sZGVyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInN0ckZvbGRlclVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEF0dGFjaG1lbnRzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInN0ckxpc3ROYW1lXCIsIFwic3RySXRlbUlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2l0ZURhdGFHZXRMaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInN0ckxpc3ROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhpcyBvcGVyYXRpb24gaGFzIGEgbmFtZSB3aGljaCBkdXBsaWNhdGVzIHRoZSBMaXN0cyBXUywgbmVlZCB0byBoYW5kbGVcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZSA9IGNvbnN0YW50cy5zaXRlRGF0YUZpeFNPQVBFbnZlbG9wZShTT0FQRW52ZWxvcGUsIG9wdC5vcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTaXRlRGF0YUdldExpc3RDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHRoaXMgb3BlcmF0aW9uIGhhcyBhIG5hbWUgd2hpY2ggZHVwbGljYXRlcyB0aGUgTGlzdHMgV1MsIG5lZWQgdG8gaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUgPSBjb25zdGFudHMuc2l0ZURhdGFGaXhTT0FQRW52ZWxvcGUoU09BUEVudmVsb3BlLCBvcHQub3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2l0ZURhdGFHZXRTaXRlXCI6XHJcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHRoaXMgb3BlcmF0aW9uIGhhcyBhIG5hbWUgd2hpY2ggZHVwbGljYXRlcyB0aGUgTGlzdHMgV1MsIG5lZWQgdG8gaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUgPSBjb25zdGFudHMuc2l0ZURhdGFGaXhTT0FQRW52ZWxvcGUoU09BUEVudmVsb3BlLCBvcHQub3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2l0ZURhdGFHZXRTaXRlVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIlVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICAvLyBCZWNhdXNlIHRoaXMgb3BlcmF0aW9uIGhhcyBhIG5hbWUgd2hpY2ggZHVwbGljYXRlcyB0aGUgTGlzdHMgV1MsIG5lZWQgdG8gaGFuZGxlXHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUgPSBjb25zdGFudHMuc2l0ZURhdGFGaXhTT0FQRW52ZWxvcGUoU09BUEVudmVsb3BlLCBvcHQub3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2l0ZURhdGFHZXRXZWJcIjpcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhpcyBvcGVyYXRpb24gaGFzIGEgbmFtZSB3aGljaCBkdXBsaWNhdGVzIHRoZSBMaXN0cyBXUywgbmVlZCB0byBoYW5kbGVcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZSA9IGNvbnN0YW50cy5zaXRlRGF0YUZpeFNPQVBFbnZlbG9wZShTT0FQRW52ZWxvcGUsIG9wdC5vcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBTSVRFUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJDcmVhdGVXZWJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwidGl0bGVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInRlbXBsYXRlTmFtZVwiLCBcImxhbmd1YWdlXCIsIFwibGFuZ3VhZ2VTcGVjaWZpZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImxvY2FsZVwiLCBcImxvY2FsZVNwZWNpZmllZFwiLCBcImNvbGxhdGlvbkxvY2FsZVwiLCBcImNvbGxhdGlvbkxvY2FsZVNwZWNpZmllZFwiLCBcInVuaXF1ZVBlcm1pc3Npb25zXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1bmlxdWVQZXJtaXNzaW9uc1NwZWNpZmllZFwiLCBcImFub255bW91c1wiLCBcImFub255bW91c1NwZWNpZmllZFwiLCBcInByZXNlbmNlXCIsIFwicHJlc2VuY2VTcGVjaWZpZWRcIlxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVdlYlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRTaXRlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIlNpdGVVcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRTaXRlVGVtcGxhdGVzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIkxDSURcIiwgXCJUZW1wbGF0ZUxpc3RcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBTT0NJQUxEQVRBU0VSVklDRSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRDb21tZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcImNvbW1lbnRcIiwgXCJpc0hpZ2hQcmlvcml0eVwiLCBcInRpdGxlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkVGFnXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcInRlcm1JRFwiLCBcInRpdGxlXCIsIFwiaXNQcml2YXRlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkVGFnQnlLZXl3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcImtleXdvcmRcIiwgXCJ0aXRsZVwiLCBcImlzUHJpdmF0ZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50Q29tbWVudHNPZlVzZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ291bnRDb21tZW50c09mVXNlck9uVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJBY2NvdW50TmFtZVwiLCBcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50Q29tbWVudHNPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDb3VudFJhdGluZ3NPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDb3VudFRhZ3NPZlVzZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQ29tbWVudFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIiwgXCJsYXN0TW9kaWZpZWRUaW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlUmF0aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVRhZ1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIiwgXCJ0ZXJtSURcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVUYWdCeUtleXdvcmRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwia2V5d29yZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVRhZ3NcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxsVGFnVGVybXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibWF4aW11bUl0ZW1zVG9SZXR1cm5cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGxUYWdUZXJtc0ZvclVybEZvbGRlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxGb2xkZXJcIiwgXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEFsbFRhZ1VybHNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widGVybUlEXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxsVGFnVXJsc0J5S2V5d29yZFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJrZXl3b3JkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29tbWVudHNPZlVzZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCIsIFwibWF4aW11bUl0ZW1zVG9SZXR1cm5cIiwgXCJzdGFydEluZGV4XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29tbWVudHNPZlVzZXJPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIiwgXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb21tZW50c09uVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcIm1heGltdW1JdGVtc1RvUmV0dXJuXCIsIFwic3RhcnRJbmRleFwiXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdC5leGNsdWRlSXRlbXNUaW1lICE9PSBcInVuZGVmaW5lZFwiICYmIG9wdC5leGNsdWRlSXRlbXNUaW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSB1dGlscy53cmFwTm9kZShcImV4Y2x1ZGVJdGVtc1RpbWVcIiwgb3B0LmV4Y2x1ZGVJdGVtc1RpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSYXRpbmdBdmVyYWdlT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UmF0aW5nT2ZVc2VyT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCIsIFwidXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UmF0aW5nT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UmF0aW5nc09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSYXRpbmdzT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0U29jaWFsRGF0YUZvckZ1bGxSZXBsaWNhdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUYWdzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ3NPZlVzZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCIsIFwibWF4aW11bUl0ZW1zVG9SZXR1cm5cIiwgXCJzdGFydEluZGV4XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnVGVybXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibWF4aW11bUl0ZW1zVG9SZXR1cm5cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUYWdUZXJtc09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIiwgXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ1Rlcm1zT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwibWF4aW11bUl0ZW1zVG9SZXR1cm5cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUYWdVcmxzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInRlcm1JRFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ1VybHNCeUtleXdvcmRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wia2V5d29yZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ1VybHNPZlVzZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widGVybUlEXCIsIFwidXNlckFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnVXJsc09mVXNlckJ5S2V5d29yZFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJrZXl3b3JkXCIsIFwidXNlckFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2V0UmF0aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcInJhdGluZ1wiLCBcInRpdGxlXCIsIFwiYW5hbHlzaXNEYXRhRW50cnlcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVDb21tZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcImxhc3RNb2RpZmllZFRpbWVcIiwgXCJjb21tZW50XCIsIFwiaXNIaWdoUHJpb3JpdHlcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBTUEVMTENIRUNLIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIlNwZWxsQ2hlY2tcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiY2h1bmtzVG9TcGVsbFwiLCBcImRlY2xhcmVkTGFuZ3VhZ2VcIiwgXCJ1c2VMYWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBUQVhPTk9NWSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRUZXJtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJzaGFyZWRTZXJ2aWNlSWRcIiwgXCJ0ZXJtU2V0SWRcIiwgXCJsY2lkXCIsIFwibmV3VGVybXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDaGlsZFRlcm1zSW5UZXJtXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInNzcElkXCIsIFwibGNpZFwiLCBcInRlcm1JZFwiLCBcInRlcm1TZXRJZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENoaWxkVGVybXNJblRlcm1TZXRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3NwSWRcIiwgXCJsY2lkXCIsIFwidGVybVNldElkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0S2V5d29yZFRlcm1zQnlHdWlkc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ0ZXJtSWRzXCIsIFwibGNpZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRlcm1zQnlMYWJlbFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsYWJlbFwiLCBcImxjaWRcIiwgXCJtYXRjaE9wdGlvblwiLCBcInJlc3VsdENvbGxlY3Rpb25TaXplXCIsIFwidGVybUlkc1wiLCBcImFkZElmTm90Rm91bmRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUZXJtU2V0c1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJzaGFyZWRTZXJ2aWNlSWRzXCIsIFwidGVybVNldElkc1wiLCBcImxjaWRcIiwgXCJjbGllbnRUaW1lU3RhbXBzXCIsIFwiY2xpZW50VmVyc2lvbnNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBVU0VSUyBBTkQgR1JPVVBTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZEdyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZVwiLCBcIm93bmVySWRlbnRpZmllclwiLCBcIm93bmVyVHlwZVwiLCBcImRlZmF1bHRVc2VyTG9naW5OYW1lXCIsIFwiZGVzY3JpcHRpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRHcm91cFRvUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIiwgXCJyb2xlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFJvbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInBlcm1pc3Npb25NYXNrXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkUm9sZURlZlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwicGVybWlzc2lvbk1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRVc2VyQ29sbGVjdGlvblRvR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCIsIFwidXNlcnNJbmZvWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkVXNlckNvbGxlY3Rpb25Ub1JvbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIiwgXCJ1c2Vyc0luZm9YbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRVc2VyVG9Hcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIiwgXCJ1c2VyTmFtZVwiLCBcInVzZXJMb2dpbk5hbWVcIiwgXCJ1c2VyRW1haWxcIiwgXCJ1c2VyTm90ZXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRVc2VyVG9Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCIsIFwidXNlck5hbWVcIiwgXCJ1c2VyTG9naW5OYW1lXCIsIFwidXNlckVtYWlsXCIsIFwidXNlck5vdGVzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxsVXNlckNvbGxlY3Rpb25Gcm9tV2ViXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEdyb3VwQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0R3JvdXBDb2xsZWN0aW9uRnJvbVJvbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRHcm91cENvbGxlY3Rpb25Gcm9tU2l0ZVwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRHcm91cENvbGxlY3Rpb25Gcm9tVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyTG9naW5OYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0R3JvdXBDb2xsZWN0aW9uRnJvbVdlYlwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRHcm91cEluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZUNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZUNvbGxlY3Rpb25Gcm9tR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZUNvbGxlY3Rpb25Gcm9tVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyTG9naW5OYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZUNvbGxlY3Rpb25Gcm9tV2ViXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJvbGVJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZXNBbmRQZXJtaXNzaW9uc0ZvckN1cnJlbnRVc2VyXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJvbGVzQW5kUGVybWlzc2lvbnNGb3JTaXRlXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckNvbGxlY3Rpb25Gcm9tR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckNvbGxlY3Rpb25Gcm9tUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJDb2xsZWN0aW9uRnJvbVNpdGVcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckNvbGxlY3Rpb25Gcm9tV2ViXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyTG9naW5Gcm9tRW1haWxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZW1haWxYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVHcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVHcm91cEZyb21Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCIsIFwiZ3JvdXBOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVVzZXJDb2xsZWN0aW9uRnJvbUdyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZVwiLCBcInVzZXJMb2dpbk5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckNvbGxlY3Rpb25Gcm9tUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiLCBcInVzZXJMb2dpbk5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckNvbGxlY3Rpb25Gcm9tU2l0ZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyTG9naW5OYW1lc1htbFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVVzZXJGcm9tR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCIsIFwidXNlckxvZ2luTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVVzZXJGcm9tUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiLCBcInVzZXJMb2dpbk5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVVc2VyRnJvbVNpdGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckxvZ2luTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVVzZXJGcm9tV2ViXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVHcm91cEluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib2xkR3JvdXBOYW1lXCIsIFwiZ3JvdXBOYW1lXCIsIFwib3duZXJJZGVudGlmaWVyXCIsIFwib3duZXJUeXBlXCIsIFwiZGVzY3JpcHRpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVSb2xlRGVmSW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvbGRSb2xlTmFtZVwiLCBcInJvbGVOYW1lXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJwZXJtaXNzaW9uTWFza1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVJvbGVJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9sZFJvbGVOYW1lXCIsIFwicm9sZU5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInBlcm1pc3Npb25NYXNrXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlVXNlckluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckxvZ2luTmFtZVwiLCBcInVzZXJOYW1lXCIsIFwidXNlckVtYWlsXCIsIFwidXNlck5vdGVzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gVVNFUlBST0ZJTEVTRVJWSUNFIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZENvbGxlYWd1ZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImNvbGxlYWd1ZUFjY291bnROYW1lXCIsIFwiZ3JvdXBcIiwgXCJwcml2YWN5XCIsIFwiaXNJbldvcmtHcm91cFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZExpbmtcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJuYW1lXCIsIFwidXJsXCIsIFwiZ3JvdXBcIiwgXCJwcml2YWN5XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkTWVtYmVyc2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcIm1lbWJlcnNoaXBJbmZvXCIsIFwiZ3JvdXBcIiwgXCJwcml2YWN5XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkUGlubmVkTGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcIm5hbWVcIiwgXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDcmVhdGVNZW1iZXJHcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJtZW1iZXJzaGlwSW5mb1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNyZWF0ZVVzZXJQcm9maWxlQnlBY2NvdW50TmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENvbW1vbkNvbGxlYWd1ZXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb21tb25NYW5hZ2VyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29tbW9uTWVtYmVyc2hpcHNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRJbkNvbW1vblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFByb3BlcnR5Q2hvaWNlTGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwcm9wZXJ0eU5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyQ29sbGVhZ3Vlc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJMaW5rc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJNZW1iZXJzaGlwc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQaW5uZWRMaW5rc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9maWxlQnlHdWlkXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImd1aWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyUHJvZmlsZUJ5SW5kZXhcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaW5kZXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyUHJvZmlsZUJ5TmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHRoaXMgb3BlcmF0aW9uIGlzIGluY29uc2lzdGVudCB3aXRoIHRoZSBvdGhlcnMsIHVzaW5nIEFjY291bnROYW1lIHJhdGhlciB0aGFuIGFjY291bnROYW1lXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdC5hY2NvdW50TmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQuYWNjb3VudE5hbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXCJBY2NvdW50TmFtZVwiLCBcImFjY291bnROYW1lXCJdXHJcbiAgICAgICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyUHJvZmlsZUNvdW50XCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9maWxlU2NoZW1hXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9wZXJ0eUJ5QWNjb3VudE5hbWVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJwcm9wZXJ0eU5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJNb2RpZnlVc2VyUHJvcGVydHlCeUFjY291bnROYW1lXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwibmV3RGF0YVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUFsbENvbGxlYWd1ZXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVBbGxMaW5rc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUFsbE1lbWJlcnNoaXBzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlQWxsUGlubmVkTGlua3NcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVDb2xsZWFndWVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJjb2xsZWFndWVBY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUxpbmtcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJpZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZU1lbWJlcnNoaXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJzb3VyY2VJbnRlcm5hbFwiLCBcInNvdXJjZVJlZmVyZW5jZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVBpbm5lZExpbmtcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJpZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbGxlYWd1ZVByaXZhY3lcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJjb2xsZWFndWVBY2NvdW50TmFtZVwiLCBcIm5ld1ByaXZhY3lcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVMaW5rXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwiZGF0YVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZU1lbWJlcnNoaXBQcml2YWN5XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwic291cmNlSW50ZXJuYWxcIiwgXCJzb3VyY2VSZWZlcmVuY2VcIiwgXCJuZXdQcml2YWN5XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlUGlubmVkTGluayBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJkYXRhXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gVkVSU0lPTlMgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQWxsVmVyc2lvbnNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZmlsZU5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVWZXJzaW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImZpbGVOYW1lXCIsIFwiZmlsZVZlcnNpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRWZXJzaW9uc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJmaWxlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlc3RvcmVWZXJzaW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImZpbGVOYW1lXCIsIFwiZmlsZVZlcnNpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBWSUVXIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFZpZXdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiLCBcInZpZXdGaWVsZHNcIiwgXCJxdWVyeVwiLCBcInJvd0xpbWl0XCIsIFwidHlwZVwiLCBcIm1ha2VWaWV3RGVmYXVsdFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVZpZXdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFZpZXdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFZpZXdDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Vmlld0h0bWxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVZpZXdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiLCBcInZpZXdQcm9wZXJ0aWVzXCIsIFwicXVlcnlcIiwgXCJ2aWV3RmllbGRzXCIsIFwiYWdncmVnYXRpb25zXCIsIFwiZm9ybWF0c1wiLCBcInJvd0xpbWl0XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlVmlld0h0bWxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiLCBcInZpZXdQcm9wZXJ0aWVzXCIsIFwidG9vbGJhclwiLCBcInZpZXdIZWFkZXJcIiwgXCJ2aWV3Qm9keVwiLCBcInZpZXdGb290ZXJcIiwgXCJ2aWV3RW1wdHlcIiwgXCJyb3dMaW1pdEV4Y2VlZGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJxdWVyeVwiLCBcInZpZXdGaWVsZHNcIiwgXCJhZ2dyZWdhdGlvbnNcIiwgXCJmb3JtYXRzXCIsIFwicm93TGltaXRcIlxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFdFQlBBUlRQQUdFUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRXZWJQYXJ0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJ3ZWJQYXJ0WG1sXCIsIFwic3RvcmFnZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFdlYlBhcnRUb1pvbmVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiLCBcIndlYlBhcnRYbWxcIiwgXCJzdG9yYWdlXCIsIFwiem9uZUlkXCIsIFwiem9uZUluZGV4XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlV2ViUGFydFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwic3RvcmFnZUtleVwiLCBcInN0b3JhZ2VcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRXZWJQYXJ0MlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwic3RvcmFnZUtleVwiLCBcInN0b3JhZ2VcIiwgXCJiZWhhdmlvclwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdlYlBhcnRQYWdlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImRvY3VtZW50TmFtZVwiLCBcImJlaGF2aW9yXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0V2ViUGFydFByb3BlcnRpZXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiLCBcInN0b3JhZ2VcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRXZWJQYXJ0UHJvcGVydGllczJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiLCBcInN0b3JhZ2VcIiwgXCJiZWhhdmlvclwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlNhdmVXZWJQYXJ0MlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwic3RvcmFnZUtleVwiLCBcIndlYlBhcnRYbWxcIiwgXCJzdG9yYWdlXCIsIFwiYWxsb3dUeXBlQ2hhbmdlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gV0VCUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJXZWJzQ3JlYXRlQ29udGVudFR5cGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZGlzcGxheU5hbWVcIiwgXCJwYXJlbnRUeXBlXCIsIFwibmV3RmllbGRzXCIsIFwiY29udGVudFR5cGVQcm9wZXJ0aWVzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29sdW1uc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ3ZWJVcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJjb250ZW50VHlwZUlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29udGVudFR5cGVzXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEN1c3RvbWl6ZWRQYWdlU3RhdHVzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImZpbGVVcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0VGVtcGxhdGVzXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldE9iamVjdElkRnJvbVVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3RVcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRXZWJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIFtcIndlYlVybFwiLCBcIndlYlVSTFwiXVxyXG4gICAgICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdlYkNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxsU3ViV2ViQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVDb2x1bW5zXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm5ld0ZpZWxkc1wiLCBcInVwZGF0ZUZpZWxkc1wiLCBcImRlbGV0ZUZpZWxkc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIldlYnNVcGRhdGVDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJjb250ZW50VHlwZUlkXCIsIFwiY29udGVudFR5cGVQcm9wZXJ0aWVzXCIsIFwibmV3RmllbGRzXCIsIFwidXBkYXRlRmllbGRzXCIsIFwiZGVsZXRlRmllbGRzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiV2ViVXJsRnJvbVBhZ2VVcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIFtcInBhZ2VVcmxcIiwgXCJwYWdlVVJMXCJdXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gV09SS0ZMT1cgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWx0ZXJUb0RvXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIml0ZW1cIiwgXCJ0b2RvSWRcIiwgXCJ0b2RvTGlzdElkXCIsIFwidGFza0RhdGFcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDbGFpbVJlbGVhc2VUYXNrXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIml0ZW1cIiwgXCJ0YXNrSWRcIiwgXCJsaXN0SWRcIiwgXCJmQ2xhaW1cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUZW1wbGF0ZXNGb3JJdGVtXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIml0ZW1cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUb0Rvc0Zvckl0ZW1cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdvcmtmbG93RGF0YUZvckl0ZW1cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdvcmtmbG93VGFza0RhdGFcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiLCBcImxpc3RJZFwiLCBcInRhc2tJZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlN0YXJ0V29ya2Zsb3dcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiLCBcInRlbXBsYXRlSWRcIiwgXCJ3b3JrZmxvd1BhcmFtZXRlcnNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBHbHVlIHRvZ2V0aGVyIHRoZSBwaWVjZXMgb2YgdGhlIFNPQVAgbWVzc2FnZVxyXG4gICAgICAgIHZhciBtc2cgPSBTT0FQRW52ZWxvcGUuaGVhZGVyICsgU09BUEVudmVsb3BlLm9waGVhZGVyICsgU09BUEVudmVsb3BlLnBheWxvYWQgKyBTT0FQRW52ZWxvcGUub3Bmb290ZXIgKyBTT0FQRW52ZWxvcGUuZm9vdGVyO1xyXG5cclxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgd2UndmUgYWxyZWFkeSBjYWNoZWQgdGhlIHJlc3VsdHNcclxuICAgICAgICB2YXIgY2FjaGVkUHJvbWlzZTtcclxuICAgICAgICBpZiAob3B0LmNhY2hlWE1MKSB7XHJcbiAgICAgICAgICAgIGNhY2hlZFByb21pc2UgPSBwcm9taXNlc0NhY2hlW21zZ107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEbyB3ZSBoYXZlIGFueSBjdXN0b21IZWFkZXJzP1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gb3B0LmN1c3RvbUhlYWRlcnMgPyBvcHQuY3VzdG9tSGVhZGVycyA6IHt9O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGNhY2hlZFByb21pc2UgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEZpbmFsbHksIG1ha2UgdGhlIEFqYXggY2FsbFxyXG4gICAgICAgICAgICB2YXIgcCA9ICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGUgcmVsYXRpdmUgVVJMIGZvciB0aGUgQUpBWCBjYWxsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGFqYXhVUkwsXHJcbiAgICAgICAgICAgICAgICAvLyBCeSBkZWZhdWx0LCB0aGUgQUpBWCBjYWxscyBhcmUgYXN5bmNocm9ub3VzLiAgWW91IGNhbiBzcGVjaWZ5IGZhbHNlIHRvIHJlcXVpcmUgYSBzeW5jaHJvbm91cyBjYWxsLlxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IG9wdC5hc3luYyxcclxuICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsbHksIHBhc3MgaW4gaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcclxuICAgICAgICAgICAgICAgIC8vIEJlZm9yZSBzZW5kaW5nIHRoZSBtc2csIG5lZWQgdG8gc2VuZCB0aGUgcmVxdWVzdCBoZWFkZXJcclxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBuZWVkIHRvIHBhc3MgdGhlIFNPQVBBY3Rpb24sIGRvIHNvXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFdTb3BzW29wdC5vcGVyYXRpb25dWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiU09BUEFjdGlvblwiLCBTT0FQQWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gQWx3YXlzIGEgUE9TVFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBIZXJlIGlzIHRoZSBTT0FQIHJlcXVlc3Qgd2UndmUgYnVpbHQgYWJvdmVcclxuICAgICAgICAgICAgICAgIGRhdGE6IG1zZyxcclxuICAgICAgICAgICAgICAgIC8vIFdlJ3JlIGdldHRpbmcgWE1MOyB0ZWxsIGpRdWVyeSBzbyB0aGF0IGl0IGRvZXNuJ3QgbmVlZCB0byBkbyBhIGJlc3QgZ3Vlc3NcclxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcInhtbFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gYW5kIHRoaXMgaXMgaXRzIGNvbnRlbnQgdHlwZVxyXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IFwidGV4dC94bWw7Y2hhcnNldD0ndXRmLTgnXCIsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHhEYXRhLCBTdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBjYWxsIGlzIGNvbXBsZXRlLCBjYWxsIHRoZSBjb21wbGV0ZWZ1bmMgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHQuY29tcGxldGVmdW5jKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKHhEYXRhLCBTdGF0dXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihvcHQuY2FjaGVYTUwpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2VzQ2FjaGVbbXNnXSA9IHA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgcHJvbWlzZVxyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENhbGwgdGhlIGNvbXBsZXRlZnVuYyBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihvcHQuY29tcGxldGVmdW5jKSkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGVkUHJvbWlzZS5kb25lKGZ1bmN0aW9uKGRhdGEsIHN0YXR1cywganFYSFIpe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoanFYSFIsIHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGNhY2hlZCBwcm9taXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzXHJcbiAgICBcclxuICAgIC8vTWFpbiBmdW5jdGlvbiB3aGljaCBjYWxscyBOaW50ZXgncyBXZWIgU2VydmljZXMgZGlyZWN0bHlcclxuICAgICQuZm4uTmludGV4U2VydmljZXMgPSBmdW5jdGlvbiAob3B0aW9ucylcclxuICAgIHtcclxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gb3B0aW9ucyBwYXNzZWQgaW4sIHVzZSB0aGUgZGVmYXVsdHMuICBFeHRlbmQgcmVwbGFjZXMgZWFjaCBkZWZhdWx0IHdpdGggdGhlIHBhc3NlZCBvcHRpb24uXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCAkLmZuLlNQU2VydmljZXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBFbmNvZGUgb3B0aW9ucyB3aGljaCBtYXkgY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlciwgZXNwLiBhbXBlcnNhbmRcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuY29kZU9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRbZW5jb2RlT3B0aW9uTGlzdFtpXV0gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIG9wdFtlbmNvZGVPcHRpb25MaXN0W2ldXSA9IHV0aWxzLmVuY29kZVhtbChvcHRbZW5jb2RlT3B0aW9uTGlzdFtpXV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS8vZW5kIGZvclxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFB1dCB0b2dldGhlciBvcGVyYXRpb24gaGVhZGVyIGFuZCBTT0FQQWN0aW9uIGZvciB0aGUgU09BUCBjYWxsIGJhc2VkIG9uIHdoaWNoIFdlYiBTZXJ2aWNlIHdlJ3JlIGNhbGxpbmdcclxuICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgPSBcIjxcIiArIG9wdC5vcGVyYXRpb24gKyBcIiBcIjtcclxuICAgICAgICBzd2l0Y2ggKFdTb3BzW29wdC5vcGVyYXRpb25dWzBdKSB7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1c6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BTmludGV4ICsgXCInPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFOaW50ZXggKyBcIi9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrOyAgICAgICAgICAgIFx0XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BTmludGV4ICsgXCIvc29hcC8nPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFOaW50ZXggKyBcIi9zb2FwL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfS8vZW5kIHN3aXRjaFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEFkZCB0aGUgb3BlcmF0aW9uIHRvIHRoZSBTT0FQQWN0aW9uIGFuZCBvcGZvb3RlclxyXG4gICAgICAgIFNPQVBBY3Rpb24gKz0gb3B0Lm9wZXJhdGlvbjtcclxuICAgICAgICBTT0FQRW52ZWxvcGUub3Bmb290ZXIgPSBcIjwvXCIgKyBvcHQub3BlcmF0aW9uICsgXCI+XCI7XHJcblxyXG4gICAgICAgIC8vIEJ1aWxkIHRoZSBVUkwgZm9yIHRoZSBBamF4IGNhbGwgYmFzZWQgb24gd2hpY2ggb3BlcmF0aW9uIHdlJ3JlIGNhbGxpbmdcclxuICAgICAgICAvLyBJZiB0aGUgd2ViVVJMIGhhcyBiZWVuIHByb3ZpZGVkLCB0aGVuIHVzZSBpdCwgZWxzZSB1c2UgdGhlIGN1cnJlbnQgc2l0ZVxyXG4gICAgICAgIHZhciBhamF4VVJMID0gXCJfdnRpX2Jpbi9cIiArIFdTb3BzW29wdC5vcGVyYXRpb25dWzBdICsgXCIuYXNteFwiO1xyXG4gICAgICAgIHZhciB0aGlzU2l0ZSA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFNpdGUoKTtcclxuICAgICAgICB2YXIgd2ViVVJMID0gb3B0LndlYlVSTCAhPT0gdW5kZWZpbmVkID8gb3B0LndlYlVSTCA6IG9wdC53ZWJVcmw7XHJcbiAgICAgICAgaWYgKHdlYlVSTC5jaGFyQXQod2ViVVJMLmxlbmd0aCAtIDEpID09PSBjb25zdGFudHMuU0xBU0gpIHtcclxuICAgICAgICAgICAgYWpheFVSTCA9IHdlYlVSTCArIGFqYXhVUkw7XHJcbiAgICAgICAgfSBlbHNlIGlmICh3ZWJVUkwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBhamF4VVJMID0gd2ViVVJMICsgY29uc3RhbnRzLlNMQVNIICsgYWpheFVSTDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhamF4VVJMID0gdGhpc1NpdGUgKyAoKHRoaXNTaXRlLmNoYXJBdCh0aGlzU2l0ZS5sZW5ndGggLSAxKSA9PT0gY29uc3RhbnRzLlNMQVNIKSA/IGFqYXhVUkwgOiAoY29uc3RhbnRzLlNMQVNIICsgYWpheFVSTCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgPSBcIlwiO1xyXG4gICAgICAgIC8vIEVhY2ggb3BlcmF0aW9uIHJlcXVpcmVzIGEgZGlmZmVyZW50IHNldCBvZiB2YWx1ZXMuICBUaGlzIHN3aXRjaCBzdGF0ZW1lbnQgc2V0cyB0aGVtIHVwIGluIHRoZSBTT0FQRW52ZWxvcGUucGF5bG9hZC5cclxuICAgICAgICBzd2l0Y2ggKG9wdC5vcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgLy9OSU5URVggV09SS0ZMT1cgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkTG9uZ1Rlcm1EZWxlZ2F0aW9uUnVsZVwiOlxyXG4gICAgICAgICAgICBcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiZnJvbVRoZUJlZ2lubmluZ09mXCIsXCJ1bnRpbFRoZUVuZE9mXCIsXCJkZWxlZ2F0ZUZyb21cIixcImRlbGVnYXRlVG9cIixcImN1cnJlbnRTaXRlT25seVwiXSk7XHJcbiAgICAgICAgICAgIFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgXCJBZGRXb3JrZmxvd1NjaGVkdWxlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmaWxlVXJsXCIsXCJ3b3JrZmxvd05hbWVcIixcInN0YXJ0RGF0YVhtbFwiXSk7XHJcblx0XHRcdFx0U09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8c2NoZWR1bGU+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJNYXhpbXVtUmVwZWF0c1wiLFwiV29ya2RheXNPbmx5XCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxSZXBlYXRJbnRlcnZhbD5cIjtcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIlR5cGVcIixcIkNvdW50QmV0d2VlbkludGVydmFsc1wiXSk7XHJcblx0XHRcdFx0U09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8L1JlcGVhdEludGVydmFsPlwiO1xyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiRW5kT25cIixcIlN0YXJ0VGltZVwiLFwiRW5kVGltZVwiXSk7XHJcblx0XHRcdFx0U09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8L3NjaGVkdWxlPlwiO1xyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1widXBkYXRlSWZFeGlzdHNcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwiQWRkV29ya2Zsb3dTY2hlZHVsZU9uTGlzdEl0ZW1cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIml0ZW1JZFwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic3RhcnREYXRhWE1MXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxzY2hlZHVsZT5cIjtcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIk1heGltdW1SZXBlYXRzXCIsXCJXb3JrZGF5c09ubHlcIl0pO1xyXG5cdFx0XHRcdFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPFJlcGVhdEludGVydmFsPlwiO1xyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiVHlwZVwiLFwiQ291bnRCZXR3ZWVuSW50ZXJ2YWxzXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvUmVwZWF0SW50ZXJ2YWw+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJFbmRPblwiLFwiU3RhcnRUaW1lXCIsXCJFbmRUaW1lXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvc2NoZWR1bGU+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ1cGRhdGVJZkV4aXN0c1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFxyXG5cdFx0XHRjYXNlIFwiQ2hlY2tHbG9iYWxSZXVzZVN0YXR1c1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJDaGVja0luRm9ybXNcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93Q29uZmlndXJhdGlvblwiLFwiYWN0aXZpdHlDb25maWd1cmF0aW9uXCIsXCJmb3JtVHlwZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiRGVsZWdhdGVBbGxUYXNrc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiY3VycmVudFVzZXJcIixcIm5ld1VzZXJcIixcInNlbmROb3RpZmljYXRpb25cIixcImNvbW1lbnRzXCIsXCJnbG9iYWxcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcclxuXHRcdFx0Y2FzZSBcIkRlbGVnYXRlVGFza1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wic3BUYXNrSWRcIixcInRhc2tMaXN0TmFtZVwiLFwidGFyZ2V0VXNlck5hbWVcIixcImNvbW1lbnRzXCIsXCJzZW5kTm90aWZpY2F0aW9uXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIkRlbGV0ZUxvbmdUZXJtRGVsZWdhdGlvblJ1bGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImlkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiRGVsZXRlU25pcHBldFwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wic25pcHBldElkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiRGVsZXRlV29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImxpc3RJZFwiLFwid29ya2Zsb3dJZFwiLFwid29ya2Zsb3dUeXBlXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG4gICAgICAgICAgICBjYXNlIFwiRXhwb3J0V29ya2Zsb3dcIjpcclxuICAgICAgICAgICAgXHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd1R5cGVcIixcIndvcmtmbG93TmFtZVwiXSk7XHJcbiAgICAgICAgICAgIFx0YnJlYWs7XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIkZpeFdvcmtmbG93c0luU2l0ZUZyb21UZW1wbGF0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiRml4V29ya2Zsb3dzSW5TaXRlRnJvbVRlbXBsYXRlXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0Rm9sZGVyc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wibGlzdEd1aWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRJdGVtc1BlbmRpbmdNeUFwcHJvdmFsXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ1bmlxdWVuZXNzSW5mb1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldExpc3RDb250ZW50VHlwZXNcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImxpc3RHdWlkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0T3V0Y29tZXNGb3JGbGV4aVRhc2tcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInNwVGFza0lkXCIsXCJ0YXNrTGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRSdW5uaW5nV29ya2Zsb3dUYXNrc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiZmlsZVVybFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFJ1bm5pbmdXb3JrZmxvd1Rhc2tzQ29sbGVjdGlvblwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1widXNlcmxvZ2luXCIsXCJ0ZWFtc2l0ZVVybFwiLFwibGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0ZvckN1cnJlbnRVc2VyXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmaWxlVXJsXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0UnVubmluZ1dvcmtmbG93VGFza3NGb3JDdXJyZW50VXNlckZvckxpc3RJdGVtXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJpdGVtSWRcIixcImxpc3ROYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0UnVubmluZ1dvcmtmbG93VGFza3NGb3JMaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaXRlbUlkXCIsXCJsaXN0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFRhc2tEZXRhaWxzVXNpbmdTdHViXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ0YXNrVG9rZW5cIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRUYXNrU3R1YnNGb3JDdXJyZW50VXNlclwiOlxyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRXb3JrZmxvd0hpc3RvcnlcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIixcInN0YXRlRmlsdGVyXCIsXCJ3b3JrZmxvd05hbWVGaWx0ZXJcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRXb3JrZmxvd0hpc3RvcnlGb3JMaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaXRlbUlkXCIsXCJsaXN0TmFtZVwiLFwic3RhdGVGaWx0ZXJcIixcIndvcmtmbG93TmFtZUZpbHRlclwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkhpZGVUYXNrRm9yQXBwcm92ZXJcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImFwcHJvdmVySWRcIixcImNvbnRlbnREYklkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiSGlkZVdvcmtmbG93XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJzaXRlSWRcIixcImluc3RhbmNlSWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQcm9jZXNzRmxleGlUYXNrUmVzcG9uc2VcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImNvbW1lbnRzXCIsXCJvdXRjb21lXCIsXCJzcFRhc2tJZFwiLFwidGFza0xpc3ROYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHJvY2Vzc0ZsZXhpVGFza1Jlc3BvbnNlMlwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiY29tbWVudHNcIixcIm91dGNvbWVcIixcInNwVGFza0lkXCIsXCJ0YXNrTGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQcm9jZXNzVGFza1Jlc3BvbnNlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJjb21tZW50c1wiLFwib3V0Y29tZVwiLFwic3BUYXNrSWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwiUHJvY2Vzc1Rhc2tSZXNwb25zZTJcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImNvbW1lbnRzXCIsXCJvdXRjb21lXCIsXCJzcFRhc2tJZFwiLFwidGFza0xpc3ROYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJQcm9jZXNzVGFza1Jlc3BvbnNlM1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiY29tbWVudHNcIixcIm91dGNvbWVcIixcInNwVGFza0lkXCIsXCJ0YXNrTGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlByb2Nlc3NUYXNrUmVzcG9uc2VVc2luZ1Rva2VuXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJjb21tZW50c1wiLFwib3V0Y29tZVwiLFwidGFza1Rva2VuXCIsXCJjdXN0b21PdXRjb21lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hGcm9tTldGTm9PdmVyd3JpdGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hGcm9tTldGU2tpcFZhbGlkYXRpb25cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hGcm9tTldGU2tpcFZhbGlkYXRpb25Ob092ZXJ3cml0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZYbWxcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hGcm9tTldGWG1sTm9PdmVyd3JpdGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hGcm9tTldGWG1sU2tpcFZhbGlkYXRpb25cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZYbWxTa2lwVmFsaWRhdGlvbk5vT3ZlcndyaXRlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0ZpbGVcIixcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd05hbWVcIixcInNhdmVJZkNhbm5vdFB1Ymxpc2hcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQdWJsaXNoV29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndmTmFtZVwiLFwiYWN0aXZpdHlDb25maWdzXCIsXCJsaXN0SWRcIixcImNvbnRlbnRUeXBlSWRcIixcImNoYW5nZU5vdGVzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUXVlcnlGb3JNZXNzYWdlc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dJbnN0YW5jZUlkXCIsXCJtZXNzYWdlSWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJSZW1vdmVXb3JrZmxvd1NjaGVkdWxlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmaWxlVXJsXCIsXCJ3b3JrZmxvd05hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdGNhc2UgXCJSZW1vdmVXb3JrZmxvd1NjaGVkdWxlT25MaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaXRlbUlkXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJTYXZlRnJvbU5XRlwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZUZyb21OV0ZOb092ZXJ3cml0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZUZyb21OV0ZYbWxcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVGcm9tTldGWG1sTm9PdmVyd3JpdGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVTbmlwcGV0XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJzbmlwcGV0TmFtZVwiLFwiYWN0aXZpdHlDb25maWdzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJTYXZlVGVtcGxhdGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInRlbXBsYXRlTmFtZVwiLFwidGVtcGxhdGVEZXNjcmlwdGlvblwiLFwiY2F0ZWdvcnlcIixcImFjdGl2aXR5Q29uZmlnc1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVUZW1wbGF0ZTJcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInRlbXBsYXRlTmFtZVwiLFwidGVtcGxhdGVEZXNjcmlwdGlvblwiLFwiY2F0ZWdvcnlcIixcImFjdGl2aXR5Q29uZmlnc1wiLFwibGNpZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVXb3JrZmxvd1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid2ZOYW1lXCIsXCJhY3Rpdml0eUNvbmZpZ3NcIixcImxpc3RJZFwiLFwiY29udGVudFR5cGVJZFwiLFwiY2hhbmdlTm90ZXNcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJTbmlwcGV0RXhpc3RzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJzbmlwcGV0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlN0YXJ0U2l0ZVdvcmtmbG93XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd05hbWVcIixcImFzc29jaWF0aW9uRGF0YVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlN0YXJ0V29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIixcIndvcmtmbG93TmFtZVwiLFwiYXNzb2NpYXRpb25EYXRhXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiU3RhcnRXb3JrZmxvd09uTGlzdEl0ZW1cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIml0ZW1JZFwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwiYXNzb2NpYXRpb25EYXRhXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiVGVtcGxhdGVFeGlzdHNcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInRlbXBsYXRlTmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlRlcm1pbmF0ZVdvcmtmbG93XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJsaXN0SWRcIixcIml0ZW1JZFwiLFwiaW5zdGFuY2VJZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlRlcm1pbmF0ZVdvcmtmbG93QnlOYW1lXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmaWxlVXJsXCIsXCJ3b3JrZmxvd05hbWVcIixcInRlcm1pbmF0ZVByZXZpb3VzSW5zdGFuY2VzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiVGVybWluYXRlV29ya2Zsb3dCeU5hbWVGb3JMaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wibGlzdE5hbWVcIixcIml0ZW1JZFwiLFwid29ya2Zsb3dOYW1lXCIsXCJ0ZXJtaW5hdGVQcmV2aW91c0luc3RhbmNlc1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIldvcmtmbG93RXhpc3RzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd05hbWVcIixcImxpc3RJZFwiLFwid29ya2Zsb3dUeXBlXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiV29ya2Zsb3dGb3JtUHJvZHVjdFNlbGVjdGVkXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0NvbmZpZ3VyYXRpb25cIixcImFjdGl2aXR5Q29uZmlndXJhdGlvblwiLFwicHJvZHVjdFwiLFwiZm9ybVR5cGVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9Ly9lbmQgc3dpdGNoXHJcblxyXG4gICAgICAgIC8vIEdsdWUgdG9nZXRoZXIgdGhlIHBpZWNlcyBvZiB0aGUgU09BUCBtZXNzYWdlXHJcbiAgICAgICAgdmFyIG1zZyA9IFNPQVBFbnZlbG9wZS5oZWFkZXIgKyBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKyBTT0FQRW52ZWxvcGUucGF5bG9hZCArIFNPQVBFbnZlbG9wZS5vcGZvb3RlciArIFNPQVBFbnZlbG9wZS5mb290ZXI7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IGNhY2hlZCB0aGUgcmVzdWx0c1xyXG4gICAgICAgIHZhciBjYWNoZWRQcm9taXNlO1xyXG4gICAgICAgIGlmIChvcHQuY2FjaGVYTUwpIHtcclxuICAgICAgICAgICAgY2FjaGVkUHJvbWlzZSA9IHByb21pc2VzQ2FjaGVbbXNnXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY2FjaGVkUHJvbWlzZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cclxuICAgICAgICAgICAgLy8gRmluYWxseSwgbWFrZSB0aGUgQWpheCBjYWxsXHJcbiAgICAgICAgICAgIHZhciBwID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSByZWxhdGl2ZSBVUkwgZm9yIHRoZSBBSkFYIGNhbGxcclxuICAgICAgICAgICAgICAgIHVybDogYWpheFVSTCxcclxuICAgICAgICAgICAgICAgIC8vIEJ5IGRlZmF1bHQsIHRoZSBBSkFYIGNhbGxzIGFyZSBhc3luY2hyb25vdXMuICBZb3UgY2FuIHNwZWNpZnkgZmFsc2UgdG8gcmVxdWlyZSBhIHN5bmNocm9ub3VzIGNhbGwuXHJcbiAgICAgICAgICAgICAgICBhc3luYzogb3B0LmFzeW5jLFxyXG4gICAgICAgICAgICAgICAgLy8gQmVmb3JlIHNlbmRpbmcgdGhlIG1zZywgbmVlZCB0byBzZW5kIHRoZSByZXF1ZXN0IGhlYWRlclxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIG5lZWQgdG8gcGFzcyB0aGUgU09BUEFjdGlvbiwgZG8gc29cclxuICAgICAgICAgICAgICAgICAgICBpZiAoV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJTT0FQQWN0aW9uXCIsIFNPQVBBY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBBbHdheXMgYSBQT1NUXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIC8vIEhlcmUgaXMgdGhlIFNPQVAgcmVxdWVzdCB3ZSd2ZSBidWlsdCBhYm92ZVxyXG4gICAgICAgICAgICAgICAgZGF0YTogbXNnLFxyXG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZ2V0dGluZyBYTUw7IHRlbGwgalF1ZXJ5IHNvIHRoYXQgaXQgZG9lc24ndCBuZWVkIHRvIGRvIGEgYmVzdCBndWVzc1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwieG1sXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhpcyBpcyBpdHMgY29udGVudCB0eXBlXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJ0ZXh0L3htbDtjaGFyc2V0PSd1dGYtOCdcIixcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeERhdGEsIFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIGNhbGwgaXMgY29tcGxldGUsIGNhbGwgdGhlIGNvbXBsZXRlZnVuYyBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdC5jb21wbGV0ZWZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoeERhdGEsIFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmKG9wdC5jYWNoZVhNTCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXNDYWNoZVttc2ddID0gcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBwcm9taXNlXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY29tcGxldGVmdW5jIGlmIHRoZXJlIGlzIG9uZVxyXG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdC5jb21wbGV0ZWZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWNoZWRQcm9taXNlLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcVhIUil7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LmNvbXBsZXRlZnVuYyhqcVhIUiwgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGNhY2hlZCBwcm9taXNlXHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfTsvL2VuZCBOaW50ZXhTZXJ2aWNlc1xyXG4gICAgXHJcblxyXG4gICAgLy8gRGVmYXVsdHMgYWRkZWQgYXMgYSBmdW5jdGlvbiBpbiBvdXIgbGlicmFyeSBtZWFucyB0aGF0IHRoZSBjYWxsZXIgY2FuIG92ZXJyaWRlIHRoZSBkZWZhdWx0c1xyXG4gICAgLy8gZm9yIHRoZWlyIHNlc3Npb24gYnkgY2FsbGluZyB0aGlzIGZ1bmN0aW9uLiAgRWFjaCBvcGVyYXRpb24gcmVxdWlyZXMgYSBkaWZmZXJlbnQgc2V0IG9mIG9wdGlvbnM7XHJcbiAgICAvLyB3ZSBhbGxvdyBmb3IgYWxsIGluIGEgc3RhbmRhcmRpemVkIHdheS5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5kZWZhdWx0cyA9IHtcclxuXHJcbiAgICAgICAgY2FjaGVYTUw6IGZhbHNlLCAvLyBJZiB0cnVlLCB3ZSdsbCBjYWNoZSB0aGUgWE1MIHJlc3VsdHMgd2l0aCBqUXVlcnkncyAuZGF0YSgpIGZ1bmN0aW9uXHJcbiAgICAgICAgb3BlcmF0aW9uOiBcIlwiLCAvLyBUaGUgV2ViIFNlcnZpY2Ugb3BlcmF0aW9uXHJcbiAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBVUkwgb2YgdGhlIHRhcmdldCBXZWJcclxuICAgICAgICBjdXN0b21IZWFkZXJzOiB7fSxcclxuICAgICAgICBtYWtlVmlld0RlZmF1bHQ6IGZhbHNlLCAvLyB0cnVlIHRvIG1ha2UgdGhlIHZpZXcgdGhlIGRlZmF1bHQgdmlldyBmb3IgdGhlIGxpc3RcclxuXHJcbiAgICAgICAgLy8gRm9yIG9wZXJhdGlvbnMgcmVxdWlyaW5nIENBTUwsIHRoZXNlIG9wdGlvbnMgd2lsbCBvdmVycmlkZSBhbnkgYWJzdHJhY3Rpb25zXHJcbiAgICAgICAgdmlld05hbWU6IFwiXCIsIC8vIFZpZXcgbmFtZSBpbiBDQU1MIGZvcm1hdC5cclxuICAgICAgICBDQU1MUXVlcnk6IFwiXCIsIC8vIFF1ZXJ5IGluIENBTUwgZm9ybWF0XHJcbiAgICAgICAgQ0FNTFZpZXdGaWVsZHM6IFwiXCIsIC8vIFZpZXcgZmllbGRzIGluIENBTUwgZm9ybWF0XHJcbiAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLCAvLyBSb3cgbGltaXQgYXMgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYW4gaW50ZWdlclxyXG4gICAgICAgIENBTUxRdWVyeU9wdGlvbnM6IFwiPFF1ZXJ5T3B0aW9ucz48L1F1ZXJ5T3B0aW9ucz5cIiwgLy8gUXVlcnkgb3B0aW9ucyBpbiBDQU1MIGZvcm1hdFxyXG5cclxuICAgICAgICAvLyBBYnN0cmFjdGlvbnMgZm9yIENBTUwgc3ludGF4XHJcbiAgICAgICAgYmF0Y2hDbWQ6IFwiVXBkYXRlXCIsIC8vIE1ldGhvZCBDbWQgZm9yIFVwZGF0ZUxpc3RJdGVtc1xyXG4gICAgICAgIHZhbHVlcGFpcnM6IFtdLCAvLyBGaWVsZG5hbWUgLyBGaWVsZHZhbHVlIHBhaXJzIGZvciBVcGRhdGVMaXN0SXRlbXNcclxuXHJcbiAgICAgICAgLy8gQXMgb2YgdjAuNy4xLCByZW1vdmVkIGFsbCBvcHRpb25zIHdoaWNoIHdlcmUgYXNzaWduZWQgYW4gZW1wdHkgc3RyaW5nIChcIlwiKVxyXG4gICAgICAgIERlc3RpbmF0aW9uVXJsczogW10sIC8vIEFycmF5IG9mIGRlc3RpbmF0aW9uIFVSTHMgZm9yIGNvcHkgb3BlcmF0aW9uc1xyXG4gICAgICAgIGJlaGF2aW9yOiBcIlZlcnNpb24zXCIsIC8vIEFuIFNQV2ViU2VydmljZUJlaGF2aW9yIGluZGljYXRpbmcgd2hldGhlciB0aGUgY2xpZW50IHN1cHBvcnRzIFdpbmRvd3MgU2hhcmVQb2ludCBTZXJ2aWNlcyAyLjAgb3IgV2luZG93cyBTaGFyZVBvaW50IFNlcnZpY2VzIDMuMDoge1ZlcnNpb24yIHwgVmVyc2lvbjMgfVxyXG4gICAgICAgIHN0b3JhZ2U6IFwiU2hhcmVkXCIsIC8vIEEgU3RvcmFnZSB2YWx1ZSBpbmRpY2F0aW5nIGhvdyB0aGUgV2ViIFBhcnQgaXMgc3RvcmVkOiB7Tm9uZSB8IFBlcnNvbmFsIHwgU2hhcmVkfVxyXG4gICAgICAgIG9iamVjdFR5cGU6IFwiTGlzdFwiLCAvLyBvYmplY3RUeXBlIGZvciBvcGVyYXRpb25zIHdoaWNoIHJlcXVpcmUgaXRcclxuICAgICAgICBjYW5jZWxNZWV0aW5nOiB0cnVlLCAvLyB0cnVlIHRvIGRlbGV0ZSBhIG1lZXRpbmc7ZmFsc2UgdG8gcmVtb3ZlIGl0cyBhc3NvY2lhdGlvbiB3aXRoIGEgTWVldGluZyBXb3Jrc3BhY2Ugc2l0ZVxyXG4gICAgICAgIG5vbkdyZWdvcmlhbjogZmFsc2UsIC8vIHRydWUgaWYgdGhlIGNhbGVuZGFyIGlzIHNldCB0byBhIGZvcm1hdCBvdGhlciB0aGFuIEdyZWdvcmlhbjtvdGhlcndpc2UsIGZhbHNlLlxyXG4gICAgICAgIGZDbGFpbTogZmFsc2UsIC8vIFNwZWNpZmllcyBpZiB0aGUgYWN0aW9uIGlzIGEgY2xhaW0gb3IgYSByZWxlYXNlLiBTcGVjaWZpZXMgdHJ1ZSBmb3IgYSBjbGFpbSBhbmQgZmFsc2UgZm9yIGEgcmVsZWFzZS5cclxuICAgICAgICByZWN1cnJlbmNlSWQ6IDAsIC8vIFRoZSByZWN1cnJlbmNlIElEIGZvciB0aGUgbWVldGluZyB0aGF0IG5lZWRzIGl0cyBhc3NvY2lhdGlvbiByZW1vdmVkLiBUaGlzIHBhcmFtZXRlciBjYW4gYmUgc2V0IHRvIDAgZm9yIHNpbmdsZS1pbnN0YW5jZSBtZWV0aW5ncy5cclxuICAgICAgICBzZXF1ZW5jZTogMCwgLy8gQW4gaW50ZWdlciB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlcmluZyBvZiB1cGRhdGVzIGluIGNhc2UgdGhleSBhcnJpdmUgb3V0IG9mIHNlcXVlbmNlLiBVcGRhdGVzIHdpdGggYSBsb3dlci10aGFuLWN1cnJlbnQgc2VxdWVuY2UgYXJlIGRpc2NhcmRlZC4gSWYgdGhlIHNlcXVlbmNlIGlzIGVxdWFsIHRvIHRoZSBjdXJyZW50IHNlcXVlbmNlLCB0aGUgbGF0ZXN0IHVwZGF0ZSBhcmUgYXBwbGllZC5cclxuICAgICAgICBtYXhpbXVtSXRlbXNUb1JldHVybjogMCwgLy8gU29jaWFsRGF0YVNlcnZpY2UgbWF4aW11bUl0ZW1zVG9SZXR1cm5cclxuICAgICAgICBzdGFydEluZGV4OiAwLCAvLyBTb2NpYWxEYXRhU2VydmljZSBzdGFydEluZGV4XHJcbiAgICAgICAgaXNIaWdoUHJpb3JpdHk6IGZhbHNlLCAvLyBTb2NpYWxEYXRhU2VydmljZSBpc0hpZ2hQcmlvcml0eVxyXG4gICAgICAgIGlzUHJpdmF0ZTogZmFsc2UsIC8vIFNvY2lhbERhdGFTZXJ2aWNlIGlzUHJpdmF0ZVxyXG4gICAgICAgIHJhdGluZzogMSwgLy8gU29jaWFsRGF0YVNlcnZpY2UgcmF0aW5nXHJcbiAgICAgICAgbWF4UmVzdWx0czogMTAsIC8vIFVubGVzcyBvdGhlcndpc2Ugc3BlY2lmaWVkLCB0aGUgbWF4aW11bSBudW1iZXIgb2YgcHJpbmNpcGFscyB0aGF0IGNhbiBiZSByZXR1cm5lZCBmcm9tIGEgcHJvdmlkZXIgaXMgMTAuXHJcbiAgICAgICAgcHJpbmNpcGFsVHlwZTogXCJVc2VyXCIsIC8vIFNwZWNpZmllcyB1c2VyIHNjb3BlIGFuZCBvdGhlciBpbmZvcm1hdGlvbjogW05vbmUgfCBVc2VyIHwgRGlzdHJpYnV0aW9uTGlzdCB8IFNlY3VyaXR5R3JvdXAgfCBTaGFyZVBvaW50R3JvdXAgfCBBbGxdXHJcblxyXG4gICAgICAgIGFzeW5jOiB0cnVlLCAvLyBBbGxvdyB0aGUgdXNlciB0byBmb3JjZSBhc3luY1xyXG4gICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCAvLyBGdW5jdGlvbiB0byBjYWxsIG9uIGNvbXBsZXRpb25cclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLmRlZmF1bHRzXHJcblxyXG59KTsiLG51bGwsIi8qKlxyXG4gKiBHZW5lcmFsIHB1cnBvc2UgdXRpbGl0aWVzXHJcbiAqXHJcbiAqIEBuYW1lc3BhY2Ugc3BzZXJ2aWNlcy51dGlsc1xyXG4gKi9cclxuZGVmaW5lKFtcclxuICAgIFwianF1ZXJ5XCIsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJ1xyXG5dLCBmdW5jdGlvbihcclxuICAgICQsXHJcbiAgICBjb25zdGFudHNcclxuKXtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciB1dGlscyA9IC8qKiBAbGVuZHMgc3BzZXJ2aWNlcy51dGlscyAqL3tcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbnRleHQgKGFzIG11Y2ggYXMgd2UgY2FuKSBvbiBzdGFydHVwXHJcbiAgICAgICAgLy8gU2VlOiBodHRwOi8vam9obmxpdS5uZXQvYmxvZy8yMDEyLzIvMy9zaGFyZXBvaW50LWphdmFzY3JpcHQtY3VycmVudC1wYWdlLWNvbnRleHQtaW5mby5odG1sXHJcbiAgICAgICAgU1BTZXJ2aWNlc0NvbnRleHQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIsIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgICAgICB0aGlzVXNlcklkOiBcIlwiIC8vIFRoZSBjdXJyZW50IHVzZXIncyBpZCBpbiB0aGUgc2l0ZSBDb2xsZWN0aW9uLlxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBTaGFyZVBvaW50IHZhcmlhYmxlcyBvbmx5IGdpdmUgdXMgYSByZWxhdGl2ZSBwYXRoLiB0byBtYXRjaCB0aGUgcmVzdWx0IGZyb20gV2ViVXJsRnJvbVBhZ2VVcmwsIHdlIG5lZWQgdG8gYWRkIHRoZSBwcm90b2NvbCwgaG9zdCwgYW5kIChpZiBwcmVzZW50KSBwb3J0LlxyXG4gICAgICAgICAgICB2YXIgc2l0ZVJvb3QgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7IC8vICsgKGxvY2F0aW9uLnBvcnQgIT09IFwiXCIgPyBsb2NhdGlvbi5wb3J0IDogXCJcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpc0NvbnRleHQgPSB7fTtcclxuICAgICAgICAgICAgLy8gU2hhcmVQb2ludCAyMDEwKyBnaXZlcyB1cyBhIGNvbnRleHQgdmFyaWFibGVcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfc3BQYWdlQ29udGV4dEluZm8gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNDb250ZXh0LnRoaXNTaXRlID0gc2l0ZVJvb3QgKyBfc3BQYWdlQ29udGV4dEluZm8ud2ViU2VydmVyUmVsYXRpdmVVcmw7XHJcbiAgICAgICAgICAgICAgICB0aGlzQ29udGV4dC50aGlzTGlzdCA9IG9wdC5saXN0TmFtZSA/IG9wdC5saXN0TmFtZSA6IF9zcFBhZ2VDb250ZXh0SW5mby5wYWdlTGlzdElkO1xyXG4gICAgICAgICAgICAgICAgdGhpc0NvbnRleHQudGhpc1VzZXJJZCA9IG9wdC50aGlzVXNlcklkID8gb3B0LnRoaXNVc2VySWQgOiBfc3BQYWdlQ29udGV4dEluZm8udXNlcklkO1xyXG4gICAgICAgICAgICAgICAgLy8gSW4gU2hhcmVQb2ludCAyMDA3LCB3ZSBrbm93IHRoZSBVc2VySUQgb25seVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpc0NvbnRleHQudGhpc1NpdGUgPSAodHlwZW9mIExfTWVudV9CYXNlVXJsICE9PSBcInVuZGVmaW5lZFwiKSA/IHNpdGVSb290ICsgTF9NZW51X0Jhc2VVcmwgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpc0NvbnRleHQudGhpc0xpc3QgPSBvcHQubGlzdE5hbWUgPyBvcHQubGlzdE5hbWUgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGhpc0NvbnRleHQudGhpc1VzZXJJZCA9IG9wdC50aGlzVXNlcklkID8gb3B0LnRoaXNVc2VySWQgOiAoKHR5cGVvZiBfc3BVc2VySWQgIT09IFwidW5kZWZpbmVkXCIpID8gX3NwVXNlcklkIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNDb250ZXh0O1xyXG5cclxuICAgICAgICB9LCAvLyBFbmQgb2YgZnVuY3Rpb24gU1BTZXJ2aWNlc0NvbnRleHRcclxuXHJcbiAgICAgICAgLy8gR2xvYmFsIHZhcmlhYmxlc1xyXG4vLyAgICAgICAgY3VycmVudENvbnRleHQ6IG5ldyB0aGlzLlNQU2VydmljZXNDb250ZXh0KCksIC8vIFZhcmlhYmxlIHRvIGhvbGQgdGhlIGN1cnJlbnQgY29udGV4dCBhcyB3ZSBmaWd1cmUgaXQgb3V0XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdyYXAgYW4gWE1MIG5vZGUgKG4pIGFyb3VuZCBhIHZhbHVlICh2KVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd3JhcE5vZGU6IGZ1bmN0aW9uKG4sIHYpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNWYWx1ZSA9IHR5cGVvZiB2ICE9PSBcInVuZGVmaW5lZFwiID8gdiA6IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxcIiArIG4gKyBcIj5cIiArIHRoaXNWYWx1ZSArIFwiPC9cIiArIG4gKyBcIj5cIjtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZW5lcmF0ZSBhIHJhbmRvbSBudW1iZXIgZm9yIHNvcnRpbmcgYXJyYXlzIHJhbmRvbWx5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmFuZE9yZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKSAtIDAuNSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgYSBzdHJpbmcgaXMgYSBVUkwsIGZvcm1hdCBpdCBhcyBhIGxpbmssIGVsc2UgcmV0dXJuIHRoZSBzdHJpbmcgYXMtaXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBjaGVja0xpbms6IGZ1bmN0aW9uKHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuICgocy5pbmRleE9mKFwiaHR0cFwiKSA9PT0gMCkgfHwgKHMuaW5kZXhPZihcIi9cIikgPT09IDApKSA/IFwiPGEgaHJlZj0nXCIgKyBzICsgXCInPlwiICsgcyArIFwiPC9hPlwiIDogcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIGZpbGVuYW1lIGZyb20gdGhlIGZ1bGwgVVJMXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZmlsZU5hbWU6IGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzLnN1YnN0cmluZyhzLmxhc3RJbmRleE9mKFwiL1wiKSArIDEsIHMubGVuZ3RoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIG1hcCBvZiBzcGVjaWFsIGNoYXJhY3RlcnMgdG8gWE1MIGVzY2FwZWQgY2hhcmFjdGVycy5cclxuICAgICAgICAgKiBUYWtlbiBmcm9tIHtAbGluayBodHRwOi8vZHJhY29ibHVlLm5ldC9kZXYvZW5jb2RlZGVjb2RlLXNwZWNpYWwteG1sLWNoYXJhY3RlcnMtaW4tamF2YXNjcmlwdC8xNTUvfVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB4bWxfc3BlY2lhbF90b19lc2NhcGVkX29uZV9tYXA6IHtcclxuICAgICAgICAgICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgICAgICAgICAnXCInOiAnJnF1b3Q7JyxcclxuICAgICAgICAgICAgJzwnOiAnJmx0OycsXHJcbiAgICAgICAgICAgICc+JzogJyZndDsnXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gUGF1bCBULiwgMjAxNS4wNS4wMTogQ29tbWVudGVkIG91dCBzaW5jZSBpdHMgbm90IGN1cnJlbnRseSB1c2VkLlxyXG4gICAgICAgIC8vIHZhciBlc2NhcGVkX29uZV90b194bWxfc3BlY2lhbF9tYXAgPSB7XHJcbiAgICAgICAgLy8gJyZhbXA7JzogJyYnLFxyXG4gICAgICAgIC8vICcmcXVvdDsnOiAnXCInLFxyXG4gICAgICAgIC8vICcmbHQ7JzogJzwnLFxyXG4gICAgICAgIC8vICcmZ3Q7JzogJz4nXHJcbiAgICAgICAgLy8gfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRW5jb2RlIFhNTCBjaGFyYWN0ZXJzIGluIGEgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW5jb2RlWG1sOiBmdW5jdGlvbihzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oW1xcJlwiPD5dKS9nLCBmdW5jdGlvbiAoc3RyLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy54bWxfc3BlY2lhbF90b19lc2NhcGVkX29uZV9tYXBbaXRlbV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFBhdWwgVC4sIDIwMTUtMDUtMDI6IENvbW1lbnRlZCBvdXQgc2luY2UgaXRzIG5vdCBjdXJyZW50bHkgdXNlZC5cclxuICAgICAgICAvLyBmdW5jdGlvbiBkZWNvZGVYbWwoc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oJnF1b3Q7fCZsdDt8Jmd0O3wmYW1wOykvZyxcclxuICAgICAgICAvLyBmdW5jdGlvbiAoc3RyLCBpdGVtKSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIGVzY2FwZWRfb25lX3RvX3htbF9zcGVjaWFsX21hcFtpdGVtXTtcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8qIFRha2VuIGZyb20gaHR0cDovL2RyYWNvYmx1ZS5uZXQvZGV2L2VuY29kZWRlY29kZS1zcGVjaWFsLXhtbC1jaGFyYWN0ZXJzLWluLWphdmFzY3JpcHQvMTU1LyAqL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFc2NhcGUgY29sdW1uIHZhbHVlc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVzY2FwZUNvbHVtblZhbHVlOiBmdW5jdGlvbihzKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvJig/IVthLXpBLVpdezEsOH07KS9nLCBcIiZhbXA7XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFc2NhcGUgVXJsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXNjYXBlVXJsOiBmdW5jdGlvbiAodSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdS5yZXBsYWNlKC8mL2csICclMjYnKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTcGxpdCB2YWx1ZXMgbGlrZSAxOyN2YWx1ZSBpbnRvIGlkIGFuZCB2YWx1ZVxyXG4gICAgICAgICAqIEB0eXBlIENsYXNzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgU3BsaXRJbmRleDogZnVuY3Rpb24ocykge1xyXG4gICAgICAgICAgICB2YXIgc3BsID0gcy5zcGxpdChjb25zdGFudHMuc3BEZWxpbSk7XHJcbiAgICAgICAgICAgIHRoaXMuaWQgPSBzcGxbMF07XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBzcGxbMV07XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUGFkIHNpbmdsZSBkaWdpdHMgd2l0aCBhIHplcm9cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcGFkOiBmdW5jdGlvbiAobikge1xyXG4gICAgICAgICAgICByZXR1cm4gbiA8IDEwID8gXCIwXCIgKyBuIDogbjtcclxuICAgICAgICB9LFxyXG4vLyBUT0RPXHJcbiAgICAgICAgLy8gSmFtZXMgUGFkb2xzZXkncyBSZWdleCBTZWxlY3RvciBmb3IgalF1ZXJ5IGh0dHA6Ly9qYW1lcy5wYWRvbHNleS5jb20vamF2YXNjcmlwdC9yZWdleC1zZWxlY3Rvci1mb3ItanF1ZXJ5L1xyXG4gICAgICAgIC8qICAgICQuZXhwclsnOiddLnJlZ2V4ID0gZnVuY3Rpb24gKGVsZW0sIGluZGV4LCBtYXRjaCkge1xyXG4gICAgICAgICB2YXIgbWF0Y2hQYXJhbXMgPSBtYXRjaFszXS5zcGxpdCgnLCcpLFxyXG4gICAgICAgICB2YWxpZExhYmVscyA9IC9eKGRhdGF8Y3NzKTovLFxyXG4gICAgICAgICBhdHRyID0ge1xyXG4gICAgICAgICBtZXRob2Q6IG1hdGNoUGFyYW1zWzBdLm1hdGNoKHZhbGlkTGFiZWxzKSA/XHJcbiAgICAgICAgIG1hdGNoUGFyYW1zWzBdLnNwbGl0KCc6JylbMF0gOiAnYXR0cicsXHJcbiAgICAgICAgIHByb3BlcnR5OiBtYXRjaFBhcmFtcy5zaGlmdCgpLnJlcGxhY2UodmFsaWRMYWJlbHMsICcnKVxyXG4gICAgICAgICB9LFxyXG4gICAgICAgICByZWdleEZsYWdzID0gJ2lnJyxcclxuICAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKG1hdGNoUGFyYW1zLmpvaW4oJycpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSwgcmVnZXhGbGFncyk7XHJcbiAgICAgICAgIHJldHVybiByZWdleC50ZXN0KCQoZWxlbSlbYXR0ci5tZXRob2RdKGF0dHIucHJvcGVydHkpKTtcclxuICAgICAgICAgfTtcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGQgYW4gZXJyb3IgbWVzc2FnZSBiYXNlZCBvbiBwYXNzZWQgcGFyYW1ldGVyc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVyckJveDogZnVuY3Rpb24oZnVuYywgcGFyYW0sIG1zZykge1xyXG4gICAgICAgICAgICB2YXIgZXJyTXNnID0gXCI8Yj5FcnJvciBpbiBmdW5jdGlvbjwvYj48YnIvPlwiICsgZnVuYyArIFwiPGJyLz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxiPlBhcmFtZXRlcjwvYj48YnIvPlwiICsgcGFyYW0gKyBcIjxici8+XCIgK1xyXG4gICAgICAgICAgICAgICAgXCI8Yj5NZXNzYWdlPC9iPjxici8+XCIgKyBtc2cgKyBcIjxici8+PGJyLz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxzcGFuIG9ubW91c2VvdmVyPSd0aGlzLnN0eWxlLmN1cnNvcj1cXFwiaGFuZFxcXCI7JyBvbm1vdXNlb3V0PSd0aGlzLnN0eWxlLmN1cnNvcj1cXFwiaW5oZXJpdFxcXCI7JyBzdHlsZT0nd2lkdGg9MTAwJTt0ZXh0LWFsaWduOnJpZ2h0Oyc+Q2xpY2sgdG8gY29udGludWU8L3NwYW4+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIG1vZGFsQm94KGVyck1zZyk7XHJcbiAgICAgICAgfSwgLy8gRW5kIG9mIGZ1bmN0aW9uIGVyckJveFxyXG5cclxuXHJcbiAgICAgICAgLy8gRmluZHMgdGhlIHRkIHdoaWNoIGNvbnRhaW5zIGEgZm9ybSBmaWVsZCBpbiBkZWZhdWx0IGZvcm1zIHVzaW5nIHRoZSBjb21tZW50IHdoaWNoIGNvbnRhaW5zOlxyXG4gICAgICAgIC8vICA8IS0tICBGaWVsZE5hbWU9XCJUaXRsZVwiXHJcbiAgICAgICAgLy8gICAgICBGaWVsZEludGVybmFsTmFtZT1cIlRpdGxlXCJcclxuICAgICAgICAvLyAgICAgIEZpZWxkVHlwZT1cIlNQRmllbGRUZXh0XCJcclxuICAgICAgICAvLyAgLS0+XHJcbiAgICAgICAgLy8gYXMgdGhlIFwiYW5jaG9yXCIgdG8gZmluZCBpdC4gTmVjZXNzYXJ5IGJlY2F1c2UgU2hhcmVQb2ludCBkb2Vzbid0IGdpdmUgYWxsIGZpZWxkIHR5cGVzIGlkcyBvciBzcGVjaWZpYyBjbGFzc2VzLlxyXG4gICAgICAgIGZpbmRGb3JtRmllbGQ6IGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgdmFyICRmb3JtQm9keSA9ICQoXCJ0ZC5tcy1mb3JtYm9keSwgdGQubXMtZm9ybWJvZHlzdXJ2ZXlcIiksXHJcbiAgICAgICAgICAgICAgICAvLyBCb3Jyb3dlZCBmcm9tIE1ETi5cclxuICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9uc1xyXG4gICAgICAgICAgICAgICAgZXNjYXBlUmVnRXhwID0gZnVuY3Rpb24gKHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2LnJlcGxhY2UoLyhbLiorP149IToke30oKXxcXFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29sdW1uTmFtZSA9IGVzY2FwZVJlZ0V4cCh2KSxcclxuICAgICAgICAgICAgICAgIHJjb21tZW50VmFsaWRhdGlvbiA9IG5ldyBSZWdFeHAoXCIoPzpGaWVsZHxGaWVsZEludGVybmFsKU5hbWU9XFxcIlwiICsgY29sdW1uTmFtZSArIFwiXFxcIlwiLCBcImlcIiksXHJcbiAgICAgICAgICAgICAgICAkY29sdW1uTm9kZSA9ICRmb3JtQm9keS5jb250ZW50cygpLmZpbHRlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZVR5cGUgPT09IDggJiYgcmNvbW1lbnRWYWxpZGF0aW9uLnRlc3QodGhpcy5ub2RlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkY29sdW1uTm9kZS5wYXJlbnQoXCJ0ZFwiKTtcclxuICAgICAgICB9LCAvLyBFbmQgb2YgZnVuY3Rpb24gZmluZEZvcm1GaWVsZFxyXG5cclxuICAgICAgICAvLyBTaG93IGEgc2luZ2xlIGF0dHJpYnV0ZSBvZiBhIG5vZGUsIGVuY2xvc2VkIGluIGEgdGFibGVcclxuICAgICAgICAvLyAgIG5vZGUgICAgICAgICAgICAgICBUaGUgWE1MIG5vZGVcclxuICAgICAgICAvLyAgIG9wdCAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBzZXQgb2Ygb3B0aW9uc1xyXG4gICAgICAgIHNob3dBdHRyczogZnVuY3Rpb24obm9kZSkge1xyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIG91dCA9IFwiPHRhYmxlIGNsYXNzPSdtcy12Yicgd2lkdGg9JzEwMCUnPlwiO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXQgKz0gXCI8dHI+PHRkIHdpZHRoPScxMHB4JyBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlwiICsgaSArIFwiPC90ZD48dGQgd2lkdGg9JzEwMHB4Jz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hdHRyaWJ1dGVzLml0ZW0oaSkubm9kZU5hbWUgKyBcIjwvdGQ+PHRkPlwiICsgdXRpbHMuY2hlY2tMaW5rKG5vZGUuYXR0cmlidXRlcy5pdGVtKGkpLm5vZGVWYWx1ZSkgKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXQgKz0gXCI8L3RhYmxlPlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBzaG93QXR0cnNcclxuXHJcbiAgICAgICAgLy8gQWRkIHRoZSBvcHRpb24gdmFsdWVzIHRvIHRoZSBTUFNlcnZpY2VzLlNPQVBFbnZlbG9wZS5wYXlsb2FkIGZvciB0aGUgb3BlcmF0aW9uXHJcbiAgICAgICAgLy8gIG9wdCA9IG9wdGlvbnMgZm9yIHRoZSBjYWxsXHJcbiAgICAgICAgLy8gIFNPQVBFbnZlbG9wZSA9IGVudmVsb3BlIHRvIGFkZCB0b1xyXG4gICAgICAgIC8vICBwYXJhbUFycmF5ID0gYW4gYXJyYXkgb2Ygb3B0aW9uIG5hbWVzIHRvIGFkZCB0byB0aGUgcGF5bG9hZFxyXG4gICAgICAgIC8vICAgICAgXCJwYXJhbU5hbWVcIiBpZiB0aGUgcGFyYW1ldGVyIG5hbWUgYW5kIHRoZSBvcHRpb24gbmFtZSBtYXRjaFxyXG4gICAgICAgIC8vICAgICAgW1wicGFyYW1OYW1lXCIsIFwib3B0aW9uTmFtZVwiXSBpZiB0aGUgcGFyYW1ldGVyIG5hbWUgYW5kIHRoZSBvcHRpb24gbmFtZSBhcmUgZGlmZmVyZW50ICh0aGlzIGhhbmRsZXMgZWFybHkgXCJ3cmFwcGluZ3NcIiB3aXRoIGluY29uc2lzdGVudCBuYW1pbmcpXHJcbiAgICAgICAgLy8gICAgICB7bmFtZTogXCJwYXJhbU5hbWVcIiwgc2VuZE51bGw6IGZhbHNlfSBpbmRpY2F0ZXMgdGhlIGVsZW1lbnQgaXMgbWFya2VkIGFzIFwiYWRkIHRvIHBheWxvYWQgb25seSBpZiBub24tbnVsbFwiXHJcbiAgICAgICAgYWRkVG9QYXlsb2FkOiBmdW5jdGlvbihvcHQsIFNPQVBFbnZlbG9wZSwgcGFyYW1BcnJheSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFyYW1BcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhlIHBhcmFtZXRlciBuYW1lIGFuZCB0aGUgb3B0aW9uIG5hbWUgbWF0Y2hcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyYW1BcnJheVtpXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKHBhcmFtQXJyYXlbaV0sIG9wdFtwYXJhbUFycmF5W2ldXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHBhcmFtZXRlciBuYW1lIGFuZCB0aGUgb3B0aW9uIG5hbWUgYXJlIGRpZmZlcmVudFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkLmlzQXJyYXkocGFyYW1BcnJheVtpXSkgJiYgcGFyYW1BcnJheVtpXS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSB1dGlscy53cmFwTm9kZShwYXJhbUFycmF5W2ldWzBdLCBvcHRbcGFyYW1BcnJheVtpXVsxXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBlbGVtZW50IG5vdCBhIHN0cmluZyBvciBhbiBhcnJheSBhbmQgaXMgbWFya2VkIGFzIFwiYWRkIHRvIHBheWxvYWQgb25seSBpZiBub24tbnVsbFwiXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgcGFyYW1BcnJheVtpXSA9PT0gXCJvYmplY3RcIikgJiYgKHBhcmFtQXJyYXlbaV0uc2VuZE51bGwgIT09IHVuZGVmaW5lZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSAoKG9wdFtwYXJhbUFycmF5W2ldLm5hbWVdID09PSB1bmRlZmluZWQpIHx8IChvcHRbcGFyYW1BcnJheVtpXS5uYW1lXS5sZW5ndGggPT09IDApKSA/IFwiXCIgOiB1dGlscy53cmFwTm9kZShwYXJhbUFycmF5W2ldLm5hbWUsIG9wdFtwYXJhbUFycmF5W2ldLm5hbWVdKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzb21ldGhpbmcgaXNuJ3QgcmlnaHQsIHNvIHJlcG9ydCBpdFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3gob3B0Lm9wZXJhdGlvbiwgXCJwYXJhbUFycmF5W1wiICsgaSArIFwiXTogXCIgKyBwYXJhbUFycmF5W2ldLCBcIkludmFsaWQgcGFyYW1BcnJheSBlbGVtZW50IHBhc3NlZCB0byBhZGRUb1BheWxvYWQoKVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBhZGRUb1BheWxvYWRcclxuXHJcblxyXG4gICAgICAgIC8vIFRoZSBTaXRlRGF0YSBvcGVyYXRpb25zIGhhdmUgdGhlIHNhbWUgbmFtZXMgYXMgb3RoZXIgV2ViIFNlcnZpY2Ugb3BlcmF0aW9ucy4gVG8gbWFrZSB0aGVtIGVhc3kgdG8gY2FsbCBhbmQgdW5pcXVlLCBJJ20gdXNpbmdcclxuICAgICAgICAvLyB0aGUgU2l0ZURhdGEgcHJlZml4IG9uIHRoZWlyIG5hbWVzLiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHRoYXQgbmFtZSB3aXRoIHRoZSByaWdodCBuYW1lIGluIHRoZSBTUFNlcnZpY2VzLlNPQVBFbnZlbG9wZS5cclxuICAgICAgICBzaXRlRGF0YUZpeFNPQVBFbnZlbG9wZTogZnVuY3Rpb24oU09BUEVudmVsb3BlLCBzaXRlRGF0YU9wZXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgc2l0ZURhdGFPcCA9IHNpdGVEYXRhT3BlcmF0aW9uLnN1YnN0cmluZyg4KTtcclxuICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyID0gU09BUEVudmVsb3BlLm9waGVhZGVyLnJlcGxhY2Uoc2l0ZURhdGFPcGVyYXRpb24sIHNpdGVEYXRhT3ApO1xyXG4gICAgICAgICAgICBTT0FQRW52ZWxvcGUub3Bmb290ZXIgPSBTT0FQRW52ZWxvcGUub3Bmb290ZXIucmVwbGFjZShzaXRlRGF0YU9wZXJhdGlvbiwgc2l0ZURhdGFPcCk7XHJcbiAgICAgICAgICAgIHJldHVybiBTT0FQRW52ZWxvcGU7XHJcbiAgICAgICAgfSwgLy8gRW5kIG9mIGZ1bmN0aW9uIHNpdGVEYXRhRml4U09BUEVudmVsb3BlXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIFVSTCBmb3IgYSBzcGVjaWZpZWQgZm9ybSBmb3IgYSBsaXN0XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0TGlzdEZvcm1Vcmw6IGZ1bmN0aW9uKGwsIGYpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB1O1xyXG4gICAgICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0Rm9ybUNvbGxlY3Rpb25cIixcclxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB1ID0gJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkZvcm1bVHlwZT0nXCIgKyBmICsgXCInXVwiKS5hdHRyKFwiVXJsXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHU7XHJcblxyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBnZXRMaXN0Rm9ybVVybFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzZWxlY3RlZCB2YWx1ZShzKSBmb3IgYSBkcm9wZG93biBpbiBhbiBhcnJheS4gRXhwZWN0cyBhIGRyb3Bkb3duXHJcbiAgICAgICAgICogb2JqZWN0IGFzIHJldHVybmVkIGJ5IHRoZSBEcm9wZG93bkN0bCBmdW5jdGlvbi5cclxuICAgICAgICAgKiBJZiBtYXRjaE9uSWQgaXMgdHJ1ZSwgcmV0dXJucyB0aGUgaWRzIHJhdGhlciB0aGFuIHRoZSB0ZXh0IHZhbHVlcyBmb3IgdGhlXHJcbiAgICAgICAgICogc2VsZWN0aW9uIG9wdGlvbnMocykuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29sdW1uU2VsZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1hdGNoT25JZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldERyb3Bkb3duU2VsZWN0ZWQ6IGZ1bmN0aW9uIChjb2x1bW5TZWxlY3QsIG1hdGNoT25JZCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGNvbHVtblNlbGVjdFNlbGVjdGVkID0gW107XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaE9uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0U2VsZWN0ZWQucHVzaChjb2x1bW5TZWxlY3QuT2JqLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudmFsKCkgfHwgW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdFNlbGVjdGVkLnB1c2goY29sdW1uU2VsZWN0Lk9iai5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLnRleHQoKSB8fCBbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoT25JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZC5wdXNoKGNvbHVtblNlbGVjdC5vcHRIaWQudmFsKCkgfHwgW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdFNlbGVjdGVkLnB1c2goY29sdW1uU2VsZWN0Lk9iai52YWwoKSB8fCBbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hPbklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZC5wdXNoKCQodGhpcykudmFsKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0U2VsZWN0ZWQucHVzaCgkKHRoaXMpLmh0bWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtblNlbGVjdFNlbGVjdGVkO1xyXG5cclxuICAgICAgICB9LCAvLyBFbmQgb2YgZnVuY3Rpb24gZ2V0RHJvcGRvd25TZWxlY3RlZFxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIGEgY29udGFpbmluZyBkaXYgdXNpbmcgdGhlIGZ1bmN0aW9uIG5hbWUgYW5kIHRoZSBjb2x1bW4gZGlzcGxheSBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZ1bmNuYW1lXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNvbHVtbk5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbGlzdE5hbWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZW5Db250YWluZXJJZDogZnVuY3Rpb24oZnVuY25hbWUsIGNvbHVtbk5hbWUsIGxpc3ROYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBsID0gbGlzdE5hbWUgIT09IHVuZGVmaW5lZCA/IGxpc3ROYW1lIDogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmNuYW1lICsgXCJfXCIgKyAkKCkuU1BTZXJ2aWNlcy5TUEdldFN0YXRpY0Zyb21EaXNwbGF5KHtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0TmFtZTogbCxcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5EaXNwbGF5TmFtZTogY29sdW1uTmFtZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSAvLyBFbmQgb2YgZnVuY3Rpb24gZ2VuQ29udGFpbmVySWRcclxuXHJcbiAgICB9LCAvL2VuZDogdXRpbHNcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tWyBQUklWQVRFIE1FVEhPRFMgQkVMT1cgXS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gVGhlc2Ugc2hvdWxkIGFsbCBiZSBkZWZpbmVkIGFnYWluc3QgYSBsb2NhbCB2YXJpYWJsZSBzb1xyXG4gICAgLy8gdGhhdCB3ZSBnZXQgc21hbGxlciBtaW5pZmllZCBmaWxlc1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbCB0aGlzIGZ1bmN0aW9uIHRvIHBvcCB1cCBhIGJyYW5kZWQgbW9kYWwgbXNnQm94XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBtb2RhbEJveCA9IGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgIHZhciBib3hDU1MgPSBcInBvc2l0aW9uOmFic29sdXRlO3dpZHRoOjMwMHB4O2hlaWdodDoxNTBweDtwYWRkaW5nOjEwcHg7YmFja2dyb3VuZC1jb2xvcjojMDAwMDAwO2NvbG9yOiNmZmZmZmY7ei1pbmRleDozMDtmb250LWZhbWlseTonQXJpYWwnO2ZvbnQtc2l6ZToxMnB4O2Rpc3BsYXk6bm9uZTtcIjtcclxuICAgICAgICAkKFwiI2FzcG5ldEZvcm1cIikucGFyZW50KCkuYXBwZW5kKFwiPGRpdiBpZD0nU1BTZXJ2aWNlc19tc2dCb3gnIHN0eWxlPVwiICsgYm94Q1NTICsgXCI+XCIgKyBtc2cpO1xyXG4gICAgICAgIHZhciBtc2dCb3hPYmogPSAkKFwiI1NQU2VydmljZXNfbXNnQm94XCIpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSBtc2dCb3hPYmouaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gbXNnQm94T2JqLndpZHRoKCk7XHJcbiAgICAgICAgdmFyIGxlZnRWYWwgPSAoJCh3aW5kb3cpLndpZHRoKCkgLyAyKSAtICh3aWR0aCAvIDIpICsgXCJweFwiO1xyXG4gICAgICAgIHZhciB0b3BWYWwgPSAoJCh3aW5kb3cpLmhlaWdodCgpIC8gMikgLSAoaGVpZ2h0IC8gMikgLSAxMDAgKyBcInB4XCI7XHJcbiAgICAgICAgbXNnQm94T2JqLmNzcyh7XHJcbiAgICAgICAgICAgIGJvcmRlcjogJzVweCAjQzAyMDAwIHNvbGlkJyxcclxuICAgICAgICAgICAgbGVmdDogbGVmdFZhbCxcclxuICAgICAgICAgICAgdG9wOiB0b3BWYWxcclxuICAgICAgICB9KS5zaG93KCkuZmFkZVRvKFwic2xvd1wiLCAwLjc1KS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuZmFkZU91dChcIjMwMDBcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9OyAvLyBFbmQgb2YgZnVuY3Rpb24gbW9kYWxCb3g7XHJcblxyXG5cclxuICAgIHJldHVybiB1dGlscztcclxuXHJcbn0pO1xyXG5cclxuIixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgY29uc3RhbnRzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFJldHVybiB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIFNQU2VydmljZXMgYXMgYSBzdHJpbmdcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5WZXJzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gY29uc3RhbnRzLlZFUlNJT047XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5WZXJzaW9uXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpbnRhaW5zIGEgc2V0IG9mIGNvbnN0YW50cyBmb3IgU1BTZXJ2aWNlcy5cclxuICAgICAqXHJcbiAgICAgKiBAbmFtZXNwYWNlIGNvbnN0YW50c1xyXG4gICAgICovXHJcblxyXG4gICAgdmFyIGNvbnN0YW50cyA9IHtcclxuXHJcbiAgICAgICAgLy8gVmVyc2lvbiBpbmZvXHJcbiAgICAgICAgVkVSU0lPTjogXCJAVkVSU0lPTlwiLCAvLyB1cGRhdGUgaXQgaW4gcGFja2FnZS5qc29uLi4uIGJ1aWxkIHRha2VzIGNhcmUgb2YgdGhlIHJlc3RcclxuXHJcbiAgICAgICAgLy8gU2ltcGxlIHN0cmluZ3NcclxuICAgICAgICBzcERlbGltOiBcIjsjXCIsXHJcbiAgICAgICAgU0xBU0g6IFwiL1wiLFxyXG4gICAgICAgIFRYVENvbHVtbk5vdEZvdW5kOiBcIkNvbHVtbiBub3QgZm91bmQgb24gcGFnZVwiLFxyXG5cclxuICAgICAgICAvLyBTdHJpbmcgY29uc3RhbnRzXHJcbiAgICAgICAgLy8gICBHZW5lcmFsXHJcbiAgICAgICAgU0NIRU1BU2hhcmVQb2ludDogXCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3NoYXJlcG9pbnRcIixcclxuICAgICAgICBTQ0hFTUFOaW50ZXg6IFwiaHR0cDovL25pbnRleC5jb21cIixcclxuICAgICAgICBtdWx0aUxvb2t1cFByZWZpeDogXCJNdWx0aUxvb2t1cFBpY2tlclwiLFxyXG4gICAgICAgIG11bHRpTG9va3VwUHJlZml4MjAxMzogXCJNdWx0aUxvb2t1cFwiLFxyXG5cclxuICAgICAgICAvLyBEcm9wZG93biBUeXBlc1xyXG4gICAgICAgIGRyb3Bkb3duVHlwZToge1xyXG4gICAgICAgICAgICBzaW1wbGU6IFwiU1wiLFxyXG4gICAgICAgICAgICBjb21wbGV4OiBcIkNcIixcclxuICAgICAgICAgICAgbXVsdGlTZWxlY3Q6IFwiTVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gS25vd24gbGlzdCBmaWVsZCB0eXBlcyAtIFNlZTogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L29mZmljZS9taWNyb3NvZnQuc2hhcmVwb2ludC5zcGZpZWxkdHlwZSh2PW9mZmljZS4xNSkuYXNweFxyXG4gICAgICAgIHNwTGlzdEZpZWxkVHlwZXM6IFtcclxuICAgICAgICAgICAgXCJJbnRlZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiVGV4dFwiLFxyXG4gICAgICAgICAgICBcIk5vdGVcIixcclxuICAgICAgICAgICAgXCJEYXRlVGltZVwiLFxyXG4gICAgICAgICAgICBcIkNvdW50ZXJcIixcclxuICAgICAgICAgICAgXCJDaG9pY2VcIixcclxuICAgICAgICAgICAgXCJMb29rdXBcIixcclxuICAgICAgICAgICAgXCJCb29sZWFuXCIsXHJcbiAgICAgICAgICAgIFwiTnVtYmVyXCIsXHJcbiAgICAgICAgICAgIFwiQ3VycmVuY3lcIixcclxuICAgICAgICAgICAgXCJVUkxcIixcclxuLy8gICAgICAgIFwiQ29tcHV0ZWRcIiwgLy8gTkVXXHJcbi8vICAgICAgICBcIlRocmVhZGluZ1wiLCAvLyBORVdcclxuLy8gICAgICAgIFwiR3VpZFwiLCAvLyBORVdcclxuICAgICAgICAgICAgXCJNdWx0aUNob2ljZVwiLFxyXG4vLyAgICAgICAgXCJHcmlkQ2hvaWNlXCIsIC8vIE5FV1xyXG4gICAgICAgICAgICBcIkNhbGN1bGF0ZWRcIixcclxuICAgICAgICAgICAgXCJGaWxlXCIsXHJcbiAgICAgICAgICAgIFwiQXR0YWNobWVudHNcIixcclxuICAgICAgICAgICAgXCJVc2VyXCIsXHJcbiAgICAgICAgICAgIFwiUmVjdXJyZW5jZVwiLCAvLyBSZWN1cnJpbmcgZXZlbnQgaW5kaWNhdG9yIChib29sZWFuKSBbMCB8IDFdXHJcbi8vICAgICAgICBcIkNyb3NzUHJvamVjdExpbmtcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiTW9kU3RhdFwiLFxyXG4gICAgICAgICAgICBcIkNvbnRlbnRUeXBlSWRcIixcclxuLy8gICAgICAgIFwiUGFnZVNlcGFyYXRvclwiLCAvLyBORVdcclxuLy8gICAgICAgIFwiVGhyZWFkSW5kZXhcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiV29ya2Zsb3dTdGF0dXNcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiQWxsRGF5RXZlbnRcIiwgLy8gQWxsIGRheSBldmVudCBpbmRpY2F0b3IgKGJvb2xlYW4pIFswIHwgMV1cclxuLy8gICAgICBcIldvcmtmbG93RXZlbnRUeXBlXCIsIC8vIE5FV1xyXG4vLyAgICAgICAgXCJHZW9sb2NhdGlvblwiLCAvLyBORVdcclxuLy8gICAgICAgIFwiT3V0Y29tZUNob2ljZVwiLCAvLyBORVdcclxuICAgICAgICAgICAgXCJSZWxhdGVkSXRlbXNcIiwgLy8gUmVsYXRlZCBJdGVtcyBpbiBhIFdvcmtmbG93IFRhc2tzIGxpc3RcclxuXHJcbiAgICAgICAgICAgIC8vIEFsc28gc2VlblxyXG4gICAgICAgICAgICBcIlVzZXJNdWx0aVwiLCAvLyBNdWx0aXNlbGVjdCB1c2Vyc1xyXG4gICAgICAgICAgICBcIkxvb2t1cE11bHRpXCIsIC8vIE11bHRpLXNlbGVjdCBsb29rdXBcclxuICAgICAgICAgICAgXCJkYXRldGltZVwiLCAvLyBDYWxjdWxhdGVkIGRhdGUvdGltZSByZXN1bHRcclxuICAgICAgICAgICAgXCJmbG9hdFwiLCAvLyBDYWxjdWxhdGVkIGZsb2F0XHJcbiAgICAgICAgICAgIFwiQ2FsY1wiIC8vIEdlbmVyYWwgY2FsY3VsYXRlZFxyXG4gICAgICAgIF1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBjb25zdGFudHM7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIENvbnZlcnQgYSBKYXZhU2NyaXB0IGRhdGUgdG8gdGhlIElTTyA4NjAxIGZvcm1hdCByZXF1aXJlZCBieSBTaGFyZVBvaW50IHRvIHVwZGF0ZSBsaXN0IGl0ZW1zXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BDb252ZXJ0RGF0ZVRvSVNPID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGRhdGVUb0NvbnZlcnQ6IG5ldyBEYXRlKCksIC8vIFRoZSBKYXZhU2NyaXB0IGRhdGUgd2UnZCBsaWtlIHRvIGNvbnZlcnQuIElmIG5vIGRhdGUgaXMgcGFzc2VkLCB0aGUgZnVuY3Rpb24gcmV0dXJucyB0aGUgY3VycmVudCBkYXRlL3RpbWVcclxuICAgICAgICAgICAgZGF0ZU9mZnNldDogXCItMDU6MDBcIiAvLyBUaGUgdGltZSB6b25lIG9mZnNldCByZXF1ZXN0ZWQuIERlZmF1bHQgaXMgRVNUXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vR2VuZXJhdGUgSVNPIDg2MDEgZGF0ZS90aW1lIGZvcm1hdHRlZCBzdHJpbmdcclxuICAgICAgICB2YXIgcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGQgPSBvcHQuZGF0ZVRvQ29udmVydDtcclxuICAgICAgICBzICs9IGQuZ2V0RnVsbFllYXIoKSArIFwiLVwiO1xyXG4gICAgICAgIHMgKz0gdXRpbHMucGFkKGQuZ2V0TW9udGgoKSArIDEpICsgXCItXCI7XHJcbiAgICAgICAgcyArPSB1dGlscy5wYWQoZC5nZXREYXRlKCkpO1xyXG4gICAgICAgIHMgKz0gXCJUXCIgKyB1dGlscy5wYWQoZC5nZXRIb3VycygpKSArIFwiOlwiO1xyXG4gICAgICAgIHMgKz0gdXRpbHMucGFkKGQuZ2V0TWludXRlcygpKSArIFwiOlwiO1xyXG4gICAgICAgIHMgKz0gdXRpbHMucGFkKGQuZ2V0U2Vjb25kcygpKSArIFwiWlwiICsgb3B0LmRhdGVPZmZzZXQ7XHJcbiAgICAgICAgLy9SZXR1cm4gdGhlIElTTzg2MDEgZGF0ZSBzdHJpbmdcclxuICAgICAgICByZXR1cm4gcztcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQQ29udmVydERhdGVUb0lTT1xyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzJyxcclxuICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUuanMnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBVdGlsaXR5IGZ1bmN0aW9uIHRvIHNob3cgdGhlIHJlc3VsdHMgb2YgYSBXZWIgU2VydmljZSBjYWxsIGZvcm1hdHRlZCB3ZWxsIGluIHRoZSBicm93c2VyLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQRGVidWdYTUxIdHRwUmVzdWx0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIG5vZGU6IG51bGwsIC8vIEFuIFhNTEh0dHBSZXN1bHQgb2JqZWN0IGZyb20gYW4gYWpheCBjYWxsXHJcbiAgICAgICAgICAgIGluZGVudDogMCAvLyBOdW1iZXIgb2YgaW5kZW50c1xyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICB2YXIgTk9ERV9URVhUID0gMztcclxuICAgICAgICB2YXIgTk9ERV9DREFUQV9TRUNUSU9OID0gNDtcclxuXHJcbiAgICAgICAgdmFyIG91dFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgLy8gRm9yIGVhY2ggbmV3IHN1Ym5vZGUsIGJlZ2luIHJlbmRlcmluZyBhIG5ldyBUQUJMRVxyXG4gICAgICAgIG91dFN0cmluZyArPSBcIjx0YWJsZSBjbGFzcz0nbXMtdmInIHN0eWxlPSdtYXJnaW4tbGVmdDpcIiArIG9wdC5pbmRlbnQgKiAzICsgXCJweDsnIHdpZHRoPScxMDAlJz5cIjtcclxuICAgICAgICAvLyBEaXNwbGF5UGF0dGVybnMgYXJlIGEgYml0IHVuaXF1ZSwgc28gbGV0J3MgaGFuZGxlIHRoZW0gZGlmZmVyZW50bHlcclxuICAgICAgICBpZiAob3B0Lm5vZGUubm9kZU5hbWUgPT09IFwiRGlzcGxheVBhdHRlcm5cIikge1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkIHdpZHRoPScxMDBweCcgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5cIiArIG9wdC5ub2RlLm5vZGVOYW1lICtcclxuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+PHRleHRhcmVhIHJlYWRvbmx5PSdyZWFkb25seScgcm93cz0nNScgY29scz0nNTAnPlwiICsgb3B0Lm5vZGUueG1sICsgXCI8L3RleHRhcmVhPjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgLy8gQSBub2RlIHdoaWNoIGhhcyBubyBjaGlsZHJlblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIW9wdC5ub2RlLmhhc0NoaWxkTm9kZXMoKSkge1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkIHdpZHRoPScxMDBweCcgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5cIiArIG9wdC5ub2RlLm5vZGVOYW1lICtcclxuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+XCIgKyAoKG9wdC5ub2RlLm5vZGVWYWx1ZSAhPT0gbnVsbCkgPyB1dGlscy5jaGVja0xpbmsob3B0Lm5vZGUubm9kZVZhbHVlKSA6IFwiJm5ic3A7XCIpICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgIGlmIChvcHQubm9kZS5hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkIGNvbHNwYW49Jzk5Jz5cIiArIHV0aWxzLnNob3dBdHRycyhvcHQubm9kZSkgKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBBIENEQVRBX1NFQ1RJT04gbm9kZVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0Lm5vZGUuaGFzQ2hpbGROb2RlcygpICYmIG9wdC5ub2RlLmZpcnN0Q2hpbGQubm9kZVR5cGUgPT09IE5PREVfQ0RBVEFfU0VDVElPTikge1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkIHdpZHRoPScxMDBweCcgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7Jz5cIiArIG9wdC5ub2RlLm5vZGVOYW1lICtcclxuICAgICAgICAgICAgICAgIFwiPC90ZD48dGQ+PHRleHRhcmVhIHJlYWRvbmx5PSdyZWFkb25seScgcm93cz0nNScgY29scz0nNTAnPlwiICsgb3B0Lm5vZGUucGFyZW50Tm9kZS50ZXh0ICsgXCI8L3RleHRhcmVhPjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgLy8gQSBURVhUIG5vZGVcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5ub2RlLmhhc0NoaWxkTm9kZXMoKSAmJiBvcHQubm9kZS5maXJzdENoaWxkLm5vZGVUeXBlID09PSBOT0RFX1RFWFQpIHtcclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCB3aWR0aD0nMTAwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+XCIgKyBvcHQubm9kZS5ub2RlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICsgdXRpbHMuY2hlY2tMaW5rKG9wdC5ub2RlLmZpcnN0Q2hpbGQubm9kZVZhbHVlKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICAvLyBIYW5kbGUgY2hpbGQgbm9kZXNcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkIHdpZHRoPScxMDBweCcgc3R5bGU9J2ZvbnQtd2VpZ2h0OmJvbGQ7JyBjb2xzcGFuPSc5OSc+XCIgKyBvcHQubm9kZS5ub2RlTmFtZSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICBpZiAob3B0Lm5vZGUuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCBjb2xzcGFuPSc5OSc+XCIgKyB1dGlscy5zaG93QXR0cnMob3B0Lm5vZGUpICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaGFzIGNoaWxkIG5vZGVzLCByZWN1cnNlXHJcbiAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj48dGQ+XCI7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQubm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gJCgpLlNQU2VydmljZXMuU1BEZWJ1Z1hNTEh0dHBSZXN1bHQoe1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG9wdC5ub2RlLmNoaWxkTm9kZXMuaXRlbShpKSxcclxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IG9wdC5pbmRlbnQgKyAxXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dFN0cmluZyArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBIVE1MIHdoaWNoIHdlIGhhdmUgYnVpbHQgdXBcclxuICAgICAgICByZXR1cm4gb3V0U3RyaW5nO1xyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUERlYnVnWE1MSHR0cFJlc3VsdFxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzJyxcclxuICAgIFwiLi4vdXRpbHMvY29uc3RhbnRzXCIsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIHV0aWxzLFxyXG4gICAgY29uc3RhbnRzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZpbmQgYSBkcm9wZG93biAob3IgbXVsdGktc2VsZWN0KSBpbiB0aGUgRE9NLiBSZXR1cm5zIHRoZSBkcm9wZG93biBvYmplY3QgYW5kIGl0cyB0eXBlOlxyXG4gICAgLy8gUyA9IFNpbXBsZSAoc2VsZWN0KVxyXG4gICAgLy8gQyA9IENvbXBvdW5kIChpbnB1dCArIHNlbGVjdCBoeWJyaWQpXHJcbiAgICAvLyBNID0gTXVsdGktc2VsZWN0IChzZWxlY3QgaHlicmlkKVxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IFwiXCIgLy8gVGhlIGRpc3BsYXlOYW1lIG9mIHRoZSBjb2x1bW4gb24gdGhlIGZvcm1cclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbHVtbk9iaiA9IHt9O1xyXG5cclxuLy8gUGF1bCBULiwgMjAxNS4wNS4wMjogQ29tbWVudGVkIG91dCBzaW5jZSBpcyBub3QgY3VycmVudGx5IHVzZWRcclxuICAgICAgICAvLyB2YXIgY29sU3RhdGljTmFtZSA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0U3RhdGljRnJvbURpc3BsYXkoe1xyXG4gICAgICAgIC8vIGxpc3ROYW1lOiAkKCkuU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybCgpLFxyXG4gICAgICAgIC8vIGNvbHVtbkRpc3BsYXlOYW1lOiBvcHQuZGlzcGxheU5hbWVcclxuICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgLy8gU2ltcGxlLCB3aGVyZSB0aGUgc2VsZWN0J3MgdGl0bGUgYXR0cmlidXRlIGlzIGNvbE5hbWUgKERpc3BsYXlOYW1lKVxyXG4gICAgICAgIC8vICBFeGFtcGxlczpcclxuICAgICAgICAvLyAgICAgIFNQMjAxMyA8c2VsZWN0IHRpdGxlPVwiQ291bnRyeVwiIGlkPVwiQ291bnRyeV9kNTc4ZWQ2NC0yZmE3LTRjMWUtOGI0MS05Y2MxZDUyNGZjMjhfJExvb2t1cEZpZWxkXCI+XHJcbiAgICAgICAgLy8gICAgICBTUDIwMTA6IDxTRUxFQ1QgbmFtZT1jdGwwMCRtJGdfZDEwNDc5ZDdfNjk2NV80ZGEwX2IxNjJfNTEwYmJiYzU4YTdmJGN0bDAwJGN0bDA1JGN0bDAxJGN0bDAwJGN0bDAwJGN0bDA0JGN0bDAwJExvb2t1cCB0aXRsZT1Db3VudHJ5IGlkPWN0bDAwX21fZ19kMTA0NzlkN182OTY1XzRkYTBfYjE2Ml81MTBiYmJjNThhN2ZfY3RsMDBfY3RsMDVfY3RsMDFfY3RsMDBfY3RsMDBfY3RsMDRfY3RsMDBfTG9va3VwPlxyXG4gICAgICAgIC8vICAgICAgU1AyMDA3OiA8c2VsZWN0IG5hbWU9XCJjdGwwMCRtJGdfZTg0NWU2OTBfMDBkYV80MjhmX2FmYmRfZmJlODA0Nzg3NzYzJGN0bDAwJGN0bDA0JGN0bDA0JGN0bDAwJGN0bDAwJGN0bDA0JGN0bDAwJExvb2t1cFwiIFRpdGxlPVwiQ291bnRyeVwiIGlkPVwiY3RsMDBfbV9nX2U4NDVlNjkwXzAwZGFfNDI4Zl9hZmJkX2ZiZTgwNDc4Nzc2M19jdGwwMF9jdGwwNF9jdGwwNF9jdGwwMF9jdGwwMF9jdGwwNF9jdGwwMF9Mb29rdXBcIj5cclxuICAgICAgICBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwic2VsZWN0W1RpdGxlPSdcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlO1xyXG4gICAgICAgICAgICAvLyBDb21wb3VuZFxyXG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwiaW5wdXRbVGl0bGU9J1wiICsgb3B0LmRpc3BsYXlOYW1lICsgXCInXVwiKSkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5UeXBlID0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4O1xyXG4gICAgICAgICAgICAvLyBTaW1wbGUsIHdoZXJlIHRoZSBzZWxlY3QncyBpZCBiZWdpbnMgd2l0aCBjb2xTdGF0aWNOYW1lIChTdGF0aWNOYW1lKSAtIG5lZWRlZCBmb3IgcmVxdWlyZWQgY29sdW1ucyB3aGVyZSB0aXRsZT1cIkRpc3BsYXlOYW1lIFJlcXVpcmVkIEZpZWxkXCJcclxuICAgICAgICAgICAgLy8gICBFeGFtcGxlOiBTUDIwMTMgPHNlbGVjdCB0aXRsZT1cIlJlZ2lvbiBSZXF1aXJlZCBGaWVsZFwiIGlkPVwiUmVnaW9uXzU5NTY2ZjZmLTFjM2ItNGVmYi05YjdiLTZkYmMzNWZlM2IwYV8kTG9va3VwRmllbGRcIiBzaG93cmVsYXRlZHNlbGVjdGVkPVwiM1wiPlxyXG4vLyAgICAgICAgfSBlbHNlIGlmICgoY29sdW1uT2JqLk9iaiA9ICQoXCJzZWxlY3Q6cmVnZXgoaWQsIChcIiArIGNvbFN0YXRpY05hbWUgKyBcIikoXylbMC05YS1mQS1GXXs4fSgtKSlcIikpLmxlbmd0aCA9PT0gMSkge1xyXG4vLyAgICAgICAgICAgIGNvbHVtbk9iai5UeXBlID0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU7XHJcbiAgICAgICAgICAgIC8vIE11bHRpLXNlbGVjdDogVGhpcyB3aWxsIGZpbmQgdGhlIG11bHRpLXNlbGVjdCBjb2x1bW4gY29udHJvbCBpbiBFbmdsaXNoIGFuZCBtb3N0IG90aGVyIGxhbmd1YWdlIHNpdGVzIHdoZXJlIHRoZSBUaXRsZSBsb29rcyBsaWtlICdDb2x1bW4gTmFtZSBwb3NzaWJsZSB2YWx1ZXMnXHJcbiAgICAgICAgfSBlbHNlIGlmICgoY29sdW1uT2JqLk9iaiA9ICQoXCJzZWxlY3RbSUQkPSdTZWxlY3RDYW5kaWRhdGUnXVtUaXRsZV49J1wiICsgb3B0LmRpc3BsYXlOYW1lICsgXCIgJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q7XHJcbiAgICAgICAgICAgIC8vIE11bHRpLXNlbGVjdDogVGhpcyB3aWxsIGZpbmQgdGhlIG11bHRpLXNlbGVjdCBjb2x1bW4gY29udHJvbCBvbiBhIFJ1c3NpYW4gc2l0ZSAoYW5kIHBlcmhhcHMgb3RoZXJzKSB3aGVyZSB0aGUgVGl0bGUgbG9va3MgbGlrZSAnPz8/Pz8/Pz8/ID8/Pz8/Pz8/OiBDb2x1bW4gTmFtZSdcclxuICAgICAgICB9IGVsc2UgaWYgKChjb2x1bW5PYmouT2JqID0gJChcInNlbGVjdFtJRCQ9J1NlbGVjdENhbmRpZGF0ZSddW1RpdGxlJD0nOiBcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q7XHJcbiAgICAgICAgICAgIC8vIE11bHRpLXNlbGVjdDogVGhpcyB3aWxsIGZpbmQgdGhlIG11bHRpLXNlbGVjdCBjb2x1bW4gY29udHJvbCBvbiBhIEdlcm1hbiBzaXRlIChhbmQgcGVyaGFwcyBvdGhlcnMpXHJcbiAgICAgICAgfSBlbHNlIGlmICgoY29sdW1uT2JqLk9iaiA9ICQoXCJzZWxlY3RbSUQkPSdTZWxlY3RDYW5kaWRhdGUnXVtUaXRsZSQ9J1xcXCJcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiXFxcIi4nXVwiKSkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5UeXBlID0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5tdWx0aVNlbGVjdDtcclxuICAgICAgICAgICAgLy8gTXVsdGktc2VsZWN0OiBUaGlzIHdpbGwgZmluZCB0aGUgbXVsdGktc2VsZWN0IGNvbHVtbiBjb250cm9sIG9uIGEgSXRhbGlhbiBzaXRlIChhbmQgcGVyaGFwcyBvdGhlcnMpIHdoZXJlIHRoZSBUaXRsZSBsb29rcyBsaWtlIFwiVmFsb3JpIHBvc3NpYmlsaSBDb2x1bW4gbmFtZVwiXHJcbiAgICAgICAgfSBlbHNlIGlmICgoY29sdW1uT2JqLk9iaiA9ICQoXCJzZWxlY3RbSUQkPSdTZWxlY3RDYW5kaWRhdGUnXVtUaXRsZSQ9JyBcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gTGFzdCBkaXRjaCBlZmZvcnRcclxuICAgICAgICAvLyBTaW1wbGUsIGZpbmRpbmcgYmFzZWQgb24gdGhlIGNvbW1lbnQgdGV4dCBhdCB0aGUgdG9wIG9mIHRoZSB0ZC5tcy1mb3JtYm9keSB3aGVyZSB0aGUgc2VsZWN0J3MgdGl0bGUgYmVnaW5zIHdpdGggRGlzcGxheU5hbWUgLSBuZWVkZWQgZm9yIHJlcXVpcmVkIGNvbHVtbnMgd2hlcmUgdGl0bGU9XCJEaXNwbGF5TmFtZSBSZXF1aXJlZCBGaWVsZFwiXHJcbiAgICAgICAgLy8gICBFeGFtcGxlczogU1AyMDEwIDxzZWxlY3QgbmFtZT1cImN0bDAwJG0kZ18zMDgxMzVmOF8zZjU5XzRkNjdfYjVmOF9jMjY3NzZjNDk4YjckZmY1MSRjdGwwMCRMb29rdXBcIiBpZD1cImN0bDAwX21fZ18zMDgxMzVmOF8zZjU5XzRkNjdfYjVmOF9jMjY3NzZjNDk4YjdfZmY1MV9jdGwwMF9Mb29rdXBcIiB0aXRsZT1cIlJlZ2lvbiBSZXF1aXJlZCBGaWVsZFwiPlxyXG4gICAgICAgIC8vICAgICAgICAgICAgU1AyMDEzIDxzZWxlY3QgaWQ9XCJTb29ydF94MDAyMF9tZWRpY2lqbl9kZWQxOTkzMi0wYjRmLTRkNzEtYmMzYi0yZDUxMGU1ZjI5N2FfJExvb2t1cEZpZWxkXCIgdGl0bGU9XCJTb29ydCBtZWRpY2lqbiBWZXJlaXN0IHZlbGRcIj5cclxuICAgICAgICBpZiAoY29sdW1uT2JqLlR5cGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkQ29udGFpbmVyID0gdXRpbHMuZmluZEZvcm1GaWVsZChvcHQuZGlzcGxheU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZmllbGRDb250YWluZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkU2VsZWN0MSA9IGZpZWxkQ29udGFpbmVyLmZpbmQoXCJzZWxlY3RbdGl0bGVePSdcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiICddW2lkJD0nX0xvb2t1cCddXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpZWxkU2VsZWN0MiA9IGZpZWxkQ29udGFpbmVyLmZpbmQoXCJzZWxlY3RbdGl0bGVePSdcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiICddW2lkJD0nTG9va3VwRmllbGQnXVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWVsZFNlbGVjdCA9IGZpZWxkU2VsZWN0MS5sZW5ndGggPiAwID8gZmllbGRTZWxlY3QxIDogZmllbGRTZWxlY3QyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZFNlbGVjdCAmJiBmaWVsZFNlbGVjdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk9iai5PYmogPSBmaWVsZFNlbGVjdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbHVtbk9iai5UeXBlID09PSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXgpIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLm9wdEhpZCA9ICQoXCJpbnB1dFtpZD0nXCIgKyBjb2x1bW5PYmouT2JqLmF0dHIoXCJvcHRIaWRcIikgKyBcIiddXCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29sdW1uT2JqLlR5cGUgPT09IGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3QpIHtcclxuICAgICAgICAgICAgLy8gRmluZCB0aGUgaW1wb3J0YW50IGJpdHMgb2YgdGhlIG11bHRpc2VsZWN0IGNvbnRyb2xcclxuICAgICAgICAgICAgY29sdW1uT2JqLmNvbnRhaW5lciA9IGNvbHVtbk9iai5PYmouY2xvc2VzdChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5NdWx0aUxvb2t1cFBpY2tlcmRhdGEgPSBjb2x1bW5PYmouY29udGFpbmVyLmZpbmQoXCJpbnB1dFtpZCQ9J1wiICsgdXRpbHMubXVsdGlMb29rdXBQcmVmaXggKyBcIl9kYXRhJ10sIGlucHV0W2lkJD0nXCIgKyB1dGlscy5tdWx0aUxvb2t1cFByZWZpeDIwMTMgKyBcIl9kYXRhJ11cIik7XHJcbiAgICAgICAgICAgIHZhciBhZGRCdXR0b25JZCA9IGNvbHVtbk9iai5jb250YWluZXIuZmluZChcIltpZCQ9J0FkZEJ1dHRvbiddXCIpLmF0dHIoXCJpZFwiKTtcclxuICAgICAgICAgICAgY29sdW1uT2JqLm1hc3RlciA9XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbYWRkQnV0dG9uSWQucmVwbGFjZSgvQWRkQnV0dG9uLywgY29uc3RhbnRzLm11bHRpTG9va3VwUHJlZml4ICsgXCJfbVwiKV0gfHwgLy8gU2hhcmVQb2ludCAyMDA3XHJcbiAgICAgICAgICAgICAgICB3aW5kb3dbYWRkQnV0dG9uSWQucmVwbGFjZSgvQWRkQnV0dG9uLywgY29uc3RhbnRzLm11bHRpTG9va3VwUHJlZml4MjAxMyArIFwiX21cIildOyAvLyBTaGFyZVBvaW50IDIwMTNcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb2x1bW5PYmo7XHJcblxyXG4gICAgfTsgLy8gRW5kIG9mIGZ1bmN0aW9uICQuZm4uU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5J1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVGhpcyBtZXRob2QgZm9yIGZpbmRpbmcgc3BlY2lmaWMgbm9kZXMgaW4gdGhlIHJldHVybmVkIFhNTCB3YXMgZGV2ZWxvcGVkIGJ5IFN0ZXZlIFdvcmttYW4uIFNlZSBoaXMgYmxvZyBwb3N0XHJcbiAgICAvLyBodHRwOi8vd3d3LnN0ZXZld29ya21hbi5jb20vaHRtbDUtMi9qYXZhc2NyaXB0LzIwMTEvaW1wcm92aW5nLWphdmFzY3JpcHQteG1sLW5vZGUtZmluZGluZy1wZXJmb3JtYW5jZS1ieS0yMDAwL1xyXG4gICAgLy8gZm9yIHBlcmZvcm1hbmNlIGRldGFpbHMuXHJcbiAgICAkLmZuLlNQRmlsdGVyTm9kZSA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZCgnKicpLmZpbHRlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVOYW1lID09PSBuYW1lO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BGaWx0ZXJOb2RlXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIHZhciBTUFNlcnZpY2VzID0gd2luZG93LlNQU2VydmljZXMgfHwge307XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gZGV0ZXJtaW5lIHRoZSBjdXJyZW50IFdlYidzIFVSTC4gIFdlIG5lZWQgdGhpcyBmb3Igc3VjY2Vzc2Z1bCBBamF4IGNhbGxzLlxyXG4gICAgLy8gVGhlIGZ1bmN0aW9uIGlzIGFsc28gYXZhaWxhYmxlIGFzIGEgcHVibGljIGZ1bmN0aW9uLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFNpdGUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50Q29udGV4dCA9IHV0aWxzLlNQU2VydmljZXNDb250ZXh0KCk7XHJcblxyXG4gICAgICAgIC8vIFdlJ3ZlIGFscmVhZHkgZGV0ZXJtaW5lZCB0aGUgY3VycmVudCBzaXRlLi4uXHJcbiAgICAgICAgaWYgKGN1cnJlbnRDb250ZXh0LnRoaXNTaXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0LnRoaXNTaXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgd2Ugc3RpbGwgZG9uJ3Qga25vdyB0aGUgY3VycmVudCBzaXRlLCB3ZSBjYWxsIFdlYlVybEZyb21QYWdlVXJsUmVzdWx0LlxyXG4gICAgICAgIHZhciBtc2cgPSBTUFNlcnZpY2VzLlNPQVBFbnZlbG9wZS5oZWFkZXIgK1xyXG4gICAgICAgICAgICBcIjxXZWJVcmxGcm9tUGFnZVVybCB4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvJyA+PHBhZ2VVcmw+XCIgK1xyXG4gICAgICAgICAgICAoKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIj9cIikgPiAwKSA/IGxvY2F0aW9uLmhyZWYuc3Vic3RyKDAsIGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcIj9cIikpIDogbG9jYXRpb24uaHJlZikgK1xyXG4gICAgICAgICAgICBcIjwvcGFnZVVybD48L1dlYlVybEZyb21QYWdlVXJsPlwiICtcclxuICAgICAgICAgICAgU1BTZXJ2aWNlcy5TT0FQRW52ZWxvcGUuZm9vdGVyO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSwgLy8gTmVlZCB0aGlzIHRvIGJlIHN5bmNocm9ub3VzIHNvIHdlJ3JlIGFzc3VyZWQgb2YgYSB2YWxpZCB2YWx1ZVxyXG4gICAgICAgICAgICB1cmw6IFwiL192dGlfYmluL1dlYnMuYXNteFwiLFxyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgZGF0YTogbXNnLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJ4bWxcIixcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwidGV4dC94bWw7Y2hhcnNldD1cXFwidXRmLThcXFwiXCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0LnRoaXNTaXRlID0gJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIldlYlVybEZyb21QYWdlVXJsUmVzdWx0XCIpLnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudENvbnRleHQudGhpc1NpdGU7IC8vIFJldHVybiB0aGUgVVJMXHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRTaXRlXHJcblxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzJyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgdXRpbHNcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gRnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGUgYWNjb3VudCBuYW1lIGZvciB0aGUgY3VycmVudCB1c2VyIGluIERPTUFJTlxcdXNlcm5hbWUgZm9ybWF0XHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BHZXRDdXJyZW50VXNlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFVSTCBvZiB0aGUgdGFyZ2V0IFNpdGUgQ29sbGVjdGlvbi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBmaWVsZE5hbWU6IFwiTmFtZVwiLCAvLyBTcGVjaWZpZXMgd2hpY2ggZmllbGQgdG8gcmV0dXJuIGZyb20gdGhlIHVzZXJkaXNwLmFzcHggcGFnZVxyXG4gICAgICAgICAgICBmaWVsZE5hbWVzOiB7fSwgLy8gU3BlY2lmaWVzIHdoaWNoIGZpZWxkcyB0byByZXR1cm4gZnJvbSB0aGUgdXNlcmRpc3AuYXNweCBwYWdlIC0gYWRkZWQgaW4gdjAuNy4yIHRvIGFsbG93IG11bHRpcGxlIGNvbHVtbnNcclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7IGlmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50Q29udGV4dCA9IHV0aWxzLlNQU2VydmljZXNDb250ZXh0KCk7XHJcblxyXG4gICAgICAgIC8vIFRoZSBjdXJyZW50IHVzZXIncyBJRCBpcyByZWxpYWJseSBhdmFpbGFibGUgaW4gYW4gZXhpc3RpbmcgSmF2YVNjcmlwdCB2YXJpYWJsZVxyXG4gICAgICAgIGlmIChvcHQuZmllbGROYW1lID09PSBcIklEXCIgJiYgdHlwZW9mIGN1cnJlbnRDb250ZXh0LnRoaXNVc2VySWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0LnRoaXNVc2VySWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdGhpc0ZpZWxkID0gXCJcIjtcclxuICAgICAgICB2YXIgdGhlc2VGaWVsZHMgPSB7fTtcclxuICAgICAgICB2YXIgZmllbGRDb3VudCA9IG9wdC5maWVsZE5hbWVzLmxlbmd0aCA+IDAgPyBvcHQuZmllbGROYW1lcy5sZW5ndGggOiAxO1xyXG4gICAgICAgIHZhciB0aGlzVXNlckRpc3A7XHJcbiAgICAgICAgdmFyIHRoaXNXZWIgPSBvcHQud2ViVVJMLmxlbmd0aCA+IDAgPyBvcHQud2ViVVJMIDogJCgpLlNQU2VydmljZXMuU1BHZXRDdXJyZW50U2l0ZSgpO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIFVzZXJEaXNwLmFzcHggcGFnZSB1c2luZyBBSkFYXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgLy8gTmVlZCB0aGlzIHRvIGJlIHN5bmNocm9ub3VzIHNvIHdlJ3JlIGFzc3VyZWQgb2YgYSB2YWxpZCB2YWx1ZVxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIC8vIEZvcmNlIHBhcmFtZXRlciBmb3JjZXMgcmVkaXJlY3Rpb24gdG8gYSBwYWdlIHRoYXQgZGlzcGxheXMgdGhlIGluZm9ybWF0aW9uIGFzIHN0b3JlZCBpbiB0aGUgVXNlckluZm8gdGFibGUgcmF0aGVyIHRoYW4gTXkgU2l0ZS5cclxuICAgICAgICAgICAgLy8gQWRkaW5nIHRoZSBleHRyYSBRdWVyeSBTdHJpbmcgcGFyYW1ldGVyIHdpdGggdGhlIGN1cnJlbnQgZGF0ZS90aW1lIGZvcmNlcyB0aGUgc2VydmVyIHRvIHZpZXcgdGhpcyBhcyBhIG5ldyByZXF1ZXN0LlxyXG4gICAgICAgICAgICB1cmw6ICgodGhpc1dlYiA9PT0gXCIvXCIpID8gXCJcIiA6IHRoaXNXZWIpICsgXCIvX2xheW91dHMvdXNlcmRpc3AuYXNweD9Gb3JjZT1UcnVlJlwiICsgbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNVc2VyRGlzcCA9IHhEYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmllbGRDb3VudDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBUaGUgY3VycmVudCB1c2VyJ3MgSUQgaXMgcmVsaWFibHkgYXZhaWxhYmxlIGluIGFuIGV4aXN0aW5nIEphdmFTY3JpcHQgdmFyaWFibGVcclxuICAgICAgICAgICAgaWYgKG9wdC5maWVsZE5hbWVzW2ldID09PSBcIklEXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNGaWVsZCA9IGN1cnJlbnRDb250ZXh0LnRoaXNVc2VySWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc1RleHRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmIChmaWVsZENvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNUZXh0VmFsdWUgPSBSZWdFeHAoXCJGaWVsZEludGVybmFsTmFtZT1cXFwiXCIgKyBvcHQuZmllbGROYW1lc1tpXSArIFwiXFxcIlwiLCBcImdpXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzVGV4dFZhbHVlID0gUmVnRXhwKFwiRmllbGRJbnRlcm5hbE5hbWU9XFxcIlwiICsgb3B0LmZpZWxkTmFtZSArIFwiXFxcIlwiLCBcImdpXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzVXNlckRpc3AucmVzcG9uc2VUZXh0KS5maW5kKFwidGFibGUubXMtZm9ybXRhYmxlIHRkW2lkXj0nU1BGaWVsZCddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzVGV4dFZhbHVlLnRlc3QoJCh0aGlzKS5odG1sKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVhY2ggZmllbGR0eXBlIGNvbnRhaW5zIGEgZGlmZmVyZW50IGRhdGEgdHlwZSwgYXMgaW5kaWNhdGVkIGJ5IHRoZSBpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKCQodGhpcykuYXR0cihcImlkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1BGaWVsZFRleHRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJTUEZpZWxkTm90ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNGaWVsZCA9ICQodGhpcykuZmluZChcImRpdlwiKS5odG1sKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1BGaWVsZFVSTFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNGaWVsZCA9ICQodGhpcykuZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVzdCBpbiBjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNGaWVsZCA9ICQodGhpcykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgbG9va2luZzsgd2UncmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9wdC5maWVsZE5hbWVzW2ldICE9PSBcIklEXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNGaWVsZCA9ICh0eXBlb2YgdGhpc0ZpZWxkICE9PSBcInVuZGVmaW5lZFwiKSA/IHRoaXNGaWVsZC5yZXBsYWNlKC8oXltcXHNcXHhBMF0rfFtcXHNcXHhBMF0rJCkvZywgJycpIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmllbGRDb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoZXNlRmllbGRzW29wdC5maWVsZE5hbWVzW2ldXSA9IHRoaXNGaWVsZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIChmaWVsZENvdW50ID4gMSkgPyB0aGVzZUZpZWxkcyA6IHRoaXNGaWVsZDtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFVzZXJcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJFxyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIERpc3BsYXlOYW1lIGZvciBhIGNvbHVtbiBiYXNlZCBvbiB0aGUgU3RhdGljTmFtZS5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldERpc3BsYXlGcm9tU3RhdGljID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHdlYlVSTDogXCJcIiwgLy8gVVJMIG9mIHRoZSB0YXJnZXQgV2ViLiAgSWYgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgV2ViIGlzIHVzZWQuXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBcIlwiLCAvLyBUaGUgbmFtZSBvciBHVUlEIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIGNvbHVtblN0YXRpY05hbWU6IFwiXCIsIC8vIFN0YXRpY05hbWUgb2YgdGhlIGNvbHVtblxyXG4gICAgICAgICAgICBjb2x1bW5TdGF0aWNOYW1lczoge30gLy8gU3RhdGljTmFtZSBvZiB0aGUgY29sdW1ucyAtIGFkZGVkIGluIHYwLjcuMiB0byBhbGxvdyBtdWx0aXBsZSBjb2x1bW5zXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBkaXNwbGF5TmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGRpc3BsYXlOYW1lcyA9IHt9O1xyXG4gICAgICAgIHZhciBuYW1lQ291bnQgPSBvcHQuY29sdW1uU3RhdGljTmFtZXMubGVuZ3RoID4gMCA/IG9wdC5jb2x1bW5TdGF0aWNOYW1lcy5sZW5ndGggOiAxO1xyXG5cclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0XCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuYW1lQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZXNbb3B0LmNvbHVtblN0YXRpY05hbWVzW2ldXSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZFtTdGF0aWNOYW1lPSdcIiArIG9wdC5jb2x1bW5TdGF0aWNOYW1lc1tpXSArIFwiJ11cIikuYXR0cihcIkRpc3BsYXlOYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWUgPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRbU3RhdGljTmFtZT0nXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZSArIFwiJ11cIikuYXR0cihcIkRpc3BsYXlOYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAobmFtZUNvdW50ID4gMSkgPyBkaXNwbGF5TmFtZXMgOiBkaXNwbGF5TmFtZTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQR2V0RGlzcGxheUZyb21TdGF0aWNcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHRvIHJldHVybiB0aGUgSUQgb2YgdGhlIGxhc3QgaXRlbSBjcmVhdGVkIG9uIGEgbGlzdCBieSBhIHNwZWNpZmljIHVzZXIuIFVzZWZ1bCBmb3IgbWFpbnRhaW5pbmcgcGFyZW50L2NoaWxkIHJlbGF0aW9uc2hpcHNcclxuICAgIC8vIGJldHdlZW4gbGlzdCBmb3Jtc1xyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQR2V0TGFzdEl0ZW1JZCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIG5hbWUgb3IgR1VJRCBvZiB0aGUgbGlzdFxyXG4gICAgICAgICAgICB1c2VyQWNjb3VudDogXCJcIiwgLy8gVGhlIGFjY291bnQgZm9yIHRoZSB1c2VyIGluIERPTUFJTlxcdXNlcm5hbWUgZm9ybWF0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgY3VycmVudCB1c2VyIGlzIHVzZWQuXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIiAvLyBbT3B0aW9uYWxdIEZvciBwb3dlciB1c2VycywgdGhpcyBDQU1MIGZyYWdtZW50IHdpbGwgYmUgQW5kZWQgd2l0aCB0aGUgZGVmYXVsdCBxdWVyeSBvbiB0aGUgcmVsYXRlZExpc3RcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJJZDtcclxuICAgICAgICB2YXIgbGFzdElkID0gMDtcclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRVc2VySW5mb1wiLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgdXNlckxvZ2luTmFtZTogKG9wdC51c2VyQWNjb3VudCAhPT0gXCJcIikgPyBvcHQudXNlckFjY291bnQgOiAkKCkuU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRVc2VyKCksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiVXNlclwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSAkKHRoaXMpLmF0dHIoXCJJRFwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgbGlzdCBpdGVtcyBmb3IgdGhlIHVzZXIsIHNvcnRlZCBieSBDcmVhdGVkLCBkZXNjZW5kaW5nLiBJZiB0aGUgQ0FNTFF1ZXJ5IG9wdGlvbiBoYXMgYmVlbiBzcGVjaWZpZWQsIEFuZCBpdCB3aXRoXHJcbiAgICAgICAgLy8gdGhlIGV4aXN0aW5nIFdoZXJlIGNsYXVzZVxyXG4gICAgICAgIHZhciBjYW1sUXVlcnkgPSBcIjxRdWVyeT48V2hlcmU+XCI7XHJcbiAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8QW5kPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYW1sUXVlcnkgKz0gXCI8RXE+PEZpZWxkUmVmIE5hbWU9J0F1dGhvcicgTG9va3VwSWQ9J1RSVUUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgKyB1c2VySWQgKyBcIjwvVmFsdWU+PC9FcT5cIjtcclxuICAgICAgICBpZiAob3B0LkNBTUxRdWVyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBvcHQuQ0FNTFF1ZXJ5ICsgXCI8L0FuZD5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPC9XaGVyZT48T3JkZXJCeT48RmllbGRSZWYgTmFtZT0nQ3JlYXRlZF94MDAyMF9EYXRlJyBBc2NlbmRpbmc9J0ZBTFNFJy8+PC9PcmRlckJ5PjwvUXVlcnk+XCI7XHJcblxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RJdGVtc1wiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBjYW1sUXVlcnksXHJcbiAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdJRCcvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAxLFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBcIjxRdWVyeU9wdGlvbnM+PFZpZXdBdHRyaWJ1dGVzIFNjb3BlPSdSZWN1cnNpdmUnIC8+PC9RdWVyeU9wdGlvbnM+XCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0SWQgPSAkKHRoaXMpLmF0dHIoXCJvd3NfSURcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBsYXN0SWQ7XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQR2V0TGFzdEl0ZW1JZFxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgY29uc3RhbnRzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFNQR2V0TGlzdEl0ZW1zSnNvbiByZXRyaWV2ZXMgaXRlbXMgZnJvbSBhIGxpc3QgaW4gSlNPTiBmb3JtYXRcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldExpc3RJdGVtc0pzb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIixcclxuICAgICAgICAgICAgdmlld05hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIixcclxuICAgICAgICAgICAgQ0FNTFZpZXdGaWVsZHM6IFwiXCIsXHJcbiAgICAgICAgICAgIENBTUxSb3dMaW1pdDogXCJcIixcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCJcIixcclxuICAgICAgICAgICAgY2hhbmdlVG9rZW46IFwiXCIsIC8vIFtPcHRpb25hbF0gSWYgcHJvdmlkZWQsIHdpbGwgYmUgcGFzc2VkIHdpdGggdGhlIHJlcXVlc3RcclxuICAgICAgICAgICAgY29udGFpbnM6IFwiXCIsIC8vIENBTUwgc25pcHBldCBmb3IgYW4gYWRkaXRpb25hbCBmaWx0ZXJcclxuICAgICAgICAgICAgbWFwcGluZzogbnVsbCwgLy8gSWYgcHJvdmlkZWQsIHVzZSB0aGlzIG1hcHBpbmcgcmF0aGVyIHRoYW4gY3JlYXRpbmcgb25lIGF1dG9tYWdpY2FsbHkgZnJvbSB0aGUgbGlzdCBzY2hlbWFcclxuICAgICAgICAgICAgbWFwcGluZ092ZXJyaWRlczogbnVsbCwgLy8gUGFzcyBpbiBzcGVjaWZpYyBjb2x1bW4gb3ZlcnJpZGVzIGhlcmVcclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7aWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCAkKCkuU1BTZXJ2aWNlcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBuZXdDaGFuZ2VUb2tlbjtcclxuICAgICAgICB2YXIgdGhpc0xpc3RKc29uTWFwcGluZyA9IHt9O1xyXG4gICAgICAgIHZhciBkZWxldGVkSWRzID0gW107XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9ICQuRGVmZXJyZWQoKTtcclxuXHJcbiAgICAgICAgLy8gQ2FsbCBHZXRMaXN0SXRlbXMgdG8gZmluZCBhbGwgb2YgdGhlIGl0ZW1zIG1hdGNoaW5nIHRoZSBDQU1MUXVlcnlcclxuICAgICAgICB2YXIgdGhpc0RhdGEgPSAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbUNoYW5nZXNTaW5jZVRva2VuXCIsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgdmlld05hbWU6IG9wdC52aWV3TmFtZSxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBvcHQuQ0FNTFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MVmlld0ZpZWxkczogb3B0LkNBTUxWaWV3RmllbGRzLFxyXG4gICAgICAgICAgICBDQU1MUm93TGltaXQ6IG9wdC5DQU1MUm93TGltaXQsXHJcbiAgICAgICAgICAgIENBTUxRdWVyeU9wdGlvbnM6IG9wdC5DQU1MUXVlcnlPcHRpb25zLFxyXG4gICAgICAgICAgICBjaGFuZ2VUb2tlbjogb3B0LmNoYW5nZVRva2VuLFxyXG4gICAgICAgICAgICBjb250YWluczogb3B0LmNvbnRhaW5zXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXNEYXRhLnRoZW4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIG1hcHBpbmdLZXkgPSBcIlNQR2V0TGlzdEl0ZW1zSnNvblwiICsgb3B0LndlYlVSTCArIG9wdC5saXN0TmFtZTtcclxuXHJcbiAgICAgICAgICAgIC8vIFdlJ3JlIGdvaW5nIHRvIHVzZSB0aGlzIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgICAgICAgIHZhciByZXNwb25zZVhtbCA9ICQodGhpc0RhdGEucmVzcG9uc2VYTUwpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBjaGFuZ2VUb2tlblxyXG4gICAgICAgICAgICBuZXdDaGFuZ2VUb2tlbiA9IHJlc3BvbnNlWG1sLmZpbmQoXCJDaGFuZ2VzXCIpLmF0dHIoXCJMYXN0Q2hhbmdlVG9rZW5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyBTb21lIG9mIHRoZSBleGlzdGluZyBpdGVtcyBtYXkgaGF2ZSBiZWVuIGRlbGV0ZWRcclxuICAgICAgICAgICAgcmVzcG9uc2VYbWwuZmluZChcImxpc3RpdGVtcyBDaGFuZ2VzIElkW0NoYW5nZVR5cGU9J0RlbGV0ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlZElkcy5wdXNoKCQodGhpcykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0Lm1hcHBpbmcgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIEF1dG9tYWdpY2FsbHkgY3JlYXRlIHRoZSBtYXBwaW5nXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZVhtbC5maW5kKFwiTGlzdCA+IEZpZWxkcyA+IEZpZWxkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGlzRmllbGQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVHlwZSA9IHRoaXNGaWVsZC5hdHRyKFwiVHlwZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHdvcmsgd2l0aCBrbm93biBjb2x1bW4gdHlwZXNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KHRoaXNUeXBlLCBjb25zdGFudHMuc3BMaXN0RmllbGRUeXBlcykgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzTGlzdEpzb25NYXBwaW5nW1wib3dzX1wiICsgdGhpc0ZpZWxkLmF0dHIoXCJOYW1lXCIpXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBlZE5hbWU6IHRoaXNGaWVsZC5hdHRyKFwiTmFtZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFR5cGU6IHRoaXNGaWVsZC5hdHRyKFwiVHlwZVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzTGlzdEpzb25NYXBwaW5nID0gb3B0Lm1hcHBpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEltcGxlbWVudCBhbnkgbWFwcGluZ092ZXJyaWRlc1xyXG4gICAgICAgICAgICAvLyBFeGFtcGxlOiB7IG93c19KU09OVGV4dENvbHVtbjogeyBtYXBwZWROYW1lOiBcIkpUQ1wiLCBvYmplY3RUeXBlOiBcIkpTT05cIiB9IH1cclxuICAgICAgICAgICAgaWYgKG9wdC5tYXBwaW5nT3ZlcnJpZGVzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGb3IgZWFjaCBtYXBwaW5nT3ZlcnJpZGUsIG92ZXJyaWRlIHRoZSBsaXN0IHNjaGVtYVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbWFwcGluZyBpbiBvcHQubWFwcGluZ092ZXJyaWRlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNMaXN0SnNvbk1hcHBpbmdbbWFwcGluZ10gPSBvcHQubWFwcGluZ092ZXJyaWRlc1ttYXBwaW5nXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgd2UgaGF2ZW4ndCByZXRyaWV2ZWQgdGhlIGxpc3Qgc2NoZW1hIGluIHRoaXMgY2FsbCwgdHJ5IHRvIGdyYWIgaXQgZnJvbSB0aGUgc2F2ZWQgZGF0YSBmcm9tIGEgcHJpb3IgY2FsbFxyXG4gICAgICAgICAgICBpZiAoJC5pc0VtcHR5T2JqZWN0KHRoaXNMaXN0SnNvbk1hcHBpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzTGlzdEpzb25NYXBwaW5nID0gJChkb2N1bWVudCkuZGF0YShtYXBwaW5nS2V5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLmRhdGEobWFwcGluZ0tleSwgdGhpc0xpc3RKc29uTWFwcGluZyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBqc29uRGF0YSA9IHJlc3BvbnNlWG1sLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLlNQWG1sVG9Kc29uKHtcclxuICAgICAgICAgICAgICAgIG1hcHBpbmc6IHRoaXNMaXN0SnNvbk1hcHBpbmcsXHJcbiAgICAgICAgICAgICAgICBzcGFyc2U6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpc1Jlc3VsdCA9IHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZVRva2VuOiBuZXdDaGFuZ2VUb2tlbixcclxuICAgICAgICAgICAgICAgIG1hcHBpbmc6IHRoaXNMaXN0SnNvbk1hcHBpbmcsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBqc29uRGF0YSxcclxuICAgICAgICAgICAgICAgIGRlbGV0ZWRJZHM6IGRlbGV0ZWRJZHNcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdC5yZXNvbHZlV2l0aCh0aGlzUmVzdWx0KTtcclxuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoZXJyKSB7IFxyXG4gICAgICAgICAgICByZXN1bHQucmVqZWN0V2l0aChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0LnByb21pc2UoKTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQR2V0TGlzdEl0ZW1zSnNvblxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7XHJcbiIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICRcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gR2V0IHRoZSBRdWVyeSBTdHJpbmcgcGFyYW1ldGVycyBhbmQgdGhlaXIgdmFsdWVzIGFuZCByZXR1cm4gaW4gYW4gYXJyYXlcclxuICAgIC8vIEluY2x1ZGVzIGNvZGUgZnJvbSBodHRwOi8vd3d3LmRldmVsb3BlcmRyaXZlLmNvbS8yMDEzLzA4L3R1cm5pbmctdGhlLXF1ZXJ5c3RyaW5nLWludG8tYS1qc29uLW9iamVjdC11c2luZy1qYXZhc2NyaXB0L1xyXG4gICAgLy8gU2ltcGxpZmllZCBpbiAyMDE0LjAxIHVzaW5nIHRoaXMgY29kZVxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQR2V0UXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbG93ZXJjYXNlOiBmYWxzZSAvLyBJZiB0cnVlLCBwYXJhbWV0ZXIgbmFtZXMgd2lsbCBiZSBjb252ZXJ0ZWQgdG8gbG93ZXJjYXNlXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBxdWVyeVN0cmluZ1ZhbHMgPSB7fTtcclxuXHJcbiAgICAgICAgdmFyIHFzID0gbG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpLnNwbGl0KCcmJyk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhcmFtID0gcXNbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgdmFyIHBhcmFtTmFtZSA9IG9wdC5sb3dlcmNhc2UgPyBwYXJhbVswXS50b0xvd2VyQ2FzZSgpIDogcGFyYW1bMF07XHJcbiAgICAgICAgICAgIHF1ZXJ5U3RyaW5nVmFsc1twYXJhbU5hbWVdID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtWzFdIHx8IFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nVmFscztcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQR2V0UXVlcnlTdHJpbmdcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJFxyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIFN0YXRpY05hbWUgZm9yIGEgY29sdW1uIGJhc2VkIG9uIHRoZSBEaXNwbGF5TmFtZS5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldFN0YXRpY0Zyb21EaXNwbGF5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHdlYlVSTDogXCJcIiwgLy8gVVJMIG9mIHRoZSB0YXJnZXQgV2ViLiAgSWYgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgV2ViIGlzIHVzZWQuXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBcIlwiLCAvLyBUaGUgbmFtZSBvciBHVUlEIG9mIHRoZSBsaXN0XHJcbiAgICAgICAgICAgIGNvbHVtbkRpc3BsYXlOYW1lOiBcIlwiLCAvLyBEaXNwbGF5TmFtZSBvZiB0aGUgY29sdW1uXHJcbiAgICAgICAgICAgIGNvbHVtbkRpc3BsYXlOYW1lczoge30gLy8gRGlzcGxheU5hbWVzIG9mIHRoZSBjb2x1bW5zIC0gYWRkZWQgaW4gdjAuNy4yIHRvIGFsbG93IG11bHRpcGxlIGNvbHVtbnNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRpY05hbWUgPSBcIlwiO1xyXG4gICAgICAgIHZhciBzdGF0aWNOYW1lcyA9IHt9O1xyXG4gICAgICAgIHZhciBuYW1lQ291bnQgPSBvcHQuY29sdW1uRGlzcGxheU5hbWVzLmxlbmd0aCA+IDAgPyBvcHQuY29sdW1uRGlzcGxheU5hbWVzLmxlbmd0aCA6IDE7XHJcblxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogb3B0Lmxpc3ROYW1lLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5hbWVDb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY05hbWVzW29wdC5jb2x1bW5EaXNwbGF5TmFtZXNbaV1dID0gJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkZpZWxkW0Rpc3BsYXlOYW1lPSdcIiArIG9wdC5jb2x1bW5EaXNwbGF5TmFtZXNbaV0gKyBcIiddXCIpLmF0dHIoXCJTdGF0aWNOYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGljTmFtZSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQuY29sdW1uRGlzcGxheU5hbWUgKyBcIiddXCIpLmF0dHIoXCJTdGF0aWNOYW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAobmFtZUNvdW50ID4gMSkgPyBzdGF0aWNOYW1lcyA6IHN0YXRpY05hbWU7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldFN0YXRpY0Zyb21EaXNwbGF5XHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiAvLyBbT3B0aW9uYWxdIFBhc3MgaW4gdGhlIG5hbWUgb3IgR1VJRCBvZiBhIGxpc3QgaWYgeW91IGFyZSBub3QgaW4gaXRzIGNvbnRleHQuIGUuZy4sIG9uIGEgV2ViIFBhcnQgcGFnZXMgaW4gdGhlIFBhZ2VzIGxpYnJhcnlcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGN1cnJlbnRDb250ZXh0ID0gdXRpbHMuU1BTZXJ2aWNlc0NvbnRleHQoKTtcclxuXHJcbiAgICAgICAgLy8gSGFzIHRoZSBsaXN0IG5hbWUgb3IgR1VJRCBiZWVuIHBhc3NlZCBpbj9cclxuICAgICAgICBpZiAob3B0Lmxpc3ROYW1lLmxlbmd0aCA+IDApIHtcclxuLy8gVE9ETyAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0KHsgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wdC5saXN0TmFtZTtcclxuICAgICAgICAgICAgLy8gRG8gd2UgYWxyZWFkeSBrbm93IHRoZSBjdXJyZW50IGxpc3Q/XHJcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50Q29udGV4dC50aGlzTGlzdCAhPT0gdW5kZWZpbmVkICYmIGN1cnJlbnRDb250ZXh0LnRoaXNMaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0LnRoaXNMaXN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGFyc2Ugb3V0IHRoZSBsaXN0J3Mgcm9vdCBVUkwgZnJvbSB0aGUgY3VycmVudCBsb2NhdGlvbiBvciB0aGUgcGFzc2VkIHVybFxyXG4gICAgICAgIHZhciB0aGlzUGFnZSA9IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgdmFyIHRoaXNQYWdlQmFzZU5hbWUgPSB0aGlzUGFnZS5zdWJzdHJpbmcoMCwgdGhpc1BhZ2UuaW5kZXhPZihcIi5hc3B4XCIpKTtcclxuICAgICAgICB2YXIgbGlzdFBhdGggPSBkZWNvZGVVUklDb21wb25lbnQodGhpc1BhZ2VCYXNlTmFtZS5zdWJzdHJpbmcoMCwgdGhpc1BhZ2VCYXNlTmFtZS5sYXN0SW5kZXhPZihjb25zdGFudHMuU0xBU0gpICsgMSkpLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIENhbGwgR2V0TGlzdENvbGxlY3Rpb24gYW5kIGxvb3AgdGhyb3VnaCB0aGUgcmVzdWx0cyB0byBmaW5kIGEgbWF0Y2ggd2l0aCB0aGUgbGlzdCdzIFVSTCB0byBnZXQgdGhlIGxpc3QncyBHVUlEXHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdENvbGxlY3Rpb25cIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkxpc3RcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRWaWV3VXJsID0gJCh0aGlzKS5hdHRyKFwiRGVmYXVsdFZpZXdVcmxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RDb2xsTGlzdCA9IGRlZmF1bHRWaWV3VXJsLnN1YnN0cmluZygwLCBkZWZhdWx0Vmlld1VybC5sYXN0SW5kZXhPZihjb25zdGFudHMuU0xBU0gpICsgMSkudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdFBhdGguaW5kZXhPZihsaXN0Q29sbExpc3QpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Q29udGV4dC50aGlzTGlzdCA9ICQodGhpcykuYXR0cihcIklEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIHRoZSBsaXN0IEdVSUQgKElEKVxyXG4gICAgICAgIHJldHVybiBjdXJyZW50Q29udGV4dC50aGlzTGlzdDtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscydcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gY29udmVydHMgYW4gWE1MIG5vZGUgc2V0IHRvIEpTT05cclxuICAgIC8vIEluaXRpYWwgaW1wbGVtZW50YXRpb24gZm9jdXNlcyBvbmx5IG9uIEdldExpc3RJdGVtc1xyXG4gICAgJC5mbi5TUFhtbFRvSnNvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBtYXBwaW5nOiB7fSwgLy8gY29sdW1uTmFtZTogbWFwcGVkTmFtZTogXCJtYXBwZWROYW1lXCIsIG9iamVjdFR5cGU6IFwib2JqZWN0VHlwZVwiXHJcbiAgICAgICAgICAgIGluY2x1ZGVBbGxBdHRyczogZmFsc2UsIC8vIElmIHRydWUsIHJldHVybiBhbGwgYXR0cmlidXRlcywgcmVnYXJkbGVzcyB3aGV0aGVyIHRoZXkgYXJlIGluIHRoZSBtYXBwaW5nXHJcbiAgICAgICAgICAgIHJlbW92ZU93czogdHJ1ZSwgLy8gU3BlY2lmaWNhbGx5IGZvciBHZXRMaXN0SXRlbXMsIGlmIHRydWUsIHRoZSBsZWFkaW5nIG93c18gd2lsbCBiZSBzdHJpcHBlZCBvZmYgdGhlIGZpZWxkIG5hbWVcclxuICAgICAgICAgICAgc3BhcnNlOiBmYWxzZSAvLyBJZiB0cnVlLCBlbXB0eSAoXCJcIikgdmFsdWVzIHdpbGwgbm90IGJlIHJldHVybmVkXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBhdHRyTnVtO1xyXG4gICAgICAgIHZhciBqc29uT2JqZWN0ID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHJvd0F0dHJzID0gdGhpcy5hdHRyaWJ1dGVzO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvcHQuc3BhcnNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCcmluZyBiYWNrIGFsbCBtYXBwZWQgY29sdW1ucywgZXZlbiB0aG9zZSB3aXRoIG5vIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAkLmVhY2gob3B0Lm1hcHBpbmcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByb3dbdGhpcy5tYXBwZWROYW1lXSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgdGhyb3VnaCB0aGUgZWxlbWVudCdzIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgZm9yIChhdHRyTnVtID0gMDsgYXR0ck51bSA8IHJvd0F0dHJzLmxlbmd0aDsgYXR0ck51bSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc0F0dHJOYW1lID0gcm93QXR0cnNbYXR0ck51bV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzTWFwcGluZyA9IG9wdC5tYXBwaW5nW3RoaXNBdHRyTmFtZV07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc09iamVjdE5hbWUgPSB0aGlzTWFwcGluZyAmJiB0aGlzTWFwcGluZy5tYXBwZWROYW1lID8gdGhpc01hcHBpbmcubWFwcGVkTmFtZSA6IG9wdC5yZW1vdmVPd3MgPyB0aGlzQXR0ck5hbWUuc3BsaXQoXCJvd3NfXCIpWzFdIDogdGhpc0F0dHJOYW1lO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNPYmplY3RUeXBlID0gdGhpc01hcHBpbmcgIT09IHVuZGVmaW5lZCA/IHRoaXNNYXBwaW5nLm9iamVjdFR5cGUgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LmluY2x1ZGVBbGxBdHRycyB8fCB0aGlzTWFwcGluZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93W3RoaXNPYmplY3ROYW1lXSA9IGF0dHJUb0pzb24ocm93QXR0cnNbYXR0ck51bV0udmFsdWUsIHRoaXNPYmplY3RUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQdXNoIHRoaXMgaXRlbSBpbnRvIHRoZSBKU09OIE9iamVjdFxyXG4gICAgICAgICAgICBqc29uT2JqZWN0LnB1c2gocm93KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJldHVybiB0aGUgSlNPTiBvYmplY3RcclxuICAgICAgICByZXR1cm4ganNvbk9iamVjdDtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQWG1sVG9Kc29uXHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGF0dHJUb0pzb24odiwgb2JqZWN0VHlwZSkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGlkZW50aXR5KHgpIHsgcmV0dXJuIHg7IH1cclxuXHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcclxuXHJcbiAgICAgICAgICAgIC8qIEdlbmVyaWMgW1JldXNhYmxlXSBGdW5jdGlvbnMgKi9cclxuICAgICAgICAgICAgXCJJbnRlZ2VyXCI6IGludFRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJOdW1iZXJcIjogZmxvYXRUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiQm9vbGVhblwiOiBib29sZWFuVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIkRhdGVUaW1lXCI6IGRhdGVUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiVXNlclwiOiB1c2VyVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIlVzZXJNdWx0aVwiOiB1c2VyTXVsdGlUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiTG9va3VwXCI6IGxvb2t1cFRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJsb29rdXBNdWx0aVwiOiBsb29rdXBNdWx0aVRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJNdWx0aUNob2ljZVwiOiBjaG9pY2VNdWx0aVRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJDYWxjdWxhdGVkXCI6IGNhbGNUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiQXR0YWNobWVudHNcIjogYXR0YWNobWVudHNUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiVVJMXCI6IHVybFRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJKU09OXCI6IGpzb25Ub0pzb25PYmplY3QsIC8vIFNwZWNpYWwgY2FzZSBmb3IgdGV4dCBKU09OIHN0b3JlZCBpbiB0ZXh0IGNvbHVtbnNcclxuXHJcbiAgICAgICAgICAgIC8qIFRoZXNlIG9iamVjdFR5cGVzIHJldXNlIGFib3ZlIGZ1bmN0aW9ucyAqL1xyXG4gICAgICAgICAgICBcIlRleHRcIjogcmVzdWx0LkRlZmF1bHQsXHJcbiAgICAgICAgICAgIFwiQ291bnRlclwiOiByZXN1bHQuSW50ZWdlcixcclxuICAgICAgICAgICAgXCJkYXRldGltZVwiOiByZXN1bHQuRGF0ZVRpbWUsICAgIC8vIEZvciBjYWxjdWxhdGVkIGNvbHVtbnMsIHN0b3JlZCBhcyBkYXRldGltZTsjdmFsdWVcclxuICAgICAgICAgICAgXCJBbGxEYXlFdmVudFwiOiByZXN1bHQuQm9vbGVhbixcclxuICAgICAgICAgICAgXCJSZWN1cnJlbmNlXCI6IHJlc3VsdC5Cb29sZWFuLFxyXG4gICAgICAgICAgICBcIkN1cnJlbmN5XCI6IHJlc3VsdC5OdW1iZXIsXHJcbiAgICAgICAgICAgIFwiZmxvYXRcIjogcmVzdWx0Lk51bWJlciwgLy8gRm9yIGNhbGN1bGF0ZWQgY29sdW1ucywgc3RvcmVkIGFzIGZsb2F0OyN2YWx1ZVxyXG4gICAgICAgICAgICBcIlJlbGF0ZWRJdGVtc1wiOiByZXN1bHQuSlNPTixcclxuXHJcbiAgICAgICAgICAgIFwiRGVmYXVsdFwiOiBpZGVudGl0eVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAocmVzdWx0W29iamVjdFR5cGVdIHx8IGlkZW50aXR5KSh2KTtcclxuXHJcbi8qXHJcbiAgICAgICAgc3dpdGNoIChvYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiVGV4dFwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSB2O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEYXRlVGltZVwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiZGF0ZXRpbWVcIjogLy8gRm9yIGNhbGN1bGF0ZWQgY29sdW1ucywgc3RvcmVkIGFzIGRhdGV0aW1lOyN2YWx1ZVxyXG4gICAgICAgICAgICAgICAgLy8gRGF0ZXMgaGF2ZSBkYXNoZXMgaW5zdGVhZCBvZiBzbGFzaGVzOiBvd3NfQ3JlYXRlZD1cIjIwMDktMDgtMjUgMTQ6MjQ6NDhcIlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBkYXRlVG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVc2VyXCI6XHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IHVzZXJUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVzZXJNdWx0aVwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSB1c2VyTXVsdGlUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvb2t1cFwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBsb29rdXBUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJMb29rdXBNdWx0aVwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBsb29rdXBNdWx0aVRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQm9vbGVhblwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiQWxsRGF5RXZlbnRcIjpcclxuICAgICAgICAgICAgY2FzZSBcIlJlY3VycmVuY2VcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gYm9vbGVhblRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBcIkludGVnZXJcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gaW50VG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiQ291bnRlclwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBpbnRUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJNdWx0aUNob2ljZVwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBjaG9pY2VNdWx0aVRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiTnVtYmVyXCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJDdXJyZW5jeVwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiZmxvYXRcIjogLy8gRm9yIGNhbGN1bGF0ZWQgY29sdW1ucywgc3RvcmVkIGFzIGZsb2F0OyN2YWx1ZVxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBmbG9hdFRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ2FsY3VsYXRlZFwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBjYWxjVG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBdHRhY2htZW50c1wiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBhdHRhY2htZW50c1RvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVVJMXCI6XHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IHVybFRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiSlNPTlwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiUmVsYXRlZEl0ZW1zXCI6XHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IGpzb25Ub0pzb25PYmplY3Qodik7IC8vIFNwZWNpYWwgY2FzZSBmb3IgdGV4dCBKU09OIHN0b3JlZCBpbiB0ZXh0IGNvbHVtbnNcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIEFsbCBvdGhlciBvYmplY3RUeXBlcyB3aWxsIGJlIHNpbXBsZSBzdHJpbmdzXHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IHY7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbFZhbHVlO1xyXG4gKi9cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpbnRUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChzLCAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZmxvYXRUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJvb2xlYW5Ub0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIHJldHVybiBzICE9PSBcIjBcIjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkYXRlVG9Kc29uT2JqZWN0KHMpIHtcclxuXHJcbiAgICAgICAgdmFyIGR0ID0gcy5zcGxpdChcIlRcIilbMF0gIT09IHMgPyBzLnNwbGl0KFwiVFwiKSA6IHMuc3BsaXQoXCIgXCIpO1xyXG4gICAgICAgIHZhciBkID0gZHRbMF0uc3BsaXQoXCItXCIpO1xyXG4gICAgICAgIHZhciB0ID0gZHRbMV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgIHZhciB0MyA9IHRbMl0uc3BsaXQoXCJaXCIpO1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkWzBdLCAoZFsxXSAtIDEpLCBkWzJdLCB0WzBdLCB0WzFdLCB0M1swXSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXNlclRvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzVXNlciA9IG5ldyB1dGlscy5TcGxpdEluZGV4KHMpO1xyXG4gICAgICAgICAgICB2YXIgdGhpc1VzZXJFeHBhbmRlZCA9IHRoaXNVc2VyLnZhbHVlLnNwbGl0KFwiLCNcIik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzVXNlckV4cGFuZGVkLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXNVc2VyLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJOYW1lOiB0aGlzVXNlci52YWx1ZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzVXNlci5pZCxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZTogdGhpc1VzZXJFeHBhbmRlZFswXS5yZXBsYWNlKC8oLCwpL2csIFwiLFwiKSxcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbk5hbWU6IHRoaXNVc2VyRXhwYW5kZWRbMV0ucmVwbGFjZSgvKCwsKS9nLCBcIixcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IHRoaXNVc2VyRXhwYW5kZWRbMl0ucmVwbGFjZSgvKCwsKS9nLCBcIixcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgc2lwQWRkcmVzczogdGhpc1VzZXJFeHBhbmRlZFszXS5yZXBsYWNlKC8oLCwpL2csIFwiLFwiKSxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGhpc1VzZXJFeHBhbmRlZFs0XS5yZXBsYWNlKC8oLCwpL2csIFwiLFwiKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1c2VyTXVsdGlUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1VzZXJNdWx0aU9iamVjdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgdGhpc1VzZXJNdWx0aSA9IHMuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNVc2VyTXVsdGkubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzVXNlciA9IHVzZXJUb0pzb25PYmplY3QodGhpc1VzZXJNdWx0aVtpXSArIGNvbnN0YW50cy5zcERlbGltICsgdGhpc1VzZXJNdWx0aVtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgdGhpc1VzZXJNdWx0aU9iamVjdC5wdXNoKHRoaXNVc2VyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1VzZXJNdWx0aU9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9va3VwVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNMb29rdXAgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxvb2t1cElkOiB0aGlzTG9va3VwWzBdLFxyXG4gICAgICAgICAgICAgICAgbG9va3VwVmFsdWU6IHRoaXNMb29rdXBbMV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9va3VwTXVsdGlUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0xvb2t1cE11bHRpT2JqZWN0ID0gW107XHJcbiAgICAgICAgICAgIHZhciB0aGlzTG9va3VwTXVsdGkgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzTG9va3VwTXVsdGkubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzTG9va3VwID0gbG9va3VwVG9Kc29uT2JqZWN0KHRoaXNMb29rdXBNdWx0aVtpXSArIGNvbnN0YW50cy5zcERlbGltICsgdGhpc0xvb2t1cE11bHRpW2kgKyAxXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzTG9va3VwTXVsdGlPYmplY3QucHVzaCh0aGlzTG9va3VwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc0xvb2t1cE11bHRpT2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjaG9pY2VNdWx0aVRvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ2hvaWNlTXVsdGlPYmplY3QgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHRoaXNDaG9pY2VNdWx0aSA9IHMuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNDaG9pY2VNdWx0aS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNDaG9pY2VNdWx0aVtpXS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzQ2hvaWNlTXVsdGlPYmplY3QucHVzaCh0aGlzQ2hvaWNlTXVsdGlbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzQ2hvaWNlTXVsdGlPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGF0dGFjaG1lbnRzVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzID09PSBcIjBcIiB8fCBzID09PSBcIjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc09iamVjdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgdGhpc1N0cmluZyA9IHMuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNTdHJpbmcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzU3RyaW5nW2ldLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWxlTmFtZSA9IHRoaXNTdHJpbmdbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNTdHJpbmdbaV0ubGFzdEluZGV4T2YoXCIvXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gdGhpc1N0cmluZ1tpXS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc09iamVjdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudDogdGhpc1N0cmluZ1tpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVybFRvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzVXJsID0gcy5zcGxpdChcIiwgXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgVXJsOiB0aGlzVXJsWzBdLFxyXG4gICAgICAgICAgICAgICAgRGVzY3JpcHRpb246IHRoaXNVcmxbMV1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsY1RvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ2FsYyA9IHMuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICAvLyBUaGUgZmlyc3QgdmFsdWUgd2lsbCBiZSB0aGUgY2FsY3VsYXRlZCBjb2x1bW4gdmFsdWUgdHlwZSwgdGhlIHNlY29uZCB3aWxsIGJlIHRoZSB2YWx1ZVxyXG4gICAgICAgICAgICByZXR1cm4gYXR0clRvSnNvbih0aGlzQ2FsY1sxXSwgdGhpc0NhbGNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBqc29uVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICQucGFyc2VKU09OKHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFJlYXJyYW5nZSByYWRpbyBidXR0b25zIG9yIGNoZWNrYm94ZXMgaW4gYSBmb3JtIGZyb20gdmVydGljYWwgdG8gaG9yaXpvbnRhbCBkaXNwbGF5IHRvIHNhdmUgcGFnZSByZWFsIGVzdGF0ZVxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQQXJyYW5nZUNob2ljZXMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IG5hbWUgZm9yIHRoZSBjdXJyZW50IGZvcm1cclxuICAgICAgICAgICAgY29sdW1uTmFtZTogXCJcIiwgLy8gVGhlIGRpc3BsYXkgbmFtZSBvZiB0aGUgY29sdW1uIGluIHRoZSBmb3JtXHJcbiAgICAgICAgICAgIHBlclJvdzogOTksIC8vIE1heGltdW0gbnVtYmVyIG9mIGNob2ljZXMgZGVzaXJlZCBwZXIgcm93LlxyXG4gICAgICAgICAgICByYW5kb21pemU6IGZhbHNlIC8vIElmIHRydWUsIHJhbmRvbWl6ZSB0aGUgb3JkZXIgb2YgdGhlIG9wdGlvbnNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbHVtbkZpbGxJbkNob2ljZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBjb2x1bW5PcHRpb25zID0gW107XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCBjb2x1bW5OYW1lIGZyb20gdGhlIGxpc3QgdG8gZGV0ZXJtaW5lIGlmIHdlJ3JlIGFsbG93aW5nIGZpbGwtaW4gY2hvaWNlc1xyXG4gICAgICAgIHZhciB0aGlzR2V0TGlzdCA9ICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB3aGVuIHRoZSBwcm9taXNlIGlzIGF2YWlsYWJsZS4uLlxyXG4gICAgICAgIHRoaXNHZXRMaXN0LmRvbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXNHZXRMaXN0LnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRbRGlzcGxheU5hbWU9J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgY29sdW1uTmFtZSBhbGxvd3MgYSBmaWxsLWluIGNob2ljZVxyXG4gICAgICAgICAgICAgICAgY29sdW1uRmlsbEluQ2hvaWNlID0gKCQodGhpcykuYXR0cihcIkZpbGxJbkNob2ljZVwiKSA9PT0gXCJUUlVFXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcCBsb29raW5nO3dlJ3JlIGRvbmVcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpc0Zvcm1GaWVsZCA9IHV0aWxzLmZpbmRGb3JtRmllbGQob3B0LmNvbHVtbk5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdG90YWxDaG9pY2VzID0gJCh0aGlzRm9ybUZpZWxkKS5maW5kKFwidHJcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgZmlsbGluUHJvbXB0O1xyXG4gICAgICAgICAgICB2YXIgZmlsbGluSW5wdXQ7XHJcblxyXG4gICAgICAgICAgICAvLyBDb2xsZWN0IGFsbCBvZiB0aGUgY2hvaWNlc1xyXG4gICAgICAgICAgICAkKHRoaXNGb3JtRmllbGQpLmZpbmQoXCJ0clwiKS5lYWNoKGZ1bmN0aW9uIChjaG9pY2VOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpbGwtaW4gcHJvbXB0LCBzYXZlIGl0Li4uXHJcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uRmlsbEluQ2hvaWNlICYmIGNob2ljZU51bWJlciA9PT0gKHRvdGFsQ2hvaWNlcyAtIDIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbGluUHJvbXB0ID0gJCh0aGlzKS5maW5kKFwidGRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLi4ub3IgaWYgaXQgaXMgdGhlIGZpbGwtaW4gaW5wdXQgYm94LCBzYXZlIGl0Li4uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbkZpbGxJbkNob2ljZSAmJiBjaG9pY2VOdW1iZXIgPT09ICh0b3RhbENob2ljZXMgLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxpbklucHV0ID0gJCh0aGlzKS5maW5kKFwidGRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLi4uZWxzZSBwdXNoIGludG8gdGhlIGNvbHVtbk9wdGlvbnMgYXJyYXkuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk9wdGlvbnMucHVzaCgkKHRoaXMpLmZpbmQoXCJ0ZFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmFuZG9taXplIGlzIHRydWUsIHJhbmRvbWx5IHNvcnQgdGhlIG9wdGlvbnNcclxuICAgICAgICAgICAgaWYgKG9wdC5yYW5kb21pemUpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbk9wdGlvbnMuc29ydCh1dGlscy5yYW5kT3JkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2hvaWNlcyB0YWJsZSB0byBob2xkIHRoZSBhcnJhbmdlZCBjaG9pY2VzLlxyXG4gICAgICAgICAgICB2YXIgbmV3Q2hvaWNlVGFibGUgPSAkKFwiPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAvL0l0ZXJhdGUgb3ZlciBhbGwgYXZhaWxhYmxlIGNob2ljZXMgcGxhY2luZyB0aGVtIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBuZXcgY2hvaWNlcyB0YWJsZS5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5PcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBwZXJSb3cgY29sdW1uT3B0aW9ucyBpbiB0aGUgcm93LCBjbG9zZSBvZmYgdGhlIHJvd1xyXG4gICAgICAgICAgICAgICAgaWYgKChpICsgMSkgJSBvcHQucGVyUm93ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hvaWNlVGFibGUuYXBwZW5kKFwiPHRyPjwvdHI+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3Q2hvaWNlVGFibGUuYXBwZW5kKGNvbHVtbk9wdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0luc2VydCBmaWxsSW5DaG9pY2VzIHNlY3Rpb24gdW5kZXIgYXZhaWxhYmxlIGNob2ljZXMuXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5GaWxsSW5DaG9pY2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxsSW5Sb3cgPSAkKFwiPHRyPjx0ZCBjb2xzcGFuPSc5OSc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMSc+PHRyPjwvdHI+PC90YWJsZT48L3RkPjwvdHI+XCIpO1xyXG4gICAgICAgICAgICAgICAgZmlsbEluUm93LmZpbmQoXCJ0clwiKS5hcHBlbmQoZmlsbGluUHJvbXB0KTtcclxuICAgICAgICAgICAgICAgIGZpbGxJblJvdy5maW5kKFwidHJcIikuYXBwZW5kKGZpbGxpbklucHV0KTtcclxuICAgICAgICAgICAgICAgIG5ld0Nob2ljZVRhYmxlLmFwcGVuZChmaWxsSW5Sb3cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0luc2VydCBuZXcgdGFibGUgYmVmb3JlIHRoZSBvbGQgY2hvaWNlIHRhYmxlIHNvIHRoYXQgY2hvaWNlcyB3aWxsIHN0aWxsIGxpbmUgdXAgd2l0aCBoZWFkZXIuXHJcbiAgICAgICAgICAgIHZhciBjaG9pY2VUYWJsZSA9ICQodGhpc0Zvcm1GaWVsZCkuZmluZChcInRhYmxlOmZpcnN0XCIpO1xyXG4gICAgICAgICAgICBjaG9pY2VUYWJsZS5iZWZvcmUobmV3Q2hvaWNlVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgLy9DaG9pY2VzIHRhYmxlIGlzIG5vdCByZW1vdmVkIGJlY2F1c2UgdmFsaWRhdGlvbiBkZXBlbmRzIG9uIHRoZSB0YWJsZSBpZC5cclxuICAgICAgICAgICAgY2hvaWNlVGFibGUuaGlkZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQQXJyYW5nZUNob2ljZXNcclxuXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBQcm92aWRlIHN1Z2dlc3RlZCB2YWx1ZXMgZnJvbSBhIGxpc3QgZm9yIGluIGlucHV0IGNvbHVtbiBiYXNlZCBvbiBjaGFyYWN0ZXJzIHR5cGVkXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BBdXRvY29tcGxldGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBXZWIgKHNpdGUpIHdoaWNoIGNvbnRhaW5zIHRoZSBzb3VyY2VMaXN0XHJcbiAgICAgICAgICAgIHNvdXJjZUxpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSB2YWx1ZXNcclxuICAgICAgICAgICAgc291cmNlQ29sdW1uOiBcIlwiLCAvLyBUaGUgc3RhdGljIG5hbWUgb2YgdGhlIGNvbHVtbiB3aGljaCBjb250YWlucyB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSwgLy8gVGhlIGxpc3QgdGhlIGZvcm0gaXMgd29ya2luZyB3aXRoLiBUaGlzIGlzIHVzZWZ1bCBpZiB0aGUgZm9ybSBpcyBub3QgaW4gdGhlIGxpc3QgY29udGV4dC5cclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBcIlwiLCAvLyBbT3B0aW9uYWxdIEZvciBwb3dlciB1c2VycywgdGhpcyBDQU1MIGZyYWdtZW50IHdpbGwgYmUgQW5kZWQgd2l0aCB0aGUgZGVmYXVsdCBxdWVyeSBvbiB0aGUgcmVsYXRlZExpc3RcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjwvUXVlcnlPcHRpb25zPlwiLCAvLyBbT3B0aW9uYWxdIEZvciBwb3dlciB1c2VycywgYWxsb3dzIHNwZWNpZnlpbmcgdGhlIENBTUxRdWVyeU9wdGlvbnMgZm9yIHRoZSBHZXRMaXN0SXRlbXMgY2FsbFxyXG4gICAgICAgICAgICBDQU1MUm93TGltaXQ6IDAsIC8vIFtPcHRpb25hbF0gT3ZlcnJpZGUgdGhlIGRlZmF1bHQgdmlldyByb3dsaW1pdCBhbmQgZ2V0IGFsbCBhcHByb3ByaWF0ZSByb3dzXHJcbiAgICAgICAgICAgIGZpbHRlclR5cGU6IFwiQmVnaW5zV2l0aFwiLCAvLyBUeXBlIG9mIGZpbHRlcmluZzogW0JlZ2luc1dpdGgsIENvbnRhaW5zXVxyXG4gICAgICAgICAgICBudW1DaGFyczogMCwgLy8gV2FpdCB1bnRpbCB0aGlzIG51bWJlciBvZiBjaGFyYWN0ZXJzIGhhcyBiZWVuIHR5cGVkIGJlZm9yZSBhdHRlbXB0aW5nIGFueSBhY3Rpb25zXHJcbiAgICAgICAgICAgIGlnbm9yZUNhc2U6IGZhbHNlLCAvLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZ1bmN0aW9uIGlnbm9yZXMgY2FzZSwgaWYgZmFsc2UgaXQgbG9va3MgZm9yIGFuIGV4YWN0IG1hdGNoXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodENsYXNzOiBcIlwiLCAvLyBJZiBhIGNsYXNzIGlzIHN1cHBsaWVkLCBoaWdobGlnaHQgdGhlIG1hdGNoZWQgY2hhcmFjdGVycyBpbiB0aGUgdmFsdWVzIGJ5IGFwcGx5aW5nIHRoYXQgY2xhc3MgdG8gYSB3cmFwcGluZyBzcGFuXHJcbiAgICAgICAgICAgIHVuaXF1ZVZhbHM6IGZhbHNlLCAvLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZ1bmN0aW9uIG9ubHkgYWRkcyB1bmlxdWUgdmFsdWVzIHRvIHRoZSBsaXN0IChubyBkdXBsaWNhdGVzKVxyXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDk5OTk5LCAvLyBTZXRzIHRoZSBtYXhpbXVtIG51bWJlciBvZiB2YWx1ZXMgdG8gZGlzcGxheSBiZWZvcmUgc2Nyb2xsaW5nIG9jY3Vyc1xyXG4gICAgICAgICAgICBzbGlkZURvd25TcGVlZDogXCJmYXN0XCIsIC8vIFNwZWVkIGF0IHdoaWNoIHRoZSBkaXYgc2hvdWxkIHNsaWRlIGRvd24gd2hlbiB2YWx1ZXMgbWF0Y2ggKG1pbGxpc2Vjb25kcyBvciBbXCJmYXN0XCIgfCBcInNsb3dcIl0pXHJcbiAgICAgICAgICAgIHByb2Nlc3NpbmdJbmRpY2F0b3I6IFwiX2xheW91dHMvaW1hZ2VzL1JFRlJFU0guR0lGXCIsIC8vIElmIHByZXNlbnQsIHNob3cgdGhpcyB3aGlsZSBwcm9jZXNzaW5nXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzO2lmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBtYXRjaE51bTtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgaW5wdXQgY29udHJvbCBmb3IgdGhlIGNvbHVtbiBhbmQgc2F2ZSBzb21lIG9mIGl0cyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIGNvbHVtbk9iaiA9IHV0aWxzLmZpbmRGb3JtRmllbGQob3B0LmNvbHVtbk5hbWUpLmZpbmQoXCJpbnB1dFtUaXRsZV49J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIGNvbHVtbk9iai5jc3MoXCJwb3NpdGlvblwiLCBcIlwiKTtcclxuICAgICAgICB2YXIgY29sdW1uT2JqQ29sb3IgPSBjb2x1bW5PYmouY3NzKFwiY29sb3JcIik7XHJcbiAgICAgICAgdmFyIGNvbHVtbk9ialdpZHRoID0gY29sdW1uT2JqLmNzcyhcIndpZHRoXCIpO1xyXG5cclxuICAgICAgICBpZiAoY29sdW1uT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KFwiU1BTZXJ2aWNlcy5TUEF1dG9jb21wbGV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5jb2x1bW5OYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJDb2x1bW4gaXMgbm90IGFuIGlucHV0IGNvbnRyb2wgb3IgaXMgbm90IGZvdW5kIG9uIHBhZ2VcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgPGJyLz4gd2hpY2ggaXNuJ3QgbmVlZGVkIGFuZCBtZXNzZXMgdXAgdGhlIGZvcm1hdHRpbmdcclxuICAgICAgICBjb2x1bW5PYmouY2xvc2VzdChcInNwYW5cIikuZmluZChcImJyXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGNvbHVtbk9iai53cmFwKFwiPGRpdj5cIik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIGRpdiB0byBjb250YWluIHRoZSBtYXRjaGluZyB2YWx1ZXMgYW5kIGFkZCBpdCB0byB0aGUgRE9NXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gdXRpbHMuZ2VuQ29udGFpbmVySWQoXCJTUEF1dG9jb21wbGV0ZVwiLCBvcHQuY29sdW1uTmFtZSwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICBjb2x1bW5PYmouYWZ0ZXIoXCI8ZGl2Pjx1bCBpZD0nXCIgKyBjb250YWluZXJJZCArIFwiJyBzdHlsZT0nd2lkdGg6XCIgKyBjb2x1bW5PYmpXaWR0aCArIFwiO2Rpc3BsYXk6bm9uZTtwYWRkaW5nOjJweDtib3JkZXI6MXB4IHNvbGlkICMyQTFGQUE7YmFja2dyb3VuZC1jb2xvcjojRkZGO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6NDA7bWFyZ2luOjAnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSB3aWR0aCB0byBtYXRjaCB0aGUgd2lkdGggb2YgdGhlIGlucHV0IGNvbnRyb2xcclxuICAgICAgICB2YXIgY29udGFpbmVyT2JqID0gJChcIiNcIiArIGNvbnRhaW5lcklkKTtcclxuICAgICAgICBjb250YWluZXJPYmouY3NzKFwid2lkdGhcIiwgY29sdW1uT2JqV2lkdGgpO1xyXG5cclxuICAgICAgICAvLyBIYW5kbGUga2V5cHJlc3Nlc1xyXG4gICAgICAgICQoY29sdW1uT2JqKS5rZXl1cChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGNvbHVtbidzIHZhbHVlXHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5WYWx1ZSA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBjb250YWluZXIgd2hpbGUgd2UncmUgd29ya2luZyBvbiBpdFxyXG4gICAgICAgICAgICBjb250YWluZXJPYmouaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gSGF2ZSBlbm91Z2ggY2hhcmFjdGVycyBiZWVuIHR5cGVkIHlldD9cclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlLmxlbmd0aCA8IG9wdC5udW1DaGFycykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IHRoZSB0aGUgcHJvY2Vzc2luZ0luZGljYXRvciBhcyBhIGJhY2tncm91bmQgaW1hZ2UgaW4gdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgY29sdW1uT2JqLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoXCIgKyBvcHQucHJvY2Vzc2luZ0luZGljYXRvciArIFwiKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCI6IFwicmlnaHRcIixcclxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1yZXBlYXRcIjogXCJuby1yZXBlYXRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFycmF5IHRvIGhvbGQgdGhlIG1hdGNoZWQgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciBtYXRjaEFycmF5ID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBCdWlsZCB0aGUgYXBwcm9wcmlhdGUgQ0FNTFF1ZXJ5XHJcbiAgICAgICAgICAgIHZhciBjYW1sUXVlcnkgPSBcIjxRdWVyeT48T3JkZXJCeT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQuc291cmNlQ29sdW1uICsgXCInLz48L09yZGVyQnk+PFdoZXJlPlwiO1xyXG4gICAgICAgICAgICBpZiAob3B0LkNBTUxRdWVyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8QW5kPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxcIiArIG9wdC5maWx0ZXJUeXBlICsgXCI+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnNvdXJjZUNvbHVtbiArIFwiJy8+PFZhbHVlIFR5cGU9J1RleHQnPlwiICsgY29sdW1uVmFsdWUgKyBcIjwvVmFsdWU+PC9cIiArIG9wdC5maWx0ZXJUeXBlICsgXCI+XCI7XHJcbiAgICAgICAgICAgIGlmIChvcHQuQ0FNTFF1ZXJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBvcHQuQ0FNTFF1ZXJ5ICsgXCI8L0FuZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8L1doZXJlPjwvUXVlcnk+XCI7XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIEdldExpc3RJdGVtcyB0byBmaW5kIGFsbCBvZiB0aGUgcG90ZW50aWFsIHZhbHVlc1xyXG4gICAgICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdEl0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC5XZWJVUkwsXHJcbiAgICAgICAgICAgICAgICBsaXN0TmFtZTogb3B0LnNvdXJjZUxpc3QsXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnk6IGNhbWxRdWVyeSxcclxuICAgICAgICAgICAgICAgIENBTUxRdWVyeU9wdGlvbnM6IG9wdC5DQU1MUXVlcnlPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgQ0FNTFZpZXdGaWVsZHM6IFwiPFZpZXdGaWVsZHM+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnNvdXJjZUNvbHVtbiArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIENBTUxSb3dMaW1pdDogb3B0LkNBTUxSb3dMaW1pdCxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHVwcGVyL2xvd2VyIGNhc2UgaWYgaWdub3JlQ2FzZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdFZhbHVlID0gb3B0Lmlnbm9yZUNhc2UgPyBjb2x1bW5WYWx1ZS50b1VwcGVyQ2FzZSgpIDogY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIHdoaWNoIHZhbHVlcyBtYXRjaCBhbmQgYWRkIHRoZSBvbmVzIHRoYXQgZG8gdG8gbWF0Y2hBcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1ZhbHVlID0gJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVmFsdWVUZXN0ID0gb3B0Lmlnbm9yZUNhc2UgPyAkKHRoaXMpLmF0dHIoXCJvd3NfXCIgKyBvcHQuc291cmNlQ29sdW1uKS50b1VwcGVyQ2FzZSgpIDogJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgbWF0Y2guLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5maWx0ZXJUeXBlID09PSBcIkNvbnRhaW5zXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdE1hdGNoID0gdGhpc1ZhbHVlVGVzdC5pbmRleE9mKHRlc3RWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpcnN0TWF0Y2ggPj0gMCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLi4uYW5kIHRoYXQgdGhlIG1hdGNoIGlzIG5vdCBhbHJlYWR5IGluIHRoZSBhcnJheSBpZiB3ZSB3YW50IHVuaXF1ZW5lc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW9wdC51bmlxdWVWYWxzIHx8ICgkLmluQXJyYXkodGhpc1ZhbHVlLCBtYXRjaEFycmF5KSA9PT0gLTEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoQXJyYXkucHVzaCgkKHRoaXMpLmF0dHIoXCJvd3NfXCIgKyBvcHQuc291cmNlQ29sdW1uKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGVzIG5vcm1hbCBjYXNlLCB3aGljaCBpcyBCZWdpbnNXaXRoIGFuZCBhbmQgb3RoZXIgdW5rbm93biB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0VmFsdWUgPT09IHRoaXNWYWx1ZVRlc3Quc3Vic3RyKDAsIHRlc3RWYWx1ZS5sZW5ndGgpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC4uLmFuZCB0aGF0IHRoZSBtYXRjaCBpcyBub3QgYWxyZWFkeSBpbiB0aGUgYXJyYXkgaWYgd2Ugd2FudCB1bmlxdWVuZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFvcHQudW5pcXVlVmFscyB8fCAoJC5pbkFycmF5KHRoaXNWYWx1ZSwgbWF0Y2hBcnJheSkgPT09IC0xKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEFycmF5LnB1c2goJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgb3V0IHRoZSBzZXQgb2YgbGlzdCBlbGVtZW50cyB0byBjb250YWluIHRoZSBhdmFpbGFibGUgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGEgaGlnaGxpZ2h0Q2xhc3MgaGFzIGJlZW4gc3VwcGxpZWQsIHdyYXAgYSBzcGFuIGFyb3VuZCBlYWNoIG1hdGNoXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LmhpZ2hsaWdodENsYXNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdXAgUmVnZXggYmFzZWQgb24gd2hldGhlciB3ZSB3YW50IHRvIGlnbm9yZSBjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNSZWdleCA9IG5ldyBSZWdFeHAoY29sdW1uVmFsdWUsIG9wdC5pZ25vcmVDYXNlID8gXCJnaVwiIDogXCJnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIExvb2sgZm9yIGFsbCBvY2N1cnJlbmNlc1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbWF0Y2hBcnJheVtpXS5tYXRjaCh0aGlzUmVnZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydExvYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9vcCBmb3IgZWFjaCBvY2N1cnJlbmNlLCB3cmFwcGluZyBlYWNoIGluIGEgc3BhbiB3aXRoIHRoZSBoaWdobGlnaHRDbGFzcyBDU1MgY2xhc3NcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKG1hdGNoTnVtID0gMDsgbWF0Y2hOdW0gPCBtYXRjaGVzLmxlbmd0aDsgbWF0Y2hOdW0rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1BvcyA9IG1hdGNoQXJyYXlbaV0uaW5kZXhPZihtYXRjaGVzW21hdGNoTnVtXSwgc3RhcnRMb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kUG9zID0gdGhpc1BvcyArIG1hdGNoZXNbbWF0Y2hOdW1dLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNTcGFuID0gXCI8c3BhbiBjbGFzcz0nXCIgKyBvcHQuaGlnaGxpZ2h0Q2xhc3MgKyBcIic+XCIgKyBtYXRjaGVzW21hdGNoTnVtXSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEFycmF5W2ldID0gbWF0Y2hBcnJheVtpXS5zdWJzdHIoMCwgdGhpc1BvcykgKyB0aGlzU3BhbiArIG1hdGNoQXJyYXlbaV0uc3Vic3RyKGVuZFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0TG9jID0gdGhpc1BvcyArIHRoaXNTcGFuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHZhbHVlIHRvIHRoZSBtYXJrdXAgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAgICAgICAgICAgIG91dCArPSBcIjxsaSBzdHlsZT0nZGlzcGxheTogYmxvY2s7cG9zaXRpb246IHJlbGF0aXZlO2N1cnNvcjogcG9pbnRlcjsnPlwiICsgbWF0Y2hBcnJheVtpXSArIFwiPC9saT5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGFsbCB0aGUgbGlzdCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVySWQgY29udGFpbmVyXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9iai5odG1sKG91dCk7XHJcbiAgICAgICAgICAgIC8vIFNldCB1cCBoZWhhdmlvciBmb3IgdGhlIGF2YWlsYWJsZSB2YWx1ZXMgaW4gdGhlIGxpc3QgZWxlbWVudFxyXG4gICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQgKyBcIiBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQpLmZhZGVPdXQob3B0LnNsaWRlVXBTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5PYmoudmFsKCQodGhpcykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSkubW91c2VvdmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZW92ZXJDc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJzb3JcIjogXCJoYW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZmZmZmZcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmRcIjogXCIjMzM5OWZmXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyhtb3VzZW92ZXJDc3MpO1xyXG4gICAgICAgICAgICB9KS5tb3VzZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VvdXRDc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJzb3JcIjogXCJpbmhlcml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBjb2x1bW5PYmpDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmRcIjogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MobW91c2VvdXRDc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlJ3ZlIGdvdCBzb21lIHZhbHVlcyB0byBzaG93LCB0aGVuIHNob3cgJ2VtIVxyXG4gICAgICAgICAgICBpZiAobWF0Y2hBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQpLnNsaWRlRG93bihvcHQuc2xpZGVEb3duU3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcHJvY2Vzc2luZyBpbmRpY2F0b3JcclxuICAgICAgICAgICAgY29sdW1uT2JqLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEF1dG9jb21wbGV0ZVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBzZXQgdXAgY2FzY2FkaW5nIGRyb3Bkb3ducyBvbiBhIFNoYXJlUG9pbnQgZm9ybVxyXG4gICAgLy8gKE5ld2Zvcm0uYXNweCwgRWRpdEZvcm0uYXNweCwgb3IgYW55IG90aGVyIGN1c3RvbWl6ZWQgZm9ybS4pXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcFdlYlVSTDogXCJcIiwgLy8gW09wdGlvbmFsXSBUaGUgbmFtZSBvZiB0aGUgV2ViIChzaXRlKSB3aGljaCBjb250YWlucyB0aGUgcmVsYXRpb25zaGlwcyBsaXN0XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcExpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwc1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgcGFyZW50IGNvbHVtbiBpbiB0aGUgcmVsYXRpb25zaGlwIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdENoaWxkQ29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgY2hpbGQgY29sdW1uIGluIHRoZSByZWxhdGlvbnNoaXAgbGlzdFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbjogXCJcIiwgLy8gW09wdGlvbmFsXSBJZiBzcGVjaWZpZWQsIHNvcnQgdGhlIG9wdGlvbnMgaW4gdGhlIGRyb3Bkb3duIGJ5IHRoaXMgY29sdW1uLFxyXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgdGhlIG9wdGlvbnMgYXJlIHNvcnRlZCBieSByZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW5cclxuICAgICAgICAgICAgcGFyZW50Q29sdW1uOiBcIlwiLCAvLyBUaGUgZGlzcGxheSBuYW1lIG9mIHRoZSBwYXJlbnQgY29sdW1uIGluIHRoZSBmb3JtXHJcbiAgICAgICAgICAgIGNoaWxkQ29sdW1uOiBcIlwiLCAvLyBUaGUgZGlzcGxheSBuYW1lIG9mIHRoZSBjaGlsZCBjb2x1bW4gaW4gdGhlIGZvcm1cclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIiwgLy8gW09wdGlvbmFsXSBGb3IgcG93ZXIgdXNlcnMsIHRoaXMgQ0FNTCBmcmFnbWVudCB3aWxsIGJlIEFuZGVkIHdpdGggdGhlIGRlZmF1bHQgcXVlcnkgb24gdGhlIHJlbGF0aW9uc2hpcExpc3RcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjxJbmNsdWRlTWFuZGF0b3J5Q29sdW1ucz5GQUxTRTwvSW5jbHVkZU1hbmRhdG9yeUNvbHVtbnM+PC9RdWVyeU9wdGlvbnM+XCIsIC8vIFtPcHRpb25hbF0gRm9yIHBvd2VyIHVzZXJzLCBhYmlsaXR5IHRvIHNwZWNpZnkgUXVlcnkgT3B0aW9uc1xyXG4gICAgICAgICAgICBwcm9tcHRUZXh0OiBcIlwiLCAvLyBbREVQUkVDQVRFRF0gVGV4dCB0byB1c2UgYXMgcHJvbXB0LiBJZiBpbmNsdWRlZCwgezB9IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWUgb2YgY2hpbGRDb2x1bW4uIE9yaWdpbmFsIHZhbHVlIFwiQ2hvb3NlIHswfS4uLlwiXHJcbiAgICAgICAgICAgIG5vbmVUZXh0OiBcIihOb25lKVwiLCAvLyBbT3B0aW9uYWxdIFRleHQgdG8gdXNlIGZvciB0aGUgKE5vbmUpIHNlbGVjdGlvbi4gUHJvdmlkZWQgZm9yIG5vbi1FbmdsaXNoIGxhbmd1YWdlIHN1cHBvcnQuXHJcbiAgICAgICAgICAgIHNpbXBsZUNoaWxkOiBmYWxzZSwgLy8gW09wdGlvbmFsXSBJZiBzZXQgdG8gdHJ1ZSBhbmQgY2hpbGRDb2x1bW4gaXMgYSBjb21wbGV4IGRyb3Bkb3duLCBjb252ZXJ0IGl0IHRvIGEgc2ltcGxlIGRyb3Bkb3duXHJcbiAgICAgICAgICAgIHNlbGVjdFNpbmdsZU9wdGlvbjogZmFsc2UsIC8vIFtPcHRpb25hbF0gSWYgc2V0IHRvIHRydWUgYW5kIHRoZXJlIGlzIG9ubHkgYSBzaW5nbGUgY2hpbGQgb3B0aW9uLCBzZWxlY3QgaXRcclxuICAgICAgICAgICAgbWF0Y2hPbklkOiBmYWxzZSwgLy8gQnkgZGVmYXVsdCwgd2UgbWF0Y2ggb24gdGhlIGxvb2t1cCdzIHRleHQgdmFsdWUuIElmIG1hdGNoT25JZCBpcyB0cnVlLCB3ZSdsbCBtYXRjaCBvbiB0aGUgbG9va3VwIGlkIGluc3RlYWQuXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlcztpZiBmYWxzZSwgcnVuIHNpbGVudFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRoaXNQYXJlbnRTZXRVcCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIHBhcmVudCBjb2x1bW4ncyBzZWxlY3QgKGRyb3Bkb3duKVxyXG4gICAgICAgIHZhciBwYXJlbnRTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG9wdC5wYXJlbnRDb2x1bW5cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAocGFyZW50U2VsZWN0Lk9iai5odG1sKCkgPT09IG51bGwgJiYgb3B0LmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sIFwicGFyZW50Q29sdW1uOiBcIiArIG9wdC5wYXJlbnRDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNoaWxkIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNoaWxkU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY2hpbGRDb2x1bW5cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoY2hpbGRTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjaGlsZENvbHVtbjogXCIgKyBvcHQuY2hpbGRDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHJlcXVlc3RlZCBhbmQgdGhlIGNoaWxkQ29sdW1uIGlzIGEgY29tcGxleCBkcm9wZG93biwgY29udmVydCB0byBhIHNpbXBsZSBkcm9wZG93blxyXG4gICAgICAgIGlmIChvcHQuc2ltcGxlQ2hpbGQgPT09IHRydWUgJiYgY2hpbGRTZWxlY3QuVHlwZSA9PT0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4KSB7XHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzLlNQQ29tcGxleFRvU2ltcGxlRHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6IG9wdC5jaGlsZENvbHVtblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gU2V0IHRoZSBjaGlsZFNlbGVjdCB0byByZWZlcmVuY2UgdGhlIG5ldyBzaW1wbGUgZHJvcGRvd25cclxuICAgICAgICAgICAgY2hpbGRTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY2hpbGRDb2x1bW5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY2hpbGRDb2x1bW5SZXF1aXJlZCwgY2hpbGRDb2x1bW5TdGF0aWM7XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY2hpbGRDb2x1bW4gZnJvbSB0aGUgY3VycmVudCBsaXN0XHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhY2hlWE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogb3B0Lmxpc3ROYW1lLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkZpZWxkc1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQuY2hpbGRDb2x1bW4gKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBjaGlsZENvbHVtbiBpcyBSZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZENvbHVtblJlcXVpcmVkID0gKCQodGhpcykuYXR0cihcIlJlcXVpcmVkXCIpID09PSBcIlRSVUVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQ29sdW1uU3RhdGljID0gJCh0aGlzKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcCBsb29raW5nOyB3ZSdyZSBkb25lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgZGF0YSBhYm91dCBlYWNoIGNoaWxkIGNvbHVtbiBvbiB0aGUgcGFyZW50XHJcbiAgICAgICAgdmFyIGNoaWxkQ29sdW1uID0ge1xyXG4gICAgICAgICAgICBvcHQ6IG9wdCxcclxuICAgICAgICAgICAgY2hpbGRTZWxlY3Q6IGNoaWxkU2VsZWN0LFxyXG4gICAgICAgICAgICBjaGlsZENvbHVtblN0YXRpYzogY2hpbGRDb2x1bW5TdGF0aWMsXHJcbiAgICAgICAgICAgIGNoaWxkQ29sdW1uUmVxdWlyZWQ6IGNoaWxkQ29sdW1uUmVxdWlyZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBjaGlsZENvbHVtbnMgPSBwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bnNDaGlsZENvbHVtbnNcIik7XHJcblxyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGNoaWxkIGZvciB0aGlzIHBhcmVudCwgdGhlbiBjcmVhdGUgdGhlIGRhdGEgb2JqZWN0IHRvIGhvbGQgdGhlIHNldHRpbmdzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZENvbHVtbnMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcGFyZW50U2VsZWN0Lk9iai5kYXRhKFwiU1BDYXNjYWRlRHJvcGRvd25zQ2hpbGRDb2x1bW5zXCIsIFtjaGlsZENvbHVtbl0pO1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhbHJlYWR5IGhhdmUgYSBkYXRhIG9iamVjdCBmb3IgdGhpcyBwYXJlbnQsIHRoZW4gYWRkIHRoZSBzZXR0aW5nIGZvciB0aGlzIGNoaWxkIHRvIGl0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGRDb2x1bW5zLnB1c2goY2hpbGRDb2x1bW4pO1xyXG4gICAgICAgICAgICBwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bnNDaGlsZENvbHVtbnNcIiwgY2hpbGRDb2x1bW5zKTtcclxuICAgICAgICAgICAgdGhpc1BhcmVudFNldFVwID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBiaW5kIHRvIHRoZSBldmVudChzKSBpZiB3ZSBoYXZlbid0IGFscmVhZHkgZG9uZSBzb1xyXG4gICAgICAgIGlmICghdGhpc1BhcmVudFNldFVwKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocGFyZW50U2VsZWN0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFBsYWluIG9sZCBzZWxlY3RcclxuICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50U2VsZWN0Lk9iai5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzY2FkZURyb3Bkb3duKHBhcmVudFNlbGVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAvLyBJbnB1dCAvIFNlbGVjdCBoeWJyaWRcclxuICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEJpbmQgdG8gYW55IGNoYW5nZSBvbiB0aGUgaGlkZGVuIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRTZWxlY3Qub3B0SGlkLmJpbmQoXCJwcm9wZXJ0eWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgLy8gTXVsdGktc2VsZWN0IGh5YnJpZFxyXG4gICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgZGJsY2xpY2sgb24gdGhlIGNhbmRpZGF0ZSBzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAkKHBhcmVudFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuYmluZChcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzY2FkZURyb3Bkb3duKHBhcmVudFNlbGVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBkYmxjbGljayBvbiB0aGUgc2VsZWN0ZWQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgJChwYXJlbnRTZWxlY3QubWFzdGVyLnJlc3VsdENvbnRyb2wpLmJpbmQoXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBidXR0b24gY2xpY2tzXHJcbiAgICAgICAgICAgICAgICAgICAgJChwYXJlbnRTZWxlY3QubWFzdGVyLmFkZENvbnRyb2wpLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQocGFyZW50U2VsZWN0Lm1hc3Rlci5yZW1vdmVDb250cm9sKS5iaW5kKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNjYWRlRHJvcGRvd24ocGFyZW50U2VsZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRmlyZSB0aGUgY2hhbmdlIHRvIHNldCB0aGUgaW5pdGlhbGx5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICBjYXNjYWRlRHJvcGRvd24ocGFyZW50U2VsZWN0KTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQQ2FzY2FkZURyb3Bkb3duc1xyXG5cclxuICAgIGZ1bmN0aW9uIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpIHtcclxuICAgICAgICB2YXIgY2hvaWNlcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHBhcmVudFNlbGVjdFNlbGVjdGVkO1xyXG4gICAgICAgIHZhciBjaGlsZFNlbGVjdFNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICB2YXIgbmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhO1xyXG4gICAgICAgIHZhciBudW1DaGlsZE9wdGlvbnM7XHJcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGRPcHRpb25JZDtcclxuICAgICAgICB2YXIgZmlyc3RDaGlsZE9wdGlvblZhbHVlO1xyXG5cclxuICAgICAgICAvLyBGaWx0ZXIgZWFjaCBjaGlsZCBjb2x1bW5cclxuICAgICAgICB2YXIgY2hpbGRDb2x1bW5zID0gcGFyZW50U2VsZWN0Lk9iai5kYXRhKFwiU1BDYXNjYWRlRHJvcGRvd25zQ2hpbGRDb2x1bW5zXCIpO1xyXG4gICAgICAgICQoY2hpbGRDb2x1bW5zKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEJyZWFrIG91dCB0aGUgZGF0YSBvYmplY3RzIGZvciB0aGlzIGNoaWxkIGNvbHVtblxyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIG9wdCA9IHRoaXMub3B0O1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRTZWxlY3QgPSB0aGlzLmNoaWxkU2VsZWN0O1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb2x1bW5TdGF0aWMgPSB0aGlzLmNoaWxkQ29sdW1uU3RhdGljO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb2x1bW5SZXF1aXJlZCA9IHRoaXMuY2hpbGRDb2x1bW5SZXF1aXJlZDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgcGFyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICAgICAgcGFyZW50U2VsZWN0U2VsZWN0ZWQgPSB1dGlscy5nZXREcm9wZG93blNlbGVjdGVkKHBhcmVudFNlbGVjdCwgb3B0Lm1hdGNoT25JZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGhhc24ndCBjaGFuZ2VkLCB0aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkbyByaWdodCBub3cuICBUaGlzIGlzIHVzZWZ1bCB0byByZWR1Y2VcclxuICAgICAgICAgICAgLy8gdGhlIG51bWJlciBvZiBXZWIgU2VydmljZSBjYWxscyB3aGVuIHRoZSBwYXJlbnRTZWxlY3QuVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleCBvciBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0LCBhcyB0aGVyZSBhcmUgbXVsdGlwbGUgcHJvcGVydHljaGFuZ2VzXHJcbiAgICAgICAgICAgIC8vIHdoaWNoIGRvbid0IHJlcXVpcmUgYW55IGFjdGlvbi4gIFRoZSBhdHRyaWJ1dGUgd2lsbCBiZSB1bmlxdWUgcGVyIGNoaWxkIGNvbHVtbiBpbiBjYXNlIHRoZXJlIGFyZVxyXG4gICAgICAgICAgICAvLyBtdWx0aXBsZSBjaGlsZHJlbiBmb3IgYSBnaXZlbiBwYXJlbnQuXHJcbiAgICAgICAgICAgIHZhciBhbGxQYXJlbnRTZWxlY3Rpb25zID0gcGFyZW50U2VsZWN0U2VsZWN0ZWQuam9pbihjb25zdGFudHMuc3BEZWxpbSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bl9TZWxlY3RlZF9cIiArIGNoaWxkQ29sdW1uU3RhdGljKSA9PT0gYWxsUGFyZW50U2VsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudFNlbGVjdC5PYmouZGF0YShcIlNQQ2FzY2FkZURyb3Bkb3duX1NlbGVjdGVkX1wiICsgY2hpbGRDb2x1bW5TdGF0aWMsIGFsbFBhcmVudFNlbGVjdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNoaWxkIGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICAgICAgY2hpbGRTZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY2hpbGRTZWxlY3QsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgcGFyZW50IGNvbHVtbidzIHNlbGVjdGVkIG9wdGlvbiBjaGFuZ2VzLCBnZXQgdGhlIG1hdGNoaW5nIGl0ZW1zIGZyb20gdGhlIHJlbGF0aW9uc2hpcCBsaXN0XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGlzdCBpdGVtcyB3aGljaCBtYXRjaCB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAgICAgICAgdmFyIHNvcnRDb2x1bW4gPSAob3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0Q29sdW1uLmxlbmd0aCA+IDApID8gb3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0Q29sdW1uIDogb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbjtcclxuICAgICAgICAgICAgdmFyIGNhbWxRdWVyeSA9IFwiPFF1ZXJ5PjxPcmRlckJ5PjxGaWVsZFJlZiBOYW1lPSdcIiArIHNvcnRDb2x1bW4gKyBcIicvPjwvT3JkZXJCeT48V2hlcmU+PEFuZD5cIjtcclxuICAgICAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEFuZD5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgdXAgdGhlIGNyaXRlcmlhIGZvciBpbmNsdXNpb25cclxuICAgICAgICAgICAgaWYgKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIG5vIHZhbHVlcyBhcmUgc2VsZWN0ZWQgaW4gbXVsdGktc2VsZWN0c1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICsgXCInLz48VmFsdWUgVHlwZT0nVGV4dCc+PC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gT25seSBvbmUgdmFsdWUgaXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxFcT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRpb25zaGlwTGlzdFBhcmVudENvbHVtbiArXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmVzY2FwZUNvbHVtblZhbHVlKHBhcmVudFNlbGVjdFNlbGVjdGVkWzBdKSArIFwiPC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvdW5kID0gKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA+IDIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IChwYXJlbnRTZWxlY3RTZWxlY3RlZC5sZW5ndGggLSAxKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPE9yPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lc2NhcGVDb2x1bW5WYWx1ZShwYXJlbnRTZWxlY3RTZWxlY3RlZFtpXSkgKyBcIjwvVmFsdWU+PC9FcT5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDAgJiYgKGkgPCAocGFyZW50U2VsZWN0U2VsZWN0ZWQubGVuZ3RoIC0gMSkpICYmIGNvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjwvT3I+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPC9Pcj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IG9wdC5DQU1MUXVlcnkgKyBcIjwvQW5kPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgZ2V0IGFueSBpdGVtcyB3aGljaCBkb24ndCBoYXZlIHRoZSBjaGlsZCB2YWx1ZVxyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8SXNOb3ROdWxsPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4gKyBcIicgLz48L0lzTm90TnVsbD5cIjtcclxuXHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjwvQW5kPjwvV2hlcmU+PC9RdWVyeT5cIjtcclxuXHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgIC8vIEZvcmNlIHN5bmMgc28gdGhhdCB3ZSBoYXZlIHRoZSByaWdodCB2YWx1ZXMgZm9yIHRoZSBjaGlsZCBjb2x1bW4gb25jaGFuZ2UgdHJpZ2dlclxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQucmVsYXRpb25zaGlwV2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5yZWxhdGlvbnNoaXBMaXN0LFxyXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGJhc2VkIG9uIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcGFyZW50IGNvbHVtbidzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnk6IGNhbWxRdWVyeSxcclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgZ2V0IHRoZSBwYXJlbnQgYW5kIGNoaWxkIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICsgXCInIC8+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbiArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHZpZXcgcm93bGltaXQgYW5kIGdldCBhbGwgYXBwcm9wcmlhdGUgcm93c1xyXG4gICAgICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAgICAgLy8gRXZlbiB0aG91Z2ggc2V0dGluZyBJbmNsdWRlTWFuZGF0b3J5Q29sdW1ucyB0byBGQUxTRSBkb2Vzbid0IHdvcmsgYXMgdGhlIGRvY3MgZGVzY3JpYmUsIGl0IGZpeGVzIGEgYnVnIGluIEdldExpc3RJdGVtcyB3aXRoIG1hbmRhdG9yeSBtdWx0aS1zZWxlY3RzXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBvcHQuQ0FNTFF1ZXJ5T3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZXJyb3JzdHJpbmdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvclRleHQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiT25lIG9yIG1vcmUgZmllbGQgdHlwZXMgYXJlIG5vdCBpbnN0YWxsZWQgcHJvcGVybHkuIEdvIHRvIHRoZSBsaXN0IHNldHRpbmdzIHBhZ2UgdG8gZGVsZXRlIHRoZXNlIGZpZWxkcy5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3RQYXJlbnRDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RQYXJlbnRDb2x1bW4gKyBcIiBvciBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXBMaXN0IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiR3VpZCBzaG91bGQgY29udGFpbiAzMiBkaWdpdHMgd2l0aCA0IGRhc2hlcyAoeHh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHh4KS5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3Q6IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaXN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFuIGV4cGxhbmF0b3J5IHByb21wdFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hpbGRTZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QuT2JqWzBdLmlubmVySFRNTCA9IFwiXCI7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY2hpbGRTZWxlY3QuT2JqKS5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGNvbHVtbiBpcyByZXF1aXJlZCBvciB0aGUgcHJvbXB0VGV4dCBvcHRpb24gaXMgZW1wdHksIGRvbid0IGFkZCB0aGUgcHJvbXB0IHRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hpbGRDb2x1bW5SZXF1aXJlZCAmJiAob3B0LnByb21wdFRleHQubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQucHJvbXB0VGV4dC5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5jaGlsZENvbHVtbikgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkQ29sdW1uUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQubm9uZVRleHQgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjb2x1bW4gaXMgcmVxdWlyZWQsIGRvbid0IGFkZCB0aGUgXCIoTm9uZSlcIiBvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZXMgPSBjaGlsZENvbHVtblJlcXVpcmVkID8gXCJcIiA6IG9wdC5ub25lVGV4dCArIFwifDBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkU2VsZWN0Lk9iai52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuZmluZChcIm9wdGlvblwiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld011bHRpTG9va3VwUGlja2VyZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGNvdW50IG9mIGl0ZW1zIHJldHVybmVkIGFuZCBzYXZlIGl0IHNvIHRoYXQgd2UgY2FuIHNlbGVjdCBpZiBpdCdzIGEgc2luZ2xlIG9wdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBpdGVtIGNvdW50IGlzIHN0b3JlZCB0aHVzOiA8cnM6ZGF0YSBJdGVtQ291bnQ9XCIxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtQ2hpbGRPcHRpb25zID0gcGFyc2VGbG9hdCgkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJyczpkYXRhXCIpLmF0dHIoXCJJdGVtQ291bnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYW4gb3B0aW9uIGZvciBlYWNoIGNoaWxkIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzT3B0aW9uID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiByZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4gaXMgYSBMb29rdXAgY29sdW1uLCB0aGVuIHRoZSBJRCBzaG91bGQgYmUgZm9yIHRoZSBMb29rdXAgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNWYWx1ZSA9ICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpc1ZhbHVlLmluZGV4T2YoY29uc3RhbnRzLnNwRGVsaW0pID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc09wdGlvbiA9IG5ldyB1dGlscy5TcGxpdEluZGV4KHRoaXNWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzT3B0aW9uLmlkID0gJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc09wdGlvbi52YWx1ZSA9IHRoaXNWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbiBpcyBhIGNhbGN1bGF0ZWQgY29sdW1uLCB0aGVuIHRoZSB2YWx1ZSBpc24ndCBwcmVjZWRlZCBieSB0aGUgSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBieSB0aGUgZGF0YXR5cGUuICBJbiB0aGlzIGNhc2UsIHRoaXNPcHRpb24uaWQgc2hvdWxkIGJlIHRoZSBJRCBvZiB0aGUgcmVsYXRpb25zaGlwTGlzdCBpdGVtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcuLCBmbG9hdDsjMTIzNDUuNjdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXNPcHRpb24uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzT3B0aW9uLmlkID0gJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBpZCBhbmQgdmFsdWUgZm9yIHRoZSBmaXJzdCBjaGlsZCBvcHRpb24gaW4gY2FzZSB3ZSBuZWVkIHRvIHNlbGVjdCBpdCAoc2VsZWN0U2luZ2xlT3B0aW9uIG9wdGlvbiBpcyB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENoaWxkT3B0aW9uSWQgPSB0aGlzT3B0aW9uLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENoaWxkT3B0aW9uVmFsdWUgPSB0aGlzT3B0aW9uLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaGlsZFNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICgkKHRoaXMpLmF0dHIoXCJvd3NfSURcIikgPT09IGNoaWxkU2VsZWN0U2VsZWN0ZWRbMF0pID8gXCIgc2VsZWN0ZWQ9J3NlbGVjdGVkJ1wiIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvblwiICsgc2VsZWN0ZWQgKyBcIiB2YWx1ZT0nXCIgKyB0aGlzT3B0aW9uLmlkICsgXCInPlwiICsgdGhpc09wdGlvbi52YWx1ZSArIFwiPC9vcHRpb24+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPcHRpb24uaWQgPT09IGNoaWxkU2VsZWN0U2VsZWN0ZWRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QuT2JqLnZhbCh0aGlzT3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlcyA9IGNob2ljZXMgKyAoKGNob2ljZXMubGVuZ3RoID4gMCkgPyBcInxcIiA6IFwiXCIpICsgdGhpc09wdGlvbi52YWx1ZSArIFwifFwiICsgdGhpc09wdGlvbi5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5tdWx0aVNlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHRoaXNPcHRpb24uaWQgKyBcIic+XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhICs9IHRoaXNPcHRpb24uaWQgKyBcInx0XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCJ8dCB8dCB8dFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoaWxkU2VsZWN0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkU2VsZWN0Lk9iai50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgb3B0aW9uIGFuZCB0aGUgc2VsZWN0U2luZ2xlT3B0aW9uIG9wdGlvbiBpcyB0cnVlLCB0aGVuIHNlbGVjdCBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bUNoaWxkT3B0aW9ucyA9PT0gMSAmJiBvcHQuc2VsZWN0U2luZ2xlT3B0aW9uID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5PYmopLmZpbmQoXCJvcHRpb25bdmFsdWUhPScwJ106Zmlyc3RcIikuYXR0cihcInNlbGVjdGVkXCIsIFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGFsbG93YWJsZSBjaG9pY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXR0cihcImNob2ljZXNcIiwgY2hvaWNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBvcHRpb24gYW5kIHRoZSBzZWxlY3RTaW5nbGVPcHRpb24gb3B0aW9uIGlzIHRydWUsIHRoZW4gc2VsZWN0IGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtQ2hpbGRPcHRpb25zID09PSAxICYmIG9wdC5zZWxlY3RTaW5nbGVPcHRpb24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGlucHV0IGVsZW1lbnQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lk9iaikudmFsKGZpcnN0Q2hpbGRPcHRpb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZSBvZiB0aGUgb3B0SGlkIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5vcHRIaWQudmFsKGZpcnN0Q2hpbGRPcHRpb25JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIHNlbGVjdGlvbiwgdGhlbiByZW1vdmUgdGhlIHZhbHVlIGluIHRoZSBhc3NvY2lhdGVkIGhpZGRlbiBpbnB1dCBlbGVtZW50IChvcHRIaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRTZWxlY3QuT2JqLnZhbCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3Qub3B0SGlkLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgbWFzdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5tYXN0ZXIuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5NdWx0aUxvb2t1cFBpY2tlcmRhdGEudmFsKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgYW55IHByaW9yIHNlbGVjdGlvbnMgdGhhdCBhcmUgbm8gbG9uZ2VyIHZhbGlkIG9yIGFyZW4ndCBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIucmVzdWx0Q29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucHJvcChcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY2hpbGRTZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmZpbmQoXCJvcHRpb25bdmFsdWU9J1wiICsgdGhpc1NlbGVjdGVkLnZhbCgpICsgXCInXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1NlbGVjdGVkLnByb3AoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdpcFJlbW92ZVNlbGVjdGVkSXRlbXMoY2hpbGRTZWxlY3QubWFzdGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIGFueSBvcHRpb25zIGluIHRoZSBjYW5kaWRhdGUgbGlzdCB3aGljaCBhcmUgYWxyZWFkeSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5maW5kKFwib3B0aW9uW3ZhbHVlPSdcIiArIHRoaXNTZWxlY3RlZC52YWwoKSArIFwiJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTZWxlY3RlZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2lwQWRkU2VsZWN0ZWRJdGVtcyhjaGlsZFNlbGVjdC5tYXN0ZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBtYXN0ZXIuZGF0YSB0byB0aGUgbmV3bHkgYWxsb3dhYmxlIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QubWFzdGVyLmRhdGEgPSBHaXBHZXRHcm91cERhdGEobmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGEgZGJsY2xpY2sgc28gdGhhdCB0aGUgY2hpbGQgd2lsbCBiZSBjYXNjYWRlZCBpZiBpdCBpcyBhIG11bHRpc2VsZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkudHJpZ2dlcihcImRibGNsaWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gSWYgcHJlc2VudCwgY2FsbCBjb21wbGV0ZWZ1bmMgd2hlbiBhbGwgZWxzZSBpcyBkb25lXHJcbiAgICAgICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gJChjaGlsZENvbHVtbnMpLmVhY2goZnVuY3Rpb24oKVxyXG5cclxuICAgIH0gLy8gRW5kIGNhc2NhZGVEcm9wZG93blxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvIGNvbnZlcnQgY29tcGxleCBkcm9wZG93bnMgdG8gc2ltcGxlIGRyb3Bkb3duc1xyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQQ29tcGxleFRvU2ltcGxlRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IG51bGwsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7aWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgY29sdW1uJ3Mgc2VsZWN0IChkcm9wZG93bilcclxuICAgICAgICB2YXIgY29sdW1uU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY29sdW1uTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KFwiU1BTZXJ2aWNlcy5TUENvbXBsZXhUb1NpbXBsZURyb3Bkb3duXCIsIFwiY29sdW1uTmFtZTogXCIgKyBvcHQuY29sdW1uTmFtZSwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIGNvbXBsZXggZHJvcGRvd24sIHRoZW4gdGhlcmUgaXMgbm90aGluZyB0byBkb1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuVHlwZSAhPT0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBhdmFpbGFibGUgb3B0aW9ucyBhcmUgc3RvcmVkIGluIHRoZSBjaG9pY2VzIGF0dHJpYnV0ZSBvZiB0aGUgY29tcGxleCBkcm9wZG93bidzIGlucHV0IGVsZW1lbnQuLi5cclxuICAgICAgICB2YXIgY2hvaWNlcyA9ICQoY29sdW1uU2VsZWN0Lk9iaikuYXR0cihcImNob2ljZXNcIikuc3BsaXQoXCJ8XCIpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGtub3cgd2hpY2ggb3B0aW9uIGlzIHNlbGVjdGVkIGFscmVhZHksIGlmIGFueVxyXG4gICAgICAgIHZhciBjb21wbGV4U2VsZWN0U2VsZWN0ZWRJZCA9IGNvbHVtblNlbGVjdC5vcHRIaWQudmFsKCk7XHJcblxyXG4gICAgICAgIC8vIEJ1aWxkIHVwIHRoZSBzaW1wbGUgZHJvcGRvd24sIGdpdmluZyBpdCBhbiBlYXN5IHRvIHNlbGVjdCBpZFxyXG4gICAgICAgIHZhciBzaW1wbGVTZWxlY3RJZCA9IHV0aWxzLmdlbkNvbnRhaW5lcklkKFwiU1BDb21wbGV4VG9TaW1wbGVEcm9wZG93blwiLCBjb2x1bW5TZWxlY3QuT2JqLmF0dHIoXCJ0aXRsZVwiKSwgb3B0Lmxpc3ROYW1lKTtcclxuXHJcbiAgICAgICAgdmFyIHNpbXBsZVNlbGVjdCA9IFwiPHNlbGVjdCBpZD0nXCIgKyBzaW1wbGVTZWxlY3RJZCArIFwiJyB0aXRsZT0nXCIgKyBvcHQuY29sdW1uTmFtZSArIFwiJz5cIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNob2ljZXMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgdmFyIHNpbXBsZVNlbGVjdFNlbGVjdGVkID0gKGNob2ljZXNbaSArIDFdID09PSBjb21wbGV4U2VsZWN0U2VsZWN0ZWRJZCkgPyBcIiBzZWxlY3RlZD0nc2VsZWN0ZWQnIFwiIDogXCIgXCI7XHJcbiAgICAgICAgICAgIHNpbXBsZVNlbGVjdCArPSBcIjxvcHRpb25cIiArIHNpbXBsZVNlbGVjdFNlbGVjdGVkICsgXCJ2YWx1ZT0nXCIgKyBjaG9pY2VzW2kgKyAxXSArIFwiJz5cIiArIGNob2ljZXNbaV0gKyBcIjwvb3B0aW9uPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaW1wbGVTZWxlY3QgKz0gXCI8L3NlbGVjdD5cIjtcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgc2ltcGxlIHNlbGVjdCB0byB0aGUgZm9ybVxyXG4gICAgICAgIGNvbHVtblNlbGVjdC5PYmouY2xvc2VzdChcInRkXCIpLnByZXBlbmQoc2ltcGxlU2VsZWN0KTtcclxuICAgICAgICB2YXIgc2ltcGxlU2VsZWN0T2JqID0gJChcIiNcIiArIHNpbXBsZVNlbGVjdElkKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBjb21wbGV4IGRyb3Bkb3duIGZ1bmN0aW9uYWxpdHkgc2luY2Ugd2UgZG9uJ3QgbmVlZCBpdCBhbnltb3JlLi4uXHJcbiAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5jbG9zZXN0KFwic3BhblwiKS5maW5kKFwiaW1nXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIC8vIC4uLmFuZCBoaWRlIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5jbG9zZXN0KFwic3BhblwiKS5maW5kKFwiaW5wdXRcIikuaGlkZSgpO1xyXG5cclxuICAgICAgICAvLyBXaGVuIHRoZSBzaW1wbGUgc2VsZWN0IGNoYW5nZXMuLi5cclxuICAgICAgICBzaW1wbGVTZWxlY3RPYmouY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNWYWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICAvLyAuLi5zZXQgdGhlIG9wdEhpZCBpbnB1dCBlbGVtZW50J3MgdmFsdWUgdG8gdGhlIHZhbHVzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uLi5cclxuICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm9wdEhpZC52YWwodGhpc1ZhbCk7XHJcbiAgICAgICAgICAgIC8vIC4uLmFuZCBzYXZlIHRoZSBzZWxlY3RlZCB2YWx1ZSBhcyB0aGUgaGlkZGVuIGlucHV0J3MgdmFsdWUgb25seSBpZiB0aGUgdmFsdWUgaXMgbm90IGVxdWFsIHRvIFwiMFwiIChOb25lKVxyXG4gICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5PYmopLnZhbCgkKHRoaXMpLmZpbmQoXCJvcHRpb25bdmFsdWU9J1wiICsgKHRoaXNWYWwgIT09IFwiMFwiID8gdGhpc1ZhbCA6IFwiXCIpICsgXCInXVwiKS5odG1sKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFRyaWdnZXIgYSBjaGFuZ2UgdG8gZW5zdXJlIHRoYXQgdGhlIHNlbGVjdGVkIHZhbHVlIHJlZ2lzdGVycyBpbiB0aGUgY29tcGxleCBkcm9wZG93blxyXG4gICAgICAgIHNpbXBsZVNlbGVjdE9iai50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG5cclxuICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BDb252ZXJ0VG9TaW1wbGVEcm9wZG93blxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHRvIGRpc3BsYXkgcmVsYXRlZCBpbmZvcm1hdGlvbiB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZCBvbiBhIGZvcm0uXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BEaXNwbGF5UmVsYXRlZEluZm8gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICByZWxhdGVkV2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBXZWIgKHNpdGUpIHdoaWNoIGNvbnRhaW5zIHRoZSByZWxhdGVkIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRlZExpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXHJcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0Q29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgcmVsYXRlZCBjb2x1bW4gaW4gdGhlIHJlbGF0ZWQgbGlzdFxyXG4gICAgICAgICAgICByZWxhdGVkQ29sdW1uczogW10sIC8vIEFuIGFycmF5IG9mIHJlbGF0ZWQgY29sdW1ucyB0byBkaXNwbGF5XHJcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwidGFibGVcIiwgLy8gVGhlIGZvcm1hdCB0byB1c2UgaW4gZGlzcGxheWluZyB0aGUgcmVsYXRlZCBpbmZvcm1hdGlvbi4gIFBvc3NpYmxlIHZhbHVlcyBhcmU6IFt0YWJsZSwgbGlzdCwgbm9uZV1cclxuICAgICAgICAgICAgaGVhZGVyQ1NTQ2xhc3M6IFwibXMtdmgyXCIsIC8vIENTUyBjbGFzcyBmb3IgdGhlIHRhYmxlIGhlYWRlcnNcclxuICAgICAgICAgICAgcm93Q1NTQ2xhc3M6IFwibXMtdmJcIiwgLy8gQ1NTIGNsYXNzIGZvciB0aGUgdGFibGUgcm93c1xyXG4gICAgICAgICAgICBDQU1MUXVlcnk6IFwiXCIsIC8vIFtPcHRpb25hbF0gRm9yIHBvd2VyIHVzZXJzLCB0aGlzIENBTUwgZnJhZ21lbnQgd2lsbCBiZSA8QW5kPmVkIHdpdGggdGhlIGRlZmF1bHQgcXVlcnkgb24gdGhlIHJlbGF0ZWRMaXN0XHJcbiAgICAgICAgICAgIG51bUNoYXJzOiAwLCAvLyBJZiB1c2VkIG9uIGFuIGlucHV0IGNvbHVtbiAobm90IGEgZHJvcGRvd24pLCBubyBtYXRjaGluZyB3aWxsIG9jY3VyIHVudGlsIGF0IGxlYXN0IHRoaXMgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaGFzIGJlZW4gZW50ZXJlZFxyXG4gICAgICAgICAgICBtYXRjaFR5cGU6IFwiRXFcIiwgLy8gSWYgdXNlZCBvbiBhbiBpbnB1dCBjb2x1bW4gKG5vdCBhIGRyb3Bkb3duKSwgdHlwZSBvZiBtYXRjaC4gQ2FuIGJlIGFueSB2YWxpZCBDQU1MIGNvbXBhcmlzb24gb3BlcmF0b3IsIG1vc3Qgb2Z0ZW4gXCJFcVwiIG9yIFwiQmVnaW5zV2l0aFwiXHJcbiAgICAgICAgICAgIG1hdGNoT25JZDogZmFsc2UsIC8vIEJ5IGRlZmF1bHQsIHdlIG1hdGNoIG9uIHRoZSBsb29rdXAncyB0ZXh0IHZhbHVlLiBJZiBtYXRjaE9uSWQgaXMgdHJ1ZSwgd2UnbGwgbWF0Y2ggb24gdGhlIGxvb2t1cCBpZCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IG51bGwsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7aWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIHJlbGF0ZWRDb2x1bW5zWE1MID0gW107XHJcbiAgICAgICAgdmFyIHJlbGF0ZWRMaXN0WE1MO1xyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BEaXNwbGF5UmVsYXRlZEluZm9cIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgY29sdW1uJ3Mgc2VsZWN0IChkcm9wZG93bilcclxuICAgICAgICB2YXIgY29sdW1uU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY29sdW1uTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5jb2x1bW5OYW1lLCBjb25zdGFudHMuVFhUQ29sdW1uTm90Rm91bmQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBHZXQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlbGF0ZWQgbGlzdCBhbmQgaXRzIGNvbHVtbnNcclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0XCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LnJlbGF0ZWRXZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkZWJ1ZyBpcyBvbiwgbm90aWZ5IGFib3V0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZmF1bHRjb2RlXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJyZWxhdGVkTGlzdDogXCIgKyBvcHQucmVsYXRlZExpc3QsIFwiTGlzdCBub3QgZm91bmRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGluZm8gYWJvdXQgdGhlIHJlbGF0ZWQgbGlzdFxyXG4gICAgICAgICAgICAgICAgcmVsYXRlZExpc3RYTUwgPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiTGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggY29sdW1uIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5yZWxhdGVkQ29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0gPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRzID4gRmllbGRbTmFtZT0nXCIgKyBvcHQucmVsYXRlZENvbHVtbnNbaV0gKyBcIiddXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRMaXN0Q29sdW1uXSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZHMgPiBGaWVsZFtOYW1lPSdcIiArIG9wdC5yZWxhdGVkTGlzdENvbHVtbiArIFwiJ11cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjb2x1bW5TZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBQbGFpbiBvbGQgc2VsZWN0XHJcbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLmJpbmQoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dSZWxhdGVkKG9wdCwgcmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vIElucHV0IC8gU2VsZWN0IGh5YnJpZFxyXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgIC8vIEJpbmQgdG8gYW55IGNoYW5nZSBvbiB0aGUgaGlkZGVuIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5vcHRIaWQuYmluZChcInByb3BlcnR5Y2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93UmVsYXRlZChvcHQsIHJlbGF0ZWRMaXN0WE1MLCByZWxhdGVkQ29sdW1uc1hNTCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyBNdWx0aS1zZWxlY3QgaHlicmlkXHJcbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5tdWx0aVNlbGVjdDpcclxuICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImNvbHVtbk5hbWU6IFwiICsgb3B0LmNvbHVtbk5hbWUsIFwiTXVsdGktc2VsZWN0IGNvbHVtbnMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGZ1bmN0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRmlyZSB0aGUgY2hhbmdlIHRvIHNldCB0aGUgaW5pdGlhbGx5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICBzaG93UmVsYXRlZChvcHQsIHJlbGF0ZWRMaXN0WE1MLCByZWxhdGVkQ29sdW1uc1hNTCk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUERpc3BsYXlSZWxhdGVkSW5mb1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dSZWxhdGVkKG9wdCwgcmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MKSB7XHJcblxyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBjb2x1bW5TZWxlY3RTZWxlY3RlZDtcclxuICAgICAgICB2YXIgdGhpc0Z1bmN0aW9uID0gXCJTUFNlcnZpY2VzLlNQRGlzcGxheVJlbGF0ZWRJbmZvXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNvbHVtblNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0LmNvbHVtbk5hbWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY29sdW1uU2VsZWN0LCBvcHQubWF0Y2hPbklkKTtcclxuICAgICAgICBpZiAoY29sdW1uU2VsZWN0LlR5cGUgPT09IGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleCAmJiBvcHQubnVtQ2hhcnMgPiAwICYmIGNvbHVtblNlbGVjdFNlbGVjdGVkWzBdLmxlbmd0aCA8IG9wdC5udW1DaGFycykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGhhc24ndCBjaGFuZ2VkLCB0aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkbyByaWdodCBub3cuICBUaGlzIGlzIHVzZWZ1bCB0byByZWR1Y2VcclxuICAgICAgICAvLyB0aGUgbnVtYmVyIG9mIFdlYiBTZXJ2aWNlIGNhbGxzIHdoZW4gdGhlIHBhcmVudFNlbGVjdC5UeXBlID0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4LCBhcyB0aGVyZSBhcmUgbXVsdGlwbGUgcHJvcGVydHljaGFuZ2VzXHJcbiAgICAgICAgLy8gd2hpY2ggZG9uJ3QgcmVxdWlyZSBhbnkgYWN0aW9uLlxyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmF0dHIoXCJzaG93UmVsYXRlZFNlbGVjdGVkXCIpID09PSBjb2x1bW5TZWxlY3RTZWxlY3RlZFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXR0cihcInNob3dSZWxhdGVkU2VsZWN0ZWRcIiwgY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pO1xyXG5cclxuICAgICAgICBpZihvcHQuZGlzcGxheUZvcm1hdCAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAgICAgICAgdmFyIGRpdklkID0gdXRpbHMuZ2VuQ29udGFpbmVySWQoXCJTUERpc3BsYXlSZWxhdGVkSW5mb1wiLCBvcHQuY29sdW1uTmFtZSwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgY29udGFpbmVyLi4uXHJcbiAgICAgICAgICAgICQoXCIjXCIgKyBkaXZJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIC8vIC4uLmFuZCBhcHBlbmQgYSBuZXcsIGVtcHR5IG9uZVxyXG4gICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnBhcmVudCgpLmFwcGVuZChcIjxkaXYgaWQ9XCIgKyBkaXZJZCArIFwiPjwvZGl2PlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgbGlzdCBpdGVtcyB3aGljaCBtYXRjaCB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAgICB2YXIgY2FtbFF1ZXJ5ID0gXCI8UXVlcnk+PFdoZXJlPlwiO1xyXG4gICAgICAgIGlmIChvcHQuQ0FNTFF1ZXJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEFuZD5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGFuZGxlIExvb2t1cCBjb2x1bW5zIGRpZmZlcmVudGx5IHRoYW4gc3RhdGljIGNvbHVtbnNcclxuICAgICAgICB2YXIgcmVsYXRlZExpc3RDb2x1bW5UeXBlID0gcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRMaXN0Q29sdW1uXS5hdHRyKFwiVHlwZVwiKTtcclxuICAgICAgICBpZiAocmVsYXRlZExpc3RDb2x1bW5UeXBlID09PSBcIkxvb2t1cFwiKSB7XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxFcT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRlZExpc3RDb2x1bW4gK1xyXG4gICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgdXRpbHMuZXNjYXBlQ29sdW1uVmFsdWUoY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pICsgXCI8L1ZhbHVlPjwvRXE+XCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArXHJcbiAgICAgICAgICAgICAgICAob3B0Lm1hdGNoT25JZCA/IFwiSUQnIC8+PFZhbHVlIFR5cGU9J0NvdW50ZXInPlwiIDogb3B0LnJlbGF0ZWRMaXN0Q29sdW1uICsgXCInLz48VmFsdWUgVHlwZT0nVGV4dCc+XCIpICtcclxuICAgICAgICAgICAgICAgIHV0aWxzLmVzY2FwZUNvbHVtblZhbHVlKGNvbHVtblNlbGVjdFNlbGVjdGVkWzBdKSArIFwiPC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gb3B0LkNBTUxRdWVyeSArIFwiPC9BbmQ+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbWxRdWVyeSArPSBcIjwvV2hlcmU+PC9RdWVyeT5cIjtcclxuXHJcbiAgICAgICAgdmFyIHZpZXdGaWVsZHMgPSBcIiBcIjtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0LnJlbGF0ZWRDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZpZXdGaWVsZHMgKz0gXCI8RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRlZENvbHVtbnNbaV0gKyBcIicgLz5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RJdGVtc1wiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LnJlbGF0ZWRXZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiB0aGUgY29sdW1uJ3MgY3VycmVudGx5IHNlbGVjdGVkIHZhbHVlXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogY2FtbFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MVmlld0ZpZWxkczogXCI8Vmlld0ZpZWxkcz5cIiArIHZpZXdGaWVsZHMgKyBcIjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHQgdmlldyByb3dsaW1pdCBhbmQgZ2V0IGFsbCBhcHByb3ByaWF0ZSByb3dzXHJcbiAgICAgICAgICAgIENBTUxSb3dMaW1pdDogMCxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZXJyb3JzXHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZXJyb3JzdHJpbmdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yVGV4dCA9ICQodGhpcykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcgJiYgZXJyb3JUZXh0ID09PSBcIk9uZSBvciBtb3JlIGZpZWxkIHR5cGVzIGFyZSBub3QgaW5zdGFsbGVkIHByb3Blcmx5LiBHbyB0byB0aGUgbGlzdCBzZXR0aW5ncyBwYWdlIHRvIGRlbGV0ZSB0aGVzZSBmaWVsZHMuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVsYXRlZExpc3RDb2x1bW46IFwiICsgb3B0LnJlbGF0ZWRMaXN0Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW4gbm90IGZvdW5kIGluIHJlbGF0ZWRMaXN0IFwiICsgb3B0LnJlbGF0ZWRMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiR3VpZCBzaG91bGQgY29udGFpbiAzMiBkaWdpdHMgd2l0aCA0IGRhc2hlcyAoeHh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHh4KS5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxhdGVkTGlzdDogXCIgKyBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkxpc3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgLy8gT3V0cHV0IGVhY2ggcm93XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wdC5kaXNwbGF5Rm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBpbXBsZW1lbnRpbmcgdGhlIHRhYmxlIGZvcm1hdCBpbiB0aGUgZmlyc3QgaXRlcmF0aW9uICh2MC4yLjkpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRhYmxlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IFwiPHRhYmxlPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQucmVsYXRlZENvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImNvbHVtbk5hbWU6IFwiICsgb3B0LnJlbGF0ZWRDb2x1bW5zW2ldLCBcIkNvbHVtbiBub3QgZm91bmQgaW4gcmVsYXRlZExpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRoIGNsYXNzPSdcIiArIG9wdC5oZWFkZXJDU1NDbGFzcyArIFwiJz5cIiArIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0uYXR0cihcIkRpc3BsYXlOYW1lXCIpICsgXCI8L3RoPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbiBvcHRpb24gZm9yIGVhY2ggY2hpbGQgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQucmVsYXRlZENvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dGQgY2xhc3M9J1wiICsgb3B0LnJvd0NTU0NsYXNzICsgXCInPlwiICsgc2hvd0NvbHVtbihyZWxhdGVkTGlzdFhNTCwgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSwgJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnJlbGF0ZWRDb2x1bW5zW2ldKSwgb3B0KSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8L3RhYmxlPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0IGZvcm1hdCBpbXBsZW1lbnRlZCBpbiB2MC41LjAuIFN0aWxsIHRhYmxlLWJhc2VkLCBidXQgdmVydGljYWwgb3JpZW50YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxpc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8dGFibGU+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5yZWxhdGVkQ29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5yZWxhdGVkQ29sdW1uc1tpXSwgXCJDb2x1bW4gbm90IGZvdW5kIGluIHJlbGF0ZWRMaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dGggY2xhc3M9J1wiICsgb3B0LmhlYWRlckNTU0NsYXNzICsgXCInPlwiICsgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXS5hdHRyKFwiRGlzcGxheU5hbWVcIikgKyBcIjwvdGg+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRkIGNsYXNzPSdcIiArIG9wdC5yb3dDU1NDbGFzcyArIFwiJz5cIiArIHNob3dDb2x1bW4ocmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0sICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5yZWxhdGVkQ29sdW1uc1tpXSksIG9wdCkgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJub25lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgb3V0IHRoZSByZXN1bHRzXHJcbiAgICAgICAgICAgICAgICBpZihvcHQuZGlzcGxheUZvcm1hdCAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiI1wiICsgZGl2SWQpLmh0bWwob3V0U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICAgICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LmNvbXBsZXRlZnVuYyh4RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IC8vIEVuZCBzaG93UmVsYXRlZFxyXG5cclxuICAgIC8vIERpc3BsYXkgYSBjb2x1bW4gKGZpZWxkKSBmb3JtYXR0ZWQgY29ycmVjdGx5IGJhc2VkIG9uIGl0cyBkZWZpbml0aW9uIGluIHRoZSBsaXN0LlxyXG4gICAgLy8gTk9URTogQ3VycmVudGx5IG5vdCBkZWFsaW5nIHdpdGggbG9jYWxlIGRpZmZlcmVuY2VzLlxyXG4gICAgLy8gICBjb2x1bW5YTUwgICAgICAgICAgVGhlIFhNTCBub2RlIGZvciB0aGUgY29sdW1uIGZyb20gYSBHZXRMaXN0IG9wZXJhdGlvblxyXG4gICAgLy8gICBjb2x1bW5WYWx1ZSAgICAgICAgVGhlIHRleHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbHVtbidzIHZhbHVlXHJcbiAgICAvLyAgIG9wdCAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBzZXQgb2Ygb3B0aW9uc1xyXG4gICAgZnVuY3Rpb24gc2hvd0NvbHVtbihsaXN0WE1MLCBjb2x1bW5YTUwsIGNvbHVtblZhbHVlLCBvcHQpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb2x1bW5WYWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBvdXRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGRpc3BVcmw7XHJcbiAgICAgICAgdmFyIG51bURlY2ltYWxzO1xyXG4gICAgICAgIHZhciBvdXRBcnJheSA9IFtdO1xyXG4gICAgICAgIHZhciB3ZWJVcmwgPSBvcHQucmVsYXRlZFdlYlVSTC5sZW5ndGggPiAwID8gb3B0LnJlbGF0ZWRXZWJVUkwgOiAkKCkuU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRTaXRlKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHN3aXRjaCAoY29sdW1uWE1MLmF0dHIoXCJUeXBlXCIpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJUZXh0XCI6XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBjb2x1bW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVVJMXCI6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblhNTC5hdHRyKFwiRm9ybWF0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVVJMIGFzIGh5cGVybGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIeXBlcmxpbmtcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGNvbHVtblZhbHVlLnN1YnN0cmluZygwLCBjb2x1bW5WYWx1ZS5zZWFyY2goXCIsXCIpKSArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKFwiLFwiKSArIDEpICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVSTCBhcyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJJbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBcIjxpbWcgYWx0PSdcIiArIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goXCIsXCIpICsgMSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCInIHNyYz0nXCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKFwiLFwiKSkgKyBcIicvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IGluIGNhc2VcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBjb2x1bW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVzZXJcIjpcclxuICAgICAgICAgICAgY2FzZSBcIlVzZXJNdWx0aVwiOlxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJNdWx0aVZhbHVlcyA9IGNvbHVtblZhbHVlLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1c2VyTXVsdGlWYWx1ZXMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRBcnJheS5wdXNoKFwiPGEgaHJlZj0nL19sYXlvdXRzL3VzZXJkaXNwLmFzcHg/SUQ9XCIgKyB1c2VyTXVsdGlWYWx1ZXNbaV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiZTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIic+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyTXVsdGlWYWx1ZXNbaSArIDFdICsgXCI8L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0QXJyYXkuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDYWxjdWxhdGVkXCI6XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsY0NvbHVtbiA9IGNvbHVtblZhbHVlLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNhbGNDb2x1bW5bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIk51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgbnVtRGVjaW1hbHMgPSBjb2x1bW5YTUwuYXR0cihcIkRlY2ltYWxzXCIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gdHlwZW9mIG51bURlY2ltYWxzID09PSBcInVuZGVmaW5lZFwiID9cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b1N0cmluZygpIDpcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b0ZpeGVkKG51bURlY2ltYWxzKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDdXJyZW5jeVwiOlxyXG4gICAgICAgICAgICAgICAgbnVtRGVjaW1hbHMgPSBjb2x1bW5YTUwuYXR0cihcIkRlY2ltYWxzXCIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gdHlwZW9mIG51bURlY2ltYWxzID09PSBcInVuZGVmaW5lZFwiID9cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b0ZpeGVkKDIpLnRvU3RyaW5nKCkgOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoY29sdW1uVmFsdWUpLnRvRml4ZWQobnVtRGVjaW1hbHMpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvb2t1cFwiOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2x1bW5YTUwuYXR0cihcIk5hbWVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRmlsZVJlZlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGRpc3BsYXkgZm9ybSBVUkwgZm9yIHRoZSBsb29rdXAgc291cmNlIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcFVybCA9IGxpc3RYTUwuYXR0cihcIkJhc2VUeXBlXCIpID09PSBcIjFcIiA/IGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBcIkZvcm1zL0Rpc3BGb3JtLmFzcHhcIiA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBcIkRpc3BGb3JtLmFzcHhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGRpc3BVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/SUQ9XCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSkgKyBcIiZSb290Rm9sZGVyPSomU291cmNlPVwiICsgdXRpbHMuZXNjYXBlVXJsKGxvY2F0aW9uLmhyZWYpICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goY29uc3RhbnRzLnNwRGVsaW0pICsgMikgKyBcIjwvYT5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkZpbGVEaXJSZWZcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkaXNwbGF5IGZvcm0gVVJMIGZvciB0aGUgbG9va3VwIHNvdXJjZSBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BVcmwgPSBjb25zdGFudHMuU0xBU0ggKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBcIjxhIGhyZWY9J1wiICsgZGlzcFVybCArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFueSBvdGhlciBsb29rdXAgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkaXNwbGF5IGZvcm0gVVJMIGZvciB0aGUgbG9va3VwIHNvdXJjZSBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BVcmwgPSB1dGlscy5nZXRMaXN0Rm9ybVVybChjb2x1bW5YTUwuYXR0cihcIkxpc3RcIiksIFwiRGlzcGxheUZvcm1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IFwiPGEgaHJlZj0nXCIgKyBvcHQucmVsYXRlZFdlYlVSTCArIGNvbnN0YW50cy5TTEFTSCArIGRpc3BVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/SUQ9XCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSkgKyBcIiZSb290Rm9sZGVyPSomU291cmNlPVwiICsgdXRpbHMuZXNjYXBlVXJsKGxvY2F0aW9uLmhyZWYpICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goY29uc3RhbnRzLnNwRGVsaW0pICsgMikgKyBcIjwvYT5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvb2t1cE11bHRpXCI6XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGRpc3BsYXkgZm9ybSBVUkwgZm9yIHRoZSBsb29rdXAgc291cmNlIGxpc3RcclxuICAgICAgICAgICAgICAgIGRpc3BVcmwgPSB1dGlscy5nZXRMaXN0Rm9ybVVybChjb2x1bW5YTUwuYXR0cihcIkxpc3RcIiksIFwiRGlzcGxheUZvcm1cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBTaG93IGFsbCB0aGUgdmFsdWVzIGFzIGxpbmtzIHRvIHRoZSBpdGVtcywgc2VwYXJhdGVkIGJ5IGNvbW1hc1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5WYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvb2t1cE11bHRpVmFsdWVzID0gY29sdW1uVmFsdWUuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsb29rdXBNdWx0aVZhbHVlcy5sZW5ndGggLyAyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0QXJyYXkucHVzaChcIjxhIGhyZWY9J1wiICsgd2ViVXJsICsgY29uc3RhbnRzLlNMQVNIICsgZGlzcFVybCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIj9JRD1cIiArIGxvb2t1cE11bHRpVmFsdWVzW2kgKiAyXSArIFwiJlJvb3RGb2xkZXI9KiZTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIic+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9va3VwTXVsdGlWYWx1ZXNbKGkgKiAyKSArIDFdICsgXCI8L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IG91dEFycmF5LmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRmlsZVwiOlxyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBmaWxlTmFtZSArIFwiJz5cIiArIGZpbGVOYW1lICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50ZXJcIjpcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNvbHVtblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEYXRlVGltZVwiOlxyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNvbHVtblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRTdHJpbmc7XHJcbiAgICB9IC8vIEVuZCBvZiBmdW5jdGlvbiBzaG93Q29sdW1uXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIFwiLi4vdXRpbHMvY29uc3RhbnRzXCIsXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzJyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgY29uc3RhbnRzLFxyXG4gICAgdXRpbHNcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoganNoaW50IHVuZGVmOiB0cnVlICovXHJcbiAgICAvKiBnbG9iYWwgR2lwQWRkU2VsZWN0ZWRJdGVtcywgR2lwUmVtb3ZlU2VsZWN0ZWRJdGVtcywgR2lwR2V0R3JvdXBEYXRhICovXHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gZmlsdGVyIGEgbG9va3VwIGJhc2VkIGRyb3Bkb3duXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BGaWx0ZXJEcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBXZWJVUkw6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIFdlYiAoc2l0ZSkgd2hpY2ggY29udGFpbnMgdGhlIHJlbGF0aW9uc2hpcExpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdDogXCJcIiwgLy8gVGhlIG5hbWUgb2YgdGhlIGxpc3Qgd2hpY2ggY29udGFpbnMgdGhlIGxvb2t1cCB2YWx1ZXNcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdENvbHVtbjogXCJcIiwgLy8gVGhlIGludGVybmFsIG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgcmVsYXRpb25zaGlwIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdFNvcnRDb2x1bW46IFwiXCIsIC8vIFtPcHRpb25hbF0gSWYgc3BlY2lmaWVkLCBzb3J0IHRoZSBvcHRpb25zIGluIHRoZSBkcm9wZG93biBieSB0aGlzIGNvbHVtbixcclxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBvcHRpb25zIGFyZSBzb3J0ZWQgYnkgcmVsYXRpb25zaGlwTGlzdENvbHVtblxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0U29ydEFzY2VuZGluZzogdHJ1ZSwgLy8gW09wdGlvbmFsXSBCeSBkZWZhdWx0LCB0aGUgc29ydCBpcyBhc2NlbmRpbmcuIElmIGZhbHNlLCBkZXNjZW5kaW5nXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSwgLy8gVGhlIGxpc3QgdGhlIGZvcm0gaXMgd29ya2luZyB3aXRoLiBUaGlzIGlzIHVzZWZ1bCBpZiB0aGUgZm9ybSBpcyBub3QgaW4gdGhlIGxpc3QgY29udGV4dC5cclxuICAgICAgICAgICAgcHJvbXB0VGV4dDogXCJcIiwgLy8gW0RFUFJFQ0FURURdIFRleHQgdG8gdXNlIGFzIHByb21wdC4gSWYgaW5jbHVkZWQsIHswfSB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlIG9mIGNvbHVtbk5hbWUuIElPcmlnbmFsIHZhbHVlIFwiQ2hvb3NlIHswfS4uLlwiXHJcbiAgICAgICAgICAgIG5vbmVUZXh0OiBcIihOb25lKVwiLCAvLyBbT3B0aW9uYWxdIFRleHQgdG8gdXNlIGZvciB0aGUgKE5vbmUpIHNlbGVjdGlvbi4gUHJvdmlkZWQgZm9yIG5vbi1FbmdsaXNoIGxhbmd1YWdlIHN1cHBvcnQuXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIiwgLy8gVGhpcyBDQU1MIGZyYWdtZW50IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVsYXRpb25zaGlwTGlzdFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBcIjxRdWVyeU9wdGlvbnM+PEluY2x1ZGVNYW5kYXRvcnlDb2x1bW5zPkZBTFNFPC9JbmNsdWRlTWFuZGF0b3J5Q29sdW1ucz48Vmlld0F0dHJpYnV0ZXMgU2NvcGU9J1JlY3Vyc2l2ZUFsbCcvPjwvUXVlcnlPcHRpb25zPlwiLCAvLyBOZWVkIHRoaXMgdG8gbWlycm9yIFNoYXJlUG9pbnQncyBiZWhhdmlvciwgYnV0IGl0IGNhbiBiZSBvdmVycmlkZGVuXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlczsgaWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGNob2ljZXMgPSBcIlwiO1xyXG4gICAgICAgIHZhciBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgdmFyIG5ld011bHRpTG9va3VwUGlja2VyZGF0YTtcclxuICAgICAgICB2YXIgY29sdW1uQ29sdW1uUmVxdWlyZWQ7XHJcbiAgICAgICAgdmFyIHRoaXNGdW5jdGlvbiA9IFwiU1BTZXJ2aWNlcy5TUEZpbHRlckRyb3Bkb3duXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNvbHVtblNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0LmNvbHVtbk5hbWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoY29sdW1uU2VsZWN0Lk9iai5odG1sKCkgPT09IG51bGwgJiYgb3B0LmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sIFwiY29sdW1uTmFtZTogXCIgKyBvcHQuY29sdW1uTmFtZSwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY29sdW1uU2VsZWN0LCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1zIHdoaWNoIG1hdGNoIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICAgIHZhciBzb3J0Q29sdW1uID0gKG9wdC5yZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbi5sZW5ndGggPiAwKSA/IG9wdC5yZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbiA6IG9wdC5yZWxhdGlvbnNoaXBMaXN0Q29sdW1uO1xyXG4gICAgICAgIHZhciBzb3J0T3JkZXIgPSAob3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0QXNjZW5kaW5nID09PSB0cnVlKSA/IFwiXCIgOiBcIkFzY2VuZGluZz0nRkFMU0UnXCI7XHJcbiAgICAgICAgdmFyIGNhbWxRdWVyeSA9IFwiPFF1ZXJ5PjxPcmRlckJ5PjxGaWVsZFJlZiBOYW1lPSdcIiArIHNvcnRDb2x1bW4gKyBcIicgXCIgKyBzb3J0T3JkZXIgKyBcIi8+PC9PcmRlckJ5PjxXaGVyZT5cIjtcclxuICAgICAgICBpZiAob3B0LkNBTUxRdWVyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBvcHQuQ0FNTFF1ZXJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYW1sUXVlcnkgKz0gXCI8L1doZXJlPjwvUXVlcnk+XCI7XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCBjb2x1bW5OYW1lIGZyb20gdGhlIGN1cnJlbnQgbGlzdFxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZHNcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKFwiRmllbGRbRGlzcGxheU5hbWU9J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBjb2x1bW5OYW1lIGlzIFJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkNvbHVtblJlcXVpcmVkID0gKCQodGhpcykuYXR0cihcIlJlcXVpcmVkXCIpID09PSBcIlRSVUVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgbG9va2luZzsgd2UncmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgLy8gRm9yY2Ugc3luYyBzbyB0aGF0IHdlIGhhdmUgdGhlIHJpZ2h0IHZhbHVlcyBmb3IgdGhlIGNvbHVtbiBvbmNoYW5nZSB0cmlnZ2VyXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgd2ViVVJMOiBvcHQucmVsYXRpb25zaGlwV2ViVVJMLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIENBTUxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBjYW1sUXVlcnksXHJcbiAgICAgICAgICAgIC8vIE9ubHkgZ2V0IHRoZSBjb2x1bW5OYW1lJ3MgZGF0YSAocGx1cyBjb2x1bW5zIHdlIGNhbid0IHByZXZlbnQpXHJcbiAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q29sdW1uICsgXCInIC8+PC9WaWV3RmllbGRzPlwiLFxyXG4gICAgICAgICAgICAvLyBPdmVycmlkZSB0aGUgZGVmYXVsdCB2aWV3IHJvd2xpbWl0IGFuZCBnZXQgYWxsIGFwcHJvcHJpYXRlIHJvd3NcclxuICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAvLyBFdmVuIHRob3VnaCBzZXR0aW5nIEluY2x1ZGVNYW5kYXRvcnlDb2x1bW5zIHRvIEZBTFNFIGRvZXNuJ3Qgd29yayBhcyB0aGUgZG9jcyBkZXNjcmliZSwgaXQgZml4ZXMgYSBidWcgaW4gR2V0TGlzdEl0ZW1zIHdpdGggbWFuZGF0b3J5IG11bHRpLXNlbGVjdHNcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogb3B0LkNBTUxRdWVyeU9wdGlvbnMsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGVycm9yc1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcImVycm9yc3RyaW5nXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvclRleHQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LmRlYnVnICYmIGVycm9yVGV4dCA9PT0gXCJPbmUgb3IgbW9yZSBmaWVsZCB0eXBlcyBhcmUgbm90IGluc3RhbGxlZCBwcm9wZXJseS4gR28gdG8gdGhlIGxpc3Qgc2V0dGluZ3MgcGFnZSB0byBkZWxldGUgdGhlc2UgZmllbGRzLlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3RDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXBMaXN0IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0LmRlYnVnICYmIGVycm9yVGV4dCA9PT0gXCJHdWlkIHNob3VsZCBjb250YWluIDMyIGRpZ2l0cyB3aXRoIDQgZGFzaGVzICh4eHh4eHh4eC14eHh4LXh4eHgteHh4eC14eHh4eHh4eHh4eHgpLlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3Q6IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkxpc3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gZXhwbGFuYXRvcnkgcHJvbXB0XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5PYmopLmZpbmQoXCJvcHRpb25cIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjb2x1bW4gaXMgcmVxdWlyZWQgb3IgdGhlIHByb21wdFRleHQgb3B0aW9uIGlzIGVtcHR5LCBkb24ndCBhZGQgdGhlIHByb21wdCB0ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29sdW1uQ29sdW1uUmVxdWlyZWQgJiYgKG9wdC5wcm9tcHRUZXh0Lmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9JzAnPlwiICsgb3B0LnByb21wdFRleHQucmVwbGFjZSgvXFx7MFxcfS9nLCBvcHQuY29sdW1uTmFtZSkgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghY29sdW1uQ29sdW1uUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQubm9uZVRleHQgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGNvbHVtbiBpcyByZXF1aXJlZCwgZG9uJ3QgYWRkIHRoZSBcIihOb25lKVwiIG9wdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2VzID0gY29sdW1uQ29sdW1uUmVxdWlyZWQgPyBcIlwiIDogb3B0Lm5vbmVUZXh0ICsgXCJ8MFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIHRoZSBleGlzdGluZyBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNdWx0aUxvb2t1cFBpY2tlcmRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gb3B0aW9uIGZvciBlYWNoIGl0ZW1cclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc09wdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiByZWxhdGlvbnNoaXBMaXN0Q29sdW1uIGlzIGEgTG9va3VwIGNvbHVtbiwgdGhlbiB0aGUgSUQgc2hvdWxkIGJlIGZvciB0aGUgTG9va3VwIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1ZhbHVlID0gJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDb2x1bW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzVmFsdWUuaW5kZXhPZihjb25zdGFudHMuc3BEZWxpbSkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24gPSBuZXcgdXRpbHMuU3BsaXRJbmRleCh0aGlzVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24uaWQgPSAkKHRoaXMpLmF0dHIoXCJvd3NfSURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24udmFsdWUgPSB0aGlzVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVsYXRpb25zaGlwTGlzdENvbHVtbiBpcyBhIGNhbGN1bGF0ZWQgY29sdW1uLCB0aGVuIHRoZSB2YWx1ZSBpc24ndCBwcmVjZWRlZCBieSB0aGUgSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGJ5IHRoZSBkYXRhdHlwZS4gIEluIHRoaXMgY2FzZSwgdGhpc09wdGlvbi5pZCBzaG91bGQgYmUgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW0uXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZS5nLiwgZmxvYXQ7IzEyMzQ1LjY3XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXNPcHRpb24uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24uaWQgPSAkKHRoaXMpLmF0dHIoXCJvd3NfSURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAoJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpID09PSBjb2x1bW5TZWxlY3RTZWxlY3RlZFswXSkgPyBcIiBzZWxlY3RlZD0nc2VsZWN0ZWQnXCIgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5hcHBlbmQoXCI8b3B0aW9uXCIgKyBzZWxlY3RlZCArIFwiIHZhbHVlPSdcIiArIHRoaXNPcHRpb24uaWQgKyBcIic+XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09wdGlvbi5pZCA9PT0gY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnZhbCh0aGlzT3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZXMgPSBjaG9pY2VzICsgKChjaG9pY2VzLmxlbmd0aCA+IDApID8gXCJ8XCIgOiBcIlwiKSArIHRoaXNPcHRpb24udmFsdWUgKyBcInxcIiArIHRoaXNPcHRpb24uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjb2x1bW5TZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgdGhpc09wdGlvbi5pZCArIFwiJz5cIiArIHRoaXNPcHRpb24udmFsdWUgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld011bHRpTG9va3VwUGlja2VyZGF0YSArPSB0aGlzT3B0aW9uLmlkICsgXCJ8dFwiICsgdGhpc09wdGlvbi52YWx1ZSArIFwifHQgfHQgfHRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2x1bW5TZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmoudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXR0cihcImNob2ljZXNcIiwgY2hvaWNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmoudHJpZ2dlcihcInByb3BlcnR5Y2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBtYXN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm1hc3Rlci5kYXRhID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5NdWx0aUxvb2t1cFBpY2tlcmRhdGEudmFsKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIGFueSBwcmlvciBzZWxlY3Rpb25zIHRoYXQgYXJlIG5vIGxvbmdlciB2YWxpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5tYXN0ZXIucmVzdWx0Q29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzU2VsZWN0ZWQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKFwic2VsZWN0ZWRcIiwgXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PT0gdGhpc1NlbGVjdGVkLmh0bWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR2lwUmVtb3ZlU2VsZWN0ZWRJdGVtcyhjb2x1bW5TZWxlY3QubWFzdGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSBhbnkgb3B0aW9ucyBpbiB0aGUgY2FuZGlkYXRlIGxpc3Qgd2hpY2ggYXJlIGFscmVhZHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChjb2x1bW5TZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PT0gdGhpc1NlbGVjdGVkLmh0bWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBHaXBBZGRTZWxlY3RlZEl0ZW1zKGNvbHVtblNlbGVjdC5tYXN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgbWFzdGVyLmRhdGEgdG8gdGhlIG5ld2x5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm1hc3Rlci5kYXRhID0gR2lwR2V0R3JvdXBEYXRhKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGEgZGJsY2xpY2sgc28gdGhhdCB0aGUgY2hpbGQgd2lsbCBiZSBjYXNjYWRlZCBpZiBpdCBpcyBhIG11bHRpc2VsZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkudHJpZ2dlcihcImRibGNsaWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEZpbHRlckRyb3Bkb3duXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZpbmQgYW4gTU1TIFBpY2tlciBpbiB0aGUgcGFnZVxyXG4gICAgLy8gUmV0dXJucyByZWZlcmVuY2VzIHRvOlxyXG4gICAgLy8gICB0ZXJtcyAtIFRoZSBhYXJheSBvZiB0ZXJtcyBhcyB2YWx1ZS9ndWlkIHBhaXJzXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BGaW5kTU1TUGlja2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIE1NU0Rpc3BsYXlOYW1lOiBcIlwiIC8vIFRoZSBkaXNwbGF5TmFtZSBvZiB0aGUgTU1TIFBpY2tlciBvbiB0aGUgZm9ybVxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgdGhpc1Rlcm1zID0gW107XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGRpdiBmb3IgdGhlIGNvbHVtbiB3aGljaCBjb250YWlucyB0aGUgZW50ZXJlZCBkYXRhIHZhbHVlc1xyXG4gICAgICAgIHZhciB0aGlzRGl2ID0gJChcImRpdlt0aXRsZT0nXCIgKyBvcHQuTU1TRGlzcGxheU5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIHZhciB0aGlzSGlkZGVuSW5wdXQgPSB0aGlzRGl2LmNsb3Nlc3QoXCJ0ZFwiKS5maW5kKFwiaW5wdXRbdHlwZT0naGlkZGVuJ11cIik7XHJcbiAgICAgICAgdmFyIHRoaXNUZXJtQXJyYXkgPSB0aGlzSGlkZGVuSW5wdXQudmFsKCkuc3BsaXQoXCI7XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNUZXJtQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNPbmUgPSB0aGlzVGVybUFycmF5W2ldLnNwbGl0KFwifFwiKTtcclxuICAgICAgICAgICAgdGhpc1Rlcm1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXNPbmVbMF0sXHJcbiAgICAgICAgICAgICAgICBndWlkOiB0aGlzT25lWzFdXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRlcm1zOiB0aGlzVGVybXNcclxuICAgICAgICB9O1xyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BGaW5kTU1TUGlja2VyXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZpbmQgYSBQZW9wbGUgUGlja2VyIGluIHRoZSBwYWdlXHJcbiAgICAvLyBSZXR1cm5zIHJlZmVyZW5jZXMgdG86XHJcbiAgICAvLyAgIHJvdyAtIFRoZSBUUiB3aGljaCBjb250YWlucyB0aGUgUGVvcGxlIFBpY2tlciAodXNlZnVsIGlmIHlvdSdkIGxpa2UgdG8gaGlkZSBpdCBhdCBzb21lIHBvaW50KVxyXG4gICAgLy8gICBjb250ZW50cyAtIFRoZSBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIHRoZSBjdXJyZW50IHZhbHVlXHJcbiAgICAvLyAgIGN1cnJlbnRWYWx1ZSAtIFRoZSBjdXJyZW50IHZhbHVlIGlmIGl0IGlzIHNldFxyXG4gICAgLy8gICBjaGVja05hbWVzIC0gVGhlIENoZWNrIE5hbWVzIGltYWdlIChpbiBjYXNlIHlvdSdkIGxpa2UgdG8gY2xpY2sgaXQgYXQgc29tZSBwb2ludClcclxuICAgIC8vICAgY2hlY2tOYW1lc1BocmFzZSAtIHlvdSBjYW4gcGFzcyB5b3VyIGxvY2FsIHBocmFzZSBoZXJlIHRvIGNoZWNrIG5hbWVzLCBsaWtlIGluIHJ1c3NpYW4gaXQgd291bGQgYmUgLSA/Pz8/Pz8/Pz8gPz8/Pz9cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgcGVvcGxlUGlja2VyRGlzcGxheU5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5TmFtZSBvZiB0aGUgUGVvcGxlIFBpY2tlciBvbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICB2YWx1ZVRvU2V0OiBcIlwiLCAvLyBUaGUgdmFsdWUgdG8gc2V0IHRoZSBQZW9wbGUgUGlja2VyIHRvLiBTaG91bGQgYmUgYSBzdHJpbmcgY29udGFpbmluZyBlYWNoIHVzZXJuYW1lIG9yIGdyb3VwbmFtZSBzZXBhcmF0ZWQgYnkgc2VtaS1jb2xvbnMuXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXM6IHRydWUsIC8vIElmIHNldCB0byB0cnVlLCB0aGUgQ2hlY2sgTmFtZXMgaW1hZ2Ugd2lsbCBiZSBjbGlja2VkIHRvIHJlc29sdmUgdGhlIG5hbWVzXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXNQaHJhc2U6ICdDaGVjayBOYW1lcycgLy8gRW5nbGlzaCBkZWZhdWx0XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciB0aGlzUm93ID0gJChcIm5vYnJcIikuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gRW5zdXJlcyB3ZSBnZXQgYSBtYXRjaCB3aGV0aGVyIG9yIG5vdCB0aGUgUGVvcGxlIFBpY2tlciBpcyByZXF1aXJlZCAoaWYgcmVxdWlyZWQsIHRoZSBub2JyIGNvbnRhaW5zIGEgc3BhbiBhbHNvKVxyXG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5jb250ZW50cygpLmVxKDApLnRleHQoKSA9PT0gb3B0LnBlb3BsZVBpY2tlckRpc3BsYXlOYW1lO1xyXG4gICAgICAgIH0pLmNsb3Nlc3QoXCJ0clwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNDb250ZW50cyA9IHRoaXNSb3cuZmluZChcImRpdltuYW1lPSd1cExldmVsRGl2J11cIik7XHJcbiAgICAgICAgdmFyIHRoaXNDaGVja05hbWVzID0gdGhpc1Jvdy5maW5kKFwiaW1nW1RpdGxlPSdcIiArIG9wdC5jaGVja05hbWVzUGhyYXNlICsgXCInXTpmaXJzdFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgYSB2YWx1ZSB3YXMgcHJvdmlkZWQsIHNldCB0aGUgdmFsdWVcclxuICAgICAgICBpZiAob3B0LnZhbHVlVG9TZXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzQ29udGVudHMuaHRtbChvcHQudmFsdWVUb1NldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBjaGVja05hbWUgaXMgdHJ1ZSwgY2xpY2sgdGhlIGNoZWNrIG5hbWVzIGljb25cclxuICAgICAgICBpZiAob3B0LmNoZWNrTmFtZXMpIHtcclxuICAgICAgICAgICAgdGhpc0NoZWNrTmFtZXMuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRoaXNDdXJyZW50VmFsdWUgPSAkLnRyaW0odGhpc0NvbnRlbnRzLnRleHQoKSk7XHJcblxyXG4gICAgICAgIC8vIFBhcnNlIHRoZSBlbnRpdHkgZGF0YVxyXG4gICAgICAgIHZhciBkaWN0aW9uYXJ5RW50cmllcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBJRVxyXG4gICAgICAgIHRoaXNDb250ZW50cy5jaGlsZHJlbihcInNwYW5cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBlbnRpdHkgZGF0YVxyXG4gICAgICAgICAgICB2YXIgdGhpc0RhdGEgPSAkKHRoaXMpLmZpbmQoXCJkaXZbZGF0YV1cIikuYXR0cihcImRhdGFcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGljdGlvbmFyeUVudHJ5ID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBFbnRpdHkgZGF0YSBpcyBvbmx5IGF2YWlsYWJsZSBpbiBJRVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNEYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXlPZkRpY3Rpb25hcnlFbnRyeSA9ICQucGFyc2VYTUwodGhpc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgdmFyICR4bWwgPSAkKGFycmF5T2ZEaWN0aW9uYXJ5RW50cnkpO1xyXG5cclxuICAgICAgICAgICAgICAgICR4bWwuZmluZChcIkRpY3Rpb25hcnlFbnRyeVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gJCh0aGlzKS5maW5kKFwiS2V5XCIpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWN0aW9uYXJ5RW50cnlba2V5XSA9ICQodGhpcykuZmluZChcIlZhbHVlXCIpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZGljdGlvbmFyeUVudHJpZXMucHVzaChkaWN0aW9uYXJ5RW50cnkpO1xyXG4gICAgICAgICAgICAgICAgLy8gRm9yIG90aGVyIGJyb3dzZXJzLCB3ZSdsbCBjYWxsIEdldFVzZXJJbmZvIHRvIGdldCB0aGUgZGF0YVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRVc2VySW5mb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyTG9naW5OYW1lOiAkKHRoaXMpLmF0dHIoXCJ0aXRsZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIlVzZXJcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Rpb25hcnlFbnRyeVthdHRyaWIubmFtZV0gPSBhdHRyaWIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Rpb25hcnlFbnRyaWVzLnB1c2goZGljdGlvbmFyeUVudHJ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcm93OiB0aGlzUm93LFxyXG4gICAgICAgICAgICBjb250ZW50czogdGhpc0NvbnRlbnRzLFxyXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IHRoaXNDdXJyZW50VmFsdWUsXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXM6IHRoaXNDaGVja05hbWVzLFxyXG4gICAgICAgICAgICBkaWN0aW9uYXJ5RW50cmllczogZGljdGlvbmFyeUVudHJpZXNcclxuICAgICAgICB9O1xyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXJcclxuXHJcbiAgICAvLyBNaXN0YWtlbmx5IHJlbGVhc2VkIHByZXZpb3VzbHkgb3V0c2lkZSB0aGUgU1BTZXJ2aWNlcyBuYW1lc3BhY2UuIFRoaXMgdGFrZXMgY2FyZSBvZiBvZmZlcmluZyBib3RoLlxyXG4gICAgJC5mbi5TUEZpbmRQZW9wbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiAkKCkuU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXIob3B0aW9ucyk7XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUEZpbmRQZW9wbGVQaWNrZXJcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgXCIuLi91dGlscy9jb25zdGFudHNcIixcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB3aGljaCBwcm92aWRlcyBhIGxpbmsgb24gYSBMb29rdXAgY29sdW1uIGZvciB0aGUgdXNlciB0byBmb2xsb3dcclxuICAgIC8vIHdoaWNoIGFsbG93cyB0aGVtIHRvIGFkZCBhIG5ldyB2YWx1ZSB0byB0aGUgTG9va3VwIGxpc3QuXHJcbiAgICAvLyBCYXNlZCBvbiBodHRwOi8vYmxvZy5tYXN0eWthcnoubmwvZXh0ZW5kaW5nLWxvb2t1cC1maWVsZHMtYWRkLW5ldy1pdGVtLW9wdGlvbi9cclxuICAgIC8vIGJ5IFdhbGRlayBNYXN0eWthcnpcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUExvb2t1cEFkZE5ldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBsb29rdXBDb2x1bW46IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIExvb2t1cCBjb2x1bW5cclxuICAgICAgICAgICAgcHJvbXB0VGV4dDogXCJBZGQgbmV3IHswfVwiLCAvLyBUZXh0IHRvIHVzZSBhcyBwcm9tcHQgKyBjb2x1bW4gbmFtZVxyXG4gICAgICAgICAgICBuZXdXaW5kb3c6IGZhbHNlLCAvLyBJZiB0cnVlLCB0aGUgbGluayB3aWxsIG9wZW4gaW4gYSBuZXcgd2luZG93ICp3aXRob3V0KiBwYXNzaW5nIHRoZSBTb3VyY2UuXHJcbiAgICAgICAgICAgIENvbnRlbnRUeXBlSUQ6IFwiXCIsIC8vIFtPcHRpb25hbF0gUGFzcyB0aGUgQ29udGVudFR5cGVJRCBpZiB5b3UnZCBsaWtlIHRvIHNwZWNpZnkgaXRcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBudWxsLCAvLyBGdW5jdGlvbiB0byBjYWxsIG9uIGNvbXBsZXRpb24gb2YgcmVuZGVyaW5nIHRoZSBjaGFuZ2UuXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzO2lmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BMb29rdXBBZGROZXdcIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgbG9va3VwIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGxvb2t1cFNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0Lmxvb2t1cENvbHVtblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChsb29rdXBTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJsb29rdXBDb2x1bW46IFwiICsgb3B0Lmxvb2t1cENvbHVtbiwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5ld1VybCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGxvb2t1cExpc3RVcmwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBsb29rdXBDb2x1bW5TdGF0aWNOYW1lID0gXCJcIjtcclxuICAgICAgICAvLyBVc2UgR2V0TGlzdCBmb3IgdGhlIGN1cnJlbnQgbGlzdCB0byBkZXRlcm1pbmUgdGhlIGRldGFpbHMgZm9yIHRoZSBMb29rdXAgY29sdW1uXHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhY2hlWE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQubG9va3VwQ29sdW1uICsgXCInXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb29rdXBDb2x1bW5TdGF0aWNOYW1lID0gJCh0aGlzKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgR2V0TGlzdCBmb3IgdGhlIExvb2t1cCBjb2x1bW4ncyBsaXN0IHRvIGRldGVybWluZSB0aGUgbGlzdCdzIFVSTFxyXG4gICAgICAgICAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdE5hbWU6ICQodGhpcykuYXR0cihcIkxpc3RcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiTGlzdFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXBMaXN0VXJsID0gJCh0aGlzKS5hdHRyKFwiV2ViRnVsbFVybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGhhbmRsZSB3aGVuIGxpc3QgaXMgaW4gdGhlIHJvb3Qgc2l0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cExpc3RVcmwgPSBsb29rdXBMaXN0VXJsICE9PSBjb25zdGFudHMuU0xBU0ggPyBsb29rdXBMaXN0VXJsICsgY29uc3RhbnRzLlNMQVNIIDogbG9va3VwTGlzdFVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBOZXdJdGVtIGZvcm0gZm9yIHRoZSBMb29rdXAgY29sdW1uJ3MgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1VybCA9IHV0aWxzLmdldExpc3RGb3JtVXJsKCQodGhpcykuYXR0cihcIkxpc3RcIiksIFwiTmV3Rm9ybVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTdG9wIGxvb2tpbmc7d2UncmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChsb29rdXBMaXN0VXJsLmxlbmd0aCA9PT0gMCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJsb29rdXBDb2x1bW46IFwiICsgb3B0Lmxvb2t1cENvbHVtbiwgXCJUaGlzIGNvbHVtbiBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgYSBsb29rdXAgY29sdW1uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdVcmwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCdWlsZCB0aGUgbGluayB0byB0aGUgTG9va3VwIGNvbHVtbidzIGxpc3QgZW5jbG9zZWQgaW4gYSBkaXYgd2l0aCB0aGUgaWQ9XCJTUExvb2t1cEFkZE5ld19cIiArIGxvb2t1cENvbHVtblN0YXRpY05hbWVcclxuICAgICAgICAgICAgdmFyIG5ld0hyZWYgPSBsb29rdXBMaXN0VXJsICsgbmV3VXJsO1xyXG4gICAgICAgICAgICAvLyBJZiByZXF1ZXN0ZWQsIG9wZW4gdGhlIGxpbmsgaW4gYSBuZXcgd2luZG93IGFuZCBpZiByZXF1ZXN0ZWQsIHBhc3MgdGhlIENvbnRlbnRUeXBlSURcclxuICAgICAgICAgICAgbmV3SHJlZiArPSBvcHQubmV3V2luZG93ID9cclxuICAgICAgICAgICAgKChvcHQuQ29udGVudFR5cGVJRC5sZW5ndGggPiAwKSA/IFwiP0NvbnRlbnRUeXBlSUQ9XCIgKyBvcHQuQ29udGVudFR5cGVJRCA6IFwiXCIpICsgXCInIHRhcmdldD0nX2JsYW5rJ1wiIDpcclxuICAgICAgICAgICAgXCI/XCIgKyAoKG9wdC5Db250ZW50VHlwZUlELmxlbmd0aCA+IDApID8gXCJDb250ZW50VHlwZUlEPVwiICsgb3B0LkNvbnRlbnRUeXBlSUQgKyBcIiZcIiA6IFwiXCIpICsgXCJTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIidcIjtcclxuICAgICAgICAgICAgdmFyIG5ld0xpbmsgPSBcIjxkaXYgaWQ9J1NQTG9va3VwQWRkTmV3X1wiICsgbG9va3VwQ29sdW1uU3RhdGljTmFtZSArIFwiJz5cIiArIFwiPGEgaHJlZj0nXCIgKyBuZXdIcmVmICsgXCI+XCIgKyBvcHQucHJvbXB0VGV4dC5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5sb29rdXBDb2x1bW4pICsgXCI8L2E+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgbGluayB0byB0aGUgTG9va3VwIGNvbHVtbnMncyBmb3JtYm9keSB0YWJsZSBjZWxsXHJcbiAgICAgICAgICAgICQobG9va3VwU2VsZWN0Lk9iaikucGFyZW50cyhcInRkLm1zLWZvcm1ib2R5XCIpLmFwcGVuZChuZXdMaW5rKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1Zykge1xyXG4gICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImxvb2t1cENvbHVtbjogXCIgKyBvcHQubG9va3VwQ29sdW1uLCBcIk5ld0Zvcm0gY2Fubm90IGJlIGZvdW5kXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHByZXNlbnQsIGNhbGwgY29tcGxldGVmdW5jIHdoZW4gYWxsIGVsc2UgaXMgZG9uZVxyXG4gICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQTG9va3VwQWRkTmV3XHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICRcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHJlZGlyZWN0IHRvIGEgYW5vdGhlciBwYWdlIGZyb20gYSBuZXcgaXRlbSBmb3JtIHdpdGggdGhlIG5ld1xyXG4gICAgLy8gaXRlbSdzIElELiBUaGlzIGFsbG93cyBjaGFpbmluZyBvZiBmb3JtcyBmcm9tIGl0ZW0gY3JlYXRpb24gb253YXJkLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQUmVkaXJlY3RXaXRoSUQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RVcmw6IFwiXCIsIC8vIFBhZ2UgZm9yIHRoZSByZWRpcmVjdFxyXG4gICAgICAgICAgICBxc1BhcmFtTmFtZTogXCJJRFwiIC8vIEluIHNvbWUgY2FzZXMsIHlvdSBtYXkgd2FudCB0byBwYXNzIHRoZSBuZXdseSBjcmVhdGVkIGl0ZW0ncyBJRCB3aXRoIGEgZGlmZmVyZW50XHJcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBuYW1lIHRoYW4gSUQuIFNwZWNpZnkgdGhhdCBuYW1lIGhlcmUsIGlmIG5lZWRlZC5cclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNMaXN0ID0gJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKTtcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWxzID0gJCgpLlNQU2VydmljZXMuU1BHZXRRdWVyeVN0cmluZygpO1xyXG4gICAgICAgIHZhciBsYXN0SUQgPSBxdWVyeVN0cmluZ1ZhbHMuSUQ7XHJcbiAgICAgICAgdmFyIFFTTGlzdCA9IHF1ZXJ5U3RyaW5nVmFscy5MaXN0O1xyXG4gICAgICAgIHZhciBRU1Jvb3RGb2xkZXIgPSBxdWVyeVN0cmluZ1ZhbHMuUm9vdEZvbGRlcjtcclxuICAgICAgICB2YXIgUVNDb250ZW50VHlwZUlkID0gcXVlcnlTdHJpbmdWYWxzLkNvbnRlbnRUeXBlSWQ7XHJcblxyXG4gICAgICAgIC8vIE9uIGZpcnN0IGxvYWQsIGNoYW5nZSB0aGUgZm9ybSBhY3Rpb25zIHRvIHJlZGlyZWN0IGJhY2sgdG8gdGhpcyBwYWdlIHdpdGggdGhlIGN1cnJlbnQgbGFzdElEIGZvciB0aGlzIHVzZXIgYW5kIHRoZVxyXG4gICAgICAgIC8vIG9yaWdpbmFsIFNvdXJjZS5cclxuICAgICAgICBpZiAodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5JRCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBsYXN0SUQgPSAkKCkuU1BTZXJ2aWNlcy5TUEdldExhc3RJdGVtSWQoe1xyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IHRoaXNMaXN0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiZm9ybVtpZD0nYXNwbmV0Rm9ybSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBwYWdlLi4uXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc1VybCA9IChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpID4gMCkgPyBsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCBsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpKSA6IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAvLyAuLi4gcGx1cyB0aGUgU291cmNlIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNTb3VyY2UgPSAodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5Tb3VyY2UgPT09IFwic3RyaW5nXCIpID9cclxuICAgICAgICAgICAgICAgIFwiU291cmNlPVwiICsgcXVlcnlTdHJpbmdWYWxzLlNvdXJjZS5yZXBsYWNlKC9cXC8vZywgXCIlMmZcIikucmVwbGFjZSgvOi9nLCBcIiUzYVwiKSA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1FTID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFFTTGlzdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1FTLnB1c2goXCJMaXN0PVwiICsgUVNMaXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgUVNSb290Rm9sZGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UVMucHVzaChcIlJvb3RGb2xkZXI9XCIgKyBRU1Jvb3RGb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBRU0NvbnRlbnRUeXBlSWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdRUy5wdXNoKFwiQ29udGVudFR5cGVJZD1cIiArIFFTQ29udGVudFR5cGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0FjdGlvbiA9IHRoaXNVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICgobmV3UVMubGVuZ3RoID4gMCkgPyAoXCI/XCIgKyBuZXdRUy5qb2luKFwiJlwiKSArIFwiJlwiKSA6IFwiP1wiKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgU291cmNlIHRvIHBvaW50IGJhY2sgdG8gdGhpcyBwYWdlIHdpdGggdGhlIGxhc3RJRCB0aGlzIHVzZXIgaGFzIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgXCJTb3VyY2U9XCIgKyB0aGlzVXJsICtcclxuICAgICAgICAgICAgICAgICAgICBcIj9JRD1cIiArIGxhc3RJRCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIG9yaWdpbmFsIHNvdXJjZSBhcyBSZWFsU291cmNlLCBpZiBwcmVzZW50XHJcbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzU291cmNlLmxlbmd0aCA+IDApID8gKFwiJTI2UmVhbFNvdXJjZT1cIiArIHF1ZXJ5U3RyaW5nVmFscy5Tb3VyY2UpIDogXCJcIikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBvdmVycmlkZSBSZWRpcmVjdFVSTCwgaWYgcHJlc2VudFxyXG4gICAgICAgICAgICAgICAgICAgICgodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5SZWRpcmVjdFVSTCA9PT0gXCJzdHJpbmdcIikgPyAoXCIlMjZSZWRpcmVjdFVSTD1cIiArIHF1ZXJ5U3RyaW5nVmFscy5SZWRpcmVjdFVSTCkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBmb3JtIGFjdGlvblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5mb3Jtcy5hc3BuZXRGb3JtLmFjdGlvbiA9IG5ld0FjdGlvbjtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbG9hZCBhZnRlciB0aGUgaXRlbSBpcyBzYXZlZCwgd2FpdCB1bnRpbCB0aGUgbmV3IGl0ZW0gaGFzIGJlZW4gc2F2ZWQgKGNvbW1pdHMgYXJlIGFzeW5jaHJvbm91cyksXHJcbiAgICAgICAgICAgIC8vIHRoZW4gZG8gdGhlIHJlZGlyZWN0IHRvIHJlZGlyZWN0VXJsIHdpdGggdGhlIG5ldyBsYXN0SUQsIHBhc3NpbmcgYWxvbmcgdGhlIG9yaWdpbmFsIFNvdXJjZS5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAocXVlcnlTdHJpbmdWYWxzLklEID09PSBsYXN0SUQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RJRCA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0TGFzdEl0ZW1JZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdE5hbWU6IHRoaXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIFJlZGlyZWN0VVJMIHBhcmFtZXRlciBvbiB0aGUgUXVlcnkgU3RyaW5nLCB0aGVuIHJlZGlyZWN0IHRoZXJlIGluc3RlYWQgb2YgdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIC8vIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9ucyAob3B0LnJlZGlyZWN0VXJsKVxyXG4gICAgICAgICAgICB2YXIgdGhpc1JlZGlyZWN0VXJsID0gKHR5cGVvZiBxdWVyeVN0cmluZ1ZhbHMuUmVkaXJlY3RVUkwgPT09IFwic3RyaW5nXCIpID8gcXVlcnlTdHJpbmdWYWxzLlJlZGlyZWN0VVJMIDogb3B0LnJlZGlyZWN0VXJsO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdGhpc1JlZGlyZWN0VXJsICsgXCI/XCIgKyBvcHQucXNQYXJhbU5hbWUgKyBcIj1cIiArIGxhc3RJRCArXHJcbiAgICAgICAgICAgICAgICAoKHR5cGVvZiBxdWVyeVN0cmluZ1ZhbHMuUmVhbFNvdXJjZSA9PT0gXCJzdHJpbmdcIikgPyAoXCImU291cmNlPVwiICsgcXVlcnlTdHJpbmdWYWxzLlJlYWxTb3VyY2UpIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUFJlZGlyZWN0V2l0aElEXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB3aGljaCBjaGVja3MgdG8gc2VlIGlmIHRoZSB2YWx1ZSBmb3IgYSBjb2x1bW4gb24gdGhlIGZvcm0gaXMgdW5pcXVlIGluIHRoZSBsaXN0LlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQUmVxdWlyZVVuaXF1ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBjb2x1bW5TdGF0aWNOYW1lOiBcIlRpdGxlXCIsIC8vIE5hbWUgb2YgdGhlIGNvbHVtblxyXG4gICAgICAgICAgICBkdXBsaWNhdGVBY3Rpb246IDAsIC8vIDAgPSB3YXJuLCAxID0gcHJldmVudFxyXG4gICAgICAgICAgICBpZ25vcmVDYXNlOiBmYWxzZSwgLy8gSWYgc2V0IHRvIHRydWUsIHRoZSBmdW5jdGlvbiBpZ25vcmVzIGNhc2UsIGlmIGZhbHNlIGl0IGxvb2tzIGZvciBhbiBleGFjdCBtYXRjaFxyXG4gICAgICAgICAgICBpbml0TXNnOiBcIlRoaXMgdmFsdWUgbXVzdCBiZSB1bmlxdWUuXCIsIC8vIEluaXRpYWwgbWVzc2FnZSB0byBkaXNwbGF5IGFmdGVyIHNldHVwXHJcbiAgICAgICAgICAgIGluaXRNc2dDU1NDbGFzczogXCJtcy12YlwiLCAvLyBDU1MgY2xhc3MgZm9yIGluaXRpYWwgbWVzc2FnZVxyXG4gICAgICAgICAgICBlcnJNc2c6IFwiVGhpcyB2YWx1ZSBpcyBub3QgdW5pcXVlLlwiLCAvLyBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgaWYgbm90IHVuaXF1ZVxyXG4gICAgICAgICAgICBlcnJNc2dDU1NDbGFzczogXCJtcy1mb3JtdmFsaWRhdGlvblwiLCAvLyBDU1MgY2xhc3MgZm9yIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgc2hvd0R1cGVzOiBmYWxzZSwgLy8gSWYgdHJ1ZSwgc2hvdyBsaW5rcyB0byB0aGUgZHVwbGljYXRlIGl0ZW0ocykgYWZ0ZXIgdGhlIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBudWxsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGl0ZW0ncyBJRCBmcm9tIHRoZSBRdWVyeSBTdHJpbmdcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWxzID0gJCgpLlNQU2VydmljZXMuU1BHZXRRdWVyeVN0cmluZygpO1xyXG4gICAgICAgIHZhciB0aGlzSUQgPSBxdWVyeVN0cmluZ1ZhbHMuSUQ7XHJcbiAgICAgICAgdmFyIHRoaXNMaXN0ID0gJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBtZXNzYWdlcyBiYXNlZCBvbiB0aGUgb3B0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBtc2cgPSBcIjxzcGFuIGlkPSdTUFJlcXVpcmVVbmlxdWVcIiArIG9wdC5jb2x1bW5TdGF0aWNOYW1lICsgXCInIGNsYXNzPSd7MH0nPnsxfTwvc3Bhbj48YnIvPlwiO1xyXG4gICAgICAgIHZhciBmaXJzdE1zZyA9IG1zZy5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5pbml0TXNnQ1NTQ2xhc3MpLnJlcGxhY2UoL1xcezFcXH0vZywgb3B0LmluaXRNc2cpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRoZSBEaXNwbGF5TmFtZVxyXG4gICAgICAgIHZhciBjb2x1bW5EaXNwbGF5TmFtZSA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0RGlzcGxheUZyb21TdGF0aWMoe1xyXG4gICAgICAgICAgICBsaXN0TmFtZTogdGhpc0xpc3QsXHJcbiAgICAgICAgICAgIGNvbHVtblN0YXRpY05hbWU6IG9wdC5jb2x1bW5TdGF0aWNOYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGNvbHVtbk9iaiA9IHV0aWxzLmZpbmRGb3JtRmllbGQoY29sdW1uRGlzcGxheU5hbWUpLmZpbmQoXCJpbnB1dFtUaXRsZV49J1wiICsgY29sdW1uRGlzcGxheU5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIGNvbHVtbk9iai5wYXJlbnQoKS5hcHBlbmQoZmlyc3RNc2cpO1xyXG5cclxuICAgICAgICBjb2x1bW5PYmouYmx1cihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5WYWx1ZUlEcyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGNvbHVtbkRpc3BsYXlOYW1lJ3MgdmFsdWVcclxuICAgICAgICAgICAgdmFyIGNvbHVtblZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBMaXN0cyBXZWIgU2VydmljZSAoR2V0TGlzdEl0ZW1zKSB0byBzZWUgaWYgdGhlIHZhbHVlIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGxpc3ROYW1lOiB0aGlzTGlzdCxcclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBnZXQgYWxsIHRoZSBpdGVtcywgaWdub3JpbmcgYW55IGZpbHRlcnMgb24gdGhlIGRlZmF1bHQgdmlldy5cclxuICAgICAgICAgICAgICAgIENBTUxRdWVyeTogXCI8UXVlcnk+PFdoZXJlPjxJc05vdE51bGw+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUgKyBcIicvPjwvSXNOb3ROdWxsPjwvV2hlcmU+PC9RdWVyeT5cIixcclxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiBjb2x1bW5TdGF0aWNOYW1lJ3MgdmFsdWVcclxuICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdJRCcgLz48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZSArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHZpZXcgcm93bGltaXQgYW5kIGdldCBhbGwgYXBwcm9wcmlhdGUgcm93c1xyXG4gICAgICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdFZhbHVlID0gb3B0Lmlnbm9yZUNhc2UgPyBjb2x1bW5WYWx1ZS50b1VwcGVyQ2FzZSgpIDogY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuU1BGaWx0ZXJOb2RlKFwiejpyb3dcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVmFsdWUgPSBvcHQuaWdub3JlQ2FzZSA/ICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5jb2x1bW5TdGF0aWNOYW1lKS50b1VwcGVyQ2FzZSgpIDogJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIHZhbHVlIGFscmVhZHkgZXhpc3RzIGluIGNvbHVtblN0YXRpY05hbWUgYW5kIGl0J3Mgbm90IHRoZSBjdXJyZW50IGl0ZW0sIHRoZW4gc2F2ZSB0aGUgSUQgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGVzdFZhbHVlID09PSB0aGlzVmFsdWUpICYmICgkKHRoaXMpLmF0dHIoXCJvd3NfSURcIikgIT09IHRoaXNJRCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlSURzLnB1c2goWyQodGhpcykuYXR0cihcIm93c19JRFwiKSwgJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBuZXdNc2cgPSBvcHQuaW5pdE1zZztcclxuICAgICAgICAgICAgdmFyIG1zZ0NvbnRhaW5lciA9ICQoXCIjU1BSZXF1aXJlVW5pcXVlXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZSk7XHJcbiAgICAgICAgICAgIG1zZ0NvbnRhaW5lci5odG1sKG5ld01zZykuYXR0cihcImNsYXNzXCIsIG9wdC5pbml0TXNnQ1NTQ2xhc3MpO1xyXG5cclxuICAgICAgICAgICAgJChcImlucHV0W3ZhbHVlPSdPSyddOmRpc2FibGVkLCBpbnB1dFt2YWx1ZT0nU2F2ZSddOmRpc2FibGVkXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlSURzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld01zZyA9IG9wdC5lcnJNc2c7XHJcbiAgICAgICAgICAgICAgICBtc2dDb250YWluZXIuaHRtbChuZXdNc2cpLmF0dHIoXCJjbGFzc1wiLCBvcHQuZXJyTXNnQ1NTQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5kdXBsaWNhdGVBY3Rpb24gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5PYmouZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbdmFsdWU9J09LJ10sIGlucHV0W3ZhbHVlPSdTYXZlJ11cIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LnNob3dEdXBlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdXQgPSBcIiBcIiArIGNvbHVtblZhbHVlSURzLmxlbmd0aCArIFwiIGR1cGxpY2F0ZSBpdGVtXCIgKyAoY29sdW1uVmFsdWVJRHMubGVuZ3RoID4gMSA/IFwic1wiIDogXCJcIikgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5WYWx1ZUlEcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8YSBocmVmPSdEaXNwRm9ybS5hc3B4P0lEPVwiICsgY29sdW1uVmFsdWVJRHNbaV1bMF0gKyBcIiZTb3VyY2U9XCIgKyBsb2NhdGlvbi5ocmVmICsgXCInPlwiICsgY29sdW1uVmFsdWVJRHNbaV1bMV0gKyBcIjwvYT4gXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQoXCJzcGFuI1NQUmVxdWlyZVVuaXF1ZVwiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpLmFwcGVuZChvdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIElmIHByZXNlbnQsIGNhbGwgY29tcGxldGVmdW5jIHdoZW4gYWxsIGVsc2UgaXMgZG9uZVxyXG4gICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQUmVxdWlyZVVuaXF1ZVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIERvZXMgYW4gYXVkaXQgb2YgYSBzaXRlJ3MgbGlzdCBmb3JtcyB0byBzaG93IHdoZXJlIHNjcmlwdCBpcyBpbiB1c2UuXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BTY3JpcHRBdWRpdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIFdlYiAoc2l0ZSkgdG8gYXVkaXRcclxuICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgYSBzcGVjaWZpYyBsaXN0IHRvIGF1ZGl0LiBJZiBub3QgcHJlc2VudCwgYWxsIGxpc3RzIGluIHRoZSBzaXRlIGFyZSBhdWRpdGVkLlxyXG4gICAgICAgICAgICBvdXRwdXRJZDogXCJcIiwgLy8gVGhlIGlkIG9mIHRoZSBET00gb2JqZWN0IGZvciBvdXRwdXRcclxuICAgICAgICAgICAgYXVkaXRGb3JtczogdHJ1ZSwgLy8gQXVkaXQgdGhlIGZvcm0gcGFnZXNcclxuICAgICAgICAgICAgYXVkaXRWaWV3czogdHJ1ZSwgLy8gQXVkaXQgdGhlIHZpZXcgcGFnZXNcclxuICAgICAgICAgICAgYXVkaXRQYWdlczogdHJ1ZSwgLy8gQXVkaXQgdGhlIFBhZ2VzIERvY3VtZW50IExpYnJhcnlcclxuICAgICAgICAgICAgYXVkaXRQYWdlc0xpc3ROYW1lOiBcIlBhZ2VzXCIsIC8vIFRoZSBQYWdlcyBEb2N1bWVudCBMaWJyYXJ5KGllcyksIGlmIGRlc2lyZWQuIEVpdGhlciBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cclxuICAgICAgICAgICAgc2hvd0hpZGRlbkxpc3RzOiBmYWxzZSwgLy8gU2hvdyBvdXRwdXQgZm9yIGhpZGRlbiBsaXN0c1xyXG4gICAgICAgICAgICBzaG93Tm9TY3JpcHQ6IGZhbHNlLCAvLyBTaG93IG91dHB1dCBmb3IgbGlzdHMgd2l0aCBubyBzY3JpcHRzIChlZmZlY3RpdmVseSBcInZlcmJvc2VcIilcclxuICAgICAgICAgICAgc2hvd1NyYzogdHJ1ZSAvLyBTaG93IHRoZSBzb3VyY2UgbG9jYXRpb24gZm9yIGluY2x1ZGVkIHNjcmlwdHNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1UeXBlcyA9IFtcclxuICAgICAgICAgICAgW1wiTmV3XCIsIFwiTmV3Rm9ybS5hc3B4XCIsIGZhbHNlXSxcclxuICAgICAgICAgICAgW1wiRGlzcGxheVwiLCBcIkRpc3BGb3JtLmFzcHhcIiwgZmFsc2VdLFxyXG4gICAgICAgICAgICBbXCJFZGl0XCIsIFwiRWRpdEZvcm0uYXNweFwiLCBmYWxzZV1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHZhciBsaXN0WG1sO1xyXG5cclxuICAgICAgICAvLyBCdWlsZCB0aGUgdGFibGUgdG8gY29udGFpbiB0aGUgcmVzdWx0c1xyXG4gICAgICAgICQoXCIjXCIgKyBvcHQub3V0cHV0SWQpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCI8dGFibGUgaWQ9J1NQU2NyaXB0QXVkaXQnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnIGJvcmRlcj0wIGNlbGxTcGFjaW5nPTAgY2VsbFBhZGRpbmc9MT5cIiArXHJcbiAgICAgICAgICAgIFwiPHRyPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+PC90aD5cIiArXHJcbiAgICAgICAgICAgIFwiPHRoPkxpc3Q8L3RoPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+UGFnZSBDbGFzczwvdGg+XCIgK1xyXG4gICAgICAgICAgICBcIjx0aD5QYWdlIFR5cGU8L3RoPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+UGFnZTwvdGg+XCIgK1xyXG4gICAgICAgICAgICAob3B0LnNob3dTcmMgPyBcIjx0aD5TY3JpcHQgUmVmZXJlbmNlczwvdGg+XCIgOiBcIlwiKSArXHJcbiAgICAgICAgICAgIFwiPC90cj5cIiArXHJcbiAgICAgICAgICAgIFwiPC90YWJsZT5cIik7XHJcbiAgICAgICAgLy8gQXBwbHkgdGhlIENTUyBjbGFzcyB0byB0aGUgaGVhZGVyc1xyXG4gICAgICAgIHZhciBzY3JpcHRBdWRpdENvbnRhaW5lciA9ICQoXCIjU1BTY3JpcHRBdWRpdFwiKTtcclxuICAgICAgICBzY3JpcHRBdWRpdENvbnRhaW5lci5maW5kKFwidGhcIikuYXR0cihcImNsYXNzXCIsIFwibXMtdmgyLW5vZmlsdGVyXCIpO1xyXG5cclxuICAgICAgICAvLyBEb24ndCBib3RoZXIgd2l0aCB0aGUgbGlzdHMgaWYgdGhlIG9wdGlvbnMgZG9uJ3QgcmVxdWlyZSB0aGVtXHJcbiAgICAgICAgaWYgKG9wdC5hdWRpdEZvcm1zIHx8IG9wdC5hdWRpdFZpZXdzKSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0LCBnZXQgYWxsIG9mIHRoZSBsaXN0cyB3aXRoaW4gdGhlIHNpdGVcclxuICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RDb2xsZWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkxpc3RcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RYbWwgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgbGlzdE5hbWUgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGVuIG9ubHkgcmV0dXJuIHJlc3VsdHMgZm9yIHRoYXQgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG9wdC5saXN0TmFtZS5sZW5ndGggPT09IDApIHx8IChsaXN0WG1sLmF0dHIoXCJUaXRsZVwiKSA9PT0gb3B0Lmxpc3ROYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3Qgd29yayB3aXRoIGhpZGRlbiBsaXN0cyB1bmxlc3Mgd2UncmUgYXNrZWQgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgob3B0LnNob3dIaWRkZW5MaXN0cyAmJiBsaXN0WG1sLmF0dHIoXCJIaWRkZW5cIikgPT09IFwiRmFsc2VcIikgfHwgIW9wdC5zaG93SGlkZGVuTGlzdHMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXVkaXQgdGhlIGxpc3QncyBmb3Jtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQuYXVkaXRGb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGxpc3QncyBDb250ZW50IFR5cGVzLCB0aGVyZWZvcmUgdGhlIGZvcm0gcGFnZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RDb250ZW50VHlwZXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0WG1sLmF0dHIoXCJJRFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSwgLy8gTmVlZCB0aGlzIHRvIGJlIHN5bmNocm9ub3VzIHNvIHdlJ3JlIGFzc3VyZWQgb2YgYSB2YWxpZCB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiQ29udGVudFR5cGVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGRlYWwgd2l0aCBmb2xkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJJRFwiKS5zdWJzdHJpbmcoMCwgNikgIT09IFwiMHgwMTIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtVXJscyA9ICQodGhpcykuZmluZChcIkZvcm1VcmxzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3JtVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMb29rIGZvciBhIGN1c3RvbWl6ZWQgZm9ybS4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZm9ybVVybHMpLmZpbmQoZm9ybVR5cGVzW2ldWzBdKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIkZvcm1cIiwgdGhpcy5ub2RlTmFtZSwgKChvcHQud2ViVVJMLmxlbmd0aCA+IDApID8gb3B0LndlYlVSTCA6ICQoKS5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFNpdGUoKSkgKyBjb25zdGFudHMuU0xBU0ggKyAkKHRoaXMpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1UeXBlc1tpXVsyXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLi4uZWxzZSB0aGUgdW5jdXN0b21pemVkIGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcm1UeXBlc1tpXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZpZXdVcmwgPSBsaXN0WG1sLmF0dHIoXCJEZWZhdWx0Vmlld1VybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIkZvcm1cIiwgZm9ybVR5cGVzW2ldWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZpZXdVcmwuc3Vic3RyaW5nKDAsIGRlZmF1bHRWaWV3VXJsLmxhc3RJbmRleE9mKGNvbnN0YW50cy5TTEFTSCkgKyAxKSArIGZvcm1UeXBlc1tpXVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIGZvcm0gdHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBmb3JtVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtVHlwZXNbaV1bMl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1ZGl0IHRoZSBsaXN0J3Mgdmlld3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LmF1ZGl0Vmlld3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsaXN0J3MgVmlld3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldFZpZXdDb2xsZWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0TmFtZTogbGlzdFhtbC5hdHRyKFwiSURcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIlZpZXdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNQU2NyaXB0QXVkaXRQYWdlKG9wdCwgbGlzdFhtbCwgXCJWaWV3XCIsICQodGhpcykuYXR0cihcIkRpc3BsYXlOYW1lXCIpLCAkKHRoaXMpLmF0dHIoXCJVcmxcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHdpdGggYXVkaXRpbmcgcGFnZXMgaWYgdGhlIG9wdGlvbnMgZG9uJ3QgcmVxdWlyZSBpdFxyXG4gICAgICAgIHZhciBudW1MaXN0cyA9IDA7XHJcbiAgICAgICAgdmFyIGxpc3RzQXJyYXkgPSBbXTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdC5hdWRpdFBhZ2VzTGlzdE5hbWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgbnVtTGlzdHMgPSAxO1xyXG4gICAgICAgICAgICBsaXN0c0FycmF5LnB1c2gob3B0LmF1ZGl0UGFnZXNMaXN0TmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbnVtTGlzdHMgPSBvcHQuYXVkaXRQYWdlc0xpc3ROYW1lLmxlbmd0aDtcclxuICAgICAgICAgICAgbGlzdHNBcnJheSA9IG9wdC5hdWRpdFBhZ2VzTGlzdE5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0LmF1ZGl0UGFnZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1MaXN0czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0c0FycmF5W2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJMaXN0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFhtbCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBvZiB0aGUgaXRlbXMgZnJvbSB0aGUgRG9jdW1lbnQgTGlicmFyeVxyXG4gICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0c0FycmF5W2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxRdWVyeTogXCI8UXVlcnk+PFdoZXJlPjxOZXE+PEZpZWxkUmVmIE5hbWU9J0NvbnRlbnRUeXBlJy8+PFZhbHVlIFR5cGU9J1RleHQnPkZvbGRlcjwvVmFsdWU+PC9OZXE+PC9XaGVyZT48L1F1ZXJ5PlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdUaXRsZScvPjxGaWVsZFJlZiBOYW1lPSdGaWxlUmVmJy8+PC9WaWV3RmllbGRzPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxSb3dMaW1pdDogMCxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFnZVVybCA9ICQodGhpcykuYXR0cihcIm93c19GaWxlUmVmXCIpLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVGl0bGUgPSAkKHRoaXMpLmF0dHIoXCJvd3NfVGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1BhZ2VUeXBlID0gKHR5cGVvZiB0aGlzVGl0bGUgIT09IFwidW5kZWZpbmVkXCIpID8gdGhpc1RpdGxlIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzUGFnZVVybC5pbmRleE9mKFwiLmFzcHhcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIlBhZ2VcIiwgdGhpc1BhZ2VUeXBlLCBjb25zdGFudHMuU0xBU0ggKyB0aGlzUGFnZVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlbW92ZSBwcm9ncmVzcyBpbmRpY2F0b3IgYW5kIG1ha2UgdGhlIG91dHB1dCBwcmV0dHkgYnkgY2xlYW5pbmcgdXAgdGhlIG1zLWFsdGVybmF0aW5nIENTUyBjbGFzc1xyXG4gICAgICAgIHNjcmlwdEF1ZGl0Q29udGFpbmVyLmZpbmQoXCJ0cltjbGFzcz0nbXMtYWx0ZXJuYXRpbmcnXTpldmVuXCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BTY3JpcHRBdWRpdFxyXG5cclxuICAgIC8vIERpc3BsYXlzIHRoZSB1c2FnZSBvZiBzY3JpcHRzIGluIGEgc2l0ZVxyXG4gICAgZnVuY3Rpb24gU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBwYWdlQ2xhc3MsIHBhZ2VUeXBlLCBwYWdlVXJsKSB7XHJcblxyXG4gICAgICAgIHZhciBqUXVlcnlQYWdlID0gMDtcclxuICAgICAgICB2YXIgcGFnZVNjcmlwdFNyYyA9IHt9O1xyXG4gICAgICAgIHBhZ2VTY3JpcHRTcmMudHlwZSA9IFtdO1xyXG4gICAgICAgIHBhZ2VTY3JpcHRTcmMuc3JjID0gW107XHJcbiAgICAgICAgcGFnZVNjcmlwdFNyYy5zY3JpcHQgPSBbXTtcclxuICAgICAgICB2YXIgc2NyaXB0UmVnZXggPSBSZWdFeHAoXCI8c2NyaXB0W1xcXFxzXFxcXFNdKj8vc2NyaXB0PlwiLCBcImdpXCIpO1xyXG5cclxuICAgICAgICAvLyBGZXRjaCB0aGUgcGFnZVxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIHVybDogcGFnZVVybCxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzY3JpcHRNYXRjaDtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc2NyaXB0TWF0Y2ggPSBzY3JpcHRSZWdleC5leGVjKHhEYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRMYW5ndWFnZSA9IGdldFNjcmlwdEF0dHJpYnV0ZShzY3JpcHRNYXRjaCwgXCJsYW5ndWFnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0VHlwZSA9IGdldFNjcmlwdEF0dHJpYnV0ZShzY3JpcHRNYXRjaCwgXCJ0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRTcmMgPSBnZXRTY3JpcHRBdHRyaWJ1dGUoc2NyaXB0TWF0Y2gsIFwic3JjXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHRTcmMgIT09IG51bGwgJiYgc2NyaXB0U3JjLmxlbmd0aCA+IDAgJiYgIWNvcmVTY3JpcHQoc2NyaXB0U3JjKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2NyaXB0U3JjLnR5cGUucHVzaCgoc2NyaXB0TGFuZ3VhZ2UgIT09IG51bGwgJiYgc2NyaXB0TGFuZ3VhZ2UubGVuZ3RoID4gMCkgPyBzY3JpcHRMYW5ndWFnZSA6IHNjcmlwdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2NyaXB0U3JjLnNyYy5wdXNoKHNjcmlwdFNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeVBhZ2UrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT25seSBzaG93IHBhZ2VzIHdpdGhvdXQgc2NyaXB0IGlmIHdlJ3ZlIGJlZW4gYXNrZWQgdG8gZG8gc28uXHJcbiAgICAgICAgICAgICAgICBpZiAoKCFvcHQuc2hvd05vU2NyaXB0ICYmIChwYWdlU2NyaXB0U3JjLnR5cGUubGVuZ3RoID4gMCkpIHx8IG9wdC5zaG93Tm9TY3JpcHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZVBhdGggPSBwYWdlVXJsLnN1YnN0cmluZygwLCBwYWdlVXJsLmxhc3RJbmRleE9mKGNvbnN0YW50cy5TTEFTSCkgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0ID0gXCI8dHIgY2xhc3M9bXMtYWx0ZXJuYXRpbmc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12Yi1pY29uPjxhIGhyZWY9J1wiICsgbGlzdFhtbC5hdHRyKFwiRGVmYXVsdFZpZXdVcmxcIikgKyBcIic+PElNRyBib3JkZXI9MCBzcmM9J1wiICsgbGlzdFhtbC5hdHRyKFwiSW1hZ2VVcmxcIikgKyBcIid3aWR0aD0xNiBoZWlnaHQ9MTY+PC9BPjwvVEQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+PGEgaHJlZj0nXCIgKyBsaXN0WG1sLmF0dHIoXCJEZWZhdWx0Vmlld1VybFwiKSArIFwiJz5cIiArIGxpc3RYbWwuYXR0cihcIlRpdGxlXCIpICsgKChsaXN0WG1sLmF0dHIoXCJIaWRkZW5cIikgPT09IFwiVHJ1ZVwiKSA/ICcoSGlkZGVuKScgOiAnJykgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+XCIgKyBwYWdlQ2xhc3MgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+XCIgKyBwYWdlVHlwZSArIFwiPC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHRkIGNsYXNzPW1zLXZiMj48YSBocmVmPSdcIiArIHBhZ2VVcmwgKyBcIic+XCIgKyB1dGlscy5maWxlTmFtZShwYWdlVXJsKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnNob3dTcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNTcmNQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7JyBib3JkZXI9MCBjZWxsU3BhY2luZz0wIGNlbGxQYWRkaW5nPTE+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZVNjcmlwdFNyYy50eXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU3JjUGF0aCA9IChwYWdlU2NyaXB0U3JjLnNyY1tpXS5zdWJzdHIoMCwgMSkgIT09IGNvbnN0YW50cy5TTEFTSCkgPyBwYWdlUGF0aCArIHBhZ2VTY3JpcHRTcmMuc3JjW2ldIDogcGFnZVNjcmlwdFNyYy5zcmNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8dHI+PHRkIGNsYXNzPW1zLXZiMiB3aWR0aD0nMzAlJz5cIiArIHBhZ2VTY3JpcHRTcmMudHlwZVtpXSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBcIjx0ZCBjbGFzcz1tcy12YjIgd2lkdGg9JzcwJSc+PGEgaHJlZj0nXCIgKyB0aGlzU3JjUGF0aCArIFwiJz5cIiArIHV0aWxzLmZpbGVOYW1lKHBhZ2VTY3JpcHRTcmMuc3JjW2ldKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBcIjwvdGFibGU+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNTUFNjcmlwdEF1ZGl0XCIpLmFwcGVuZChvdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IC8vIEVuZCBvZiBmdW5jdGlvbiBTUFNjcmlwdEF1ZGl0UGFnZVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFNjcmlwdEF0dHJpYnV0ZShzb3VyY2UsIGF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHZhciBtYXRjaGVzO1xyXG4gICAgICAgIHZhciByZWdleCA9IFJlZ0V4cChhdHRyaWJ1dGUgKyBcIj0oXFxcIihbXlxcXCJdKilcXFwiKXwoJyhbXiddKiknKVwiLCBcImdpXCIpO1xyXG4gICAgICAgIGlmIChtYXRjaGVzID0gcmVnZXguZXhlYyhzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gLy8gRW5kIG9mIGZ1bmN0aW9uIGdldFNjcmlwdEF0dHJpYnV0ZVxyXG5cclxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgc2NyaXB0IHJlZmVyZW5jZSBpcyBwYXJ0IG9mIFNoYXJlUG9pbnQgY29yZSBzbyB0aGF0IHdlIGNhbiBpZ25vcmUgaXRcclxuICAgIGZ1bmN0aW9uIGNvcmVTY3JpcHQoc3JjKSB7XHJcbiAgICAgICAgdmFyIGNvcmVTY3JpcHRMb2NhdGlvbnMgPSBbXCJXZWJSZXNvdXJjZS5heGRcIiwgXCJfbGF5b3V0c1wiXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcmVTY3JpcHRMb2NhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNyYy5pbmRleE9mKGNvcmVTY3JpcHRMb2NhdGlvbnNbaV0pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gLy8gRW5kIG9mIGZ1bmN0aW9uIGNvcmVTY3JpcHRcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgXCIuLi91dGlscy9jb25zdGFudHNcIixcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBUaGUgU1BTZXRNdWx0aVNlbGVjdFNpemVzIGZ1bmN0aW9uIHNldHMgdGhlIHNpemVzIG9mIHRoZSBtdWx0aS1zZWxlY3QgYm94ZXMgZm9yIGEgY29sdW1uIG9uIGEgZm9ybSBhdXRvbWFnaWNhbGx5XHJcbiAgICAvLyBiYXNlZCBvbiB0aGUgdmFsdWVzIHRoZXkgY29udGFpbi4gVGhlIGZ1bmN0aW9uIHRha2VzIGludG8gYWNjb3VudCB0aGUgZm9udFNpemUsIGZvbnRGYW1pbHksIGZvbnRXZWlnaHQsIGV0Yy4sIGluIGl0cyBhbGdvcml0aG0uXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BTZXRNdWx0aVNlbGVjdFNpemVzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiAkKCkuU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybCgpLCAvLyBUaGUgbGlzdCB0aGUgZm9ybSBpcyB3b3JraW5nIHdpdGguIFRoaXMgaXMgdXNlZnVsIGlmIHRoZSBmb3JtIGlzIG5vdCBpbiB0aGUgbGlzdCBjb250ZXh0LlxyXG4gICAgICAgICAgICBtdWx0aVNlbGVjdENvbHVtbjogXCJcIixcclxuICAgICAgICAgICAgbWluV2lkdGg6IDAsXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiAwLFxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2VcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNGdW5jdGlvbiA9IFwiU1BTZXJ2aWNlcy5TUFNldE11bHRpU2VsZWN0U2l6ZXNcIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgbXVsdGktc2VsZWN0IGNvbHVtblxyXG4gICAgICAgIHZhciB0aGlzTXVsdGlTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG9wdC5tdWx0aVNlbGVjdENvbHVtblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzTXVsdGlTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJtdWx0aVNlbGVjdENvbHVtbjogXCIgKyBvcHQubXVsdGlTZWxlY3RDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXNNdWx0aVNlbGVjdC5UeXBlICE9PSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0ICYmIG9wdC5kZWJ1Zykge1xyXG4gICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcIm11bHRpU2VsZWN0Q29sdW1uOiBcIiArIG9wdC5tdWx0aVNlbGVjdENvbHVtbiwgXCJDb2x1bW4gaXMgbm90IG11bHRpLXNlbGVjdC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHRlbXBvcmFyeSBjbG9uZSBvZiB0aGUgc2VsZWN0IHRvIHVzZSB0byBkZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIHdpZHRoIHNldHRpbmdzLlxyXG4gICAgICAgIC8vIFdlJ2xsIGFwcGVuZCBpdCB0byB0aGUgZW5kIG9mIHRoZSBlbmNsb3Npbmcgc3Bhbi5cclxuICAgICAgICB2YXIgY2xvbmVJZCA9IHV0aWxzLmdlbkNvbnRhaW5lcklkKFwiU1BTZXRNdWx0aVNlbGVjdFNpemVzXCIsIG9wdC5tdWx0aVNlbGVjdENvbHVtbiwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICB2YXIgY2xvbmVPYmogPSAkKFwiPHNlbGVjdCBpZD0nXCIgKyBjbG9uZUlkICsgXCInID48L3NlbGVjdD5cIikuYXBwZW5kVG8odGhpc011bHRpU2VsZWN0LmNvbnRhaW5lcik7XHJcbiAgICAgICAgY2xvbmVPYmouY3NzKHtcclxuICAgICAgICAgICAgXCJ3aWR0aFwiOiBcImF1dG9cIiwgLy8gV2Ugd2FudCB0aGUgY2xvbmUgdG8gcmVzaXplIGl0cyB3aWR0aCBiYXNlZCBvbiB0aGUgY29udGVudHNcclxuICAgICAgICAgICAgXCJoZWlnaHRcIjogMCwgLy8gSnVzdCB0byBrZWVwIHRoZSBwYWdlIGNsZWFuIHdoaWxlIHdlIGFyZSB1c2luZyB0aGUgY2xvbmVcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCIgLy8gQW5kIGxldCdzIGtlZXAgaXQgaGlkZGVuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbGwgdGhlIHZhbHVlcyB0byB0aGUgY2xvbmVkIHNlbGVjdC4gIEZpcnN0IHRoZSBsZWZ0IChwb3NzaWJsZSB2YWx1ZXMpIHNlbGVjdC4uLlxyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbG9uZU9iai5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArICQodGhpcykuaHRtbCgpICsgXCInPlwiICsgJCh0aGlzKS5odG1sKCkgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyAuLi50aGVuIHRoZSByaWdodCAoc2VsZWN0ZWQgdmFsdWVzKSBzZWxlY3QgKGluIGNhc2Ugc29tZSB2YWx1ZXMgaGF2ZSBhbHJlYWR5IGJlZW4gc2VsZWN0ZWQpXHJcbiAgICAgICAgJCh0aGlzTXVsdGlTZWxlY3QubWFzdGVyLnJlc3VsdENvbnRyb2wpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsb25lT2JqLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgJCh0aGlzKS52YWwoKSArIFwiJz5cIiArICQodGhpcykuaHRtbCgpICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFdlJ2xsIGFkZCA1cHggZm9yIGEgbGl0dGxlIHBhZGRpbmcgb24gdGhlIHJpZ2h0LlxyXG4gICAgICAgIHZhciBkaXZXaWR0aCA9IGNsb25lT2JqLndpZHRoKCkgKyA1O1xyXG4gICAgICAgIHZhciBuZXdEaXZXaWR0aCA9IGRpdldpZHRoO1xyXG4gICAgICAgIGlmIChvcHQubWluV2lkdGggPiAwIHx8IG9wdC5tYXhXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKGRpdldpZHRoIDwgb3B0Lm1pbldpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBkaXZXaWR0aCA9IG9wdC5taW5XaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmV3RGl2V2lkdGggPCBvcHQubWluV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIG5ld0RpdldpZHRoID0gb3B0Lm1pbldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXdEaXZXaWR0aCA+IG9wdC5tYXhXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgbmV3RGl2V2lkdGggPSBvcHQubWF4V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGVjdFdpZHRoID0gZGl2V2lkdGg7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgbmV3IHdpZHRoc1xyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5jc3MoXCJ3aWR0aFwiLCBzZWxlY3RXaWR0aCArIFwicHhcIikucGFyZW50KCkuY3NzKFwid2lkdGhcIiwgbmV3RGl2V2lkdGggKyBcInB4XCIpO1xyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5jc3MoXCJ3aWR0aFwiLCBzZWxlY3RXaWR0aCArIFwicHhcIikucGFyZW50KCkuY3NzKFwid2lkdGhcIiwgbmV3RGl2V2lkdGggKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdGhlIHNlbGVjdCdzIGNsb25lLCBzaW5jZSB3ZSdyZSBkb25lIHdpdGggaXRcclxuICAgICAgICBjbG9uZU9iai5yZW1vdmUoKTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQU2V0TXVsdGlTZWxlY3RTaXplc1xyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBTUFVwZGF0ZU11bHRpcGxlTGlzdEl0ZW1zIGFsbG93cyB5b3UgdG8gdXBkYXRlIG11bHRpcGxlIGl0ZW1zIGluIGEgbGlzdCBiYXNlZCB1cG9uIHNvbWUgY29tbW9uIGNoYXJhY3RlcmlzdGljIG9yIG1ldGFkYXRhIGNyaXRlcmlhLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQVXBkYXRlTXVsdGlwbGVMaXN0SXRlbXMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIGxpc3QgdG8gb3BlcmF0ZSBvbi5cclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBcIlwiLCAvLyBBIENBTUwgZnJhZ21lbnQgc3BlY2lmeWluZyB3aGljaCBpdGVtcyBpbiB0aGUgbGlzdCB3aWxsIGJlIHNlbGVjdGVkIGFuZCB1cGRhdGVkXHJcbiAgICAgICAgICAgIGJhdGNoQ21kOiBcIlVwZGF0ZVwiLCAvLyBUaGUgb3BlcmF0aW9uIHRvIHBlcmZvcm0uIEJ5IGRlZmF1bHQsIFVwZGF0ZS5cclxuICAgICAgICAgICAgdmFsdWVwYWlyczogW10sIC8vIFZhbHVlcGFpcnMgZm9yIHRoZSB1cGRhdGUgaW4gdGhlIGZvcm0gW1tmaWVsZG5hbWUxLCBmaWVsZHZhbHVlMV0sIFtmaWVsZG5hbWUyLCBmaWVsZHZhbHVlMl0uLi5dXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlcztpZiBmYWxzZSwgcnVuIHNpbGVudFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICB2YXIgaXRlbXNUb1VwZGF0ZSA9IFtdO1xyXG4gICAgICAgIHZhciBkb2N1bWVudHNUb1VwZGF0ZSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBDYWxsIEdldExpc3RJdGVtcyB0byBmaW5kIGFsbCBvZiB0aGUgaXRlbXMgbWF0Y2hpbmcgdGhlIENBTUxRdWVyeVxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RJdGVtc1wiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBvcHQuQ0FNTFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBcIjxRdWVyeU9wdGlvbnM+PFZpZXdBdHRyaWJ1dGVzIFNjb3BlPSdSZWN1cnNpdmUnIC8+PC9RdWVyeU9wdGlvbnM+XCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1RvVXBkYXRlLnB1c2goJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZVJlZiA9ICQodGhpcykuYXR0cihcIm93c19GaWxlUmVmXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWYgPSBcIi9cIiArIGZpbGVSZWYuc3Vic3RyaW5nKGZpbGVSZWYuaW5kZXhPZihjb25zdGFudHMuc3BEZWxpbSkgKyAyKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudHNUb1VwZGF0ZS5wdXNoKGZpbGVSZWYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGZpZWxkTnVtO1xyXG4gICAgICAgIHZhciBiYXRjaCA9IFwiPEJhdGNoIE9uRXJyb3I9J0NvbnRpbnVlJz5cIjtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXNUb1VwZGF0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjxNZXRob2QgSUQ9J1wiICsgaSArIFwiJyBDbWQ9J1wiICsgb3B0LmJhdGNoQ21kICsgXCInPlwiO1xyXG4gICAgICAgICAgICBmb3IgKGZpZWxkTnVtID0gMDsgZmllbGROdW0gPCBvcHQudmFsdWVwYWlycy5sZW5ndGg7IGZpZWxkTnVtKyspIHtcclxuICAgICAgICAgICAgICAgIGJhdGNoICs9IFwiPEZpZWxkIE5hbWU9J1wiICsgb3B0LnZhbHVlcGFpcnNbZmllbGROdW1dWzBdICsgXCInPlwiICsgdXRpbHMuZXNjYXBlQ29sdW1uVmFsdWUob3B0LnZhbHVlcGFpcnNbZmllbGROdW1dWzFdKSArIFwiPC9GaWVsZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjxGaWVsZCBOYW1lPSdJRCc+XCIgKyBpdGVtc1RvVXBkYXRlW2ldICsgXCI8L0ZpZWxkPlwiO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnRzVG9VcGRhdGVbaV0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgYmF0Y2ggKz0gXCI8RmllbGQgTmFtZT0nRmlsZVJlZic+XCIgKyBkb2N1bWVudHNUb1VwZGF0ZVtpXSArIFwiPC9GaWVsZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjwvTWV0aG9kPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBiYXRjaCArPSBcIjwvQmF0Y2g+XCI7XHJcblxyXG4gICAgICAgIC8vIENhbGwgVXBkYXRlTGlzdEl0ZW1zIHRvIHVwZGF0ZSBhbGwgb2YgdGhlIGl0ZW1zIG1hdGNoaW5nIHRoZSBDQU1MUXVlcnlcclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJVcGRhdGVMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQubGlzdE5hbWUsXHJcbiAgICAgICAgICAgIHVwZGF0ZXM6IGJhdGNoLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgcHJlc2VudCwgY2FsbCBjb21wbGV0ZWZ1bmMgd2hlbiBhbGwgZWxzZSBpcyBkb25lXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoeERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUFVwZGF0ZU11bHRpcGxlTGlzdEl0ZW1zXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
