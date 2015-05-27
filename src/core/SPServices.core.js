/**
 * Original SPservices modules... Will be broken down into individual modules.
 */
define([
    "jquery",
    "../utils/SPServices.utils",
    "../utils/constants",
    "../utils/genContainerId"

], function (
    $,
    utils,
    constants,
    genContainerId

) {

    /* jshint undef: true */
    /* global L_Menu_BaseUrl, _spUserId, _spPageContextInfo */

    "use strict";

    // Caching
    var promisesCache = {};

    //   Web Service names
    var ALERTS = "Alerts";
    var AUTHENTICATION = "Authentication";
    var COPY = "Copy";
    var FORMS = "Forms";
    var LISTS = "Lists";
    var MEETINGS = "Meetings";
    var OFFICIALFILE = "OfficialFile";
    var PEOPLE = "People";
    var PERMISSIONS = "Permissions";
    var PUBLISHEDLINKSSERVICE = "PublishedLinksService";
    var SEARCH = "Search";
    var SHAREPOINTDIAGNOSTICS = "SharePointDiagnostics";
    var SITEDATA = "SiteData";
    var SITES = "Sites";
    var SOCIALDATASERVICE = "SocialDataService";
    var SPELLCHECK = "SpellCheck";
    var TAXONOMYSERVICE = "TaxonomyClientService";
    var USERGROUP = "usergroup";
    var USERPROFILESERVICE = "UserProfileService";
    var VERSIONS = "Versions";
    var VIEWS = "Views";
    var WEBPARTPAGES = "WebPartPages";
    var WEBS = "Webs";
    var WORKFLOW = "Workflow";

    // Global variables
    var currentContext = new SPServicesContext(); // Variable to hold the current context as we figure it out
    var i = 0; // Generic loop counter
    var encodeOptionList = ["listName", "description"]; // Used to encode options which may contain special characters


    // Array to store Web Service information
    //  WSops.OpName = [WebService, needs_SOAPAction];
    //      OpName              The name of the Web Service operation -> These names are unique
    //      WebService          The name of the WebService this operation belongs to
    //      needs_SOAPAction    Boolean indicating whether the operatio needs to have the SOAPAction passed in the setRequestHeaderfunction.
    //                          true if the operation does a write, else false

    var WSops = [];

    WSops.GetAlerts = [ALERTS, false];
    WSops.DeleteAlerts = [ALERTS, true];

    WSops.Mode = [AUTHENTICATION, false];
    WSops.Login = [AUTHENTICATION, false];

    WSops.CopyIntoItems = [COPY, true];
    WSops.CopyIntoItemsLocal = [COPY, true];
    WSops.GetItem = [COPY, false];

    WSops.GetForm = [FORMS, false];
    WSops.GetFormCollection = [FORMS, false];

    WSops.AddAttachment = [LISTS, true];
    WSops.AddDiscussionBoardItem = [LISTS, true];
    WSops.AddList = [LISTS, true];
    WSops.AddListFromFeature = [LISTS, true];
    WSops.ApplyContentTypeToList = [LISTS, true];
    WSops.CheckInFile = [LISTS, true];
    WSops.CheckOutFile = [LISTS, true];
    WSops.CreateContentType = [LISTS, true];
    WSops.DeleteAttachment = [LISTS, true];
    WSops.DeleteContentType = [LISTS, true];
    WSops.DeleteContentTypeXmlDocument = [LISTS, true];
    WSops.DeleteList = [LISTS, true];
    WSops.GetAttachmentCollection = [LISTS, false];
    WSops.GetList = [LISTS, false];
    WSops.GetListAndView = [LISTS, false];
    WSops.GetListCollection = [LISTS, false];
    WSops.GetListContentType = [LISTS, false];
    WSops.GetListContentTypes = [LISTS, false];
    WSops.GetListItemChanges = [LISTS, false];
    WSops.GetListItemChangesSinceToken = [LISTS, false];
    WSops.GetListItems = [LISTS, false];
    WSops.GetVersionCollection = [LISTS, false];
    WSops.UndoCheckOut = [LISTS, true];
    WSops.UpdateContentType = [LISTS, true];
    WSops.UpdateContentTypesXmlDocument = [LISTS, true];
    WSops.UpdateContentTypeXmlDocument = [LISTS, true];
    WSops.UpdateList = [LISTS, true];
    WSops.UpdateListItems = [LISTS, true];

    WSops.AddMeeting = [MEETINGS, true];
    WSops.CreateWorkspace = [MEETINGS, true];
    WSops.RemoveMeeting = [MEETINGS, true];
    WSops.SetWorkSpaceTitle = [MEETINGS, true];

    WSops.GetRecordRouting = [OFFICIALFILE, false];
    WSops.GetRecordRoutingCollection = [OFFICIALFILE, false];
    WSops.GetServerInfo = [OFFICIALFILE, false];
    WSops.SubmitFile = [OFFICIALFILE, true];

    WSops.ResolvePrincipals = [PEOPLE, true];
    WSops.SearchPrincipals = [PEOPLE, false];

    WSops.AddPermission = [PERMISSIONS, true];
    WSops.AddPermissionCollection = [PERMISSIONS, true];
    WSops.GetPermissionCollection = [PERMISSIONS, true];
    WSops.RemovePermission = [PERMISSIONS, true];
    WSops.RemovePermissionCollection = [PERMISSIONS, true];
    WSops.UpdatePermission = [PERMISSIONS, true];

    WSops.GetLinks = [PUBLISHEDLINKSSERVICE, true];

    WSops.GetPortalSearchInfo = [SEARCH, false];
    WSops.GetQuerySuggestions = [SEARCH, false];
    WSops.GetSearchMetadata = [SEARCH, false];
    WSops.Query = [SEARCH, false];
    WSops.QueryEx = [SEARCH, false];
    WSops.Registration = [SEARCH, false];
    WSops.Status = [SEARCH, false];

    WSops.SendClientScriptErrorReport = [SHAREPOINTDIAGNOSTICS, true];

    WSops.GetAttachments = [SITEDATA, false];
    WSops.EnumerateFolder = [SITEDATA, false];
    WSops.SiteDataGetList = [SITEDATA, false];
    WSops.SiteDataGetListCollection = [SITEDATA, false];
    WSops.SiteDataGetSite = [SITEDATA, false];
    WSops.SiteDataGetSiteUrl = [SITEDATA, false];
    WSops.SiteDataGetWeb = [SITEDATA, false];

    WSops.CreateWeb = [SITES, true];
    WSops.DeleteWeb = [SITES, true];
    WSops.GetSite = [SITES, false];
    WSops.GetSiteTemplates = [SITES, false];

    WSops.AddComment = [SOCIALDATASERVICE, true];
    WSops.AddTag = [SOCIALDATASERVICE, true];
    WSops.AddTagByKeyword = [SOCIALDATASERVICE, true];
    WSops.CountCommentsOfUser = [SOCIALDATASERVICE, false];
    WSops.CountCommentsOfUserOnUrl = [SOCIALDATASERVICE, false];
    WSops.CountCommentsOnUrl = [SOCIALDATASERVICE, false];
    WSops.CountRatingsOnUrl = [SOCIALDATASERVICE, false];
    WSops.CountTagsOfUser = [SOCIALDATASERVICE, false];
    WSops.DeleteComment = [SOCIALDATASERVICE, true];
    WSops.DeleteRating = [SOCIALDATASERVICE, true];
    WSops.DeleteTag = [SOCIALDATASERVICE, true];
    WSops.DeleteTagByKeyword = [SOCIALDATASERVICE, true];
    WSops.DeleteTags = [SOCIALDATASERVICE, true];
    WSops.GetAllTagTerms = [SOCIALDATASERVICE, false];
    WSops.GetAllTagTermsForUrlFolder = [SOCIALDATASERVICE, false];
    WSops.GetAllTagUrls = [SOCIALDATASERVICE, false];
    WSops.GetAllTagUrlsByKeyword = [SOCIALDATASERVICE, false];
    WSops.GetCommentsOfUser = [SOCIALDATASERVICE, false];
    WSops.GetCommentsOfUserOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetCommentsOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetRatingAverageOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetRatingOfUserOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetRatingOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetRatingsOfUser = [SOCIALDATASERVICE, false];
    WSops.GetRatingsOnUrl = [SOCIALDATASERVICE, false];
    WSops.GetSocialDataForFullReplication = [SOCIALDATASERVICE, false];
    WSops.GetTags = [SOCIALDATASERVICE, true];
    WSops.GetTagsOfUser = [SOCIALDATASERVICE, true];
    WSops.GetTagTerms = [SOCIALDATASERVICE, true];
    WSops.GetTagTermsOfUser = [SOCIALDATASERVICE, true];
    WSops.GetTagTermsOnUrl = [SOCIALDATASERVICE, true];
    WSops.GetTagUrlsOfUser = [SOCIALDATASERVICE, true];
    WSops.GetTagUrlsOfUserByKeyword = [SOCIALDATASERVICE, true];
    WSops.GetTagUrls = [SOCIALDATASERVICE, true];
    WSops.GetTagUrlsByKeyword = [SOCIALDATASERVICE, true];
    WSops.SetRating = [SOCIALDATASERVICE, true];
    WSops.UpdateComment = [SOCIALDATASERVICE, true];

    WSops.SpellCheck = [SPELLCHECK, false];

    // Taxonomy Service Calls
    // Updated 2011.01.27 by Thomas McMillan
    WSops.AddTerms = [TAXONOMYSERVICE, true];
    WSops.GetChildTermsInTerm = [TAXONOMYSERVICE, false];
    WSops.GetChildTermsInTermSet = [TAXONOMYSERVICE, false];
    WSops.GetKeywordTermsByGuids = [TAXONOMYSERVICE, false];
    WSops.GetTermsByLabel = [TAXONOMYSERVICE, false];
    WSops.GetTermSets = [TAXONOMYSERVICE, false];

    WSops.AddGroup = [USERGROUP, true];
    WSops.AddGroupToRole = [USERGROUP, true];
    WSops.AddRole = [USERGROUP, true];
    WSops.AddRoleDef = [USERGROUP, true];
    WSops.AddUserCollectionToGroup = [USERGROUP, true];
    WSops.AddUserCollectionToRole = [USERGROUP, true];
    WSops.AddUserToGroup = [USERGROUP, true];
    WSops.AddUserToRole = [USERGROUP, true];
    WSops.GetAllUserCollectionFromWeb = [USERGROUP, false];
    WSops.GetGroupCollection = [USERGROUP, false];
    WSops.GetGroupCollectionFromRole = [USERGROUP, false];
    WSops.GetGroupCollectionFromSite = [USERGROUP, false];
    WSops.GetGroupCollectionFromUser = [USERGROUP, false];
    WSops.GetGroupCollectionFromWeb = [USERGROUP, false];
    WSops.GetGroupInfo = [USERGROUP, false];
    WSops.GetRoleCollection = [USERGROUP, false];
    WSops.GetRoleCollectionFromGroup = [USERGROUP, false];
    WSops.GetRoleCollectionFromUser = [USERGROUP, false];
    WSops.GetRoleCollectionFromWeb = [USERGROUP, false];
    WSops.GetRoleInfo = [USERGROUP, false];
    WSops.GetRolesAndPermissionsForCurrentUser = [USERGROUP, false];
    WSops.GetRolesAndPermissionsForSite = [USERGROUP, false];
    WSops.GetUserCollection = [USERGROUP, false];
    WSops.GetUserCollectionFromGroup = [USERGROUP, false];
    WSops.GetUserCollectionFromRole = [USERGROUP, false];
    WSops.GetUserCollectionFromSite = [USERGROUP, false];
    WSops.GetUserCollectionFromWeb = [USERGROUP, false];
    WSops.GetUserInfo = [USERGROUP, false];
    WSops.GetUserLoginFromEmail = [USERGROUP, false];
    WSops.RemoveGroup = [USERGROUP, true];
    WSops.RemoveGroupFromRole = [USERGROUP, true];
    WSops.RemoveRole = [USERGROUP, true];
    WSops.RemoveUserCollectionFromGroup = [USERGROUP, true];
    WSops.RemoveUserCollectionFromRole = [USERGROUP, true];
    WSops.RemoveUserCollectionFromSite = [USERGROUP, true];
    WSops.RemoveUserFromGroup = [USERGROUP, true];
    WSops.RemoveUserFromRole = [USERGROUP, true];
    WSops.RemoveUserFromSite = [USERGROUP, true];
    WSops.RemoveUserFromWeb = [USERGROUP, true];
    WSops.UpdateGroupInfo = [USERGROUP, true];
    WSops.UpdateRoleDefInfo = [USERGROUP, true];
    WSops.UpdateRoleInfo = [USERGROUP, true];
    WSops.UpdateUserInfo = [USERGROUP, true];

    WSops.AddColleague = [USERPROFILESERVICE, true];
    WSops.AddLink = [USERPROFILESERVICE, true];
    WSops.AddMembership = [USERPROFILESERVICE, true];
    WSops.AddPinnedLink = [USERPROFILESERVICE, true];
    WSops.CreateMemberGroup = [USERPROFILESERVICE, true];
    WSops.CreateUserProfileByAccountName = [USERPROFILESERVICE, true];
    WSops.GetCommonColleagues = [USERPROFILESERVICE, false];
    WSops.GetCommonManager = [USERPROFILESERVICE, false];
    WSops.GetCommonMemberships = [USERPROFILESERVICE, false];
    WSops.GetInCommon = [USERPROFILESERVICE, false];
    WSops.GetPropertyChoiceList = [USERPROFILESERVICE, false];
    WSops.GetUserColleagues = [USERPROFILESERVICE, false];
    WSops.GetUserLinks = [USERPROFILESERVICE, false];
    WSops.GetUserMemberships = [USERPROFILESERVICE, false];
    WSops.GetUserPinnedLinks = [USERPROFILESERVICE, false];
    WSops.GetUserProfileByGuid = [USERPROFILESERVICE, false];
    WSops.GetUserProfileByIndex = [USERPROFILESERVICE, false];
    WSops.GetUserProfileByName = [USERPROFILESERVICE, false];
    WSops.GetUserProfileCount = [USERPROFILESERVICE, false];
    WSops.GetUserProfileSchema = [USERPROFILESERVICE, false];
    WSops.GetUserPropertyByAccountName = [USERPROFILESERVICE, false];
    WSops.ModifyUserPropertyByAccountName = [USERPROFILESERVICE, true];
    WSops.RemoveAllColleagues = [USERPROFILESERVICE, true];
    WSops.RemoveAllLinks = [USERPROFILESERVICE, true];
    WSops.RemoveAllMemberships = [USERPROFILESERVICE, true];
    WSops.RemoveAllPinnedLinks = [USERPROFILESERVICE, true];
    WSops.RemoveColleague = [USERPROFILESERVICE, true];
    WSops.RemoveLink = [USERPROFILESERVICE, true];
    WSops.RemoveMembership = [USERPROFILESERVICE, true];
    WSops.RemovePinnedLink = [USERPROFILESERVICE, true];
    WSops.UpdateColleaguePrivacy = [USERPROFILESERVICE, true];
    WSops.UpdateLink = [USERPROFILESERVICE, true];
    WSops.UpdateMembershipPrivacy = [USERPROFILESERVICE, true];
    WSops.UpdatePinnedLink = [USERPROFILESERVICE, true];

    WSops.DeleteAllVersions = [VERSIONS, true];
    WSops.DeleteVersion = [VERSIONS, true];
    WSops.GetVersions = [VERSIONS, false];
    WSops.RestoreVersion = [VERSIONS, true];

    WSops.AddView = [VIEWS, true];
    WSops.DeleteView = [VIEWS, true];
    WSops.GetView = [VIEWS, false];
    WSops.GetViewHtml = [VIEWS, false];
    WSops.GetViewCollection = [VIEWS, false];
    WSops.UpdateView = [VIEWS, true];
    WSops.UpdateViewHtml = [VIEWS, true];

    WSops.AddWebPart = [WEBPARTPAGES, true];
    WSops.AddWebPartToZone = [WEBPARTPAGES, true];
    WSops.DeleteWebPart = [WEBPARTPAGES, true];
    WSops.GetWebPart2 = [WEBPARTPAGES, false];
    WSops.GetWebPartPage = [WEBPARTPAGES, false];
    WSops.GetWebPartProperties = [WEBPARTPAGES, false];
    WSops.GetWebPartProperties2 = [WEBPARTPAGES, false];
    WSops.SaveWebPart2 = [WEBPARTPAGES, true];

    WSops.CreateContentType = [WEBS, true];
    WSops.GetColumns = [WEBS, false];
    WSops.GetContentType = [WEBS, false];
    WSops.GetContentTypes = [WEBS, false];
    WSops.GetCustomizedPageStatus = [WEBS, false];
    WSops.GetListTemplates = [WEBS, false];
    WSops.GetObjectIdFromUrl = [WEBS, false]; // 2010
    WSops.GetWeb = [WEBS, false];
    WSops.GetWebCollection = [WEBS, false];
    WSops.GetAllSubWebCollection = [WEBS, false];
    WSops.UpdateColumns = [WEBS, true];
    WSops.UpdateContentType = [WEBS, true];
    WSops.WebUrlFromPageUrl = [WEBS, false];

    WSops.AlterToDo = [WORKFLOW, true];
    WSops.ClaimReleaseTask = [WORKFLOW, true];
    WSops.GetTemplatesForItem = [WORKFLOW, false];
    WSops.GetToDosForItem = [WORKFLOW, false];
    WSops.GetWorkflowDataForItem = [WORKFLOW, false];
    WSops.GetWorkflowTaskData = [WORKFLOW, false];
    WSops.StartWorkflow = [WORKFLOW, true];

    // Set up SOAP envelope
    var SOAPEnvelope = {};
    SOAPEnvelope.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
    SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
    SOAPEnvelope.payload = "";
    var SOAPAction;

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
            case ALERTS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/2002/1/alerts/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/2002/1/alerts/";
                break;
            case MEETINGS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/meetings/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/meetings/";
                break;
            case OFFICIALFILE:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/recordsrepository/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/recordsrepository/";
                break;
            case PERMISSIONS:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/directory/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/directory/";
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
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/diagnostics/' >";
                SOAPAction = "http://schemas.microsoft.com/sharepoint/diagnostics/";
                break;
            case SOCIALDATASERVICE:
                SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
                SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
                break;
            case SPELLCHECK:
                SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/' >";
                SOAPAction = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
                break;
            case TAXONOMYSERVICE:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/taxonomy/soap/' >";
                SOAPAction = constants.SCHEMASharePoint + "/taxonomy/soap/";
                break;
            case USERGROUP:
                SOAPEnvelope.opheader += "xmlns='" + constants.SCHEMASharePoint + "/soap/directory/' >";
                SOAPAction = constants.SCHEMASharePoint + "/soap/directory/";
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
                    SOAPEnvelope.payload += utils.wrapNode("string", opt.IDs[i]);
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
                for (i = 0; i < opt.DestinationUrls.length; i++) {
                    SOAPEnvelope.payload += utils.wrapNode("string", opt.DestinationUrls[i]);
                }
                SOAPEnvelope.payload += "</DestinationUrls>";
                addToPayload(opt, ["Fields", "Stream", "Results"]);
                break;
            case "CopyIntoItemsLocal":
                addToPayload(opt, ["SourceUrl"]);
                SOAPEnvelope.payload += "<DestinationUrls>";
                for (i = 0; i < opt.DestinationUrls.length; i++) {
                    SOAPEnvelope.payload += utils.wrapNode("string", opt.DestinationUrls[i]);
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
                addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
                    ["viewFields", "CAMLViewFields"],
                    ["rowLimit", "CAMLRowLimit"],
                    ["queryOptions", "CAMLQueryOptions"]
                ]);
                break;
            case "GetListItemChanges":
                addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
                break;
            case "GetListItemChangesSinceToken":
                addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"],
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
                if (typeof opt.updates !== "undefined" && opt.updates.length > 0) {
                    addToPayload(opt, ["updates"]);
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

            // OFFICIALFILE OPERATIONS
            case "GetRecordRouting":
                addToPayload(opt, ["recordRouting"]);
                break;
            case "GetRecordRoutingCollection":
                break;
            case "GetServerInfo":
                break;
            case "SubmitFile":
                addToPayload(opt, ["fileToSubmit"], ["properties"], ["recordRouting"], ["sourceUrl"], ["userName"]);
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
                SOAPEnvelope.payload += utils.wrapNode("queryXml", utils.encodeXml(opt.queryXml));
                break;
            case "GetSearchMetadata":
                SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                break;
            case "Query":
                SOAPEnvelope.payload += utils.wrapNode("queryXml", utils.encodeXml(opt.queryXml));
                break;
            case "QueryEx":
                SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
                SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
                SOAPEnvelope.payload += utils.wrapNode("queryXml", utils.encodeXml(opt.queryXml));
                break;
            case "Registration":
                SOAPEnvelope.payload += utils.wrapNode("registrationXml", utils.encodeXml(opt.registrationXml));
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
                addToPayload(opt, ["url", "title", "description", "templateName", "language", "languageSpecified",
                    "locale", "localeSpecified", "collationLocale", "collationLocaleSpecified", "uniquePermissions",
                    "uniquePermissionsSpecified", "anonymous", "anonymousSpecified", "presence", "presenceSpecified"
                ]);
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
                if (typeof opt.excludeItemsTime !== "undefined" && opt.excludeItemsTime.length > 0) {
                    SOAPEnvelope.payload += utils.wrapNode("excludeItemsTime", opt.excludeItemsTime);
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
                addToPayload(opt, ["sharedServiceIds", "termSetIds", "lcid", "clientTimeStamps", "clientVersions"]);
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
                if (typeof opt.accountName !== "undefined" && opt.accountName.length > 0) {
                    addToPayload(opt, [
                        ["AccountName", "accountName"]
                    ]);
                } else {
                    addToPayload(opt, ["AccountName"]);
                }
                break;
            case "GetUserProfileCount":
                break;
            case "GetUserProfileSchema":
                break;
            case "GetUserPropertyByAccountName":
                addToPayload(opt, ["accountName", "propertyName"]);
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
                    "query", "viewFields", "aggregations", "formats", "rowLimit"
                ]);
                break;

            // WEBPARTPAGES OPERATIONS
            case "AddWebPart":
                addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
                break;
            case "AddWebPartToZone":
                addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
                break;
            case "DeleteWebPart":
                addToPayload(opt, ["pageUrl", "storageKey", "storage"]);
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
            case "SaveWebPart2":
                addToPayload(opt, ["pageUrl", "storageKey", "webPartXml", "storage", "allowTypeChange"]);
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
                addToPayload(opt, [
                    ["webUrl", "webURL"]
                ]);
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
                addToPayload(opt, [
                    ["pageUrl", "pageURL"]
                ]);
                break;

            // WORKFLOW OPERATIONS
            case "AlterToDo":
                addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
                break;
            case "ClaimReleaseTask":
                addToPayload(opt, ["item", "taskId", "listId", "fClaim"]);
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
//                opt.completefunc(cachedPromise, null);
                cachedPromise.done(function(data, status, jqXHR){
                    opt.completefunc(jqXHR, status);
                });

            }
            // Return the cached promise
            return cachedPromise;
        }

    }; // End $.fn.SPServices

    // Defaults added as a function in our library means that the caller can override the defaults
    // for their session by calling this function.  Each operation requires a different set of options;
    // we allow for all in a standardized way.
    $.fn.SPServices.defaults = {

        cacheXML: false, // If true, we'll cache the XML results with jQuery's .data() function
        operation: "", // The Web Service operation
        webURL: "", // URL of the target Web
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

    // Function to determine the current Web's URL.  We need this for successful Ajax calls.
    // The function is also available as a public function.
    $.fn.SPServices.SPGetCurrentSite = function () {

        // We've already determined the current site...
        if (currentContext.thisSite.length > 0) {
            return currentContext.thisSite;
        }

        // If we still don't know the current site, we call WebUrlFromPageUrlResult.
        var msg = SOAPEnvelope.header +
            "<WebUrlFromPageUrl xmlns='" + constants.SCHEMASharePoint + "/soap/' ><pageUrl>" +
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
            complete: function (xData) {
                currentContext.thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
            }
        });

        return currentContext.thisSite; // Return the URL

    }; // End $.fn.SPServices.SPGetCurrentSite

    // Function which returns the account name for the current user in DOMAIN\username format
    $.fn.SPServices.SPGetCurrentUser = function (options) {

        var opt = $.extend({}, {
            webURL: "", // URL of the target Site Collection.  If not specified, the current Web is used.
            fieldName: "Name", // Specifies which field to return from the userdisp.aspx page
            fieldNames: {}, // Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
            debug: false // If true, show error messages; if false, run silent
        }, options);

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

        for (i = 0; i < fieldCount; i++) {

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
        currentContext.thisList = $().SPServices.SPListNameFromUrl();

        // Set the messages based on the options provided
        var msg = "<span id='SPRequireUnique" + opt.columnStaticName + "' class='{0}'>{1}</span><br/>";
        var firstMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);

        // We need the DisplayName
        var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
            listName: currentContext.thisList,
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
                listName: currentContext.thisList,
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
                    for (i = 0; i < columnValueIDs.length; i++) {
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
                    for (i = 0; i < nameCount; i++) {
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
                    for (i = 0; i < nameCount; i++) {
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
            redirectUrl: "", // Page for the redirect
            qsParamName: "ID" // In some cases, you may want to pass the newly created item's ID with a different
            // parameter name than ID. Specify that name here, if needed.
        }, options);

        currentContext.thisList = $().SPServices.SPListNameFromUrl();
        var queryStringVals = $().SPServices.SPGetQueryString();
        var lastID = queryStringVals.ID;
        var QSList = queryStringVals.List;
        var QSRootFolder = queryStringVals.RootFolder;
        var QSContentTypeId = queryStringVals.ContentTypeId;

        // On first load, change the form actions to redirect back to this page with the current lastID for this user and the
        // original Source.
        if (typeof queryStringVals.ID === "undefined") {
            lastID = $().SPServices.SPGetLastItemId({
                listName: currentContext.thisList
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
                    listName: currentContext.thisList
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
        var cloneId = genContainerId("SPSetMultiSelectSizes", opt.multiSelectColumn, opt.listName);
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
                                                    for (i = 0; i < formTypes.length; i++) {
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
            for (i = 0; i < numLists; i++) {
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
                        for (i = 0; i < pageScriptSrc.type.length; i++) {
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
        var i;
        var coreScriptLocations = ["WebResource.axd", "_layouts"];
        for (i = 0; i < coreScriptLocations.length; i++) {
            if (src.indexOf(coreScriptLocations[i]) > -1) {
                return true;
            }
        }
        return false;
    } // End of function coreScript

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
            for (i = 0; i < columnOptions.length; i++) {
                // If we've already got perRow columnOptions in the row, close off the row
                if ((i + 1) % opt.perRow === 0) {
                    newChoiceTable.append("<tr></tr>");
                }
                newChoiceTable.find("tr:last").append(columnOptions[i]);
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

    // Get the current list's GUID (ID) from the current URL.  Use of this function only makes sense if we're in a list's context,
    // and we assume that we are calling it from an aspx page which is a form or view for the list.
    $.fn.SPServices.SPListNameFromUrl = function (options) {

        var opt = $.extend({}, {
            listName: "" // [Optional] Pass in the name or GUID of a list if you are not in its context. e.g., on a Web Part pages in the Pages library
        }, options);

        // Has the list name or GUID been passed in?
        if (opt.listName.length > 0) {
            currentContext.thisList = opt.listName;
            return currentContext.thisList;
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



    // Return the current version of SPServices as a string
    $.fn.SPServices.Version = function () {

        return constants.VERSION;

    }; // End $.fn.SPServices.Version



    ////// PRIVATE FUNCTIONS ////////

    // Get the current context (as much as we can) on startup
    // See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
    function SPServicesContext() {

        // The SharePoint variables only give us a relative path. to match the result from WebUrlFromPageUrl, we need to add the protocol, host, and (if present) port.
        var siteRoot = location.protocol + "//" + location.host; // + (location.port !== "" ? location.port : "");

        // SharePoint 2010 gives us a context variable
        if (typeof _spPageContextInfo !== "undefined") {
            this.thisSite = siteRoot + _spPageContextInfo.webServerRelativeUrl;
            this.thisList = _spPageContextInfo.pageListId;
            this.thisUserId = _spPageContextInfo.userId;
            // In SharePoint 2007, we know the UserID only
        } else {
            this.thisSite = (typeof L_Menu_BaseUrl !== "undefined") ? siteRoot + L_Menu_BaseUrl : "";
            this.thisList = "";
            this.thisUserId = (typeof _spUserId !== "undefined") ? _spUserId : undefined;
        }

    } // End of function SPServicesContext



    // Add the option values to the SOAPEnvelope.payload for the operation
    //  opt = options for the call
    //  paramArray = an array of option names to add to the payload
    //      "paramName" if the parameter name and the option name match
    //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
    //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
    function addToPayload(opt, paramArray) {

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
    } // End of function addToPayload


    // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
    // the SiteData prefix on their names. This function replaces that name with the right name in the SOAPEnvelope.
    function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
        var siteDataOp = siteDataOperation.substring(8);
        SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
        SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
        return SOAPEnvelope;
    } // End of function siteDataFixSOAPEnvelope

});
