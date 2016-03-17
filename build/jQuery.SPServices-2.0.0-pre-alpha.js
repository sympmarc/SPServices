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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNQU2VydmljZXMuY29yZS5qcyIsImNvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzIiwiU1BTZXJ2aWNlcy51dGlscy5qcyIsImNvcmUvU1BTZXJ2aWNlcy51dGlscy5qcyIsIlZlcnNpb24uanMiLCJjb3JlL1ZlcnNpb24uanMiLCJTUEFycmFuZ2VDaG9pY2VzLmpzIiwidmFsdWUtYWRkZWQvU1BBcnJhbmdlQ2hvaWNlcy5qcyIsIlNQQXV0b2NvbXBsZXRlLmpzIiwidmFsdWUtYWRkZWQvU1BBdXRvY29tcGxldGUuanMiLCJTUENhc2NhZGVEcm9wZG93bnMuanMiLCJ2YWx1ZS1hZGRlZC9TUENhc2NhZGVEcm9wZG93bnMuanMiLCJTUENvbXBsZXhUb1NpbXBsZURyb3Bkb3duLmpzIiwidmFsdWUtYWRkZWQvU1BDb21wbGV4VG9TaW1wbGVEcm9wZG93bi5qcyIsIlNQRGlzcGxheVJlbGF0ZWRJbmZvLmpzIiwidmFsdWUtYWRkZWQvU1BEaXNwbGF5UmVsYXRlZEluZm8uanMiLCJTUEZpbHRlckRyb3Bkb3duLmpzIiwidmFsdWUtYWRkZWQvU1BGaWx0ZXJEcm9wZG93bi5qcyIsIlNQRmluZE1NU1BpY2tlci5qcyIsInZhbHVlLWFkZGVkL1NQRmluZE1NU1BpY2tlci5qcyIsIlNQRmluZFBlb3BsZVBpY2tlci5qcyIsInZhbHVlLWFkZGVkL1NQRmluZFBlb3BsZVBpY2tlci5qcyIsIlNQTG9va3VwQWRkTmV3LmpzIiwidmFsdWUtYWRkZWQvU1BMb29rdXBBZGROZXcuanMiLCJTUFJlZGlyZWN0V2l0aElELmpzIiwidmFsdWUtYWRkZWQvU1BSZWRpcmVjdFdpdGhJRC5qcyIsIlNQUmVxdWlyZVVuaXF1ZS5qcyIsInZhbHVlLWFkZGVkL1NQUmVxdWlyZVVuaXF1ZS5qcyIsIlNQU2NyaXB0QXVkaXQuanMiLCJ2YWx1ZS1hZGRlZC9TUFNjcmlwdEF1ZGl0LmpzIiwiU1BTZXRNdWx0aVNlbGVjdFNpemVzLmpzIiwidmFsdWUtYWRkZWQvU1BTZXRNdWx0aVNlbGVjdFNpemVzLmpzIiwiU1BVcGRhdGVNdWx0aXBsZUxpc3RJdGVtcy5qcyIsInZhbHVlLWFkZGVkL1NQVXBkYXRlTXVsdGlwbGVMaXN0SXRlbXMuanMiLCJjb25zdGFudHMuanMiLCJ1dGlscy9jb25zdGFudHMuanMiLCJTUENvbnZlcnREYXRlVG9JU08uanMiLCJ1dGlscy9TUENvbnZlcnREYXRlVG9JU08uanMiLCJTUERlYnVnWE1MSHR0cFJlc3VsdC5qcyIsInV0aWxzL1NQRGVidWdYTUxIdHRwUmVzdWx0LmpzIiwiU1BEcm9wZG93bkN0bC5qcyIsInV0aWxzL1NQRHJvcGRvd25DdGwuanMiLCJTUEZpbHRlck5vZGUuanMiLCJ1dGlscy9TUEZpbHRlck5vZGUuanMiLCJTUEdldEN1cnJlbnRTaXRlLmpzIiwidXRpbHMvU1BHZXRDdXJyZW50U2l0ZS5qcyIsIlNQR2V0Q3VycmVudFVzZXIuanMiLCJ1dGlscy9TUEdldEN1cnJlbnRVc2VyLmpzIiwiU1BHZXREaXNwbGF5RnJvbVN0YXRpYy5qcyIsInV0aWxzL1NQR2V0RGlzcGxheUZyb21TdGF0aWMuanMiLCJTUEdldExhc3RJdGVtSWQuanMiLCJ1dGlscy9TUEdldExhc3RJdGVtSWQuanMiLCJTUEdldExpc3RJdGVtc0pzb24uanMiLCJ1dGlscy9TUEdldExpc3RJdGVtc0pzb24uanMiLCJTUEdldFF1ZXJ5U3RyaW5nLmpzIiwidXRpbHMvU1BHZXRRdWVyeVN0cmluZy5qcyIsIlNQR2V0U3RhdGljRnJvbURpc3BsYXkuanMiLCJ1dGlscy9TUEdldFN0YXRpY0Zyb21EaXNwbGF5LmpzIiwiU1BMaXN0TmFtZUZyb21VcmwuanMiLCJ1dGlscy9TUExpc3ROYW1lRnJvbVVybC5qcyIsIlNQWG1sVG9Kc29uLmpzIiwidXRpbHMvU1BYbWxUb0pzb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJqUXVlcnkuU1BTZXJ2aWNlcy0yLjAuMC1wcmUtYWxwaGEuanMiLCJzb3VyY2VzQ29udGVudCI6W251bGwsIi8qKlxyXG4gKiBPcmlnaW5hbCBTUFNlcnZpY2VzIGNvcmUgbW9kdWxlcy4uLlxyXG4gKi9cclxuZGVmaW5lKFtcclxuICAgIFwianF1ZXJ5XCIsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgXCIuLi9jb3JlL1NQU2VydmljZXMudXRpbHNcIlxyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgY29uc3RhbnRzLFxyXG4gICAgdXRpbHNcclxuKSB7XHJcblxyXG4gICAgLyoganNoaW50IHVuZGVmOiB0cnVlICovXHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIFNPQVBBY3Rpb24gPSBcIlwiO1xyXG4gICAgdmFyIFNPQVBFbnZlbG9wZSA9IHtcclxuICAgICAgICBoZWFkZXI6IFwiPHNvYXA6RW52ZWxvcGUgeG1sbnM6eHNpPSdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZScgeG1sbnM6eHNkPSdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYScgeG1sbnM6c29hcD0naHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvc29hcC9lbnZlbG9wZS8nPjxzb2FwOkJvZHk+XCIsXHJcbiAgICAgICAgZm9vdGVyOiBcIjwvc29hcDpCb2R5Pjwvc29hcDpFbnZlbG9wZT5cIixcclxuICAgICAgICBwYXlsb2FkOiBcIlwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENhY2hpbmdcclxuICAgIHZhciBwcm9taXNlc0NhY2hlID0ge307XHJcblxyXG4gICAgLy8gICBXZWIgU2VydmljZSBuYW1lc1xyXG4gICAgdmFyIHdlYlNlcnZpY2VzID0ge1xyXG4gICAgICAgIEFMRVJUUzogXCJBbGVydHNcIixcclxuICAgICAgICBBVVRIRU5USUNBVElPTjogXCJBdXRoZW50aWNhdGlvblwiLFxyXG4gICAgICAgIENPUFk6IFwiQ29weVwiLFxyXG4gICAgICAgIEZPUk1TOiBcIkZvcm1zXCIsXHJcbiAgICAgICAgTElTVFM6IFwiTGlzdHNcIixcclxuICAgICAgICBNRUVUSU5HUzogXCJNZWV0aW5nc1wiLFxyXG4gICAgICAgIE9GRklDSUFMRklMRTogXCJPZmZpY2lhbEZpbGVcIixcclxuICAgICAgICBQRU9QTEU6IFwiUGVvcGxlXCIsXHJcbiAgICAgICAgUEVSTUlTU0lPTlM6IFwiUGVybWlzc2lvbnNcIixcclxuICAgICAgICBQVUJMSVNIRURMSU5LU1NFUlZJQ0U6IFwiUHVibGlzaGVkTGlua3NTZXJ2aWNlXCIsXHJcbiAgICAgICAgU0VBUkNIOiBcIlNlYXJjaFwiLFxyXG4gICAgICAgIFNIQVJFUE9JTlRESUFHTk9TVElDUzogXCJTaGFyZVBvaW50RGlhZ25vc3RpY3NcIixcclxuICAgICAgICBTSVRFREFUQTogXCJTaXRlRGF0YVwiLFxyXG4gICAgICAgIFNJVEVTOiBcIlNpdGVzXCIsXHJcbiAgICAgICAgU09DSUFMREFUQVNFUlZJQ0U6IFwiU29jaWFsRGF0YVNlcnZpY2VcIixcclxuICAgICAgICBTUEVMTENIRUNLOiBcIlNwZWxsQ2hlY2tcIixcclxuICAgICAgICBUQVhPTk9NWVNFUlZJQ0U6IFwiVGF4b25vbXlDbGllbnRTZXJ2aWNlXCIsXHJcbiAgICAgICAgVVNFUkdST1VQOiBcInVzZXJncm91cFwiLFxyXG4gICAgICAgIFVTRVJQUk9GSUxFU0VSVklDRTogXCJVc2VyUHJvZmlsZVNlcnZpY2VcIixcclxuICAgICAgICBWRVJTSU9OUzogXCJWZXJzaW9uc1wiLFxyXG4gICAgICAgIFZJRVdTOiBcIlZpZXdzXCIsXHJcbiAgICAgICAgV0VCUEFSVFBBR0VTOiBcIldlYlBhcnRQYWdlc1wiLFxyXG4gICAgICAgIFdFQlM6IFwiV2Vic1wiLFxyXG4gICAgICAgIFdPUktGTE9XOiBcIldvcmtmbG93XCIsXHJcbiAgICAgICAgLyogTmludGV4IFdlYiBTZXJ2aWNlKi9cclxuICAgICAgICBOSU5URVhXT1JLRkxPVzogXCJOaW50ZXhXb3JrZmxvdy9Xb3JrZmxvd1wiICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGVuY29kZU9wdGlvbkxpc3QgPSBbXCJsaXN0TmFtZVwiLCBcImRlc2NyaXB0aW9uXCJdOyAvLyBVc2VkIHRvIGVuY29kZSBvcHRpb25zIHdoaWNoIG1heSBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVyc1xyXG5cclxuXHJcbiAgICAvLyBBcnJheSB0byBzdG9yZSBXZWIgU2VydmljZSBpbmZvcm1hdGlvblxyXG4gICAgLy8gIFdTb3BzLk9wTmFtZSA9IFtXZWJTZXJ2aWNlLCBuZWVkc19TT0FQQWN0aW9uXTtcclxuICAgIC8vICAgICAgT3BOYW1lICAgICAgICAgICAgICBUaGUgbmFtZSBvZiB0aGUgV2ViIFNlcnZpY2Ugb3BlcmF0aW9uIC0+IFRoZXNlIG5hbWVzIGFyZSB1bmlxdWVcclxuICAgIC8vICAgICAgV2ViU2VydmljZSAgICAgICAgICBUaGUgbmFtZSBvZiB0aGUgV2ViU2VydmljZSB0aGlzIG9wZXJhdGlvbiBiZWxvbmdzIHRvXHJcbiAgICAvLyAgICAgIG5lZWRzX1NPQVBBY3Rpb24gICAgQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIG9wZXJhdGlvbiBuZWVkcyB0byBoYXZlIHRoZSBTT0FQQWN0aW9uIHBhc3NlZCBpbiB0aGUgc2V0UmVxdWVzdEhlYWRlcmZ1bmN0aW9uLlxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgaWYgdGhlIG9wZXJhdGlvbiBkb2VzIGEgd3JpdGUsIGVsc2UgZmFsc2VcclxuXHJcbiAgICB2YXIgV1NvcHMgPSB7fTtcclxuXHJcbiAgICBXU29wcy5HZXRBbGVydHMgPSBbd2ViU2VydmljZXMuQUxFUlRTLCBmYWxzZV07XHJcbiAgICBXU29wcy5EZWxldGVBbGVydHMgPSBbd2ViU2VydmljZXMuQUxFUlRTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5Nb2RlID0gW3dlYlNlcnZpY2VzLkFVVEhFTlRJQ0FUSU9OLCBmYWxzZV07XHJcbiAgICBXU29wcy5Mb2dpbiA9IFt3ZWJTZXJ2aWNlcy5BVVRIRU5USUNBVElPTiwgZmFsc2VdO1xyXG5cclxuICAgIFdTb3BzLkNvcHlJbnRvSXRlbXMgPSBbd2ViU2VydmljZXMuQ09QWSwgdHJ1ZV07XHJcbiAgICBXU29wcy5Db3B5SW50b0l0ZW1zTG9jYWwgPSBbd2ViU2VydmljZXMuQ09QWSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRJdGVtID0gW3dlYlNlcnZpY2VzLkNPUFksIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5HZXRGb3JtID0gW3dlYlNlcnZpY2VzLkZPUk1TLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRGb3JtQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5GT1JNUywgZmFsc2VdO1xyXG5cclxuICAgIFdTb3BzLkFkZEF0dGFjaG1lbnQgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkRGlzY3Vzc2lvbkJvYXJkSXRlbSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRMaXN0ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZExpc3RGcm9tRmVhdHVyZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5BcHBseUNvbnRlbnRUeXBlVG9MaXN0ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkNoZWNrSW5GaWxlID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkNoZWNrT3V0RmlsZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5DcmVhdGVDb250ZW50VHlwZSA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVBdHRhY2htZW50ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZUNvbnRlbnRUeXBlID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZUNvbnRlbnRUeXBlWG1sRG9jdW1lbnQgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlTGlzdCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRBdHRhY2htZW50Q29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdEFuZFZpZXcgPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLkxJU1RTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRMaXN0Q29udGVudFR5cGUgPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RDb250ZW50VHlwZXMgPSBbd2ViU2VydmljZXMuTElTVFMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldExpc3RJdGVtQ2hhbmdlcyA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdEl0ZW1DaGFuZ2VzU2luY2VUb2tlbiA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0TGlzdEl0ZW1zID0gW3dlYlNlcnZpY2VzLkxJU1RTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRWZXJzaW9uQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuVW5kb0NoZWNrT3V0ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUNvbnRlbnRUeXBlID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUNvbnRlbnRUeXBlc1htbERvY3VtZW50ID0gW3dlYlNlcnZpY2VzLkxJU1RTLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUNvbnRlbnRUeXBlWG1sRG9jdW1lbnQgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlTGlzdCA9IFt3ZWJTZXJ2aWNlcy5MSVNUUywgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVMaXN0SXRlbXMgPSBbd2ViU2VydmljZXMuTElTVFMsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkFkZE1lZXRpbmcgPSBbd2ViU2VydmljZXMuTUVFVElOR1MsIHRydWVdO1xyXG4gICAgV1NvcHMuQ3JlYXRlV29ya3NwYWNlID0gW3dlYlNlcnZpY2VzLk1FRVRJTkdTLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZU1lZXRpbmcgPSBbd2ViU2VydmljZXMuTUVFVElOR1MsIHRydWVdO1xyXG4gICAgV1NvcHMuU2V0V29ya1NwYWNlVGl0bGUgPSBbd2ViU2VydmljZXMuTUVFVElOR1MsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkdldFJlY29yZFJvdXRpbmcgPSBbd2ViU2VydmljZXMuT0ZGSUNJQUxGSUxFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSZWNvcmRSb3V0aW5nQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5PRkZJQ0lBTEZJTEUsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFNlcnZlckluZm8gPSBbd2ViU2VydmljZXMuT0ZGSUNJQUxGSUxFLCBmYWxzZV07XHJcbiAgICBXU29wcy5TdWJtaXRGaWxlID0gW3dlYlNlcnZpY2VzLk9GRklDSUFMRklMRSwgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuUmVzb2x2ZVByaW5jaXBhbHMgPSBbd2ViU2VydmljZXMuUEVPUExFLCB0cnVlXTtcclxuICAgIFdTb3BzLlNlYXJjaFByaW5jaXBhbHMgPSBbd2ViU2VydmljZXMuUEVPUExFLCBmYWxzZV07XHJcblxyXG4gICAgV1NvcHMuQWRkUGVybWlzc2lvbiA9IFt3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRQZXJtaXNzaW9uQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRQZXJtaXNzaW9uQ29sbGVjdGlvbiA9IFt3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUywgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVQZXJtaXNzaW9uID0gW3dlYlNlcnZpY2VzLlBFUk1JU1NJT05TLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVBlcm1pc3Npb25Db2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlBFUk1JU1NJT05TLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZVBlcm1pc3Npb24gPSBbd2ViU2VydmljZXMuUEVSTUlTU0lPTlMsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkdldExpbmtzID0gW3dlYlNlcnZpY2VzLlBVQkxJU0hFRExJTktTU0VSVklDRSwgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuR2V0UG9ydGFsU2VhcmNoSW5mbyA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFF1ZXJ5U3VnZ2VzdGlvbnMgPSBbd2ViU2VydmljZXMuU0VBUkNILCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRTZWFyY2hNZXRhZGF0YSA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuICAgIFdTb3BzLlF1ZXJ5ID0gW3dlYlNlcnZpY2VzLlNFQVJDSCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuUXVlcnlFeCA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuICAgIFdTb3BzLlJlZ2lzdHJhdGlvbiA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuICAgIFdTb3BzLlN0YXR1cyA9IFt3ZWJTZXJ2aWNlcy5TRUFSQ0gsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5TZW5kQ2xpZW50U2NyaXB0RXJyb3JSZXBvcnQgPSBbd2ViU2VydmljZXMuU0hBUkVQT0lOVERJQUdOT1NUSUNTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5HZXRBdHRhY2htZW50cyA9IFt3ZWJTZXJ2aWNlcy5TSVRFREFUQSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuRW51bWVyYXRlRm9sZGVyID0gW3dlYlNlcnZpY2VzLlNJVEVEQVRBLCBmYWxzZV07XHJcbiAgICBXU29wcy5TaXRlRGF0YUdldExpc3QgPSBbd2ViU2VydmljZXMuU0lURURBVEEsIGZhbHNlXTtcclxuICAgIFdTb3BzLlNpdGVEYXRhR2V0TGlzdENvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuU0lURURBVEEsIGZhbHNlXTtcclxuICAgIFdTb3BzLlNpdGVEYXRhR2V0U2l0ZSA9IFt3ZWJTZXJ2aWNlcy5TSVRFREFUQSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuU2l0ZURhdGFHZXRTaXRlVXJsID0gW3dlYlNlcnZpY2VzLlNJVEVEQVRBLCBmYWxzZV07XHJcbiAgICBXU29wcy5TaXRlRGF0YUdldFdlYiA9IFt3ZWJTZXJ2aWNlcy5TSVRFREFUQSwgZmFsc2VdO1xyXG5cclxuICAgIFdTb3BzLkNyZWF0ZVdlYiA9IFt3ZWJTZXJ2aWNlcy5TSVRFUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVXZWIgPSBbd2ViU2VydmljZXMuU0lURVMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0U2l0ZSA9IFt3ZWJTZXJ2aWNlcy5TSVRFUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0U2l0ZVRlbXBsYXRlcyA9IFt3ZWJTZXJ2aWNlcy5TSVRFUywgZmFsc2VdO1xyXG5cclxuICAgIFdTb3BzLkFkZENvbW1lbnQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkVGFnID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFRhZ0J5S2V5d29yZCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5Db3VudENvbW1lbnRzT2ZVc2VyID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5Db3VudENvbW1lbnRzT2ZVc2VyT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkNvdW50Q29tbWVudHNPblVybCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuQ291bnRSYXRpbmdzT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkNvdW50VGFnc09mVXNlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuRGVsZXRlQ29tbWVudCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVSYXRpbmcgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuRGVsZXRlVGFnID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZVRhZ0J5S2V5d29yZCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVUYWdzID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldEFsbFRhZ1Rlcm1zID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRBbGxUYWdUZXJtc0ZvclVybEZvbGRlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0QWxsVGFnVXJscyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0QWxsVGFnVXJsc0J5S2V5d29yZCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Q29tbWVudHNPZlVzZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbW1lbnRzT2ZVc2VyT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbW1lbnRzT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJhdGluZ0F2ZXJhZ2VPblVybCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0UmF0aW5nT2ZVc2VyT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJhdGluZ09uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSYXRpbmdzT2ZVc2VyID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSYXRpbmdzT25VcmwgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFNvY2lhbERhdGFGb3JGdWxsUmVwbGljYXRpb24gPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFRhZ3MgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnc09mVXNlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdUZXJtcyA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdUZXJtc09mVXNlciA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdUZXJtc09uVXJsID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFRhZ1VybHNPZlVzZXIgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VGFnVXJsc09mVXNlckJ5S2V5d29yZCA9IFt3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUYWdVcmxzID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLkdldFRhZ1VybHNCeUtleXdvcmQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuU2V0UmF0aW5nID0gW3dlYlNlcnZpY2VzLlNPQ0lBTERBVEFTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZUNvbW1lbnQgPSBbd2ViU2VydmljZXMuU09DSUFMREFUQVNFUlZJQ0UsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLlNwZWxsQ2hlY2sgPSBbd2ViU2VydmljZXMuU1BFTExDSEVDSywgZmFsc2VdO1xyXG5cclxuICAgIC8vIFRheG9ub215IFNlcnZpY2UgQ2FsbHNcclxuICAgIC8vIFVwZGF0ZWQgMjAxMS4wMS4yNyBieSBUaG9tYXMgTWNNaWxsYW5cclxuICAgIFdTb3BzLkFkZFRlcm1zID0gW3dlYlNlcnZpY2VzLlRBWE9OT01ZU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRDaGlsZFRlcm1zSW5UZXJtID0gW3dlYlNlcnZpY2VzLlRBWE9OT01ZU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Q2hpbGRUZXJtc0luVGVybVNldCA9IFt3ZWJTZXJ2aWNlcy5UQVhPTk9NWVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEtleXdvcmRUZXJtc0J5R3VpZHMgPSBbd2ViU2VydmljZXMuVEFYT05PTVlTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRUZXJtc0J5TGFiZWwgPSBbd2ViU2VydmljZXMuVEFYT05PTVlTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRUZXJtU2V0cyA9IFt3ZWJTZXJ2aWNlcy5UQVhPTk9NWVNFUlZJQ0UsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5BZGRHcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkR3JvdXBUb1JvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFJvbGVEZWYgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFVzZXJDb2xsZWN0aW9uVG9Hcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkVXNlckNvbGxlY3Rpb25Ub1JvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLkFkZFVzZXJUb0dyb3VwID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRVc2VyVG9Sb2xlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRBbGxVc2VyQ29sbGVjdGlvbkZyb21XZWIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRHcm91cENvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRHcm91cENvbGxlY3Rpb25Gcm9tUm9sZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEdyb3VwQ29sbGVjdGlvbkZyb21TaXRlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0R3JvdXBDb2xsZWN0aW9uRnJvbVVzZXIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRHcm91cENvbGxlY3Rpb25Gcm9tV2ViID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0R3JvdXBJbmZvID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Um9sZUNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlQ29sbGVjdGlvbkZyb21Hcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJvbGVDb2xsZWN0aW9uRnJvbVVzZXIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlQ29sbGVjdGlvbkZyb21XZWIgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRSb2xlSW5mbyA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJvbGVzQW5kUGVybWlzc2lvbnNGb3JDdXJyZW50VXNlciA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFJvbGVzQW5kUGVybWlzc2lvbnNGb3JTaXRlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyQ29sbGVjdGlvbkZyb21Hcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJDb2xsZWN0aW9uRnJvbVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyQ29sbGVjdGlvbkZyb21TaXRlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckNvbGxlY3Rpb25Gcm9tV2ViID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlckluZm8gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyTG9naW5Gcm9tRW1haWwgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCBmYWxzZV07XHJcbiAgICBXU29wcy5SZW1vdmVHcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlR3JvdXBGcm9tUm9sZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlUm9sZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlVXNlckNvbGxlY3Rpb25Gcm9tR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJDb2xsZWN0aW9uRnJvbVJvbGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJDb2xsZWN0aW9uRnJvbVNpdGUgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJGcm9tR3JvdXAgPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZVVzZXJGcm9tUm9sZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlVXNlckZyb21TaXRlID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVVc2VyRnJvbVdlYiA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlR3JvdXBJbmZvID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVSb2xlRGVmSW5mbyA9IFt3ZWJTZXJ2aWNlcy5VU0VSR1JPVVAsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlUm9sZUluZm8gPSBbd2ViU2VydmljZXMuVVNFUkdST1VQLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZVVzZXJJbmZvID0gW3dlYlNlcnZpY2VzLlVTRVJHUk9VUCwgdHJ1ZV07XHJcblxyXG4gICAgV1NvcHMuQWRkQ29sbGVhZ3VlID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRMaW5rID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRNZW1iZXJzaGlwID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRQaW5uZWRMaW5rID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5DcmVhdGVNZW1iZXJHcm91cCA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuQ3JlYXRlVXNlclByb2ZpbGVCeUFjY291bnROYW1lID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRDb21tb25Db2xsZWFndWVzID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Q29tbW9uTWFuYWdlciA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbW1vbk1lbWJlcnNoaXBzID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0SW5Db21tb24gPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRQcm9wZXJ0eUNob2ljZUxpc3QgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyQ29sbGVhZ3VlcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJMaW5rcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJNZW1iZXJzaGlwcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJQaW5uZWRMaW5rcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFVzZXJQcm9maWxlQnlHdWlkID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlclByb2ZpbGVCeUluZGV4ID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlclByb2ZpbGVCeU5hbWUgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyUHJvZmlsZUNvdW50ID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0VXNlclByb2ZpbGVTY2hlbWEgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRVc2VyUHJvcGVydHlCeUFjY291bnROYW1lID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgZmFsc2VdO1xyXG4gICAgV1NvcHMuTW9kaWZ5VXNlclByb3BlcnR5QnlBY2NvdW50TmFtZSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlQWxsQ29sbGVhZ3VlcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlQWxsTGlua3MgPSBbd2ViU2VydmljZXMuVVNFUlBST0ZJTEVTRVJWSUNFLCB0cnVlXTtcclxuICAgIFdTb3BzLlJlbW92ZUFsbE1lbWJlcnNoaXBzID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVBbGxQaW5uZWRMaW5rcyA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuUmVtb3ZlQ29sbGVhZ3VlID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVMaW5rID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVNZW1iZXJzaGlwID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5SZW1vdmVQaW5uZWRMaW5rID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVDb2xsZWFndWVQcml2YWN5ID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVMaW5rID0gW3dlYlNlcnZpY2VzLlVTRVJQUk9GSUxFU0VSVklDRSwgdHJ1ZV07XHJcbiAgICBXU29wcy5VcGRhdGVNZW1iZXJzaGlwUHJpdmFjeSA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG4gICAgV1NvcHMuVXBkYXRlUGlubmVkTGluayA9IFt3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0UsIHRydWVdO1xyXG5cclxuICAgIFdTb3BzLkRlbGV0ZUFsbFZlcnNpb25zID0gW3dlYlNlcnZpY2VzLlZFUlNJT05TLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZVZlcnNpb24gPSBbd2ViU2VydmljZXMuVkVSU0lPTlMsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VmVyc2lvbnMgPSBbd2ViU2VydmljZXMuVkVSU0lPTlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLlJlc3RvcmVWZXJzaW9uID0gW3dlYlNlcnZpY2VzLlZFUlNJT05TLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5BZGRWaWV3ID0gW3dlYlNlcnZpY2VzLlZJRVdTLCB0cnVlXTtcclxuICAgIFdTb3BzLkRlbGV0ZVZpZXcgPSBbd2ViU2VydmljZXMuVklFV1MsIHRydWVdO1xyXG4gICAgV1NvcHMuR2V0VmlldyA9IFt3ZWJTZXJ2aWNlcy5WSUVXUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0Vmlld0h0bWwgPSBbd2ViU2VydmljZXMuVklFV1MsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFZpZXdDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLlZJRVdTLCBmYWxzZV07XHJcbiAgICBXU29wcy5VcGRhdGVWaWV3ID0gW3dlYlNlcnZpY2VzLlZJRVdTLCB0cnVlXTtcclxuICAgIFdTb3BzLlVwZGF0ZVZpZXdIdG1sID0gW3dlYlNlcnZpY2VzLlZJRVdTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5BZGRXZWJQYXJ0ID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRXZWJQYXJ0VG9ab25lID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgdHJ1ZV07XHJcbiAgICBXU29wcy5EZWxldGVXZWJQYXJ0ID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRXZWJQYXJ0MiA9IFt3ZWJTZXJ2aWNlcy5XRUJQQVJUUEFHRVMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFdlYlBhcnRQYWdlID0gW3dlYlNlcnZpY2VzLldFQlBBUlRQQUdFUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuR2V0V2ViUGFydFByb3BlcnRpZXMgPSBbd2ViU2VydmljZXMuV0VCUEFSVFBBR0VTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRXZWJQYXJ0UHJvcGVydGllczIgPSBbd2ViU2VydmljZXMuV0VCUEFSVFBBR0VTLCBmYWxzZV07XHJcbiAgICBXU29wcy5TYXZlV2ViUGFydDIgPSBbd2ViU2VydmljZXMuV0VCUEFSVFBBR0VTLCB0cnVlXTtcclxuXHJcbiAgICBXU29wcy5XZWJzQ3JlYXRlQ29udGVudFR5cGUgPSBbd2ViU2VydmljZXMuV0VCUywgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRDb2x1bW5zID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbnRlbnRUeXBlID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldENvbnRlbnRUeXBlcyA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRDdXN0b21pemVkUGFnZVN0YXR1cyA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRMaXN0VGVtcGxhdGVzID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldE9iamVjdElkRnJvbVVybCA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07IC8vIDIwMTBcclxuICAgIFdTb3BzLkdldFdlYiA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRXZWJDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldEFsbFN1YldlYkNvbGxlY3Rpb24gPSBbd2ViU2VydmljZXMuV0VCUywgZmFsc2VdO1xyXG4gICAgV1NvcHMuVXBkYXRlQ29sdW1ucyA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCB0cnVlXTtcclxuICAgIFdTb3BzLldlYnNVcGRhdGVDb250ZW50VHlwZSA9IFt3ZWJTZXJ2aWNlcy5XRUJTLCB0cnVlXTtcclxuICAgIFdTb3BzLldlYlVybEZyb21QYWdlVXJsID0gW3dlYlNlcnZpY2VzLldFQlMsIGZhbHNlXTtcclxuXHJcbiAgICBXU29wcy5BbHRlclRvRG8gPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIHRydWVdO1xyXG4gICAgV1NvcHMuQ2xhaW1SZWxlYXNlVGFzayA9IFt3ZWJTZXJ2aWNlcy5XT1JLRkxPVywgdHJ1ZV07XHJcbiAgICBXU29wcy5HZXRUZW1wbGF0ZXNGb3JJdGVtID0gW3dlYlNlcnZpY2VzLldPUktGTE9XLCBmYWxzZV07XHJcbiAgICBXU29wcy5HZXRUb0Rvc0Zvckl0ZW0gPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFdvcmtmbG93RGF0YUZvckl0ZW0gPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIGZhbHNlXTtcclxuICAgIFdTb3BzLkdldFdvcmtmbG93VGFza0RhdGEgPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIGZhbHNlXTtcclxuICAgIFdTb3BzLlN0YXJ0V29ya2Zsb3cgPSBbd2ViU2VydmljZXMuV09SS0ZMT1csIHRydWVdO1xyXG5cclxuXHQvL05pbnRleCBcclxuICAgIFdTb3BzLkFkZExvbmdUZXJtRGVsZWdhdGlvblJ1bGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG4gICAgV1NvcHMuQWRkV29ya2Zsb3dTY2hlZHVsZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcbiAgICBXU29wcy5BZGRXb3JrZmxvd1NjaGVkdWxlT25MaXN0SXRlbSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuQ2hlY2tHbG9iYWxSZXVzZVN0YXR1cyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuQ2hlY2tJbkZvcm1zID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5EZWxlZ2F0ZUFsbFRhc2tzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5EZWxlZ2F0ZVRhc2sgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkRlbGV0ZUxvbmdUZXJtRGVsZWdhdGlvblJ1bGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkRlbGV0ZVNuaXBwZXQgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkRlbGV0ZVdvcmtmbG93ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5FeHBvcnRXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcbiAgICBXU29wcy5GaXhXb3JrZmxvd3NJblNpdGVGcm9tVGVtcGxhdGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldEZvbGRlcnMgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldEl0ZW1zUGVuZGluZ015QXBwcm92YWwgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldExpc3RDb250ZW50VHlwZXMgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldE91dGNvbWVzRm9yRmxleGlUYXNrID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRSdW5uaW5nV29ya2Zsb3dUYXNrcyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0UnVubmluZ1dvcmtmbG93VGFza3NDb2xsZWN0aW9uID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0ZvckN1cnJlbnRVc2VyID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0ZvckN1cnJlbnRVc2VyRm9yTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldFJ1bm5pbmdXb3JrZmxvd1Rhc2tzRm9yTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLkdldFRhc2tEZXRhaWxzVXNpbmdTdHViID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRUYXNrU3R1YnNGb3JDdXJyZW50VXNlciA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuR2V0V29ya2Zsb3dIaXN0b3J5ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5HZXRXb3JrZmxvd0hpc3RvcnlGb3JMaXN0SXRlbSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuSGlkZVRhc2tGb3JBcHByb3ZlciA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuSGlkZVdvcmtmbG93ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Qcm9jZXNzRmxleGlUYXNrUmVzcG9uc2UgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlByb2Nlc3NGbGV4aVRhc2tSZXNwb25zZTIgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlByb2Nlc3NUYXNrUmVzcG9uc2UgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlByb2Nlc3NUYXNrUmVzcG9uc2UyID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Qcm9jZXNzVGFza1Jlc3BvbnNlMyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUHJvY2Vzc1Rhc2tSZXNwb25zZVVzaW5nVG9rZW4gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlB1Ymxpc2hGcm9tTldGID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRk5vT3ZlcndyaXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlNraXBWYWxpZGF0aW9uID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlNraXBWYWxpZGF0aW9uTm9PdmVyd3JpdGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlB1Ymxpc2hGcm9tTldGWG1sID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlhtbE5vT3ZlcndyaXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlhtbFNraXBWYWxpZGF0aW9uID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5QdWJsaXNoRnJvbU5XRlhtbFNraXBWYWxpZGF0aW9uTm9PdmVyd3JpdGUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlB1Ymxpc2hXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUXVlcnlGb3JNZXNzYWdlcyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUmVtb3ZlV29ya2Zsb3dTY2hlZHVsZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuUmVtb3ZlV29ya2Zsb3dTY2hlZHVsZU9uTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVGcm9tTldGID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TYXZlRnJvbU5XRk5vT3ZlcndyaXRlID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TYXZlRnJvbU5XRlhtbCA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZUZyb21OV0ZYbWxOb092ZXJ3cml0ZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZVNuaXBwZXQgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlNhdmVUZW1wbGF0ZSA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZVRlbXBsYXRlMiA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU2F2ZVdvcmtmbG93ID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TbmlwcGV0RXhpc3RzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5TdGFydFNpdGVXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuTmludGV4U3RhcnRXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuU3RhcnRXb3JrZmxvd09uTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlRlbXBsYXRlRXhpc3RzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5UZXJtaW5hdGVXb3JrZmxvdyA9IFt3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVywgdHJ1ZV07XHJcblx0V1NvcHMuVGVybWluYXRlV29ya2Zsb3dCeU5hbWUgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLlRlcm1pbmF0ZVdvcmtmbG93QnlOYW1lRm9yTGlzdEl0ZW0gPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cdFdTb3BzLldvcmtmbG93RXhpc3RzID0gW3dlYlNlcnZpY2VzLk5JTlRFWFdPUktGTE9XLCB0cnVlXTtcclxuXHRXU29wcy5Xb3JrZmxvd0Zvcm1Qcm9kdWN0U2VsZWN0ZWQgPSBbd2ViU2VydmljZXMuTklOVEVYV09SS0ZMT1csIHRydWVdO1xyXG5cclxuXHJcbiAgICAvLyBNYWluIGZ1bmN0aW9uLCB3aGljaCBjYWxscyBTaGFyZVBvaW50J3MgV2ViIFNlcnZpY2VzIGRpcmVjdGx5LlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMgcGFzc2VkIGluLCB1c2UgdGhlIGRlZmF1bHRzLiAgRXh0ZW5kIHJlcGxhY2VzIGVhY2ggZGVmYXVsdCB3aXRoIHRoZSBwYXNzZWQgb3B0aW9uLlxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwgJC5mbi5TUFNlcnZpY2VzLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gRW5jb2RlIG9wdGlvbnMgd2hpY2ggbWF5IGNvbnRhaW4gc3BlY2lhbCBjaGFyYWN0ZXIsIGVzcC4gYW1wZXJzYW5kXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmNvZGVPcHRpb25MaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0W2VuY29kZU9wdGlvbkxpc3RbaV1dID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRbZW5jb2RlT3B0aW9uTGlzdFtpXV0gPSB1dGlscy5lbmNvZGVYbWwob3B0W2VuY29kZU9wdGlvbkxpc3RbaV1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHV0IHRvZ2V0aGVyIG9wZXJhdGlvbiBoZWFkZXIgYW5kIFNPQVBBY3Rpb24gZm9yIHRoZSBTT0FQIGNhbGwgYmFzZWQgb24gd2hpY2ggV2ViIFNlcnZpY2Ugd2UncmUgY2FsbGluZ1xyXG4gICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIFwiO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHN3aXRjaCAoV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMF0pIHtcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5BTEVSVFM6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvMjAwMi8xL2FsZXJ0cy8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvMjAwMi8xL2FsZXJ0cy9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLk1FRVRJTkdTOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL21lZXRpbmdzLycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9tZWV0aW5ncy9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLk9GRklDSUFMRklMRTpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9yZWNvcmRzcmVwb3NpdG9yeS8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvcmVjb3Jkc3JlcG9zaXRvcnkvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5QRVJNSVNTSU9OUzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9kaXJlY3RvcnkvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL2RpcmVjdG9yeS9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLlBVQkxJU0hFRExJTktTU0VSVklDRTpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9TaGFyZVBvaW50UG9ydGFsU2VydmVyL1B1Ymxpc2hlZExpbmtzU2VydmljZS8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL1NoYXJlUG9pbnRQb3J0YWxTZXJ2ZXIvUHVibGlzaGVkTGlua3NTZXJ2aWNlL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuU0VBUkNIOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J3VybjpNaWNyb3NvZnQuU2VhcmNoJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJ1cm46TWljcm9zb2Z0LlNlYXJjaC9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLlNIQVJFUE9JTlRESUFHTk9TVElDUzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvZGlhZ25vc3RpY3MvJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3NoYXJlcG9pbnQvZGlhZ25vc3RpY3MvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5TT0NJQUxEQVRBU0VSVklDRTpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9TaGFyZVBvaW50UG9ydGFsU2VydmVyL1NvY2lhbERhdGFTZXJ2aWNlJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9TaGFyZVBvaW50UG9ydGFsU2VydmVyL1NvY2lhbERhdGFTZXJ2aWNlL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuU1BFTExDSEVDSzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3NoYXJlcG9pbnQvcHVibGlzaGluZy9zcGVsbGluZy8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vc2hhcmVwb2ludC9wdWJsaXNoaW5nL3NwZWxsaW5nL1NwZWxsQ2hlY2tcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLlRBWE9OT01ZU0VSVklDRTpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvdGF4b25vbXkvc29hcC8nID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3RheG9ub215L3NvYXAvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5VU0VSR1JPVVA6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0nXCIgKyBjb25zdGFudHMuU0NIRU1BU2hhcmVQb2ludCArIFwiL3NvYXAvZGlyZWN0b3J5LycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC9kaXJlY3RvcnkvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5VU0VSUFJPRklMRVNFUlZJQ0U6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKz0gXCJ4bWxucz0naHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvU2hhcmVQb2ludFBvcnRhbFNlcnZlci9Vc2VyUHJvZmlsZVNlcnZpY2UnID5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL1NoYXJlUG9pbnRQb3J0YWxTZXJ2ZXIvVXNlclByb2ZpbGVTZXJ2aWNlL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2Ugd2ViU2VydmljZXMuV0VCUEFSVFBBR0VTOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J2h0dHA6Ly9taWNyb3NvZnQuY29tL3NoYXJlcG9pbnQvd2VicGFydHBhZ2VzJyA+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gXCJodHRwOi8vbWljcm9zb2Z0LmNvbS9zaGFyZXBvaW50L3dlYnBhcnRwYWdlcy9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHdlYlNlcnZpY2VzLldPUktGTE9XOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL3dvcmtmbG93LycgPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IGNvbnN0YW50cy5TQ0hFTUFTaGFyZVBvaW50ICsgXCIvc29hcC93b3JrZmxvdy9cIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyICs9IFwieG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwLyc+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBZGQgdGhlIG9wZXJhdGlvbiB0byB0aGUgU09BUEFjdGlvbiBhbmQgb3Bmb290ZXJcclxuICAgICAgICBTT0FQQWN0aW9uICs9IG9wdC5vcGVyYXRpb247XHJcbiAgICAgICAgU09BUEVudmVsb3BlLm9wZm9vdGVyID0gXCI8L1wiICsgb3B0Lm9wZXJhdGlvbiArIFwiPlwiO1xyXG5cclxuICAgICAgICAvLyBCdWlsZCB0aGUgVVJMIGZvciB0aGUgQWpheCBjYWxsIGJhc2VkIG9uIHdoaWNoIG9wZXJhdGlvbiB3ZSdyZSBjYWxsaW5nXHJcbiAgICAgICAgLy8gSWYgdGhlIHdlYlVSTCBoYXMgYmVlbiBwcm92aWRlZCwgdGhlbiB1c2UgaXQsIGVsc2UgdXNlIHRoZSBjdXJyZW50IHNpdGVcclxuICAgICAgICB2YXIgYWpheFVSTCA9IFwiX3Z0aV9iaW4vXCIgKyBXU29wc1tvcHQub3BlcmF0aW9uXVswXSArIFwiLmFzbXhcIjtcclxuICAgICAgICB2YXIgd2ViVVJMID0gb3B0LndlYlVSTCAhPT0gdW5kZWZpbmVkID8gb3B0LndlYlVSTCA6IG9wdC53ZWJVcmw7XHJcbiAgICAgICAgaWYgKHdlYlVSTC5jaGFyQXQod2ViVVJMLmxlbmd0aCAtIDEpID09PSBjb25zdGFudHMuU0xBU0gpIHtcclxuICAgICAgICAgICAgYWpheFVSTCA9IHdlYlVSTCArIGFqYXhVUkw7XHJcbiAgICAgICAgfSBlbHNlIGlmICh3ZWJVUkwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBhamF4VVJMID0gd2ViVVJMICsgY29uc3RhbnRzLlNMQVNIICsgYWpheFVSTDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1NpdGUgPSAkKCkuU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRTaXRlKCk7XHJcbiAgICAgICAgICAgIGFqYXhVUkwgPSB0aGlzU2l0ZSArICgodGhpc1NpdGUuY2hhckF0KHRoaXNTaXRlLmxlbmd0aCAtIDEpID09PSBjb25zdGFudHMuU0xBU0gpID8gYWpheFVSTCA6IChjb25zdGFudHMuU0xBU0ggKyBhamF4VVJMKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCA9IFwiXCI7XHJcbiAgICAgICAgLy8gRWFjaCBvcGVyYXRpb24gcmVxdWlyZXMgYSBkaWZmZXJlbnQgc2V0IG9mIHZhbHVlcy4gIFRoaXMgc3dpdGNoIHN0YXRlbWVudCBzZXRzIHRoZW0gdXAgaW4gdGhlIFNPQVBFbnZlbG9wZS5wYXlsb2FkLlxyXG4gICAgICAgIHN3aXRjaCAob3B0Lm9wZXJhdGlvbikge1xyXG4gICAgICAgICAgICAvLyBBTEVSVCBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGVydHNcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQWxlcnRzXCI6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxJRHM+XCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0LklEcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IGNvbnN0YW50cy53cmFwTm9kZShcInN0cmluZ1wiLCBvcHQuSURzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPC9JRHM+XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIEFVVEhFTlRJQ0FUSU9OIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIk1vZGVcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiTG9naW5cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlcm5hbWVcIiwgXCJwYXNzd29yZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIENPUFkgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQ29weUludG9JdGVtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJTb3VyY2VVcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8RGVzdGluYXRpb25VcmxzPlwiO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5EZXN0aW5hdGlvblVybHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSB1dGlscy53cmFwTm9kZShcInN0cmluZ1wiLCBvcHQuRGVzdGluYXRpb25VcmxzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPC9EZXN0aW5hdGlvblVybHM+XCI7XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIkZpZWxkc1wiLCBcIlN0cmVhbVwiLCBcIlJlc3VsdHNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDb3B5SW50b0l0ZW1zTG9jYWxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiU291cmNlVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPERlc3RpbmF0aW9uVXJscz5cIjtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQuRGVzdGluYXRpb25VcmxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUoXCJzdHJpbmdcIiwgb3B0LkRlc3RpbmF0aW9uVXJsc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvRGVzdGluYXRpb25VcmxzPlwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRJdGVtXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIlVybFwiLCBcIkZpZWxkc1wiLCBcIlN0cmVhbVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIEZPUk0gT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Rm9ybVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImZvcm1VcmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRGb3JtQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIExJU1QgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkQXR0YWNobWVudFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImxpc3RJdGVtSURcIiwgXCJmaWxlTmFtZVwiLCBcImF0dGFjaG1lbnRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGREaXNjdXNzaW9uQm9hcmRJdGVtXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwibWVzc2FnZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZExpc3RcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInRlbXBsYXRlSURcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRMaXN0RnJvbUZlYXR1cmVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcImZlYXR1cmVJRFwiLCBcInRlbXBsYXRlSURcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBcHBseUNvbnRlbnRUeXBlVG9MaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIndlYlVybFwiLCBcImNvbnRlbnRUeXBlSWRcIiwgXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNoZWNrSW5GaWxlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJjb21tZW50XCIsIFwiQ2hlY2tpblR5cGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDaGVja091dEZpbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiLCBcImNoZWNrb3V0VG9Mb2NhbFwiLCBcImxhc3Rtb2RpZmllZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNyZWF0ZUNvbnRlbnRUeXBlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiZGlzcGxheU5hbWVcIiwgXCJwYXJlbnRUeXBlXCIsIFwiZmllbGRzXCIsIFwiY29udGVudFR5cGVQcm9wZXJ0aWVzXCIsIFwiYWRkVG9WaWV3XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlQXR0YWNobWVudFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImxpc3RJdGVtSURcIiwgXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImNvbnRlbnRUeXBlSWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVDb250ZW50VHlwZVhtbERvY3VtZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwiY29udGVudFR5cGVJZFwiLCBcImRvY3VtZW50VXJpXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlTGlzdFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEF0dGFjaG1lbnRDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFtcImxpc3RJdGVtSURcIiwgXCJJRFwiXV0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlzdEFuZFZpZXdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcImNvbnRlbnRUeXBlSWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0Q29udGVudFR5cGVzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0TGlzdEl0ZW1zXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwidmlld05hbWVcIiwgW1wicXVlcnlcIiwgXCJDQU1MUXVlcnlcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1widmlld0ZpZWxkc1wiLCBcIkNBTUxWaWV3RmllbGRzXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInJvd0xpbWl0XCIsIFwiQ0FNTFJvd0xpbWl0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIFtcInF1ZXJ5T3B0aW9uc1wiLCBcIkNBTUxRdWVyeU9wdGlvbnNcIl1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaXN0SXRlbUNoYW5nZXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3RmllbGRzXCIsIFwic2luY2VcIiwgXCJjb250YWluc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RJdGVtQ2hhbmdlc1NpbmNlVG9rZW5cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJ2aWV3TmFtZVwiLCBbXCJxdWVyeVwiLCBcIkNBTUxRdWVyeVwiXSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJ2aWV3RmllbGRzXCIsIFwiQ0FNTFZpZXdGaWVsZHNcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1wicm93TGltaXRcIiwgXCJDQU1MUm93TGltaXRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgW1wicXVlcnlPcHRpb25zXCIsIFwiQ0FNTFF1ZXJ5T3B0aW9uc1wiXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImNoYW5nZVRva2VuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmROdWxsOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJjb250YWluc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kTnVsbDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VmVyc2lvbkNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3RybGlzdElEXCIsIFwic3RybGlzdEl0ZW1JRFwiLCBcInN0ckZpZWxkTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVuZG9DaGVja091dFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlQ29udGVudFR5cGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJjb250ZW50VHlwZUlkXCIsIFwiY29udGVudFR5cGVQcm9wZXJ0aWVzXCIsIFwibmV3RmllbGRzXCIsIFwidXBkYXRlRmllbGRzXCIsIFwiZGVsZXRlRmllbGRzXCIsIFwiYWRkVG9WaWV3XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlQ29udGVudFR5cGVzWG1sRG9jdW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJuZXdEb2N1bWVudFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbnRlbnRUeXBlWG1sRG9jdW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIiwgXCJjb250ZW50VHlwZUlkXCIsIFwibmV3RG9jdW1lbnRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVMaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxpc3ROYW1lXCIsIFwibGlzdFByb3BlcnRpZXNcIiwgXCJuZXdGaWVsZHNcIiwgXCJ1cGRhdGVGaWVsZHNcIiwgXCJkZWxldGVGaWVsZHNcIiwgXCJsaXN0VmVyc2lvblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUxpc3RJdGVtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdC51cGRhdGVzICE9PSBcInVuZGVmaW5lZFwiICYmIG9wdC51cGRhdGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVwZGF0ZXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjx1cGRhdGVzPjxCYXRjaCBPbkVycm9yPSdDb250aW51ZSc+PE1ldGhvZCBJRD0nMScgQ21kPSdcIiArIG9wdC5iYXRjaENtZCArIFwiJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0LnZhbHVlcGFpcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8RmllbGQgTmFtZT0nXCIgKyBvcHQudmFsdWVwYWlyc1tpXVswXSArIFwiJz5cIiArIHV0aWxzLmVzY2FwZUNvbHVtblZhbHVlKG9wdC52YWx1ZXBhaXJzW2ldWzFdKSArIFwiPC9GaWVsZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5iYXRjaENtZCAhPT0gXCJOZXdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxGaWVsZCBOYW1lPSdJRCc+XCIgKyBvcHQuSUQgKyBcIjwvRmllbGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPC9NZXRob2Q+PC9CYXRjaD48L3VwZGF0ZXM+XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIE1FRVRJTkdTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZE1lZXRpbmdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib3JnYW5pemVyRW1haWxcIiwgXCJ1aWRcIiwgXCJzZXF1ZW5jZVwiLCBcInV0Y0RhdGVTdGFtcFwiLCBcInRpdGxlXCIsIFwibG9jYXRpb25cIiwgXCJ1dGNEYXRlU3RhcnRcIiwgXCJ1dGNEYXRlRW5kXCIsIFwibm9uR3JlZ29yaWFuXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ3JlYXRlV29ya3NwYWNlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInRpdGxlXCIsIFwidGVtcGxhdGVOYW1lXCIsIFwibGNpZFwiLCBcInRpbWVab25lSW5mb3JtYXRpb25cIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVNZWV0aW5nXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJlY3VycmVuY2VJZFwiLCBcInVpZFwiLCBcInNlcXVlbmNlXCIsIFwidXRjRGF0ZVN0YW1wXCIsIFwiY2FuY2VsTWVldGluZ1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlNldFdvcmtzcGFjZVRpdGxlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInRpdGxlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gT0ZGSUNJQUxGSUxFIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJlY29yZFJvdXRpbmdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicmVjb3JkUm91dGluZ1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJlY29yZFJvdXRpbmdDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFNlcnZlckluZm9cIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU3VibWl0RmlsZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJmaWxlVG9TdWJtaXRcIl0sIFtcInByb3BlcnRpZXNcIl0sIFtcInJlY29yZFJvdXRpbmdcIl0sIFtcInNvdXJjZVVybFwiXSwgW1widXNlck5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gUEVPUExFIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIlJlc29sdmVQcmluY2lwYWxzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInByaW5jaXBhbEtleXNcIiwgXCJwcmluY2lwYWxUeXBlXCIsIFwiYWRkVG9Vc2VySW5mb0xpc3RcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTZWFyY2hQcmluY2lwYWxzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInNlYXJjaFRleHRcIiwgXCJtYXhSZXN1bHRzXCIsIFwicHJpbmNpcGFsVHlwZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFBFUk1JU1NJT04gT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkUGVybWlzc2lvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3ROYW1lXCIsIFwib2JqZWN0VHlwZVwiLCBcInBlcm1pc3Npb25JZGVudGlmaWVyXCIsIFwicGVybWlzc2lvblR5cGVcIiwgXCJwZXJtaXNzaW9uTWFza1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFBlcm1pc3Npb25Db2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9iamVjdE5hbWVcIiwgXCJvYmplY3RUeXBlXCIsIFwicGVybWlzc2lvbnNJbmZvWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UGVybWlzc2lvbkNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib2JqZWN0TmFtZVwiLCBcIm9iamVjdFR5cGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVQZXJtaXNzaW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9iamVjdE5hbWVcIiwgXCJvYmplY3RUeXBlXCIsIFwicGVybWlzc2lvbklkZW50aWZpZXJcIiwgXCJwZXJtaXNzaW9uVHlwZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVBlcm1pc3Npb25Db2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9iamVjdE5hbWVcIiwgXCJvYmplY3RUeXBlXCIsIFwibWVtYmVySWRzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlUGVybWlzc2lvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvYmplY3ROYW1lXCIsIFwib2JqZWN0VHlwZVwiLCBcInBlcm1pc3Npb25JZGVudGlmaWVyXCIsIFwicGVybWlzc2lvblR5cGVcIiwgXCJwZXJtaXNzaW9uTWFza1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFBVQkxJU0hFRExJTktTU0VSVklDRSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRMaW5rc1wiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBTRUFSQ0ggT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UG9ydGFsU2VhcmNoSW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyID0gXCI8XCIgKyBvcHQub3BlcmF0aW9uICsgXCIgeG1sbnM9J2h0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UnPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwiaHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvT2ZmaWNlU2VydmVyL1F1ZXJ5U2VydmljZS9cIiArIG9wdC5vcGVyYXRpb247XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFF1ZXJ5U3VnZ2VzdGlvbnNcIjpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIHhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlJz5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UvXCIgKyBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUoXCJxdWVyeVhtbFwiLCBjb25zdGFudHMuZW5jb2RlWG1sKG9wdC5xdWVyeVhtbCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRTZWFyY2hNZXRhZGF0YVwiOlxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLm9waGVhZGVyID0gXCI8XCIgKyBvcHQub3BlcmF0aW9uICsgXCIgeG1sbnM9J2h0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UnPlwiO1xyXG4gICAgICAgICAgICAgICAgU09BUEFjdGlvbiA9IFwiaHR0cDovL21pY3Jvc29mdC5jb20vd2Vic2VydmljZXMvT2ZmaWNlU2VydmVyL1F1ZXJ5U2VydmljZS9cIiArIG9wdC5vcGVyYXRpb247XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlF1ZXJ5XCI6XHJcbiAgICAgICAgICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCArPSB1dGlscy53cmFwTm9kZShcInF1ZXJ5WG1sXCIsIGNvbnN0YW50cy5lbmNvZGVYbWwob3B0LnF1ZXJ5WG1sKSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlF1ZXJ5RXhcIjpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIHhtbG5zPSdodHRwOi8vbWljcm9zb2Z0LmNvbS93ZWJzZXJ2aWNlcy9PZmZpY2VTZXJ2ZXIvUXVlcnlTZXJ2aWNlJz5cIjtcclxuICAgICAgICAgICAgICAgIFNPQVBBY3Rpb24gPSBcImh0dHA6Ly9taWNyb3NvZnQuY29tL3dlYnNlcnZpY2VzL09mZmljZVNlcnZlci9RdWVyeVNlcnZpY2UvXCIgKyBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUoXCJxdWVyeVhtbFwiLCBjb25zdGFudHMuZW5jb2RlWG1sKG9wdC5xdWVyeVhtbCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZWdpc3RyYXRpb25cIjpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKFwicmVnaXN0cmF0aW9uWG1sXCIsIGNvbnN0YW50cy5lbmNvZGVYbWwob3B0LnJlZ2lzdHJhdGlvblhtbCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTdGF0dXNcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gU0hBUkVQT0lOVERJQUdOT1NUSUNTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIlNlbmRDbGllbnRTY3JpcHRFcnJvclJlcG9ydFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJtZXNzYWdlXCIsIFwiZmlsZVwiLCBcImxpbmVcIiwgXCJjbGllbnRcIiwgXCJzdGFja1wiLCBcInRlYW1cIiwgXCJvcmlnaW5hbEZpbGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBTSVRFREFUQSBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJFbnVtZXJhdGVGb2xkZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3RyRm9sZGVyVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QXR0YWNobWVudHNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3RyTGlzdE5hbWVcIiwgXCJzdHJJdGVtSWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTaXRlRGF0YUdldExpc3RcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3RyTGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB0aGlzIG9wZXJhdGlvbiBoYXMgYSBuYW1lIHdoaWNoIGR1cGxpY2F0ZXMgdGhlIExpc3RzIFdTLCBuZWVkIHRvIGhhbmRsZVxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlID0gY29uc3RhbnRzLnNpdGVEYXRhRml4U09BUEVudmVsb3BlKFNPQVBFbnZlbG9wZSwgb3B0Lm9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlNpdGVEYXRhR2V0TGlzdENvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhpcyBvcGVyYXRpb24gaGFzIGEgbmFtZSB3aGljaCBkdXBsaWNhdGVzIHRoZSBMaXN0cyBXUywgbmVlZCB0byBoYW5kbGVcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZSA9IGNvbnN0YW50cy5zaXRlRGF0YUZpeFNPQVBFbnZlbG9wZShTT0FQRW52ZWxvcGUsIG9wdC5vcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTaXRlRGF0YUdldFNpdGVcIjpcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhpcyBvcGVyYXRpb24gaGFzIGEgbmFtZSB3aGljaCBkdXBsaWNhdGVzIHRoZSBMaXN0cyBXUywgbmVlZCB0byBoYW5kbGVcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZSA9IGNvbnN0YW50cy5zaXRlRGF0YUZpeFNPQVBFbnZlbG9wZShTT0FQRW52ZWxvcGUsIG9wdC5vcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTaXRlRGF0YUdldFNpdGVVcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiVXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIC8vIEJlY2F1c2UgdGhpcyBvcGVyYXRpb24gaGFzIGEgbmFtZSB3aGljaCBkdXBsaWNhdGVzIHRoZSBMaXN0cyBXUywgbmVlZCB0byBoYW5kbGVcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZSA9IGNvbnN0YW50cy5zaXRlRGF0YUZpeFNPQVBFbnZlbG9wZShTT0FQRW52ZWxvcGUsIG9wdC5vcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTaXRlRGF0YUdldFdlYlwiOlxyXG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB0aGlzIG9wZXJhdGlvbiBoYXMgYSBuYW1lIHdoaWNoIGR1cGxpY2F0ZXMgdGhlIExpc3RzIFdTLCBuZWVkIHRvIGhhbmRsZVxyXG4gICAgICAgICAgICAgICAgU09BUEVudmVsb3BlID0gY29uc3RhbnRzLnNpdGVEYXRhRml4U09BUEVudmVsb3BlKFNPQVBFbnZlbG9wZSwgb3B0Lm9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFNJVEVTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkNyZWF0ZVdlYlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIiwgXCJ0aXRsZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwidGVtcGxhdGVOYW1lXCIsIFwibGFuZ3VhZ2VcIiwgXCJsYW5ndWFnZVNwZWNpZmllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibG9jYWxlXCIsIFwibG9jYWxlU3BlY2lmaWVkXCIsIFwiY29sbGF0aW9uTG9jYWxlXCIsIFwiY29sbGF0aW9uTG9jYWxlU3BlY2lmaWVkXCIsIFwidW5pcXVlUGVybWlzc2lvbnNcIixcclxuICAgICAgICAgICAgICAgICAgICBcInVuaXF1ZVBlcm1pc3Npb25zU3BlY2lmaWVkXCIsIFwiYW5vbnltb3VzXCIsIFwiYW5vbnltb3VzU3BlY2lmaWVkXCIsIFwicHJlc2VuY2VcIiwgXCJwcmVzZW5jZVNwZWNpZmllZFwiXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlV2ViXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFNpdGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiU2l0ZVVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFNpdGVUZW1wbGF0ZXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiTENJRFwiLCBcIlRlbXBsYXRlTGlzdFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFNPQ0lBTERBVEFTRVJWSUNFIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZENvbW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwiY29tbWVudFwiLCBcImlzSGlnaFByaW9yaXR5XCIsIFwidGl0bGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRUYWdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwidGVybUlEXCIsIFwidGl0bGVcIiwgXCJpc1ByaXZhdGVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRUYWdCeUtleXdvcmRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwia2V5d29yZFwiLCBcInRpdGxlXCIsIFwiaXNQcml2YXRlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ291bnRDb21tZW50c09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDb3VudENvbW1lbnRzT2ZVc2VyT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckFjY291bnROYW1lXCIsIFwidXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ291bnRDb21tZW50c09uVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50UmF0aW5nc09uVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50VGFnc09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVDb21tZW50XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcImxhc3RNb2RpZmllZFRpbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVSYXRpbmdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlVGFnXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybFwiLCBcInRlcm1JRFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVRhZ0J5S2V5d29yZFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIiwgXCJrZXl3b3JkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlVGFnc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGxUYWdUZXJtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEFsbFRhZ1Rlcm1zRm9yVXJsRm9sZGVyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVybEZvbGRlclwiLCBcIm1heGltdW1JdGVtc1RvUmV0dXJuXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0QWxsVGFnVXJsc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ0ZXJtSURcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGxUYWdVcmxzQnlLZXl3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImtleXdvcmRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb21tZW50c09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIiwgXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiLCBcInN0YXJ0SW5kZXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb21tZW50c09mVXNlck9uVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJBY2NvdW50TmFtZVwiLCBcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENvbW1lbnRzT25VcmxcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwibWF4aW11bUl0ZW1zVG9SZXR1cm5cIiwgXCJzdGFydEluZGV4XCJdKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0LmV4Y2x1ZGVJdGVtc1RpbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgb3B0LmV4Y2x1ZGVJdGVtc1RpbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKFwiZXhjbHVkZUl0ZW1zVGltZVwiLCBvcHQuZXhjbHVkZUl0ZW1zVGltZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJhdGluZ0F2ZXJhZ2VPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSYXRpbmdPZlVzZXJPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIiwgXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSYXRpbmdPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSYXRpbmdzT2ZVc2VyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJBY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFJhdGluZ3NPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRTb2NpYWxEYXRhRm9yRnVsbFJlcGxpY2F0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJBY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ3NcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnc09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyQWNjb3VudE5hbWVcIiwgXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiLCBcInN0YXJ0SW5kZXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUYWdUZXJtc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ1Rlcm1zT2ZVc2VyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJBY2NvdW50TmFtZVwiLCBcIm1heGltdW1JdGVtc1RvUmV0dXJuXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnVGVybXNPblVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1cmxcIiwgXCJtYXhpbXVtSXRlbXNUb1JldHVyblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRhZ1VybHNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widGVybUlEXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnVXJsc0J5S2V5d29yZFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJrZXl3b3JkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGFnVXJsc09mVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ0ZXJtSURcIiwgXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRUYWdVcmxzT2ZVc2VyQnlLZXl3b3JkXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImtleXdvcmRcIiwgXCJ1c2VyQWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJTZXRSYXRpbmdcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwicmF0aW5nXCIsIFwidGl0bGVcIiwgXCJhbmFseXNpc0RhdGFFbnRyeVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbW1lbnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXJsXCIsIFwibGFzdE1vZGlmaWVkVGltZVwiLCBcImNvbW1lbnRcIiwgXCJpc0hpZ2hQcmlvcml0eVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFNQRUxMQ0hFQ0sgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiU3BlbGxDaGVja1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJjaHVua3NUb1NwZWxsXCIsIFwiZGVjbGFyZWRMYW5ndWFnZVwiLCBcInVzZUxhZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFRBWE9OT01ZIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFRlcm1zXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInNoYXJlZFNlcnZpY2VJZFwiLCBcInRlcm1TZXRJZFwiLCBcImxjaWRcIiwgXCJuZXdUZXJtc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENoaWxkVGVybXNJblRlcm1cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wic3NwSWRcIiwgXCJsY2lkXCIsIFwidGVybUlkXCIsIFwidGVybVNldElkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q2hpbGRUZXJtc0luVGVybVNldFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJzc3BJZFwiLCBcImxjaWRcIiwgXCJ0ZXJtU2V0SWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRLZXl3b3JkVGVybXNCeUd1aWRzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInRlcm1JZHNcIiwgXCJsY2lkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VGVybXNCeUxhYmVsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImxhYmVsXCIsIFwibGNpZFwiLCBcIm1hdGNoT3B0aW9uXCIsIFwicmVzdWx0Q29sbGVjdGlvblNpemVcIiwgXCJ0ZXJtSWRzXCIsIFwiYWRkSWZOb3RGb3VuZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRlcm1TZXRzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInNoYXJlZFNlcnZpY2VJZHNcIiwgXCJ0ZXJtU2V0SWRzXCIsIFwibGNpZFwiLCBcImNsaWVudFRpbWVTdGFtcHNcIiwgXCJjbGllbnRWZXJzaW9uc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFVTRVJTIEFORCBHUk9VUFMgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCIsIFwib3duZXJJZGVudGlmaWVyXCIsIFwib3duZXJUeXBlXCIsIFwiZGVmYXVsdFVzZXJMb2dpbk5hbWVcIiwgXCJkZXNjcmlwdGlvblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZEdyb3VwVG9Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZVwiLCBcInJvbGVOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwicGVybWlzc2lvbk1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRSb2xlRGVmXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCIsIFwiZGVzY3JpcHRpb25cIiwgXCJwZXJtaXNzaW9uTWFza1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFVzZXJDb2xsZWN0aW9uVG9Hcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIiwgXCJ1c2Vyc0luZm9YbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRVc2VyQ29sbGVjdGlvblRvUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiLCBcInVzZXJzSW5mb1htbFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFVzZXJUb0dyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZVwiLCBcInVzZXJOYW1lXCIsIFwidXNlckxvZ2luTmFtZVwiLCBcInVzZXJFbWFpbFwiLCBcInVzZXJOb3Rlc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFVzZXJUb1JvbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIiwgXCJ1c2VyTmFtZVwiLCBcInVzZXJMb2dpbk5hbWVcIiwgXCJ1c2VyRW1haWxcIiwgXCJ1c2VyTm90ZXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGxVc2VyQ29sbGVjdGlvbkZyb21XZWJcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0R3JvdXBDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZXNYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRHcm91cENvbGxlY3Rpb25Gcm9tUm9sZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEdyb3VwQ29sbGVjdGlvbkZyb21TaXRlXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEdyb3VwQ29sbGVjdGlvbkZyb21Vc2VyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRHcm91cENvbGxlY3Rpb25Gcm9tV2ViXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEdyb3VwSW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSb2xlQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJyb2xlTmFtZXNYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSb2xlQ29sbGVjdGlvbkZyb21Hcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSb2xlQ29sbGVjdGlvbkZyb21Vc2VyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSb2xlQ29sbGVjdGlvbkZyb21XZWJcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZUluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRSb2xlc0FuZFBlcm1pc3Npb25zRm9yQ3VycmVudFVzZXJcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Um9sZXNBbmRQZXJtaXNzaW9uc0ZvclNpdGVcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckNvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckxvZ2luTmFtZXNYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyQ29sbGVjdGlvbkZyb21Hcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyQ29sbGVjdGlvbkZyb21Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckNvbGxlY3Rpb25Gcm9tU2l0ZVwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRVc2VyQ29sbGVjdGlvbkZyb21XZWJcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckxvZ2luTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJMb2dpbkZyb21FbWFpbFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJlbWFpbFhtbFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUdyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImdyb3VwTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUdyb3VwRnJvbVJvbGVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicm9sZU5hbWVcIiwgXCJncm91cE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVSb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckNvbGxlY3Rpb25Gcm9tR3JvdXBcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3JvdXBOYW1lXCIsIFwidXNlckxvZ2luTmFtZXNYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVVc2VyQ29sbGVjdGlvbkZyb21Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCIsIFwidXNlckxvZ2luTmFtZXNYbWxcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVVc2VyQ29sbGVjdGlvbkZyb21TaXRlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInVzZXJMb2dpbk5hbWVzWG1sXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckZyb21Hcm91cFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJncm91cE5hbWVcIiwgXCJ1c2VyTG9naW5OYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckZyb21Sb2xlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInJvbGVOYW1lXCIsIFwidXNlckxvZ2luTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZVVzZXJGcm9tU2l0ZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyTG9naW5OYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlVXNlckZyb21XZWJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1widXNlckxvZ2luTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUdyb3VwSW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJvbGRHcm91cE5hbWVcIiwgXCJncm91cE5hbWVcIiwgXCJvd25lcklkZW50aWZpZXJcIiwgXCJvd25lclR5cGVcIiwgXCJkZXNjcmlwdGlvblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZVJvbGVEZWZJbmZvXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9sZFJvbGVOYW1lXCIsIFwicm9sZU5hbWVcIiwgXCJkZXNjcmlwdGlvblwiLCBcInBlcm1pc3Npb25NYXNrXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlUm9sZUluZm9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wib2xkUm9sZU5hbWVcIiwgXCJyb2xlTmFtZVwiLCBcImRlc2NyaXB0aW9uXCIsIFwicGVybWlzc2lvbk1hc2tcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVVc2VySW5mb1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJ1c2VyTG9naW5OYW1lXCIsIFwidXNlck5hbWVcIiwgXCJ1c2VyRW1haWxcIiwgXCJ1c2VyTm90ZXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBVU0VSUFJPRklMRVNFUlZJQ0UgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkQ29sbGVhZ3VlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwiY29sbGVhZ3VlQWNjb3VudE5hbWVcIiwgXCJncm91cFwiLCBcInByaXZhY3lcIiwgXCJpc0luV29ya0dyb3VwXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkTGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcIm5hbWVcIiwgXCJ1cmxcIiwgXCJncm91cFwiLCBcInByaXZhY3lcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRNZW1iZXJzaGlwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwibWVtYmVyc2hpcEluZm9cIiwgXCJncm91cFwiLCBcInByaXZhY3lcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRQaW5uZWRMaW5rXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCIsIFwibmFtZVwiLCBcInVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNyZWF0ZU1lbWJlckdyb3VwXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm1lbWJlcnNoaXBJbmZvXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQ3JlYXRlVXNlclByb2ZpbGVCeUFjY291bnROYW1lXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q29tbW9uQ29sbGVhZ3Vlc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENvbW1vbk1hbmFnZXJcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb21tb25NZW1iZXJzaGlwc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldEluQ29tbW9uXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0UHJvcGVydHlDaG9pY2VMaXN0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInByb3BlcnR5TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJDb2xsZWFndWVzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlckxpbmtzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlck1lbWJlcnNoaXBzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlclBpbm5lZExpbmtzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlclByb2ZpbGVCeUd1aWRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZ3VpZFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9maWxlQnlJbmRleFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJpbmRleFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9maWxlQnlOYW1lXCI6XHJcbiAgICAgICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhpcyBvcGVyYXRpb24gaXMgaW5jb25zaXN0ZW50IHdpdGggdGhlIG90aGVycywgdXNpbmcgQWNjb3VudE5hbWUgcmF0aGVyIHRoYW4gYWNjb3VudE5hbWVcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0LmFjY291bnROYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIG9wdC5hY2NvdW50TmFtZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcIkFjY291bnROYW1lXCIsIFwiYWNjb3VudE5hbWVcIl1cclxuICAgICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJBY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFVzZXJQcm9maWxlQ291bnRcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlclByb2ZpbGVTY2hlbWFcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0VXNlclByb3BlcnR5QnlBY2NvdW50TmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcInByb3BlcnR5TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIk1vZGlmeVVzZXJQcm9wZXJ0eUJ5QWNjb3VudE5hbWVcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJuZXdEYXRhXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlQWxsQ29sbGVhZ3Vlc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUFsbExpbmtzXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlQWxsTWVtYmVyc2hpcHNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZW1vdmVBbGxQaW5uZWRMaW5rc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlJlbW92ZUNvbGxlYWd1ZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImNvbGxlYWd1ZUFjY291bnROYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlTGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlTWVtYmVyc2hpcFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcInNvdXJjZUludGVybmFsXCIsIFwic291cmNlUmVmZXJlbmNlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVtb3ZlUGlubmVkTGlua1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImlkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlQ29sbGVhZ3VlUHJpdmFjeVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImNvbGxlYWd1ZUFjY291bnROYW1lXCIsIFwibmV3UHJpdmFjeVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUxpbmtcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJkYXRhXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlTWVtYmVyc2hpcFByaXZhY3lcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiYWNjb3VudE5hbWVcIiwgXCJzb3VyY2VJbnRlcm5hbFwiLCBcInNvdXJjZVJlZmVyZW5jZVwiLCBcIm5ld1ByaXZhY3lcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVQaW5uZWRMaW5rIFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJhY2NvdW50TmFtZVwiLCBcImRhdGFcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBWRVJTSU9OUyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVBbGxWZXJzaW9uc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJmaWxlTmFtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlbGV0ZVZlcnNpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZmlsZU5hbWVcIiwgXCJmaWxlVmVyc2lvblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFZlcnNpb25zXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImZpbGVOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiUmVzdG9yZVZlcnNpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZmlsZU5hbWVcIiwgXCJmaWxlVmVyc2lvblwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIFZJRVcgT1BFUkFUSU9OU1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkVmlld1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCIsIFwidmlld0ZpZWxkc1wiLCBcInF1ZXJ5XCIsIFwicm93TGltaXRcIiwgXCJ0eXBlXCIsIFwibWFrZVZpZXdEZWZhdWx0XCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVsZXRlVmlld1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Vmlld1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Vmlld0NvbGxlY3Rpb25cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibGlzdE5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRWaWV3SHRtbFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXBkYXRlVmlld1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCIsIFwidmlld1Byb3BlcnRpZXNcIiwgXCJxdWVyeVwiLCBcInZpZXdGaWVsZHNcIiwgXCJhZ2dyZWdhdGlvbnNcIiwgXCJmb3JtYXRzXCIsIFwicm93TGltaXRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVcGRhdGVWaWV3SHRtbFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJsaXN0TmFtZVwiLCBcInZpZXdOYW1lXCIsIFwidmlld1Byb3BlcnRpZXNcIiwgXCJ0b29sYmFyXCIsIFwidmlld0hlYWRlclwiLCBcInZpZXdCb2R5XCIsIFwidmlld0Zvb3RlclwiLCBcInZpZXdFbXB0eVwiLCBcInJvd0xpbWl0RXhjZWVkZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcInF1ZXJ5XCIsIFwidmlld0ZpZWxkc1wiLCBcImFnZ3JlZ2F0aW9uc1wiLCBcImZvcm1hdHNcIiwgXCJyb3dMaW1pdFwiXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgLy8gV0VCUEFSVFBBR0VTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIkFkZFdlYlBhcnRcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wicGFnZVVybFwiLCBcIndlYlBhcnRYbWxcIiwgXCJzdG9yYWdlXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQWRkV2ViUGFydFRvWm9uZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwid2ViUGFydFhtbFwiLCBcInN0b3JhZ2VcIiwgXCJ6b25lSWRcIiwgXCJ6b25lSW5kZXhcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEZWxldGVXZWJQYXJ0XCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJzdG9yYWdlS2V5XCIsIFwic3RvcmFnZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdlYlBhcnQyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJzdG9yYWdlS2V5XCIsIFwic3RvcmFnZVwiLCBcImJlaGF2aW9yXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0V2ViUGFydFBhZ2VcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZG9jdW1lbnROYW1lXCIsIFwiYmVoYXZpb3JcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRXZWJQYXJ0UHJvcGVydGllc1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwic3RvcmFnZVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdlYlBhcnRQcm9wZXJ0aWVzMlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJwYWdlVXJsXCIsIFwic3RvcmFnZVwiLCBcImJlaGF2aW9yXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU2F2ZVdlYlBhcnQyXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcInBhZ2VVcmxcIiwgXCJzdG9yYWdlS2V5XCIsIFwid2ViUGFydFhtbFwiLCBcInN0b3JhZ2VcIiwgXCJhbGxvd1R5cGVDaGFuZ2VcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBXRUJTIE9QRVJBVElPTlNcclxuICAgICAgICAgICAgY2FzZSBcIldlYnNDcmVhdGVDb250ZW50VHlwZVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJkaXNwbGF5TmFtZVwiLCBcInBhcmVudFR5cGVcIiwgXCJuZXdGaWVsZHNcIiwgXCJjb250ZW50VHlwZVByb3BlcnRpZXNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb2x1bW5zXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIndlYlVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldENvbnRlbnRUeXBlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImNvbnRlbnRUeXBlSWRcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRDb250ZW50VHlwZXNcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0Q3VzdG9taXplZFBhZ2VTdGF0dXNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiZmlsZVVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldExpc3RUZW1wbGF0ZXNcIjpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0T2JqZWN0SWRGcm9tVXJsXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcIm9iamVjdFVybFwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFdlYlwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgW1wid2ViVXJsXCIsIFwid2ViVVJMXCJdXHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0V2ViQ29sbGVjdGlvblwiOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJHZXRBbGxTdWJXZWJDb2xsZWN0aW9uXCI6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVwZGF0ZUNvbHVtbnNcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wibmV3RmllbGRzXCIsIFwidXBkYXRlRmllbGRzXCIsIFwiZGVsZXRlRmllbGRzXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiV2Vic1VwZGF0ZUNvbnRlbnRUeXBlXCI6XHJcbiAgICAgICAgICAgICAgICB1dGlscy5hZGRUb1BheWxvYWQob3B0LCBTT0FQRW52ZWxvcGUsIFtcImNvbnRlbnRUeXBlSWRcIiwgXCJjb250ZW50VHlwZVByb3BlcnRpZXNcIiwgXCJuZXdGaWVsZHNcIiwgXCJ1cGRhdGVGaWVsZHNcIiwgXCJkZWxldGVGaWVsZHNcIl0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJXZWJVcmxGcm9tUGFnZVVybFwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgW1wicGFnZVVybFwiLCBcInBhZ2VVUkxcIl1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBXT1JLRkxPVyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBbHRlclRvRG9cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiLCBcInRvZG9JZFwiLCBcInRvZG9MaXN0SWRcIiwgXCJ0YXNrRGF0YVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNsYWltUmVsZWFzZVRhc2tcIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiLCBcInRhc2tJZFwiLCBcImxpc3RJZFwiLCBcImZDbGFpbVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRlbXBsYXRlc0Zvckl0ZW1cIjpcclxuICAgICAgICAgICAgICAgIHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsIFNPQVBFbnZlbG9wZSwgW1wiaXRlbVwiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkdldFRvRG9zRm9ySXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJpdGVtXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0V29ya2Zsb3dEYXRhRm9ySXRlbVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJpdGVtXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiR2V0V29ya2Zsb3dUYXNrRGF0YVwiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJpdGVtXCIsIFwibGlzdElkXCIsIFwidGFza0lkXCJdKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiU3RhcnRXb3JrZmxvd1wiOlxyXG4gICAgICAgICAgICAgICAgdXRpbHMuYWRkVG9QYXlsb2FkKG9wdCwgU09BUEVudmVsb3BlLCBbXCJpdGVtXCIsIFwidGVtcGxhdGVJZFwiLCBcIndvcmtmbG93UGFyYW1ldGVyc1wiXSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdsdWUgdG9nZXRoZXIgdGhlIHBpZWNlcyBvZiB0aGUgU09BUCBtZXNzYWdlXHJcbiAgICAgICAgdmFyIG1zZyA9IFNPQVBFbnZlbG9wZS5oZWFkZXIgKyBTT0FQRW52ZWxvcGUub3BoZWFkZXIgKyBTT0FQRW52ZWxvcGUucGF5bG9hZCArIFNPQVBFbnZlbG9wZS5vcGZvb3RlciArIFNPQVBFbnZlbG9wZS5mb290ZXI7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB3ZSd2ZSBhbHJlYWR5IGNhY2hlZCB0aGUgcmVzdWx0c1xyXG4gICAgICAgIHZhciBjYWNoZWRQcm9taXNlO1xyXG4gICAgICAgIGlmIChvcHQuY2FjaGVYTUwpIHtcclxuICAgICAgICAgICAgY2FjaGVkUHJvbWlzZSA9IHByb21pc2VzQ2FjaGVbbXNnXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERvIHdlIGhhdmUgYW55IGN1c3RvbUhlYWRlcnM/XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBvcHQuY3VzdG9tSGVhZGVycyA/IG9wdC5jdXN0b21IZWFkZXJzIDoge307XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgY2FjaGVkUHJvbWlzZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cclxuICAgICAgICAgICAgLy8gRmluYWxseSwgbWFrZSB0aGUgQWpheCBjYWxsXHJcbiAgICAgICAgICAgIHZhciBwID0gJC5hamF4KHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSByZWxhdGl2ZSBVUkwgZm9yIHRoZSBBSkFYIGNhbGxcclxuICAgICAgICAgICAgICAgIHVybDogYWpheFVSTCxcclxuICAgICAgICAgICAgICAgIC8vIEJ5IGRlZmF1bHQsIHRoZSBBSkFYIGNhbGxzIGFyZSBhc3luY2hyb25vdXMuICBZb3UgY2FuIHNwZWNpZnkgZmFsc2UgdG8gcmVxdWlyZSBhIHN5bmNocm9ub3VzIGNhbGwuXHJcbiAgICAgICAgICAgICAgICBhc3luYzogb3B0LmFzeW5jLFxyXG4gICAgICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgcGFzcyBpbiBoZWFkZXJzXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgLy8gQmVmb3JlIHNlbmRpbmcgdGhlIG1zZywgbmVlZCB0byBzZW5kIHRoZSByZXF1ZXN0IGhlYWRlclxyXG4gICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIG5lZWQgdG8gcGFzcyB0aGUgU09BUEFjdGlvbiwgZG8gc29cclxuICAgICAgICAgICAgICAgICAgICBpZiAoV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJTT0FQQWN0aW9uXCIsIFNPQVBBY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBBbHdheXMgYSBQT1NUXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIC8vIEhlcmUgaXMgdGhlIFNPQVAgcmVxdWVzdCB3ZSd2ZSBidWlsdCBhYm92ZVxyXG4gICAgICAgICAgICAgICAgZGF0YTogbXNnLFxyXG4gICAgICAgICAgICAgICAgLy8gV2UncmUgZ2V0dGluZyBYTUw7IHRlbGwgalF1ZXJ5IHNvIHRoYXQgaXQgZG9lc24ndCBuZWVkIHRvIGRvIGEgYmVzdCBndWVzc1xyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwieG1sXCIsXHJcbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhpcyBpcyBpdHMgY29udGVudCB0eXBlXHJcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogXCJ0ZXh0L3htbDtjaGFyc2V0PSd1dGYtOCdcIixcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoeERhdGEsIFN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIGNhbGwgaXMgY29tcGxldGUsIGNhbGwgdGhlIGNvbXBsZXRlZnVuYyBpZiB0aGVyZSBpcyBvbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdC5jb21wbGV0ZWZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoeERhdGEsIFN0YXR1cyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmKG9wdC5jYWNoZVhNTCkge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZXNDYWNoZVttc2ddID0gcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSBwcm9taXNlXHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY29tcGxldGVmdW5jIGlmIHRoZXJlIGlzIG9uZVxyXG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG9wdC5jb21wbGV0ZWZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICBjYWNoZWRQcm9taXNlLmRvbmUoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBqcVhIUil7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LmNvbXBsZXRlZnVuYyhqcVhIUiwgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgY2FjaGVkIHByb21pc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXNcclxuICAgIFxyXG4gICAgLy9NYWluIGZ1bmN0aW9uIHdoaWNoIGNhbGxzIE5pbnRleCdzIFdlYiBTZXJ2aWNlcyBkaXJlY3RseVxyXG4gICAgJC5mbi5OaW50ZXhTZXJ2aWNlcyA9IGZ1bmN0aW9uIChvcHRpb25zKVxyXG4gICAge1xyXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBvcHRpb25zIHBhc3NlZCBpbiwgdXNlIHRoZSBkZWZhdWx0cy4gIEV4dGVuZCByZXBsYWNlcyBlYWNoIGRlZmF1bHQgd2l0aCB0aGUgcGFzc2VkIG9wdGlvbi5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sICQuZm4uU1BTZXJ2aWNlcy5kZWZhdWx0cywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEVuY29kZSBvcHRpb25zIHdoaWNoIG1heSBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVyLCBlc3AuIGFtcGVyc2FuZFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5jb2RlT3B0aW9uTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdFtlbmNvZGVPcHRpb25MaXN0W2ldXSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgb3B0W2VuY29kZU9wdGlvbkxpc3RbaV1dID0gdXRpbHMuZW5jb2RlWG1sKG9wdFtlbmNvZGVPcHRpb25MaXN0W2ldXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ly9lbmQgZm9yXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gUHV0IHRvZ2V0aGVyIG9wZXJhdGlvbiBoZWFkZXIgYW5kIFNPQVBBY3Rpb24gZm9yIHRoZSBTT0FQIGNhbGwgYmFzZWQgb24gd2hpY2ggV2ViIFNlcnZpY2Ugd2UncmUgY2FsbGluZ1xyXG4gICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciA9IFwiPFwiICsgb3B0Lm9wZXJhdGlvbiArIFwiIFwiO1xyXG4gICAgICAgIHN3aXRjaCAoV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMF0pIHtcclxuICAgICAgICAgICAgY2FzZSB3ZWJTZXJ2aWNlcy5OSU5URVhXT1JLRkxPVzpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFOaW50ZXggKyBcIic+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQU5pbnRleCArIFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7ICAgICAgICAgICAgXHRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArPSBcInhtbG5zPSdcIiArIGNvbnN0YW50cy5TQ0hFTUFOaW50ZXggKyBcIi9zb2FwLyc+XCI7XHJcbiAgICAgICAgICAgICAgICBTT0FQQWN0aW9uID0gY29uc3RhbnRzLlNDSEVNQU5pbnRleCArIFwiL3NvYXAvXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9Ly9lbmQgc3dpdGNoXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gQWRkIHRoZSBvcGVyYXRpb24gdG8gdGhlIFNPQVBBY3Rpb24gYW5kIG9wZm9vdGVyXHJcbiAgICAgICAgU09BUEFjdGlvbiArPSBvcHQub3BlcmF0aW9uO1xyXG4gICAgICAgIFNPQVBFbnZlbG9wZS5vcGZvb3RlciA9IFwiPC9cIiArIG9wdC5vcGVyYXRpb24gKyBcIj5cIjtcclxuXHJcbiAgICAgICAgLy8gQnVpbGQgdGhlIFVSTCBmb3IgdGhlIEFqYXggY2FsbCBiYXNlZCBvbiB3aGljaCBvcGVyYXRpb24gd2UncmUgY2FsbGluZ1xyXG4gICAgICAgIC8vIElmIHRoZSB3ZWJVUkwgaGFzIGJlZW4gcHJvdmlkZWQsIHRoZW4gdXNlIGl0LCBlbHNlIHVzZSB0aGUgY3VycmVudCBzaXRlXHJcbiAgICAgICAgdmFyIGFqYXhVUkwgPSBcIl92dGlfYmluL1wiICsgV1NvcHNbb3B0Lm9wZXJhdGlvbl1bMF0gKyBcIi5hc214XCI7XHJcbiAgICAgICAgdmFyIHRoaXNTaXRlID0gJCgpLlNQU2VydmljZXMuU1BHZXRDdXJyZW50U2l0ZSgpO1xyXG4gICAgICAgIHZhciB3ZWJVUkwgPSBvcHQud2ViVVJMICE9PSB1bmRlZmluZWQgPyBvcHQud2ViVVJMIDogb3B0LndlYlVybDtcclxuICAgICAgICBpZiAod2ViVVJMLmNoYXJBdCh3ZWJVUkwubGVuZ3RoIC0gMSkgPT09IGNvbnN0YW50cy5TTEFTSCkge1xyXG4gICAgICAgICAgICBhamF4VVJMID0gd2ViVVJMICsgYWpheFVSTDtcclxuICAgICAgICB9IGVsc2UgaWYgKHdlYlVSTC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGFqYXhVUkwgPSB3ZWJVUkwgKyBjb25zdGFudHMuU0xBU0ggKyBhamF4VVJMO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFqYXhVUkwgPSB0aGlzU2l0ZSArICgodGhpc1NpdGUuY2hhckF0KHRoaXNTaXRlLmxlbmd0aCAtIDEpID09PSBjb25zdGFudHMuU0xBU0gpID8gYWpheFVSTCA6IChjb25zdGFudHMuU0xBU0ggKyBhamF4VVJMKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTT0FQRW52ZWxvcGUucGF5bG9hZCA9IFwiXCI7XHJcbiAgICAgICAgLy8gRWFjaCBvcGVyYXRpb24gcmVxdWlyZXMgYSBkaWZmZXJlbnQgc2V0IG9mIHZhbHVlcy4gIFRoaXMgc3dpdGNoIHN0YXRlbWVudCBzZXRzIHRoZW0gdXAgaW4gdGhlIFNPQVBFbnZlbG9wZS5wYXlsb2FkLlxyXG4gICAgICAgIHN3aXRjaCAob3B0Lm9wZXJhdGlvbikge1xyXG4gICAgICAgICAgICAvL05JTlRFWCBXT1JLRkxPVyBPUEVSQVRJT05TXHJcbiAgICAgICAgICAgIGNhc2UgXCJBZGRMb25nVGVybURlbGVnYXRpb25SdWxlXCI6XHJcbiAgICAgICAgICAgIFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmcm9tVGhlQmVnaW5uaW5nT2ZcIixcInVudGlsVGhlRW5kT2ZcIixcImRlbGVnYXRlRnJvbVwiLFwiZGVsZWdhdGVUb1wiLFwiY3VycmVudFNpdGVPbmx5XCJdKTtcclxuICAgICAgICAgICAgXHRicmVhaztcclxuXHRcdFx0Y2FzZSBcIkFkZFdvcmtmbG93U2NoZWR1bGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIixcIndvcmtmbG93TmFtZVwiLFwic3RhcnREYXRhWG1sXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjxzY2hlZHVsZT5cIjtcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIk1heGltdW1SZXBlYXRzXCIsXCJXb3JrZGF5c09ubHlcIl0pO1xyXG5cdFx0XHRcdFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPFJlcGVhdEludGVydmFsPlwiO1xyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiVHlwZVwiLFwiQ291bnRCZXR3ZWVuSW50ZXJ2YWxzXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvUmVwZWF0SW50ZXJ2YWw+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJFbmRPblwiLFwiU3RhcnRUaW1lXCIsXCJFbmRUaW1lXCJdKTtcclxuXHRcdFx0XHRTT0FQRW52ZWxvcGUucGF5bG9hZCArPSBcIjwvc2NoZWR1bGU+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ1cGRhdGVJZkV4aXN0c1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgXCJBZGRXb3JrZmxvd1NjaGVkdWxlT25MaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaXRlbUlkXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzdGFydERhdGFYTUxcIl0pO1xyXG5cdFx0XHRcdFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPHNjaGVkdWxlPlwiO1xyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiTWF4aW11bVJlcGVhdHNcIixcIldvcmtkYXlzT25seVwiXSk7XHJcblx0XHRcdFx0U09BUEVudmVsb3BlLnBheWxvYWQgKz0gXCI8UmVwZWF0SW50ZXJ2YWw+XCI7XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJUeXBlXCIsXCJDb3VudEJldHdlZW5JbnRlcnZhbHNcIl0pO1xyXG5cdFx0XHRcdFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPC9SZXBlYXRJbnRlcnZhbD5cIjtcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIkVuZE9uXCIsXCJTdGFydFRpbWVcIixcIkVuZFRpbWVcIl0pO1xyXG5cdFx0XHRcdFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IFwiPC9zY2hlZHVsZT5cIjtcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInVwZGF0ZUlmRXhpc3RzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJDaGVja0dsb2JhbFJldXNlU3RhdHVzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd05hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcclxuXHRcdFx0Y2FzZSBcIkNoZWNrSW5Gb3Jtc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dDb25maWd1cmF0aW9uXCIsXCJhY3Rpdml0eUNvbmZpZ3VyYXRpb25cIixcImZvcm1UeXBlXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHJcblx0XHRcdGNhc2UgXCJEZWxlZ2F0ZUFsbFRhc2tzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJjdXJyZW50VXNlclwiLFwibmV3VXNlclwiLFwic2VuZE5vdGlmaWNhdGlvblwiLFwiY29tbWVudHNcIixcImdsb2JhbFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFxyXG5cdFx0XHRjYXNlIFwiRGVsZWdhdGVUYXNrXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJzcFRhc2tJZFwiLFwidGFza0xpc3ROYW1lXCIsXCJ0YXJnZXRVc2VyTmFtZVwiLFwiY29tbWVudHNcIixcInNlbmROb3RpZmljYXRpb25cIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiRGVsZXRlTG9uZ1Rlcm1EZWxlZ2F0aW9uUnVsZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJEZWxldGVTbmlwcGV0XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJzbmlwcGV0SWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJEZWxldGVXb3JrZmxvd1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wibGlzdElkXCIsXCJ3b3JrZmxvd0lkXCIsXCJ3b3JrZmxvd1R5cGVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcbiAgICAgICAgICAgIGNhc2UgXCJFeHBvcnRXb3JrZmxvd1wiOlxyXG4gICAgICAgICAgICBcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wibGlzdE5hbWVcIixcIndvcmtmbG93VHlwZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuICAgICAgICAgICAgXHRicmVhaztcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiRml4V29ya2Zsb3dzSW5TaXRlRnJvbVRlbXBsYXRlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJGaXhXb3JrZmxvd3NJblNpdGVGcm9tVGVtcGxhdGVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRGb2xkZXJzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJsaXN0R3VpZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldEl0ZW1zUGVuZGluZ015QXBwcm92YWxcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInVuaXF1ZW5lc3NJbmZvXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0TGlzdENvbnRlbnRUeXBlc1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wibGlzdEd1aWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRPdXRjb21lc0ZvckZsZXhpVGFza1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wic3BUYXNrSWRcIixcInRhc2tMaXN0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFJ1bm5pbmdXb3JrZmxvd1Rhc2tzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJmaWxlVXJsXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0UnVubmluZ1dvcmtmbG93VGFza3NDb2xsZWN0aW9uXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ1c2VybG9naW5cIixcInRlYW1zaXRlVXJsXCIsXCJsaXN0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFJ1bm5pbmdXb3JrZmxvd1Rhc2tzRm9yQ3VycmVudFVzZXJcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0ZvckN1cnJlbnRVc2VyRm9yTGlzdEl0ZW1cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIml0ZW1JZFwiLFwibGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJHZXRSdW5uaW5nV29ya2Zsb3dUYXNrc0Zvckxpc3RJdGVtXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJpdGVtSWRcIixcImxpc3ROYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiR2V0VGFza0RldGFpbHNVc2luZ1N0dWJcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInRhc2tUb2tlblwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFRhc2tTdHVic0ZvckN1cnJlbnRVc2VyXCI6XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFdvcmtmbG93SGlzdG9yeVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiZmlsZVVybFwiLFwic3RhdGVGaWx0ZXJcIixcIndvcmtmbG93TmFtZUZpbHRlclwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIkdldFdvcmtmbG93SGlzdG9yeUZvckxpc3RJdGVtXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJpdGVtSWRcIixcImxpc3ROYW1lXCIsXCJzdGF0ZUZpbHRlclwiLFwid29ya2Zsb3dOYW1lRmlsdGVyXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiSGlkZVRhc2tGb3JBcHByb3ZlclwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiYXBwcm92ZXJJZFwiLFwiY29udGVudERiSWRcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJIaWRlV29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInNpdGVJZFwiLFwiaW5zdGFuY2VJZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlByb2Nlc3NGbGV4aVRhc2tSZXNwb25zZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiY29tbWVudHNcIixcIm91dGNvbWVcIixcInNwVGFza0lkXCIsXCJ0YXNrTGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQcm9jZXNzRmxleGlUYXNrUmVzcG9uc2UyXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJjb21tZW50c1wiLFwib3V0Y29tZVwiLFwic3BUYXNrSWRcIixcInRhc2tMaXN0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlByb2Nlc3NUYXNrUmVzcG9uc2VcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImNvbW1lbnRzXCIsXCJvdXRjb21lXCIsXCJzcFRhc2tJZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgXCJQcm9jZXNzVGFza1Jlc3BvbnNlMlwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiY29tbWVudHNcIixcIm91dGNvbWVcIixcInNwVGFza0lkXCIsXCJ0YXNrTGlzdE5hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcclxuXHRcdFx0Y2FzZSBcIlByb2Nlc3NUYXNrUmVzcG9uc2UzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJjb21tZW50c1wiLFwib3V0Y29tZVwiLFwic3BUYXNrSWRcIixcInRhc2tMaXN0TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiUHJvY2Vzc1Rhc2tSZXNwb25zZVVzaW5nVG9rZW5cIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImNvbW1lbnRzXCIsXCJvdXRjb21lXCIsXCJ0YXNrVG9rZW5cIixcImN1c3RvbU91dGNvbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQdWJsaXNoRnJvbU5XRlwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZOb092ZXJ3cml0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZTa2lwVmFsaWRhdGlvblwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZTa2lwVmFsaWRhdGlvbk5vT3ZlcndyaXRlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0ZpbGVcIixcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd05hbWVcIixcInNhdmVJZkNhbm5vdFB1Ymxpc2hcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJQdWJsaXNoRnJvbU5XRlhtbFwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZYbWxOb092ZXJ3cml0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiUHVibGlzaEZyb21OV0ZYbWxTa2lwVmFsaWRhdGlvblwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJzYXZlSWZDYW5ub3RQdWJsaXNoXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHJcblx0XHRcdGNhc2UgXCJQdWJsaXNoRnJvbU5XRlhtbFNraXBWYWxpZGF0aW9uTm9PdmVyd3JpdGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93RmlsZVwiLFwibGlzdE5hbWVcIixcIndvcmtmbG93TmFtZVwiLFwic2F2ZUlmQ2Fubm90UHVibGlzaFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlB1Ymxpc2hXb3JrZmxvd1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid2ZOYW1lXCIsXCJhY3Rpdml0eUNvbmZpZ3NcIixcImxpc3RJZFwiLFwiY29udGVudFR5cGVJZFwiLFwiY2hhbmdlTm90ZXNcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJRdWVyeUZvck1lc3NhZ2VzXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0luc3RhbmNlSWRcIixcIm1lc3NhZ2VJZFwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlJlbW92ZVdvcmtmbG93U2NoZWR1bGVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIixcIndvcmtmbG93TmFtZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0Y2FzZSBcIlJlbW92ZVdvcmtmbG93U2NoZWR1bGVPbkxpc3RJdGVtXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJpdGVtSWRcIixcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd05hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVGcm9tTldGXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0ZpbGVcIixcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd05hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJTYXZlRnJvbU5XRk5vT3ZlcndyaXRlXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3b3JrZmxvd0ZpbGVcIixcImxpc3ROYW1lXCIsXCJ3b3JrZmxvd05hbWVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJTYXZlRnJvbU5XRlhtbFwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZUZyb21OV0ZYbWxOb092ZXJ3cml0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wid29ya2Zsb3dGaWxlXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZVNuaXBwZXRcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInNuaXBwZXROYW1lXCIsXCJhY3Rpdml0eUNvbmZpZ3NcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcclxuXHRcdFx0Y2FzZSBcIlNhdmVUZW1wbGF0ZVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1widGVtcGxhdGVOYW1lXCIsXCJ0ZW1wbGF0ZURlc2NyaXB0aW9uXCIsXCJjYXRlZ29yeVwiLFwiYWN0aXZpdHlDb25maWdzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZVRlbXBsYXRlMlwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1widGVtcGxhdGVOYW1lXCIsXCJ0ZW1wbGF0ZURlc2NyaXB0aW9uXCIsXCJjYXRlZ29yeVwiLFwiYWN0aXZpdHlDb25maWdzXCIsXCJsY2lkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiU2F2ZVdvcmtmbG93XCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJ3Zk5hbWVcIixcImFjdGl2aXR5Q29uZmlnc1wiLFwibGlzdElkXCIsXCJjb250ZW50VHlwZUlkXCIsXCJjaGFuZ2VOb3Rlc1wiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcclxuXHRcdFx0Y2FzZSBcIlNuaXBwZXRFeGlzdHNcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcInNuaXBwZXROYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFxyXG5cdFx0XHRjYXNlIFwiU3RhcnRTaXRlV29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93TmFtZVwiLFwiYXNzb2NpYXRpb25EYXRhXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiU3RhcnRXb3JrZmxvd1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiZmlsZVVybFwiLFwid29ya2Zsb3dOYW1lXCIsXCJhc3NvY2lhdGlvbkRhdGFcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdGNhc2UgXCJTdGFydFdvcmtmbG93T25MaXN0SXRlbVwiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1wiaXRlbUlkXCIsXCJsaXN0TmFtZVwiLFwid29ya2Zsb3dOYW1lXCIsXCJhc3NvY2lhdGlvbkRhdGFcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJUZW1wbGF0ZUV4aXN0c1wiOlxyXG5cdFx0XHRcdHV0aWxzLmFkZFRvUGF5bG9hZChvcHQsW1widGVtcGxhdGVOYW1lXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiVGVybWluYXRlV29ya2Zsb3dcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImxpc3RJZFwiLFwiaXRlbUlkXCIsXCJpbnN0YW5jZUlkXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiVGVybWluYXRlV29ya2Zsb3dCeU5hbWVcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcImZpbGVVcmxcIixcIndvcmtmbG93TmFtZVwiLFwidGVybWluYXRlUHJldmlvdXNJbnN0YW5jZXNcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHJcblx0XHRcdGNhc2UgXCJUZXJtaW5hdGVXb3JrZmxvd0J5TmFtZUZvckxpc3RJdGVtXCI6XHJcblx0XHRcdFx0dXRpbHMuYWRkVG9QYXlsb2FkKG9wdCxbXCJsaXN0TmFtZVwiLFwiaXRlbUlkXCIsXCJ3b3JrZmxvd05hbWVcIixcInRlcm1pbmF0ZVByZXZpb3VzSW5zdGFuY2VzXCJdKTtcclxuXHRcdFx0XHRicmVhaztcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRjYXNlIFwiV29ya2Zsb3dFeGlzdHNcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93TmFtZVwiLFwibGlzdElkXCIsXCJ3b3JrZmxvd1R5cGVcIl0pO1xyXG5cdFx0XHRcdGJyZWFrO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdGNhc2UgXCJXb3JrZmxvd0Zvcm1Qcm9kdWN0U2VsZWN0ZWRcIjpcclxuXHRcdFx0XHR1dGlscy5hZGRUb1BheWxvYWQob3B0LFtcIndvcmtmbG93Q29uZmlndXJhdGlvblwiLFwiYWN0aXZpdHlDb25maWd1cmF0aW9uXCIsXCJwcm9kdWN0XCIsXCJmb3JtVHlwZVwiXSk7XHJcblx0XHRcdFx0YnJlYWs7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH0vL2VuZCBzd2l0Y2hcclxuXHJcbiAgICAgICAgLy8gR2x1ZSB0b2dldGhlciB0aGUgcGllY2VzIG9mIHRoZSBTT0FQIG1lc3NhZ2VcclxuICAgICAgICB2YXIgbXNnID0gU09BUEVudmVsb3BlLmhlYWRlciArIFNPQVBFbnZlbG9wZS5vcGhlYWRlciArIFNPQVBFbnZlbG9wZS5wYXlsb2FkICsgU09BUEVudmVsb3BlLm9wZm9vdGVyICsgU09BUEVudmVsb3BlLmZvb3RlcjtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHdlJ3ZlIGFscmVhZHkgY2FjaGVkIHRoZSByZXN1bHRzXHJcbiAgICAgICAgdmFyIGNhY2hlZFByb21pc2U7XHJcbiAgICAgICAgaWYgKG9wdC5jYWNoZVhNTCkge1xyXG4gICAgICAgICAgICBjYWNoZWRQcm9taXNlID0gcHJvbWlzZXNDYWNoZVttc2ddO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWNoZWRQcm9taXNlID09PSBcInVuZGVmaW5lZFwiKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBGaW5hbGx5LCBtYWtlIHRoZSBBamF4IGNhbGxcclxuICAgICAgICAgICAgdmFyIHAgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJlbGF0aXZlIFVSTCBmb3IgdGhlIEFKQVggY2FsbFxyXG4gICAgICAgICAgICAgICAgdXJsOiBhamF4VVJMLFxyXG4gICAgICAgICAgICAgICAgLy8gQnkgZGVmYXVsdCwgdGhlIEFKQVggY2FsbHMgYXJlIGFzeW5jaHJvbm91cy4gIFlvdSBjYW4gc3BlY2lmeSBmYWxzZSB0byByZXF1aXJlIGEgc3luY2hyb25vdXMgY2FsbC5cclxuICAgICAgICAgICAgICAgIGFzeW5jOiBvcHQuYXN5bmMsXHJcbiAgICAgICAgICAgICAgICAvLyBCZWZvcmUgc2VuZGluZyB0aGUgbXNnLCBuZWVkIHRvIHNlbmQgdGhlIHJlcXVlc3QgaGVhZGVyXHJcbiAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgbmVlZCB0byBwYXNzIHRoZSBTT0FQQWN0aW9uLCBkbyBzb1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChXU29wc1tvcHQub3BlcmF0aW9uXVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlNPQVBBY3Rpb25cIiwgU09BUEFjdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vIEFsd2F5cyBhIFBPU1RcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgLy8gSGVyZSBpcyB0aGUgU09BUCByZXF1ZXN0IHdlJ3ZlIGJ1aWx0IGFib3ZlXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBtc2csXHJcbiAgICAgICAgICAgICAgICAvLyBXZSdyZSBnZXR0aW5nIFhNTDsgdGVsbCBqUXVlcnkgc28gdGhhdCBpdCBkb2Vzbid0IG5lZWQgdG8gZG8gYSBiZXN0IGd1ZXNzXHJcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJ4bWxcIixcclxuICAgICAgICAgICAgICAgIC8vIGFuZCB0aGlzIGlzIGl0cyBjb250ZW50IHR5cGVcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcInRleHQveG1sO2NoYXJzZXQ9J3V0Zi04J1wiLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICh4RGF0YSwgU3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgY2FsbCBpcyBjb21wbGV0ZSwgY2FsbCB0aGUgY29tcGxldGVmdW5jIGlmIHRoZXJlIGlzIG9uZVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0LmNvbXBsZXRlZnVuYykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0LmNvbXBsZXRlZnVuYyh4RGF0YSwgU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYob3B0LmNhY2hlWE1MKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlc0NhY2hlW21zZ10gPSBwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHByb21pc2VcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBjb21wbGV0ZWZ1bmMgaWYgdGhlcmUgaXMgb25lXHJcbiAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24ob3B0LmNvbXBsZXRlZnVuYykpIHtcclxuICAgICAgICAgICAgICAgIGNhY2hlZFByb21pc2UuZG9uZShmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGpxWEhSKXtcclxuICAgICAgICAgICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKGpxWEhSLCBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgY2FjaGVkIHByb21pc2VcclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFByb21pc2U7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9Oy8vZW5kIE5pbnRleFNlcnZpY2VzXHJcbiAgICBcclxuXHJcbiAgICAvLyBEZWZhdWx0cyBhZGRlZCBhcyBhIGZ1bmN0aW9uIGluIG91ciBsaWJyYXJ5IG1lYW5zIHRoYXQgdGhlIGNhbGxlciBjYW4gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzXHJcbiAgICAvLyBmb3IgdGhlaXIgc2Vzc2lvbiBieSBjYWxsaW5nIHRoaXMgZnVuY3Rpb24uICBFYWNoIG9wZXJhdGlvbiByZXF1aXJlcyBhIGRpZmZlcmVudCBzZXQgb2Ygb3B0aW9ucztcclxuICAgIC8vIHdlIGFsbG93IGZvciBhbGwgaW4gYSBzdGFuZGFyZGl6ZWQgd2F5LlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLmRlZmF1bHRzID0ge1xyXG5cclxuICAgICAgICBjYWNoZVhNTDogZmFsc2UsIC8vIElmIHRydWUsIHdlJ2xsIGNhY2hlIHRoZSBYTUwgcmVzdWx0cyB3aXRoIGpRdWVyeSdzIC5kYXRhKCkgZnVuY3Rpb25cclxuICAgICAgICBvcGVyYXRpb246IFwiXCIsIC8vIFRoZSBXZWIgU2VydmljZSBvcGVyYXRpb25cclxuICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYlxyXG4gICAgICAgIGN1c3RvbUhlYWRlcnM6IHt9LFxyXG4gICAgICAgIG1ha2VWaWV3RGVmYXVsdDogZmFsc2UsIC8vIHRydWUgdG8gbWFrZSB0aGUgdmlldyB0aGUgZGVmYXVsdCB2aWV3IGZvciB0aGUgbGlzdFxyXG5cclxuICAgICAgICAvLyBGb3Igb3BlcmF0aW9ucyByZXF1aXJpbmcgQ0FNTCwgdGhlc2Ugb3B0aW9ucyB3aWxsIG92ZXJyaWRlIGFueSBhYnN0cmFjdGlvbnNcclxuICAgICAgICB2aWV3TmFtZTogXCJcIiwgLy8gVmlldyBuYW1lIGluIENBTUwgZm9ybWF0LlxyXG4gICAgICAgIENBTUxRdWVyeTogXCJcIiwgLy8gUXVlcnkgaW4gQ0FNTCBmb3JtYXRcclxuICAgICAgICBDQU1MVmlld0ZpZWxkczogXCJcIiwgLy8gVmlldyBmaWVsZHMgaW4gQ0FNTCBmb3JtYXRcclxuICAgICAgICBDQU1MUm93TGltaXQ6IDAsIC8vIFJvdyBsaW1pdCBhcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyXHJcbiAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjwvUXVlcnlPcHRpb25zPlwiLCAvLyBRdWVyeSBvcHRpb25zIGluIENBTUwgZm9ybWF0XHJcblxyXG4gICAgICAgIC8vIEFic3RyYWN0aW9ucyBmb3IgQ0FNTCBzeW50YXhcclxuICAgICAgICBiYXRjaENtZDogXCJVcGRhdGVcIiwgLy8gTWV0aG9kIENtZCBmb3IgVXBkYXRlTGlzdEl0ZW1zXHJcbiAgICAgICAgdmFsdWVwYWlyczogW10sIC8vIEZpZWxkbmFtZSAvIEZpZWxkdmFsdWUgcGFpcnMgZm9yIFVwZGF0ZUxpc3RJdGVtc1xyXG5cclxuICAgICAgICAvLyBBcyBvZiB2MC43LjEsIHJlbW92ZWQgYWxsIG9wdGlvbnMgd2hpY2ggd2VyZSBhc3NpZ25lZCBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpXHJcbiAgICAgICAgRGVzdGluYXRpb25VcmxzOiBbXSwgLy8gQXJyYXkgb2YgZGVzdGluYXRpb24gVVJMcyBmb3IgY29weSBvcGVyYXRpb25zXHJcbiAgICAgICAgYmVoYXZpb3I6IFwiVmVyc2lvbjNcIiwgLy8gQW4gU1BXZWJTZXJ2aWNlQmVoYXZpb3IgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBjbGllbnQgc3VwcG9ydHMgV2luZG93cyBTaGFyZVBvaW50IFNlcnZpY2VzIDIuMCBvciBXaW5kb3dzIFNoYXJlUG9pbnQgU2VydmljZXMgMy4wOiB7VmVyc2lvbjIgfCBWZXJzaW9uMyB9XHJcbiAgICAgICAgc3RvcmFnZTogXCJTaGFyZWRcIiwgLy8gQSBTdG9yYWdlIHZhbHVlIGluZGljYXRpbmcgaG93IHRoZSBXZWIgUGFydCBpcyBzdG9yZWQ6IHtOb25lIHwgUGVyc29uYWwgfCBTaGFyZWR9XHJcbiAgICAgICAgb2JqZWN0VHlwZTogXCJMaXN0XCIsIC8vIG9iamVjdFR5cGUgZm9yIG9wZXJhdGlvbnMgd2hpY2ggcmVxdWlyZSBpdFxyXG4gICAgICAgIGNhbmNlbE1lZXRpbmc6IHRydWUsIC8vIHRydWUgdG8gZGVsZXRlIGEgbWVldGluZztmYWxzZSB0byByZW1vdmUgaXRzIGFzc29jaWF0aW9uIHdpdGggYSBNZWV0aW5nIFdvcmtzcGFjZSBzaXRlXHJcbiAgICAgICAgbm9uR3JlZ29yaWFuOiBmYWxzZSwgLy8gdHJ1ZSBpZiB0aGUgY2FsZW5kYXIgaXMgc2V0IHRvIGEgZm9ybWF0IG90aGVyIHRoYW4gR3JlZ29yaWFuO290aGVyd2lzZSwgZmFsc2UuXHJcbiAgICAgICAgZkNsYWltOiBmYWxzZSwgLy8gU3BlY2lmaWVzIGlmIHRoZSBhY3Rpb24gaXMgYSBjbGFpbSBvciBhIHJlbGVhc2UuIFNwZWNpZmllcyB0cnVlIGZvciBhIGNsYWltIGFuZCBmYWxzZSBmb3IgYSByZWxlYXNlLlxyXG4gICAgICAgIHJlY3VycmVuY2VJZDogMCwgLy8gVGhlIHJlY3VycmVuY2UgSUQgZm9yIHRoZSBtZWV0aW5nIHRoYXQgbmVlZHMgaXRzIGFzc29jaWF0aW9uIHJlbW92ZWQuIFRoaXMgcGFyYW1ldGVyIGNhbiBiZSBzZXQgdG8gMCBmb3Igc2luZ2xlLWluc3RhbmNlIG1lZXRpbmdzLlxyXG4gICAgICAgIHNlcXVlbmNlOiAwLCAvLyBBbiBpbnRlZ2VyIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIG9yZGVyaW5nIG9mIHVwZGF0ZXMgaW4gY2FzZSB0aGV5IGFycml2ZSBvdXQgb2Ygc2VxdWVuY2UuIFVwZGF0ZXMgd2l0aCBhIGxvd2VyLXRoYW4tY3VycmVudCBzZXF1ZW5jZSBhcmUgZGlzY2FyZGVkLiBJZiB0aGUgc2VxdWVuY2UgaXMgZXF1YWwgdG8gdGhlIGN1cnJlbnQgc2VxdWVuY2UsIHRoZSBsYXRlc3QgdXBkYXRlIGFyZSBhcHBsaWVkLlxyXG4gICAgICAgIG1heGltdW1JdGVtc1RvUmV0dXJuOiAwLCAvLyBTb2NpYWxEYXRhU2VydmljZSBtYXhpbXVtSXRlbXNUb1JldHVyblxyXG4gICAgICAgIHN0YXJ0SW5kZXg6IDAsIC8vIFNvY2lhbERhdGFTZXJ2aWNlIHN0YXJ0SW5kZXhcclxuICAgICAgICBpc0hpZ2hQcmlvcml0eTogZmFsc2UsIC8vIFNvY2lhbERhdGFTZXJ2aWNlIGlzSGlnaFByaW9yaXR5XHJcbiAgICAgICAgaXNQcml2YXRlOiBmYWxzZSwgLy8gU29jaWFsRGF0YVNlcnZpY2UgaXNQcml2YXRlXHJcbiAgICAgICAgcmF0aW5nOiAxLCAvLyBTb2NpYWxEYXRhU2VydmljZSByYXRpbmdcclxuICAgICAgICBtYXhSZXN1bHRzOiAxMCwgLy8gVW5sZXNzIG90aGVyd2lzZSBzcGVjaWZpZWQsIHRoZSBtYXhpbXVtIG51bWJlciBvZiBwcmluY2lwYWxzIHRoYXQgY2FuIGJlIHJldHVybmVkIGZyb20gYSBwcm92aWRlciBpcyAxMC5cclxuICAgICAgICBwcmluY2lwYWxUeXBlOiBcIlVzZXJcIiwgLy8gU3BlY2lmaWVzIHVzZXIgc2NvcGUgYW5kIG90aGVyIGluZm9ybWF0aW9uOiBbTm9uZSB8IFVzZXIgfCBEaXN0cmlidXRpb25MaXN0IHwgU2VjdXJpdHlHcm91cCB8IFNoYXJlUG9pbnRHcm91cCB8IEFsbF1cclxuXHJcbiAgICAgICAgYXN5bmM6IHRydWUsIC8vIEFsbG93IHRoZSB1c2VyIHRvIGZvcmNlIGFzeW5jXHJcbiAgICAgICAgY29tcGxldGVmdW5jOiBudWxsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvblxyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuZGVmYXVsdHNcclxuXHJcbn0pOyIsbnVsbCwiLyoqXHJcbiAqIEdlbmVyYWwgcHVycG9zZSB1dGlsaXRpZXNcclxuICpcclxuICogQG5hbWVzcGFjZSBzcHNlcnZpY2VzLnV0aWxzXHJcbiAqL1xyXG5kZWZpbmUoW1xyXG4gICAgXCJqcXVlcnlcIixcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnXHJcbl0sIGZ1bmN0aW9uKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50c1xyXG4pe1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgdmFyIHV0aWxzID0gLyoqIEBsZW5kcyBzcHNlcnZpY2VzLnV0aWxzICove1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGN1cnJlbnQgY29udGV4dCAoYXMgbXVjaCBhcyB3ZSBjYW4pIG9uIHN0YXJ0dXBcclxuICAgICAgICAvLyBTZWU6IGh0dHA6Ly9qb2hubGl1Lm5ldC9ibG9nLzIwMTIvMi8zL3NoYXJlcG9pbnQtamF2YXNjcmlwdC1jdXJyZW50LXBhZ2UtY29udGV4dC1pbmZvLmh0bWxcclxuICAgICAgICBTUFNlcnZpY2VzQ29udGV4dDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgICAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIGxpc3QgdGhlIGZvcm0gaXMgd29ya2luZyB3aXRoLiBUaGlzIGlzIHVzZWZ1bCBpZiB0aGUgZm9ybSBpcyBub3QgaW4gdGhlIGxpc3QgY29udGV4dC5cclxuICAgICAgICAgICAgICAgIHRoaXNVc2VySWQ6IFwiXCIgLy8gVGhlIGN1cnJlbnQgdXNlcidzIGlkIGluIHRoZSBzaXRlIENvbGxlY3Rpb24uXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIFNoYXJlUG9pbnQgdmFyaWFibGVzIG9ubHkgZ2l2ZSB1cyBhIHJlbGF0aXZlIHBhdGguIHRvIG1hdGNoIHRoZSByZXN1bHQgZnJvbSBXZWJVcmxGcm9tUGFnZVVybCwgd2UgbmVlZCB0byBhZGQgdGhlIHByb3RvY29sLCBob3N0LCBhbmQgKGlmIHByZXNlbnQpIHBvcnQuXHJcbiAgICAgICAgICAgIHZhciBzaXRlUm9vdCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDsgLy8gKyAobG9jYXRpb24ucG9ydCAhPT0gXCJcIiA/IGxvY2F0aW9uLnBvcnQgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29udGV4dCA9IHt9O1xyXG4gICAgICAgICAgICAvLyBTaGFyZVBvaW50IDIwMTArIGdpdmVzIHVzIGEgY29udGV4dCB2YXJpYWJsZVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9zcFBhZ2VDb250ZXh0SW5mbyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpc0NvbnRleHQudGhpc1NpdGUgPSBzaXRlUm9vdCArIF9zcFBhZ2VDb250ZXh0SW5mby53ZWJTZXJ2ZXJSZWxhdGl2ZVVybDtcclxuICAgICAgICAgICAgICAgIHRoaXNDb250ZXh0LnRoaXNMaXN0ID0gb3B0Lmxpc3ROYW1lID8gb3B0Lmxpc3ROYW1lIDogX3NwUGFnZUNvbnRleHRJbmZvLnBhZ2VMaXN0SWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzQ29udGV4dC50aGlzVXNlcklkID0gb3B0LnRoaXNVc2VySWQgPyBvcHQudGhpc1VzZXJJZCA6IF9zcFBhZ2VDb250ZXh0SW5mby51c2VySWQ7XHJcbiAgICAgICAgICAgICAgICAvLyBJbiBTaGFyZVBvaW50IDIwMDcsIHdlIGtub3cgdGhlIFVzZXJJRCBvbmx5XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzQ29udGV4dC50aGlzU2l0ZSA9ICh0eXBlb2YgTF9NZW51X0Jhc2VVcmwgIT09IFwidW5kZWZpbmVkXCIpID8gc2l0ZVJvb3QgKyBMX01lbnVfQmFzZVVybCA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzQ29udGV4dC50aGlzTGlzdCA9IG9wdC5saXN0TmFtZSA/IG9wdC5saXN0TmFtZSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzQ29udGV4dC50aGlzVXNlcklkID0gb3B0LnRoaXNVc2VySWQgPyBvcHQudGhpc1VzZXJJZCA6ICgodHlwZW9mIF9zcFVzZXJJZCAhPT0gXCJ1bmRlZmluZWRcIikgPyBfc3BVc2VySWQgOiB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc0NvbnRleHQ7XHJcblxyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBTUFNlcnZpY2VzQ29udGV4dFxyXG5cclxuICAgICAgICAvLyBHbG9iYWwgdmFyaWFibGVzXHJcbi8vICAgICAgICBjdXJyZW50Q29udGV4dDogbmV3IHRoaXMuU1BTZXJ2aWNlc0NvbnRleHQoKSwgLy8gVmFyaWFibGUgdG8gaG9sZCB0aGUgY3VycmVudCBjb250ZXh0IGFzIHdlIGZpZ3VyZSBpdCBvdXRcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV3JhcCBhbiBYTUwgbm9kZSAobikgYXJvdW5kIGEgdmFsdWUgKHYpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICB3cmFwTm9kZTogZnVuY3Rpb24obiwgdikge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1ZhbHVlID0gdHlwZW9mIHYgIT09IFwidW5kZWZpbmVkXCIgPyB2IDogXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPFwiICsgbiArIFwiPlwiICsgdGhpc1ZhbHVlICsgXCI8L1wiICsgbiArIFwiPlwiO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdlbmVyYXRlIGEgcmFuZG9tIG51bWJlciBmb3Igc29ydGluZyBhcnJheXMgcmFuZG9tbHlcclxuICAgICAgICAgKi9cclxuICAgICAgICByYW5kT3JkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpIC0gMC41KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJZiBhIHN0cmluZyBpcyBhIFVSTCwgZm9ybWF0IGl0IGFzIGEgbGluaywgZWxzZSByZXR1cm4gdGhlIHN0cmluZyBhcy1pc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNoZWNrTGluazogZnVuY3Rpb24ocykge1xyXG4gICAgICAgICAgICByZXR1cm4gKChzLmluZGV4T2YoXCJodHRwXCIpID09PSAwKSB8fCAocy5pbmRleE9mKFwiL1wiKSA9PT0gMCkpID8gXCI8YSBocmVmPSdcIiArIHMgKyBcIic+XCIgKyBzICsgXCI8L2E+XCIgOiBzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCB0aGUgZmlsZW5hbWUgZnJvbSB0aGUgZnVsbCBVUkxcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaWxlTmFtZTogZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHMuc3Vic3RyaW5nKHMubGFzdEluZGV4T2YoXCIvXCIpICsgMSwgcy5sZW5ndGgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgbWFwIG9mIHNwZWNpYWwgY2hhcmFjdGVycyB0byBYTUwgZXNjYXBlZCBjaGFyYWN0ZXJzLlxyXG4gICAgICAgICAqIFRha2VuIGZyb20ge0BsaW5rIGh0dHA6Ly9kcmFjb2JsdWUubmV0L2Rldi9lbmNvZGVkZWNvZGUtc3BlY2lhbC14bWwtY2hhcmFjdGVycy1pbi1qYXZhc2NyaXB0LzE1NS99XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHhtbF9zcGVjaWFsX3RvX2VzY2FwZWRfb25lX21hcDoge1xyXG4gICAgICAgICAgICAnJic6ICcmYW1wOycsXHJcbiAgICAgICAgICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgICAgICAgICAnPCc6ICcmbHQ7JyxcclxuICAgICAgICAgICAgJz4nOiAnJmd0OydcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBQYXVsIFQuLCAyMDE1LjA1LjAxOiBDb21tZW50ZWQgb3V0IHNpbmNlIGl0cyBub3QgY3VycmVudGx5IHVzZWQuXHJcbiAgICAgICAgLy8gdmFyIGVzY2FwZWRfb25lX3RvX3htbF9zcGVjaWFsX21hcCA9IHtcclxuICAgICAgICAvLyAnJmFtcDsnOiAnJicsXHJcbiAgICAgICAgLy8gJyZxdW90Oyc6ICdcIicsXHJcbiAgICAgICAgLy8gJyZsdDsnOiAnPCcsXHJcbiAgICAgICAgLy8gJyZndDsnOiAnPidcclxuICAgICAgICAvLyB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbmNvZGUgWE1MIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBlbmNvZGVYbWw6IGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbXFwmXCI8Pl0pL2csIGZ1bmN0aW9uIChzdHIsIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnhtbF9zcGVjaWFsX3RvX2VzY2FwZWRfb25lX21hcFtpdGVtXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gUGF1bCBULiwgMjAxNS0wNS0wMjogQ29tbWVudGVkIG91dCBzaW5jZSBpdHMgbm90IGN1cnJlbnRseSB1c2VkLlxyXG4gICAgICAgIC8vIGZ1bmN0aW9uIGRlY29kZVhtbChzdHJpbmcpIHtcclxuICAgICAgICAvLyByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLygmcXVvdDt8Jmx0O3wmZ3Q7fCZhbXA7KS9nLFxyXG4gICAgICAgIC8vIGZ1bmN0aW9uIChzdHIsIGl0ZW0pIHtcclxuICAgICAgICAvLyByZXR1cm4gZXNjYXBlZF9vbmVfdG9feG1sX3NwZWNpYWxfbWFwW2l0ZW1dO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgLyogVGFrZW4gZnJvbSBodHRwOi8vZHJhY29ibHVlLm5ldC9kZXYvZW5jb2RlZGVjb2RlLXNwZWNpYWwteG1sLWNoYXJhY3RlcnMtaW4tamF2YXNjcmlwdC8xNTUvICovXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVzY2FwZSBjb2x1bW4gdmFsdWVzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXNjYXBlQ29sdW1uVmFsdWU6IGZ1bmN0aW9uKHMpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC8mKD8hW2EtekEtWl17MSw4fTspL2csIFwiJmFtcDtcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVzY2FwZSBVcmxcclxuICAgICAgICAgKi9cclxuICAgICAgICBlc2NhcGVVcmw6IGZ1bmN0aW9uICh1KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1LnJlcGxhY2UoLyYvZywgJyUyNicpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNwbGl0IHZhbHVlcyBsaWtlIDE7I3ZhbHVlIGludG8gaWQgYW5kIHZhbHVlXHJcbiAgICAgICAgICogQHR5cGUgQ2xhc3NcclxuICAgICAgICAgKi9cclxuICAgICAgICBTcGxpdEluZGV4OiBmdW5jdGlvbihzKSB7XHJcbiAgICAgICAgICAgIHZhciBzcGwgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IHNwbFswXTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHNwbFsxXTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYWQgc2luZ2xlIGRpZ2l0cyB3aXRoIGEgemVyb1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwYWQ6IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuIDwgMTAgPyBcIjBcIiArIG4gOiBuO1xyXG4gICAgICAgIH0sXHJcbi8vIFRPRE9cclxuICAgICAgICAvLyBKYW1lcyBQYWRvbHNleSdzIFJlZ2V4IFNlbGVjdG9yIGZvciBqUXVlcnkgaHR0cDovL2phbWVzLnBhZG9sc2V5LmNvbS9qYXZhc2NyaXB0L3JlZ2V4LXNlbGVjdG9yLWZvci1qcXVlcnkvXHJcbiAgICAgICAgLyogICAgJC5leHByWyc6J10ucmVnZXggPSBmdW5jdGlvbiAoZWxlbSwgaW5kZXgsIG1hdGNoKSB7XHJcbiAgICAgICAgIHZhciBtYXRjaFBhcmFtcyA9IG1hdGNoWzNdLnNwbGl0KCcsJyksXHJcbiAgICAgICAgIHZhbGlkTGFiZWxzID0gL14oZGF0YXxjc3MpOi8sXHJcbiAgICAgICAgIGF0dHIgPSB7XHJcbiAgICAgICAgIG1ldGhvZDogbWF0Y2hQYXJhbXNbMF0ubWF0Y2godmFsaWRMYWJlbHMpID9cclxuICAgICAgICAgbWF0Y2hQYXJhbXNbMF0uc3BsaXQoJzonKVswXSA6ICdhdHRyJyxcclxuICAgICAgICAgcHJvcGVydHk6IG1hdGNoUGFyYW1zLnNoaWZ0KCkucmVwbGFjZSh2YWxpZExhYmVscywgJycpXHJcbiAgICAgICAgIH0sXHJcbiAgICAgICAgIHJlZ2V4RmxhZ3MgPSAnaWcnLFxyXG4gICAgICAgICByZWdleCA9IG5ldyBSZWdFeHAobWF0Y2hQYXJhbXMuam9pbignJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpLCByZWdleEZsYWdzKTtcclxuICAgICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QoJChlbGVtKVthdHRyLm1ldGhvZF0oYXR0ci5wcm9wZXJ0eSkpO1xyXG4gICAgICAgICB9O1xyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCdWlsZCBhbiBlcnJvciBtZXNzYWdlIGJhc2VkIG9uIHBhc3NlZCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXJyQm94OiBmdW5jdGlvbihmdW5jLCBwYXJhbSwgbXNnKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJNc2cgPSBcIjxiPkVycm9yIGluIGZ1bmN0aW9uPC9iPjxici8+XCIgKyBmdW5jICsgXCI8YnIvPlwiICtcclxuICAgICAgICAgICAgICAgIFwiPGI+UGFyYW1ldGVyPC9iPjxici8+XCIgKyBwYXJhbSArIFwiPGJyLz5cIiArXHJcbiAgICAgICAgICAgICAgICBcIjxiPk1lc3NhZ2U8L2I+PGJyLz5cIiArIG1zZyArIFwiPGJyLz48YnIvPlwiICtcclxuICAgICAgICAgICAgICAgIFwiPHNwYW4gb25tb3VzZW92ZXI9J3RoaXMuc3R5bGUuY3Vyc29yPVxcXCJoYW5kXFxcIjsnIG9ubW91c2VvdXQ9J3RoaXMuc3R5bGUuY3Vyc29yPVxcXCJpbmhlcml0XFxcIjsnIHN0eWxlPSd3aWR0aD0xMDAlO3RleHQtYWxpZ246cmlnaHQ7Jz5DbGljayB0byBjb250aW51ZTwvc3Bhbj48L2Rpdj5cIjtcclxuICAgICAgICAgICAgbW9kYWxCb3goZXJyTXNnKTtcclxuICAgICAgICB9LCAvLyBFbmQgb2YgZnVuY3Rpb24gZXJyQm94XHJcblxyXG5cclxuICAgICAgICAvLyBGaW5kcyB0aGUgdGQgd2hpY2ggY29udGFpbnMgYSBmb3JtIGZpZWxkIGluIGRlZmF1bHQgZm9ybXMgdXNpbmcgdGhlIGNvbW1lbnQgd2hpY2ggY29udGFpbnM6XHJcbiAgICAgICAgLy8gIDwhLS0gIEZpZWxkTmFtZT1cIlRpdGxlXCJcclxuICAgICAgICAvLyAgICAgIEZpZWxkSW50ZXJuYWxOYW1lPVwiVGl0bGVcIlxyXG4gICAgICAgIC8vICAgICAgRmllbGRUeXBlPVwiU1BGaWVsZFRleHRcIlxyXG4gICAgICAgIC8vICAtLT5cclxuICAgICAgICAvLyBhcyB0aGUgXCJhbmNob3JcIiB0byBmaW5kIGl0LiBOZWNlc3NhcnkgYmVjYXVzZSBTaGFyZVBvaW50IGRvZXNuJ3QgZ2l2ZSBhbGwgZmllbGQgdHlwZXMgaWRzIG9yIHNwZWNpZmljIGNsYXNzZXMuXHJcbiAgICAgICAgZmluZEZvcm1GaWVsZDogZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICB2YXIgJGZvcm1Cb2R5ID0gJChcInRkLm1zLWZvcm1ib2R5LCB0ZC5tcy1mb3JtYm9keXN1cnZleVwiKSxcclxuICAgICAgICAgICAgICAgIC8vIEJvcnJvd2VkIGZyb20gTUROLlxyXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9SZWd1bGFyX0V4cHJlc3Npb25zXHJcbiAgICAgICAgICAgICAgICBlc2NhcGVSZWdFeHAgPSBmdW5jdGlvbiAodil7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHYucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCBcIlxcXFwkMVwiKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb2x1bW5OYW1lID0gZXNjYXBlUmVnRXhwKHYpLFxyXG4gICAgICAgICAgICAgICAgcmNvbW1lbnRWYWxpZGF0aW9uID0gbmV3IFJlZ0V4cChcIig/OkZpZWxkfEZpZWxkSW50ZXJuYWwpTmFtZT1cXFwiXCIgKyBjb2x1bW5OYW1lICsgXCJcXFwiXCIsIFwiaVwiKSxcclxuICAgICAgICAgICAgICAgICRjb2x1bW5Ob2RlID0gJGZvcm1Cb2R5LmNvbnRlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlVHlwZSA9PT0gOCAmJiByY29tbWVudFZhbGlkYXRpb24udGVzdCh0aGlzLm5vZGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRjb2x1bW5Ob2RlLnBhcmVudChcInRkXCIpO1xyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBmaW5kRm9ybUZpZWxkXHJcblxyXG4gICAgICAgIC8vIFNob3cgYSBzaW5nbGUgYXR0cmlidXRlIG9mIGEgbm9kZSwgZW5jbG9zZWQgaW4gYSB0YWJsZVxyXG4gICAgICAgIC8vICAgbm9kZSAgICAgICAgICAgICAgIFRoZSBYTUwgbm9kZVxyXG4gICAgICAgIC8vICAgb3B0ICAgICAgICAgICAgICAgIFRoZSBjdXJyZW50IHNldCBvZiBvcHRpb25zXHJcbiAgICAgICAgc2hvd0F0dHJzOiBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgICAgIHZhciBpO1xyXG4gICAgICAgICAgICB2YXIgb3V0ID0gXCI8dGFibGUgY2xhc3M9J21zLXZiJyB3aWR0aD0nMTAwJSc+XCI7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG91dCArPSBcIjx0cj48dGQgd2lkdGg9JzEwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+XCIgKyBpICsgXCI8L3RkPjx0ZCB3aWR0aD0nMTAwcHgnPlwiICtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLmF0dHJpYnV0ZXMuaXRlbShpKS5ub2RlTmFtZSArIFwiPC90ZD48dGQ+XCIgKyB1dGlscy5jaGVja0xpbmsobm9kZS5hdHRyaWJ1dGVzLml0ZW0oaSkubm9kZVZhbHVlKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dCArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfSwgLy8gRW5kIG9mIGZ1bmN0aW9uIHNob3dBdHRyc1xyXG5cclxuICAgICAgICAvLyBBZGQgdGhlIG9wdGlvbiB2YWx1ZXMgdG8gdGhlIFNQU2VydmljZXMuU09BUEVudmVsb3BlLnBheWxvYWQgZm9yIHRoZSBvcGVyYXRpb25cclxuICAgICAgICAvLyAgb3B0ID0gb3B0aW9ucyBmb3IgdGhlIGNhbGxcclxuICAgICAgICAvLyAgU09BUEVudmVsb3BlID0gZW52ZWxvcGUgdG8gYWRkIHRvXHJcbiAgICAgICAgLy8gIHBhcmFtQXJyYXkgPSBhbiBhcnJheSBvZiBvcHRpb24gbmFtZXMgdG8gYWRkIHRvIHRoZSBwYXlsb2FkXHJcbiAgICAgICAgLy8gICAgICBcInBhcmFtTmFtZVwiIGlmIHRoZSBwYXJhbWV0ZXIgbmFtZSBhbmQgdGhlIG9wdGlvbiBuYW1lIG1hdGNoXHJcbiAgICAgICAgLy8gICAgICBbXCJwYXJhbU5hbWVcIiwgXCJvcHRpb25OYW1lXCJdIGlmIHRoZSBwYXJhbWV0ZXIgbmFtZSBhbmQgdGhlIG9wdGlvbiBuYW1lIGFyZSBkaWZmZXJlbnQgKHRoaXMgaGFuZGxlcyBlYXJseSBcIndyYXBwaW5nc1wiIHdpdGggaW5jb25zaXN0ZW50IG5hbWluZylcclxuICAgICAgICAvLyAgICAgIHtuYW1lOiBcInBhcmFtTmFtZVwiLCBzZW5kTnVsbDogZmFsc2V9IGluZGljYXRlcyB0aGUgZWxlbWVudCBpcyBtYXJrZWQgYXMgXCJhZGQgdG8gcGF5bG9hZCBvbmx5IGlmIG5vbi1udWxsXCJcclxuICAgICAgICBhZGRUb1BheWxvYWQ6IGZ1bmN0aW9uKG9wdCwgU09BUEVudmVsb3BlLCBwYXJhbUFycmF5KSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYXJhbUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgcGFyYW1ldGVyIG5hbWUgYW5kIHRoZSBvcHRpb24gbmFtZSBtYXRjaFxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbUFycmF5W2ldID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU09BUEVudmVsb3BlLnBheWxvYWQgKz0gdXRpbHMud3JhcE5vZGUocGFyYW1BcnJheVtpXSwgb3B0W3BhcmFtQXJyYXlbaV1dKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcGFyYW1ldGVyIG5hbWUgYW5kIHRoZSBvcHRpb24gbmFtZSBhcmUgZGlmZmVyZW50XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCQuaXNBcnJheShwYXJhbUFycmF5W2ldKSAmJiBwYXJhbUFycmF5W2ldLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9IHV0aWxzLndyYXBOb2RlKHBhcmFtQXJyYXlbaV1bMF0sIG9wdFtwYXJhbUFycmF5W2ldWzFdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGVsZW1lbnQgbm90IGEgc3RyaW5nIG9yIGFuIGFycmF5IGFuZCBpcyBtYXJrZWQgYXMgXCJhZGQgdG8gcGF5bG9hZCBvbmx5IGlmIG5vbi1udWxsXCJcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBwYXJhbUFycmF5W2ldID09PSBcIm9iamVjdFwiKSAmJiAocGFyYW1BcnJheVtpXS5zZW5kTnVsbCAhPT0gdW5kZWZpbmVkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5wYXlsb2FkICs9ICgob3B0W3BhcmFtQXJyYXlbaV0ubmFtZV0gPT09IHVuZGVmaW5lZCkgfHwgKG9wdFtwYXJhbUFycmF5W2ldLm5hbWVdLmxlbmd0aCA9PT0gMCkpID8gXCJcIiA6IHV0aWxzLndyYXBOb2RlKHBhcmFtQXJyYXlbaV0ubmFtZSwgb3B0W3BhcmFtQXJyYXlbaV0ubmFtZV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvbWV0aGluZyBpc24ndCByaWdodCwgc28gcmVwb3J0IGl0XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmVyckJveChvcHQub3BlcmF0aW9uLCBcInBhcmFtQXJyYXlbXCIgKyBpICsgXCJdOiBcIiArIHBhcmFtQXJyYXlbaV0sIFwiSW52YWxpZCBwYXJhbUFycmF5IGVsZW1lbnQgcGFzc2VkIHRvIGFkZFRvUGF5bG9hZCgpXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgLy8gRW5kIG9mIGZ1bmN0aW9uIGFkZFRvUGF5bG9hZFxyXG5cclxuXHJcbiAgICAgICAgLy8gVGhlIFNpdGVEYXRhIG9wZXJhdGlvbnMgaGF2ZSB0aGUgc2FtZSBuYW1lcyBhcyBvdGhlciBXZWIgU2VydmljZSBvcGVyYXRpb25zLiBUbyBtYWtlIHRoZW0gZWFzeSB0byBjYWxsIGFuZCB1bmlxdWUsIEknbSB1c2luZ1xyXG4gICAgICAgIC8vIHRoZSBTaXRlRGF0YSBwcmVmaXggb24gdGhlaXIgbmFtZXMuIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGhhdCBuYW1lIHdpdGggdGhlIHJpZ2h0IG5hbWUgaW4gdGhlIFNQU2VydmljZXMuU09BUEVudmVsb3BlLlxyXG4gICAgICAgIHNpdGVEYXRhRml4U09BUEVudmVsb3BlOiBmdW5jdGlvbihTT0FQRW52ZWxvcGUsIHNpdGVEYXRhT3BlcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBzaXRlRGF0YU9wID0gc2l0ZURhdGFPcGVyYXRpb24uc3Vic3RyaW5nKDgpO1xyXG4gICAgICAgICAgICBTT0FQRW52ZWxvcGUub3BoZWFkZXIgPSBTT0FQRW52ZWxvcGUub3BoZWFkZXIucmVwbGFjZShzaXRlRGF0YU9wZXJhdGlvbiwgc2l0ZURhdGFPcCk7XHJcbiAgICAgICAgICAgIFNPQVBFbnZlbG9wZS5vcGZvb3RlciA9IFNPQVBFbnZlbG9wZS5vcGZvb3Rlci5yZXBsYWNlKHNpdGVEYXRhT3BlcmF0aW9uLCBzaXRlRGF0YU9wKTtcclxuICAgICAgICAgICAgcmV0dXJuIFNPQVBFbnZlbG9wZTtcclxuICAgICAgICB9LCAvLyBFbmQgb2YgZnVuY3Rpb24gc2l0ZURhdGFGaXhTT0FQRW52ZWxvcGVcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCB0aGUgVVJMIGZvciBhIHNwZWNpZmllZCBmb3JtIGZvciBhIGxpc3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRMaXN0Rm9ybVVybDogZnVuY3Rpb24obCwgZikge1xyXG5cclxuICAgICAgICAgICAgdmFyIHU7XHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRGb3JtQ29sbGVjdGlvblwiLFxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IGwsXHJcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHUgPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRm9ybVtUeXBlPSdcIiArIGYgKyBcIiddXCIpLmF0dHIoXCJVcmxcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdTtcclxuXHJcbiAgICAgICAgfSwgLy8gRW5kIG9mIGZ1bmN0aW9uIGdldExpc3RGb3JtVXJsXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNlbGVjdGVkIHZhbHVlKHMpIGZvciBhIGRyb3Bkb3duIGluIGFuIGFycmF5LiBFeHBlY3RzIGEgZHJvcGRvd25cclxuICAgICAgICAgKiBvYmplY3QgYXMgcmV0dXJuZWQgYnkgdGhlIERyb3Bkb3duQ3RsIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqIElmIG1hdGNoT25JZCBpcyB0cnVlLCByZXR1cm5zIHRoZSBpZHMgcmF0aGVyIHRoYW4gdGhlIHRleHQgdmFsdWVzIGZvciB0aGVcclxuICAgICAgICAgKiBzZWxlY3Rpb24gb3B0aW9ucyhzKS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb2x1bW5TZWxlY3RcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbWF0Y2hPbklkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0RHJvcGRvd25TZWxlY3RlZDogZnVuY3Rpb24gKGNvbHVtblNlbGVjdCwgbWF0Y2hPbklkKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgY29sdW1uU2VsZWN0U2VsZWN0ZWQgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoY29sdW1uU2VsZWN0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoT25JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZC5wdXNoKGNvbHVtblNlbGVjdC5PYmouZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS52YWwoKSB8fCBbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0U2VsZWN0ZWQucHVzaChjb2x1bW5TZWxlY3QuT2JqLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikudGV4dCgpIHx8IFtdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2hPbklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdFNlbGVjdGVkLnB1c2goY29sdW1uU2VsZWN0Lm9wdEhpZC52YWwoKSB8fCBbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0U2VsZWN0ZWQucHVzaChjb2x1bW5TZWxlY3QuT2JqLnZhbCgpIHx8IFtdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgJChjb2x1bW5TZWxlY3QubWFzdGVyLnJlc3VsdENvbnRyb2wpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaE9uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdFNlbGVjdGVkLnB1c2goJCh0aGlzKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZC5wdXNoKCQodGhpcykuaHRtbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uU2VsZWN0U2VsZWN0ZWQ7XHJcblxyXG4gICAgICAgIH0sIC8vIEVuZCBvZiBmdW5jdGlvbiBnZXREcm9wZG93blNlbGVjdGVkXHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZW5lcmF0ZSBhIHVuaXF1ZSBpZCBmb3IgYSBjb250YWluaW5nIGRpdiB1c2luZyB0aGUgZnVuY3Rpb24gbmFtZSBhbmQgdGhlIGNvbHVtbiBkaXNwbGF5IG5hbWUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZnVuY25hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29sdW1uTmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsaXN0TmFtZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdlbkNvbnRhaW5lcklkOiBmdW5jdGlvbihmdW5jbmFtZSwgY29sdW1uTmFtZSwgbGlzdE5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIGwgPSBsaXN0TmFtZSAhPT0gdW5kZWZpbmVkID8gbGlzdE5hbWUgOiAkKCkuU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY25hbWUgKyBcIl9cIiArICQoKS5TUFNlcnZpY2VzLlNQR2V0U3RhdGljRnJvbURpc3BsYXkoe1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbkRpc3BsYXlOYW1lOiBjb2x1bW5OYW1lXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9IC8vIEVuZCBvZiBmdW5jdGlvbiBnZW5Db250YWluZXJJZFxyXG5cclxuICAgIH0sIC8vZW5kOiB1dGlsc1xyXG5cclxuICAgIC8vLS0tLS0tLS0tLS1bIFBSSVZBVEUgTUVUSE9EUyBCRUxPVyBdLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBUaGVzZSBzaG91bGQgYWxsIGJlIGRlZmluZWQgYWdhaW5zdCBhIGxvY2FsIHZhcmlhYmxlIHNvXHJcbiAgICAvLyB0aGF0IHdlIGdldCBzbWFsbGVyIG1pbmlmaWVkIGZpbGVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIHRoaXMgZnVuY3Rpb24gdG8gcG9wIHVwIGEgYnJhbmRlZCBtb2RhbCBtc2dCb3hcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIG1vZGFsQm94ID0gZnVuY3Rpb24obXNnKSB7XHJcbiAgICAgICAgdmFyIGJveENTUyA9IFwicG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MzAwcHg7aGVpZ2h0OjE1MHB4O3BhZGRpbmc6MTBweDtiYWNrZ3JvdW5kLWNvbG9yOiMwMDAwMDA7Y29sb3I6I2ZmZmZmZjt6LWluZGV4OjMwO2ZvbnQtZmFtaWx5OidBcmlhbCc7Zm9udC1zaXplOjEycHg7ZGlzcGxheTpub25lO1wiO1xyXG4gICAgICAgICQoXCIjYXNwbmV0Rm9ybVwiKS5wYXJlbnQoKS5hcHBlbmQoXCI8ZGl2IGlkPSdTUFNlcnZpY2VzX21zZ0JveCcgc3R5bGU9XCIgKyBib3hDU1MgKyBcIj5cIiArIG1zZyk7XHJcbiAgICAgICAgdmFyIG1zZ0JveE9iaiA9ICQoXCIjU1BTZXJ2aWNlc19tc2dCb3hcIik7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IG1zZ0JveE9iai5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgd2lkdGggPSBtc2dCb3hPYmoud2lkdGgoKTtcclxuICAgICAgICB2YXIgbGVmdFZhbCA9ICgkKHdpbmRvdykud2lkdGgoKSAvIDIpIC0gKHdpZHRoIC8gMikgKyBcInB4XCI7XHJcbiAgICAgICAgdmFyIHRvcFZhbCA9ICgkKHdpbmRvdykuaGVpZ2h0KCkgLyAyKSAtIChoZWlnaHQgLyAyKSAtIDEwMCArIFwicHhcIjtcclxuICAgICAgICBtc2dCb3hPYmouY3NzKHtcclxuICAgICAgICAgICAgYm9yZGVyOiAnNXB4ICNDMDIwMDAgc29saWQnLFxyXG4gICAgICAgICAgICBsZWZ0OiBsZWZ0VmFsLFxyXG4gICAgICAgICAgICB0b3A6IHRvcFZhbFxyXG4gICAgICAgIH0pLnNob3coKS5mYWRlVG8oXCJzbG93XCIsIDAuNzUpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5mYWRlT3V0KFwiMzAwMFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07IC8vIEVuZCBvZiBmdW5jdGlvbiBtb2RhbEJveDtcclxuXHJcblxyXG4gICAgcmV0dXJuIHV0aWxzO1xyXG5cclxufSk7XHJcblxyXG4iLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi91dGlscy9jb25zdGFudHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHNcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBjdXJyZW50IHZlcnNpb24gb2YgU1BTZXJ2aWNlcyBhcyBhIHN0cmluZ1xyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBjb25zdGFudHMuVkVSU0lPTjtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlZlcnNpb25cclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFJlYXJyYW5nZSByYWRpbyBidXR0b25zIG9yIGNoZWNrYm94ZXMgaW4gYSBmb3JtIGZyb20gdmVydGljYWwgdG8gaG9yaXpvbnRhbCBkaXNwbGF5IHRvIHNhdmUgcGFnZSByZWFsIGVzdGF0ZVxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQQXJyYW5nZUNob2ljZXMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IG5hbWUgZm9yIHRoZSBjdXJyZW50IGZvcm1cclxuICAgICAgICAgICAgY29sdW1uTmFtZTogXCJcIiwgLy8gVGhlIGRpc3BsYXkgbmFtZSBvZiB0aGUgY29sdW1uIGluIHRoZSBmb3JtXHJcbiAgICAgICAgICAgIHBlclJvdzogOTksIC8vIE1heGltdW0gbnVtYmVyIG9mIGNob2ljZXMgZGVzaXJlZCBwZXIgcm93LlxyXG4gICAgICAgICAgICByYW5kb21pemU6IGZhbHNlIC8vIElmIHRydWUsIHJhbmRvbWl6ZSB0aGUgb3JkZXIgb2YgdGhlIG9wdGlvbnNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbHVtbkZpbGxJbkNob2ljZSA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBjb2x1bW5PcHRpb25zID0gW107XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCBjb2x1bW5OYW1lIGZyb20gdGhlIGxpc3QgdG8gZGV0ZXJtaW5lIGlmIHdlJ3JlIGFsbG93aW5nIGZpbGwtaW4gY2hvaWNlc1xyXG4gICAgICAgIHZhciB0aGlzR2V0TGlzdCA9ICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyB3aGVuIHRoZSBwcm9taXNlIGlzIGF2YWlsYWJsZS4uLlxyXG4gICAgICAgIHRoaXNHZXRMaXN0LmRvbmUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXNHZXRMaXN0LnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRbRGlzcGxheU5hbWU9J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgY29sdW1uTmFtZSBhbGxvd3MgYSBmaWxsLWluIGNob2ljZVxyXG4gICAgICAgICAgICAgICAgY29sdW1uRmlsbEluQ2hvaWNlID0gKCQodGhpcykuYXR0cihcIkZpbGxJbkNob2ljZVwiKSA9PT0gXCJUUlVFXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcCBsb29raW5nO3dlJ3JlIGRvbmVcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgdGhpc0Zvcm1GaWVsZCA9IHV0aWxzLmZpbmRGb3JtRmllbGQob3B0LmNvbHVtbk5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgdG90YWxDaG9pY2VzID0gJCh0aGlzRm9ybUZpZWxkKS5maW5kKFwidHJcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgZmlsbGluUHJvbXB0O1xyXG4gICAgICAgICAgICB2YXIgZmlsbGluSW5wdXQ7XHJcblxyXG4gICAgICAgICAgICAvLyBDb2xsZWN0IGFsbCBvZiB0aGUgY2hvaWNlc1xyXG4gICAgICAgICAgICAkKHRoaXNGb3JtRmllbGQpLmZpbmQoXCJ0clwiKS5lYWNoKGZ1bmN0aW9uIChjaG9pY2VOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpbGwtaW4gcHJvbXB0LCBzYXZlIGl0Li4uXHJcbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uRmlsbEluQ2hvaWNlICYmIGNob2ljZU51bWJlciA9PT0gKHRvdGFsQ2hvaWNlcyAtIDIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsbGluUHJvbXB0ID0gJCh0aGlzKS5maW5kKFwidGRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLi4ub3IgaWYgaXQgaXMgdGhlIGZpbGwtaW4gaW5wdXQgYm94LCBzYXZlIGl0Li4uXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbkZpbGxJbkNob2ljZSAmJiBjaG9pY2VOdW1iZXIgPT09ICh0b3RhbENob2ljZXMgLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGxpbklucHV0ID0gJCh0aGlzKS5maW5kKFwidGRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gLi4uZWxzZSBwdXNoIGludG8gdGhlIGNvbHVtbk9wdGlvbnMgYXJyYXkuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbk9wdGlvbnMucHVzaCgkKHRoaXMpLmZpbmQoXCJ0ZFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgcmFuZG9taXplIGlzIHRydWUsIHJhbmRvbWx5IHNvcnQgdGhlIG9wdGlvbnNcclxuICAgICAgICAgICAgaWYgKG9wdC5yYW5kb21pemUpIHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbk9wdGlvbnMuc29ydCh1dGlscy5yYW5kT3JkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9DcmVhdGUgYSBuZXcgY2hvaWNlcyB0YWJsZSB0byBob2xkIHRoZSBhcnJhbmdlZCBjaG9pY2VzLlxyXG4gICAgICAgICAgICB2YXIgbmV3Q2hvaWNlVGFibGUgPSAkKFwiPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAvL0l0ZXJhdGUgb3ZlciBhbGwgYXZhaWxhYmxlIGNob2ljZXMgcGxhY2luZyB0aGVtIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBuZXcgY2hvaWNlcyB0YWJsZS5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5PcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBwZXJSb3cgY29sdW1uT3B0aW9ucyBpbiB0aGUgcm93LCBjbG9zZSBvZmYgdGhlIHJvd1xyXG4gICAgICAgICAgICAgICAgaWYgKChpICsgMSkgJSBvcHQucGVyUm93ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3Q2hvaWNlVGFibGUuYXBwZW5kKFwiPHRyPjwvdHI+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3Q2hvaWNlVGFibGUuYXBwZW5kKGNvbHVtbk9wdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0luc2VydCBmaWxsSW5DaG9pY2VzIHNlY3Rpb24gdW5kZXIgYXZhaWxhYmxlIGNob2ljZXMuXHJcbiAgICAgICAgICAgIGlmIChjb2x1bW5GaWxsSW5DaG9pY2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxsSW5Sb3cgPSAkKFwiPHRyPjx0ZCBjb2xzcGFuPSc5OSc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMSc+PHRyPjwvdHI+PC90YWJsZT48L3RkPjwvdHI+XCIpO1xyXG4gICAgICAgICAgICAgICAgZmlsbEluUm93LmZpbmQoXCJ0clwiKS5hcHBlbmQoZmlsbGluUHJvbXB0KTtcclxuICAgICAgICAgICAgICAgIGZpbGxJblJvdy5maW5kKFwidHJcIikuYXBwZW5kKGZpbGxpbklucHV0KTtcclxuICAgICAgICAgICAgICAgIG5ld0Nob2ljZVRhYmxlLmFwcGVuZChmaWxsSW5Sb3cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0luc2VydCBuZXcgdGFibGUgYmVmb3JlIHRoZSBvbGQgY2hvaWNlIHRhYmxlIHNvIHRoYXQgY2hvaWNlcyB3aWxsIHN0aWxsIGxpbmUgdXAgd2l0aCBoZWFkZXIuXHJcbiAgICAgICAgICAgIHZhciBjaG9pY2VUYWJsZSA9ICQodGhpc0Zvcm1GaWVsZCkuZmluZChcInRhYmxlOmZpcnN0XCIpO1xyXG4gICAgICAgICAgICBjaG9pY2VUYWJsZS5iZWZvcmUobmV3Q2hvaWNlVGFibGUpO1xyXG5cclxuICAgICAgICAgICAgLy9DaG9pY2VzIHRhYmxlIGlzIG5vdCByZW1vdmVkIGJlY2F1c2UgdmFsaWRhdGlvbiBkZXBlbmRzIG9uIHRoZSB0YWJsZSBpZC5cclxuICAgICAgICAgICAgY2hvaWNlVGFibGUuaGlkZSgpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQQXJyYW5nZUNob2ljZXNcclxuXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBQcm92aWRlIHN1Z2dlc3RlZCB2YWx1ZXMgZnJvbSBhIGxpc3QgZm9yIGluIGlucHV0IGNvbHVtbiBiYXNlZCBvbiBjaGFyYWN0ZXJzIHR5cGVkXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BBdXRvY29tcGxldGUgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBXZWIgKHNpdGUpIHdoaWNoIGNvbnRhaW5zIHRoZSBzb3VyY2VMaXN0XHJcbiAgICAgICAgICAgIHNvdXJjZUxpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSB2YWx1ZXNcclxuICAgICAgICAgICAgc291cmNlQ29sdW1uOiBcIlwiLCAvLyBUaGUgc3RhdGljIG5hbWUgb2YgdGhlIGNvbHVtbiB3aGljaCBjb250YWlucyB0aGUgdmFsdWVzXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSwgLy8gVGhlIGxpc3QgdGhlIGZvcm0gaXMgd29ya2luZyB3aXRoLiBUaGlzIGlzIHVzZWZ1bCBpZiB0aGUgZm9ybSBpcyBub3QgaW4gdGhlIGxpc3QgY29udGV4dC5cclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBcIlwiLCAvLyBbT3B0aW9uYWxdIEZvciBwb3dlciB1c2VycywgdGhpcyBDQU1MIGZyYWdtZW50IHdpbGwgYmUgQW5kZWQgd2l0aCB0aGUgZGVmYXVsdCBxdWVyeSBvbiB0aGUgcmVsYXRlZExpc3RcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjwvUXVlcnlPcHRpb25zPlwiLCAvLyBbT3B0aW9uYWxdIEZvciBwb3dlciB1c2VycywgYWxsb3dzIHNwZWNpZnlpbmcgdGhlIENBTUxRdWVyeU9wdGlvbnMgZm9yIHRoZSBHZXRMaXN0SXRlbXMgY2FsbFxyXG4gICAgICAgICAgICBDQU1MUm93TGltaXQ6IDAsIC8vIFtPcHRpb25hbF0gT3ZlcnJpZGUgdGhlIGRlZmF1bHQgdmlldyByb3dsaW1pdCBhbmQgZ2V0IGFsbCBhcHByb3ByaWF0ZSByb3dzXHJcbiAgICAgICAgICAgIGZpbHRlclR5cGU6IFwiQmVnaW5zV2l0aFwiLCAvLyBUeXBlIG9mIGZpbHRlcmluZzogW0JlZ2luc1dpdGgsIENvbnRhaW5zXVxyXG4gICAgICAgICAgICBudW1DaGFyczogMCwgLy8gV2FpdCB1bnRpbCB0aGlzIG51bWJlciBvZiBjaGFyYWN0ZXJzIGhhcyBiZWVuIHR5cGVkIGJlZm9yZSBhdHRlbXB0aW5nIGFueSBhY3Rpb25zXHJcbiAgICAgICAgICAgIGlnbm9yZUNhc2U6IGZhbHNlLCAvLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZ1bmN0aW9uIGlnbm9yZXMgY2FzZSwgaWYgZmFsc2UgaXQgbG9va3MgZm9yIGFuIGV4YWN0IG1hdGNoXHJcbiAgICAgICAgICAgIGhpZ2hsaWdodENsYXNzOiBcIlwiLCAvLyBJZiBhIGNsYXNzIGlzIHN1cHBsaWVkLCBoaWdobGlnaHQgdGhlIG1hdGNoZWQgY2hhcmFjdGVycyBpbiB0aGUgdmFsdWVzIGJ5IGFwcGx5aW5nIHRoYXQgY2xhc3MgdG8gYSB3cmFwcGluZyBzcGFuXHJcbiAgICAgICAgICAgIHVuaXF1ZVZhbHM6IGZhbHNlLCAvLyBJZiBzZXQgdG8gdHJ1ZSwgdGhlIGZ1bmN0aW9uIG9ubHkgYWRkcyB1bmlxdWUgdmFsdWVzIHRvIHRoZSBsaXN0IChubyBkdXBsaWNhdGVzKVxyXG4gICAgICAgICAgICBtYXhIZWlnaHQ6IDk5OTk5LCAvLyBTZXRzIHRoZSBtYXhpbXVtIG51bWJlciBvZiB2YWx1ZXMgdG8gZGlzcGxheSBiZWZvcmUgc2Nyb2xsaW5nIG9jY3Vyc1xyXG4gICAgICAgICAgICBzbGlkZURvd25TcGVlZDogXCJmYXN0XCIsIC8vIFNwZWVkIGF0IHdoaWNoIHRoZSBkaXYgc2hvdWxkIHNsaWRlIGRvd24gd2hlbiB2YWx1ZXMgbWF0Y2ggKG1pbGxpc2Vjb25kcyBvciBbXCJmYXN0XCIgfCBcInNsb3dcIl0pXHJcbiAgICAgICAgICAgIHByb2Nlc3NpbmdJbmRpY2F0b3I6IFwiX2xheW91dHMvaW1hZ2VzL1JFRlJFU0guR0lGXCIsIC8vIElmIHByZXNlbnQsIHNob3cgdGhpcyB3aGlsZSBwcm9jZXNzaW5nXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzO2lmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBtYXRjaE51bTtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgaW5wdXQgY29udHJvbCBmb3IgdGhlIGNvbHVtbiBhbmQgc2F2ZSBzb21lIG9mIGl0cyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgdmFyIGNvbHVtbk9iaiA9IHV0aWxzLmZpbmRGb3JtRmllbGQob3B0LmNvbHVtbk5hbWUpLmZpbmQoXCJpbnB1dFtUaXRsZV49J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIGNvbHVtbk9iai5jc3MoXCJwb3NpdGlvblwiLCBcIlwiKTtcclxuICAgICAgICB2YXIgY29sdW1uT2JqQ29sb3IgPSBjb2x1bW5PYmouY3NzKFwiY29sb3JcIik7XHJcbiAgICAgICAgdmFyIGNvbHVtbk9ialdpZHRoID0gY29sdW1uT2JqLmNzcyhcIndpZHRoXCIpO1xyXG5cclxuICAgICAgICBpZiAoY29sdW1uT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KFwiU1BTZXJ2aWNlcy5TUEF1dG9jb21wbGV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5jb2x1bW5OYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJDb2x1bW4gaXMgbm90IGFuIGlucHV0IGNvbnRyb2wgb3IgaXMgbm90IGZvdW5kIG9uIHBhZ2VcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgPGJyLz4gd2hpY2ggaXNuJ3QgbmVlZGVkIGFuZCBtZXNzZXMgdXAgdGhlIGZvcm1hdHRpbmdcclxuICAgICAgICBjb2x1bW5PYmouY2xvc2VzdChcInNwYW5cIikuZmluZChcImJyXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGNvbHVtbk9iai53cmFwKFwiPGRpdj5cIik7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIGRpdiB0byBjb250YWluIHRoZSBtYXRjaGluZyB2YWx1ZXMgYW5kIGFkZCBpdCB0byB0aGUgRE9NXHJcbiAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gdXRpbHMuZ2VuQ29udGFpbmVySWQoXCJTUEF1dG9jb21wbGV0ZVwiLCBvcHQuY29sdW1uTmFtZSwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICBjb2x1bW5PYmouYWZ0ZXIoXCI8ZGl2Pjx1bCBpZD0nXCIgKyBjb250YWluZXJJZCArIFwiJyBzdHlsZT0nd2lkdGg6XCIgKyBjb2x1bW5PYmpXaWR0aCArIFwiO2Rpc3BsYXk6bm9uZTtwYWRkaW5nOjJweDtib3JkZXI6MXB4IHNvbGlkICMyQTFGQUE7YmFja2dyb3VuZC1jb2xvcjojRkZGO3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6NDA7bWFyZ2luOjAnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSB3aWR0aCB0byBtYXRjaCB0aGUgd2lkdGggb2YgdGhlIGlucHV0IGNvbnRyb2xcclxuICAgICAgICB2YXIgY29udGFpbmVyT2JqID0gJChcIiNcIiArIGNvbnRhaW5lcklkKTtcclxuICAgICAgICBjb250YWluZXJPYmouY3NzKFwid2lkdGhcIiwgY29sdW1uT2JqV2lkdGgpO1xyXG5cclxuICAgICAgICAvLyBIYW5kbGUga2V5cHJlc3Nlc1xyXG4gICAgICAgICQoY29sdW1uT2JqKS5rZXl1cChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGNvbHVtbidzIHZhbHVlXHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5WYWx1ZSA9ICQodGhpcykudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBjb250YWluZXIgd2hpbGUgd2UncmUgd29ya2luZyBvbiBpdFxyXG4gICAgICAgICAgICBjb250YWluZXJPYmouaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gSGF2ZSBlbm91Z2ggY2hhcmFjdGVycyBiZWVuIHR5cGVkIHlldD9cclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlLmxlbmd0aCA8IG9wdC5udW1DaGFycykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IHRoZSB0aGUgcHJvY2Vzc2luZ0luZGljYXRvciBhcyBhIGJhY2tncm91bmQgaW1hZ2UgaW4gdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgY29sdW1uT2JqLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2VcIjogXCJ1cmwoXCIgKyBvcHQucHJvY2Vzc2luZ0luZGljYXRvciArIFwiKVwiLFxyXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCI6IFwicmlnaHRcIixcclxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1yZXBlYXRcIjogXCJuby1yZXBlYXRcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFycmF5IHRvIGhvbGQgdGhlIG1hdGNoZWQgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciBtYXRjaEFycmF5ID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBCdWlsZCB0aGUgYXBwcm9wcmlhdGUgQ0FNTFF1ZXJ5XHJcbiAgICAgICAgICAgIHZhciBjYW1sUXVlcnkgPSBcIjxRdWVyeT48T3JkZXJCeT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQuc291cmNlQ29sdW1uICsgXCInLz48L09yZGVyQnk+PFdoZXJlPlwiO1xyXG4gICAgICAgICAgICBpZiAob3B0LkNBTUxRdWVyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8QW5kPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxcIiArIG9wdC5maWx0ZXJUeXBlICsgXCI+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnNvdXJjZUNvbHVtbiArIFwiJy8+PFZhbHVlIFR5cGU9J1RleHQnPlwiICsgY29sdW1uVmFsdWUgKyBcIjwvVmFsdWU+PC9cIiArIG9wdC5maWx0ZXJUeXBlICsgXCI+XCI7XHJcbiAgICAgICAgICAgIGlmIChvcHQuQ0FNTFF1ZXJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBvcHQuQ0FNTFF1ZXJ5ICsgXCI8L0FuZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8L1doZXJlPjwvUXVlcnk+XCI7XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIEdldExpc3RJdGVtcyB0byBmaW5kIGFsbCBvZiB0aGUgcG90ZW50aWFsIHZhbHVlc1xyXG4gICAgICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdEl0ZW1zXCIsXHJcbiAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC5XZWJVUkwsXHJcbiAgICAgICAgICAgICAgICBsaXN0TmFtZTogb3B0LnNvdXJjZUxpc3QsXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnk6IGNhbWxRdWVyeSxcclxuICAgICAgICAgICAgICAgIENBTUxRdWVyeU9wdGlvbnM6IG9wdC5DQU1MUXVlcnlPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgQ0FNTFZpZXdGaWVsZHM6IFwiPFZpZXdGaWVsZHM+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnNvdXJjZUNvbHVtbiArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIENBTUxSb3dMaW1pdDogb3B0LkNBTUxSb3dMaW1pdCxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHVwcGVyL2xvd2VyIGNhc2UgaWYgaWdub3JlQ2FzZSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdFZhbHVlID0gb3B0Lmlnbm9yZUNhc2UgPyBjb2x1bW5WYWx1ZS50b1VwcGVyQ2FzZSgpIDogY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIHdoaWNoIHZhbHVlcyBtYXRjaCBhbmQgYWRkIHRoZSBvbmVzIHRoYXQgZG8gdG8gbWF0Y2hBcnJheVxyXG4gICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1ZhbHVlID0gJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVmFsdWVUZXN0ID0gb3B0Lmlnbm9yZUNhc2UgPyAkKHRoaXMpLmF0dHIoXCJvd3NfXCIgKyBvcHQuc291cmNlQ29sdW1uKS50b1VwcGVyQ2FzZSgpIDogJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBoYXZlIGEgbWF0Y2guLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5maWx0ZXJUeXBlID09PSBcIkNvbnRhaW5zXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaXJzdE1hdGNoID0gdGhpc1ZhbHVlVGVzdC5pbmRleE9mKHRlc3RWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGZpcnN0TWF0Y2ggPj0gMCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLi4uYW5kIHRoYXQgdGhlIG1hdGNoIGlzIG5vdCBhbHJlYWR5IGluIHRoZSBhcnJheSBpZiB3ZSB3YW50IHVuaXF1ZW5lc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW9wdC51bmlxdWVWYWxzIHx8ICgkLmluQXJyYXkodGhpc1ZhbHVlLCBtYXRjaEFycmF5KSA9PT0gLTEpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoQXJyYXkucHVzaCgkKHRoaXMpLmF0dHIoXCJvd3NfXCIgKyBvcHQuc291cmNlQ29sdW1uKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGVzIG5vcm1hbCBjYXNlLCB3aGljaCBpcyBCZWdpbnNXaXRoIGFuZCBhbmQgb3RoZXIgdW5rbm93biB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0VmFsdWUgPT09IHRoaXNWYWx1ZVRlc3Quc3Vic3RyKDAsIHRlc3RWYWx1ZS5sZW5ndGgpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC4uLmFuZCB0aGF0IHRoZSBtYXRjaCBpcyBub3QgYWxyZWFkeSBpbiB0aGUgYXJyYXkgaWYgd2Ugd2FudCB1bmlxdWVuZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFvcHQudW5pcXVlVmFscyB8fCAoJC5pbkFycmF5KHRoaXNWYWx1ZSwgbWF0Y2hBcnJheSkgPT09IC0xKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEFycmF5LnB1c2goJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnNvdXJjZUNvbHVtbikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgb3V0IHRoZSBzZXQgb2YgbGlzdCBlbGVtZW50cyB0byBjb250YWluIHRoZSBhdmFpbGFibGUgdmFsdWVzXHJcbiAgICAgICAgICAgIHZhciBvdXQgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hdGNoQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIGEgaGlnaGxpZ2h0Q2xhc3MgaGFzIGJlZW4gc3VwcGxpZWQsIHdyYXAgYSBzcGFuIGFyb3VuZCBlYWNoIG1hdGNoXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LmhpZ2hsaWdodENsYXNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdXAgUmVnZXggYmFzZWQgb24gd2hldGhlciB3ZSB3YW50IHRvIGlnbm9yZSBjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNSZWdleCA9IG5ldyBSZWdFeHAoY29sdW1uVmFsdWUsIG9wdC5pZ25vcmVDYXNlID8gXCJnaVwiIDogXCJnXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIExvb2sgZm9yIGFsbCBvY2N1cnJlbmNlc1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbWF0Y2hBcnJheVtpXS5tYXRjaCh0aGlzUmVnZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydExvYyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9vcCBmb3IgZWFjaCBvY2N1cnJlbmNlLCB3cmFwcGluZyBlYWNoIGluIGEgc3BhbiB3aXRoIHRoZSBoaWdobGlnaHRDbGFzcyBDU1MgY2xhc3NcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKG1hdGNoTnVtID0gMDsgbWF0Y2hOdW0gPCBtYXRjaGVzLmxlbmd0aDsgbWF0Y2hOdW0rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1BvcyA9IG1hdGNoQXJyYXlbaV0uaW5kZXhPZihtYXRjaGVzW21hdGNoTnVtXSwgc3RhcnRMb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kUG9zID0gdGhpc1BvcyArIG1hdGNoZXNbbWF0Y2hOdW1dLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNTcGFuID0gXCI8c3BhbiBjbGFzcz0nXCIgKyBvcHQuaGlnaGxpZ2h0Q2xhc3MgKyBcIic+XCIgKyBtYXRjaGVzW21hdGNoTnVtXSArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaEFycmF5W2ldID0gbWF0Y2hBcnJheVtpXS5zdWJzdHIoMCwgdGhpc1BvcykgKyB0aGlzU3BhbiArIG1hdGNoQXJyYXlbaV0uc3Vic3RyKGVuZFBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0TG9jID0gdGhpc1BvcyArIHRoaXNTcGFuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHZhbHVlIHRvIHRoZSBtYXJrdXAgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAgICAgICAgICAgIG91dCArPSBcIjxsaSBzdHlsZT0nZGlzcGxheTogYmxvY2s7cG9zaXRpb246IHJlbGF0aXZlO2N1cnNvcjogcG9pbnRlcjsnPlwiICsgbWF0Y2hBcnJheVtpXSArIFwiPC9saT5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGFsbCB0aGUgbGlzdCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVySWQgY29udGFpbmVyXHJcbiAgICAgICAgICAgIGNvbnRhaW5lck9iai5odG1sKG91dCk7XHJcbiAgICAgICAgICAgIC8vIFNldCB1cCBoZWhhdmlvciBmb3IgdGhlIGF2YWlsYWJsZSB2YWx1ZXMgaW4gdGhlIGxpc3QgZWxlbWVudFxyXG4gICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQgKyBcIiBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQpLmZhZGVPdXQob3B0LnNsaWRlVXBTcGVlZCk7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5PYmoudmFsKCQodGhpcykudGV4dCgpKTtcclxuICAgICAgICAgICAgfSkubW91c2VvdmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtb3VzZW92ZXJDc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJzb3JcIjogXCJoYW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZmZmZmZcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmRcIjogXCIjMzM5OWZmXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyhtb3VzZW92ZXJDc3MpO1xyXG4gICAgICAgICAgICB9KS5tb3VzZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbW91c2VvdXRDc3MgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJzb3JcIjogXCJpbmhlcml0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiBjb2x1bW5PYmpDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmRcIjogXCJ0cmFuc3BhcmVudFwiXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MobW91c2VvdXRDc3MpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlJ3ZlIGdvdCBzb21lIHZhbHVlcyB0byBzaG93LCB0aGVuIHNob3cgJ2VtIVxyXG4gICAgICAgICAgICBpZiAobWF0Y2hBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiI1wiICsgY29udGFpbmVySWQpLnNsaWRlRG93bihvcHQuc2xpZGVEb3duU3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcHJvY2Vzc2luZyBpbmRpY2F0b3JcclxuICAgICAgICAgICAgY29sdW1uT2JqLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEF1dG9jb21wbGV0ZVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byBzZXQgdXAgY2FzY2FkaW5nIGRyb3Bkb3ducyBvbiBhIFNoYXJlUG9pbnQgZm9ybVxyXG4gICAgLy8gKE5ld2Zvcm0uYXNweCwgRWRpdEZvcm0uYXNweCwgb3IgYW55IG90aGVyIGN1c3RvbWl6ZWQgZm9ybS4pXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcFdlYlVSTDogXCJcIiwgLy8gW09wdGlvbmFsXSBUaGUgbmFtZSBvZiB0aGUgV2ViIChzaXRlKSB3aGljaCBjb250YWlucyB0aGUgcmVsYXRpb25zaGlwcyBsaXN0XHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcExpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSBwYXJlbnQvY2hpbGQgcmVsYXRpb25zaGlwc1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgcGFyZW50IGNvbHVtbiBpbiB0aGUgcmVsYXRpb25zaGlwIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdENoaWxkQ29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgY2hpbGQgY29sdW1uIGluIHRoZSByZWxhdGlvbnNoaXAgbGlzdFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbjogXCJcIiwgLy8gW09wdGlvbmFsXSBJZiBzcGVjaWZpZWQsIHNvcnQgdGhlIG9wdGlvbnMgaW4gdGhlIGRyb3Bkb3duIGJ5IHRoaXMgY29sdW1uLFxyXG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgdGhlIG9wdGlvbnMgYXJlIHNvcnRlZCBieSByZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW5cclxuICAgICAgICAgICAgcGFyZW50Q29sdW1uOiBcIlwiLCAvLyBUaGUgZGlzcGxheSBuYW1lIG9mIHRoZSBwYXJlbnQgY29sdW1uIGluIHRoZSBmb3JtXHJcbiAgICAgICAgICAgIGNoaWxkQ29sdW1uOiBcIlwiLCAvLyBUaGUgZGlzcGxheSBuYW1lIG9mIHRoZSBjaGlsZCBjb2x1bW4gaW4gdGhlIGZvcm1cclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIiwgLy8gW09wdGlvbmFsXSBGb3IgcG93ZXIgdXNlcnMsIHRoaXMgQ0FNTCBmcmFnbWVudCB3aWxsIGJlIEFuZGVkIHdpdGggdGhlIGRlZmF1bHQgcXVlcnkgb24gdGhlIHJlbGF0aW9uc2hpcExpc3RcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjxJbmNsdWRlTWFuZGF0b3J5Q29sdW1ucz5GQUxTRTwvSW5jbHVkZU1hbmRhdG9yeUNvbHVtbnM+PC9RdWVyeU9wdGlvbnM+XCIsIC8vIFtPcHRpb25hbF0gRm9yIHBvd2VyIHVzZXJzLCBhYmlsaXR5IHRvIHNwZWNpZnkgUXVlcnkgT3B0aW9uc1xyXG4gICAgICAgICAgICBwcm9tcHRUZXh0OiBcIlwiLCAvLyBbREVQUkVDQVRFRF0gVGV4dCB0byB1c2UgYXMgcHJvbXB0LiBJZiBpbmNsdWRlZCwgezB9IHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWUgb2YgY2hpbGRDb2x1bW4uIE9yaWdpbmFsIHZhbHVlIFwiQ2hvb3NlIHswfS4uLlwiXHJcbiAgICAgICAgICAgIG5vbmVUZXh0OiBcIihOb25lKVwiLCAvLyBbT3B0aW9uYWxdIFRleHQgdG8gdXNlIGZvciB0aGUgKE5vbmUpIHNlbGVjdGlvbi4gUHJvdmlkZWQgZm9yIG5vbi1FbmdsaXNoIGxhbmd1YWdlIHN1cHBvcnQuXHJcbiAgICAgICAgICAgIHNpbXBsZUNoaWxkOiBmYWxzZSwgLy8gW09wdGlvbmFsXSBJZiBzZXQgdG8gdHJ1ZSBhbmQgY2hpbGRDb2x1bW4gaXMgYSBjb21wbGV4IGRyb3Bkb3duLCBjb252ZXJ0IGl0IHRvIGEgc2ltcGxlIGRyb3Bkb3duXHJcbiAgICAgICAgICAgIHNlbGVjdFNpbmdsZU9wdGlvbjogZmFsc2UsIC8vIFtPcHRpb25hbF0gSWYgc2V0IHRvIHRydWUgYW5kIHRoZXJlIGlzIG9ubHkgYSBzaW5nbGUgY2hpbGQgb3B0aW9uLCBzZWxlY3QgaXRcclxuICAgICAgICAgICAgbWF0Y2hPbklkOiBmYWxzZSwgLy8gQnkgZGVmYXVsdCwgd2UgbWF0Y2ggb24gdGhlIGxvb2t1cCdzIHRleHQgdmFsdWUuIElmIG1hdGNoT25JZCBpcyB0cnVlLCB3ZSdsbCBtYXRjaCBvbiB0aGUgbG9va3VwIGlkIGluc3RlYWQuXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlcztpZiBmYWxzZSwgcnVuIHNpbGVudFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIHRoaXNQYXJlbnRTZXRVcCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIHBhcmVudCBjb2x1bW4ncyBzZWxlY3QgKGRyb3Bkb3duKVxyXG4gICAgICAgIHZhciBwYXJlbnRTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG9wdC5wYXJlbnRDb2x1bW5cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAocGFyZW50U2VsZWN0Lk9iai5odG1sKCkgPT09IG51bGwgJiYgb3B0LmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sIFwicGFyZW50Q29sdW1uOiBcIiArIG9wdC5wYXJlbnRDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNoaWxkIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNoaWxkU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY2hpbGRDb2x1bW5cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoY2hpbGRTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjaGlsZENvbHVtbjogXCIgKyBvcHQuY2hpbGRDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHJlcXVlc3RlZCBhbmQgdGhlIGNoaWxkQ29sdW1uIGlzIGEgY29tcGxleCBkcm9wZG93biwgY29udmVydCB0byBhIHNpbXBsZSBkcm9wZG93blxyXG4gICAgICAgIGlmIChvcHQuc2ltcGxlQ2hpbGQgPT09IHRydWUgJiYgY2hpbGRTZWxlY3QuVHlwZSA9PT0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4KSB7XHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzLlNQQ29tcGxleFRvU2ltcGxlRHJvcGRvd24oe1xyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6IG9wdC5jaGlsZENvbHVtblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gU2V0IHRoZSBjaGlsZFNlbGVjdCB0byByZWZlcmVuY2UgdGhlIG5ldyBzaW1wbGUgZHJvcGRvd25cclxuICAgICAgICAgICAgY2hpbGRTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY2hpbGRDb2x1bW5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY2hpbGRDb2x1bW5SZXF1aXJlZCwgY2hpbGRDb2x1bW5TdGF0aWM7XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY2hpbGRDb2x1bW4gZnJvbSB0aGUgY3VycmVudCBsaXN0XHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhY2hlWE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogb3B0Lmxpc3ROYW1lLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkZpZWxkc1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQuY2hpbGRDb2x1bW4gKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBjaGlsZENvbHVtbiBpcyBSZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZENvbHVtblJlcXVpcmVkID0gKCQodGhpcykuYXR0cihcIlJlcXVpcmVkXCIpID09PSBcIlRSVUVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkQ29sdW1uU3RhdGljID0gJCh0aGlzKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RvcCBsb29raW5nOyB3ZSdyZSBkb25lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNhdmUgZGF0YSBhYm91dCBlYWNoIGNoaWxkIGNvbHVtbiBvbiB0aGUgcGFyZW50XHJcbiAgICAgICAgdmFyIGNoaWxkQ29sdW1uID0ge1xyXG4gICAgICAgICAgICBvcHQ6IG9wdCxcclxuICAgICAgICAgICAgY2hpbGRTZWxlY3Q6IGNoaWxkU2VsZWN0LFxyXG4gICAgICAgICAgICBjaGlsZENvbHVtblN0YXRpYzogY2hpbGRDb2x1bW5TdGF0aWMsXHJcbiAgICAgICAgICAgIGNoaWxkQ29sdW1uUmVxdWlyZWQ6IGNoaWxkQ29sdW1uUmVxdWlyZWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBjaGlsZENvbHVtbnMgPSBwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bnNDaGlsZENvbHVtbnNcIik7XHJcblxyXG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGNoaWxkIGZvciB0aGlzIHBhcmVudCwgdGhlbiBjcmVhdGUgdGhlIGRhdGEgb2JqZWN0IHRvIGhvbGQgdGhlIHNldHRpbmdzXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZENvbHVtbnMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgcGFyZW50U2VsZWN0Lk9iai5kYXRhKFwiU1BDYXNjYWRlRHJvcGRvd25zQ2hpbGRDb2x1bW5zXCIsIFtjaGlsZENvbHVtbl0pO1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBhbHJlYWR5IGhhdmUgYSBkYXRhIG9iamVjdCBmb3IgdGhpcyBwYXJlbnQsIHRoZW4gYWRkIHRoZSBzZXR0aW5nIGZvciB0aGlzIGNoaWxkIHRvIGl0XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGRDb2x1bW5zLnB1c2goY2hpbGRDb2x1bW4pO1xyXG4gICAgICAgICAgICBwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bnNDaGlsZENvbHVtbnNcIiwgY2hpbGRDb2x1bW5zKTtcclxuICAgICAgICAgICAgdGhpc1BhcmVudFNldFVwID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBiaW5kIHRvIHRoZSBldmVudChzKSBpZiB3ZSBoYXZlbid0IGFscmVhZHkgZG9uZSBzb1xyXG4gICAgICAgIGlmICghdGhpc1BhcmVudFNldFVwKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAocGFyZW50U2VsZWN0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFBsYWluIG9sZCBzZWxlY3RcclxuICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50U2VsZWN0Lk9iai5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzY2FkZURyb3Bkb3duKHBhcmVudFNlbGVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAvLyBJbnB1dCAvIFNlbGVjdCBoeWJyaWRcclxuICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEJpbmQgdG8gYW55IGNoYW5nZSBvbiB0aGUgaGlkZGVuIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRTZWxlY3Qub3B0SGlkLmJpbmQoXCJwcm9wZXJ0eWNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgLy8gTXVsdGktc2VsZWN0IGh5YnJpZFxyXG4gICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgZGJsY2xpY2sgb24gdGhlIGNhbmRpZGF0ZSBzZWxlY3RcclxuICAgICAgICAgICAgICAgICAgICAkKHBhcmVudFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuYmluZChcImRibGNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzY2FkZURyb3Bkb3duKHBhcmVudFNlbGVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBkYmxjbGljayBvbiB0aGUgc2VsZWN0ZWQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgJChwYXJlbnRTZWxlY3QubWFzdGVyLnJlc3VsdENvbnRyb2wpLmJpbmQoXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBidXR0b24gY2xpY2tzXHJcbiAgICAgICAgICAgICAgICAgICAgJChwYXJlbnRTZWxlY3QubWFzdGVyLmFkZENvbnRyb2wpLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICQocGFyZW50U2VsZWN0Lm1hc3Rlci5yZW1vdmVDb250cm9sKS5iaW5kKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNjYWRlRHJvcGRvd24ocGFyZW50U2VsZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRmlyZSB0aGUgY2hhbmdlIHRvIHNldCB0aGUgaW5pdGlhbGx5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICBjYXNjYWRlRHJvcGRvd24ocGFyZW50U2VsZWN0KTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQQ2FzY2FkZURyb3Bkb3duc1xyXG5cclxuICAgIGZ1bmN0aW9uIGNhc2NhZGVEcm9wZG93bihwYXJlbnRTZWxlY3QpIHtcclxuICAgICAgICB2YXIgY2hvaWNlcyA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHBhcmVudFNlbGVjdFNlbGVjdGVkO1xyXG4gICAgICAgIHZhciBjaGlsZFNlbGVjdFNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICB2YXIgbmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhO1xyXG4gICAgICAgIHZhciBudW1DaGlsZE9wdGlvbnM7XHJcbiAgICAgICAgdmFyIGZpcnN0Q2hpbGRPcHRpb25JZDtcclxuICAgICAgICB2YXIgZmlyc3RDaGlsZE9wdGlvblZhbHVlO1xyXG5cclxuICAgICAgICAvLyBGaWx0ZXIgZWFjaCBjaGlsZCBjb2x1bW5cclxuICAgICAgICB2YXIgY2hpbGRDb2x1bW5zID0gcGFyZW50U2VsZWN0Lk9iai5kYXRhKFwiU1BDYXNjYWRlRHJvcGRvd25zQ2hpbGRDb2x1bW5zXCIpO1xyXG4gICAgICAgICQoY2hpbGRDb2x1bW5zKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEJyZWFrIG91dCB0aGUgZGF0YSBvYmplY3RzIGZvciB0aGlzIGNoaWxkIGNvbHVtblxyXG4gICAgICAgICAgICB2YXIgaTtcclxuICAgICAgICAgICAgdmFyIG9wdCA9IHRoaXMub3B0O1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRTZWxlY3QgPSB0aGlzLmNoaWxkU2VsZWN0O1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb2x1bW5TdGF0aWMgPSB0aGlzLmNoaWxkQ29sdW1uU3RhdGljO1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRDb2x1bW5SZXF1aXJlZCA9IHRoaXMuY2hpbGRDb2x1bW5SZXF1aXJlZDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgcGFyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICAgICAgcGFyZW50U2VsZWN0U2VsZWN0ZWQgPSB1dGlscy5nZXREcm9wZG93blNlbGVjdGVkKHBhcmVudFNlbGVjdCwgb3B0Lm1hdGNoT25JZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGhhc24ndCBjaGFuZ2VkLCB0aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkbyByaWdodCBub3cuICBUaGlzIGlzIHVzZWZ1bCB0byByZWR1Y2VcclxuICAgICAgICAgICAgLy8gdGhlIG51bWJlciBvZiBXZWIgU2VydmljZSBjYWxscyB3aGVuIHRoZSBwYXJlbnRTZWxlY3QuVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleCBvciBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0LCBhcyB0aGVyZSBhcmUgbXVsdGlwbGUgcHJvcGVydHljaGFuZ2VzXHJcbiAgICAgICAgICAgIC8vIHdoaWNoIGRvbid0IHJlcXVpcmUgYW55IGFjdGlvbi4gIFRoZSBhdHRyaWJ1dGUgd2lsbCBiZSB1bmlxdWUgcGVyIGNoaWxkIGNvbHVtbiBpbiBjYXNlIHRoZXJlIGFyZVxyXG4gICAgICAgICAgICAvLyBtdWx0aXBsZSBjaGlsZHJlbiBmb3IgYSBnaXZlbiBwYXJlbnQuXHJcbiAgICAgICAgICAgIHZhciBhbGxQYXJlbnRTZWxlY3Rpb25zID0gcGFyZW50U2VsZWN0U2VsZWN0ZWQuam9pbihjb25zdGFudHMuc3BEZWxpbSk7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRTZWxlY3QuT2JqLmRhdGEoXCJTUENhc2NhZGVEcm9wZG93bl9TZWxlY3RlZF9cIiArIGNoaWxkQ29sdW1uU3RhdGljKSA9PT0gYWxsUGFyZW50U2VsZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBhcmVudFNlbGVjdC5PYmouZGF0YShcIlNQQ2FzY2FkZURyb3Bkb3duX1NlbGVjdGVkX1wiICsgY2hpbGRDb2x1bW5TdGF0aWMsIGFsbFBhcmVudFNlbGVjdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNoaWxkIGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICAgICAgY2hpbGRTZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY2hpbGRTZWxlY3QsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiB0aGUgcGFyZW50IGNvbHVtbidzIHNlbGVjdGVkIG9wdGlvbiBjaGFuZ2VzLCBnZXQgdGhlIG1hdGNoaW5nIGl0ZW1zIGZyb20gdGhlIHJlbGF0aW9uc2hpcCBsaXN0XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbGlzdCBpdGVtcyB3aGljaCBtYXRjaCB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAgICAgICAgdmFyIHNvcnRDb2x1bW4gPSAob3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0Q29sdW1uLmxlbmd0aCA+IDApID8gb3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0Q29sdW1uIDogb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbjtcclxuICAgICAgICAgICAgdmFyIGNhbWxRdWVyeSA9IFwiPFF1ZXJ5PjxPcmRlckJ5PjxGaWVsZFJlZiBOYW1lPSdcIiArIHNvcnRDb2x1bW4gKyBcIicvPjwvT3JkZXJCeT48V2hlcmU+PEFuZD5cIjtcclxuICAgICAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEFuZD5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgdXAgdGhlIGNyaXRlcmlhIGZvciBpbmNsdXNpb25cclxuICAgICAgICAgICAgaWYgKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIG5vIHZhbHVlcyBhcmUgc2VsZWN0ZWQgaW4gbXVsdGktc2VsZWN0c1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICsgXCInLz48VmFsdWUgVHlwZT0nVGV4dCc+PC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gT25seSBvbmUgdmFsdWUgaXMgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxFcT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRpb25zaGlwTGlzdFBhcmVudENvbHVtbiArXHJcbiAgICAgICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLmVzY2FwZUNvbHVtblZhbHVlKHBhcmVudFNlbGVjdFNlbGVjdGVkWzBdKSArIFwiPC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvdW5kID0gKHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aCA+IDIpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IChwYXJlbnRTZWxlY3RTZWxlY3RlZC5sZW5ndGggLSAxKTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPE9yPlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcmVudFNlbGVjdFNlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lc2NhcGVDb2x1bW5WYWx1ZShwYXJlbnRTZWxlY3RTZWxlY3RlZFtpXSkgKyBcIjwvVmFsdWU+PC9FcT5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDAgJiYgKGkgPCAocGFyZW50U2VsZWN0U2VsZWN0ZWQubGVuZ3RoIC0gMSkpICYmIGNvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjwvT3I+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPC9Pcj5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IG9wdC5DQU1MUXVlcnkgKyBcIjwvQW5kPlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZG9uJ3QgZ2V0IGFueSBpdGVtcyB3aGljaCBkb24ndCBoYXZlIHRoZSBjaGlsZCB2YWx1ZVxyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gXCI8SXNOb3ROdWxsPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4gKyBcIicgLz48L0lzTm90TnVsbD5cIjtcclxuXHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjwvQW5kPjwvV2hlcmU+PC9RdWVyeT5cIjtcclxuXHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgIC8vIEZvcmNlIHN5bmMgc28gdGhhdCB3ZSBoYXZlIHRoZSByaWdodCB2YWx1ZXMgZm9yIHRoZSBjaGlsZCBjb2x1bW4gb25jaGFuZ2UgdHJpZ2dlclxyXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQucmVsYXRpb25zaGlwV2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5yZWxhdGlvbnNoaXBMaXN0LFxyXG4gICAgICAgICAgICAgICAgLy8gRmlsdGVyIGJhc2VkIG9uIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcGFyZW50IGNvbHVtbidzIHZhbHVlXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnk6IGNhbWxRdWVyeSxcclxuICAgICAgICAgICAgICAgIC8vIE9ubHkgZ2V0IHRoZSBwYXJlbnQgYW5kIGNoaWxkIGNvbHVtbnNcclxuICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0UGFyZW50Q29sdW1uICsgXCInIC8+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbiArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHZpZXcgcm93bGltaXQgYW5kIGdldCBhbGwgYXBwcm9wcmlhdGUgcm93c1xyXG4gICAgICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAgICAgLy8gRXZlbiB0aG91Z2ggc2V0dGluZyBJbmNsdWRlTWFuZGF0b3J5Q29sdW1ucyB0byBGQUxTRSBkb2Vzbid0IHdvcmsgYXMgdGhlIGRvY3MgZGVzY3JpYmUsIGl0IGZpeGVzIGEgYnVnIGluIEdldExpc3RJdGVtcyB3aXRoIG1hbmRhdG9yeSBtdWx0aS1zZWxlY3RzXHJcbiAgICAgICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBvcHQuQ0FNTFF1ZXJ5T3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhhbmRsZSBlcnJvcnNcclxuICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZXJyb3JzdHJpbmdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BDYXNjYWRlRHJvcGRvd25zXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvclRleHQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiT25lIG9yIG1vcmUgZmllbGQgdHlwZXMgYXJlIG5vdCBpbnN0YWxsZWQgcHJvcGVybHkuIEdvIHRvIHRoZSBsaXN0IHNldHRpbmdzIHBhZ2UgdG8gZGVsZXRlIHRoZXNlIGZpZWxkcy5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3RQYXJlbnRDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RQYXJlbnRDb2x1bW4gKyBcIiBvciBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXBMaXN0IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiR3VpZCBzaG91bGQgY29udGFpbiAzMiBkaWdpdHMgd2l0aCA0IGRhc2hlcyAoeHh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHh4KS5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3Q6IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJMaXN0IG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFuIGV4cGxhbmF0b3J5IHByb21wdFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY2hpbGRTZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QuT2JqWzBdLmlubmVySFRNTCA9IFwiXCI7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY2hpbGRTZWxlY3QuT2JqKS5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGNvbHVtbiBpcyByZXF1aXJlZCBvciB0aGUgcHJvbXB0VGV4dCBvcHRpb24gaXMgZW1wdHksIGRvbid0IGFkZCB0aGUgcHJvbXB0IHRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2hpbGRDb2x1bW5SZXF1aXJlZCAmJiAob3B0LnByb21wdFRleHQubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQucHJvbXB0VGV4dC5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5jaGlsZENvbHVtbikgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWNoaWxkQ29sdW1uUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQubm9uZVRleHQgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjb2x1bW4gaXMgcmVxdWlyZWQsIGRvbid0IGFkZCB0aGUgXCIoTm9uZSlcIiBvcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZXMgPSBjaGlsZENvbHVtblJlcXVpcmVkID8gXCJcIiA6IG9wdC5ub25lVGV4dCArIFwifDBcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkU2VsZWN0Lk9iai52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuZmluZChcIm9wdGlvblwiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld011bHRpTG9va3VwUGlja2VyZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGNvdW50IG9mIGl0ZW1zIHJldHVybmVkIGFuZCBzYXZlIGl0IHNvIHRoYXQgd2UgY2FuIHNlbGVjdCBpZiBpdCdzIGEgc2luZ2xlIG9wdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBpdGVtIGNvdW50IGlzIHN0b3JlZCB0aHVzOiA8cnM6ZGF0YSBJdGVtQ291bnQ9XCIxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgbnVtQ2hpbGRPcHRpb25zID0gcGFyc2VGbG9hdCgkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJyczpkYXRhXCIpLmF0dHIoXCJJdGVtQ291bnRcIikpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgYW4gb3B0aW9uIGZvciBlYWNoIGNoaWxkIGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzT3B0aW9uID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiByZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4gaXMgYSBMb29rdXAgY29sdW1uLCB0aGVuIHRoZSBJRCBzaG91bGQgYmUgZm9yIHRoZSBMb29rdXAgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNWYWx1ZSA9ICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q2hpbGRDb2x1bW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzVmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdGhpc1ZhbHVlLmluZGV4T2YoY29uc3RhbnRzLnNwRGVsaW0pID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc09wdGlvbiA9IG5ldyB1dGlscy5TcGxpdEluZGV4KHRoaXNWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzT3B0aW9uLmlkID0gJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc09wdGlvbi52YWx1ZSA9IHRoaXNWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlbGF0aW9uc2hpcExpc3RDaGlsZENvbHVtbiBpcyBhIGNhbGN1bGF0ZWQgY29sdW1uLCB0aGVuIHRoZSB2YWx1ZSBpc24ndCBwcmVjZWRlZCBieSB0aGUgSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBieSB0aGUgZGF0YXR5cGUuICBJbiB0aGlzIGNhc2UsIHRoaXNPcHRpb24uaWQgc2hvdWxkIGJlIHRoZSBJRCBvZiB0aGUgcmVsYXRpb25zaGlwTGlzdCBpdGVtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlLmcuLCBmbG9hdDsjMTIzNDUuNjdcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXNPcHRpb24uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzT3B0aW9uLmlkID0gJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBpZCBhbmQgdmFsdWUgZm9yIHRoZSBmaXJzdCBjaGlsZCBvcHRpb24gaW4gY2FzZSB3ZSBuZWVkIHRvIHNlbGVjdCBpdCAoc2VsZWN0U2luZ2xlT3B0aW9uIG9wdGlvbiBpcyB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENoaWxkT3B0aW9uSWQgPSB0aGlzT3B0aW9uLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdENoaWxkT3B0aW9uVmFsdWUgPSB0aGlzT3B0aW9uLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjaGlsZFNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZCA9ICgkKHRoaXMpLmF0dHIoXCJvd3NfSURcIikgPT09IGNoaWxkU2VsZWN0U2VsZWN0ZWRbMF0pID8gXCIgc2VsZWN0ZWQ9J3NlbGVjdGVkJ1wiIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvblwiICsgc2VsZWN0ZWQgKyBcIiB2YWx1ZT0nXCIgKyB0aGlzT3B0aW9uLmlkICsgXCInPlwiICsgdGhpc09wdGlvbi52YWx1ZSArIFwiPC9vcHRpb24+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXNPcHRpb24uaWQgPT09IGNoaWxkU2VsZWN0U2VsZWN0ZWRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QuT2JqLnZhbCh0aGlzT3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvaWNlcyA9IGNob2ljZXMgKyAoKGNob2ljZXMubGVuZ3RoID4gMCkgPyBcInxcIiA6IFwiXCIpICsgdGhpc09wdGlvbi52YWx1ZSArIFwifFwiICsgdGhpc09wdGlvbi5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5tdWx0aVNlbGVjdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHRoaXNPcHRpb24uaWQgKyBcIic+XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhICs9IHRoaXNPcHRpb24uaWQgKyBcInx0XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCJ8dCB8dCB8dFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNoaWxkU2VsZWN0LlR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkU2VsZWN0Lk9iai50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgb25seSBvbmUgb3B0aW9uIGFuZCB0aGUgc2VsZWN0U2luZ2xlT3B0aW9uIG9wdGlvbiBpcyB0cnVlLCB0aGVuIHNlbGVjdCBpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bUNoaWxkT3B0aW9ucyA9PT0gMSAmJiBvcHQuc2VsZWN0U2luZ2xlT3B0aW9uID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5PYmopLmZpbmQoXCJvcHRpb25bdmFsdWUhPScwJ106Zmlyc3RcIikuYXR0cihcInNlbGVjdGVkXCIsIFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGFsbG93YWJsZSBjaG9pY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5PYmouYXR0cihcImNob2ljZXNcIiwgY2hvaWNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IG9uZSBvcHRpb24gYW5kIHRoZSBzZWxlY3RTaW5nbGVPcHRpb24gb3B0aW9uIGlzIHRydWUsIHRoZW4gc2VsZWN0IGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVtQ2hpbGRPcHRpb25zID09PSAxICYmIG9wdC5zZWxlY3RTaW5nbGVPcHRpb24gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGlucHV0IGVsZW1lbnQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lk9iaikudmFsKGZpcnN0Q2hpbGRPcHRpb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZSBvZiB0aGUgb3B0SGlkIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5vcHRIaWQudmFsKGZpcnN0Q2hpbGRPcHRpb25JZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIHNlbGVjdGlvbiwgdGhlbiByZW1vdmUgdGhlIHZhbHVlIGluIHRoZSBhc3NvY2lhdGVkIGhpZGRlbiBpbnB1dCBlbGVtZW50IChvcHRIaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRTZWxlY3QuT2JqLnZhbCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3Qub3B0SGlkLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgbWFzdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5tYXN0ZXIuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFNlbGVjdC5NdWx0aUxvb2t1cFBpY2tlcmRhdGEudmFsKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xlYXIgYW55IHByaW9yIHNlbGVjdGlvbnMgdGhhdCBhcmUgbm8gbG9uZ2VyIHZhbGlkIG9yIGFyZW4ndCBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIucmVzdWx0Q29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucHJvcChcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY2hpbGRTZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmZpbmQoXCJvcHRpb25bdmFsdWU9J1wiICsgdGhpc1NlbGVjdGVkLnZhbCgpICsgXCInXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1NlbGVjdGVkLnByb3AoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdpcFJlbW92ZVNlbGVjdGVkSXRlbXMoY2hpbGRTZWxlY3QubWFzdGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIGFueSBvcHRpb25zIGluIHRoZSBjYW5kaWRhdGUgbGlzdCB3aGljaCBhcmUgYWxyZWFkeSBzZWxlY3RlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGNoaWxkU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5maW5kKFwib3B0aW9uW3ZhbHVlPSdcIiArIHRoaXNTZWxlY3RlZC52YWwoKSArIFwiJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNTZWxlY3RlZC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgR2lwQWRkU2VsZWN0ZWRJdGVtcyhjaGlsZFNlbGVjdC5tYXN0ZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBtYXN0ZXIuZGF0YSB0byB0aGUgbmV3bHkgYWxsb3dhYmxlIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTZWxlY3QubWFzdGVyLmRhdGEgPSBHaXBHZXRHcm91cERhdGEobmV3TXVsdGlMb29rdXBQaWNrZXJkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGEgZGJsY2xpY2sgc28gdGhhdCB0aGUgY2hpbGQgd2lsbCBiZSBjYXNjYWRlZCBpZiBpdCBpcyBhIG11bHRpc2VsZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjaGlsZFNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkudHJpZ2dlcihcImRibGNsaWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gSWYgcHJlc2VudCwgY2FsbCBjb21wbGV0ZWZ1bmMgd2hlbiBhbGwgZWxzZSBpcyBkb25lXHJcbiAgICAgICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTsgLy8gJChjaGlsZENvbHVtbnMpLmVhY2goZnVuY3Rpb24oKVxyXG5cclxuICAgIH0gLy8gRW5kIGNhc2NhZGVEcm9wZG93blxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHRvIGNvbnZlcnQgY29tcGxleCBkcm9wZG93bnMgdG8gc2ltcGxlIGRyb3Bkb3duc1xyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQQ29tcGxleFRvU2ltcGxlRHJvcGRvd24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IG51bGwsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7aWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgY29sdW1uJ3Mgc2VsZWN0IChkcm9wZG93bilcclxuICAgICAgICB2YXIgY29sdW1uU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY29sdW1uTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KFwiU1BTZXJ2aWNlcy5TUENvbXBsZXhUb1NpbXBsZURyb3Bkb3duXCIsIFwiY29sdW1uTmFtZTogXCIgKyBvcHQuY29sdW1uTmFtZSwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIGNvbXBsZXggZHJvcGRvd24sIHRoZW4gdGhlcmUgaXMgbm90aGluZyB0byBkb1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuVHlwZSAhPT0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBhdmFpbGFibGUgb3B0aW9ucyBhcmUgc3RvcmVkIGluIHRoZSBjaG9pY2VzIGF0dHJpYnV0ZSBvZiB0aGUgY29tcGxleCBkcm9wZG93bidzIGlucHV0IGVsZW1lbnQuLi5cclxuICAgICAgICB2YXIgY2hvaWNlcyA9ICQoY29sdW1uU2VsZWN0Lk9iaikuYXR0cihcImNob2ljZXNcIikuc3BsaXQoXCJ8XCIpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGtub3cgd2hpY2ggb3B0aW9uIGlzIHNlbGVjdGVkIGFscmVhZHksIGlmIGFueVxyXG4gICAgICAgIHZhciBjb21wbGV4U2VsZWN0U2VsZWN0ZWRJZCA9IGNvbHVtblNlbGVjdC5vcHRIaWQudmFsKCk7XHJcblxyXG4gICAgICAgIC8vIEJ1aWxkIHVwIHRoZSBzaW1wbGUgZHJvcGRvd24sIGdpdmluZyBpdCBhbiBlYXN5IHRvIHNlbGVjdCBpZFxyXG4gICAgICAgIHZhciBzaW1wbGVTZWxlY3RJZCA9IHV0aWxzLmdlbkNvbnRhaW5lcklkKFwiU1BDb21wbGV4VG9TaW1wbGVEcm9wZG93blwiLCBjb2x1bW5TZWxlY3QuT2JqLmF0dHIoXCJ0aXRsZVwiKSwgb3B0Lmxpc3ROYW1lKTtcclxuXHJcbiAgICAgICAgdmFyIHNpbXBsZVNlbGVjdCA9IFwiPHNlbGVjdCBpZD0nXCIgKyBzaW1wbGVTZWxlY3RJZCArIFwiJyB0aXRsZT0nXCIgKyBvcHQuY29sdW1uTmFtZSArIFwiJz5cIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNob2ljZXMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgdmFyIHNpbXBsZVNlbGVjdFNlbGVjdGVkID0gKGNob2ljZXNbaSArIDFdID09PSBjb21wbGV4U2VsZWN0U2VsZWN0ZWRJZCkgPyBcIiBzZWxlY3RlZD0nc2VsZWN0ZWQnIFwiIDogXCIgXCI7XHJcbiAgICAgICAgICAgIHNpbXBsZVNlbGVjdCArPSBcIjxvcHRpb25cIiArIHNpbXBsZVNlbGVjdFNlbGVjdGVkICsgXCJ2YWx1ZT0nXCIgKyBjaG9pY2VzW2kgKyAxXSArIFwiJz5cIiArIGNob2ljZXNbaV0gKyBcIjwvb3B0aW9uPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzaW1wbGVTZWxlY3QgKz0gXCI8L3NlbGVjdD5cIjtcclxuXHJcbiAgICAgICAgLy8gQXBwZW5kIHRoZSBuZXcgc2ltcGxlIHNlbGVjdCB0byB0aGUgZm9ybVxyXG4gICAgICAgIGNvbHVtblNlbGVjdC5PYmouY2xvc2VzdChcInRkXCIpLnByZXBlbmQoc2ltcGxlU2VsZWN0KTtcclxuICAgICAgICB2YXIgc2ltcGxlU2VsZWN0T2JqID0gJChcIiNcIiArIHNpbXBsZVNlbGVjdElkKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBjb21wbGV4IGRyb3Bkb3duIGZ1bmN0aW9uYWxpdHkgc2luY2Ugd2UgZG9uJ3QgbmVlZCBpdCBhbnltb3JlLi4uXHJcbiAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5jbG9zZXN0KFwic3BhblwiKS5maW5kKFwiaW1nXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIC8vIC4uLmFuZCBoaWRlIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5jbG9zZXN0KFwic3BhblwiKS5maW5kKFwiaW5wdXRcIikuaGlkZSgpO1xyXG5cclxuICAgICAgICAvLyBXaGVuIHRoZSBzaW1wbGUgc2VsZWN0IGNoYW5nZXMuLi5cclxuICAgICAgICBzaW1wbGVTZWxlY3RPYmouY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNWYWwgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICAvLyAuLi5zZXQgdGhlIG9wdEhpZCBpbnB1dCBlbGVtZW50J3MgdmFsdWUgdG8gdGhlIHZhbHVzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uLi5cclxuICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm9wdEhpZC52YWwodGhpc1ZhbCk7XHJcbiAgICAgICAgICAgIC8vIC4uLmFuZCBzYXZlIHRoZSBzZWxlY3RlZCB2YWx1ZSBhcyB0aGUgaGlkZGVuIGlucHV0J3MgdmFsdWUgb25seSBpZiB0aGUgdmFsdWUgaXMgbm90IGVxdWFsIHRvIFwiMFwiIChOb25lKVxyXG4gICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5PYmopLnZhbCgkKHRoaXMpLmZpbmQoXCJvcHRpb25bdmFsdWU9J1wiICsgKHRoaXNWYWwgIT09IFwiMFwiID8gdGhpc1ZhbCA6IFwiXCIpICsgXCInXVwiKS5odG1sKCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFRyaWdnZXIgYSBjaGFuZ2UgdG8gZW5zdXJlIHRoYXQgdGhlIHNlbGVjdGVkIHZhbHVlIHJlZ2lzdGVycyBpbiB0aGUgY29tcGxleCBkcm9wZG93blxyXG4gICAgICAgIHNpbXBsZVNlbGVjdE9iai50cmlnZ2VyKFwiY2hhbmdlXCIpO1xyXG5cclxuICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BDb252ZXJ0VG9TaW1wbGVEcm9wZG93blxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHRvIGRpc3BsYXkgcmVsYXRlZCBpbmZvcm1hdGlvbiB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZCBvbiBhIGZvcm0uXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BEaXNwbGF5UmVsYXRlZEluZm8gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6ICQoKS5TUFNlcnZpY2VzLlNQTGlzdE5hbWVGcm9tVXJsKCksIC8vIFRoZSBsaXN0IHRoZSBmb3JtIGlzIHdvcmtpbmcgd2l0aC4gVGhpcyBpcyB1c2VmdWwgaWYgdGhlIGZvcm0gaXMgbm90IGluIHRoZSBsaXN0IGNvbnRleHQuXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICByZWxhdGVkV2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFRoZSBuYW1lIG9mIHRoZSBXZWIgKHNpdGUpIHdoaWNoIGNvbnRhaW5zIHRoZSByZWxhdGVkIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRlZExpc3Q6IFwiXCIsIC8vIFRoZSBuYW1lIG9mIHRoZSBsaXN0IHdoaWNoIGNvbnRhaW5zIHRoZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXHJcbiAgICAgICAgICAgIHJlbGF0ZWRMaXN0Q29sdW1uOiBcIlwiLCAvLyBUaGUgaW50ZXJuYWwgbmFtZSBvZiB0aGUgcmVsYXRlZCBjb2x1bW4gaW4gdGhlIHJlbGF0ZWQgbGlzdFxyXG4gICAgICAgICAgICByZWxhdGVkQ29sdW1uczogW10sIC8vIEFuIGFycmF5IG9mIHJlbGF0ZWQgY29sdW1ucyB0byBkaXNwbGF5XHJcbiAgICAgICAgICAgIGRpc3BsYXlGb3JtYXQ6IFwidGFibGVcIiwgLy8gVGhlIGZvcm1hdCB0byB1c2UgaW4gZGlzcGxheWluZyB0aGUgcmVsYXRlZCBpbmZvcm1hdGlvbi4gIFBvc3NpYmxlIHZhbHVlcyBhcmU6IFt0YWJsZSwgbGlzdCwgbm9uZV1cclxuICAgICAgICAgICAgaGVhZGVyQ1NTQ2xhc3M6IFwibXMtdmgyXCIsIC8vIENTUyBjbGFzcyBmb3IgdGhlIHRhYmxlIGhlYWRlcnNcclxuICAgICAgICAgICAgcm93Q1NTQ2xhc3M6IFwibXMtdmJcIiwgLy8gQ1NTIGNsYXNzIGZvciB0aGUgdGFibGUgcm93c1xyXG4gICAgICAgICAgICBDQU1MUXVlcnk6IFwiXCIsIC8vIFtPcHRpb25hbF0gRm9yIHBvd2VyIHVzZXJzLCB0aGlzIENBTUwgZnJhZ21lbnQgd2lsbCBiZSA8QW5kPmVkIHdpdGggdGhlIGRlZmF1bHQgcXVlcnkgb24gdGhlIHJlbGF0ZWRMaXN0XHJcbiAgICAgICAgICAgIG51bUNoYXJzOiAwLCAvLyBJZiB1c2VkIG9uIGFuIGlucHV0IGNvbHVtbiAobm90IGEgZHJvcGRvd24pLCBubyBtYXRjaGluZyB3aWxsIG9jY3VyIHVudGlsIGF0IGxlYXN0IHRoaXMgbnVtYmVyIG9mIGNoYXJhY3RlcnMgaGFzIGJlZW4gZW50ZXJlZFxyXG4gICAgICAgICAgICBtYXRjaFR5cGU6IFwiRXFcIiwgLy8gSWYgdXNlZCBvbiBhbiBpbnB1dCBjb2x1bW4gKG5vdCBhIGRyb3Bkb3duKSwgdHlwZSBvZiBtYXRjaC4gQ2FuIGJlIGFueSB2YWxpZCBDQU1MIGNvbXBhcmlzb24gb3BlcmF0b3IsIG1vc3Qgb2Z0ZW4gXCJFcVwiIG9yIFwiQmVnaW5zV2l0aFwiXHJcbiAgICAgICAgICAgIG1hdGNoT25JZDogZmFsc2UsIC8vIEJ5IGRlZmF1bHQsIHdlIG1hdGNoIG9uIHRoZSBsb29rdXAncyB0ZXh0IHZhbHVlLiBJZiBtYXRjaE9uSWQgaXMgdHJ1ZSwgd2UnbGwgbWF0Y2ggb24gdGhlIGxvb2t1cCBpZCBpbnN0ZWFkLlxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IG51bGwsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICAgICAgZGVidWc6IGZhbHNlIC8vIElmIHRydWUsIHNob3cgZXJyb3IgbWVzc2FnZXM7aWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIHJlbGF0ZWRDb2x1bW5zWE1MID0gW107XHJcbiAgICAgICAgdmFyIHJlbGF0ZWRMaXN0WE1MO1xyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BEaXNwbGF5UmVsYXRlZEluZm9cIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgY29sdW1uJ3Mgc2VsZWN0IChkcm9wZG93bilcclxuICAgICAgICB2YXIgY29sdW1uU2VsZWN0ID0gJCgpLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bCh7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBvcHQuY29sdW1uTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5jb2x1bW5OYW1lLCBjb25zdGFudHMuVFhUQ29sdW1uTm90Rm91bmQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBHZXQgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHJlbGF0ZWQgbGlzdCBhbmQgaXRzIGNvbHVtbnNcclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0XCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LnJlbGF0ZWRXZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBkZWJ1ZyBpcyBvbiwgbm90aWZ5IGFib3V0IGFuIGVycm9yXHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZmF1bHRjb2RlXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJyZWxhdGVkTGlzdDogXCIgKyBvcHQucmVsYXRlZExpc3QsIFwiTGlzdCBub3QgZm91bmRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGluZm8gYWJvdXQgdGhlIHJlbGF0ZWQgbGlzdFxyXG4gICAgICAgICAgICAgICAgcmVsYXRlZExpc3RYTUwgPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiTGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIC8vIFNhdmUgdGhlIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggY29sdW1uIHJlcXVlc3RlZFxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5yZWxhdGVkQ29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0gPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRzID4gRmllbGRbTmFtZT0nXCIgKyBvcHQucmVsYXRlZENvbHVtbnNbaV0gKyBcIiddXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRMaXN0Q29sdW1uXSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZHMgPiBGaWVsZFtOYW1lPSdcIiArIG9wdC5yZWxhdGVkTGlzdENvbHVtbiArIFwiJ11cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjb2x1bW5TZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBQbGFpbiBvbGQgc2VsZWN0XHJcbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLmJpbmQoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dSZWxhdGVkKG9wdCwgcmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIC8vIElucHV0IC8gU2VsZWN0IGh5YnJpZFxyXG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgIC8vIEJpbmQgdG8gYW55IGNoYW5nZSBvbiB0aGUgaGlkZGVuIGlucHV0IGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5vcHRIaWQuYmluZChcInByb3BlcnR5Y2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93UmVsYXRlZChvcHQsIHJlbGF0ZWRMaXN0WE1MLCByZWxhdGVkQ29sdW1uc1hNTCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyBNdWx0aS1zZWxlY3QgaHlicmlkXHJcbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5tdWx0aVNlbGVjdDpcclxuICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImNvbHVtbk5hbWU6IFwiICsgb3B0LmNvbHVtbk5hbWUsIFwiTXVsdGktc2VsZWN0IGNvbHVtbnMgbm90IHN1cHBvcnRlZCBieSB0aGlzIGZ1bmN0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRmlyZSB0aGUgY2hhbmdlIHRvIHNldCB0aGUgaW5pdGlhbGx5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICBzaG93UmVsYXRlZChvcHQsIHJlbGF0ZWRMaXN0WE1MLCByZWxhdGVkQ29sdW1uc1hNTCk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUERpc3BsYXlSZWxhdGVkSW5mb1xyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dSZWxhdGVkKG9wdCwgcmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MKSB7XHJcblxyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBjb2x1bW5TZWxlY3RTZWxlY3RlZDtcclxuICAgICAgICB2YXIgdGhpc0Z1bmN0aW9uID0gXCJTUFNlcnZpY2VzLlNQRGlzcGxheVJlbGF0ZWRJbmZvXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNvbHVtblNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0LmNvbHVtbk5hbWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY29sdW1uU2VsZWN0LCBvcHQubWF0Y2hPbklkKTtcclxuICAgICAgICBpZiAoY29sdW1uU2VsZWN0LlR5cGUgPT09IGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleCAmJiBvcHQubnVtQ2hhcnMgPiAwICYmIGNvbHVtblNlbGVjdFNlbGVjdGVkWzBdLmxlbmd0aCA8IG9wdC5udW1DaGFycykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGUgc2VsZWN0aW9uIGhhc24ndCBjaGFuZ2VkLCB0aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBkbyByaWdodCBub3cuICBUaGlzIGlzIHVzZWZ1bCB0byByZWR1Y2VcclxuICAgICAgICAvLyB0aGUgbnVtYmVyIG9mIFdlYiBTZXJ2aWNlIGNhbGxzIHdoZW4gdGhlIHBhcmVudFNlbGVjdC5UeXBlID0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4LCBhcyB0aGVyZSBhcmUgbXVsdGlwbGUgcHJvcGVydHljaGFuZ2VzXHJcbiAgICAgICAgLy8gd2hpY2ggZG9uJ3QgcmVxdWlyZSBhbnkgYWN0aW9uLlxyXG4gICAgICAgIGlmIChjb2x1bW5TZWxlY3QuT2JqLmF0dHIoXCJzaG93UmVsYXRlZFNlbGVjdGVkXCIpID09PSBjb2x1bW5TZWxlY3RTZWxlY3RlZFswXSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXR0cihcInNob3dSZWxhdGVkU2VsZWN0ZWRcIiwgY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pO1xyXG5cclxuICAgICAgICBpZihvcHQuZGlzcGxheUZvcm1hdCAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIHRoZSBjb250YWluZXJcclxuICAgICAgICAgICAgdmFyIGRpdklkID0gdXRpbHMuZ2VuQ29udGFpbmVySWQoXCJTUERpc3BsYXlSZWxhdGVkSW5mb1wiLCBvcHQuY29sdW1uTmFtZSwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvbGQgY29udGFpbmVyLi4uXHJcbiAgICAgICAgICAgICQoXCIjXCIgKyBkaXZJZCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIC8vIC4uLmFuZCBhcHBlbmQgYSBuZXcsIGVtcHR5IG9uZVxyXG4gICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnBhcmVudCgpLmFwcGVuZChcIjxkaXYgaWQ9XCIgKyBkaXZJZCArIFwiPjwvZGl2PlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgbGlzdCBpdGVtcyB3aGljaCBtYXRjaCB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAgICB2YXIgY2FtbFF1ZXJ5ID0gXCI8UXVlcnk+PFdoZXJlPlwiO1xyXG4gICAgICAgIGlmIChvcHQuQ0FNTFF1ZXJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEFuZD5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5lZWQgdG8gaGFuZGxlIExvb2t1cCBjb2x1bW5zIGRpZmZlcmVudGx5IHRoYW4gc3RhdGljIGNvbHVtbnNcclxuICAgICAgICB2YXIgcmVsYXRlZExpc3RDb2x1bW5UeXBlID0gcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRMaXN0Q29sdW1uXS5hdHRyKFwiVHlwZVwiKTtcclxuICAgICAgICBpZiAocmVsYXRlZExpc3RDb2x1bW5UeXBlID09PSBcIkxvb2t1cFwiKSB7XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBcIjxFcT48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRlZExpc3RDb2x1bW4gK1xyXG4gICAgICAgICAgICAgICAgKG9wdC5tYXRjaE9uSWQgPyBcIicgTG9va3VwSWQ9J1RydWUnLz48VmFsdWUgVHlwZT0nSW50ZWdlcic+XCIgOiBcIicvPjxWYWx1ZSBUeXBlPSdUZXh0Jz5cIikgK1xyXG4gICAgICAgICAgICAgICAgdXRpbHMuZXNjYXBlQ29sdW1uVmFsdWUoY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pICsgXCI8L1ZhbHVlPjwvRXE+XCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdcIiArXHJcbiAgICAgICAgICAgICAgICAob3B0Lm1hdGNoT25JZCA/IFwiSUQnIC8+PFZhbHVlIFR5cGU9J0NvdW50ZXInPlwiIDogb3B0LnJlbGF0ZWRMaXN0Q29sdW1uICsgXCInLz48VmFsdWUgVHlwZT0nVGV4dCc+XCIpICtcclxuICAgICAgICAgICAgICAgIHV0aWxzLmVzY2FwZUNvbHVtblZhbHVlKGNvbHVtblNlbGVjdFNlbGVjdGVkWzBdKSArIFwiPC9WYWx1ZT48L0VxPlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gb3B0LkNBTUxRdWVyeSArIFwiPC9BbmQ+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbWxRdWVyeSArPSBcIjwvV2hlcmU+PC9RdWVyeT5cIjtcclxuXHJcbiAgICAgICAgdmFyIHZpZXdGaWVsZHMgPSBcIiBcIjtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0LnJlbGF0ZWRDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZpZXdGaWVsZHMgKz0gXCI8RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQucmVsYXRlZENvbHVtbnNbaV0gKyBcIicgLz5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RJdGVtc1wiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LnJlbGF0ZWRXZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiB0aGUgY29sdW1uJ3MgY3VycmVudGx5IHNlbGVjdGVkIHZhbHVlXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogY2FtbFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MVmlld0ZpZWxkczogXCI8Vmlld0ZpZWxkcz5cIiArIHZpZXdGaWVsZHMgKyBcIjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGUgdGhlIGRlZmF1bHQgdmlldyByb3dsaW1pdCBhbmQgZ2V0IGFsbCBhcHByb3ByaWF0ZSByb3dzXHJcbiAgICAgICAgICAgIENBTUxSb3dMaW1pdDogMCxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgZXJyb3JzXHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiZXJyb3JzdHJpbmdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yVGV4dCA9ICQodGhpcykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHQuZGVidWcgJiYgZXJyb3JUZXh0ID09PSBcIk9uZSBvciBtb3JlIGZpZWxkIHR5cGVzIGFyZSBub3QgaW5zdGFsbGVkIHByb3Blcmx5LiBHbyB0byB0aGUgbGlzdCBzZXR0aW5ncyBwYWdlIHRvIGRlbGV0ZSB0aGVzZSBmaWVsZHMuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVsYXRlZExpc3RDb2x1bW46IFwiICsgb3B0LnJlbGF0ZWRMaXN0Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJDb2x1bW4gbm90IGZvdW5kIGluIHJlbGF0ZWRMaXN0IFwiICsgb3B0LnJlbGF0ZWRMaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1ZyAmJiBlcnJvclRleHQgPT09IFwiR3VpZCBzaG91bGQgY29udGFpbiAzMiBkaWdpdHMgd2l0aCA0IGRhc2hlcyAoeHh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHh4KS5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWxhdGVkTGlzdDogXCIgKyBvcHQucmVsYXRlZExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkxpc3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgb3V0U3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgLy8gT3V0cHV0IGVhY2ggcm93XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wdC5kaXNwbGF5Rm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBpbXBsZW1lbnRpbmcgdGhlIHRhYmxlIGZvcm1hdCBpbiB0aGUgZmlyc3QgaXRlcmF0aW9uICh2MC4yLjkpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRhYmxlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IFwiPHRhYmxlPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQucmVsYXRlZENvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImNvbHVtbk5hbWU6IFwiICsgb3B0LnJlbGF0ZWRDb2x1bW5zW2ldLCBcIkNvbHVtbiBub3QgZm91bmQgaW4gcmVsYXRlZExpc3RcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRoIGNsYXNzPSdcIiArIG9wdC5oZWFkZXJDU1NDbGFzcyArIFwiJz5cIiArIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0uYXR0cihcIkRpc3BsYXlOYW1lXCIpICsgXCI8L3RoPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbiBvcHRpb24gZm9yIGVhY2ggY2hpbGQgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcHQucmVsYXRlZENvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dGQgY2xhc3M9J1wiICsgb3B0LnJvd0NTU0NsYXNzICsgXCInPlwiICsgc2hvd0NvbHVtbihyZWxhdGVkTGlzdFhNTCwgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSwgJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnJlbGF0ZWRDb2x1bW5zW2ldKSwgb3B0KSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdHI+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8L3RhYmxlPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0IGZvcm1hdCBpbXBsZW1lbnRlZCBpbiB2MC41LjAuIFN0aWxsIHRhYmxlLWJhc2VkLCBidXQgdmVydGljYWwgb3JpZW50YXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxpc3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8dGFibGU+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG9wdC5yZWxhdGVkQ29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJjb2x1bW5OYW1lOiBcIiArIG9wdC5yZWxhdGVkQ29sdW1uc1tpXSwgXCJDb2x1bW4gbm90IGZvdW5kIGluIHJlbGF0ZWRMaXN0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dGggY2xhc3M9J1wiICsgb3B0LmhlYWRlckNTU0NsYXNzICsgXCInPlwiICsgcmVsYXRlZENvbHVtbnNYTUxbb3B0LnJlbGF0ZWRDb2x1bW5zW2ldXS5hdHRyKFwiRGlzcGxheU5hbWVcIikgKyBcIjwvdGg+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRkIGNsYXNzPSdcIiArIG9wdC5yb3dDU1NDbGFzcyArIFwiJz5cIiArIHNob3dDb2x1bW4ocmVsYXRlZExpc3RYTUwsIHJlbGF0ZWRDb2x1bW5zWE1MW29wdC5yZWxhdGVkQ29sdW1uc1tpXV0sICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5yZWxhdGVkQ29sdW1uc1tpXSksIG9wdCkgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPC90cj5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjwvdGFibGU+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJub25lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgb3V0IHRoZSByZXN1bHRzXHJcbiAgICAgICAgICAgICAgICBpZihvcHQuZGlzcGxheUZvcm1hdCAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiI1wiICsgZGl2SWQpLmh0bWwob3V0U3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICAgICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LmNvbXBsZXRlZnVuYyh4RGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IC8vIEVuZCBzaG93UmVsYXRlZFxyXG5cclxuICAgIC8vIERpc3BsYXkgYSBjb2x1bW4gKGZpZWxkKSBmb3JtYXR0ZWQgY29ycmVjdGx5IGJhc2VkIG9uIGl0cyBkZWZpbml0aW9uIGluIHRoZSBsaXN0LlxyXG4gICAgLy8gTk9URTogQ3VycmVudGx5IG5vdCBkZWFsaW5nIHdpdGggbG9jYWxlIGRpZmZlcmVuY2VzLlxyXG4gICAgLy8gICBjb2x1bW5YTUwgICAgICAgICAgVGhlIFhNTCBub2RlIGZvciB0aGUgY29sdW1uIGZyb20gYSBHZXRMaXN0IG9wZXJhdGlvblxyXG4gICAgLy8gICBjb2x1bW5WYWx1ZSAgICAgICAgVGhlIHRleHQgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbHVtbidzIHZhbHVlXHJcbiAgICAvLyAgIG9wdCAgICAgICAgICAgICAgICBUaGUgY3VycmVudCBzZXQgb2Ygb3B0aW9uc1xyXG4gICAgZnVuY3Rpb24gc2hvd0NvbHVtbihsaXN0WE1MLCBjb2x1bW5YTUwsIGNvbHVtblZhbHVlLCBvcHQpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb2x1bW5WYWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpO1xyXG4gICAgICAgIHZhciBvdXRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHZhciBmaWxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGRpc3BVcmw7XHJcbiAgICAgICAgdmFyIG51bURlY2ltYWxzO1xyXG4gICAgICAgIHZhciBvdXRBcnJheSA9IFtdO1xyXG4gICAgICAgIHZhciB3ZWJVcmwgPSBvcHQucmVsYXRlZFdlYlVSTC5sZW5ndGggPiAwID8gb3B0LnJlbGF0ZWRXZWJVUkwgOiAkKCkuU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRTaXRlKCk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHN3aXRjaCAoY29sdW1uWE1MLmF0dHIoXCJUeXBlXCIpKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJUZXh0XCI6XHJcbiAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBjb2x1bW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVVJMXCI6XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblhNTC5hdHRyKFwiRm9ybWF0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVVJMIGFzIGh5cGVybGlua1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJIeXBlcmxpbmtcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGNvbHVtblZhbHVlLnN1YnN0cmluZygwLCBjb2x1bW5WYWx1ZS5zZWFyY2goXCIsXCIpKSArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKFwiLFwiKSArIDEpICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVSTCBhcyBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJJbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBcIjxpbWcgYWx0PSdcIiArIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goXCIsXCIpICsgMSkgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCInIHNyYz0nXCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKFwiLFwiKSkgKyBcIicvPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAvLyBKdXN0IGluIGNhc2VcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBjb2x1bW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVzZXJcIjpcclxuICAgICAgICAgICAgY2FzZSBcIlVzZXJNdWx0aVwiOlxyXG4gICAgICAgICAgICAgICAgdmFyIHVzZXJNdWx0aVZhbHVlcyA9IGNvbHVtblZhbHVlLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1c2VyTXVsdGlWYWx1ZXMubGVuZ3RoOyBpID0gaSArIDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRBcnJheS5wdXNoKFwiPGEgaHJlZj0nL19sYXlvdXRzL3VzZXJkaXNwLmFzcHg/SUQ9XCIgKyB1c2VyTXVsdGlWYWx1ZXNbaV0gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiZTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIic+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyTXVsdGlWYWx1ZXNbaSArIDFdICsgXCI8L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gb3V0QXJyYXkuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDYWxjdWxhdGVkXCI6XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsY0NvbHVtbiA9IGNvbHVtblZhbHVlLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNhbGNDb2x1bW5bMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIk51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgbnVtRGVjaW1hbHMgPSBjb2x1bW5YTUwuYXR0cihcIkRlY2ltYWxzXCIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gdHlwZW9mIG51bURlY2ltYWxzID09PSBcInVuZGVmaW5lZFwiID9cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b1N0cmluZygpIDpcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b0ZpeGVkKG51bURlY2ltYWxzKS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJDdXJyZW5jeVwiOlxyXG4gICAgICAgICAgICAgICAgbnVtRGVjaW1hbHMgPSBjb2x1bW5YTUwuYXR0cihcIkRlY2ltYWxzXCIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gdHlwZW9mIG51bURlY2ltYWxzID09PSBcInVuZGVmaW5lZFwiID9cclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KGNvbHVtblZhbHVlKS50b0ZpeGVkKDIpLnRvU3RyaW5nKCkgOlxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoY29sdW1uVmFsdWUpLnRvRml4ZWQobnVtRGVjaW1hbHMpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvb2t1cFwiOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2x1bW5YTUwuYXR0cihcIk5hbWVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiRmlsZVJlZlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGRpc3BsYXkgZm9ybSBVUkwgZm9yIHRoZSBsb29rdXAgc291cmNlIGxpc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcFVybCA9IGxpc3RYTUwuYXR0cihcIkJhc2VUeXBlXCIpID09PSBcIjFcIiA/IGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBcIkZvcm1zL0Rpc3BGb3JtLmFzcHhcIiA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBcIkRpc3BGb3JtLmFzcHhcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGRpc3BVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/SUQ9XCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSkgKyBcIiZSb290Rm9sZGVyPSomU291cmNlPVwiICsgdXRpbHMuZXNjYXBlVXJsKGxvY2F0aW9uLmhyZWYpICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goY29uc3RhbnRzLnNwRGVsaW0pICsgMikgKyBcIjwvYT5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkZpbGVEaXJSZWZcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkaXNwbGF5IGZvcm0gVVJMIGZvciB0aGUgbG9va3VwIHNvdXJjZSBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BVcmwgPSBjb25zdGFudHMuU0xBU0ggKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRTdHJpbmcgPSBcIjxhIGhyZWY9J1wiICsgZGlzcFVybCArIFwiJz5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEFueSBvdGhlciBsb29rdXAgY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkaXNwbGF5IGZvcm0gVVJMIGZvciB0aGUgbG9va3VwIHNvdXJjZSBsaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BVcmwgPSB1dGlscy5nZXRMaXN0Rm9ybVVybChjb2x1bW5YTUwuYXR0cihcIkxpc3RcIiksIFwiRGlzcGxheUZvcm1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IFwiPGEgaHJlZj0nXCIgKyBvcHQucmVsYXRlZFdlYlVSTCArIGNvbnN0YW50cy5TTEFTSCArIGRpc3BVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/SUQ9XCIgKyBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoMCwgY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSkgKyBcIiZSb290Rm9sZGVyPSomU291cmNlPVwiICsgdXRpbHMuZXNjYXBlVXJsKGxvY2F0aW9uLmhyZWYpICsgXCInPlwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlLnN1YnN0cmluZyhjb2x1bW5WYWx1ZS5zZWFyY2goY29uc3RhbnRzLnNwRGVsaW0pICsgMikgKyBcIjwvYT5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkxvb2t1cE11bHRpXCI6XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGRpc3BsYXkgZm9ybSBVUkwgZm9yIHRoZSBsb29rdXAgc291cmNlIGxpc3RcclxuICAgICAgICAgICAgICAgIGRpc3BVcmwgPSB1dGlscy5nZXRMaXN0Rm9ybVVybChjb2x1bW5YTUwuYXR0cihcIkxpc3RcIiksIFwiRGlzcGxheUZvcm1cIik7XHJcbiAgICAgICAgICAgICAgICAvLyBTaG93IGFsbCB0aGUgdmFsdWVzIGFzIGxpbmtzIHRvIHRoZSBpdGVtcywgc2VwYXJhdGVkIGJ5IGNvbW1hc1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5WYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxvb2t1cE11bHRpVmFsdWVzID0gY29sdW1uVmFsdWUuc3BsaXQoY29uc3RhbnRzLnNwRGVsaW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsb29rdXBNdWx0aVZhbHVlcy5sZW5ndGggLyAyOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0QXJyYXkucHVzaChcIjxhIGhyZWY9J1wiICsgd2ViVXJsICsgY29uc3RhbnRzLlNMQVNIICsgZGlzcFVybCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIj9JRD1cIiArIGxvb2t1cE11bHRpVmFsdWVzW2kgKiAyXSArIFwiJlJvb3RGb2xkZXI9KiZTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIic+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9va3VwTXVsdGlWYWx1ZXNbKGkgKiAyKSArIDFdICsgXCI8L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IG91dEFycmF5LmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRmlsZVwiOlxyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWUgPSBjb2x1bW5WYWx1ZS5zdWJzdHJpbmcoY29sdW1uVmFsdWUuc2VhcmNoKGNvbnN0YW50cy5zcERlbGltKSArIDIpO1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gXCI8YSBocmVmPSdcIiArIGxpc3RYTUwuYXR0cihcIlJvb3RGb2xkZXJcIikgKyBjb25zdGFudHMuU0xBU0ggKyBmaWxlTmFtZSArIFwiJz5cIiArIGZpbGVOYW1lICsgXCI8L2E+XCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50ZXJcIjpcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNvbHVtblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEYXRlVGltZVwiOlxyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nID0gY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyA9IGNvbHVtblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRTdHJpbmc7XHJcbiAgICB9IC8vIEVuZCBvZiBmdW5jdGlvbiBzaG93Q29sdW1uXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIFwiLi4vdXRpbHMvY29uc3RhbnRzXCIsXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLnV0aWxzJyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgY29uc3RhbnRzLFxyXG4gICAgdXRpbHNcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLyoganNoaW50IHVuZGVmOiB0cnVlICovXHJcbiAgICAvKiBnbG9iYWwgR2lwQWRkU2VsZWN0ZWRJdGVtcywgR2lwUmVtb3ZlU2VsZWN0ZWRJdGVtcywgR2lwR2V0R3JvdXBEYXRhICovXHJcblxyXG4gICAgLy8gRnVuY3Rpb24gdG8gZmlsdGVyIGEgbG9va3VwIGJhc2VkIGRyb3Bkb3duXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BGaWx0ZXJEcm9wZG93biA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBXZWJVUkw6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIFdlYiAoc2l0ZSkgd2hpY2ggY29udGFpbnMgdGhlIHJlbGF0aW9uc2hpcExpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdDogXCJcIiwgLy8gVGhlIG5hbWUgb2YgdGhlIGxpc3Qgd2hpY2ggY29udGFpbnMgdGhlIGxvb2t1cCB2YWx1ZXNcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdENvbHVtbjogXCJcIiwgLy8gVGhlIGludGVybmFsIG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgcmVsYXRpb25zaGlwIGxpc3RcclxuICAgICAgICAgICAgcmVsYXRpb25zaGlwTGlzdFNvcnRDb2x1bW46IFwiXCIsIC8vIFtPcHRpb25hbF0gSWYgc3BlY2lmaWVkLCBzb3J0IHRoZSBvcHRpb25zIGluIHRoZSBkcm9wZG93biBieSB0aGlzIGNvbHVtbixcclxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHRoZSBvcHRpb25zIGFyZSBzb3J0ZWQgYnkgcmVsYXRpb25zaGlwTGlzdENvbHVtblxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXBMaXN0U29ydEFzY2VuZGluZzogdHJ1ZSwgLy8gW09wdGlvbmFsXSBCeSBkZWZhdWx0LCB0aGUgc29ydCBpcyBhc2NlbmRpbmcuIElmIGZhbHNlLCBkZXNjZW5kaW5nXHJcbiAgICAgICAgICAgIGNvbHVtbk5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIGNvbHVtbiBpbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSwgLy8gVGhlIGxpc3QgdGhlIGZvcm0gaXMgd29ya2luZyB3aXRoLiBUaGlzIGlzIHVzZWZ1bCBpZiB0aGUgZm9ybSBpcyBub3QgaW4gdGhlIGxpc3QgY29udGV4dC5cclxuICAgICAgICAgICAgcHJvbXB0VGV4dDogXCJcIiwgLy8gW0RFUFJFQ0FURURdIFRleHQgdG8gdXNlIGFzIHByb21wdC4gSWYgaW5jbHVkZWQsIHswfSB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhlIHZhbHVlIG9mIGNvbHVtbk5hbWUuIElPcmlnbmFsIHZhbHVlIFwiQ2hvb3NlIHswfS4uLlwiXHJcbiAgICAgICAgICAgIG5vbmVUZXh0OiBcIihOb25lKVwiLCAvLyBbT3B0aW9uYWxdIFRleHQgdG8gdXNlIGZvciB0aGUgKE5vbmUpIHNlbGVjdGlvbi4gUHJvdmlkZWQgZm9yIG5vbi1FbmdsaXNoIGxhbmd1YWdlIHN1cHBvcnQuXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogXCJcIiwgLy8gVGhpcyBDQU1MIGZyYWdtZW50IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgcmVsYXRpb25zaGlwTGlzdFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBcIjxRdWVyeU9wdGlvbnM+PEluY2x1ZGVNYW5kYXRvcnlDb2x1bW5zPkZBTFNFPC9JbmNsdWRlTWFuZGF0b3J5Q29sdW1ucz48Vmlld0F0dHJpYnV0ZXMgU2NvcGU9J1JlY3Vyc2l2ZUFsbCcvPjwvUXVlcnlPcHRpb25zPlwiLCAvLyBOZWVkIHRoaXMgdG8gbWlycm9yIFNoYXJlUG9pbnQncyBiZWhhdmlvciwgYnV0IGl0IGNhbiBiZSBvdmVycmlkZGVuXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlczsgaWYgZmFsc2UsIHJ1biBzaWxlbnRcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGNob2ljZXMgPSBcIlwiO1xyXG4gICAgICAgIHZhciBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgdmFyIG5ld011bHRpTG9va3VwUGlja2VyZGF0YTtcclxuICAgICAgICB2YXIgY29sdW1uQ29sdW1uUmVxdWlyZWQ7XHJcbiAgICAgICAgdmFyIHRoaXNGdW5jdGlvbiA9IFwiU1BTZXJ2aWNlcy5TUEZpbHRlckRyb3Bkb3duXCI7XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGNvbHVtblNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0LmNvbHVtbk5hbWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoY29sdW1uU2VsZWN0Lk9iai5odG1sKCkgPT09IG51bGwgJiYgb3B0LmRlYnVnKSB7XHJcbiAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sIFwiY29sdW1uTmFtZTogXCIgKyBvcHQuY29sdW1uTmFtZSwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGNvbHVtbiBzZWxlY3Rpb24ocylcclxuICAgICAgICBjb2x1bW5TZWxlY3RTZWxlY3RlZCA9IHV0aWxzLmdldERyb3Bkb3duU2VsZWN0ZWQoY29sdW1uU2VsZWN0LCB0cnVlKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1zIHdoaWNoIG1hdGNoIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICAgIHZhciBzb3J0Q29sdW1uID0gKG9wdC5yZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbi5sZW5ndGggPiAwKSA/IG9wdC5yZWxhdGlvbnNoaXBMaXN0U29ydENvbHVtbiA6IG9wdC5yZWxhdGlvbnNoaXBMaXN0Q29sdW1uO1xyXG4gICAgICAgIHZhciBzb3J0T3JkZXIgPSAob3B0LnJlbGF0aW9uc2hpcExpc3RTb3J0QXNjZW5kaW5nID09PSB0cnVlKSA/IFwiXCIgOiBcIkFzY2VuZGluZz0nRkFMU0UnXCI7XHJcbiAgICAgICAgdmFyIGNhbWxRdWVyeSA9IFwiPFF1ZXJ5PjxPcmRlckJ5PjxGaWVsZFJlZiBOYW1lPSdcIiArIHNvcnRDb2x1bW4gKyBcIicgXCIgKyBzb3J0T3JkZXIgKyBcIi8+PC9PcmRlckJ5PjxXaGVyZT5cIjtcclxuICAgICAgICBpZiAob3B0LkNBTUxRdWVyeS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNhbWxRdWVyeSArPSBvcHQuQ0FNTFF1ZXJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYW1sUXVlcnkgKz0gXCI8L1doZXJlPjwvUXVlcnk+XCI7XHJcblxyXG4gICAgICAgIC8vIEdldCBpbmZvcm1hdGlvbiBhYm91dCBjb2x1bW5OYW1lIGZyb20gdGhlIGN1cnJlbnQgbGlzdFxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZHNcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5maW5kKFwiRmllbGRbRGlzcGxheU5hbWU9J1wiICsgb3B0LmNvbHVtbk5hbWUgKyBcIiddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBjb2x1bW5OYW1lIGlzIFJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkNvbHVtblJlcXVpcmVkID0gKCQodGhpcykuYXR0cihcIlJlcXVpcmVkXCIpID09PSBcIlRSVUVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0b3AgbG9va2luZzsgd2UncmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgLy8gRm9yY2Ugc3luYyBzbyB0aGF0IHdlIGhhdmUgdGhlIHJpZ2h0IHZhbHVlcyBmb3IgdGhlIGNvbHVtbiBvbmNoYW5nZSB0cmlnZ2VyXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgd2ViVVJMOiBvcHQucmVsYXRpb25zaGlwV2ViVVJMLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIENBTUxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBjYW1sUXVlcnksXHJcbiAgICAgICAgICAgIC8vIE9ubHkgZ2V0IHRoZSBjb2x1bW5OYW1lJ3MgZGF0YSAocGx1cyBjb2x1bW5zIHdlIGNhbid0IHByZXZlbnQpXHJcbiAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdcIiArIG9wdC5yZWxhdGlvbnNoaXBMaXN0Q29sdW1uICsgXCInIC8+PC9WaWV3RmllbGRzPlwiLFxyXG4gICAgICAgICAgICAvLyBPdmVycmlkZSB0aGUgZGVmYXVsdCB2aWV3IHJvd2xpbWl0IGFuZCBnZXQgYWxsIGFwcHJvcHJpYXRlIHJvd3NcclxuICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAvLyBFdmVuIHRob3VnaCBzZXR0aW5nIEluY2x1ZGVNYW5kYXRvcnlDb2x1bW5zIHRvIEZBTFNFIGRvZXNuJ3Qgd29yayBhcyB0aGUgZG9jcyBkZXNjcmliZSwgaXQgZml4ZXMgYSBidWcgaW4gR2V0TGlzdEl0ZW1zIHdpdGggbWFuZGF0b3J5IG11bHRpLXNlbGVjdHNcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogb3B0LkNBTUxRdWVyeU9wdGlvbnMsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGFuZGxlIGVycm9yc1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcImVycm9yc3RyaW5nXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvclRleHQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LmRlYnVnICYmIGVycm9yVGV4dCA9PT0gXCJPbmUgb3IgbW9yZSBmaWVsZCB0eXBlcyBhcmUgbm90IGluc3RhbGxlZCBwcm9wZXJseS4gR28gdG8gdGhlIGxpc3Qgc2V0dGluZ3MgcGFnZSB0byBkZWxldGUgdGhlc2UgZmllbGRzLlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3RDb2x1bW46IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDb2x1bW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIk5vdCBmb3VuZCBpbiByZWxhdGlvbnNoaXBMaXN0IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0LmRlYnVnICYmIGVycm9yVGV4dCA9PT0gXCJHdWlkIHNob3VsZCBjb250YWluIDMyIGRpZ2l0cyB3aXRoIDQgZGFzaGVzICh4eHh4eHh4eC14eHh4LXh4eHgteHh4eC14eHh4eHh4eHh4eHgpLlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHV0aWxzLmVyckJveCh0aGlzRnVuY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlbGF0aW9uc2hpcExpc3Q6IFwiICsgb3B0LnJlbGF0aW9uc2hpcExpc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkxpc3Qgbm90IGZvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gZXhwbGFuYXRvcnkgcHJvbXB0XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiB0aGUgZXhpc3Rpbmcgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5PYmopLmZpbmQoXCJvcHRpb25cIikucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBjb2x1bW4gaXMgcmVxdWlyZWQgb3IgdGhlIHByb21wdFRleHQgb3B0aW9uIGlzIGVtcHR5LCBkb24ndCBhZGQgdGhlIHByb21wdCB0ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29sdW1uQ29sdW1uUmVxdWlyZWQgJiYgKG9wdC5wcm9tcHRUZXh0Lmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9JzAnPlwiICsgb3B0LnByb21wdFRleHQucmVwbGFjZSgvXFx7MFxcfS9nLCBvcHQuY29sdW1uTmFtZSkgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghY29sdW1uQ29sdW1uUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nMCc+XCIgKyBvcHQubm9uZVRleHQgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGNvbHVtbiBpcyByZXF1aXJlZCwgZG9uJ3QgYWRkIHRoZSBcIihOb25lKVwiIG9wdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2VzID0gY29sdW1uQ29sdW1uUmVxdWlyZWQgPyBcIlwiIDogb3B0Lm5vbmVUZXh0ICsgXCJ8MFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIHRoZSBleGlzdGluZyBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdNdWx0aUxvb2t1cFBpY2tlcmRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgYW4gb3B0aW9uIGZvciBlYWNoIGl0ZW1cclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLlNQRmlsdGVyTm9kZShcIno6cm93XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc09wdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiByZWxhdGlvbnNoaXBMaXN0Q29sdW1uIGlzIGEgTG9va3VwIGNvbHVtbiwgdGhlbiB0aGUgSUQgc2hvdWxkIGJlIGZvciB0aGUgTG9va3VwIHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVsc2UgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1ZhbHVlID0gJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LnJlbGF0aW9uc2hpcExpc3RDb2x1bW4pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzVmFsdWUuaW5kZXhPZihjb25zdGFudHMuc3BEZWxpbSkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24gPSBuZXcgdXRpbHMuU3BsaXRJbmRleCh0aGlzVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24uaWQgPSAkKHRoaXMpLmF0dHIoXCJvd3NfSURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24udmFsdWUgPSB0aGlzVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmVsYXRpb25zaGlwTGlzdENvbHVtbiBpcyBhIGNhbGN1bGF0ZWQgY29sdW1uLCB0aGVuIHRoZSB2YWx1ZSBpc24ndCBwcmVjZWRlZCBieSB0aGUgSUQsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGJ5IHRoZSBkYXRhdHlwZS4gIEluIHRoaXMgY2FzZSwgdGhpc09wdGlvbi5pZCBzaG91bGQgYmUgdGhlIElEIG9mIHRoZSByZWxhdGlvbnNoaXBMaXN0IGl0ZW0uXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZS5nLiwgZmxvYXQ7IzEyMzQ1LjY3XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKHRoaXNPcHRpb24uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNPcHRpb24uaWQgPSAkKHRoaXMpLmF0dHIoXCJvd3NfSURcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbHVtblNlbGVjdC5UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAoJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpID09PSBjb2x1bW5TZWxlY3RTZWxlY3RlZFswXSkgPyBcIiBzZWxlY3RlZD0nc2VsZWN0ZWQnXCIgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lk9iai5hcHBlbmQoXCI8b3B0aW9uXCIgKyBzZWxlY3RlZCArIFwiIHZhbHVlPSdcIiArIHRoaXNPcHRpb24uaWQgKyBcIic+XCIgKyB0aGlzT3B0aW9uLnZhbHVlICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpc09wdGlvbi5pZCA9PT0gY29sdW1uU2VsZWN0U2VsZWN0ZWRbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5TZWxlY3QuT2JqLnZhbCh0aGlzT3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZXMgPSBjaG9pY2VzICsgKChjaG9pY2VzLmxlbmd0aCA+IDApID8gXCJ8XCIgOiBcIlwiKSArIHRoaXNPcHRpb24udmFsdWUgKyBcInxcIiArIHRoaXNPcHRpb24uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChjb2x1bW5TZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgdGhpc09wdGlvbi5pZCArIFwiJz5cIiArIHRoaXNPcHRpb24udmFsdWUgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld011bHRpTG9va3VwUGlja2VyZGF0YSArPSB0aGlzT3B0aW9uLmlkICsgXCJ8dFwiICsgdGhpc09wdGlvbi52YWx1ZSArIFwifHQgfHQgfHRcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2x1bW5TZWxlY3QuVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5zaW1wbGU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmoudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuZHJvcGRvd25UeXBlLmNvbXBsZXg6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmouYXR0cihcImNob2ljZXNcIiwgY2hvaWNlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5PYmoudHJpZ2dlcihcInByb3BlcnR5Y2hhbmdlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBtYXN0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm1hc3Rlci5kYXRhID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblNlbGVjdC5NdWx0aUxvb2t1cFBpY2tlcmRhdGEudmFsKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIGFueSBwcmlvciBzZWxlY3Rpb25zIHRoYXQgYXJlIG5vIGxvbmdlciB2YWxpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5tYXN0ZXIucmVzdWx0Q29udHJvbCkuZmluZChcIm9wdGlvblwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzU2VsZWN0ZWQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKFwic2VsZWN0ZWRcIiwgXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PT0gdGhpc1NlbGVjdGVkLmh0bWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucmVtb3ZlQXR0cihcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgR2lwUmVtb3ZlU2VsZWN0ZWRJdGVtcyhjb2x1bW5TZWxlY3QubWFzdGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSBhbnkgb3B0aW9ucyBpbiB0aGUgY2FuZGlkYXRlIGxpc3Qgd2hpY2ggYXJlIGFscmVhZHkgc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJChjb2x1bW5TZWxlY3QubWFzdGVyLmNhbmRpZGF0ZUNvbnRyb2wpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1NlbGVjdGVkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoY29sdW1uU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmh0bWwoKSA9PT0gdGhpc1NlbGVjdGVkLmh0bWwoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU2VsZWN0ZWQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBHaXBBZGRTZWxlY3RlZEl0ZW1zKGNvbHVtblNlbGVjdC5tYXN0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgbWFzdGVyLmRhdGEgdG8gdGhlIG5ld2x5IGFsbG93YWJsZSB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uU2VsZWN0Lm1hc3Rlci5kYXRhID0gR2lwR2V0R3JvdXBEYXRhKG5ld011bHRpTG9va3VwUGlja2VyZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUcmlnZ2VyIGEgZGJsY2xpY2sgc28gdGhhdCB0aGUgY2hpbGQgd2lsbCBiZSBjYXNjYWRlZCBpZiBpdCBpcyBhIG11bHRpc2VsZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKGNvbHVtblNlbGVjdC5tYXN0ZXIuY2FuZGlkYXRlQ29udHJvbCkudHJpZ2dlcihcImRibGNsaWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBJZiBwcmVzZW50LCBjYWxsIGNvbXBsZXRlZnVuYyB3aGVuIGFsbCBlbHNlIGlzIGRvbmVcclxuICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvcHQuY29tcGxldGVmdW5jKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEZpbHRlckRyb3Bkb3duXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZpbmQgYW4gTU1TIFBpY2tlciBpbiB0aGUgcGFnZVxyXG4gICAgLy8gUmV0dXJucyByZWZlcmVuY2VzIHRvOlxyXG4gICAgLy8gICB0ZXJtcyAtIFRoZSBhYXJheSBvZiB0ZXJtcyBhcyB2YWx1ZS9ndWlkIHBhaXJzXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BGaW5kTU1TUGlja2VyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIE1NU0Rpc3BsYXlOYW1lOiBcIlwiIC8vIFRoZSBkaXNwbGF5TmFtZSBvZiB0aGUgTU1TIFBpY2tlciBvbiB0aGUgZm9ybVxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgdGhpc1Rlcm1zID0gW107XHJcblxyXG4gICAgICAgIC8vIEZpbmQgdGhlIGRpdiBmb3IgdGhlIGNvbHVtbiB3aGljaCBjb250YWlucyB0aGUgZW50ZXJlZCBkYXRhIHZhbHVlc1xyXG4gICAgICAgIHZhciB0aGlzRGl2ID0gJChcImRpdlt0aXRsZT0nXCIgKyBvcHQuTU1TRGlzcGxheU5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIHZhciB0aGlzSGlkZGVuSW5wdXQgPSB0aGlzRGl2LmNsb3Nlc3QoXCJ0ZFwiKS5maW5kKFwiaW5wdXRbdHlwZT0naGlkZGVuJ11cIik7XHJcbiAgICAgICAgdmFyIHRoaXNUZXJtQXJyYXkgPSB0aGlzSGlkZGVuSW5wdXQudmFsKCkuc3BsaXQoXCI7XCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXNUZXJtQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNPbmUgPSB0aGlzVGVybUFycmF5W2ldLnNwbGl0KFwifFwiKTtcclxuICAgICAgICAgICAgdGhpc1Rlcm1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXNPbmVbMF0sXHJcbiAgICAgICAgICAgICAgICBndWlkOiB0aGlzT25lWzFdXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRlcm1zOiB0aGlzVGVybXNcclxuICAgICAgICB9O1xyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BGaW5kTU1TUGlja2VyXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZpbmQgYSBQZW9wbGUgUGlja2VyIGluIHRoZSBwYWdlXHJcbiAgICAvLyBSZXR1cm5zIHJlZmVyZW5jZXMgdG86XHJcbiAgICAvLyAgIHJvdyAtIFRoZSBUUiB3aGljaCBjb250YWlucyB0aGUgUGVvcGxlIFBpY2tlciAodXNlZnVsIGlmIHlvdSdkIGxpa2UgdG8gaGlkZSBpdCBhdCBzb21lIHBvaW50KVxyXG4gICAgLy8gICBjb250ZW50cyAtIFRoZSBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIHRoZSBjdXJyZW50IHZhbHVlXHJcbiAgICAvLyAgIGN1cnJlbnRWYWx1ZSAtIFRoZSBjdXJyZW50IHZhbHVlIGlmIGl0IGlzIHNldFxyXG4gICAgLy8gICBjaGVja05hbWVzIC0gVGhlIENoZWNrIE5hbWVzIGltYWdlIChpbiBjYXNlIHlvdSdkIGxpa2UgdG8gY2xpY2sgaXQgYXQgc29tZSBwb2ludClcclxuICAgIC8vICAgY2hlY2tOYW1lc1BocmFzZSAtIHlvdSBjYW4gcGFzcyB5b3VyIGxvY2FsIHBocmFzZSBoZXJlIHRvIGNoZWNrIG5hbWVzLCBsaWtlIGluIHJ1c3NpYW4gaXQgd291bGQgYmUgLSA/Pz8/Pz8/Pz8gPz8/Pz9cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgcGVvcGxlUGlja2VyRGlzcGxheU5hbWU6IFwiXCIsIC8vIFRoZSBkaXNwbGF5TmFtZSBvZiB0aGUgUGVvcGxlIFBpY2tlciBvbiB0aGUgZm9ybVxyXG4gICAgICAgICAgICB2YWx1ZVRvU2V0OiBcIlwiLCAvLyBUaGUgdmFsdWUgdG8gc2V0IHRoZSBQZW9wbGUgUGlja2VyIHRvLiBTaG91bGQgYmUgYSBzdHJpbmcgY29udGFpbmluZyBlYWNoIHVzZXJuYW1lIG9yIGdyb3VwbmFtZSBzZXBhcmF0ZWQgYnkgc2VtaS1jb2xvbnMuXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXM6IHRydWUsIC8vIElmIHNldCB0byB0cnVlLCB0aGUgQ2hlY2sgTmFtZXMgaW1hZ2Ugd2lsbCBiZSBjbGlja2VkIHRvIHJlc29sdmUgdGhlIG5hbWVzXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXNQaHJhc2U6ICdDaGVjayBOYW1lcycgLy8gRW5nbGlzaCBkZWZhdWx0XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciB0aGlzUm93ID0gJChcIm5vYnJcIikuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gRW5zdXJlcyB3ZSBnZXQgYSBtYXRjaCB3aGV0aGVyIG9yIG5vdCB0aGUgUGVvcGxlIFBpY2tlciBpcyByZXF1aXJlZCAoaWYgcmVxdWlyZWQsIHRoZSBub2JyIGNvbnRhaW5zIGEgc3BhbiBhbHNvKVxyXG4gICAgICAgICAgICByZXR1cm4gJCh0aGlzKS5jb250ZW50cygpLmVxKDApLnRleHQoKSA9PT0gb3B0LnBlb3BsZVBpY2tlckRpc3BsYXlOYW1lO1xyXG4gICAgICAgIH0pLmNsb3Nlc3QoXCJ0clwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNDb250ZW50cyA9IHRoaXNSb3cuZmluZChcImRpdltuYW1lPSd1cExldmVsRGl2J11cIik7XHJcbiAgICAgICAgdmFyIHRoaXNDaGVja05hbWVzID0gdGhpc1Jvdy5maW5kKFwiaW1nW1RpdGxlPSdcIiArIG9wdC5jaGVja05hbWVzUGhyYXNlICsgXCInXTpmaXJzdFwiKTtcclxuXHJcbiAgICAgICAgLy8gSWYgYSB2YWx1ZSB3YXMgcHJvdmlkZWQsIHNldCB0aGUgdmFsdWVcclxuICAgICAgICBpZiAob3B0LnZhbHVlVG9TZXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzQ29udGVudHMuaHRtbChvcHQudmFsdWVUb1NldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiBjaGVja05hbWUgaXMgdHJ1ZSwgY2xpY2sgdGhlIGNoZWNrIG5hbWVzIGljb25cclxuICAgICAgICBpZiAob3B0LmNoZWNrTmFtZXMpIHtcclxuICAgICAgICAgICAgdGhpc0NoZWNrTmFtZXMuY2xpY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRoaXNDdXJyZW50VmFsdWUgPSAkLnRyaW0odGhpc0NvbnRlbnRzLnRleHQoKSk7XHJcblxyXG4gICAgICAgIC8vIFBhcnNlIHRoZSBlbnRpdHkgZGF0YVxyXG4gICAgICAgIHZhciBkaWN0aW9uYXJ5RW50cmllcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBJRVxyXG4gICAgICAgIHRoaXNDb250ZW50cy5jaGlsZHJlbihcInNwYW5cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBHcmFiIHRoZSBlbnRpdHkgZGF0YVxyXG4gICAgICAgICAgICB2YXIgdGhpc0RhdGEgPSAkKHRoaXMpLmZpbmQoXCJkaXZbZGF0YV1cIikuYXR0cihcImRhdGFcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZGljdGlvbmFyeUVudHJ5ID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBFbnRpdHkgZGF0YSBpcyBvbmx5IGF2YWlsYWJsZSBpbiBJRVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNEYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXlPZkRpY3Rpb25hcnlFbnRyeSA9ICQucGFyc2VYTUwodGhpc0RhdGEpO1xyXG4gICAgICAgICAgICAgICAgdmFyICR4bWwgPSAkKGFycmF5T2ZEaWN0aW9uYXJ5RW50cnkpO1xyXG5cclxuICAgICAgICAgICAgICAgICR4bWwuZmluZChcIkRpY3Rpb25hcnlFbnRyeVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gJCh0aGlzKS5maW5kKFwiS2V5XCIpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBkaWN0aW9uYXJ5RW50cnlba2V5XSA9ICQodGhpcykuZmluZChcIlZhbHVlXCIpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZGljdGlvbmFyeUVudHJpZXMucHVzaChkaWN0aW9uYXJ5RW50cnkpO1xyXG4gICAgICAgICAgICAgICAgLy8gRm9yIG90aGVyIGJyb3dzZXJzLCB3ZSdsbCBjYWxsIEdldFVzZXJJbmZvIHRvIGdldCB0aGUgZGF0YVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRVc2VySW5mb1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyTG9naW5OYW1lOiAkKHRoaXMpLmF0dHIoXCJ0aXRsZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIlVzZXJcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHRoaXMuYXR0cmlidXRlcywgZnVuY3Rpb24gKGksIGF0dHJpYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Rpb25hcnlFbnRyeVthdHRyaWIubmFtZV0gPSBhdHRyaWIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpY3Rpb25hcnlFbnRyaWVzLnB1c2goZGljdGlvbmFyeUVudHJ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcm93OiB0aGlzUm93LFxyXG4gICAgICAgICAgICBjb250ZW50czogdGhpc0NvbnRlbnRzLFxyXG4gICAgICAgICAgICBjdXJyZW50VmFsdWU6IHRoaXNDdXJyZW50VmFsdWUsXHJcbiAgICAgICAgICAgIGNoZWNrTmFtZXM6IHRoaXNDaGVja05hbWVzLFxyXG4gICAgICAgICAgICBkaWN0aW9uYXJ5RW50cmllczogZGljdGlvbmFyeUVudHJpZXNcclxuICAgICAgICB9O1xyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXJcclxuXHJcbiAgICAvLyBNaXN0YWtlbmx5IHJlbGVhc2VkIHByZXZpb3VzbHkgb3V0c2lkZSB0aGUgU1BTZXJ2aWNlcyBuYW1lc3BhY2UuIFRoaXMgdGFrZXMgY2FyZSBvZiBvZmZlcmluZyBib3RoLlxyXG4gICAgJC5mbi5TUEZpbmRQZW9wbGVQaWNrZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiAkKCkuU1BTZXJ2aWNlcy5TUEZpbmRQZW9wbGVQaWNrZXIob3B0aW9ucyk7XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUEZpbmRQZW9wbGVQaWNrZXJcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgXCIuLi91dGlscy9jb25zdGFudHNcIixcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB3aGljaCBwcm92aWRlcyBhIGxpbmsgb24gYSBMb29rdXAgY29sdW1uIGZvciB0aGUgdXNlciB0byBmb2xsb3dcclxuICAgIC8vIHdoaWNoIGFsbG93cyB0aGVtIHRvIGFkZCBhIG5ldyB2YWx1ZSB0byB0aGUgTG9va3VwIGxpc3QuXHJcbiAgICAvLyBCYXNlZCBvbiBodHRwOi8vYmxvZy5tYXN0eWthcnoubmwvZXh0ZW5kaW5nLWxvb2t1cC1maWVsZHMtYWRkLW5ldy1pdGVtLW9wdGlvbi9cclxuICAgIC8vIGJ5IFdhbGRlayBNYXN0eWthcnpcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUExvb2t1cEFkZE5ldyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBsb29rdXBDb2x1bW46IFwiXCIsIC8vIFRoZSBkaXNwbGF5IG5hbWUgb2YgdGhlIExvb2t1cCBjb2x1bW5cclxuICAgICAgICAgICAgcHJvbXB0VGV4dDogXCJBZGQgbmV3IHswfVwiLCAvLyBUZXh0IHRvIHVzZSBhcyBwcm9tcHQgKyBjb2x1bW4gbmFtZVxyXG4gICAgICAgICAgICBuZXdXaW5kb3c6IGZhbHNlLCAvLyBJZiB0cnVlLCB0aGUgbGluayB3aWxsIG9wZW4gaW4gYSBuZXcgd2luZG93ICp3aXRob3V0KiBwYXNzaW5nIHRoZSBTb3VyY2UuXHJcbiAgICAgICAgICAgIENvbnRlbnRUeXBlSUQ6IFwiXCIsIC8vIFtPcHRpb25hbF0gUGFzcyB0aGUgQ29udGVudFR5cGVJRCBpZiB5b3UnZCBsaWtlIHRvIHNwZWNpZnkgaXRcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBudWxsLCAvLyBGdW5jdGlvbiB0byBjYWxsIG9uIGNvbXBsZXRpb24gb2YgcmVuZGVyaW5nIHRoZSBjaGFuZ2UuXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzO2lmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciB0aGlzRnVuY3Rpb24gPSBcIlNQU2VydmljZXMuU1BMb29rdXBBZGROZXdcIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgbG9va3VwIGNvbHVtbidzIHNlbGVjdCAoZHJvcGRvd24pXHJcbiAgICAgICAgdmFyIGxvb2t1cFNlbGVjdCA9ICQoKS5TUFNlcnZpY2VzLlNQRHJvcGRvd25DdGwoe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogb3B0Lmxvb2t1cENvbHVtblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChsb29rdXBTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJsb29rdXBDb2x1bW46IFwiICsgb3B0Lmxvb2t1cENvbHVtbiwgY29uc3RhbnRzLlRYVENvbHVtbk5vdEZvdW5kKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5ld1VybCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIGxvb2t1cExpc3RVcmwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBsb29rdXBDb2x1bW5TdGF0aWNOYW1lID0gXCJcIjtcclxuICAgICAgICAvLyBVc2UgR2V0TGlzdCBmb3IgdGhlIGN1cnJlbnQgbGlzdCB0byBkZXRlcm1pbmUgdGhlIGRldGFpbHMgZm9yIHRoZSBMb29rdXAgY29sdW1uXHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhY2hlWE1MOiB0cnVlLFxyXG4gICAgICAgICAgICBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQubG9va3VwQ29sdW1uICsgXCInXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb29rdXBDb2x1bW5TdGF0aWNOYW1lID0gJCh0aGlzKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgR2V0TGlzdCBmb3IgdGhlIExvb2t1cCBjb2x1bW4ncyBsaXN0IHRvIGRldGVybWluZSB0aGUgbGlzdCdzIFVSTFxyXG4gICAgICAgICAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVhNTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdE5hbWU6ICQodGhpcykuYXR0cihcIkxpc3RcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiTGlzdFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29rdXBMaXN0VXJsID0gJCh0aGlzKS5hdHRyKFwiV2ViRnVsbFVybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOZWVkIHRvIGhhbmRsZSB3aGVuIGxpc3QgaXMgaW4gdGhlIHJvb3Qgc2l0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cExpc3RVcmwgPSBsb29rdXBMaXN0VXJsICE9PSBjb25zdGFudHMuU0xBU0ggPyBsb29rdXBMaXN0VXJsICsgY29uc3RhbnRzLlNMQVNIIDogbG9va3VwTGlzdFVybDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBOZXdJdGVtIGZvcm0gZm9yIHRoZSBMb29rdXAgY29sdW1uJ3MgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld1VybCA9IHV0aWxzLmdldExpc3RGb3JtVXJsKCQodGhpcykuYXR0cihcIkxpc3RcIiksIFwiTmV3Rm9ybVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTdG9wIGxvb2tpbmc7d2UncmUgZG9uZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChsb29rdXBMaXN0VXJsLmxlbmd0aCA9PT0gMCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJsb29rdXBDb2x1bW46IFwiICsgb3B0Lmxvb2t1cENvbHVtbiwgXCJUaGlzIGNvbHVtbiBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgYSBsb29rdXAgY29sdW1uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdVcmwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCdWlsZCB0aGUgbGluayB0byB0aGUgTG9va3VwIGNvbHVtbidzIGxpc3QgZW5jbG9zZWQgaW4gYSBkaXYgd2l0aCB0aGUgaWQ9XCJTUExvb2t1cEFkZE5ld19cIiArIGxvb2t1cENvbHVtblN0YXRpY05hbWVcclxuICAgICAgICAgICAgdmFyIG5ld0hyZWYgPSBsb29rdXBMaXN0VXJsICsgbmV3VXJsO1xyXG4gICAgICAgICAgICAvLyBJZiByZXF1ZXN0ZWQsIG9wZW4gdGhlIGxpbmsgaW4gYSBuZXcgd2luZG93IGFuZCBpZiByZXF1ZXN0ZWQsIHBhc3MgdGhlIENvbnRlbnRUeXBlSURcclxuICAgICAgICAgICAgbmV3SHJlZiArPSBvcHQubmV3V2luZG93ID9cclxuICAgICAgICAgICAgKChvcHQuQ29udGVudFR5cGVJRC5sZW5ndGggPiAwKSA/IFwiP0NvbnRlbnRUeXBlSUQ9XCIgKyBvcHQuQ29udGVudFR5cGVJRCA6IFwiXCIpICsgXCInIHRhcmdldD0nX2JsYW5rJ1wiIDpcclxuICAgICAgICAgICAgXCI/XCIgKyAoKG9wdC5Db250ZW50VHlwZUlELmxlbmd0aCA+IDApID8gXCJDb250ZW50VHlwZUlEPVwiICsgb3B0LkNvbnRlbnRUeXBlSUQgKyBcIiZcIiA6IFwiXCIpICsgXCJTb3VyY2U9XCIgKyB1dGlscy5lc2NhcGVVcmwobG9jYXRpb24uaHJlZikgKyBcIidcIjtcclxuICAgICAgICAgICAgdmFyIG5ld0xpbmsgPSBcIjxkaXYgaWQ9J1NQTG9va3VwQWRkTmV3X1wiICsgbG9va3VwQ29sdW1uU3RhdGljTmFtZSArIFwiJz5cIiArIFwiPGEgaHJlZj0nXCIgKyBuZXdIcmVmICsgXCI+XCIgKyBvcHQucHJvbXB0VGV4dC5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5sb29rdXBDb2x1bW4pICsgXCI8L2E+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgbGluayB0byB0aGUgTG9va3VwIGNvbHVtbnMncyBmb3JtYm9keSB0YWJsZSBjZWxsXHJcbiAgICAgICAgICAgICQobG9va3VwU2VsZWN0Lk9iaikucGFyZW50cyhcInRkLm1zLWZvcm1ib2R5XCIpLmFwcGVuZChuZXdMaW5rKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5kZWJ1Zykge1xyXG4gICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcImxvb2t1cENvbHVtbjogXCIgKyBvcHQubG9va3VwQ29sdW1uLCBcIk5ld0Zvcm0gY2Fubm90IGJlIGZvdW5kXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIElmIHByZXNlbnQsIGNhbGwgY29tcGxldGVmdW5jIHdoZW4gYWxsIGVsc2UgaXMgZG9uZVxyXG4gICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQTG9va3VwQWRkTmV3XHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICRcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHJlZGlyZWN0IHRvIGEgYW5vdGhlciBwYWdlIGZyb20gYSBuZXcgaXRlbSBmb3JtIHdpdGggdGhlIG5ld1xyXG4gICAgLy8gaXRlbSdzIElELiBUaGlzIGFsbG93cyBjaGFpbmluZyBvZiBmb3JtcyBmcm9tIGl0ZW0gY3JlYXRpb24gb253YXJkLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQUmVkaXJlY3RXaXRoSUQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgcmVkaXJlY3RVcmw6IFwiXCIsIC8vIFBhZ2UgZm9yIHRoZSByZWRpcmVjdFxyXG4gICAgICAgICAgICBxc1BhcmFtTmFtZTogXCJJRFwiIC8vIEluIHNvbWUgY2FzZXMsIHlvdSBtYXkgd2FudCB0byBwYXNzIHRoZSBuZXdseSBjcmVhdGVkIGl0ZW0ncyBJRCB3aXRoIGEgZGlmZmVyZW50XHJcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlciBuYW1lIHRoYW4gSUQuIFNwZWNpZnkgdGhhdCBuYW1lIGhlcmUsIGlmIG5lZWRlZC5cclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNMaXN0ID0gJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKTtcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWxzID0gJCgpLlNQU2VydmljZXMuU1BHZXRRdWVyeVN0cmluZygpO1xyXG4gICAgICAgIHZhciBsYXN0SUQgPSBxdWVyeVN0cmluZ1ZhbHMuSUQ7XHJcbiAgICAgICAgdmFyIFFTTGlzdCA9IHF1ZXJ5U3RyaW5nVmFscy5MaXN0O1xyXG4gICAgICAgIHZhciBRU1Jvb3RGb2xkZXIgPSBxdWVyeVN0cmluZ1ZhbHMuUm9vdEZvbGRlcjtcclxuICAgICAgICB2YXIgUVNDb250ZW50VHlwZUlkID0gcXVlcnlTdHJpbmdWYWxzLkNvbnRlbnRUeXBlSWQ7XHJcblxyXG4gICAgICAgIC8vIE9uIGZpcnN0IGxvYWQsIGNoYW5nZSB0aGUgZm9ybSBhY3Rpb25zIHRvIHJlZGlyZWN0IGJhY2sgdG8gdGhpcyBwYWdlIHdpdGggdGhlIGN1cnJlbnQgbGFzdElEIGZvciB0aGlzIHVzZXIgYW5kIHRoZVxyXG4gICAgICAgIC8vIG9yaWdpbmFsIFNvdXJjZS5cclxuICAgICAgICBpZiAodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5JRCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICBsYXN0SUQgPSAkKCkuU1BTZXJ2aWNlcy5TUEdldExhc3RJdGVtSWQoe1xyXG4gICAgICAgICAgICAgICAgbGlzdE5hbWU6IHRoaXNMaXN0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiZm9ybVtpZD0nYXNwbmV0Rm9ybSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBwYWdlLi4uXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc1VybCA9IChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpID4gMCkgPyBsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCBsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpKSA6IGxvY2F0aW9uLmhyZWY7XHJcbiAgICAgICAgICAgICAgICAvLyAuLi4gcGx1cyB0aGUgU291cmNlIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNTb3VyY2UgPSAodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5Tb3VyY2UgPT09IFwic3RyaW5nXCIpID9cclxuICAgICAgICAgICAgICAgIFwiU291cmNlPVwiICsgcXVlcnlTdHJpbmdWYWxzLlNvdXJjZS5yZXBsYWNlKC9cXC8vZywgXCIlMmZcIikucmVwbGFjZSgvOi9nLCBcIiUzYVwiKSA6IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1FTID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFFTTGlzdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1FTLnB1c2goXCJMaXN0PVwiICsgUVNMaXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgUVNSb290Rm9sZGVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3UVMucHVzaChcIlJvb3RGb2xkZXI9XCIgKyBRU1Jvb3RGb2xkZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBRU0NvbnRlbnRUeXBlSWQgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdRUy5wdXNoKFwiQ29udGVudFR5cGVJZD1cIiArIFFTQ29udGVudFR5cGVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0FjdGlvbiA9IHRoaXNVcmwgK1xyXG4gICAgICAgICAgICAgICAgICAgICgobmV3UVMubGVuZ3RoID4gMCkgPyAoXCI/XCIgKyBuZXdRUy5qb2luKFwiJlwiKSArIFwiJlwiKSA6IFwiP1wiKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgU291cmNlIHRvIHBvaW50IGJhY2sgdG8gdGhpcyBwYWdlIHdpdGggdGhlIGxhc3RJRCB0aGlzIHVzZXIgaGFzIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgXCJTb3VyY2U9XCIgKyB0aGlzVXJsICtcclxuICAgICAgICAgICAgICAgICAgICBcIj9JRD1cIiArIGxhc3RJRCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIG9yaWdpbmFsIHNvdXJjZSBhcyBSZWFsU291cmNlLCBpZiBwcmVzZW50XHJcbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzU291cmNlLmxlbmd0aCA+IDApID8gKFwiJTI2UmVhbFNvdXJjZT1cIiArIHF1ZXJ5U3RyaW5nVmFscy5Tb3VyY2UpIDogXCJcIikgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBvdmVycmlkZSBSZWRpcmVjdFVSTCwgaWYgcHJlc2VudFxyXG4gICAgICAgICAgICAgICAgICAgICgodHlwZW9mIHF1ZXJ5U3RyaW5nVmFscy5SZWRpcmVjdFVSTCA9PT0gXCJzdHJpbmdcIikgPyAoXCIlMjZSZWRpcmVjdFVSTD1cIiArIHF1ZXJ5U3RyaW5nVmFscy5SZWRpcmVjdFVSTCkgOiBcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBmb3JtIGFjdGlvblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5mb3Jtcy5hc3BuZXRGb3JtLmFjdGlvbiA9IG5ld0FjdGlvbjtcclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbG9hZCBhZnRlciB0aGUgaXRlbSBpcyBzYXZlZCwgd2FpdCB1bnRpbCB0aGUgbmV3IGl0ZW0gaGFzIGJlZW4gc2F2ZWQgKGNvbW1pdHMgYXJlIGFzeW5jaHJvbm91cyksXHJcbiAgICAgICAgICAgIC8vIHRoZW4gZG8gdGhlIHJlZGlyZWN0IHRvIHJlZGlyZWN0VXJsIHdpdGggdGhlIG5ldyBsYXN0SUQsIHBhc3NpbmcgYWxvbmcgdGhlIG9yaWdpbmFsIFNvdXJjZS5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAocXVlcnlTdHJpbmdWYWxzLklEID09PSBsYXN0SUQpIHtcclxuICAgICAgICAgICAgICAgIGxhc3RJRCA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0TGFzdEl0ZW1JZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdE5hbWU6IHRoaXNMaXN0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIFJlZGlyZWN0VVJMIHBhcmFtZXRlciBvbiB0aGUgUXVlcnkgU3RyaW5nLCB0aGVuIHJlZGlyZWN0IHRoZXJlIGluc3RlYWQgb2YgdGhlIHZhbHVlXHJcbiAgICAgICAgICAgIC8vIHNwZWNpZmllZCBpbiB0aGUgb3B0aW9ucyAob3B0LnJlZGlyZWN0VXJsKVxyXG4gICAgICAgICAgICB2YXIgdGhpc1JlZGlyZWN0VXJsID0gKHR5cGVvZiBxdWVyeVN0cmluZ1ZhbHMuUmVkaXJlY3RVUkwgPT09IFwic3RyaW5nXCIpID8gcXVlcnlTdHJpbmdWYWxzLlJlZGlyZWN0VVJMIDogb3B0LnJlZGlyZWN0VXJsO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gdGhpc1JlZGlyZWN0VXJsICsgXCI/XCIgKyBvcHQucXNQYXJhbU5hbWUgKyBcIj1cIiArIGxhc3RJRCArXHJcbiAgICAgICAgICAgICAgICAoKHR5cGVvZiBxdWVyeVN0cmluZ1ZhbHMuUmVhbFNvdXJjZSA9PT0gXCJzdHJpbmdcIikgPyAoXCImU291cmNlPVwiICsgcXVlcnlTdHJpbmdWYWxzLlJlYWxTb3VyY2UpIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUFJlZGlyZWN0V2l0aElEXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB3aGljaCBjaGVja3MgdG8gc2VlIGlmIHRoZSB2YWx1ZSBmb3IgYSBjb2x1bW4gb24gdGhlIGZvcm0gaXMgdW5pcXVlIGluIHRoZSBsaXN0LlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQUmVxdWlyZVVuaXF1ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBjb2x1bW5TdGF0aWNOYW1lOiBcIlRpdGxlXCIsIC8vIE5hbWUgb2YgdGhlIGNvbHVtblxyXG4gICAgICAgICAgICBkdXBsaWNhdGVBY3Rpb246IDAsIC8vIDAgPSB3YXJuLCAxID0gcHJldmVudFxyXG4gICAgICAgICAgICBpZ25vcmVDYXNlOiBmYWxzZSwgLy8gSWYgc2V0IHRvIHRydWUsIHRoZSBmdW5jdGlvbiBpZ25vcmVzIGNhc2UsIGlmIGZhbHNlIGl0IGxvb2tzIGZvciBhbiBleGFjdCBtYXRjaFxyXG4gICAgICAgICAgICBpbml0TXNnOiBcIlRoaXMgdmFsdWUgbXVzdCBiZSB1bmlxdWUuXCIsIC8vIEluaXRpYWwgbWVzc2FnZSB0byBkaXNwbGF5IGFmdGVyIHNldHVwXHJcbiAgICAgICAgICAgIGluaXRNc2dDU1NDbGFzczogXCJtcy12YlwiLCAvLyBDU1MgY2xhc3MgZm9yIGluaXRpYWwgbWVzc2FnZVxyXG4gICAgICAgICAgICBlcnJNc2c6IFwiVGhpcyB2YWx1ZSBpcyBub3QgdW5pcXVlLlwiLCAvLyBFcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgaWYgbm90IHVuaXF1ZVxyXG4gICAgICAgICAgICBlcnJNc2dDU1NDbGFzczogXCJtcy1mb3JtdmFsaWRhdGlvblwiLCAvLyBDU1MgY2xhc3MgZm9yIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgc2hvd0R1cGVzOiBmYWxzZSwgLy8gSWYgdHJ1ZSwgc2hvdyBsaW5rcyB0byB0aGUgZHVwbGljYXRlIGl0ZW0ocykgYWZ0ZXIgdGhlIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBudWxsIC8vIEZ1bmN0aW9uIHRvIGNhbGwgb24gY29tcGxldGlvbiBvZiByZW5kZXJpbmcgdGhlIGNoYW5nZS5cclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IGl0ZW0ncyBJRCBmcm9tIHRoZSBRdWVyeSBTdHJpbmdcclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWxzID0gJCgpLlNQU2VydmljZXMuU1BHZXRRdWVyeVN0cmluZygpO1xyXG4gICAgICAgIHZhciB0aGlzSUQgPSBxdWVyeVN0cmluZ1ZhbHMuSUQ7XHJcbiAgICAgICAgdmFyIHRoaXNMaXN0ID0gJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBtZXNzYWdlcyBiYXNlZCBvbiB0aGUgb3B0aW9ucyBwcm92aWRlZFxyXG4gICAgICAgIHZhciBtc2cgPSBcIjxzcGFuIGlkPSdTUFJlcXVpcmVVbmlxdWVcIiArIG9wdC5jb2x1bW5TdGF0aWNOYW1lICsgXCInIGNsYXNzPSd7MH0nPnsxfTwvc3Bhbj48YnIvPlwiO1xyXG4gICAgICAgIHZhciBmaXJzdE1zZyA9IG1zZy5yZXBsYWNlKC9cXHswXFx9L2csIG9wdC5pbml0TXNnQ1NTQ2xhc3MpLnJlcGxhY2UoL1xcezFcXH0vZywgb3B0LmluaXRNc2cpO1xyXG5cclxuICAgICAgICAvLyBXZSBuZWVkIHRoZSBEaXNwbGF5TmFtZVxyXG4gICAgICAgIHZhciBjb2x1bW5EaXNwbGF5TmFtZSA9ICQoKS5TUFNlcnZpY2VzLlNQR2V0RGlzcGxheUZyb21TdGF0aWMoe1xyXG4gICAgICAgICAgICBsaXN0TmFtZTogdGhpc0xpc3QsXHJcbiAgICAgICAgICAgIGNvbHVtblN0YXRpY05hbWU6IG9wdC5jb2x1bW5TdGF0aWNOYW1lXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGNvbHVtbk9iaiA9IHV0aWxzLmZpbmRGb3JtRmllbGQoY29sdW1uRGlzcGxheU5hbWUpLmZpbmQoXCJpbnB1dFtUaXRsZV49J1wiICsgY29sdW1uRGlzcGxheU5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIGNvbHVtbk9iai5wYXJlbnQoKS5hcHBlbmQoZmlyc3RNc2cpO1xyXG5cclxuICAgICAgICBjb2x1bW5PYmouYmx1cihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5WYWx1ZUlEcyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGNvbHVtbkRpc3BsYXlOYW1lJ3MgdmFsdWVcclxuICAgICAgICAgICAgdmFyIGNvbHVtblZhbHVlID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBMaXN0cyBXZWIgU2VydmljZSAoR2V0TGlzdEl0ZW1zKSB0byBzZWUgaWYgdGhlIHZhbHVlIGFscmVhZHkgZXhpc3RzXHJcbiAgICAgICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGxpc3ROYW1lOiB0aGlzTGlzdCxcclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBnZXQgYWxsIHRoZSBpdGVtcywgaWdub3JpbmcgYW55IGZpbHRlcnMgb24gdGhlIGRlZmF1bHQgdmlldy5cclxuICAgICAgICAgICAgICAgIENBTUxRdWVyeTogXCI8UXVlcnk+PFdoZXJlPjxJc05vdE51bGw+PEZpZWxkUmVmIE5hbWU9J1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUgKyBcIicvPjwvSXNOb3ROdWxsPjwvV2hlcmU+PC9RdWVyeT5cIixcclxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBiYXNlZCBvbiBjb2x1bW5TdGF0aWNOYW1lJ3MgdmFsdWVcclxuICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdJRCcgLz48RmllbGRSZWYgTmFtZT0nXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZSArIFwiJyAvPjwvVmlld0ZpZWxkcz5cIixcclxuICAgICAgICAgICAgICAgIC8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHZpZXcgcm93bGltaXQgYW5kIGdldCBhbGwgYXBwcm9wcmlhdGUgcm93c1xyXG4gICAgICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiAwLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdFZhbHVlID0gb3B0Lmlnbm9yZUNhc2UgPyBjb2x1bW5WYWx1ZS50b1VwcGVyQ2FzZSgpIDogY29sdW1uVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuU1BGaWx0ZXJOb2RlKFwiejpyb3dcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVmFsdWUgPSBvcHQuaWdub3JlQ2FzZSA/ICQodGhpcykuYXR0cihcIm93c19cIiArIG9wdC5jb2x1bW5TdGF0aWNOYW1lKS50b1VwcGVyQ2FzZSgpIDogJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIHZhbHVlIGFscmVhZHkgZXhpc3RzIGluIGNvbHVtblN0YXRpY05hbWUgYW5kIGl0J3Mgbm90IHRoZSBjdXJyZW50IGl0ZW0sIHRoZW4gc2F2ZSB0aGUgSUQgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGVzdFZhbHVlID09PSB0aGlzVmFsdWUpICYmICgkKHRoaXMpLmF0dHIoXCJvd3NfSURcIikgIT09IHRoaXNJRCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtblZhbHVlSURzLnB1c2goWyQodGhpcykuYXR0cihcIm93c19JRFwiKSwgJCh0aGlzKS5hdHRyKFwib3dzX1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBuZXdNc2cgPSBvcHQuaW5pdE1zZztcclxuICAgICAgICAgICAgdmFyIG1zZ0NvbnRhaW5lciA9ICQoXCIjU1BSZXF1aXJlVW5pcXVlXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZSk7XHJcbiAgICAgICAgICAgIG1zZ0NvbnRhaW5lci5odG1sKG5ld01zZykuYXR0cihcImNsYXNzXCIsIG9wdC5pbml0TXNnQ1NTQ2xhc3MpO1xyXG5cclxuICAgICAgICAgICAgJChcImlucHV0W3ZhbHVlPSdPSyddOmRpc2FibGVkLCBpbnB1dFt2YWx1ZT0nU2F2ZSddOmRpc2FibGVkXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtblZhbHVlSURzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld01zZyA9IG9wdC5lcnJNc2c7XHJcbiAgICAgICAgICAgICAgICBtc2dDb250YWluZXIuaHRtbChuZXdNc2cpLmF0dHIoXCJjbGFzc1wiLCBvcHQuZXJyTXNnQ1NTQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5kdXBsaWNhdGVBY3Rpb24gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5PYmouZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiaW5wdXRbdmFsdWU9J09LJ10sIGlucHV0W3ZhbHVlPSdTYXZlJ11cIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LnNob3dEdXBlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvdXQgPSBcIiBcIiArIGNvbHVtblZhbHVlSURzLmxlbmd0aCArIFwiIGR1cGxpY2F0ZSBpdGVtXCIgKyAoY29sdW1uVmFsdWVJRHMubGVuZ3RoID4gMSA/IFwic1wiIDogXCJcIikgKyBcIjogXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5WYWx1ZUlEcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8YSBocmVmPSdEaXNwRm9ybS5hc3B4P0lEPVwiICsgY29sdW1uVmFsdWVJRHNbaV1bMF0gKyBcIiZTb3VyY2U9XCIgKyBsb2NhdGlvbi5ocmVmICsgXCInPlwiICsgY29sdW1uVmFsdWVJRHNbaV1bMV0gKyBcIjwvYT4gXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICQoXCJzcGFuI1NQUmVxdWlyZVVuaXF1ZVwiICsgb3B0LmNvbHVtblN0YXRpY05hbWUpLmFwcGVuZChvdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIElmIHByZXNlbnQsIGNhbGwgY29tcGxldGVmdW5jIHdoZW4gYWxsIGVsc2UgaXMgZG9uZVxyXG4gICAgICAgIGlmIChvcHQuY29tcGxldGVmdW5jICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoKTtcclxuICAgICAgICB9XHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQUmVxdWlyZVVuaXF1ZVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50cyxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIERvZXMgYW4gYXVkaXQgb2YgYSBzaXRlJ3MgbGlzdCBmb3JtcyB0byBzaG93IHdoZXJlIHNjcmlwdCBpcyBpbiB1c2UuXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BTY3JpcHRBdWRpdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgdGhlIFdlYiAoc2l0ZSkgdG8gYXVkaXRcclxuICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIsIC8vIFtPcHRpb25hbF0gVGhlIG5hbWUgb2YgYSBzcGVjaWZpYyBsaXN0IHRvIGF1ZGl0LiBJZiBub3QgcHJlc2VudCwgYWxsIGxpc3RzIGluIHRoZSBzaXRlIGFyZSBhdWRpdGVkLlxyXG4gICAgICAgICAgICBvdXRwdXRJZDogXCJcIiwgLy8gVGhlIGlkIG9mIHRoZSBET00gb2JqZWN0IGZvciBvdXRwdXRcclxuICAgICAgICAgICAgYXVkaXRGb3JtczogdHJ1ZSwgLy8gQXVkaXQgdGhlIGZvcm0gcGFnZXNcclxuICAgICAgICAgICAgYXVkaXRWaWV3czogdHJ1ZSwgLy8gQXVkaXQgdGhlIHZpZXcgcGFnZXNcclxuICAgICAgICAgICAgYXVkaXRQYWdlczogdHJ1ZSwgLy8gQXVkaXQgdGhlIFBhZ2VzIERvY3VtZW50IExpYnJhcnlcclxuICAgICAgICAgICAgYXVkaXRQYWdlc0xpc3ROYW1lOiBcIlBhZ2VzXCIsIC8vIFRoZSBQYWdlcyBEb2N1bWVudCBMaWJyYXJ5KGllcyksIGlmIGRlc2lyZWQuIEVpdGhlciBhIHNpbmdsZSBzdHJpbmcgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncy5cclxuICAgICAgICAgICAgc2hvd0hpZGRlbkxpc3RzOiBmYWxzZSwgLy8gU2hvdyBvdXRwdXQgZm9yIGhpZGRlbiBsaXN0c1xyXG4gICAgICAgICAgICBzaG93Tm9TY3JpcHQ6IGZhbHNlLCAvLyBTaG93IG91dHB1dCBmb3IgbGlzdHMgd2l0aCBubyBzY3JpcHRzIChlZmZlY3RpdmVseSBcInZlcmJvc2VcIilcclxuICAgICAgICAgICAgc2hvd1NyYzogdHJ1ZSAvLyBTaG93IHRoZSBzb3VyY2UgbG9jYXRpb24gZm9yIGluY2x1ZGVkIHNjcmlwdHNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1UeXBlcyA9IFtcclxuICAgICAgICAgICAgW1wiTmV3XCIsIFwiTmV3Rm9ybS5hc3B4XCIsIGZhbHNlXSxcclxuICAgICAgICAgICAgW1wiRGlzcGxheVwiLCBcIkRpc3BGb3JtLmFzcHhcIiwgZmFsc2VdLFxyXG4gICAgICAgICAgICBbXCJFZGl0XCIsIFwiRWRpdEZvcm0uYXNweFwiLCBmYWxzZV1cclxuICAgICAgICBdO1xyXG4gICAgICAgIHZhciBsaXN0WG1sO1xyXG5cclxuICAgICAgICAvLyBCdWlsZCB0aGUgdGFibGUgdG8gY29udGFpbiB0aGUgcmVzdWx0c1xyXG4gICAgICAgICQoXCIjXCIgKyBvcHQub3V0cHV0SWQpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoXCI8dGFibGUgaWQ9J1NQU2NyaXB0QXVkaXQnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnIGJvcmRlcj0wIGNlbGxTcGFjaW5nPTAgY2VsbFBhZGRpbmc9MT5cIiArXHJcbiAgICAgICAgICAgIFwiPHRyPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+PC90aD5cIiArXHJcbiAgICAgICAgICAgIFwiPHRoPkxpc3Q8L3RoPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+UGFnZSBDbGFzczwvdGg+XCIgK1xyXG4gICAgICAgICAgICBcIjx0aD5QYWdlIFR5cGU8L3RoPlwiICtcclxuICAgICAgICAgICAgXCI8dGg+UGFnZTwvdGg+XCIgK1xyXG4gICAgICAgICAgICAob3B0LnNob3dTcmMgPyBcIjx0aD5TY3JpcHQgUmVmZXJlbmNlczwvdGg+XCIgOiBcIlwiKSArXHJcbiAgICAgICAgICAgIFwiPC90cj5cIiArXHJcbiAgICAgICAgICAgIFwiPC90YWJsZT5cIik7XHJcbiAgICAgICAgLy8gQXBwbHkgdGhlIENTUyBjbGFzcyB0byB0aGUgaGVhZGVyc1xyXG4gICAgICAgIHZhciBzY3JpcHRBdWRpdENvbnRhaW5lciA9ICQoXCIjU1BTY3JpcHRBdWRpdFwiKTtcclxuICAgICAgICBzY3JpcHRBdWRpdENvbnRhaW5lci5maW5kKFwidGhcIikuYXR0cihcImNsYXNzXCIsIFwibXMtdmgyLW5vZmlsdGVyXCIpO1xyXG5cclxuICAgICAgICAvLyBEb24ndCBib3RoZXIgd2l0aCB0aGUgbGlzdHMgaWYgdGhlIG9wdGlvbnMgZG9uJ3QgcmVxdWlyZSB0aGVtXHJcbiAgICAgICAgaWYgKG9wdC5hdWRpdEZvcm1zIHx8IG9wdC5hdWRpdFZpZXdzKSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0LCBnZXQgYWxsIG9mIHRoZSBsaXN0cyB3aXRoaW4gdGhlIHNpdGVcclxuICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RDb2xsZWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkxpc3RcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RYbWwgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgbGlzdE5hbWUgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGVuIG9ubHkgcmV0dXJuIHJlc3VsdHMgZm9yIHRoYXQgbGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKG9wdC5saXN0TmFtZS5sZW5ndGggPT09IDApIHx8IChsaXN0WG1sLmF0dHIoXCJUaXRsZVwiKSA9PT0gb3B0Lmxpc3ROYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3Qgd29yayB3aXRoIGhpZGRlbiBsaXN0cyB1bmxlc3Mgd2UncmUgYXNrZWQgdG9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgob3B0LnNob3dIaWRkZW5MaXN0cyAmJiBsaXN0WG1sLmF0dHIoXCJIaWRkZW5cIikgPT09IFwiRmFsc2VcIikgfHwgIW9wdC5zaG93SGlkZGVuTGlzdHMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXVkaXQgdGhlIGxpc3QncyBmb3Jtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQuYXVkaXRGb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGxpc3QncyBDb250ZW50IFR5cGVzLCB0aGVyZWZvcmUgdGhlIGZvcm0gcGFnZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RDb250ZW50VHlwZXNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0WG1sLmF0dHIoXCJJRFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSwgLy8gTmVlZCB0aGlzIHRvIGJlIHN5bmNocm9ub3VzIHNvIHdlJ3JlIGFzc3VyZWQgb2YgYSB2YWxpZCB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiQ29udGVudFR5cGVcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGRlYWwgd2l0aCBmb2xkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJJRFwiKS5zdWJzdHJpbmcoMCwgNikgIT09IFwiMHgwMTIwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtVXJscyA9ICQodGhpcykuZmluZChcIkZvcm1VcmxzXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmb3JtVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMb29rIGZvciBhIGN1c3RvbWl6ZWQgZm9ybS4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZm9ybVVybHMpLmZpbmQoZm9ybVR5cGVzW2ldWzBdKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIkZvcm1cIiwgdGhpcy5ub2RlTmFtZSwgKChvcHQud2ViVVJMLmxlbmd0aCA+IDApID8gb3B0LndlYlVSTCA6ICQoKS5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFNpdGUoKSkgKyBjb25zdGFudHMuU0xBU0ggKyAkKHRoaXMpLnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1UeXBlc1tpXVsyXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLi4uZWxzZSB0aGUgdW5jdXN0b21pemVkIGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcm1UeXBlc1tpXVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZpZXdVcmwgPSBsaXN0WG1sLmF0dHIoXCJEZWZhdWx0Vmlld1VybFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIkZvcm1cIiwgZm9ybVR5cGVzW2ldWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFZpZXdVcmwuc3Vic3RyaW5nKDAsIGRlZmF1bHRWaWV3VXJsLmxhc3RJbmRleE9mKGNvbnN0YW50cy5TTEFTSCkgKyAxKSArIGZvcm1UeXBlc1tpXVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIGZvcm0gdHlwZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBmb3JtVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtVHlwZXNbaV1bMl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEF1ZGl0IHRoZSBsaXN0J3Mgdmlld3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LmF1ZGl0Vmlld3MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsaXN0J3MgVmlld3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldFZpZXdDb2xsZWN0aW9uXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0TmFtZTogbGlzdFhtbC5hdHRyKFwiSURcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIlZpZXdcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNQU2NyaXB0QXVkaXRQYWdlKG9wdCwgbGlzdFhtbCwgXCJWaWV3XCIsICQodGhpcykuYXR0cihcIkRpc3BsYXlOYW1lXCIpLCAkKHRoaXMpLmF0dHIoXCJVcmxcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRG9uJ3QgYm90aGVyIHdpdGggYXVkaXRpbmcgcGFnZXMgaWYgdGhlIG9wdGlvbnMgZG9uJ3QgcmVxdWlyZSBpdFxyXG4gICAgICAgIHZhciBudW1MaXN0cyA9IDA7XHJcbiAgICAgICAgdmFyIGxpc3RzQXJyYXkgPSBbXTtcclxuICAgICAgICBpZiAodHlwZW9mIG9wdC5hdWRpdFBhZ2VzTGlzdE5hbWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgbnVtTGlzdHMgPSAxO1xyXG4gICAgICAgICAgICBsaXN0c0FycmF5LnB1c2gob3B0LmF1ZGl0UGFnZXNMaXN0TmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbnVtTGlzdHMgPSBvcHQuYXVkaXRQYWdlc0xpc3ROYW1lLmxlbmd0aDtcclxuICAgICAgICAgICAgbGlzdHNBcnJheSA9IG9wdC5hdWRpdFBhZ2VzTGlzdE5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0LmF1ZGl0UGFnZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1MaXN0czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0c0FycmF5W2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJMaXN0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdFhtbCA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBvZiB0aGUgaXRlbXMgZnJvbSB0aGUgRG9jdW1lbnQgTGlicmFyeVxyXG4gICAgICAgICAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3ROYW1lOiBsaXN0c0FycmF5W2ldLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxRdWVyeTogXCI8UXVlcnk+PFdoZXJlPjxOZXE+PEZpZWxkUmVmIE5hbWU9J0NvbnRlbnRUeXBlJy8+PFZhbHVlIFR5cGU9J1RleHQnPkZvbGRlcjwvVmFsdWU+PC9OZXE+PC9XaGVyZT48L1F1ZXJ5PlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIjxWaWV3RmllbGRzPjxGaWVsZFJlZiBOYW1lPSdUaXRsZScvPjxGaWVsZFJlZiBOYW1lPSdGaWxlUmVmJy8+PC9WaWV3RmllbGRzPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIENBTUxSb3dMaW1pdDogMCxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzUGFnZVVybCA9ICQodGhpcykuYXR0cihcIm93c19GaWxlUmVmXCIpLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGlzVGl0bGUgPSAkKHRoaXMpLmF0dHIoXCJvd3NfVGl0bGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1BhZ2VUeXBlID0gKHR5cGVvZiB0aGlzVGl0bGUgIT09IFwidW5kZWZpbmVkXCIpID8gdGhpc1RpdGxlIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzUGFnZVVybC5pbmRleE9mKFwiLmFzcHhcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBcIlBhZ2VcIiwgdGhpc1BhZ2VUeXBlLCBjb25zdGFudHMuU0xBU0ggKyB0aGlzUGFnZVVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlbW92ZSBwcm9ncmVzcyBpbmRpY2F0b3IgYW5kIG1ha2UgdGhlIG91dHB1dCBwcmV0dHkgYnkgY2xlYW5pbmcgdXAgdGhlIG1zLWFsdGVybmF0aW5nIENTUyBjbGFzc1xyXG4gICAgICAgIHNjcmlwdEF1ZGl0Q29udGFpbmVyLmZpbmQoXCJ0cltjbGFzcz0nbXMtYWx0ZXJuYXRpbmcnXTpldmVuXCIpLnJlbW92ZUF0dHIoXCJjbGFzc1wiKTtcclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BTY3JpcHRBdWRpdFxyXG5cclxuICAgIC8vIERpc3BsYXlzIHRoZSB1c2FnZSBvZiBzY3JpcHRzIGluIGEgc2l0ZVxyXG4gICAgZnVuY3Rpb24gU1BTY3JpcHRBdWRpdFBhZ2Uob3B0LCBsaXN0WG1sLCBwYWdlQ2xhc3MsIHBhZ2VUeXBlLCBwYWdlVXJsKSB7XHJcblxyXG4gICAgICAgIHZhciBqUXVlcnlQYWdlID0gMDtcclxuICAgICAgICB2YXIgcGFnZVNjcmlwdFNyYyA9IHt9O1xyXG4gICAgICAgIHBhZ2VTY3JpcHRTcmMudHlwZSA9IFtdO1xyXG4gICAgICAgIHBhZ2VTY3JpcHRTcmMuc3JjID0gW107XHJcbiAgICAgICAgcGFnZVNjcmlwdFNyYy5zY3JpcHQgPSBbXTtcclxuICAgICAgICB2YXIgc2NyaXB0UmVnZXggPSBSZWdFeHAoXCI8c2NyaXB0W1xcXFxzXFxcXFNdKj8vc2NyaXB0PlwiLCBcImdpXCIpO1xyXG5cclxuICAgICAgICAvLyBGZXRjaCB0aGUgcGFnZVxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgIHVybDogcGFnZVVybCxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzY3JpcHRNYXRjaDtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoc2NyaXB0TWF0Y2ggPSBzY3JpcHRSZWdleC5leGVjKHhEYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRMYW5ndWFnZSA9IGdldFNjcmlwdEF0dHJpYnV0ZShzY3JpcHRNYXRjaCwgXCJsYW5ndWFnZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NyaXB0VHlwZSA9IGdldFNjcmlwdEF0dHJpYnV0ZShzY3JpcHRNYXRjaCwgXCJ0eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JpcHRTcmMgPSBnZXRTY3JpcHRBdHRyaWJ1dGUoc2NyaXB0TWF0Y2gsIFwic3JjXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JpcHRTcmMgIT09IG51bGwgJiYgc2NyaXB0U3JjLmxlbmd0aCA+IDAgJiYgIWNvcmVTY3JpcHQoc2NyaXB0U3JjKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2NyaXB0U3JjLnR5cGUucHVzaCgoc2NyaXB0TGFuZ3VhZ2UgIT09IG51bGwgJiYgc2NyaXB0TGFuZ3VhZ2UubGVuZ3RoID4gMCkgPyBzY3JpcHRMYW5ndWFnZSA6IHNjcmlwdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlU2NyaXB0U3JjLnNyYy5wdXNoKHNjcmlwdFNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeVBhZ2UrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT25seSBzaG93IHBhZ2VzIHdpdGhvdXQgc2NyaXB0IGlmIHdlJ3ZlIGJlZW4gYXNrZWQgdG8gZG8gc28uXHJcbiAgICAgICAgICAgICAgICBpZiAoKCFvcHQuc2hvd05vU2NyaXB0ICYmIChwYWdlU2NyaXB0U3JjLnR5cGUubGVuZ3RoID4gMCkpIHx8IG9wdC5zaG93Tm9TY3JpcHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZVBhdGggPSBwYWdlVXJsLnN1YnN0cmluZygwLCBwYWdlVXJsLmxhc3RJbmRleE9mKGNvbnN0YW50cy5TTEFTSCkgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0ID0gXCI8dHIgY2xhc3M9bXMtYWx0ZXJuYXRpbmc+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12Yi1pY29uPjxhIGhyZWY9J1wiICsgbGlzdFhtbC5hdHRyKFwiRGVmYXVsdFZpZXdVcmxcIikgKyBcIic+PElNRyBib3JkZXI9MCBzcmM9J1wiICsgbGlzdFhtbC5hdHRyKFwiSW1hZ2VVcmxcIikgKyBcIid3aWR0aD0xNiBoZWlnaHQ9MTY+PC9BPjwvVEQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+PGEgaHJlZj0nXCIgKyBsaXN0WG1sLmF0dHIoXCJEZWZhdWx0Vmlld1VybFwiKSArIFwiJz5cIiArIGxpc3RYbWwuYXR0cihcIlRpdGxlXCIpICsgKChsaXN0WG1sLmF0dHIoXCJIaWRkZW5cIikgPT09IFwiVHJ1ZVwiKSA/ICcoSGlkZGVuKScgOiAnJykgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+XCIgKyBwYWdlQ2xhc3MgKyBcIjwvdGQ+XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjx0ZCBjbGFzcz1tcy12YjI+XCIgKyBwYWdlVHlwZSArIFwiPC90ZD5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHRkIGNsYXNzPW1zLXZiMj48YSBocmVmPSdcIiArIHBhZ2VVcmwgKyBcIic+XCIgKyB1dGlscy5maWxlTmFtZShwYWdlVXJsKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnNob3dTcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoaXNTcmNQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7JyBib3JkZXI9MCBjZWxsU3BhY2luZz0wIGNlbGxQYWRkaW5nPTE+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZVNjcmlwdFNyYy50eXBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzU3JjUGF0aCA9IChwYWdlU2NyaXB0U3JjLnNyY1tpXS5zdWJzdHIoMCwgMSkgIT09IGNvbnN0YW50cy5TTEFTSCkgPyBwYWdlUGF0aCArIHBhZ2VTY3JpcHRTcmMuc3JjW2ldIDogcGFnZVNjcmlwdFNyYy5zcmNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gXCI8dHI+PHRkIGNsYXNzPW1zLXZiMiB3aWR0aD0nMzAlJz5cIiArIHBhZ2VTY3JpcHRTcmMudHlwZVtpXSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBcIjx0ZCBjbGFzcz1tcy12YjIgd2lkdGg9JzcwJSc+PGEgaHJlZj0nXCIgKyB0aGlzU3JjUGF0aCArIFwiJz5cIiArIHV0aWxzLmZpbGVOYW1lKHBhZ2VTY3JpcHRTcmMuc3JjW2ldKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBcIjwvdGFibGU+PC90ZD5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNTUFNjcmlwdEF1ZGl0XCIpLmFwcGVuZChvdXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IC8vIEVuZCBvZiBmdW5jdGlvbiBTUFNjcmlwdEF1ZGl0UGFnZVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFNjcmlwdEF0dHJpYnV0ZShzb3VyY2UsIGF0dHJpYnV0ZSkge1xyXG4gICAgICAgIHZhciBtYXRjaGVzO1xyXG4gICAgICAgIHZhciByZWdleCA9IFJlZ0V4cChhdHRyaWJ1dGUgKyBcIj0oXFxcIihbXlxcXCJdKilcXFwiKXwoJyhbXiddKiknKVwiLCBcImdpXCIpO1xyXG4gICAgICAgIGlmIChtYXRjaGVzID0gcmVnZXguZXhlYyhzb3VyY2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzWzJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gLy8gRW5kIG9mIGZ1bmN0aW9uIGdldFNjcmlwdEF0dHJpYnV0ZVxyXG5cclxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgc2NyaXB0IHJlZmVyZW5jZSBpcyBwYXJ0IG9mIFNoYXJlUG9pbnQgY29yZSBzbyB0aGF0IHdlIGNhbiBpZ25vcmUgaXRcclxuICAgIGZ1bmN0aW9uIGNvcmVTY3JpcHQoc3JjKSB7XHJcbiAgICAgICAgdmFyIGNvcmVTY3JpcHRMb2NhdGlvbnMgPSBbXCJXZWJSZXNvdXJjZS5heGRcIiwgXCJfbGF5b3V0c1wiXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcmVTY3JpcHRMb2NhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNyYy5pbmRleE9mKGNvcmVTY3JpcHRMb2NhdGlvbnNbaV0pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gLy8gRW5kIG9mIGZ1bmN0aW9uIGNvcmVTY3JpcHRcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgXCIuLi91dGlscy9jb25zdGFudHNcIixcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBUaGUgU1BTZXRNdWx0aVNlbGVjdFNpemVzIGZ1bmN0aW9uIHNldHMgdGhlIHNpemVzIG9mIHRoZSBtdWx0aS1zZWxlY3QgYm94ZXMgZm9yIGEgY29sdW1uIG9uIGEgZm9ybSBhdXRvbWFnaWNhbGx5XHJcbiAgICAvLyBiYXNlZCBvbiB0aGUgdmFsdWVzIHRoZXkgY29udGFpbi4gVGhlIGZ1bmN0aW9uIHRha2VzIGludG8gYWNjb3VudCB0aGUgZm9udFNpemUsIGZvbnRGYW1pbHksIGZvbnRXZWlnaHQsIGV0Yy4sIGluIGl0cyBhbGdvcml0aG0uXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BTZXRNdWx0aVNlbGVjdFNpemVzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiAkKCkuU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybCgpLCAvLyBUaGUgbGlzdCB0aGUgZm9ybSBpcyB3b3JraW5nIHdpdGguIFRoaXMgaXMgdXNlZnVsIGlmIHRoZSBmb3JtIGlzIG5vdCBpbiB0aGUgbGlzdCBjb250ZXh0LlxyXG4gICAgICAgICAgICBtdWx0aVNlbGVjdENvbHVtbjogXCJcIixcclxuICAgICAgICAgICAgbWluV2lkdGg6IDAsXHJcbiAgICAgICAgICAgIG1heFdpZHRoOiAwLFxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2VcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHRoaXNGdW5jdGlvbiA9IFwiU1BTZXJ2aWNlcy5TUFNldE11bHRpU2VsZWN0U2l6ZXNcIjtcclxuXHJcbiAgICAgICAgLy8gRmluZCB0aGUgbXVsdGktc2VsZWN0IGNvbHVtblxyXG4gICAgICAgIHZhciB0aGlzTXVsdGlTZWxlY3QgPSAkKCkuU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsKHtcclxuICAgICAgICAgICAgZGlzcGxheU5hbWU6IG9wdC5tdWx0aVNlbGVjdENvbHVtblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0aGlzTXVsdGlTZWxlY3QuT2JqLmh0bWwoKSA9PT0gbnVsbCAmJiBvcHQuZGVidWcpIHtcclxuICAgICAgICAgICAgdXRpbHMuZXJyQm94KHRoaXNGdW5jdGlvbiwgXCJtdWx0aVNlbGVjdENvbHVtbjogXCIgKyBvcHQubXVsdGlTZWxlY3RDb2x1bW4sIGNvbnN0YW50cy5UWFRDb2x1bW5Ob3RGb3VuZCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXNNdWx0aVNlbGVjdC5UeXBlICE9PSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0ICYmIG9wdC5kZWJ1Zykge1xyXG4gICAgICAgICAgICB1dGlscy5lcnJCb3godGhpc0Z1bmN0aW9uLCBcIm11bHRpU2VsZWN0Q29sdW1uOiBcIiArIG9wdC5tdWx0aVNlbGVjdENvbHVtbiwgXCJDb2x1bW4gaXMgbm90IG11bHRpLXNlbGVjdC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHRlbXBvcmFyeSBjbG9uZSBvZiB0aGUgc2VsZWN0IHRvIHVzZSB0byBkZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIHdpZHRoIHNldHRpbmdzLlxyXG4gICAgICAgIC8vIFdlJ2xsIGFwcGVuZCBpdCB0byB0aGUgZW5kIG9mIHRoZSBlbmNsb3Npbmcgc3Bhbi5cclxuICAgICAgICB2YXIgY2xvbmVJZCA9IHV0aWxzLmdlbkNvbnRhaW5lcklkKFwiU1BTZXRNdWx0aVNlbGVjdFNpemVzXCIsIG9wdC5tdWx0aVNlbGVjdENvbHVtbiwgb3B0Lmxpc3ROYW1lKTtcclxuICAgICAgICB2YXIgY2xvbmVPYmogPSAkKFwiPHNlbGVjdCBpZD0nXCIgKyBjbG9uZUlkICsgXCInID48L3NlbGVjdD5cIikuYXBwZW5kVG8odGhpc011bHRpU2VsZWN0LmNvbnRhaW5lcik7XHJcbiAgICAgICAgY2xvbmVPYmouY3NzKHtcclxuICAgICAgICAgICAgXCJ3aWR0aFwiOiBcImF1dG9cIiwgLy8gV2Ugd2FudCB0aGUgY2xvbmUgdG8gcmVzaXplIGl0cyB3aWR0aCBiYXNlZCBvbiB0aGUgY29udGVudHNcclxuICAgICAgICAgICAgXCJoZWlnaHRcIjogMCwgLy8gSnVzdCB0byBrZWVwIHRoZSBwYWdlIGNsZWFuIHdoaWxlIHdlIGFyZSB1c2luZyB0aGUgY2xvbmVcclxuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwiaGlkZGVuXCIgLy8gQW5kIGxldCdzIGtlZXAgaXQgaGlkZGVuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbGwgdGhlIHZhbHVlcyB0byB0aGUgY2xvbmVkIHNlbGVjdC4gIEZpcnN0IHRoZSBsZWZ0IChwb3NzaWJsZSB2YWx1ZXMpIHNlbGVjdC4uLlxyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5maW5kKFwib3B0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjbG9uZU9iai5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArICQodGhpcykuaHRtbCgpICsgXCInPlwiICsgJCh0aGlzKS5odG1sKCkgKyBcIjwvb3B0aW9uPlwiKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyAuLi50aGVuIHRoZSByaWdodCAoc2VsZWN0ZWQgdmFsdWVzKSBzZWxlY3QgKGluIGNhc2Ugc29tZSB2YWx1ZXMgaGF2ZSBhbHJlYWR5IGJlZW4gc2VsZWN0ZWQpXHJcbiAgICAgICAgJCh0aGlzTXVsdGlTZWxlY3QubWFzdGVyLnJlc3VsdENvbnRyb2wpLmZpbmQoXCJvcHRpb25cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsb25lT2JqLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgJCh0aGlzKS52YWwoKSArIFwiJz5cIiArICQodGhpcykuaHRtbCgpICsgXCI8L29wdGlvbj5cIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFdlJ2xsIGFkZCA1cHggZm9yIGEgbGl0dGxlIHBhZGRpbmcgb24gdGhlIHJpZ2h0LlxyXG4gICAgICAgIHZhciBkaXZXaWR0aCA9IGNsb25lT2JqLndpZHRoKCkgKyA1O1xyXG4gICAgICAgIHZhciBuZXdEaXZXaWR0aCA9IGRpdldpZHRoO1xyXG4gICAgICAgIGlmIChvcHQubWluV2lkdGggPiAwIHx8IG9wdC5tYXhXaWR0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKGRpdldpZHRoIDwgb3B0Lm1pbldpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBkaXZXaWR0aCA9IG9wdC5taW5XaWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobmV3RGl2V2lkdGggPCBvcHQubWluV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIG5ld0RpdldpZHRoID0gb3B0Lm1pbldpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChuZXdEaXZXaWR0aCA+IG9wdC5tYXhXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgbmV3RGl2V2lkdGggPSBvcHQubWF4V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGVjdFdpZHRoID0gZGl2V2lkdGg7XHJcblxyXG4gICAgICAgIC8vIFNldCB0aGUgbmV3IHdpZHRoc1xyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5jYW5kaWRhdGVDb250cm9sKS5jc3MoXCJ3aWR0aFwiLCBzZWxlY3RXaWR0aCArIFwicHhcIikucGFyZW50KCkuY3NzKFwid2lkdGhcIiwgbmV3RGl2V2lkdGggKyBcInB4XCIpO1xyXG4gICAgICAgICQodGhpc011bHRpU2VsZWN0Lm1hc3Rlci5yZXN1bHRDb250cm9sKS5jc3MoXCJ3aWR0aFwiLCBzZWxlY3RXaWR0aCArIFwicHhcIikucGFyZW50KCkuY3NzKFwid2lkdGhcIiwgbmV3RGl2V2lkdGggKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgdGhlIHNlbGVjdCdzIGNsb25lLCBzaW5jZSB3ZSdyZSBkb25lIHdpdGggaXRcclxuICAgICAgICBjbG9uZU9iai5yZW1vdmUoKTtcclxuXHJcbiAgICB9OyAvLyBFbmQgJC5mbi5TUFNlcnZpY2VzLlNQU2V0TXVsdGlTZWxlY3RTaXplc1xyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBTUFVwZGF0ZU11bHRpcGxlTGlzdEl0ZW1zIGFsbG93cyB5b3UgdG8gdXBkYXRlIG11bHRpcGxlIGl0ZW1zIGluIGEgbGlzdCBiYXNlZCB1cG9uIHNvbWUgY29tbW9uIGNoYXJhY3RlcmlzdGljIG9yIG1ldGFkYXRhIGNyaXRlcmlhLlxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQVXBkYXRlTXVsdGlwbGVMaXN0SXRlbXMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBbT3B0aW9uYWxdIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIGxpc3QgdG8gb3BlcmF0ZSBvbi5cclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBcIlwiLCAvLyBBIENBTUwgZnJhZ21lbnQgc3BlY2lmeWluZyB3aGljaCBpdGVtcyBpbiB0aGUgbGlzdCB3aWxsIGJlIHNlbGVjdGVkIGFuZCB1cGRhdGVkXHJcbiAgICAgICAgICAgIGJhdGNoQ21kOiBcIlVwZGF0ZVwiLCAvLyBUaGUgb3BlcmF0aW9uIHRvIHBlcmZvcm0uIEJ5IGRlZmF1bHQsIFVwZGF0ZS5cclxuICAgICAgICAgICAgdmFsdWVwYWlyczogW10sIC8vIFZhbHVlcGFpcnMgZm9yIHRoZSB1cGRhdGUgaW4gdGhlIGZvcm0gW1tmaWVsZG5hbWUxLCBmaWVsZHZhbHVlMV0sIFtmaWVsZG5hbWUyLCBmaWVsZHZhbHVlMl0uLi5dXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogbnVsbCwgLy8gRnVuY3Rpb24gdG8gY2FsbCBvbiBjb21wbGV0aW9uIG9mIHJlbmRlcmluZyB0aGUgY2hhbmdlLlxyXG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UgLy8gSWYgdHJ1ZSwgc2hvdyBlcnJvciBtZXNzYWdlcztpZiBmYWxzZSwgcnVuIHNpbGVudFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICB2YXIgaXRlbXNUb1VwZGF0ZSA9IFtdO1xyXG4gICAgICAgIHZhciBkb2N1bWVudHNUb1VwZGF0ZSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBDYWxsIEdldExpc3RJdGVtcyB0byBmaW5kIGFsbCBvZiB0aGUgaXRlbXMgbWF0Y2hpbmcgdGhlIENBTUxRdWVyeVxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RJdGVtc1wiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5OiBvcHQuQ0FNTFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBcIjxRdWVyeU9wdGlvbnM+PFZpZXdBdHRyaWJ1dGVzIFNjb3BlPSdSZWN1cnNpdmUnIC8+PC9RdWVyeU9wdGlvbnM+XCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAkKHhEYXRhLnJlc3BvbnNlWE1MKS5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtc1RvVXBkYXRlLnB1c2goJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZVJlZiA9ICQodGhpcykuYXR0cihcIm93c19GaWxlUmVmXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVSZWYgPSBcIi9cIiArIGZpbGVSZWYuc3Vic3RyaW5nKGZpbGVSZWYuaW5kZXhPZihjb25zdGFudHMuc3BEZWxpbSkgKyAyKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudHNUb1VwZGF0ZS5wdXNoKGZpbGVSZWYpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGZpZWxkTnVtO1xyXG4gICAgICAgIHZhciBiYXRjaCA9IFwiPEJhdGNoIE9uRXJyb3I9J0NvbnRpbnVlJz5cIjtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbXNUb1VwZGF0ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjxNZXRob2QgSUQ9J1wiICsgaSArIFwiJyBDbWQ9J1wiICsgb3B0LmJhdGNoQ21kICsgXCInPlwiO1xyXG4gICAgICAgICAgICBmb3IgKGZpZWxkTnVtID0gMDsgZmllbGROdW0gPCBvcHQudmFsdWVwYWlycy5sZW5ndGg7IGZpZWxkTnVtKyspIHtcclxuICAgICAgICAgICAgICAgIGJhdGNoICs9IFwiPEZpZWxkIE5hbWU9J1wiICsgb3B0LnZhbHVlcGFpcnNbZmllbGROdW1dWzBdICsgXCInPlwiICsgdXRpbHMuZXNjYXBlQ29sdW1uVmFsdWUob3B0LnZhbHVlcGFpcnNbZmllbGROdW1dWzFdKSArIFwiPC9GaWVsZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjxGaWVsZCBOYW1lPSdJRCc+XCIgKyBpdGVtc1RvVXBkYXRlW2ldICsgXCI8L0ZpZWxkPlwiO1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnRzVG9VcGRhdGVbaV0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgYmF0Y2ggKz0gXCI8RmllbGQgTmFtZT0nRmlsZVJlZic+XCIgKyBkb2N1bWVudHNUb1VwZGF0ZVtpXSArIFwiPC9GaWVsZD5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBiYXRjaCArPSBcIjwvTWV0aG9kPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBiYXRjaCArPSBcIjwvQmF0Y2g+XCI7XHJcblxyXG4gICAgICAgIC8vIENhbGwgVXBkYXRlTGlzdEl0ZW1zIHRvIHVwZGF0ZSBhbGwgb2YgdGhlIGl0ZW1zIG1hdGNoaW5nIHRoZSBDQU1MUXVlcnlcclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJVcGRhdGVMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQubGlzdE5hbWUsXHJcbiAgICAgICAgICAgIHVwZGF0ZXM6IGJhdGNoLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgcHJlc2VudCwgY2FsbCBjb21wbGV0ZWZ1bmMgd2hlbiBhbGwgZWxzZSBpcyBkb25lXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0LmNvbXBsZXRlZnVuYyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC5jb21wbGV0ZWZ1bmMoeERhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUFVwZGF0ZU11bHRpcGxlTGlzdEl0ZW1zXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFpbnRhaW5zIGEgc2V0IG9mIGNvbnN0YW50cyBmb3IgU1BTZXJ2aWNlcy5cclxuICAgICAqXHJcbiAgICAgKiBAbmFtZXNwYWNlIGNvbnN0YW50c1xyXG4gICAgICovXHJcblxyXG4gICAgdmFyIGNvbnN0YW50cyA9IHtcclxuXHJcbiAgICAgICAgLy8gVmVyc2lvbiBpbmZvXHJcbiAgICAgICAgVkVSU0lPTjogXCJAVkVSU0lPTlwiLCAvLyB1cGRhdGUgaXQgaW4gcGFja2FnZS5qc29uLi4uIGJ1aWxkIHRha2VzIGNhcmUgb2YgdGhlIHJlc3RcclxuXHJcbiAgICAgICAgLy8gU2ltcGxlIHN0cmluZ3NcclxuICAgICAgICBzcERlbGltOiBcIjsjXCIsXHJcbiAgICAgICAgU0xBU0g6IFwiL1wiLFxyXG4gICAgICAgIFRYVENvbHVtbk5vdEZvdW5kOiBcIkNvbHVtbiBub3QgZm91bmQgb24gcGFnZVwiLFxyXG5cclxuICAgICAgICAvLyBTdHJpbmcgY29uc3RhbnRzXHJcbiAgICAgICAgLy8gICBHZW5lcmFsXHJcbiAgICAgICAgU0NIRU1BU2hhcmVQb2ludDogXCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3NoYXJlcG9pbnRcIixcclxuICAgICAgICBTQ0hFTUFOaW50ZXg6IFwiaHR0cDovL25pbnRleC5jb21cIixcclxuICAgICAgICBtdWx0aUxvb2t1cFByZWZpeDogXCJNdWx0aUxvb2t1cFBpY2tlclwiLFxyXG4gICAgICAgIG11bHRpTG9va3VwUHJlZml4MjAxMzogXCJNdWx0aUxvb2t1cFwiLFxyXG5cclxuICAgICAgICAvLyBEcm9wZG93biBUeXBlc1xyXG4gICAgICAgIGRyb3Bkb3duVHlwZToge1xyXG4gICAgICAgICAgICBzaW1wbGU6IFwiU1wiLFxyXG4gICAgICAgICAgICBjb21wbGV4OiBcIkNcIixcclxuICAgICAgICAgICAgbXVsdGlTZWxlY3Q6IFwiTVwiXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gS25vd24gbGlzdCBmaWVsZCB0eXBlcyAtIFNlZTogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L29mZmljZS9taWNyb3NvZnQuc2hhcmVwb2ludC5zcGZpZWxkdHlwZSh2PW9mZmljZS4xNSkuYXNweFxyXG4gICAgICAgIHNwTGlzdEZpZWxkVHlwZXM6IFtcclxuICAgICAgICAgICAgXCJJbnRlZ2VyXCIsXHJcbiAgICAgICAgICAgIFwiVGV4dFwiLFxyXG4gICAgICAgICAgICBcIk5vdGVcIixcclxuICAgICAgICAgICAgXCJEYXRlVGltZVwiLFxyXG4gICAgICAgICAgICBcIkNvdW50ZXJcIixcclxuICAgICAgICAgICAgXCJDaG9pY2VcIixcclxuICAgICAgICAgICAgXCJMb29rdXBcIixcclxuICAgICAgICAgICAgXCJCb29sZWFuXCIsXHJcbiAgICAgICAgICAgIFwiTnVtYmVyXCIsXHJcbiAgICAgICAgICAgIFwiQ3VycmVuY3lcIixcclxuICAgICAgICAgICAgXCJVUkxcIixcclxuLy8gICAgICAgIFwiQ29tcHV0ZWRcIiwgLy8gTkVXXHJcbi8vICAgICAgICBcIlRocmVhZGluZ1wiLCAvLyBORVdcclxuLy8gICAgICAgIFwiR3VpZFwiLCAvLyBORVdcclxuICAgICAgICAgICAgXCJNdWx0aUNob2ljZVwiLFxyXG4vLyAgICAgICAgXCJHcmlkQ2hvaWNlXCIsIC8vIE5FV1xyXG4gICAgICAgICAgICBcIkNhbGN1bGF0ZWRcIixcclxuICAgICAgICAgICAgXCJGaWxlXCIsXHJcbiAgICAgICAgICAgIFwiQXR0YWNobWVudHNcIixcclxuICAgICAgICAgICAgXCJVc2VyXCIsXHJcbiAgICAgICAgICAgIFwiUmVjdXJyZW5jZVwiLCAvLyBSZWN1cnJpbmcgZXZlbnQgaW5kaWNhdG9yIChib29sZWFuKSBbMCB8IDFdXHJcbi8vICAgICAgICBcIkNyb3NzUHJvamVjdExpbmtcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiTW9kU3RhdFwiLFxyXG4gICAgICAgICAgICBcIkNvbnRlbnRUeXBlSWRcIixcclxuLy8gICAgICAgIFwiUGFnZVNlcGFyYXRvclwiLCAvLyBORVdcclxuLy8gICAgICAgIFwiVGhyZWFkSW5kZXhcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiV29ya2Zsb3dTdGF0dXNcIiwgLy8gTkVXXHJcbiAgICAgICAgICAgIFwiQWxsRGF5RXZlbnRcIiwgLy8gQWxsIGRheSBldmVudCBpbmRpY2F0b3IgKGJvb2xlYW4pIFswIHwgMV1cclxuLy8gICAgICBcIldvcmtmbG93RXZlbnRUeXBlXCIsIC8vIE5FV1xyXG4vLyAgICAgICAgXCJHZW9sb2NhdGlvblwiLCAvLyBORVdcclxuLy8gICAgICAgIFwiT3V0Y29tZUNob2ljZVwiLCAvLyBORVdcclxuICAgICAgICAgICAgXCJSZWxhdGVkSXRlbXNcIiwgLy8gUmVsYXRlZCBJdGVtcyBpbiBhIFdvcmtmbG93IFRhc2tzIGxpc3RcclxuXHJcbiAgICAgICAgICAgIC8vIEFsc28gc2VlblxyXG4gICAgICAgICAgICBcIlVzZXJNdWx0aVwiLCAvLyBNdWx0aXNlbGVjdCB1c2Vyc1xyXG4gICAgICAgICAgICBcIkxvb2t1cE11bHRpXCIsIC8vIE11bHRpLXNlbGVjdCBsb29rdXBcclxuICAgICAgICAgICAgXCJkYXRldGltZVwiLCAvLyBDYWxjdWxhdGVkIGRhdGUvdGltZSByZXN1bHRcclxuICAgICAgICAgICAgXCJmbG9hdFwiLCAvLyBDYWxjdWxhdGVkIGZsb2F0XHJcbiAgICAgICAgICAgIFwiQ2FsY1wiIC8vIEdlbmVyYWwgY2FsY3VsYXRlZFxyXG4gICAgICAgIF1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBjb25zdGFudHM7XHJcblxyXG59KTtcclxuIixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBDb252ZXJ0IGEgSmF2YVNjcmlwdCBkYXRlIHRvIHRoZSBJU08gODYwMSBmb3JtYXQgcmVxdWlyZWQgYnkgU2hhcmVQb2ludCB0byB1cGRhdGUgbGlzdCBpdGVtc1xyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQQ29udmVydERhdGVUb0lTTyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBkYXRlVG9Db252ZXJ0OiBuZXcgRGF0ZSgpLCAvLyBUaGUgSmF2YVNjcmlwdCBkYXRlIHdlJ2QgbGlrZSB0byBjb252ZXJ0LiBJZiBubyBkYXRlIGlzIHBhc3NlZCwgdGhlIGZ1bmN0aW9uIHJldHVybnMgdGhlIGN1cnJlbnQgZGF0ZS90aW1lXHJcbiAgICAgICAgICAgIGRhdGVPZmZzZXQ6IFwiLTA1OjAwXCIgLy8gVGhlIHRpbWUgem9uZSBvZmZzZXQgcmVxdWVzdGVkLiBEZWZhdWx0IGlzIEVTVFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvL0dlbmVyYXRlIElTTyA4NjAxIGRhdGUvdGltZSBmb3JtYXR0ZWQgc3RyaW5nXHJcbiAgICAgICAgdmFyIHMgPSBcIlwiO1xyXG4gICAgICAgIHZhciBkID0gb3B0LmRhdGVUb0NvbnZlcnQ7XHJcbiAgICAgICAgcyArPSBkLmdldEZ1bGxZZWFyKCkgKyBcIi1cIjtcclxuICAgICAgICBzICs9IHV0aWxzLnBhZChkLmdldE1vbnRoKCkgKyAxKSArIFwiLVwiO1xyXG4gICAgICAgIHMgKz0gdXRpbHMucGFkKGQuZ2V0RGF0ZSgpKTtcclxuICAgICAgICBzICs9IFwiVFwiICsgdXRpbHMucGFkKGQuZ2V0SG91cnMoKSkgKyBcIjpcIjtcclxuICAgICAgICBzICs9IHV0aWxzLnBhZChkLmdldE1pbnV0ZXMoKSkgKyBcIjpcIjtcclxuICAgICAgICBzICs9IHV0aWxzLnBhZChkLmdldFNlY29uZHMoKSkgKyBcIlpcIiArIG9wdC5kYXRlT2Zmc2V0O1xyXG4gICAgICAgIC8vUmV0dXJuIHRoZSBJU084NjAxIGRhdGUgc3RyaW5nXHJcbiAgICAgICAgcmV0dXJuIHM7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUENvbnZlcnREYXRlVG9JU09cclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyBXZSBkb24ndCBuZWVkIGxvY2FsIHZhcmlhYmxlcyBmb3IgdGhlc2UgZGVwZW5kZW5jaWVzXHJcbiAgICAvLyBiZWNhdXNlIHRoZXkgYXJlIGFkZGVkIHRvIHRoZSBqUXVlcnkgbmFtZXNwYWNlLlxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy5jb3JlLmpzJ1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkLFxyXG4gICAgdXRpbHNcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVXRpbGl0eSBmdW5jdGlvbiB0byBzaG93IHRoZSByZXN1bHRzIG9mIGEgV2ViIFNlcnZpY2UgY2FsbCBmb3JtYXR0ZWQgd2VsbCBpbiB0aGUgYnJvd3Nlci5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUERlYnVnWE1MSHR0cFJlc3VsdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBub2RlOiBudWxsLCAvLyBBbiBYTUxIdHRwUmVzdWx0IG9iamVjdCBmcm9tIGFuIGFqYXggY2FsbFxyXG4gICAgICAgICAgICBpbmRlbnQ6IDAgLy8gTnVtYmVyIG9mIGluZGVudHNcclxuICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIE5PREVfVEVYVCA9IDM7XHJcbiAgICAgICAgdmFyIE5PREVfQ0RBVEFfU0VDVElPTiA9IDQ7XHJcblxyXG4gICAgICAgIHZhciBvdXRTdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIC8vIEZvciBlYWNoIG5ldyBzdWJub2RlLCBiZWdpbiByZW5kZXJpbmcgYSBuZXcgVEFCTEVcclxuICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dGFibGUgY2xhc3M9J21zLXZiJyBzdHlsZT0nbWFyZ2luLWxlZnQ6XCIgKyBvcHQuaW5kZW50ICogMyArIFwicHg7JyB3aWR0aD0nMTAwJSc+XCI7XHJcbiAgICAgICAgLy8gRGlzcGxheVBhdHRlcm5zIGFyZSBhIGJpdCB1bmlxdWUsIHNvIGxldCdzIGhhbmRsZSB0aGVtIGRpZmZlcmVudGx5XHJcbiAgICAgICAgaWYgKG9wdC5ub2RlLm5vZGVOYW1lID09PSBcIkRpc3BsYXlQYXR0ZXJuXCIpIHtcclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCB3aWR0aD0nMTAwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+XCIgKyBvcHQubm9kZS5ub2RlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPjx0ZXh0YXJlYSByZWFkb25seT0ncmVhZG9ubHknIHJvd3M9JzUnIGNvbHM9JzUwJz5cIiArIG9wdC5ub2RlLnhtbCArIFwiPC90ZXh0YXJlYT48L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgIC8vIEEgbm9kZSB3aGljaCBoYXMgbm8gY2hpbGRyZW5cclxuICAgICAgICB9IGVsc2UgaWYgKCFvcHQubm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCB3aWR0aD0nMTAwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+XCIgKyBvcHQubm9kZS5ub2RlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICsgKChvcHQubm9kZS5ub2RlVmFsdWUgIT09IG51bGwpID8gdXRpbHMuY2hlY2tMaW5rKG9wdC5ub2RlLm5vZGVWYWx1ZSkgOiBcIiZuYnNwO1wiKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICBpZiAob3B0Lm5vZGUuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCBjb2xzcGFuPSc5OSc+XCIgKyB1dGlscy5zaG93QXR0cnMob3B0Lm5vZGUpICsgXCI8L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQSBDREFUQV9TRUNUSU9OIG5vZGVcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdC5ub2RlLmhhc0NoaWxkTm9kZXMoKSAmJiBvcHQubm9kZS5maXJzdENoaWxkLm5vZGVUeXBlID09PSBOT0RFX0NEQVRBX1NFQ1RJT04pIHtcclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCB3aWR0aD0nMTAwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOyc+XCIgKyBvcHQubm9kZS5ub2RlTmFtZSArXHJcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPjx0ZXh0YXJlYSByZWFkb25seT0ncmVhZG9ubHknIHJvd3M9JzUnIGNvbHM9JzUwJz5cIiArIG9wdC5ub2RlLnBhcmVudE5vZGUudGV4dCArIFwiPC90ZXh0YXJlYT48L3RkPjwvdHI+XCI7XHJcbiAgICAgICAgICAgIC8vIEEgVEVYVCBub2RlXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcHQubm9kZS5oYXNDaGlsZE5vZGVzKCkgJiYgb3B0Lm5vZGUuZmlyc3RDaGlsZC5ub2RlVHlwZSA9PT0gTk9ERV9URVhUKSB7XHJcbiAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj48dGQgd2lkdGg9JzEwMHB4JyBzdHlsZT0nZm9udC13ZWlnaHQ6Ym9sZDsnPlwiICsgb3B0Lm5vZGUubm9kZU5hbWUgK1xyXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZD5cIiArIHV0aWxzLmNoZWNrTGluayhvcHQubm9kZS5maXJzdENoaWxkLm5vZGVWYWx1ZSkgKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgLy8gSGFuZGxlIGNoaWxkIG5vZGVzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPHRyPjx0ZCB3aWR0aD0nMTAwcHgnIHN0eWxlPSdmb250LXdlaWdodDpib2xkOycgY29sc3Bhbj0nOTknPlwiICsgb3B0Lm5vZGUubm9kZU5hbWUgKyBcIjwvdGQ+PC90cj5cIjtcclxuICAgICAgICAgICAgaWYgKG9wdC5ub2RlLmF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgICAgICAgIG91dFN0cmluZyArPSBcIjx0cj48dGQgY29sc3Bhbj0nOTknPlwiICsgdXRpbHMuc2hvd0F0dHJzKG9wdC5ub2RlKSArIFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGhhcyBjaGlsZCBub2RlcywgcmVjdXJzZVxyXG4gICAgICAgICAgICBvdXRTdHJpbmcgKz0gXCI8dHI+PHRkPlwiO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb3B0Lm5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgb3V0U3RyaW5nICs9ICQoKS5TUFNlcnZpY2VzLlNQRGVidWdYTUxIdHRwUmVzdWx0KHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBvcHQubm9kZS5jaGlsZE5vZGVzLml0ZW0oaSksXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiBvcHQuaW5kZW50ICsgMVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0U3RyaW5nICs9IFwiPC90ZD48L3RyPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRTdHJpbmcgKz0gXCI8L3RhYmxlPlwiO1xyXG4gICAgICAgIC8vIFJldHVybiB0aGUgSFRNTCB3aGljaCB3ZSBoYXZlIGJ1aWx0IHVwXHJcbiAgICAgICAgcmV0dXJuIG91dFN0cmluZztcclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BEZWJ1Z1hNTEh0dHBSZXN1bHRcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICBcIi4uL3V0aWxzL2NvbnN0YW50c1wiLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICB1dGlscyxcclxuICAgIGNvbnN0YW50c1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGaW5kIGEgZHJvcGRvd24gKG9yIG11bHRpLXNlbGVjdCkgaW4gdGhlIERPTS4gUmV0dXJucyB0aGUgZHJvcGRvd24gb2JqZWN0IGFuZCBpdHMgdHlwZTpcclxuICAgIC8vIFMgPSBTaW1wbGUgKHNlbGVjdClcclxuICAgIC8vIEMgPSBDb21wb3VuZCAoaW5wdXQgKyBzZWxlY3QgaHlicmlkKVxyXG4gICAgLy8gTSA9IE11bHRpLXNlbGVjdCAoc2VsZWN0IGh5YnJpZClcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUERyb3Bkb3duQ3RsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIlwiIC8vIFRoZSBkaXNwbGF5TmFtZSBvZiB0aGUgY29sdW1uIG9uIHRoZSBmb3JtXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBjb2x1bW5PYmogPSB7fTtcclxuXHJcbi8vIFBhdWwgVC4sIDIwMTUuMDUuMDI6IENvbW1lbnRlZCBvdXQgc2luY2UgaXMgbm90IGN1cnJlbnRseSB1c2VkXHJcbiAgICAgICAgLy8gdmFyIGNvbFN0YXRpY05hbWUgPSAkKCkuU1BTZXJ2aWNlcy5TUEdldFN0YXRpY0Zyb21EaXNwbGF5KHtcclxuICAgICAgICAvLyBsaXN0TmFtZTogJCgpLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwoKSxcclxuICAgICAgICAvLyBjb2x1bW5EaXNwbGF5TmFtZTogb3B0LmRpc3BsYXlOYW1lXHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIC8vIFNpbXBsZSwgd2hlcmUgdGhlIHNlbGVjdCdzIHRpdGxlIGF0dHJpYnV0ZSBpcyBjb2xOYW1lIChEaXNwbGF5TmFtZSlcclxuICAgICAgICAvLyAgRXhhbXBsZXM6XHJcbiAgICAgICAgLy8gICAgICBTUDIwMTMgPHNlbGVjdCB0aXRsZT1cIkNvdW50cnlcIiBpZD1cIkNvdW50cnlfZDU3OGVkNjQtMmZhNy00YzFlLThiNDEtOWNjMWQ1MjRmYzI4XyRMb29rdXBGaWVsZFwiPlxyXG4gICAgICAgIC8vICAgICAgU1AyMDEwOiA8U0VMRUNUIG5hbWU9Y3RsMDAkbSRnX2QxMDQ3OWQ3XzY5NjVfNGRhMF9iMTYyXzUxMGJiYmM1OGE3ZiRjdGwwMCRjdGwwNSRjdGwwMSRjdGwwMCRjdGwwMCRjdGwwNCRjdGwwMCRMb29rdXAgdGl0bGU9Q291bnRyeSBpZD1jdGwwMF9tX2dfZDEwNDc5ZDdfNjk2NV80ZGEwX2IxNjJfNTEwYmJiYzU4YTdmX2N0bDAwX2N0bDA1X2N0bDAxX2N0bDAwX2N0bDAwX2N0bDA0X2N0bDAwX0xvb2t1cD5cclxuICAgICAgICAvLyAgICAgIFNQMjAwNzogPHNlbGVjdCBuYW1lPVwiY3RsMDAkbSRnX2U4NDVlNjkwXzAwZGFfNDI4Zl9hZmJkX2ZiZTgwNDc4Nzc2MyRjdGwwMCRjdGwwNCRjdGwwNCRjdGwwMCRjdGwwMCRjdGwwNCRjdGwwMCRMb29rdXBcIiBUaXRsZT1cIkNvdW50cnlcIiBpZD1cImN0bDAwX21fZ19lODQ1ZTY5MF8wMGRhXzQyOGZfYWZiZF9mYmU4MDQ3ODc3NjNfY3RsMDBfY3RsMDRfY3RsMDRfY3RsMDBfY3RsMDBfY3RsMDRfY3RsMDBfTG9va3VwXCI+XHJcbiAgICAgICAgaWYgKChjb2x1bW5PYmouT2JqID0gJChcInNlbGVjdFtUaXRsZT0nXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIiddXCIpKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTtcclxuICAgICAgICAgICAgLy8gQ29tcG91bmRcclxuICAgICAgICB9IGVsc2UgaWYgKChjb2x1bW5PYmouT2JqID0gJChcImlucHV0W1RpdGxlPSdcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuY29tcGxleDtcclxuICAgICAgICAgICAgLy8gU2ltcGxlLCB3aGVyZSB0aGUgc2VsZWN0J3MgaWQgYmVnaW5zIHdpdGggY29sU3RhdGljTmFtZSAoU3RhdGljTmFtZSkgLSBuZWVkZWQgZm9yIHJlcXVpcmVkIGNvbHVtbnMgd2hlcmUgdGl0bGU9XCJEaXNwbGF5TmFtZSBSZXF1aXJlZCBGaWVsZFwiXHJcbiAgICAgICAgICAgIC8vICAgRXhhbXBsZTogU1AyMDEzIDxzZWxlY3QgdGl0bGU9XCJSZWdpb24gUmVxdWlyZWQgRmllbGRcIiBpZD1cIlJlZ2lvbl81OTU2NmY2Zi0xYzNiLTRlZmItOWI3Yi02ZGJjMzVmZTNiMGFfJExvb2t1cEZpZWxkXCIgc2hvd3JlbGF0ZWRzZWxlY3RlZD1cIjNcIj5cclxuLy8gICAgICAgIH0gZWxzZSBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwic2VsZWN0OnJlZ2V4KGlkLCAoXCIgKyBjb2xTdGF0aWNOYW1lICsgXCIpKF8pWzAtOWEtZkEtRl17OH0oLSkpXCIpKS5sZW5ndGggPT09IDEpIHtcclxuLy8gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUuc2ltcGxlO1xyXG4gICAgICAgICAgICAvLyBNdWx0aS1zZWxlY3Q6IFRoaXMgd2lsbCBmaW5kIHRoZSBtdWx0aS1zZWxlY3QgY29sdW1uIGNvbnRyb2wgaW4gRW5nbGlzaCBhbmQgbW9zdCBvdGhlciBsYW5ndWFnZSBzaXRlcyB3aGVyZSB0aGUgVGl0bGUgbG9va3MgbGlrZSAnQ29sdW1uIE5hbWUgcG9zc2libGUgdmFsdWVzJ1xyXG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwic2VsZWN0W0lEJD0nU2VsZWN0Q2FuZGlkYXRlJ11bVGl0bGVePSdcIiArIG9wdC5kaXNwbGF5TmFtZSArIFwiICddXCIpKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0O1xyXG4gICAgICAgICAgICAvLyBNdWx0aS1zZWxlY3Q6IFRoaXMgd2lsbCBmaW5kIHRoZSBtdWx0aS1zZWxlY3QgY29sdW1uIGNvbnRyb2wgb24gYSBSdXNzaWFuIHNpdGUgKGFuZCBwZXJoYXBzIG90aGVycykgd2hlcmUgdGhlIFRpdGxlIGxvb2tzIGxpa2UgJz8/Pz8/Pz8/PyA/Pz8/Pz8/PzogQ29sdW1uIE5hbWUnXHJcbiAgICAgICAgfSBlbHNlIGlmICgoY29sdW1uT2JqLk9iaiA9ICQoXCJzZWxlY3RbSUQkPSdTZWxlY3RDYW5kaWRhdGUnXVtUaXRsZSQ9JzogXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIiddXCIpKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0O1xyXG4gICAgICAgICAgICAvLyBNdWx0aS1zZWxlY3Q6IFRoaXMgd2lsbCBmaW5kIHRoZSBtdWx0aS1zZWxlY3QgY29sdW1uIGNvbnRyb2wgb24gYSBHZXJtYW4gc2l0ZSAoYW5kIHBlcmhhcHMgb3RoZXJzKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwic2VsZWN0W0lEJD0nU2VsZWN0Q2FuZGlkYXRlJ11bVGl0bGUkPSdcXFwiXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIlxcXCIuJ11cIikpLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouVHlwZSA9IGNvbnN0YW50cy5kcm9wZG93blR5cGUubXVsdGlTZWxlY3Q7XHJcbiAgICAgICAgICAgIC8vIE11bHRpLXNlbGVjdDogVGhpcyB3aWxsIGZpbmQgdGhlIG11bHRpLXNlbGVjdCBjb2x1bW4gY29udHJvbCBvbiBhIEl0YWxpYW4gc2l0ZSAoYW5kIHBlcmhhcHMgb3RoZXJzKSB3aGVyZSB0aGUgVGl0bGUgbG9va3MgbGlrZSBcIlZhbG9yaSBwb3NzaWJpbGkgQ29sdW1uIG5hbWVcIlxyXG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbHVtbk9iai5PYmogPSAkKFwic2VsZWN0W0lEJD0nU2VsZWN0Q2FuZGlkYXRlJ11bVGl0bGUkPScgXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIiddXCIpKS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5UeXBlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIExhc3QgZGl0Y2ggZWZmb3J0XHJcbiAgICAgICAgLy8gU2ltcGxlLCBmaW5kaW5nIGJhc2VkIG9uIHRoZSBjb21tZW50IHRleHQgYXQgdGhlIHRvcCBvZiB0aGUgdGQubXMtZm9ybWJvZHkgd2hlcmUgdGhlIHNlbGVjdCdzIHRpdGxlIGJlZ2lucyB3aXRoIERpc3BsYXlOYW1lIC0gbmVlZGVkIGZvciByZXF1aXJlZCBjb2x1bW5zIHdoZXJlIHRpdGxlPVwiRGlzcGxheU5hbWUgUmVxdWlyZWQgRmllbGRcIlxyXG4gICAgICAgIC8vICAgRXhhbXBsZXM6IFNQMjAxMCA8c2VsZWN0IG5hbWU9XCJjdGwwMCRtJGdfMzA4MTM1ZjhfM2Y1OV80ZDY3X2I1ZjhfYzI2Nzc2YzQ5OGI3JGZmNTEkY3RsMDAkTG9va3VwXCIgaWQ9XCJjdGwwMF9tX2dfMzA4MTM1ZjhfM2Y1OV80ZDY3X2I1ZjhfYzI2Nzc2YzQ5OGI3X2ZmNTFfY3RsMDBfTG9va3VwXCIgdGl0bGU9XCJSZWdpb24gUmVxdWlyZWQgRmllbGRcIj5cclxuICAgICAgICAvLyAgICAgICAgICAgIFNQMjAxMyA8c2VsZWN0IGlkPVwiU29vcnRfeDAwMjBfbWVkaWNpam5fZGVkMTk5MzItMGI0Zi00ZDcxLWJjM2ItMmQ1MTBlNWYyOTdhXyRMb29rdXBGaWVsZFwiIHRpdGxlPVwiU29vcnQgbWVkaWNpam4gVmVyZWlzdCB2ZWxkXCI+XHJcbiAgICAgICAgaWYgKGNvbHVtbk9iai5UeXBlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWVsZENvbnRhaW5lciA9IHV0aWxzLmZpbmRGb3JtRmllbGQob3B0LmRpc3BsYXlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkQ29udGFpbmVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBmaWVsZFNlbGVjdDEgPSBmaWVsZENvbnRhaW5lci5maW5kKFwic2VsZWN0W3RpdGxlXj0nXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIiAnXVtpZCQ9J19Mb29rdXAnXVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWVsZFNlbGVjdDIgPSBmaWVsZENvbnRhaW5lci5maW5kKFwic2VsZWN0W3RpdGxlXj0nXCIgKyBvcHQuZGlzcGxheU5hbWUgKyBcIiAnXVtpZCQ9J0xvb2t1cEZpZWxkJ11cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmllbGRTZWxlY3QgPSBmaWVsZFNlbGVjdDEubGVuZ3RoID4gMCA/IGZpZWxkU2VsZWN0MSA6IGZpZWxkU2VsZWN0MjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRTZWxlY3QgJiYgZmllbGRTZWxlY3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uT2JqLlR5cGUgPSBjb25zdGFudHMuZHJvcGRvd25UeXBlLnNpbXBsZTtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5PYmouT2JqID0gZmllbGRTZWxlY3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb2x1bW5PYmouVHlwZSA9PT0gY29uc3RhbnRzLmRyb3Bkb3duVHlwZS5jb21wbGV4KSB7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5vcHRIaWQgPSAkKFwiaW5wdXRbaWQ9J1wiICsgY29sdW1uT2JqLk9iai5hdHRyKFwib3B0SGlkXCIpICsgXCInXVwiKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbHVtbk9iai5UeXBlID09PSBjb25zdGFudHMuZHJvcGRvd25UeXBlLm11bHRpU2VsZWN0KSB7XHJcbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIGltcG9ydGFudCBiaXRzIG9mIHRoZSBtdWx0aXNlbGVjdCBjb250cm9sXHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5jb250YWluZXIgPSBjb2x1bW5PYmouT2JqLmNsb3Nlc3QoXCJzcGFuXCIpO1xyXG4gICAgICAgICAgICBjb2x1bW5PYmouTXVsdGlMb29rdXBQaWNrZXJkYXRhID0gY29sdW1uT2JqLmNvbnRhaW5lci5maW5kKFwiaW5wdXRbaWQkPSdcIiArIHV0aWxzLm11bHRpTG9va3VwUHJlZml4ICsgXCJfZGF0YSddLCBpbnB1dFtpZCQ9J1wiICsgdXRpbHMubXVsdGlMb29rdXBQcmVmaXgyMDEzICsgXCJfZGF0YSddXCIpO1xyXG4gICAgICAgICAgICB2YXIgYWRkQnV0dG9uSWQgPSBjb2x1bW5PYmouY29udGFpbmVyLmZpbmQoXCJbaWQkPSdBZGRCdXR0b24nXVwiKS5hdHRyKFwiaWRcIik7XHJcbiAgICAgICAgICAgIGNvbHVtbk9iai5tYXN0ZXIgPVxyXG4gICAgICAgICAgICAgICAgd2luZG93W2FkZEJ1dHRvbklkLnJlcGxhY2UoL0FkZEJ1dHRvbi8sIGNvbnN0YW50cy5tdWx0aUxvb2t1cFByZWZpeCArIFwiX21cIildIHx8IC8vIFNoYXJlUG9pbnQgMjAwN1xyXG4gICAgICAgICAgICAgICAgd2luZG93W2FkZEJ1dHRvbklkLnJlcGxhY2UoL0FkZEJ1dHRvbi8sIGNvbnN0YW50cy5tdWx0aUxvb2t1cFByZWZpeDIwMTMgKyBcIl9tXCIpXTsgLy8gU2hhcmVQb2ludCAyMDEzXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29sdW1uT2JqO1xyXG5cclxuICAgIH07IC8vIEVuZCBvZiBmdW5jdGlvbiAkLmZuLlNQU2VydmljZXMuU1BEcm9wZG93bkN0bFxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJFxyXG4pIHtcclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIFRoaXMgbWV0aG9kIGZvciBmaW5kaW5nIHNwZWNpZmljIG5vZGVzIGluIHRoZSByZXR1cm5lZCBYTUwgd2FzIGRldmVsb3BlZCBieSBTdGV2ZSBXb3JrbWFuLiBTZWUgaGlzIGJsb2cgcG9zdFxyXG4gICAgLy8gaHR0cDovL3d3dy5zdGV2ZXdvcmttYW4uY29tL2h0bWw1LTIvamF2YXNjcmlwdC8yMDExL2ltcHJvdmluZy1qYXZhc2NyaXB0LXhtbC1ub2RlLWZpbmRpbmctcGVyZm9ybWFuY2UtYnktMjAwMC9cclxuICAgIC8vIGZvciBwZXJmb3JtYW5jZSBkZXRhaWxzLlxyXG4gICAgJC5mbi5TUEZpbHRlck5vZGUgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmQoJyonKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlTmFtZSA9PT0gbmFtZTtcclxuICAgICAgICB9KTtcclxuICAgIH07IC8vIEVuZCAkLmZuLlNQRmlsdGVyTm9kZVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICB2YXIgU1BTZXJ2aWNlcyA9IHdpbmRvdy5TUFNlcnZpY2VzIHx8IHt9O1xyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHRvIGRldGVybWluZSB0aGUgY3VycmVudCBXZWIncyBVUkwuICBXZSBuZWVkIHRoaXMgZm9yIHN1Y2Nlc3NmdWwgQWpheCBjYWxscy5cclxuICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBhbHNvIGF2YWlsYWJsZSBhcyBhIHB1YmxpYyBmdW5jdGlvbi5cclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRTaXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB2YXIgY3VycmVudENvbnRleHQgPSB1dGlscy5TUFNlcnZpY2VzQ29udGV4dCgpO1xyXG5cclxuICAgICAgICAvLyBXZSd2ZSBhbHJlYWR5IGRldGVybWluZWQgdGhlIGN1cnJlbnQgc2l0ZS4uLlxyXG4gICAgICAgIGlmIChjdXJyZW50Q29udGV4dC50aGlzU2l0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Q29udGV4dC50aGlzU2l0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHdlIHN0aWxsIGRvbid0IGtub3cgdGhlIGN1cnJlbnQgc2l0ZSwgd2UgY2FsbCBXZWJVcmxGcm9tUGFnZVVybFJlc3VsdC5cclxuICAgICAgICB2YXIgbXNnID0gU1BTZXJ2aWNlcy5TT0FQRW52ZWxvcGUuaGVhZGVyICtcclxuICAgICAgICAgICAgXCI8V2ViVXJsRnJvbVBhZ2VVcmwgeG1sbnM9J1wiICsgY29uc3RhbnRzLlNDSEVNQVNoYXJlUG9pbnQgKyBcIi9zb2FwLycgPjxwYWdlVXJsPlwiICtcclxuICAgICAgICAgICAgKChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpID4gMCkgPyBsb2NhdGlvbi5ocmVmLnN1YnN0cigwLCBsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCI/XCIpKSA6IGxvY2F0aW9uLmhyZWYpICtcclxuICAgICAgICAgICAgXCI8L3BhZ2VVcmw+PC9XZWJVcmxGcm9tUGFnZVVybD5cIiArXHJcbiAgICAgICAgICAgIFNQU2VydmljZXMuU09BUEVudmVsb3BlLmZvb3RlcjtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgdXJsOiBcIi9fdnRpX2Jpbi9XZWJzLmFzbXhcIixcclxuICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IG1zZyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwieG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcInRleHQveG1sO2NoYXJzZXQ9XFxcInV0Zi04XFxcIlwiLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50Q29udGV4dC50aGlzU2l0ZSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJXZWJVcmxGcm9tUGFnZVVybFJlc3VsdFwiKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRDb250ZXh0LnRoaXNTaXRlOyAvLyBSZXR1cm4gdGhlIFVSTFxyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BHZXRDdXJyZW50U2l0ZVxyXG5cclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL2NvcmUvU1BTZXJ2aWNlcy51dGlscycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIHV0aWxzXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlIGFjY291bnQgbmFtZSBmb3IgdGhlIGN1cnJlbnQgdXNlciBpbiBET01BSU5cXHVzZXJuYW1lIGZvcm1hdFxyXG4gICAgJC5mbi5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFVzZXIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBVUkwgb2YgdGhlIHRhcmdldCBTaXRlIENvbGxlY3Rpb24uICBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgY3VycmVudCBXZWIgaXMgdXNlZC5cclxuICAgICAgICAgICAgZmllbGROYW1lOiBcIk5hbWVcIiwgLy8gU3BlY2lmaWVzIHdoaWNoIGZpZWxkIHRvIHJldHVybiBmcm9tIHRoZSB1c2VyZGlzcC5hc3B4IHBhZ2VcclxuICAgICAgICAgICAgZmllbGROYW1lczoge30sIC8vIFNwZWNpZmllcyB3aGljaCBmaWVsZHMgdG8gcmV0dXJuIGZyb20gdGhlIHVzZXJkaXNwLmFzcHggcGFnZSAtIGFkZGVkIGluIHYwLjcuMiB0byBhbGxvdyBtdWx0aXBsZSBjb2x1bW5zXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzOyBpZiBmYWxzZSwgcnVuIHNpbGVudFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgY3VycmVudENvbnRleHQgPSB1dGlscy5TUFNlcnZpY2VzQ29udGV4dCgpO1xyXG5cclxuICAgICAgICAvLyBUaGUgY3VycmVudCB1c2VyJ3MgSUQgaXMgcmVsaWFibHkgYXZhaWxhYmxlIGluIGFuIGV4aXN0aW5nIEphdmFTY3JpcHQgdmFyaWFibGVcclxuICAgICAgICBpZiAob3B0LmZpZWxkTmFtZSA9PT0gXCJJRFwiICYmIHR5cGVvZiBjdXJyZW50Q29udGV4dC50aGlzVXNlcklkICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Q29udGV4dC50aGlzVXNlcklkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHRoaXNGaWVsZCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIHRoZXNlRmllbGRzID0ge307XHJcbiAgICAgICAgdmFyIGZpZWxkQ291bnQgPSBvcHQuZmllbGROYW1lcy5sZW5ndGggPiAwID8gb3B0LmZpZWxkTmFtZXMubGVuZ3RoIDogMTtcclxuICAgICAgICB2YXIgdGhpc1VzZXJEaXNwO1xyXG4gICAgICAgIHZhciB0aGlzV2ViID0gb3B0LndlYlVSTC5sZW5ndGggPiAwID8gb3B0LndlYlVSTCA6ICQoKS5TUFNlcnZpY2VzLlNQR2V0Q3VycmVudFNpdGUoKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBVc2VyRGlzcC5hc3B4IHBhZ2UgdXNpbmcgQUpBWFxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIC8vIE5lZWQgdGhpcyB0byBiZSBzeW5jaHJvbm91cyBzbyB3ZSdyZSBhc3N1cmVkIG9mIGEgdmFsaWQgdmFsdWVcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyBGb3JjZSBwYXJhbWV0ZXIgZm9yY2VzIHJlZGlyZWN0aW9uIHRvIGEgcGFnZSB0aGF0IGRpc3BsYXlzIHRoZSBpbmZvcm1hdGlvbiBhcyBzdG9yZWQgaW4gdGhlIFVzZXJJbmZvIHRhYmxlIHJhdGhlciB0aGFuIE15IFNpdGUuXHJcbiAgICAgICAgICAgIC8vIEFkZGluZyB0aGUgZXh0cmEgUXVlcnkgU3RyaW5nIHBhcmFtZXRlciB3aXRoIHRoZSBjdXJyZW50IGRhdGUvdGltZSBmb3JjZXMgdGhlIHNlcnZlciB0byB2aWV3IHRoaXMgYXMgYSBuZXcgcmVxdWVzdC5cclxuICAgICAgICAgICAgdXJsOiAoKHRoaXNXZWIgPT09IFwiL1wiKSA/IFwiXCIgOiB0aGlzV2ViKSArIFwiL19sYXlvdXRzL3VzZXJkaXNwLmFzcHg/Rm9yY2U9VHJ1ZSZcIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzVXNlckRpc3AgPSB4RGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkQ291bnQ7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgdXNlcidzIElEIGlzIHJlbGlhYmx5IGF2YWlsYWJsZSBpbiBhbiBleGlzdGluZyBKYXZhU2NyaXB0IHZhcmlhYmxlXHJcbiAgICAgICAgICAgIGlmIChvcHQuZmllbGROYW1lc1tpXSA9PT0gXCJJRFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSBjdXJyZW50Q29udGV4dC50aGlzVXNlcklkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNUZXh0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRDb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzVGV4dFZhbHVlID0gUmVnRXhwKFwiRmllbGRJbnRlcm5hbE5hbWU9XFxcIlwiICsgb3B0LmZpZWxkTmFtZXNbaV0gKyBcIlxcXCJcIiwgXCJnaVwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1RleHRWYWx1ZSA9IFJlZ0V4cChcIkZpZWxkSW50ZXJuYWxOYW1lPVxcXCJcIiArIG9wdC5maWVsZE5hbWUgKyBcIlxcXCJcIiwgXCJnaVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQodGhpc1VzZXJEaXNwLnJlc3BvbnNlVGV4dCkuZmluZChcInRhYmxlLm1zLWZvcm10YWJsZSB0ZFtpZF49J1NQRmllbGQnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpc1RleHRWYWx1ZS50ZXN0KCQodGhpcykuaHRtbCgpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFYWNoIGZpZWxkdHlwZSBjb250YWlucyBhIGRpZmZlcmVudCBkYXRhIHR5cGUsIGFzIGluZGljYXRlZCBieSB0aGUgaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICgkKHRoaXMpLmF0dHIoXCJpZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNQRmllbGRUZXh0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0ZpZWxkID0gJCh0aGlzKS50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1BGaWVsZE5vdGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSAkKHRoaXMpLmZpbmQoXCJkaXZcIikuaHRtbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlNQRmllbGRVUkxcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSAkKHRoaXMpLmZpbmQoXCJpbWdcIikuYXR0cihcInNyY1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEp1c3QgaW4gY2FzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSAkKHRoaXMpLnRleHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdG9wIGxvb2tpbmc7IHdlJ3JlIGRvbmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHQuZmllbGROYW1lc1tpXSAhPT0gXCJJRFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzRmllbGQgPSAodHlwZW9mIHRoaXNGaWVsZCAhPT0gXCJ1bmRlZmluZWRcIikgPyB0aGlzRmllbGQucmVwbGFjZSgvKF5bXFxzXFx4QTBdK3xbXFxzXFx4QTBdKyQpL2csICcnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpZWxkQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGVzZUZpZWxkc1tvcHQuZmllbGROYW1lc1tpXV0gPSB0aGlzRmllbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAoZmllbGRDb3VudCA+IDEpID8gdGhlc2VGaWVsZHMgOiB0aGlzRmllbGQ7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldEN1cnJlbnRVc2VyXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICRcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBEaXNwbGF5TmFtZSBmb3IgYSBjb2x1bW4gYmFzZWQgb24gdGhlIFN0YXRpY05hbWUuXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BHZXREaXNwbGF5RnJvbVN0YXRpYyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIG5hbWUgb3IgR1VJRCBvZiB0aGUgbGlzdFxyXG4gICAgICAgICAgICBjb2x1bW5TdGF0aWNOYW1lOiBcIlwiLCAvLyBTdGF0aWNOYW1lIG9mIHRoZSBjb2x1bW5cclxuICAgICAgICAgICAgY29sdW1uU3RhdGljTmFtZXM6IHt9IC8vIFN0YXRpY05hbWUgb2YgdGhlIGNvbHVtbnMgLSBhZGRlZCBpbiB2MC43LjIgdG8gYWxsb3cgbXVsdGlwbGUgY29sdW1uc1xyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgZGlzcGxheU5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHZhciBkaXNwbGF5TmFtZXMgPSB7fTtcclxuICAgICAgICB2YXIgbmFtZUNvdW50ID0gb3B0LmNvbHVtblN0YXRpY05hbWVzLmxlbmd0aCA+IDAgPyBvcHQuY29sdW1uU3RhdGljTmFtZXMubGVuZ3RoIDogMTtcclxuXHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGNhY2hlWE1MOiB0cnVlLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQubGlzdE5hbWUsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlZnVuYzogZnVuY3Rpb24gKHhEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmFtZUNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZUNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWVzW29wdC5jb2x1bW5TdGF0aWNOYW1lc1tpXV0gPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRbU3RhdGljTmFtZT0nXCIgKyBvcHQuY29sdW1uU3RhdGljTmFtZXNbaV0gKyBcIiddXCIpLmF0dHIoXCJEaXNwbGF5TmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lID0gJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIkZpZWxkW1N0YXRpY05hbWU9J1wiICsgb3B0LmNvbHVtblN0YXRpY05hbWUgKyBcIiddXCIpLmF0dHIoXCJEaXNwbGF5TmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gKG5hbWVDb3VudCA+IDEpID8gZGlzcGxheU5hbWVzIDogZGlzcGxheU5hbWU7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldERpc3BsYXlGcm9tU3RhdGljXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJFxyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBGdW5jdGlvbiB0byByZXR1cm4gdGhlIElEIG9mIHRoZSBsYXN0IGl0ZW0gY3JlYXRlZCBvbiBhIGxpc3QgYnkgYSBzcGVjaWZpYyB1c2VyLiBVc2VmdWwgZm9yIG1haW50YWluaW5nIHBhcmVudC9jaGlsZCByZWxhdGlvbnNoaXBzXHJcbiAgICAvLyBiZXR3ZWVuIGxpc3QgZm9ybXNcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldExhc3RJdGVtSWQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgd2ViVVJMOiBcIlwiLCAvLyBVUkwgb2YgdGhlIHRhcmdldCBXZWIuICBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgY3VycmVudCBXZWIgaXMgdXNlZC5cclxuICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIsIC8vIFRoZSBuYW1lIG9yIEdVSUQgb2YgdGhlIGxpc3RcclxuICAgICAgICAgICAgdXNlckFjY291bnQ6IFwiXCIsIC8vIFRoZSBhY2NvdW50IGZvciB0aGUgdXNlciBpbiBET01BSU5cXHVzZXJuYW1lIGZvcm1hdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgdXNlciBpcyB1c2VkLlxyXG4gICAgICAgICAgICBDQU1MUXVlcnk6IFwiXCIgLy8gW09wdGlvbmFsXSBGb3IgcG93ZXIgdXNlcnMsIHRoaXMgQ0FNTCBmcmFnbWVudCB3aWxsIGJlIEFuZGVkIHdpdGggdGhlIGRlZmF1bHQgcXVlcnkgb24gdGhlIHJlbGF0ZWRMaXN0XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciB1c2VySWQ7XHJcbiAgICAgICAgdmFyIGxhc3RJZCA9IDA7XHJcbiAgICAgICAgJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0VXNlckluZm9cIixcclxuICAgICAgICAgICAgd2ViVVJMOiBvcHQud2ViVVJMLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIHVzZXJMb2dpbk5hbWU6IChvcHQudXNlckFjY291bnQgIT09IFwiXCIpID8gb3B0LnVzZXJBY2NvdW50IDogJCgpLlNQU2VydmljZXMuU1BHZXRDdXJyZW50VXNlcigpLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuZmluZChcIlVzZXJcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gJCh0aGlzKS5hdHRyKFwiSURcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGxpc3QgaXRlbXMgZm9yIHRoZSB1c2VyLCBzb3J0ZWQgYnkgQ3JlYXRlZCwgZGVzY2VuZGluZy4gSWYgdGhlIENBTUxRdWVyeSBvcHRpb24gaGFzIGJlZW4gc3BlY2lmaWVkLCBBbmQgaXQgd2l0aFxyXG4gICAgICAgIC8vIHRoZSBleGlzdGluZyBXaGVyZSBjbGF1c2VcclxuICAgICAgICB2YXIgY2FtbFF1ZXJ5ID0gXCI8UXVlcnk+PFdoZXJlPlwiO1xyXG4gICAgICAgIGlmIChvcHQuQ0FNTFF1ZXJ5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEFuZD5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FtbFF1ZXJ5ICs9IFwiPEVxPjxGaWVsZFJlZiBOYW1lPSdBdXRob3InIExvb2t1cElkPSdUUlVFJy8+PFZhbHVlIFR5cGU9J0ludGVnZXInPlwiICsgdXNlcklkICsgXCI8L1ZhbHVlPjwvRXE+XCI7XHJcbiAgICAgICAgaWYgKG9wdC5DQU1MUXVlcnkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjYW1sUXVlcnkgKz0gb3B0LkNBTUxRdWVyeSArIFwiPC9BbmQ+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbWxRdWVyeSArPSBcIjwvV2hlcmU+PE9yZGVyQnk+PEZpZWxkUmVmIE5hbWU9J0NyZWF0ZWRfeDAwMjBfRGF0ZScgQXNjZW5kaW5nPSdGQUxTRScvPjwvT3JkZXJCeT48L1F1ZXJ5PlwiO1xyXG5cclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0SXRlbXNcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQubGlzdE5hbWUsXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogY2FtbFF1ZXJ5LFxyXG4gICAgICAgICAgICBDQU1MVmlld0ZpZWxkczogXCI8Vmlld0ZpZWxkcz48RmllbGRSZWYgTmFtZT0nSUQnLz48L1ZpZXdGaWVsZHM+XCIsXHJcbiAgICAgICAgICAgIENBTUxSb3dMaW1pdDogMSxcclxuICAgICAgICAgICAgQ0FNTFF1ZXJ5T3B0aW9uczogXCI8UXVlcnlPcHRpb25zPjxWaWV3QXR0cmlidXRlcyBTY29wZT0nUmVjdXJzaXZlJyAvPjwvUXVlcnlPcHRpb25zPlwiLFxyXG4gICAgICAgICAgICBjb21wbGV0ZWZ1bmM6IGZ1bmN0aW9uICh4RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCh4RGF0YS5yZXNwb25zZVhNTCkuU1BGaWx0ZXJOb2RlKFwiejpyb3dcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdElkID0gJCh0aGlzKS5hdHRyKFwib3dzX0lEXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGFzdElkO1xyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldExhc3RJdGVtSWRcclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pOyIsbnVsbCwiZGVmaW5lKFtcclxuICAgICdqcXVlcnknLFxyXG4gICAgJy4uL3V0aWxzL2NvbnN0YW50cycsXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gV2UgZG9uJ3QgbmVlZCBsb2NhbCB2YXJpYWJsZXMgZm9yIHRoZXNlIGRlcGVuZGVuY2llc1xyXG4gICAgLy8gYmVjYXVzZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgalF1ZXJ5IG5hbWVzcGFjZS5cclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMuY29yZSdcclxuXSwgZnVuY3Rpb24gKFxyXG4gICAgJCxcclxuICAgIGNvbnN0YW50c1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBTUEdldExpc3RJdGVtc0pzb24gcmV0cmlldmVzIGl0ZW1zIGZyb20gYSBsaXN0IGluIEpTT04gZm9ybWF0XHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BHZXRMaXN0SXRlbXNKc29uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHdlYlVSTDogXCJcIiwgLy8gW09wdGlvbmFsXSBVUkwgb2YgdGhlIHRhcmdldCBXZWIuICBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgY3VycmVudCBXZWIgaXMgdXNlZC5cclxuICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHZpZXdOYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBDQU1MUXVlcnk6IFwiXCIsXHJcbiAgICAgICAgICAgIENBTUxWaWV3RmllbGRzOiBcIlwiLFxyXG4gICAgICAgICAgICBDQU1MUm93TGltaXQ6IFwiXCIsXHJcbiAgICAgICAgICAgIENBTUxRdWVyeU9wdGlvbnM6IFwiXCIsXHJcbiAgICAgICAgICAgIGNoYW5nZVRva2VuOiBcIlwiLCAvLyBbT3B0aW9uYWxdIElmIHByb3ZpZGVkLCB3aWxsIGJlIHBhc3NlZCB3aXRoIHRoZSByZXF1ZXN0XHJcbiAgICAgICAgICAgIGNvbnRhaW5zOiBcIlwiLCAvLyBDQU1MIHNuaXBwZXQgZm9yIGFuIGFkZGl0aW9uYWwgZmlsdGVyXHJcbiAgICAgICAgICAgIG1hcHBpbmc6IG51bGwsIC8vIElmIHByb3ZpZGVkLCB1c2UgdGhpcyBtYXBwaW5nIHJhdGhlciB0aGFuIGNyZWF0aW5nIG9uZSBhdXRvbWFnaWNhbGx5IGZyb20gdGhlIGxpc3Qgc2NoZW1hXHJcbiAgICAgICAgICAgIG1hcHBpbmdPdmVycmlkZXM6IG51bGwsIC8vIFBhc3MgaW4gc3BlY2lmaWMgY29sdW1uIG92ZXJyaWRlcyBoZXJlXHJcbiAgICAgICAgICAgIGRlYnVnOiBmYWxzZSAvLyBJZiB0cnVlLCBzaG93IGVycm9yIG1lc3NhZ2VzO2lmIGZhbHNlLCBydW4gc2lsZW50XHJcbiAgICAgICAgfSwgJCgpLlNQU2VydmljZXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgbmV3Q2hhbmdlVG9rZW47XHJcbiAgICAgICAgdmFyIHRoaXNMaXN0SnNvbk1hcHBpbmcgPSB7fTtcclxuICAgICAgICB2YXIgZGVsZXRlZElkcyA9IFtdO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAkLkRlZmVycmVkKCk7XHJcblxyXG4gICAgICAgIC8vIENhbGwgR2V0TGlzdEl0ZW1zIHRvIGZpbmQgYWxsIG9mIHRoZSBpdGVtcyBtYXRjaGluZyB0aGUgQ0FNTFF1ZXJ5XHJcbiAgICAgICAgdmFyIHRoaXNEYXRhID0gJCgpLlNQU2VydmljZXMoe1xyXG4gICAgICAgICAgICBvcGVyYXRpb246IFwiR2V0TGlzdEl0ZW1DaGFuZ2VzU2luY2VUb2tlblwiLFxyXG4gICAgICAgICAgICB3ZWJVUkw6IG9wdC53ZWJVUkwsXHJcbiAgICAgICAgICAgIGxpc3ROYW1lOiBvcHQubGlzdE5hbWUsXHJcbiAgICAgICAgICAgIHZpZXdOYW1lOiBvcHQudmlld05hbWUsXHJcbiAgICAgICAgICAgIENBTUxRdWVyeTogb3B0LkNBTUxRdWVyeSxcclxuICAgICAgICAgICAgQ0FNTFZpZXdGaWVsZHM6IG9wdC5DQU1MVmlld0ZpZWxkcyxcclxuICAgICAgICAgICAgQ0FNTFJvd0xpbWl0OiBvcHQuQ0FNTFJvd0xpbWl0LFxyXG4gICAgICAgICAgICBDQU1MUXVlcnlPcHRpb25zOiBvcHQuQ0FNTFF1ZXJ5T3B0aW9ucyxcclxuICAgICAgICAgICAgY2hhbmdlVG9rZW46IG9wdC5jaGFuZ2VUb2tlbixcclxuICAgICAgICAgICAgY29udGFpbnM6IG9wdC5jb250YWluc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzRGF0YS50aGVuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXBwaW5nS2V5ID0gXCJTUEdldExpc3RJdGVtc0pzb25cIiArIG9wdC53ZWJVUkwgKyBvcHQubGlzdE5hbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBXZSdyZSBnb2luZyB0byB1c2UgdGhpcyBtdWx0aXBsZSB0aW1lc1xyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2VYbWwgPSAkKHRoaXNEYXRhLnJlc3BvbnNlWE1MKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgY2hhbmdlVG9rZW5cclxuICAgICAgICAgICAgbmV3Q2hhbmdlVG9rZW4gPSByZXNwb25zZVhtbC5maW5kKFwiQ2hhbmdlc1wiKS5hdHRyKFwiTGFzdENoYW5nZVRva2VuXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gU29tZSBvZiB0aGUgZXhpc3RpbmcgaXRlbXMgbWF5IGhhdmUgYmVlbiBkZWxldGVkXHJcbiAgICAgICAgICAgIHJlc3BvbnNlWG1sLmZpbmQoXCJsaXN0aXRlbXMgQ2hhbmdlcyBJZFtDaGFuZ2VUeXBlPSdEZWxldGUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZWRJZHMucHVzaCgkKHRoaXMpLnRleHQoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdC5tYXBwaW5nID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBdXRvbWFnaWNhbGx5IGNyZWF0ZSB0aGUgbWFwcGluZ1xyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VYbWwuZmluZChcIkxpc3QgPiBGaWVsZHMgPiBGaWVsZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc0ZpZWxkID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGhpc1R5cGUgPSB0aGlzRmllbGQuYXR0cihcIlR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSB3b3JrIHdpdGgga25vd24gY29sdW1uIHR5cGVzXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzVHlwZSwgY29uc3RhbnRzLnNwTGlzdEZpZWxkVHlwZXMpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0xpc3RKc29uTWFwcGluZ1tcIm93c19cIiArIHRoaXNGaWVsZC5hdHRyKFwiTmFtZVwiKV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBwZWROYW1lOiB0aGlzRmllbGQuYXR0cihcIk5hbWVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RUeXBlOiB0aGlzRmllbGQuYXR0cihcIlR5cGVcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpc0xpc3RKc29uTWFwcGluZyA9IG9wdC5tYXBwaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJbXBsZW1lbnQgYW55IG1hcHBpbmdPdmVycmlkZXNcclxuICAgICAgICAgICAgLy8gRXhhbXBsZTogeyBvd3NfSlNPTlRleHRDb2x1bW46IHsgbWFwcGVkTmFtZTogXCJKVENcIiwgb2JqZWN0VHlwZTogXCJKU09OXCIgfSB9XHJcbiAgICAgICAgICAgIGlmIChvcHQubWFwcGluZ092ZXJyaWRlcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRm9yIGVhY2ggbWFwcGluZ092ZXJyaWRlLCBvdmVycmlkZSB0aGUgbGlzdCBzY2hlbWFcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG1hcHBpbmcgaW4gb3B0Lm1hcHBpbmdPdmVycmlkZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzTGlzdEpzb25NYXBwaW5nW21hcHBpbmddID0gb3B0Lm1hcHBpbmdPdmVycmlkZXNbbWFwcGluZ107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmVuJ3QgcmV0cmlldmVkIHRoZSBsaXN0IHNjaGVtYSBpbiB0aGlzIGNhbGwsIHRyeSB0byBncmFiIGl0IGZyb20gdGhlIHNhdmVkIGRhdGEgZnJvbSBhIHByaW9yIGNhbGxcclxuICAgICAgICAgICAgaWYgKCQuaXNFbXB0eU9iamVjdCh0aGlzTGlzdEpzb25NYXBwaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpc0xpc3RKc29uTWFwcGluZyA9ICQoZG9jdW1lbnQpLmRhdGEobWFwcGluZ0tleSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5kYXRhKG1hcHBpbmdLZXksIHRoaXNMaXN0SnNvbk1hcHBpbmcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIganNvbkRhdGEgPSByZXNwb25zZVhtbC5TUEZpbHRlck5vZGUoXCJ6OnJvd1wiKS5TUFhtbFRvSnNvbih7XHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nOiB0aGlzTGlzdEpzb25NYXBwaW5nLFxyXG4gICAgICAgICAgICAgICAgc3BhcnNlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRoaXNSZXN1bHQgPSB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VUb2tlbjogbmV3Q2hhbmdlVG9rZW4sXHJcbiAgICAgICAgICAgICAgICBtYXBwaW5nOiB0aGlzTGlzdEpzb25NYXBwaW5nLFxyXG4gICAgICAgICAgICAgICAgZGF0YToganNvbkRhdGEsXHJcbiAgICAgICAgICAgICAgICBkZWxldGVkSWRzOiBkZWxldGVkSWRzXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXN1bHQucmVzb2x2ZVdpdGgodGhpc1Jlc3VsdCk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKGVycikgeyBcclxuICAgICAgICAgICAgcmVzdWx0LnJlamVjdFdpdGgoZXJyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlKCk7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldExpc3RJdGVtc0pzb25cclxuXHJcbiAgICByZXR1cm4gJDtcclxuXHJcbn0pO1xyXG4iLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5J1xyXG5dLCBmdW5jdGlvbiAoXHJcbiAgICAkXHJcbikge1xyXG5cclxuICAgIFwidXNlIHN0cmljdFwiO1xyXG5cclxuICAgIC8vIEdldCB0aGUgUXVlcnkgU3RyaW5nIHBhcmFtZXRlcnMgYW5kIHRoZWlyIHZhbHVlcyBhbmQgcmV0dXJuIGluIGFuIGFycmF5XHJcbiAgICAvLyBJbmNsdWRlcyBjb2RlIGZyb20gaHR0cDovL3d3dy5kZXZlbG9wZXJkcml2ZS5jb20vMjAxMy8wOC90dXJuaW5nLXRoZS1xdWVyeXN0cmluZy1pbnRvLWEtanNvbi1vYmplY3QtdXNpbmctamF2YXNjcmlwdC9cclxuICAgIC8vIFNpbXBsaWZpZWQgaW4gMjAxNC4wMSB1c2luZyB0aGlzIGNvZGVcclxuICAgICQuZm4uU1BTZXJ2aWNlcy5TUEdldFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHJcbiAgICAgICAgdmFyIG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIGxvd2VyY2FzZTogZmFsc2UgLy8gSWYgdHJ1ZSwgcGFyYW1ldGVyIG5hbWVzIHdpbGwgYmUgY29udmVydGVkIHRvIGxvd2VyY2FzZVxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgcXVlcnlTdHJpbmdWYWxzID0ge307XHJcblxyXG4gICAgICAgIHZhciBxcyA9IGxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKS5zcGxpdCgnJicpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHFzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbSA9IHFzW2ldLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbU5hbWUgPSBvcHQubG93ZXJjYXNlID8gcGFyYW1bMF0udG9Mb3dlckNhc2UoKSA6IHBhcmFtWzBdO1xyXG4gICAgICAgICAgICBxdWVyeVN0cmluZ1ZhbHNbcGFyYW1OYW1lXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbVsxXSB8fCBcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxdWVyeVN0cmluZ1ZhbHM7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUEdldFF1ZXJ5U3RyaW5nXHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiLG51bGwsImRlZmluZShbXHJcbiAgICAnanF1ZXJ5JyxcclxuICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICRcclxuKSB7XHJcblxyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4gICAgLy8gVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSBTdGF0aWNOYW1lIGZvciBhIGNvbHVtbiBiYXNlZCBvbiB0aGUgRGlzcGxheU5hbWUuXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BHZXRTdGF0aWNGcm9tRGlzcGxheSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcblxyXG4gICAgICAgIHZhciBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICB3ZWJVUkw6IFwiXCIsIC8vIFVSTCBvZiB0aGUgdGFyZ2V0IFdlYi4gIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IFdlYiBpcyB1c2VkLlxyXG4gICAgICAgICAgICBsaXN0TmFtZTogXCJcIiwgLy8gVGhlIG5hbWUgb3IgR1VJRCBvZiB0aGUgbGlzdFxyXG4gICAgICAgICAgICBjb2x1bW5EaXNwbGF5TmFtZTogXCJcIiwgLy8gRGlzcGxheU5hbWUgb2YgdGhlIGNvbHVtblxyXG4gICAgICAgICAgICBjb2x1bW5EaXNwbGF5TmFtZXM6IHt9IC8vIERpc3BsYXlOYW1lcyBvZiB0aGUgY29sdW1ucyAtIGFkZGVkIGluIHYwLjcuMiB0byBhbGxvdyBtdWx0aXBsZSBjb2x1bW5zXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBzdGF0aWNOYW1lID0gXCJcIjtcclxuICAgICAgICB2YXIgc3RhdGljTmFtZXMgPSB7fTtcclxuICAgICAgICB2YXIgbmFtZUNvdW50ID0gb3B0LmNvbHVtbkRpc3BsYXlOYW1lcy5sZW5ndGggPiAwID8gb3B0LmNvbHVtbkRpc3BsYXlOYW1lcy5sZW5ndGggOiAxO1xyXG5cclxuICAgICAgICAkKCkuU1BTZXJ2aWNlcyh7XHJcbiAgICAgICAgICAgIG9wZXJhdGlvbjogXCJHZXRMaXN0XCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FjaGVYTUw6IHRydWUsXHJcbiAgICAgICAgICAgIHdlYlVSTDogb3B0LndlYlVSTCxcclxuICAgICAgICAgICAgbGlzdE5hbWU6IG9wdC5saXN0TmFtZSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuYW1lQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNOYW1lc1tvcHQuY29sdW1uRGlzcGxheU5hbWVzW2ldXSA9ICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJGaWVsZFtEaXNwbGF5TmFtZT0nXCIgKyBvcHQuY29sdW1uRGlzcGxheU5hbWVzW2ldICsgXCInXVwiKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRpY05hbWUgPSAkKHhEYXRhLnJlc3BvbnNlWE1MKS5maW5kKFwiRmllbGRbRGlzcGxheU5hbWU9J1wiICsgb3B0LmNvbHVtbkRpc3BsYXlOYW1lICsgXCInXVwiKS5hdHRyKFwiU3RhdGljTmFtZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gKG5hbWVDb3VudCA+IDEpID8gc3RhdGljTmFtZXMgOiBzdGF0aWNOYW1lO1xyXG5cclxuICAgIH07IC8vIEVuZCAkLmZuLlNQU2VydmljZXMuU1BHZXRTdGF0aWNGcm9tRGlzcGxheVxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnLFxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIFdlIGRvbid0IG5lZWQgbG9jYWwgdmFyaWFibGVzIGZvciB0aGVzZSBkZXBlbmRlbmNpZXNcclxuICAgIC8vIGJlY2F1c2UgdGhleSBhcmUgYWRkZWQgdG8gdGhlIGpRdWVyeSBuYW1lc3BhY2UuXHJcbiAgICAnLi4vY29yZS9TUFNlcnZpY2VzLmNvcmUnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAkLmZuLlNQU2VydmljZXMuU1BMaXN0TmFtZUZyb21VcmwgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbGlzdE5hbWU6IFwiXCIgLy8gW09wdGlvbmFsXSBQYXNzIGluIHRoZSBuYW1lIG9yIEdVSUQgb2YgYSBsaXN0IGlmIHlvdSBhcmUgbm90IGluIGl0cyBjb250ZXh0LiBlLmcuLCBvbiBhIFdlYiBQYXJ0IHBhZ2VzIGluIHRoZSBQYWdlcyBsaWJyYXJ5XHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHZhciBjdXJyZW50Q29udGV4dCA9IHV0aWxzLlNQU2VydmljZXNDb250ZXh0KCk7XHJcblxyXG4gICAgICAgIC8vIEhhcyB0aGUgbGlzdCBuYW1lIG9yIEdVSUQgYmVlbiBwYXNzZWQgaW4/XHJcbiAgICAgICAgaWYgKG9wdC5saXN0TmFtZS5sZW5ndGggPiAwKSB7XHJcbi8vIFRPRE8gICAgICAgICAgICBjdXJyZW50Q29udGV4dCh7IGxpc3ROYW1lOiBvcHQubGlzdE5hbWUgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcHQubGlzdE5hbWU7XHJcbiAgICAgICAgICAgIC8vIERvIHdlIGFscmVhZHkga25vdyB0aGUgY3VycmVudCBsaXN0P1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudENvbnRleHQudGhpc0xpc3QgIT09IHVuZGVmaW5lZCAmJiBjdXJyZW50Q29udGV4dC50aGlzTGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Q29udGV4dC50aGlzTGlzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBhcnNlIG91dCB0aGUgbGlzdCdzIHJvb3QgVVJMIGZyb20gdGhlIGN1cnJlbnQgbG9jYXRpb24gb3IgdGhlIHBhc3NlZCB1cmxcclxuICAgICAgICB2YXIgdGhpc1BhZ2UgPSBsb2NhdGlvbi5ocmVmO1xyXG4gICAgICAgIHZhciB0aGlzUGFnZUJhc2VOYW1lID0gdGhpc1BhZ2Uuc3Vic3RyaW5nKDAsIHRoaXNQYWdlLmluZGV4T2YoXCIuYXNweFwiKSk7XHJcbiAgICAgICAgdmFyIGxpc3RQYXRoID0gZGVjb2RlVVJJQ29tcG9uZW50KHRoaXNQYWdlQmFzZU5hbWUuc3Vic3RyaW5nKDAsIHRoaXNQYWdlQmFzZU5hbWUubGFzdEluZGV4T2YoY29uc3RhbnRzLlNMQVNIKSArIDEpKS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICAgICAgICAvLyBDYWxsIEdldExpc3RDb2xsZWN0aW9uIGFuZCBsb29wIHRocm91Z2ggdGhlIHJlc3VsdHMgdG8gZmluZCBhIG1hdGNoIHdpdGggdGhlIGxpc3QncyBVUkwgdG8gZ2V0IHRoZSBsaXN0J3MgR1VJRFxyXG4gICAgICAgICQoKS5TUFNlcnZpY2VzKHtcclxuICAgICAgICAgICAgb3BlcmF0aW9uOiBcIkdldExpc3RDb2xsZWN0aW9uXCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgY29tcGxldGVmdW5jOiBmdW5jdGlvbiAoeERhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoeERhdGEucmVzcG9uc2VYTUwpLmZpbmQoXCJMaXN0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0Vmlld1VybCA9ICQodGhpcykuYXR0cihcIkRlZmF1bHRWaWV3VXJsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXN0Q29sbExpc3QgPSBkZWZhdWx0Vmlld1VybC5zdWJzdHJpbmcoMCwgZGVmYXVsdFZpZXdVcmwubGFzdEluZGV4T2YoY29uc3RhbnRzLlNMQVNIKSArIDEpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RQYXRoLmluZGV4T2YobGlzdENvbGxMaXN0KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudENvbnRleHQudGhpc0xpc3QgPSAkKHRoaXMpLmF0dHIoXCJJRFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFJldHVybiB0aGUgbGlzdCBHVUlEIChJRClcclxuICAgICAgICByZXR1cm4gY3VycmVudENvbnRleHQudGhpc0xpc3Q7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUExpc3ROYW1lRnJvbVVybFxyXG5cclxuICAgIHJldHVybiAkO1xyXG5cclxufSk7IixudWxsLCJkZWZpbmUoW1xyXG4gICAgJ2pxdWVyeScsXHJcbiAgICAnLi4vdXRpbHMvY29uc3RhbnRzJyxcclxuICAgICcuLi9jb3JlL1NQU2VydmljZXMudXRpbHMnXHJcbl0sIGZ1bmN0aW9uIChcclxuICAgICQsXHJcbiAgICBjb25zdGFudHMsXHJcbiAgICB1dGlsc1xyXG4pIHtcclxuXHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGNvbnZlcnRzIGFuIFhNTCBub2RlIHNldCB0byBKU09OXHJcbiAgICAvLyBJbml0aWFsIGltcGxlbWVudGF0aW9uIGZvY3VzZXMgb25seSBvbiBHZXRMaXN0SXRlbXNcclxuICAgICQuZm4uU1BYbWxUb0pzb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgbWFwcGluZzoge30sIC8vIGNvbHVtbk5hbWU6IG1hcHBlZE5hbWU6IFwibWFwcGVkTmFtZVwiLCBvYmplY3RUeXBlOiBcIm9iamVjdFR5cGVcIlxyXG4gICAgICAgICAgICBpbmNsdWRlQWxsQXR0cnM6IGZhbHNlLCAvLyBJZiB0cnVlLCByZXR1cm4gYWxsIGF0dHJpYnV0ZXMsIHJlZ2FyZGxlc3Mgd2hldGhlciB0aGV5IGFyZSBpbiB0aGUgbWFwcGluZ1xyXG4gICAgICAgICAgICByZW1vdmVPd3M6IHRydWUsIC8vIFNwZWNpZmljYWxseSBmb3IgR2V0TGlzdEl0ZW1zLCBpZiB0cnVlLCB0aGUgbGVhZGluZyBvd3NfIHdpbGwgYmUgc3RyaXBwZWQgb2ZmIHRoZSBmaWVsZCBuYW1lXHJcbiAgICAgICAgICAgIHNwYXJzZTogZmFsc2UgLy8gSWYgdHJ1ZSwgZW1wdHkgKFwiXCIpIHZhbHVlcyB3aWxsIG5vdCBiZSByZXR1cm5lZFxyXG4gICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgYXR0ck51bTtcclxuICAgICAgICB2YXIganNvbk9iamVjdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0ge307XHJcbiAgICAgICAgICAgIHZhciByb3dBdHRycyA9IHRoaXMuYXR0cmlidXRlcztcclxuXHJcbiAgICAgICAgICAgIGlmICghb3B0LnNwYXJzZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gQnJpbmcgYmFjayBhbGwgbWFwcGVkIGNvbHVtbnMsIGV2ZW4gdGhvc2Ugd2l0aCBubyB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKG9wdC5tYXBwaW5nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93W3RoaXMubWFwcGVkTmFtZV0gPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIHRocm91Z2ggdGhlIGVsZW1lbnQncyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGZvciAoYXR0ck51bSA9IDA7IGF0dHJOdW0gPCByb3dBdHRycy5sZW5ndGg7IGF0dHJOdW0rKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNBdHRyTmFtZSA9IHJvd0F0dHJzW2F0dHJOdW1dLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc01hcHBpbmcgPSBvcHQubWFwcGluZ1t0aGlzQXR0ck5hbWVdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNPYmplY3ROYW1lID0gdGhpc01hcHBpbmcgJiYgdGhpc01hcHBpbmcubWFwcGVkTmFtZSA/IHRoaXNNYXBwaW5nLm1hcHBlZE5hbWUgOiBvcHQucmVtb3ZlT3dzID8gdGhpc0F0dHJOYW1lLnNwbGl0KFwib3dzX1wiKVsxXSA6IHRoaXNBdHRyTmFtZTtcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzT2JqZWN0VHlwZSA9IHRoaXNNYXBwaW5nICE9PSB1bmRlZmluZWQgPyB0aGlzTWFwcGluZy5vYmplY3RUeXBlIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdC5pbmNsdWRlQWxsQXR0cnMgfHwgdGhpc01hcHBpbmcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvd1t0aGlzT2JqZWN0TmFtZV0gPSBhdHRyVG9Kc29uKHJvd0F0dHJzW2F0dHJOdW1dLnZhbHVlLCB0aGlzT2JqZWN0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUHVzaCB0aGlzIGl0ZW0gaW50byB0aGUgSlNPTiBPYmplY3RcclxuICAgICAgICAgICAganNvbk9iamVjdC5wdXNoKHJvdyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBSZXR1cm4gdGhlIEpTT04gb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIGpzb25PYmplY3Q7XHJcblxyXG4gICAgfTsgLy8gRW5kICQuZm4uU1BTZXJ2aWNlcy5TUFhtbFRvSnNvblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBhdHRyVG9Kc29uKHYsIG9iamVjdFR5cGUpIHtcclxuICAgICAgICBmdW5jdGlvbiBpZGVudGl0eSh4KSB7IHJldHVybiB4OyB9XHJcblxyXG4gICAgICAgIHZhciByZXN1bHQgPSB7XHJcblxyXG4gICAgICAgICAgICAvKiBHZW5lcmljIFtSZXVzYWJsZV0gRnVuY3Rpb25zICovXHJcbiAgICAgICAgICAgIFwiSW50ZWdlclwiOiBpbnRUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiTnVtYmVyXCI6IGZsb2F0VG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIkJvb2xlYW5cIjogYm9vbGVhblRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJEYXRlVGltZVwiOiBkYXRlVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIlVzZXJcIjogdXNlclRvSnNvbk9iamVjdCxcclxuICAgICAgICAgICAgXCJVc2VyTXVsdGlcIjogdXNlck11bHRpVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIkxvb2t1cFwiOiBsb29rdXBUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwibG9va3VwTXVsdGlcIjogbG9va3VwTXVsdGlUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiTXVsdGlDaG9pY2VcIjogY2hvaWNlTXVsdGlUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiQ2FsY3VsYXRlZFwiOiBjYWxjVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIkF0dGFjaG1lbnRzXCI6IGF0dGFjaG1lbnRzVG9Kc29uT2JqZWN0LFxyXG4gICAgICAgICAgICBcIlVSTFwiOiB1cmxUb0pzb25PYmplY3QsXHJcbiAgICAgICAgICAgIFwiSlNPTlwiOiBqc29uVG9Kc29uT2JqZWN0LCAvLyBTcGVjaWFsIGNhc2UgZm9yIHRleHQgSlNPTiBzdG9yZWQgaW4gdGV4dCBjb2x1bW5zXHJcblxyXG4gICAgICAgICAgICAvKiBUaGVzZSBvYmplY3RUeXBlcyByZXVzZSBhYm92ZSBmdW5jdGlvbnMgKi9cclxuICAgICAgICAgICAgXCJUZXh0XCI6IHJlc3VsdC5EZWZhdWx0LFxyXG4gICAgICAgICAgICBcIkNvdW50ZXJcIjogcmVzdWx0LkludGVnZXIsXHJcbiAgICAgICAgICAgIFwiZGF0ZXRpbWVcIjogcmVzdWx0LkRhdGVUaW1lLCAgICAvLyBGb3IgY2FsY3VsYXRlZCBjb2x1bW5zLCBzdG9yZWQgYXMgZGF0ZXRpbWU7I3ZhbHVlXHJcbiAgICAgICAgICAgIFwiQWxsRGF5RXZlbnRcIjogcmVzdWx0LkJvb2xlYW4sXHJcbiAgICAgICAgICAgIFwiUmVjdXJyZW5jZVwiOiByZXN1bHQuQm9vbGVhbixcclxuICAgICAgICAgICAgXCJDdXJyZW5jeVwiOiByZXN1bHQuTnVtYmVyLFxyXG4gICAgICAgICAgICBcImZsb2F0XCI6IHJlc3VsdC5OdW1iZXIsIC8vIEZvciBjYWxjdWxhdGVkIGNvbHVtbnMsIHN0b3JlZCBhcyBmbG9hdDsjdmFsdWVcclxuICAgICAgICAgICAgXCJSZWxhdGVkSXRlbXNcIjogcmVzdWx0LkpTT04sXHJcblxyXG4gICAgICAgICAgICBcIkRlZmF1bHRcIjogaWRlbnRpdHlcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKHJlc3VsdFtvYmplY3RUeXBlXSB8fCBpZGVudGl0eSkodik7XHJcblxyXG4vKlxyXG4gICAgICAgIHN3aXRjaCAob2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSBcIlRleHRcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gdjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGF0ZVRpbWVcIjpcclxuICAgICAgICAgICAgY2FzZSBcImRhdGV0aW1lXCI6IC8vIEZvciBjYWxjdWxhdGVkIGNvbHVtbnMsIHN0b3JlZCBhcyBkYXRldGltZTsjdmFsdWVcclxuICAgICAgICAgICAgICAgIC8vIERhdGVzIGhhdmUgZGFzaGVzIGluc3RlYWQgb2Ygc2xhc2hlczogb3dzX0NyZWF0ZWQ9XCIyMDA5LTA4LTI1IDE0OjI0OjQ4XCJcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gZGF0ZVRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiVXNlclwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSB1c2VyVG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJVc2VyTXVsdGlcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gdXNlck11bHRpVG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJMb29rdXBcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gbG9va3VwVG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiTG9va3VwTXVsdGlcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gbG9va3VwTXVsdGlUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkJvb2xlYW5cIjpcclxuICAgICAgICAgICAgY2FzZSBcIkFsbERheUV2ZW50XCI6XHJcbiAgICAgICAgICAgIGNhc2UgXCJSZWN1cnJlbmNlXCI6XHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IGJvb2xlYW5Ub0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJJbnRlZ2VyXCI6XHJcbiAgICAgICAgICAgICAgICBjb2xWYWx1ZSA9IGludFRvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBcIkNvdW50ZXJcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gaW50VG9Kc29uT2JqZWN0KHYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwiTXVsdGlDaG9pY2VcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gY2hvaWNlTXVsdGlUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIk51bWJlclwiOlxyXG4gICAgICAgICAgICBjYXNlIFwiQ3VycmVuY3lcIjpcclxuICAgICAgICAgICAgY2FzZSBcImZsb2F0XCI6IC8vIEZvciBjYWxjdWxhdGVkIGNvbHVtbnMsIHN0b3JlZCBhcyBmbG9hdDsjdmFsdWVcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gZmxvYXRUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkNhbGN1bGF0ZWRcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gY2FsY1RvSnNvbk9iamVjdCh2KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiQXR0YWNobWVudHNcIjpcclxuICAgICAgICAgICAgICAgIGNvbFZhbHVlID0gYXR0YWNobWVudHNUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlVSTFwiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSB1cmxUb0pzb25PYmplY3Qodik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkpTT05cIjpcclxuICAgICAgICAgICAgY2FzZSBcIlJlbGF0ZWRJdGVtc1wiOlxyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSBqc29uVG9Kc29uT2JqZWN0KHYpOyAvLyBTcGVjaWFsIGNhc2UgZm9yIHRleHQgSlNPTiBzdG9yZWQgaW4gdGV4dCBjb2x1bW5zXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAvLyBBbGwgb3RoZXIgb2JqZWN0VHlwZXMgd2lsbCBiZSBzaW1wbGUgc3RyaW5nc1xyXG4gICAgICAgICAgICAgICAgY29sVmFsdWUgPSB2O1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xWYWx1ZTtcclxuICovXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW50VG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQocywgMTApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZsb2F0VG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBib29sZWFuVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICByZXR1cm4gcyAhPT0gXCIwXCI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGF0ZVRvSnNvbk9iamVjdChzKSB7XHJcblxyXG4gICAgICAgIHZhciBkdCA9IHMuc3BsaXQoXCJUXCIpWzBdICE9PSBzID8gcy5zcGxpdChcIlRcIikgOiBzLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICB2YXIgZCA9IGR0WzBdLnNwbGl0KFwiLVwiKTtcclxuICAgICAgICB2YXIgdCA9IGR0WzFdLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICB2YXIgdDMgPSB0WzJdLnNwbGl0KFwiWlwiKTtcclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoZFswXSwgKGRbMV0gLSAxKSwgZFsyXSwgdFswXSwgdFsxXSwgdDNbMF0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVzZXJUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1VzZXIgPSBuZXcgdXRpbHMuU3BsaXRJbmRleChzKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNVc2VyRXhwYW5kZWQgPSB0aGlzVXNlci52YWx1ZS5zcGxpdChcIiwjXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpc1VzZXJFeHBhbmRlZC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzVXNlci5pZCxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZTogdGhpc1VzZXIudmFsdWVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpc1VzZXIuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlck5hbWU6IHRoaXNVc2VyRXhwYW5kZWRbMF0ucmVwbGFjZSgvKCwsKS9nLCBcIixcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgbG9naW5OYW1lOiB0aGlzVXNlckV4cGFuZGVkWzFdLnJlcGxhY2UoLygsLCkvZywgXCIsXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiB0aGlzVXNlckV4cGFuZGVkWzJdLnJlcGxhY2UoLygsLCkvZywgXCIsXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpcEFkZHJlc3M6IHRoaXNVc2VyRXhwYW5kZWRbM10ucmVwbGFjZSgvKCwsKS9nLCBcIixcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRoaXNVc2VyRXhwYW5kZWRbNF0ucmVwbGFjZSgvKCwsKS9nLCBcIixcIilcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXNlck11bHRpVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNVc2VyTXVsdGlPYmplY3QgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHRoaXNVc2VyTXVsdGkgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzVXNlck11bHRpLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc1VzZXIgPSB1c2VyVG9Kc29uT2JqZWN0KHRoaXNVc2VyTXVsdGlbaV0gKyBjb25zdGFudHMuc3BEZWxpbSArIHRoaXNVc2VyTXVsdGlbaSArIDFdKTtcclxuICAgICAgICAgICAgICAgIHRoaXNVc2VyTXVsdGlPYmplY3QucHVzaCh0aGlzVXNlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNVc2VyTXVsdGlPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvb2t1cFRvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzTG9va3VwID0gcy5zcGxpdChjb25zdGFudHMuc3BEZWxpbSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBsb29rdXBJZDogdGhpc0xvb2t1cFswXSxcclxuICAgICAgICAgICAgICAgIGxvb2t1cFZhbHVlOiB0aGlzTG9va3VwWzFdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvb2t1cE11bHRpVG9Kc29uT2JqZWN0KHMpIHtcclxuICAgICAgICBpZiAocy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNMb29rdXBNdWx0aU9iamVjdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgdGhpc0xvb2t1cE11bHRpID0gcy5zcGxpdChjb25zdGFudHMuc3BEZWxpbSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpc0xvb2t1cE11bHRpLmxlbmd0aDsgaSA9IGkgKyAyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc0xvb2t1cCA9IGxvb2t1cFRvSnNvbk9iamVjdCh0aGlzTG9va3VwTXVsdGlbaV0gKyBjb25zdGFudHMuc3BEZWxpbSArIHRoaXNMb29rdXBNdWx0aVtpICsgMV0pO1xyXG4gICAgICAgICAgICAgICAgdGhpc0xvb2t1cE11bHRpT2JqZWN0LnB1c2godGhpc0xvb2t1cCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNMb29rdXBNdWx0aU9iamVjdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2hvaWNlTXVsdGlUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0Nob2ljZU11bHRpT2JqZWN0ID0gW107XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ2hvaWNlTXVsdGkgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzQ2hvaWNlTXVsdGkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzQ2hvaWNlTXVsdGlbaV0ubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc0Nob2ljZU11bHRpT2JqZWN0LnB1c2godGhpc0Nob2ljZU11bHRpW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc0Nob2ljZU11bHRpT2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhdHRhY2htZW50c1RvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocyA9PT0gXCIwXCIgfHwgcyA9PT0gXCIxXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNPYmplY3QgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHRoaXNTdHJpbmcgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzU3RyaW5nLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1N0cmluZ1tpXS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmlsZU5hbWUgPSB0aGlzU3RyaW5nW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzU3RyaW5nW2ldLmxhc3RJbmRleE9mKFwiL1wiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VucyA9IHRoaXNTdHJpbmdbaV0uc3BsaXQoXCIvXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZSA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNPYmplY3QucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQ6IHRoaXNTdHJpbmdbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzT2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1cmxUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc1VybCA9IHMuc3BsaXQoXCIsIFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIFVybDogdGhpc1VybFswXSxcclxuICAgICAgICAgICAgICAgIERlc2NyaXB0aW9uOiB0aGlzVXJsWzFdXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNhbGNUb0pzb25PYmplY3Qocykge1xyXG4gICAgICAgIGlmIChzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGhpc0NhbGMgPSBzLnNwbGl0KGNvbnN0YW50cy5zcERlbGltKTtcclxuICAgICAgICAgICAgLy8gVGhlIGZpcnN0IHZhbHVlIHdpbGwgYmUgdGhlIGNhbGN1bGF0ZWQgY29sdW1uIHZhbHVlIHR5cGUsIHRoZSBzZWNvbmQgd2lsbCBiZSB0aGUgdmFsdWVcclxuICAgICAgICAgICAgcmV0dXJuIGF0dHJUb0pzb24odGhpc0NhbGNbMV0sIHRoaXNDYWxjWzBdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24ganNvblRvSnNvbk9iamVjdChzKSB7XHJcbiAgICAgICAgaWYgKHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkLnBhcnNlSlNPTihzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICQ7XHJcblxyXG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
