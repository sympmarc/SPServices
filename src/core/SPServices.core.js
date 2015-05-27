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

    // String constants
    //   General
    var SCHEMASharePoint = "http://schemas.microsoft.com/sharepoint";
    var multiLookupPrefix = "MultiLookupPicker";
    var multiLookupPrefix2013 = "MultiLookup";

    // Known list field types - See: http://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.spfieldtype(v=office.15).aspx
    var spListFieldTypes = [
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
//        "Recurrence", // NEW
//        "CrossProjectLink", // NEW
        "ModStat",
        "ContentTypeId",
//        "PageSeparator", // NEW
//        "ThreadIndex", // NEW
        "WorkflowStatus", // NEW
//      "AllDayEvent", // NEW
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
    ];

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
                SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/2002/1/alerts/' >";
                SOAPAction = SCHEMASharePoint + "/soap/2002/1/alerts/";
                break;
            case MEETINGS:
                SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/meetings/' >";
                SOAPAction = SCHEMASharePoint + "/soap/meetings/";
                break;
            case OFFICIALFILE:
                SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/recordsrepository/' >";
                SOAPAction = SCHEMASharePoint + "/soap/recordsrepository/";
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
                SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/' >";
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
            complete: function (xData) {
                currentContext.thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
            }
        });

        return currentContext.thisSite; // Return the URL

    }; // End $.fn.SPServices.SPGetCurrentSite



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
        var simpleSelectId = genContainerId("SPComplexToSimpleDropdown", columnSelect.Obj.attr("title"), opt.listName);

        var simpleSelect = "<select id='" + simpleSelectId + "' title='" + opt.columnName + "'>";
        for (i = 0; i < choices.length; i = i + 2) {
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
                outString += "<tr><td colspan='99'>" + showAttrs(opt.node) + "</td></tr>";
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
                outString += "<tr><td colspan='99'>" + showAttrs(opt.node) + "</td></tr>";
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
        var columnObj = findFormField(columnDisplayName).find("input[Title^='" + columnDisplayName + "']");
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

            var thisFormField = findFormField(opt.columnName);
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
        var columnObj = findFormField(opt.columnName).find("input[Title^='" + opt.columnName + "']");
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
        var containerId = genContainerId("SPAutocomplete", opt.columnName, opt.listName);
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
            for (i = 0; i < matchArray.length; i++) {
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

        thisData.done(function () {

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
                    if ($.inArray(thisType, spListFieldTypes) >= 0) {
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

        });

        return result.promise();

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

    // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
    // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
    // for performance details.
    $.fn.SPFilterNode = function (name) {
        return this.find('*').filter(function () {
            return this.nodeName === name;
        });
    }; // End $.fn.SPFilterNode

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
                var thisObjectName = typeof thisMapping !== "undefined" ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
                var thisObjectType = typeof thisMapping !== "undefined" ? thisMapping.objectType : undefined;
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

        var colValue;

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
            for (i = 0; i < thisUserMulti.length; i = i + 2) {
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
            for (i = 0; i < thisLookupMulti.length; i = i + 2) {
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
            for (i = 0; i < thisChoiceMulti.length; i++) {
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
            for (i = 0; i < thisString.length; i++) {
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


    // Return the current version of SPServices as a string
    $.fn.SPServices.Version = function () {

        return constants.VERSION;

    }; // End $.fn.SPServices.Version


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
            var fieldContainer = findFormField(opt.displayName);
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
            columnObj.MultiLookupPickerdata = columnObj.container.find("input[id$='" + multiLookupPrefix + "_data'], input[id$='" + multiLookupPrefix2013 + "_data']");
            var addButtonId = columnObj.container.find("[id$='AddButton']").attr("id");
            columnObj.master =
                window[addButtonId.replace(/AddButton/, multiLookupPrefix + "_m")] || // SharePoint 2007
                window[addButtonId.replace(/AddButton/, multiLookupPrefix2013 + "_m")]; // SharePoint 2013
        }

        return columnObj;

    }; // End of function $.fn.SPServices.SPDropdownCtl

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




    // Show a single attribute of a node, enclosed in a table
    //   node               The XML node
    //   opt                The current set of options
    function showAttrs(node) {
        var i;
        var out = "<table class='ms-vb' width='100%'>";
        for (i = 0; i < node.attributes.length; i++) {
            out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
                node.attributes.item(i).nodeName + "</td><td>" + utils.checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
        }
        out += "</table>";
        return out;
    } // End of function showAttrs



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

    // Finds the td which contains a form field in default forms using the comment which contains:
    //  <!--  FieldName="Title"
    //      FieldInternalName="Title"
    //      FieldType="SPFieldText"
    //  -->
    // as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
    function findFormField(columnName) {
        var thisFormBody;
        // There's no easy way to find one of these columns; we'll look for the comment with the columnName
        var searchText = RegExp("FieldName=\"" + columnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\"", "gi");
        // Loop through all of the ms-formbody table cells
        $("td.ms-formbody, td.ms-formbodysurvey").each(function () {
            // Check for the right comment
            if (searchText.test($(this).html())) {
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

});
