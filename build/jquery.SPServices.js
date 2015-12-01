/*
* SPServices - Work with SharePoint's Web Services using jQuery
* Version 2.0.0
* @requires jQuery v1.8 or greater - jQuery 1.10.x+ recommended
*
* Copyright (c) 2009-2015 Sympraxis Consulting LLC
* Examples and docs at:
* http://spservices.codeplex.com/
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*/
/*
* @description SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.
* @type jQuery
* @name SPServices
* @category Plugins/SPServices
* @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
* @build SPServices 2.0.0 2015-12-01 02:26:17
*/
;(function() {
var src_utils_constants, src_core_SPServicesutils, src_core_SPServicescorejs, src_core_Version, src_utils_SPGetCurrentSite, src_utils_SPGetCurrentUser, src_utils_SPFilterNode, src_utils_SPGetListItemsJson, src_utils_SPXmlToJson, src_utils_SPConvertDateToISO, src_utils_SPGetDisplayFromStatic, src_utils_SPGetStaticFromDisplay, src_utils_SPGetLastItemId, src_value_added_SPCascadeDropdowns, src_SPServices;
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {
  var jquery = jQuery;
  src_utils_constants = function () {
    /**
     * Maintains a set of constants for SPServices.
     *
     * @namespace constants
     */
    var SPServices = window.SPServices || {};
    SPServices.WebServices = SPServices.WebService || {};
    SPServices.SOAP = SPServices.SOAP || {};
    SPServices.SOAP.Action = '';
    var constants = {
      // Version info
      VERSION: '2.0.0',
      // update it in package.json... build takes care of the rest
      // Simple strings
      spDelim: ';#',
      SLASH: '/',
      TXTColumnNotFound: 'Column not found on page',
      // String constants
      //   General
      SCHEMASharePoint: 'http://schemas.microsoft.com/sharepoint',
      multiLookupPrefix: 'MultiLookupPicker',
      multiLookupPrefix2013: 'MultiLookup',
      // Set up SOAP envelope
      SOAPEnvelope: {
        header: '<soap:Envelope xmlns:xsi=\'http://www.w3.org/2001/XMLSchema-instance\' xmlns:xsd=\'http://www.w3.org/2001/XMLSchema\' xmlns:soap=\'http://schemas.xmlsoap.org/soap/envelope/\'><soap:Body>',
        footer: '</soap:Body></soap:Envelope>',
        payload: ''
      },
      // Dropdown Types
      dropdownType: {
        simple: 'S',
        complex: 'C',
        multiSelect: 'M'
      },
      // Known list field types - See: http://msdn.microsoft.com/en-us/library/office/microsoft.sharepoint.spfieldtype(v=office.15).aspx
      spListFieldTypes: [
        'Integer',
        'Text',
        'Note',
        'DateTime',
        'Counter',
        'Choice',
        'Lookup',
        'Boolean',
        'Number',
        'Currency',
        'URL',
        //        "Computed", // NEW
        //        "Threading", // NEW
        //        "Guid", // NEW
        'MultiChoice',
        //        "GridChoice", // NEW
        'Calculated',
        'File',
        'Attachments',
        'User',
        'Recurrence',
        // Recurring event indicator (boolean) [0 | 1]
        //        "CrossProjectLink", // NEW
        'ModStat',
        'ContentTypeId',
        //        "PageSeparator", // NEW
        //        "ThreadIndex", // NEW
        'WorkflowStatus',
        // NEW
        'AllDayEvent',
        // All day event indicator (boolean) [0 | 1]
        //      "WorkflowEventType", // NEW
        //        "Geolocation", // NEW
        //        "OutcomeChoice", // NEW
        'RelatedItems',
        // Related Items in a Workflow Tasks list
        // Also seen
        'UserMulti',
        // Multiselect users
        'LookupMulti',
        // Multi-select lookup
        'datetime',
        // Calculated date/time result
        'float',
        // Calculated float
        'Calc'  // General calculated
      ]
    };
    return constants;
  }();
  src_core_SPServicesutils = function ($, constants) {
    var utils = /** @lends spservices.utils */
      {
        // Get the current context (as much as we can) on startup
        // See: http://johnliu.net/blog/2012/2/3/sharepoint-javascript-current-page-context-info.html
        SPServicesContext: function () {
          // The SharePoint variables only give us a relative path. to match the result from WebUrlFromPageUrl, we need to add the protocol, host, and (if present) port.
          var siteRoot = location.protocol + '//' + location.host;
          // + (location.port !== "" ? location.port : "");
          var temp = {};
          // SharePoint 2010+ gives us a context variable
          if (typeof _spPageContextInfo !== 'undefined') {
            temp.thisSite = siteRoot + _spPageContextInfo.webServerRelativeUrl;
            temp.thisList = _spPageContextInfo.pageListId;
            temp.thisUserId = _spPageContextInfo.userId;  // In SharePoint 2007, we know the UserID only
          } else {
            temp.thisSite = typeof L_Menu_BaseUrl !== 'undefined' ? siteRoot + L_Menu_BaseUrl : '';
            temp.thisList = '';
            temp.thisUserId = typeof _spUserId !== 'undefined' ? _spUserId : undefined;
          }
          return temp;
        },
        // End of function SPServicesContext
        // Global variables
        //        currentContext: new this.SPServicesContext(), // Variable to hold the current context as we figure it out
        /**
         * Wrap an XML node (n) around a value (v)
         *
         */
        wrapNode: function (n, v) {
          var thisValue = typeof v !== 'undefined' ? v : '';
          return '<' + n + '>' + thisValue + '</' + n + '>';
        },
        /**
         * Generate a random number for sorting arrays randomly
         */
        randOrd: function () {
          return Math.round(Math.random()) - 0.5;
        },
        /**
         * If a string is a URL, format it as a link, else return the string as-is
         */
        checkLink: function (s) {
          return s.indexOf('http') === 0 || s.indexOf('/') === 0 ? '<a href=\'' + s + '\'>' + s + '</a>' : s;
        },
        /**
         * Get the filename from the full URL
         */
        fileName: function (s) {
          return s.substring(s.lastIndexOf('/') + 1, s.length);
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
        encodeXml: function (string) {
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
        escapeColumnValue: function (s) {
          if (typeof s === 'string') {
            return s.replace(/&(?![a-zA-Z]{1,8};)/g, '&amp;');
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
        SplitIndex: function (s) {
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
          return n < 10 ? '0' + n : n;
        },
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
        errBox: function (func, param, msg) {
          var errMsg = '<b>Error in function</b><br/>' + func + '<br/>' + '<b>Parameter</b><br/>' + param + '<br/>' + '<b>Message</b><br/>' + msg + '<br/><br/>' + '<span onmouseover=\'this.style.cursor="hand";\' onmouseout=\'this.style.cursor="inherit";\' style=\'width=100%;text-align:right;\'>Click to continue</span></div>';
          modalBox(errMsg);
        },
        // End of function errBox
        // Finds the td which contains a form field in default forms using the comment which contains:
        //  <!--  FieldName="Title"
        //      FieldInternalName="Title"
        //      FieldType="SPFieldText"
        //  -->
        // as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
        findFormField: function (columnName) {
          var thisFormBody;
          // There's no easy way to find one of these columns; we'll look for the comment with the columnName
          var searchText = new RegExp('FieldName="' + columnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '"', 'gi');
          // Loop through all of the ms-formbody table cells
          $('td.ms-formbody, td.ms-formbodysurvey').each(function () {
            // Check for the right comment
            if (searchText.test($(this).html())) {
              thisFormBody = $(this);
              // Found it, so we're done
              return false;
            }
          });
          return thisFormBody;
        },
        // End of function findFormField
        // Show a single attribute of a node, enclosed in a table
        //   node               The XML node
        //   opt                The current set of options
        showAttrs: function (node) {
          var i;
          var out = '<table class=\'ms-vb\' width=\'100%\'>';
          for (i = 0; i < node.attributes.length; i++) {
            out += '<tr><td width=\'10px\' style=\'font-weight:bold;\'>' + i + '</td><td width=\'100px\'>' + node.attributes.item(i).nodeName + '</td><td>' + utils.checkLink(node.attributes.item(i).nodeValue) + '</td></tr>';
          }
          out += '</table>';
          return out;
        },
        // End of function showAttrs
        // Add the option values to the constants.SOAPEnvelope.payload for the operation
        //  opt = options for the call
        //  paramArray = an array of option names to add to the payload
        //      "paramName" if the parameter name and the option name match
        //      ["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
        //      {name: "paramName", sendNull: false} indicates the element is marked as "add to payload only if non-null"
        addToPayload: function (opt, paramArray) {
          var i;
          for (i = 0; i < paramArray.length; i++) {
            // the parameter name and the option name match
            if (typeof paramArray[i] === 'string') {
              constants.SOAPEnvelope.payload += utils.wrapNode(paramArray[i], opt[paramArray[i]]);  // the parameter name and the option name are different
            } else if ($.isArray(paramArray[i]) && paramArray[i].length === 2) {
              constants.SOAPEnvelope.payload += utils.wrapNode(paramArray[i][0], opt[paramArray[i][1]]);  // the element not a string or an array and is marked as "add to payload only if non-null"
            } else if (typeof paramArray[i] === 'object' && paramArray[i].sendNull !== undefined) {
              constants.SOAPEnvelope.payload += opt[paramArray[i].name] === undefined || opt[paramArray[i].name].length === 0 ? '' : utils.wrapNode(paramArray[i].name, opt[paramArray[i].name]);  // something isn't right, so report it
            } else {
              utils.errBox(opt.operation, 'paramArray[' + i + ']: ' + paramArray[i], 'Invalid paramArray element passed to addToPayload()');
            }
          }
        },
        // End of function addToPayload
        // The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
        // the SiteData prefix on their names. This function replaces that name with the right name in the utils.SOAPEnvelope.
        siteDataFixSOAPEnvelope: function (SOAPEnvelope, siteDataOperation) {
          var siteDataOp = siteDataOperation.substring(8);
          SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
          SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
          return SOAPEnvelope;
        },
        // End of function siteDataFixSOAPEnvelope
        /**
         * Get the URL for a specified form for a list
         *
         * @param {Object} l
         * @param {Object} f
         */
        getListFormUrl: function (l, f) {
          var u;
          $().SPServices({
            operation: 'GetFormCollection',
            async: false,
            listName: l,
            completefunc: function (xData) {
              u = $(xData.responseXML).find('Form[Type=\'' + f + '\']').attr('Url');
            }
          });
          return u;
        },
        // End of function getListFormUrl
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
              columnSelectSelected.push(columnSelect.Obj.find('option:selected').val() || []);
            } else {
              columnSelectSelected.push(columnSelect.Obj.find('option:selected').text() || []);
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
            $(columnSelect.master.resultControl).find('option').each(function () {
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
        },
        // End of function getDropdownSelected
        /**
         * Generate a unique id for a containing div using the function name and the column display name.
         *
         * @param {Object} funcname
         * @param {Object} columnName
         * @param {Object} listName
         */
        genContainerId: function (funcname, columnName, listName) {
          var l = listName !== undefined ? listName : $().SPServices.SPListNameFromUrl();
          return funcname + '_' + $().SPServices.SPGetStaticFromDisplay({
            listName: l,
            columnDisplayName: columnName
          });
        }  // End of function genContainerId
      },
      //end: utils
      //-----------[ PRIVATE METHODS BELOW ]---------------------
      // These should all be defined against a local variable so
      // that we get smaller minified files
      /**
       * Call this function to pop up a branded modal msgBox
       * @private
       */
      modalBox = function (msg) {
        var boxCSS = 'position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:\'Arial\';font-size:12px;display:none;';
        $('#aspnetForm').parent().append('<div id=\'SPServices_msgBox\' style=' + boxCSS + '>' + msg);
        var msgBoxObj = $('#SPServices_msgBox');
        var height = msgBoxObj.height();
        var width = msgBoxObj.width();
        var leftVal = $(window).width() / 2 - width / 2 + 'px';
        var topVal = $(window).height() / 2 - height / 2 - 100 + 'px';
        msgBoxObj.css({
          border: '5px #C02000 solid',
          left: leftVal,
          top: topVal
        }).show().fadeTo('slow', 0.75).click(function () {
          $(this).fadeOut('3000', function () {
            $(this).remove();
          });
        });
      };
    // End of function modalBox;
    return utils;
  }(jquery, src_utils_constants);
  src_core_SPServicescorejs = function ($, utils, constants) {
    var SOAPAction;
    // Caching
    var promisesCache = {};
    //   Web Service names
    var webServices = {
      ALERTS: 'Alerts',
      AUTHENTICATION: 'Authentication',
      COPY: 'Copy',
      FORMS: 'Forms',
      LISTS: 'Lists',
      MEETINGS: 'Meetings',
      OFFICIALFILE: 'OfficialFile',
      PEOPLE: 'People',
      PERMISSIONS: 'Permissions',
      PUBLISHEDLINKSSERVICE: 'PublishedLinksService',
      SEARCH: 'Search',
      SHAREPOINTDIAGNOSTICS: 'SharePointDiagnostics',
      SITEDATA: 'SiteData',
      SITES: 'Sites',
      SOCIALDATASERVICE: 'SocialDataService',
      SPELLCHECK: 'SpellCheck',
      TAXONOMYSERVICE: 'TaxonomyClientService',
      USERGROUP: 'usergroup',
      USERPROFILESERVICE: 'UserProfileService',
      VERSIONS: 'Versions',
      VIEWS: 'Views',
      WEBPARTPAGES: 'WebPartPages',
      WEBS: 'Webs',
      WORKFLOW: 'Workflow'
    };
    var encodeOptionList = [
      'listName',
      'description'
    ];
    // Used to encode options which may contain special characters
    // Array to store Web Service information
    //  WSops.OpName = [WebService, needs_SOAPAction];
    //      OpName              The name of the Web Service operation -> These names are unique
    //      WebService          The name of the WebService this operation belongs to
    //      needs_SOAPAction    Boolean indicating whether the operation needs to have the SOAPAction passed in the setRequestHeaderfunction.
    //                          true if the operation does a write, else false
    var WSops = {};
    WSops.GetAlerts = [
      webServices.ALERTS,
      false
    ];
    WSops.DeleteAlerts = [
      webServices.ALERTS,
      true
    ];
    WSops.Mode = [
      webServices.AUTHENTICATION,
      false
    ];
    WSops.Login = [
      webServices.AUTHENTICATION,
      false
    ];
    WSops.CopyIntoItems = [
      webServices.COPY,
      true
    ];
    WSops.CopyIntoItemsLocal = [
      webServices.COPY,
      true
    ];
    WSops.GetItem = [
      webServices.COPY,
      false
    ];
    WSops.GetForm = [
      webServices.FORMS,
      false
    ];
    WSops.GetFormCollection = [
      webServices.FORMS,
      false
    ];
    WSops.AddAttachment = [
      webServices.LISTS,
      true
    ];
    WSops.AddDiscussionBoardItem = [
      webServices.LISTS,
      true
    ];
    WSops.AddList = [
      webServices.LISTS,
      true
    ];
    WSops.AddListFromFeature = [
      webServices.LISTS,
      true
    ];
    WSops.ApplyContentTypeToList = [
      webServices.LISTS,
      true
    ];
    WSops.CheckInFile = [
      webServices.LISTS,
      true
    ];
    WSops.CheckOutFile = [
      webServices.LISTS,
      true
    ];
    WSops.CreateContentType = [
      webServices.LISTS,
      true
    ];
    WSops.DeleteAttachment = [
      webServices.LISTS,
      true
    ];
    WSops.DeleteContentType = [
      webServices.LISTS,
      true
    ];
    WSops.DeleteContentTypeXmlDocument = [
      webServices.LISTS,
      true
    ];
    WSops.DeleteList = [
      webServices.LISTS,
      true
    ];
    WSops.GetAttachmentCollection = [
      webServices.LISTS,
      false
    ];
    WSops.GetList = [
      webServices.LISTS,
      false
    ];
    WSops.GetListAndView = [
      webServices.LISTS,
      false
    ];
    WSops.GetListCollection = [
      webServices.LISTS,
      false
    ];
    WSops.GetListContentType = [
      webServices.LISTS,
      false
    ];
    WSops.GetListContentTypes = [
      webServices.LISTS,
      false
    ];
    WSops.GetListItemChanges = [
      webServices.LISTS,
      false
    ];
    WSops.GetListItemChangesSinceToken = [
      webServices.LISTS,
      false
    ];
    WSops.GetListItems = [
      webServices.LISTS,
      false
    ];
    WSops.GetVersionCollection = [
      webServices.LISTS,
      false
    ];
    WSops.UndoCheckOut = [
      webServices.LISTS,
      true
    ];
    WSops.UpdateContentType = [
      webServices.LISTS,
      true
    ];
    WSops.UpdateContentTypesXmlDocument = [
      webServices.LISTS,
      true
    ];
    WSops.UpdateContentTypeXmlDocument = [
      webServices.LISTS,
      true
    ];
    WSops.UpdateList = [
      webServices.LISTS,
      true
    ];
    WSops.UpdateListItems = [
      webServices.LISTS,
      true
    ];
    WSops.AddMeeting = [
      webServices.MEETINGS,
      true
    ];
    WSops.CreateWorkspace = [
      webServices.MEETINGS,
      true
    ];
    WSops.RemoveMeeting = [
      webServices.MEETINGS,
      true
    ];
    WSops.SetWorkSpaceTitle = [
      webServices.MEETINGS,
      true
    ];
    WSops.GetRecordRouting = [
      webServices.OFFICIALFILE,
      false
    ];
    WSops.GetRecordRoutingCollection = [
      webServices.OFFICIALFILE,
      false
    ];
    WSops.GetServerInfo = [
      webServices.OFFICIALFILE,
      false
    ];
    WSops.SubmitFile = [
      webServices.OFFICIALFILE,
      true
    ];
    WSops.ResolvePrincipals = [
      webServices.PEOPLE,
      true
    ];
    WSops.SearchPrincipals = [
      webServices.PEOPLE,
      false
    ];
    WSops.AddPermission = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.AddPermissionCollection = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.GetPermissionCollection = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.RemovePermission = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.RemovePermissionCollection = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.UpdatePermission = [
      webServices.PERMISSIONS,
      true
    ];
    WSops.GetLinks = [
      webServices.PUBLISHEDLINKSSERVICE,
      true
    ];
    WSops.GetPortalSearchInfo = [
      webServices.SEARCH,
      false
    ];
    WSops.GetQuerySuggestions = [
      webServices.SEARCH,
      false
    ];
    WSops.GetSearchMetadata = [
      webServices.SEARCH,
      false
    ];
    WSops.Query = [
      webServices.SEARCH,
      false
    ];
    WSops.QueryEx = [
      webServices.SEARCH,
      false
    ];
    WSops.Registration = [
      webServices.SEARCH,
      false
    ];
    WSops.Status = [
      webServices.SEARCH,
      false
    ];
    WSops.SendClientScriptErrorReport = [
      webServices.SHAREPOINTDIAGNOSTICS,
      true
    ];
    WSops.GetAttachments = [
      webServices.SITEDATA,
      false
    ];
    WSops.EnumerateFolder = [
      webServices.SITEDATA,
      false
    ];
    WSops.SiteDataGetList = [
      webServices.SITEDATA,
      false
    ];
    WSops.SiteDataGetListCollection = [
      webServices.SITEDATA,
      false
    ];
    WSops.SiteDataGetSite = [
      webServices.SITEDATA,
      false
    ];
    WSops.SiteDataGetSiteUrl = [
      webServices.SITEDATA,
      false
    ];
    WSops.SiteDataGetWeb = [
      webServices.SITEDATA,
      false
    ];
    WSops.CreateWeb = [
      webServices.SITES,
      true
    ];
    WSops.DeleteWeb = [
      webServices.SITES,
      true
    ];
    WSops.GetSite = [
      webServices.SITES,
      false
    ];
    WSops.GetSiteTemplates = [
      webServices.SITES,
      false
    ];
    WSops.AddComment = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.AddTag = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.AddTagByKeyword = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.CountCommentsOfUser = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.CountCommentsOfUserOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.CountCommentsOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.CountRatingsOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.CountTagsOfUser = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.DeleteComment = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.DeleteRating = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.DeleteTag = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.DeleteTagByKeyword = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.DeleteTags = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetAllTagTerms = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetAllTagTermsForUrlFolder = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetAllTagUrls = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetAllTagUrlsByKeyword = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetCommentsOfUser = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetCommentsOfUserOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetCommentsOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetRatingAverageOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetRatingOfUserOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetRatingOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetRatingsOfUser = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetRatingsOnUrl = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetSocialDataForFullReplication = [
      webServices.SOCIALDATASERVICE,
      false
    ];
    WSops.GetTags = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagsOfUser = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagTerms = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagTermsOfUser = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagTermsOnUrl = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagUrlsOfUser = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagUrlsOfUserByKeyword = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagUrls = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.GetTagUrlsByKeyword = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.SetRating = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.UpdateComment = [
      webServices.SOCIALDATASERVICE,
      true
    ];
    WSops.SpellCheck = [
      webServices.SPELLCHECK,
      false
    ];
    // Taxonomy Service Calls
    // Updated 2011.01.27 by Thomas McMillan
    WSops.AddTerms = [
      webServices.TAXONOMYSERVICE,
      true
    ];
    WSops.GetChildTermsInTerm = [
      webServices.TAXONOMYSERVICE,
      false
    ];
    WSops.GetChildTermsInTermSet = [
      webServices.TAXONOMYSERVICE,
      false
    ];
    WSops.GetKeywordTermsByGuids = [
      webServices.TAXONOMYSERVICE,
      false
    ];
    WSops.GetTermsByLabel = [
      webServices.TAXONOMYSERVICE,
      false
    ];
    WSops.GetTermSets = [
      webServices.TAXONOMYSERVICE,
      false
    ];
    WSops.AddGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddGroupToRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddRoleDef = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddUserCollectionToGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddUserCollectionToRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddUserToGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddUserToRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.GetAllUserCollectionFromWeb = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupCollection = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupCollectionFromRole = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupCollectionFromSite = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupCollectionFromUser = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupCollectionFromWeb = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetGroupInfo = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRoleCollection = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRoleCollectionFromGroup = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRoleCollectionFromUser = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRoleCollectionFromWeb = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRoleInfo = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRolesAndPermissionsForCurrentUser = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetRolesAndPermissionsForSite = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserCollection = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserCollectionFromGroup = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserCollectionFromRole = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserCollectionFromSite = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserCollectionFromWeb = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserInfo = [
      webServices.USERGROUP,
      false
    ];
    WSops.GetUserLoginFromEmail = [
      webServices.USERGROUP,
      false
    ];
    WSops.RemoveGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveGroupFromRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserCollectionFromGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserCollectionFromRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserCollectionFromSite = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserFromGroup = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserFromRole = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserFromSite = [
      webServices.USERGROUP,
      true
    ];
    WSops.RemoveUserFromWeb = [
      webServices.USERGROUP,
      true
    ];
    WSops.UpdateGroupInfo = [
      webServices.USERGROUP,
      true
    ];
    WSops.UpdateRoleDefInfo = [
      webServices.USERGROUP,
      true
    ];
    WSops.UpdateRoleInfo = [
      webServices.USERGROUP,
      true
    ];
    WSops.UpdateUserInfo = [
      webServices.USERGROUP,
      true
    ];
    WSops.AddColleague = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.AddLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.AddMembership = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.AddPinnedLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.CreateMemberGroup = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.CreateUserProfileByAccountName = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.GetCommonColleagues = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetCommonManager = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetCommonMemberships = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetInCommon = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetPropertyChoiceList = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserColleagues = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserLinks = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserMemberships = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserPinnedLinks = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserProfileByGuid = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserProfileByIndex = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserProfileByName = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserProfileCount = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserProfileSchema = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.GetUserPropertyByAccountName = [
      webServices.USERPROFILESERVICE,
      false
    ];
    WSops.ModifyUserPropertyByAccountName = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveAllColleagues = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveAllLinks = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveAllMemberships = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveAllPinnedLinks = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveColleague = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemoveMembership = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.RemovePinnedLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.UpdateColleaguePrivacy = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.UpdateLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.UpdateMembershipPrivacy = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.UpdatePinnedLink = [
      webServices.USERPROFILESERVICE,
      true
    ];
    WSops.DeleteAllVersions = [
      webServices.VERSIONS,
      true
    ];
    WSops.DeleteVersion = [
      webServices.VERSIONS,
      true
    ];
    WSops.GetVersions = [
      webServices.VERSIONS,
      false
    ];
    WSops.RestoreVersion = [
      webServices.VERSIONS,
      true
    ];
    WSops.AddView = [
      webServices.VIEWS,
      true
    ];
    WSops.DeleteView = [
      webServices.VIEWS,
      true
    ];
    WSops.GetView = [
      webServices.VIEWS,
      false
    ];
    WSops.GetViewHtml = [
      webServices.VIEWS,
      false
    ];
    WSops.GetViewCollection = [
      webServices.VIEWS,
      false
    ];
    WSops.UpdateView = [
      webServices.VIEWS,
      true
    ];
    WSops.UpdateViewHtml = [
      webServices.VIEWS,
      true
    ];
    WSops.AddWebPart = [
      webServices.WEBPARTPAGES,
      true
    ];
    WSops.AddWebPartToZone = [
      webServices.WEBPARTPAGES,
      true
    ];
    WSops.DeleteWebPart = [
      webServices.WEBPARTPAGES,
      true
    ];
    WSops.GetWebPart2 = [
      webServices.WEBPARTPAGES,
      false
    ];
    WSops.GetWebPartPage = [
      webServices.WEBPARTPAGES,
      false
    ];
    WSops.GetWebPartProperties = [
      webServices.WEBPARTPAGES,
      false
    ];
    WSops.GetWebPartProperties2 = [
      webServices.WEBPARTPAGES,
      false
    ];
    WSops.SaveWebPart2 = [
      webServices.WEBPARTPAGES,
      true
    ];
    WSops.WebsCreateContentType = [
      webServices.WEBS,
      true
    ];
    WSops.GetColumns = [
      webServices.WEBS,
      false
    ];
    WSops.GetContentType = [
      webServices.WEBS,
      false
    ];
    WSops.GetContentTypes = [
      webServices.WEBS,
      false
    ];
    WSops.GetCustomizedPageStatus = [
      webServices.WEBS,
      false
    ];
    WSops.GetListTemplates = [
      webServices.WEBS,
      false
    ];
    WSops.GetObjectIdFromUrl = [
      webServices.WEBS,
      false
    ];
    // 2010
    WSops.GetWeb = [
      webServices.WEBS,
      false
    ];
    WSops.GetWebCollection = [
      webServices.WEBS,
      false
    ];
    WSops.GetAllSubWebCollection = [
      webServices.WEBS,
      false
    ];
    WSops.UpdateColumns = [
      webServices.WEBS,
      true
    ];
    WSops.WebsUpdateContentType = [
      webServices.WEBS,
      true
    ];
    WSops.WebUrlFromPageUrl = [
      webServices.WEBS,
      false
    ];
    WSops.AlterToDo = [
      webServices.WORKFLOW,
      true
    ];
    WSops.ClaimReleaseTask = [
      webServices.WORKFLOW,
      true
    ];
    WSops.GetTemplatesForItem = [
      webServices.WORKFLOW,
      false
    ];
    WSops.GetToDosForItem = [
      webServices.WORKFLOW,
      false
    ];
    WSops.GetWorkflowDataForItem = [
      webServices.WORKFLOW,
      false
    ];
    WSops.GetWorkflowTaskData = [
      webServices.WORKFLOW,
      false
    ];
    WSops.StartWorkflow = [
      webServices.WORKFLOW,
      true
    ];
    // Main function, which calls SharePoint's Web Services directly.
    $.fn.SPServices = function (options) {
      // If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
      var opt = $.extend({}, $.fn.SPServices.defaults, options);
      // Encode options which may contain special character, esp. ampersand
      for (var i = 0; i < encodeOptionList.length; i++) {
        if (typeof opt[encodeOptionList[i]] === 'string') {
          opt[encodeOptionList[i]] = utils.encodeXml(opt[encodeOptionList[i]]);
        }
      }
      // Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
      constants.SOAPEnvelope.opheader = '<' + opt.operation + ' ';
      switch (WSops[opt.operation][0]) {
      case webServices.ALERTS:
        constants.utils.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/2002/1/alerts/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/2002/1/alerts/';
        break;
      case webServices.MEETINGS:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/meetings/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/meetings/';
        break;
      case webServices.OFFICIALFILE:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/recordsrepository/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/recordsrepository/';
        break;
      case webServices.PERMISSIONS:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/directory/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/directory/';
        break;
      case webServices.PUBLISHEDLINKSSERVICE:
        constants.SOAPEnvelope.opheader += 'xmlns=\'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/\' >';
        SOAPAction = 'http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/';
        break;
      case webServices.SEARCH:
        constants.SOAPEnvelope.opheader += 'xmlns=\'urn:Microsoft.Search\' >';
        SOAPAction = 'urn:Microsoft.Search/';
        break;
      case webServices.SHAREPOINTDIAGNOSTICS:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/diagnostics/\' >';
        SOAPAction = 'http://schemas.microsoft.com/sharepoint/diagnostics/';
        break;
      case webServices.SOCIALDATASERVICE:
        constants.SOAPEnvelope.opheader += 'xmlns=\'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService\' >';
        SOAPAction = 'http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/';
        break;
      case webServices.SPELLCHECK:
        constants.SOAPEnvelope.opheader += 'xmlns=\'http://schemas.microsoft.com/sharepoint/publishing/spelling/\' >';
        SOAPAction = 'http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck';
        break;
      case webServices.TAXONOMYSERVICE:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/taxonomy/soap/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/taxonomy/soap/';
        break;
      case webServices.USERGROUP:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/directory/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/directory/';
        break;
      case webServices.USERPROFILESERVICE:
        constants.SOAPEnvelope.opheader += 'xmlns=\'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService\' >';
        SOAPAction = 'http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/';
        break;
      case webServices.WEBPARTPAGES:
        constants.SOAPEnvelope.opheader += 'xmlns=\'http://microsoft.com/sharepoint/webpartpages\' >';
        SOAPAction = 'http://microsoft.com/sharepoint/webpartpages/';
        break;
      case webServices.WORKFLOW:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/workflow/\' >';
        SOAPAction = constants.SCHEMASharePoint + '/soap/workflow/';
        break;
      default:
        constants.SOAPEnvelope.opheader += 'xmlns=\'' + constants.SCHEMASharePoint + '/soap/\'>';
        SOAPAction = constants.SCHEMASharePoint + '/soap/';
        break;
      }
      // Add the operation to the SOAPAction and opfooter
      SOAPAction += opt.operation;
      constants.SOAPEnvelope.opfooter = '</' + opt.operation + '>';
      // Build the URL for the Ajax call based on which operation we're calling
      // If the webURL has been provided, then use it, else use the current site
      var ajaxURL = '_vti_bin/' + WSops[opt.operation][0] + '.asmx';
      var webURL = opt.webURL !== undefined ? opt.webURL : opt.webUrl;
      if (webURL.charAt(webURL.length - 1) === constants.SLASH) {
        ajaxURL = webURL + ajaxURL;
      } else if (webURL.length > 0) {
        ajaxURL = webURL + constants.SLASH + ajaxURL;
      } else {
        var thisSite = $().SPServices.SPGetCurrentSite();
        ajaxURL = thisSite + (thisSite.charAt(thisSite.length - 1) === constants.SLASH ? ajaxURL : constants.SLASH + ajaxURL);
      }
      constants.SOAPEnvelope.payload = '';
      // Each operation requires a different set of values.  This switch statement sets them up in the constants.SOAPEnvelope.payload.
      switch (opt.operation) {
      // ALERT OPERATIONS
      case 'GetAlerts':
        break;
      case 'DeleteAlerts':
        constants.SOAPEnvelope.payload += '<IDs>';
        for (i = 0; i < opt.IDs.length; i++) {
          constants.SOAPEnvelope.payload += constants.wrapNode('string', opt.IDs[i]);
        }
        constants.SOAPEnvelope.payload += '</IDs>';
        break;
      // AUTHENTICATION OPERATIONS
      case 'Mode':
        break;
      case 'Login':
        utils.addToPayload(opt, [
          'username',
          'password'
        ]);
        break;
      // COPY OPERATIONS
      case 'CopyIntoItems':
        utils.addToPayload(opt, ['SourceUrl']);
        constants.SOAPEnvelope.payload += '<DestinationUrls>';
        for (i = 0; i < opt.DestinationUrls.length; i++) {
          constants.SOAPEnvelope.payload += utils.wrapNode('string', opt.DestinationUrls[i]);
        }
        constants.SOAPEnvelope.payload += '</DestinationUrls>';
        utils.addToPayload(opt, [
          'Fields',
          'Stream',
          'Results'
        ]);
        break;
      case 'CopyIntoItemsLocal':
        utils.addToPayload(opt, ['SourceUrl']);
        constants.SOAPEnvelope.payload += '<DestinationUrls>';
        for (i = 0; i < opt.DestinationUrls.length; i++) {
          constants.SOAPEnvelope.payload += utils.wrapNode('string', opt.DestinationUrls[i]);
        }
        constants.SOAPEnvelope.payload += '</DestinationUrls>';
        break;
      case 'GetItem':
        utils.addToPayload(opt, [
          'Url',
          'Fields',
          'Stream'
        ]);
        break;
      // FORM OPERATIONS
      case 'GetForm':
        utils.addToPayload(opt, [
          'listName',
          'formUrl'
        ]);
        break;
      case 'GetFormCollection':
        utils.addToPayload(opt, ['listName']);
        break;
      // LIST OPERATIONS
      case 'AddAttachment':
        utils.addToPayload(opt, [
          'listName',
          'listItemID',
          'fileName',
          'attachment'
        ]);
        break;
      case 'AddDiscussionBoardItem':
        utils.addToPayload(opt, [
          'listName',
          'message'
        ]);
        break;
      case 'AddList':
        utils.addToPayload(opt, [
          'listName',
          'description',
          'templateID'
        ]);
        break;
      case 'AddListFromFeature':
        utils.addToPayload(opt, [
          'listName',
          'description',
          'featureID',
          'templateID'
        ]);
        break;
      case 'ApplyContentTypeToList':
        utils.addToPayload(opt, [
          'webUrl',
          'contentTypeId',
          'listName'
        ]);
        break;
      case 'CheckInFile':
        utils.addToPayload(opt, [
          'pageUrl',
          'comment',
          'CheckinType'
        ]);
        break;
      case 'CheckOutFile':
        utils.addToPayload(opt, [
          'pageUrl',
          'checkoutToLocal',
          'lastmodified'
        ]);
        break;
      case 'CreateContentType':
        utils.addToPayload(opt, [
          'listName',
          'displayName',
          'parentType',
          'fields',
          'contentTypeProperties',
          'addToView'
        ]);
        break;
      case 'DeleteAttachment':
        utils.addToPayload(opt, [
          'listName',
          'listItemID',
          'url'
        ]);
        break;
      case 'DeleteContentType':
        utils.addToPayload(opt, [
          'listName',
          'contentTypeId'
        ]);
        break;
      case 'DeleteContentTypeXmlDocument':
        utils.addToPayload(opt, [
          'listName',
          'contentTypeId',
          'documentUri'
        ]);
        break;
      case 'DeleteList':
        utils.addToPayload(opt, ['listName']);
        break;
      case 'GetAttachmentCollection':
        utils.addToPayload(opt, [
          'listName',
          [
            'listItemID',
            'ID'
          ]
        ]);
        break;
      case 'GetList':
        utils.addToPayload(opt, ['listName']);
        break;
      case 'GetListAndView':
        utils.addToPayload(opt, [
          'listName',
          'viewName'
        ]);
        break;
      case 'GetListCollection':
        break;
      case 'GetListContentType':
        utils.addToPayload(opt, [
          'listName',
          'contentTypeId'
        ]);
        break;
      case 'GetListContentTypes':
        utils.addToPayload(opt, ['listName']);
        break;
      case 'GetListItems':
        utils.addToPayload(opt, [
          'listName',
          'viewName',
          [
            'query',
            'CAMLQuery'
          ],
          [
            'viewFields',
            'CAMLViewFields'
          ],
          [
            'rowLimit',
            'CAMLRowLimit'
          ],
          [
            'queryOptions',
            'CAMLQueryOptions'
          ]
        ]);
        break;
      case 'GetListItemChanges':
        utils.addToPayload(opt, [
          'listName',
          'viewFields',
          'since',
          'contains'
        ]);
        break;
      case 'GetListItemChangesSinceToken':
        utils.addToPayload(opt, [
          'listName',
          'viewName',
          [
            'query',
            'CAMLQuery'
          ],
          [
            'viewFields',
            'CAMLViewFields'
          ],
          [
            'rowLimit',
            'CAMLRowLimit'
          ],
          [
            'queryOptions',
            'CAMLQueryOptions'
          ],
          {
            name: 'changeToken',
            sendNull: false
          },
          {
            name: 'contains',
            sendNull: false
          }
        ]);
        break;
      case 'GetVersionCollection':
        utils.addToPayload(opt, [
          'strlistID',
          'strlistItemID',
          'strFieldName'
        ]);
        break;
      case 'UndoCheckOut':
        utils.addToPayload(opt, ['pageUrl']);
        break;
      case 'UpdateContentType':
        utils.addToPayload(opt, [
          'listName',
          'contentTypeId',
          'contentTypeProperties',
          'newFields',
          'updateFields',
          'deleteFields',
          'addToView'
        ]);
        break;
      case 'UpdateContentTypesXmlDocument':
        utils.addToPayload(opt, [
          'listName',
          'newDocument'
        ]);
        break;
      case 'UpdateContentTypeXmlDocument':
        utils.addToPayload(opt, [
          'listName',
          'contentTypeId',
          'newDocument'
        ]);
        break;
      case 'UpdateList':
        utils.addToPayload(opt, [
          'listName',
          'listProperties',
          'newFields',
          'updateFields',
          'deleteFields',
          'listVersion'
        ]);
        break;
      case 'UpdateListItems':
        utils.addToPayload(opt, ['listName']);
        if (typeof opt.updates !== 'undefined' && opt.updates.length > 0) {
          utils.addToPayload(opt, ['updates']);
        } else {
          constants.SOAPEnvelope.payload += '<updates><Batch OnError=\'Continue\'><Method ID=\'1\' Cmd=\'' + opt.batchCmd + '\'>';
          for (i = 0; i < opt.valuepairs.length; i++) {
            constants.SOAPEnvelope.payload += '<Field Name=\'' + opt.valuepairs[i][0] + '\'>' + utils.escapeColumnValue(opt.valuepairs[i][1]) + '</Field>';
          }
          if (opt.batchCmd !== 'New') {
            constants.SOAPEnvelope.payload += '<Field Name=\'ID\'>' + opt.ID + '</Field>';
          }
          constants.SOAPEnvelope.payload += '</Method></Batch></updates>';
        }
        break;
      // MEETINGS OPERATIONS
      case 'AddMeeting':
        utils.addToPayload(opt, [
          'organizerEmail',
          'uid',
          'sequence',
          'utcDateStamp',
          'title',
          'location',
          'utcDateStart',
          'utcDateEnd',
          'nonGregorian'
        ]);
        break;
      case 'CreateWorkspace':
        utils.addToPayload(opt, [
          'title',
          'templateName',
          'lcid',
          'timeZoneInformation'
        ]);
        break;
      case 'RemoveMeeting':
        utils.addToPayload(opt, [
          'recurrenceId',
          'uid',
          'sequence',
          'utcDateStamp',
          'cancelMeeting'
        ]);
        break;
      case 'SetWorkspaceTitle':
        utils.addToPayload(opt, ['title']);
        break;
      // OFFICIALFILE OPERATIONS
      case 'GetRecordRouting':
        utils.addToPayload(opt, ['recordRouting']);
        break;
      case 'GetRecordRoutingCollection':
        break;
      case 'GetServerInfo':
        break;
      case 'SubmitFile':
        utils.addToPayload(opt, ['fileToSubmit'], ['properties'], ['recordRouting'], ['sourceUrl'], ['userName']);
        break;
      // PEOPLE OPERATIONS
      case 'ResolvePrincipals':
        utils.addToPayload(opt, [
          'principalKeys',
          'principalType',
          'addToUserInfoList'
        ]);
        break;
      case 'SearchPrincipals':
        utils.addToPayload(opt, [
          'searchText',
          'maxResults',
          'principalType'
        ]);
        break;
      // PERMISSION OPERATIONS
      case 'AddPermission':
        utils.addToPayload(opt, [
          'objectName',
          'objectType',
          'permissionIdentifier',
          'permissionType',
          'permissionMask'
        ]);
        break;
      case 'AddPermissionCollection':
        utils.addToPayload(opt, [
          'objectName',
          'objectType',
          'permissionsInfoXml'
        ]);
        break;
      case 'GetPermissionCollection':
        utils.addToPayload(opt, [
          'objectName',
          'objectType'
        ]);
        break;
      case 'RemovePermission':
        utils.addToPayload(opt, [
          'objectName',
          'objectType',
          'permissionIdentifier',
          'permissionType'
        ]);
        break;
      case 'RemovePermissionCollection':
        utils.addToPayload(opt, [
          'objectName',
          'objectType',
          'memberIdsXml'
        ]);
        break;
      case 'UpdatePermission':
        utils.addToPayload(opt, [
          'objectName',
          'objectType',
          'permissionIdentifier',
          'permissionType',
          'permissionMask'
        ]);
        break;
      // PUBLISHEDLINKSSERVICE OPERATIONS
      case 'GetLinks':
        break;
      // SEARCH OPERATIONS
      case 'GetPortalSearchInfo':
        constants.SOAPEnvelope.opheader = '<' + opt.operation + ' xmlns=\'http://microsoft.com/webservices/OfficeServer/QueryService\'>';
        SOAPAction = 'http://microsoft.com/webservices/OfficeServer/QueryService/' + opt.operation;
        break;
      case 'GetQuerySuggestions':
        constants.SOAPEnvelope.opheader = '<' + opt.operation + ' xmlns=\'http://microsoft.com/webservices/OfficeServer/QueryService\'>';
        SOAPAction = 'http://microsoft.com/webservices/OfficeServer/QueryService/' + opt.operation;
        constants.SOAPEnvelope.payload += utils.wrapNode('queryXml', constants.encodeXml(opt.queryXml));
        break;
      case 'GetSearchMetadata':
        constants.SOAPEnvelope.opheader = '<' + opt.operation + ' xmlns=\'http://microsoft.com/webservices/OfficeServer/QueryService\'>';
        SOAPAction = 'http://microsoft.com/webservices/OfficeServer/QueryService/' + opt.operation;
        break;
      case 'Query':
        constants.SOAPEnvelope.payload += utils.wrapNode('queryXml', constants.encodeXml(opt.queryXml));
        break;
      case 'QueryEx':
        constants.SOAPEnvelope.opheader = '<' + opt.operation + ' xmlns=\'http://microsoft.com/webservices/OfficeServer/QueryService\'>';
        SOAPAction = 'http://microsoft.com/webservices/OfficeServer/QueryService/' + opt.operation;
        constants.SOAPEnvelope.payload += utils.wrapNode('queryXml', constants.encodeXml(opt.queryXml));
        break;
      case 'Registration':
        constants.SOAPEnvelope.payload += utils.wrapNode('registrationXml', constants.encodeXml(opt.registrationXml));
        break;
      case 'Status':
        break;
      // SHAREPOINTDIAGNOSTICS OPERATIONS
      case 'SendClientScriptErrorReport':
        utils.addToPayload(opt, [
          'message',
          'file',
          'line',
          'client',
          'stack',
          'team',
          'originalFile'
        ]);
        break;
      // SITEDATA OPERATIONS
      case 'EnumerateFolder':
        utils.addToPayload(opt, ['strFolderUrl']);
        break;
      case 'GetAttachments':
        utils.addToPayload(opt, [
          'strListName',
          'strItemId'
        ]);
        break;
      case 'SiteDataGetList':
        utils.addToPayload(opt, ['strListName']);
        // Because this operation has a name which duplicates the Lists WS, need to handle
        constants.SOAPEnvelope = constants.siteDataFixSOAPEnvelope(constants.SOAPEnvelope, opt.operation);
        break;
      case 'SiteDataGetListCollection':
        // Because this operation has a name which duplicates the Lists WS, need to handle
        constants.SOAPEnvelope = constants.siteDataFixSOAPEnvelope(constants.SOAPEnvelope, opt.operation);
        break;
      case 'SiteDataGetSite':
        // Because this operation has a name which duplicates the Lists WS, need to handle
        constants.SOAPEnvelope = constants.siteDataFixSOAPEnvelope(constants.SOAPEnvelope, opt.operation);
        break;
      case 'SiteDataGetSiteUrl':
        utils.addToPayload(opt, ['Url']);
        // Because this operation has a name which duplicates the Lists WS, need to handle
        constants.SOAPEnvelope = constants.siteDataFixSOAPEnvelope(constants.SOAPEnvelope, opt.operation);
        break;
      case 'SiteDataGetWeb':
        // Because this operation has a name which duplicates the Lists WS, need to handle
        constants.SOAPEnvelope = constants.siteDataFixSOAPEnvelope(constants.SOAPEnvelope, opt.operation);
        break;
      // SITES OPERATIONS
      case 'CreateWeb':
        utils.addToPayload(opt, [
          'url',
          'title',
          'description',
          'templateName',
          'language',
          'languageSpecified',
          'locale',
          'localeSpecified',
          'collationLocale',
          'collationLocaleSpecified',
          'uniquePermissions',
          'uniquePermissionsSpecified',
          'anonymous',
          'anonymousSpecified',
          'presence',
          'presenceSpecified'
        ]);
        break;
      case 'DeleteWeb':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetSite':
        utils.addToPayload(opt, ['SiteUrl']);
        break;
      case 'GetSiteTemplates':
        utils.addToPayload(opt, [
          'LCID',
          'TemplateList'
        ]);
        break;
      // SOCIALDATASERVICE OPERATIONS
      case 'AddComment':
        utils.addToPayload(opt, [
          'url',
          'comment',
          'isHighPriority',
          'title'
        ]);
        break;
      case 'AddTag':
        utils.addToPayload(opt, [
          'url',
          'termID',
          'title',
          'isPrivate'
        ]);
        break;
      case 'AddTagByKeyword':
        utils.addToPayload(opt, [
          'url',
          'keyword',
          'title',
          'isPrivate'
        ]);
        break;
      case 'CountCommentsOfUser':
        utils.addToPayload(opt, ['userAccountName']);
        break;
      case 'CountCommentsOfUserOnUrl':
        utils.addToPayload(opt, [
          'userAccountName',
          'url'
        ]);
        break;
      case 'CountCommentsOnUrl':
        utils.addToPayload(opt, ['url']);
        break;
      case 'CountRatingsOnUrl':
        utils.addToPayload(opt, ['url']);
        break;
      case 'CountTagsOfUser':
        utils.addToPayload(opt, ['userAccountName']);
        break;
      case 'DeleteComment':
        utils.addToPayload(opt, [
          'url',
          'lastModifiedTime'
        ]);
        break;
      case 'DeleteRating':
        utils.addToPayload(opt, ['url']);
        break;
      case 'DeleteTag':
        utils.addToPayload(opt, [
          'url',
          'termID'
        ]);
        break;
      case 'DeleteTagByKeyword':
        utils.addToPayload(opt, [
          'url',
          'keyword'
        ]);
        break;
      case 'DeleteTags':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetAllTagTerms':
        utils.addToPayload(opt, ['maximumItemsToReturn']);
        break;
      case 'GetAllTagTermsForUrlFolder':
        utils.addToPayload(opt, [
          'urlFolder',
          'maximumItemsToReturn'
        ]);
        break;
      case 'GetAllTagUrls':
        utils.addToPayload(opt, ['termID']);
        break;
      case 'GetAllTagUrlsByKeyword':
        utils.addToPayload(opt, ['keyword']);
        break;
      case 'GetCommentsOfUser':
        utils.addToPayload(opt, [
          'userAccountName',
          'maximumItemsToReturn',
          'startIndex'
        ]);
        break;
      case 'GetCommentsOfUserOnUrl':
        utils.addToPayload(opt, [
          'userAccountName',
          'url'
        ]);
        break;
      case 'GetCommentsOnUrl':
        utils.addToPayload(opt, [
          'url',
          'maximumItemsToReturn',
          'startIndex'
        ]);
        if (typeof opt.excludeItemsTime !== 'undefined' && opt.excludeItemsTime.length > 0) {
          constants.SOAPEnvelope.payload += utils.wrapNode('excludeItemsTime', opt.excludeItemsTime);
        }
        break;
      case 'GetRatingAverageOnUrl':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetRatingOfUserOnUrl':
        utils.addToPayload(opt, [
          'userAccountName',
          'url'
        ]);
        break;
      case 'GetRatingOnUrl':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetRatingsOfUser':
        utils.addToPayload(opt, ['userAccountName']);
        break;
      case 'GetRatingsOnUrl':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetSocialDataForFullReplication':
        utils.addToPayload(opt, ['userAccountName']);
        break;
      case 'GetTags':
        utils.addToPayload(opt, ['url']);
        break;
      case 'GetTagsOfUser':
        utils.addToPayload(opt, [
          'userAccountName',
          'maximumItemsToReturn',
          'startIndex'
        ]);
        break;
      case 'GetTagTerms':
        utils.addToPayload(opt, ['maximumItemsToReturn']);
        break;
      case 'GetTagTermsOfUser':
        utils.addToPayload(opt, [
          'userAccountName',
          'maximumItemsToReturn'
        ]);
        break;
      case 'GetTagTermsOnUrl':
        utils.addToPayload(opt, [
          'url',
          'maximumItemsToReturn'
        ]);
        break;
      case 'GetTagUrls':
        utils.addToPayload(opt, ['termID']);
        break;
      case 'GetTagUrlsByKeyword':
        utils.addToPayload(opt, ['keyword']);
        break;
      case 'GetTagUrlsOfUser':
        utils.addToPayload(opt, [
          'termID',
          'userAccountName'
        ]);
        break;
      case 'GetTagUrlsOfUserByKeyword':
        utils.addToPayload(opt, [
          'keyword',
          'userAccountName'
        ]);
        break;
      case 'SetRating':
        utils.addToPayload(opt, [
          'url',
          'rating',
          'title',
          'analysisDataEntry'
        ]);
        break;
      case 'UpdateComment':
        utils.addToPayload(opt, [
          'url',
          'lastModifiedTime',
          'comment',
          'isHighPriority'
        ]);
        break;
      // SPELLCHECK OPERATIONS
      case 'SpellCheck':
        utils.addToPayload(opt, [
          'chunksToSpell',
          'declaredLanguage',
          'useLad'
        ]);
        break;
      // TAXONOMY OPERATIONS
      case 'AddTerms':
        utils.addToPayload(opt, [
          'sharedServiceId',
          'termSetId',
          'lcid',
          'newTerms'
        ]);
        break;
      case 'GetChildTermsInTerm':
        utils.addToPayload(opt, [
          'sspId',
          'lcid',
          'termId',
          'termSetId'
        ]);
        break;
      case 'GetChildTermsInTermSet':
        utils.addToPayload(opt, [
          'sspId',
          'lcid',
          'termSetId'
        ]);
        break;
      case 'GetKeywordTermsByGuids':
        utils.addToPayload(opt, [
          'termIds',
          'lcid'
        ]);
        break;
      case 'GetTermsByLabel':
        utils.addToPayload(opt, [
          'label',
          'lcid',
          'matchOption',
          'resultCollectionSize',
          'termIds',
          'addIfNotFound'
        ]);
        break;
      case 'GetTermSets':
        utils.addToPayload(opt, [
          'sharedServiceIds',
          'termSetIds',
          'lcid',
          'clientTimeStamps',
          'clientVersions'
        ]);
        break;
      // USERS AND GROUPS OPERATIONS
      case 'AddGroup':
        utils.addToPayload(opt, [
          'groupName',
          'ownerIdentifier',
          'ownerType',
          'defaultUserLoginName',
          'description'
        ]);
        break;
      case 'AddGroupToRole':
        utils.addToPayload(opt, [
          'groupName',
          'roleName'
        ]);
        break;
      case 'AddRole':
        utils.addToPayload(opt, [
          'roleName',
          'description',
          'permissionMask'
        ]);
        break;
      case 'AddRoleDef':
        utils.addToPayload(opt, [
          'roleName',
          'description',
          'permissionMask'
        ]);
        break;
      case 'AddUserCollectionToGroup':
        utils.addToPayload(opt, [
          'groupName',
          'usersInfoXml'
        ]);
        break;
      case 'AddUserCollectionToRole':
        utils.addToPayload(opt, [
          'roleName',
          'usersInfoXml'
        ]);
        break;
      case 'AddUserToGroup':
        utils.addToPayload(opt, [
          'groupName',
          'userName',
          'userLoginName',
          'userEmail',
          'userNotes'
        ]);
        break;
      case 'AddUserToRole':
        utils.addToPayload(opt, [
          'roleName',
          'userName',
          'userLoginName',
          'userEmail',
          'userNotes'
        ]);
        break;
      case 'GetAllUserCollectionFromWeb':
        break;
      case 'GetGroupCollection':
        utils.addToPayload(opt, ['groupNamesXml']);
        break;
      case 'GetGroupCollectionFromRole':
        utils.addToPayload(opt, ['roleName']);
        break;
      case 'GetGroupCollectionFromSite':
        break;
      case 'GetGroupCollectionFromUser':
        utils.addToPayload(opt, ['userLoginName']);
        break;
      case 'GetGroupCollectionFromWeb':
        break;
      case 'GetGroupInfo':
        utils.addToPayload(opt, ['groupName']);
        break;
      case 'GetRoleCollection':
        utils.addToPayload(opt, ['roleNamesXml']);
        break;
      case 'GetRoleCollectionFromGroup':
        utils.addToPayload(opt, ['groupName']);
        break;
      case 'GetRoleCollectionFromUser':
        utils.addToPayload(opt, ['userLoginName']);
        break;
      case 'GetRoleCollectionFromWeb':
        break;
      case 'GetRoleInfo':
        utils.addToPayload(opt, ['roleName']);
        break;
      case 'GetRolesAndPermissionsForCurrentUser':
        break;
      case 'GetRolesAndPermissionsForSite':
        break;
      case 'GetUserCollection':
        utils.addToPayload(opt, ['userLoginNamesXml']);
        break;
      case 'GetUserCollectionFromGroup':
        utils.addToPayload(opt, ['groupName']);
        break;
      case 'GetUserCollectionFromRole':
        utils.addToPayload(opt, ['roleName']);
        break;
      case 'GetUserCollectionFromSite':
        break;
      case 'GetUserCollectionFromWeb':
        break;
      case 'GetUserInfo':
        utils.addToPayload(opt, ['userLoginName']);
        break;
      case 'GetUserLoginFromEmail':
        utils.addToPayload(opt, ['emailXml']);
        break;
      case 'RemoveGroup':
        utils.addToPayload(opt, ['groupName']);
        break;
      case 'RemoveGroupFromRole':
        utils.addToPayload(opt, [
          'roleName',
          'groupName'
        ]);
        break;
      case 'RemoveRole':
        utils.addToPayload(opt, ['roleName']);
        break;
      case 'RemoveUserCollectionFromGroup':
        utils.addToPayload(opt, [
          'groupName',
          'userLoginNamesXml'
        ]);
        break;
      case 'RemoveUserCollectionFromRole':
        utils.addToPayload(opt, [
          'roleName',
          'userLoginNamesXml'
        ]);
        break;
      case 'RemoveUserCollectionFromSite':
        utils.addToPayload(opt, ['userLoginNamesXml']);
        break;
      case 'RemoveUserFromGroup':
        utils.addToPayload(opt, [
          'groupName',
          'userLoginName'
        ]);
        break;
      case 'RemoveUserFromRole':
        utils.addToPayload(opt, [
          'roleName',
          'userLoginName'
        ]);
        break;
      case 'RemoveUserFromSite':
        utils.addToPayload(opt, ['userLoginName']);
        break;
      case 'RemoveUserFromWeb':
        utils.addToPayload(opt, ['userLoginName']);
        break;
      case 'UpdateGroupInfo':
        utils.addToPayload(opt, [
          'oldGroupName',
          'groupName',
          'ownerIdentifier',
          'ownerType',
          'description'
        ]);
        break;
      case 'UpdateRoleDefInfo':
        utils.addToPayload(opt, [
          'oldRoleName',
          'roleName',
          'description',
          'permissionMask'
        ]);
        break;
      case 'UpdateRoleInfo':
        utils.addToPayload(opt, [
          'oldRoleName',
          'roleName',
          'description',
          'permissionMask'
        ]);
        break;
      case 'UpdateUserInfo':
        utils.addToPayload(opt, [
          'userLoginName',
          'userName',
          'userEmail',
          'userNotes'
        ]);
        break;
      // USERPROFILESERVICE OPERATIONS
      case 'AddColleague':
        utils.addToPayload(opt, [
          'accountName',
          'colleagueAccountName',
          'group',
          'privacy',
          'isInWorkGroup'
        ]);
        break;
      case 'AddLink':
        utils.addToPayload(opt, [
          'accountName',
          'name',
          'url',
          'group',
          'privacy'
        ]);
        break;
      case 'AddMembership':
        utils.addToPayload(opt, [
          'accountName',
          'membershipInfo',
          'group',
          'privacy'
        ]);
        break;
      case 'AddPinnedLink':
        utils.addToPayload(opt, [
          'accountName',
          'name',
          'url'
        ]);
        break;
      case 'CreateMemberGroup':
        utils.addToPayload(opt, ['membershipInfo']);
        break;
      case 'CreateUserProfileByAccountName':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetCommonColleagues':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetCommonManager':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetCommonMemberships':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetInCommon':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetPropertyChoiceList':
        utils.addToPayload(opt, ['propertyName']);
        break;
      case 'GetUserColleagues':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetUserLinks':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetUserMemberships':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetUserPinnedLinks':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'GetUserProfileByGuid':
        utils.addToPayload(opt, ['guid']);
        break;
      case 'GetUserProfileByIndex':
        utils.addToPayload(opt, ['index']);
        break;
      case 'GetUserProfileByName':
        // Note that this operation is inconsistent with the others, using AccountName rather than accountName
        if (typeof opt.accountName !== 'undefined' && opt.accountName.length > 0) {
          utils.addToPayload(opt, [[
              'AccountName',
              'accountName'
            ]]);
        } else {
          utils.addToPayload(opt, ['AccountName']);
        }
        break;
      case 'GetUserProfileCount':
        break;
      case 'GetUserProfileSchema':
        break;
      case 'GetUserPropertyByAccountName':
        utils.addToPayload(opt, [
          'accountName',
          'propertyName'
        ]);
        break;
      case 'ModifyUserPropertyByAccountName':
        utils.addToPayload(opt, [
          'accountName',
          'newData'
        ]);
        break;
      case 'RemoveAllColleagues':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'RemoveAllLinks':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'RemoveAllMemberships':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'RemoveAllPinnedLinks':
        utils.addToPayload(opt, ['accountName']);
        break;
      case 'RemoveColleague':
        utils.addToPayload(opt, [
          'accountName',
          'colleagueAccountName'
        ]);
        break;
      case 'RemoveLink':
        utils.addToPayload(opt, [
          'accountName',
          'id'
        ]);
        break;
      case 'RemoveMembership':
        utils.addToPayload(opt, [
          'accountName',
          'sourceInternal',
          'sourceReference'
        ]);
        break;
      case 'RemovePinnedLink':
        utils.addToPayload(opt, [
          'accountName',
          'id'
        ]);
        break;
      case 'UpdateColleaguePrivacy':
        utils.addToPayload(opt, [
          'accountName',
          'colleagueAccountName',
          'newPrivacy'
        ]);
        break;
      case 'UpdateLink':
        utils.addToPayload(opt, [
          'accountName',
          'data'
        ]);
        break;
      case 'UpdateMembershipPrivacy':
        utils.addToPayload(opt, [
          'accountName',
          'sourceInternal',
          'sourceReference',
          'newPrivacy'
        ]);
        break;
      case 'UpdatePinnedLink ':
        utils.addToPayload(opt, [
          'accountName',
          'data'
        ]);
        break;
      // VERSIONS OPERATIONS
      case 'DeleteAllVersions':
        utils.addToPayload(opt, ['fileName']);
        break;
      case 'DeleteVersion':
        utils.addToPayload(opt, [
          'fileName',
          'fileVersion'
        ]);
        break;
      case 'GetVersions':
        utils.addToPayload(opt, ['fileName']);
        break;
      case 'RestoreVersion':
        utils.addToPayload(opt, [
          'fileName',
          'fileVersion'
        ]);
        break;
      // VIEW OPERATIONS
      case 'AddView':
        utils.addToPayload(opt, [
          'listName',
          'viewName',
          'viewFields',
          'query',
          'rowLimit',
          'rowLimit',
          'type',
          'makeViewDefault'
        ]);
        break;
      case 'DeleteView':
        utils.addToPayload(opt, [
          'listName',
          'viewName'
        ]);
        break;
      case 'GetView':
        utils.addToPayload(opt, [
          'listName',
          'viewName'
        ]);
        break;
      case 'GetViewCollection':
        utils.addToPayload(opt, ['listName']);
        break;
      case 'GetViewHtml':
        utils.addToPayload(opt, [
          'listName',
          'viewName'
        ]);
        break;
      case 'UpdateView':
        utils.addToPayload(opt, [
          'listName',
          'viewName',
          'viewProperties',
          'query',
          'viewFields',
          'aggregations',
          'formats',
          'rowLimit'
        ]);
        break;
      case 'UpdateViewHtml':
        utils.addToPayload(opt, [
          'listName',
          'viewName',
          'viewProperties',
          'toolbar',
          'viewHeader',
          'viewBody',
          'viewFooter',
          'viewEmpty',
          'rowLimitExceeded',
          'query',
          'viewFields',
          'aggregations',
          'formats',
          'rowLimit'
        ]);
        break;
      // WEBPARTPAGES OPERATIONS
      case 'AddWebPart':
        utils.addToPayload(opt, [
          'pageUrl',
          'webPartXml',
          'storage'
        ]);
        break;
      case 'AddWebPartToZone':
        utils.addToPayload(opt, [
          'pageUrl',
          'webPartXml',
          'storage',
          'zoneId',
          'zoneIndex'
        ]);
        break;
      case 'DeleteWebPart':
        utils.addToPayload(opt, [
          'pageUrl',
          'storageKey',
          'storage'
        ]);
        break;
      case 'GetWebPart2':
        utils.addToPayload(opt, [
          'pageUrl',
          'storageKey',
          'storage',
          'behavior'
        ]);
        break;
      case 'GetWebPartPage':
        utils.addToPayload(opt, [
          'documentName',
          'behavior'
        ]);
        break;
      case 'GetWebPartProperties':
        utils.addToPayload(opt, [
          'pageUrl',
          'storage'
        ]);
        break;
      case 'GetWebPartProperties2':
        utils.addToPayload(opt, [
          'pageUrl',
          'storage',
          'behavior'
        ]);
        break;
      case 'SaveWebPart2':
        utils.addToPayload(opt, [
          'pageUrl',
          'storageKey',
          'webPartXml',
          'storage',
          'allowTypeChange'
        ]);
        break;
      // WEBS OPERATIONS
      case 'WebsCreateContentType':
        utils.addToPayload(opt, [
          'displayName',
          'parentType',
          'newFields',
          'contentTypeProperties'
        ]);
        break;
      case 'GetColumns':
        utils.addToPayload(opt, ['webUrl']);
        break;
      case 'GetContentType':
        utils.addToPayload(opt, ['contentTypeId']);
        break;
      case 'GetContentTypes':
        break;
      case 'GetCustomizedPageStatus':
        utils.addToPayload(opt, ['fileUrl']);
        break;
      case 'GetListTemplates':
        break;
      case 'GetObjectIdFromUrl':
        utils.addToPayload(opt, ['objectUrl']);
        break;
      case 'GetWeb':
        utils.addToPayload(opt, [[
            'webUrl',
            'webURL'
          ]]);
        break;
      case 'GetWebCollection':
        break;
      case 'GetAllSubWebCollection':
        break;
      case 'UpdateColumns':
        utils.addToPayload(opt, [
          'newFields',
          'updateFields',
          'deleteFields'
        ]);
        break;
      case 'WebsUpdateContentType':
        utils.addToPayload(opt, [
          'contentTypeId',
          'contentTypeProperties',
          'newFields',
          'updateFields',
          'deleteFields'
        ]);
        break;
      case 'WebUrlFromPageUrl':
        utils.addToPayload(opt, [[
            'pageUrl',
            'pageURL'
          ]]);
        break;
      // WORKFLOW OPERATIONS
      case 'AlterToDo':
        utils.addToPayload(opt, [
          'item',
          'todoId',
          'todoListId',
          'taskData'
        ]);
        break;
      case 'ClaimReleaseTask':
        utils.addToPayload(opt, [
          'item',
          'taskId',
          'listId',
          'fClaim'
        ]);
        break;
      case 'GetTemplatesForItem':
        utils.addToPayload(opt, ['item']);
        break;
      case 'GetToDosForItem':
        utils.addToPayload(opt, ['item']);
        break;
      case 'GetWorkflowDataForItem':
        utils.addToPayload(opt, ['item']);
        break;
      case 'GetWorkflowTaskData':
        utils.addToPayload(opt, [
          'item',
          'listId',
          'taskId'
        ]);
        break;
      case 'StartWorkflow':
        utils.addToPayload(opt, [
          'item',
          'templateId',
          'workflowParameters'
        ]);
        break;
      default:
        break;
      }
      // Glue together the pieces of the SOAP message
      var msg = constants.SOAPEnvelope.header + constants.SOAPEnvelope.opheader + constants.SOAPEnvelope.payload + constants.SOAPEnvelope.opfooter + constants.SOAPEnvelope.footer;
      // Check to see if we've already cached the results
      var cachedPromise;
      if (opt.cacheXML) {
        cachedPromise = promisesCache[msg];
      }
      if (typeof cachedPromise === 'undefined') {
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
              xhr.setRequestHeader('SOAPAction', SOAPAction);
            }
          },
          // Always a POST
          type: 'POST',
          // Here is the SOAP request we've built above
          data: msg,
          // We're getting XML; tell jQuery so that it doesn't need to do a best guess
          dataType: 'xml',
          // and this is its content type
          contentType: 'text/xml;charset=\'utf-8\'',
          complete: function (xData, Status) {
            // When the call is complete, call the completefunc if there is one
            if ($.isFunction(opt.completefunc)) {
              opt.completefunc(xData, Status);
            }
          }
        });
        if (opt.cacheXML) {
          promisesCache[msg] = p;
        }
        // Return the promise
        return p;
      } else {
        // Call the completefunc if there is one
        if ($.isFunction(opt.completefunc)) {
          cachedPromise.done(function (data, status, jqXHR) {
            opt.completefunc(jqXHR, status);
          });
        }
        // Return the cached promise
        return cachedPromise;
      }
    };
    // End $.fn.SPServices
    // Defaults added as a function in our library means that the caller can override the defaults
    // for their session by calling this function.  Each operation requires a different set of options;
    // we allow for all in a standardized way.
    $.fn.SPServices.defaults = {
      cacheXML: false,
      // If true, we'll cache the XML results with jQuery's .data() function
      operation: '',
      // The Web Service operation
      webURL: '',
      // URL of the target Web
      makeViewDefault: false,
      // true to make the view the default view for the list
      // For operations requiring CAML, these options will override any abstractions
      viewName: '',
      // View name in CAML format.
      CAMLQuery: '',
      // Query in CAML format
      CAMLViewFields: '',
      // View fields in CAML format
      CAMLRowLimit: 0,
      // Row limit as a string representation of an integer
      CAMLQueryOptions: '<QueryOptions></QueryOptions>',
      // Query options in CAML format
      // Abstractions for CAML syntax
      batchCmd: 'Update',
      // Method Cmd for UpdateListItems
      valuepairs: [],
      // Fieldname / Fieldvalue pairs for UpdateListItems
      // As of v0.7.1, removed all options which were assigned an empty string ("")
      DestinationUrls: [],
      // Array of destination URLs for copy operations
      behavior: 'Version3',
      // An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
      storage: 'Shared',
      // A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
      objectType: 'List',
      // objectType for operations which require it
      cancelMeeting: true,
      // true to delete a meeting;false to remove its association with a Meeting Workspace site
      nonGregorian: false,
      // true if the calendar is set to a format other than Gregorian;otherwise, false.
      fClaim: false,
      // Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
      recurrenceId: 0,
      // The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
      sequence: 0,
      // An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
      maximumItemsToReturn: 0,
      // SocialDataService maximumItemsToReturn
      startIndex: 0,
      // SocialDataService startIndex
      isHighPriority: false,
      // SocialDataService isHighPriority
      isPrivate: false,
      // SocialDataService isPrivate
      rating: 1,
      // SocialDataService rating
      maxResults: 10,
      // Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
      principalType: 'User',
      // Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]
      async: true,
      // Allow the user to force async
      completefunc: null  // Function to call on completion
    };  // End $.fn.SPServices.defaults
  }(jquery, src_core_SPServicesutils, src_utils_constants);
  src_core_Version = function ($, constants) {
    // Return the current version of SPServices as a string
    $.fn.SPServices.Version = function () {
      return constants.VERSION;
    };
    // End $.fn.SPServices.Version
    return $;
  }(jquery, src_utils_constants);
  src_utils_SPGetCurrentSite = function ($, utils, constants) {
    // Function to determine the current Web's URL.  We need this for successful Ajax calls.
    // The function is also available as a public function.
    $.fn.SPServices.SPGetCurrentSite = function () {
      // We've already determined the current site...
      if (utils.SPServicesContext().thisSite.length > 0) {
        return utils.SPServicesContext().thisSite;
      }
      // If we still don't know the current site, we call WebUrlFromPageUrlResult.
      var msg = utils.SOAPEnvelope.header + '<WebUrlFromPageUrl xmlns=\'' + constants.SCHEMASharePoint + '/soap/\' ><pageUrl>' + (location.href.indexOf('?') > 0 ? location.href.substr(0, location.href.indexOf('?')) : location.href) + '</pageUrl></WebUrlFromPageUrl>' + utils.SOAPEnvelope.footer;
      $.ajax({
        async: false,
        // Need this to be synchronous so we're assured of a valid value
        url: '/_vti_bin/Webs.asmx',
        type: 'POST',
        data: msg,
        dataType: 'xml',
        contentType: 'text/xml;charset="utf-8"',
        complete: function (xData) {
          utils.SPServicesContext().thisSite = $(xData.responseXML).find('WebUrlFromPageUrlResult').text();
        }
      });
      return utils.SPServicesContext().thisSite;  // Return the URL
    };
    // End $.fn.SPServices.SPGetCurrentSite
    return $;
  }(jquery, src_core_SPServicesutils, src_utils_constants);
  src_utils_SPGetCurrentUser = function ($, utils) {
    // Function which returns the account name for the current user in DOMAIN\username format
    $.fn.SPServices.SPGetCurrentUser = function (options) {
      var opt = $.extend({}, {
        webURL: '',
        // URL of the target Site Collection.  If not specified, the current Web is used.
        fieldName: 'Name',
        // Specifies which field to return from the userdisp.aspx page
        fieldNames: {},
        // Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
        debug: false  // If true, show error messages; if false, run silent
      }, options);
      // The current user's ID is reliably available in an existing JavaScript variable
      if (opt.fieldName === 'ID' && typeof utils.SPServicesContext().thisUserId !== 'undefined') {
        return utils.SPServicesContext().thisUserId;
      }
      var thisField = '';
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
        url: (thisWeb === '/' ? '' : thisWeb) + '/_layouts/userdisp.aspx?Force=True&' + new Date().getTime(),
        complete: function (xData) {
          thisUserDisp = xData;
        }
      });
      for (var i = 0; i < fieldCount; i++) {
        // The current user's ID is reliably available in an existing JavaScript variable
        if (opt.fieldNames[i] === 'ID') {
          thisField = utils.SPServicesContext().thisUserId;
        } else {
          var thisTextValue;
          if (fieldCount > 1) {
            thisTextValue = RegExp('FieldInternalName="' + opt.fieldNames[i] + '"', 'gi');
          } else {
            thisTextValue = RegExp('FieldInternalName="' + opt.fieldName + '"', 'gi');
          }
          $(thisUserDisp.responseText).find('table.ms-formtable td[id^=\'SPField\']').each(function () {
            if (thisTextValue.test($(this).html())) {
              // Each fieldtype contains a different data type, as indicated by the id
              switch ($(this).attr('id')) {
              case 'SPFieldText':
                thisField = $(this).text();
                break;
              case 'SPFieldNote':
                thisField = $(this).find('div').html();
                break;
              case 'SPFieldURL':
                thisField = $(this).find('img').attr('src');
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
        if (opt.fieldNames[i] !== 'ID') {
          thisField = typeof thisField !== 'undefined' ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
        }
        if (fieldCount > 1) {
          theseFields[opt.fieldNames[i]] = thisField;
        }
      }
      return fieldCount > 1 ? theseFields : thisField;
    };
    // End $.fn.SPServices.SPGetCurrentUser
    return $;
  }(jquery, src_core_SPServicesutils);
  src_utils_SPFilterNode = function ($) {
    // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
    // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
    // for performance details.
    $.fn.SPFilterNode = function (name) {
      return this.find('*').filter(function () {
        return this.nodeName === name;
      });
    };
    // End $.fn.SPFilterNode
    return $;
  }(jquery);
  src_utils_SPGetListItemsJson = function ($, utils, constants) {
    // SPGetListItemsJson retrieves items from a list in JSON format
    $.fn.SPServices.SPGetListItemsJson = function (options) {
      var opt = $.extend({}, {
        webURL: '',
        // [Optional] URL of the target Web.  If not specified, the current Web is used.
        listName: '',
        viewName: '',
        CAMLQuery: '',
        CAMLViewFields: '',
        CAMLRowLimit: '',
        CAMLQueryOptions: '',
        changeToken: '',
        // [Optional] If provided, will be passed with the request
        contains: '',
        // CAML snippet for an additional filter
        mapping: null,
        // If provided, use this mapping rather than creating one automagically from the list schema
        mappingOverrides: null,
        // Pass in specific column overrides here
        debug: false  // If true, show error messages;if false, run silent
      }, $().SPServices.defaults, options);
      var newChangeToken;
      var thisListJsonMapping = {};
      var deletedIds = [];
      var result = $.Deferred();
      // Call GetListItems to find all of the items matching the CAMLQuery
      var thisData = $().SPServices({
        operation: 'GetListItemChangesSinceToken',
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
        var mappingKey = 'SPGetListItemsJson' + opt.webURL + opt.listName;
        // We're going to use this multiple times
        var responseXml = $(thisData.responseXML);
        // Get the changeToken
        newChangeToken = responseXml.find('Changes').attr('LastChangeToken');
        // Some of the existing items may have been deleted
        responseXml.find('listitems Changes Id[ChangeType=\'Delete\']').each(function () {
          deletedIds.push($(this).text());
        });
        if (opt.mapping === null) {
          // Automagically create the mapping
          responseXml.find('List > Fields > Field').each(function () {
            var thisField = $(this);
            var thisType = thisField.attr('Type');
            // Only work with known column types
            if ($.inArray(thisType, constants.spListFieldTypes) >= 0) {
              thisListJsonMapping['ows_' + thisField.attr('Name')] = {
                mappedName: thisField.attr('Name'),
                objectType: thisField.attr('Type')
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
        var jsonData = responseXml.SPFilterNode('z:row').SPXmlToJson({
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
    };
    // End $.fn.SPServices.SPGetListItemsJson
    return $;
  }(jquery, src_core_SPServicesutils, src_utils_constants);
  src_utils_SPXmlToJson = function ($, utils, constants) {
    // This function converts an XML node set to JSON
    // Initial implementation focuses only on GetListItems
    $.fn.SPXmlToJson = function (options) {
      var opt = $.extend({}, {
        mapping: {},
        // columnName: mappedName: "mappedName", objectType: "objectType"
        includeAllAttrs: false,
        // If true, return all attributes, regardless whether they are in the mapping
        removeOws: true,
        // Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
        sparse: false  // If true, empty ("") values will not be returned
      }, options);
      var attrNum;
      var jsonObject = [];
      this.each(function () {
        var row = {};
        var rowAttrs = this.attributes;
        if (!opt.sparse) {
          // Bring back all mapped columns, even those with no value
          $.each(opt.mapping, function () {
            row[this.mappedName] = '';
          });
        }
        // Parse through the element's attributes
        for (attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
          var thisAttrName = rowAttrs[attrNum].name;
          var thisMapping = opt.mapping[thisAttrName];
          var thisObjectName = typeof thisMapping !== 'undefined' ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split('ows_')[1] : thisAttrName;
          var thisObjectType = typeof thisMapping !== 'undefined' ? thisMapping.objectType : undefined;
          if (opt.includeAllAttrs || thisMapping !== undefined) {
            row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType);
          }
        }
        // Push this item into the JSON Object
        jsonObject.push(row);
      });
      // Return the JSON object
      return jsonObject;
    };
    // End $.fn.SPServices.SPXmlToJson
    function attrToJson(v, objectType) {
      var result = {
        /* Generic [Reusable] Functions */
        'Integer': intToJsonObject(v),
        'Number': floatToJsonObject(v),
        'Boolean': booleanToJsonObject(v),
        'DateTime': dateToJsonObject(v),
        'User': userToJsonObject(v),
        'UserMulti': userMultiToJsonObject(v),
        'Lookup': lookupToJsonObject(v),
        'lookupMulti': lookupMultiToJsonObject(v),
        'MultiChoice': choiceMultiToJsonObject(v),
        'Calculated': calcToJsonObject(v),
        'Attachments': attachmentsToJsonObject(v),
        'URL': urlToJsonObject(v),
        'JSON': jsonToJsonObject(v),
        // Special case for text JSON stored in text columns
        /* These objectTypes reuse above functions */
        'Text': result.Default(v),
        'Counter': result.Integer(v),
        'datetime': result.DateTime(v),
        // For calculated columns, stored as datetime;#value
        'AllDayEvent': result.Boolean(v),
        'Recurrence': result.Boolean(v),
        'Currency': result.Number(v),
        'float': result.Number(v),
        // For calculated columns, stored as float;#value
        'RelatedItems': result.JSON(v),
        'Default': v
      };
      if (result[objectType] !== undefined) {
        return result.objectType(v);
      } else {
        return v;
      }  /*
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
      return s !== '0';
    }
    function dateToJsonObject(s) {
      var dt = s.split('T')[0] !== s ? s.split('T') : s.split(' ');
      var d = dt[0].split('-');
      var t = dt[1].split(':');
      var t3 = t[2].split('Z');
      return new Date(d[0], d[1] - 1, d[2], t[0], t[1], t3[0]);
    }
    function userToJsonObject(s) {
      if (s.length === 0) {
        return null;
      } else {
        var thisUser = new utils.SplitIndex(s);
        var thisUserExpanded = thisUser.value.split(',#');
        if (thisUserExpanded.length === 1) {
          return {
            userId: thisUser.id,
            userName: thisUser.value
          };
        } else {
          return {
            userId: thisUser.id,
            userName: thisUserExpanded[0].replace(/(,,)/g, ','),
            loginName: thisUserExpanded[1].replace(/(,,)/g, ','),
            email: thisUserExpanded[2].replace(/(,,)/g, ','),
            sipAddress: thisUserExpanded[3].replace(/(,,)/g, ','),
            title: thisUserExpanded[4].replace(/(,,)/g, ',')
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
      } else if (s === '0' || s === '1') {
        return s;
      } else {
        var thisObject = [];
        var thisString = s.split(constants.spDelim);
        for (var i = 0; i < thisString.length; i++) {
          if (thisString[i].length !== 0) {
            var fileName = thisString[i];
            if (thisString[i].lastIndexOf('/') !== -1) {
              var tokens = thisString[i].split('/');
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
        var thisUrl = s.split(', ');
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
  }(jquery, src_core_SPServicesutils, src_utils_constants);
  src_utils_SPConvertDateToISO = function ($, utils) {
    // Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items
    $.fn.SPServices.SPConvertDateToISO = function (options) {
      var opt = $.extend({}, {
        dateToConvert: new Date(),
        // The JavaScript date we'd like to convert. If no date is passed, the function returns the current date/time
        dateOffset: '-05:00'  // The time zone offset requested. Default is EST
      }, options);
      //Generate ISO 8601 date/time formatted string
      var s = '';
      var d = opt.dateToConvert;
      s += d.getFullYear() + '-';
      s += utils.pad(d.getMonth() + 1) + '-';
      s += utils.pad(d.getDate());
      s += 'T' + utils.pad(d.getHours()) + ':';
      s += utils.pad(d.getMinutes()) + ':';
      s += utils.pad(d.getSeconds()) + 'Z' + opt.dateOffset;
      //Return the ISO8601 date string
      return s;
    };
    // End $.fn.SPServices.SPConvertDateToISO
    return $;
  }(jquery, src_core_SPServicesutils);
  src_utils_SPGetDisplayFromStatic = function ($) {
    // This function returns the DisplayName for a column based on the StaticName.
    $.fn.SPServices.SPGetDisplayFromStatic = function (options) {
      var opt = $.extend({}, {
        webURL: '',
        // URL of the target Web.  If not specified, the current Web is used.
        listName: '',
        // The name or GUID of the list
        columnStaticName: '',
        // StaticName of the column
        columnStaticNames: {}  // StaticName of the columns - added in v0.7.2 to allow multiple columns
      }, options);
      var displayName = '';
      var displayNames = {};
      var nameCount = opt.columnStaticNames.length > 0 ? opt.columnStaticNames.length : 1;
      $().SPServices({
        operation: 'GetList',
        async: false,
        cacheXML: true,
        webURL: opt.webURL,
        listName: opt.listName,
        completefunc: function (xData) {
          if (nameCount > 1) {
            for (var i = 0; i < nameCount; i++) {
              displayNames[opt.columnStaticNames[i]] = $(xData.responseXML).find('Field[StaticName=\'' + opt.columnStaticNames[i] + '\']').attr('DisplayName');
            }
          } else {
            displayName = $(xData.responseXML).find('Field[StaticName=\'' + opt.columnStaticName + '\']').attr('DisplayName');
          }
        }
      });
      return nameCount > 1 ? displayNames : displayName;
    };
    // End $.fn.SPServices.SPGetDisplayFromStatic
    return $;
  }(jquery);
  src_utils_SPGetStaticFromDisplay = function ($) {
    // This function returns the StaticName for a column based on the DisplayName.
    $.fn.SPServices.SPGetStaticFromDisplay = function (options) {
      var opt = $.extend({}, {
        webURL: '',
        // URL of the target Web.  If not specified, the current Web is used.
        listName: '',
        // The name or GUID of the list
        columnDisplayName: '',
        // DisplayName of the column
        columnDisplayNames: {}  // DisplayNames of the columns - added in v0.7.2 to allow multiple columns
      }, options);
      var staticName = '';
      var staticNames = {};
      var nameCount = opt.columnDisplayNames.length > 0 ? opt.columnDisplayNames.length : 1;
      $().SPServices({
        operation: 'GetList',
        async: false,
        cacheXML: true,
        webURL: opt.webURL,
        listName: opt.listName,
        completefunc: function (xData) {
          if (nameCount > 1) {
            for (var i = 0; i < nameCount; i++) {
              staticNames[opt.columnDisplayNames[i]] = $(xData.responseXML).find('Field[DisplayName=\'' + opt.columnDisplayNames[i] + '\']').attr('StaticName');
            }
          } else {
            staticName = $(xData.responseXML).find('Field[DisplayName=\'' + opt.columnDisplayName + '\']').attr('StaticName');
          }
        }
      });
      return nameCount > 1 ? staticNames : staticName;
    };
    // End $.fn.SPServices.SPGetStaticFromDisplay
    return $;
  }(jquery);
  src_utils_SPGetLastItemId = function ($) {
    // Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
    // between list forms
    $.fn.SPServices.SPGetLastItemId = function (options) {
      var opt = $.extend({}, {
        webURL: '',
        // URL of the target Web.  If not specified, the current Web is used.
        listName: '',
        // The name or GUID of the list
        userAccount: '',
        // The account for the user in DOMAIN\username format. If not specified, the current user is used.
        CAMLQuery: ''  // [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
      }, options);
      var userId;
      var lastId = 0;
      $().SPServices({
        operation: 'GetUserInfo',
        webURL: opt.webURL,
        async: false,
        userLoginName: opt.userAccount !== '' ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
        completefunc: function (xData) {
          $(xData.responseXML).find('User').each(function () {
            userId = $(this).attr('ID');
          });
        }
      });
      // Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
      // the existing Where clause
      var camlQuery = '<Query><Where>';
      if (opt.CAMLQuery.length > 0) {
        camlQuery += '<And>';
      }
      camlQuery += '<Eq><FieldRef Name=\'Author\' LookupId=\'TRUE\'/><Value Type=\'Integer\'>' + userId + '</Value></Eq>';
      if (opt.CAMLQuery.length > 0) {
        camlQuery += opt.CAMLQuery + '</And>';
      }
      camlQuery += '</Where><OrderBy><FieldRef Name=\'Created_x0020_Date\' Ascending=\'FALSE\'/></OrderBy></Query>';
      $().SPServices({
        operation: 'GetListItems',
        async: false,
        webURL: opt.webURL,
        listName: opt.listName,
        CAMLQuery: camlQuery,
        CAMLViewFields: '<ViewFields><FieldRef Name=\'ID\'/></ViewFields>',
        CAMLRowLimit: 1,
        CAMLQueryOptions: '<QueryOptions><ViewAttributes Scope=\'Recursive\' /></QueryOptions>',
        completefunc: function (xData) {
          $(xData.responseXML).SPFilterNode('z:row').each(function () {
            lastId = $(this).attr('ows_ID');
          });
        }
      });
      return lastId;
    };
    // End $.fn.SPServices.SPGetLastItemId
    return $;
  }(jquery);
  src_value_added_SPCascadeDropdowns = function ($, constants, utils) {
    // Function to set up cascading dropdowns on a SharePoint form
    // (Newform.aspx, EditForm.aspx, or any other customized form.)
    $.fn.SPServices.SPCascadeDropdowns = function (options) {
      var opt = $.extend({}, {
        relationshipWebURL: '',
        // [Optional] The name of the Web (site) which contains the relationships list
        relationshipList: '',
        // The name of the list which contains the parent/child relationships
        relationshipListParentColumn: '',
        // The internal name of the parent column in the relationship list
        relationshipListChildColumn: '',
        // The internal name of the child column in the relationship list
        relationshipListSortColumn: '',
        // [Optional] If specified, sort the options in the dropdown by this column,
        // otherwise the options are sorted by relationshipListChildColumn
        parentColumn: '',
        // The display name of the parent column in the form
        childColumn: '',
        // The display name of the child column in the form
        listName: $().SPServices.SPListNameFromUrl(),
        // The list the form is working with. This is useful if the form is not in the list context.
        CAMLQuery: '',
        // [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList
        CAMLQueryOptions: '<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>',
        // [Optional] For power users, ability to specify Query Options
        promptText: '',
        // [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. Original value "Choose {0}..."
        noneText: '(None)',
        // [Optional] Text to use for the (None) selection. Provided for non-English language support.
        simpleChild: false,
        // [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown
        selectSingleOption: false,
        // [Optional] If set to true and there is only a single child option, select it
        matchOnId: false,
        // By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
        completefunc: null,
        // Function to call on completion of rendering the change.
        debug: false  // If true, show error messages;if false, run silent
      }, options);
      var thisParentSetUp = false;
      var thisFunction = 'SPServices.SPCascadeDropdowns';
      // Find the parent column's select (dropdown)
      var parentSelect = $().SPServices.SPDropdownCtl({ displayName: opt.parentColumn });
      if (parentSelect.Obj.html() === null && opt.debug) {
        utils.errBox(thisFunction, 'parentColumn: ' + opt.parentColumn, constants.TXTColumnNotFound);
        return;
      }
      // Find the child column's select (dropdown)
      var childSelect = $().SPServices.SPDropdownCtl({ displayName: opt.childColumn });
      if (childSelect.Obj.html() === null && opt.debug) {
        utils.errBox(thisFunction, 'childColumn: ' + opt.childColumn, constants.TXTColumnNotFound);
        return;
      }
      // If requested and the childColumn is a complex dropdown, convert to a simple dropdown
      if (opt.simpleChild === true && childSelect.Type === constants.dropdownType.complex) {
        $().SPServices.SPComplexToSimpleDropdown({
          listName: opt.listName,
          columnName: opt.childColumn
        });
        // Set the childSelect to reference the new simple dropdown
        childSelect = $().SPServices.SPDropdownCtl({ displayName: opt.childColumn });
      }
      var childColumnRequired, childColumnStatic;
      // Get information about the childColumn from the current list
      $().SPServices({
        operation: 'GetList',
        async: false,
        cacheXML: true,
        listName: opt.listName,
        completefunc: function (xData) {
          $(xData.responseXML).find('Fields').each(function () {
            $(this).find('Field[DisplayName=\'' + opt.childColumn + '\']').each(function () {
              // Determine whether childColumn is Required
              childColumnRequired = $(this).attr('Required') === 'TRUE';
              childColumnStatic = $(this).attr('StaticName');
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
      var childColumns = parentSelect.Obj.data('SPCascadeDropdownsChildColumns');
      // If this is the first child for this parent, then create the data object to hold the settings
      if (typeof childColumns === 'undefined') {
        parentSelect.Obj.data('SPCascadeDropdownsChildColumns', [childColumn]);  // If we already have a data object for this parent, then add the setting for this child to it
      } else {
        childColumns.push(childColumn);
        parentSelect.Obj.data('SPCascadeDropdownsChildColumns', childColumns);
        thisParentSetUp = true;
      }
      // We only need to bind to the event(s) if we haven't already done so
      if (!thisParentSetUp) {
        switch (parentSelect.Type) {
        // Plain old select
        case constants.dropdownType.simple:
          parentSelect.Obj.bind('change', function () {
            cascadeDropdown(parentSelect);
          });
          break;
        // Input / Select hybrid
        case constants.dropdownType.complex:
          // Bind to any change on the hidden input element
          parentSelect.optHid.bind('propertychange', function () {
            cascadeDropdown(parentSelect);
          });
          break;
        // Multi-select hybrid
        case constants.dropdownType.multiSelect:
          // Handle the dblclick on the candidate select
          $(parentSelect.master.candidateControl).bind('dblclick', function () {
            cascadeDropdown(parentSelect);
          });
          // Handle the dblclick on the selected values
          $(parentSelect.master.resultControl).bind('dblclick', function () {
            cascadeDropdown(parentSelect);
          });
          // Handle button clicks
          $(parentSelect.master.addControl).bind('click', function () {
            cascadeDropdown(parentSelect);
          });
          $(parentSelect.master.removeControl).bind('click', function () {
            cascadeDropdown(parentSelect);
          });
          break;
        default:
          break;
        }
      }
      // Fire the change to set the initially allowable values
      cascadeDropdown(parentSelect);
    };
    // End $.fn.SPServices.SPCascadeDropdowns
    function cascadeDropdown(parentSelect) {
      var choices = '';
      var parentSelectSelected;
      var childSelectSelected = null;
      var newMultiLookupPickerdata;
      var numChildOptions;
      var firstChildOptionId;
      var firstChildOptionValue;
      // Filter each child column
      var childColumns = parentSelect.Obj.data('SPCascadeDropdownsChildColumns');
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
        if (parentSelect.Obj.data('SPCascadeDropdown_Selected_' + childColumnStatic) === allParentSelections) {
          return;
        }
        parentSelect.Obj.data('SPCascadeDropdown_Selected_' + childColumnStatic, allParentSelections);
        // Get the current child column selection(s)
        childSelectSelected = utils.getDropdownSelected(childSelect, true);
        // When the parent column's selected option changes, get the matching items from the relationship list
        // Get the list items which match the current selection
        var sortColumn = opt.relationshipListSortColumn.length > 0 ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
        var camlQuery = '<Query><OrderBy><FieldRef Name=\'' + sortColumn + '\'/></OrderBy><Where><And>';
        if (opt.CAMLQuery.length > 0) {
          camlQuery += '<And>';
        }
        // Build up the criteria for inclusion
        if (parentSelectSelected.length === 0) {
          // Handle the case where no values are selected in multi-selects
          camlQuery += '<Eq><FieldRef Name=\'' + opt.relationshipListParentColumn + '\'/><Value Type=\'Text\'></Value></Eq>';
        } else if (parentSelectSelected.length === 1) {
          // Only one value is selected
          camlQuery += '<Eq><FieldRef Name=\'' + opt.relationshipListParentColumn + (opt.matchOnId ? '\' LookupId=\'True\'/><Value Type=\'Integer\'>' : '\'/><Value Type=\'Text\'>') + utils.escapeColumnValue(parentSelectSelected[0]) + '</Value></Eq>';
        } else {
          var compound = parentSelectSelected.length > 2;
          for (i = 0; i < parentSelectSelected.length - 1; i++) {
            camlQuery += '<Or>';
          }
          for (i = 0; i < parentSelectSelected.length; i++) {
            camlQuery += '<Eq><FieldRef Name=\'' + opt.relationshipListParentColumn + (opt.matchOnId ? '\' LookupId=\'True\'/><Value Type=\'Integer\'>' : '\'/><Value Type=\'Text\'>') + utils.escapeColumnValue(parentSelectSelected[i]) + '</Value></Eq>';
            if (i > 0 && i < parentSelectSelected.length - 1 && compound) {
              camlQuery += '</Or>';
            }
          }
          camlQuery += '</Or>';
        }
        if (opt.CAMLQuery.length > 0) {
          camlQuery += opt.CAMLQuery + '</And>';
        }
        // Make sure we don't get any items which don't have the child value
        camlQuery += '<IsNotNull><FieldRef Name=\'' + opt.relationshipListChildColumn + '\' /></IsNotNull>';
        camlQuery += '</And></Where></Query>';
        $().SPServices({
          operation: 'GetListItems',
          // Force sync so that we have the right values for the child column onchange trigger
          async: false,
          webURL: opt.relationshipWebURL,
          listName: opt.relationshipList,
          // Filter based on the currently selected parent column's value
          CAMLQuery: camlQuery,
          // Only get the parent and child columns
          CAMLViewFields: '<ViewFields><FieldRef Name=\'' + opt.relationshipListParentColumn + '\' /><FieldRef Name=\'' + opt.relationshipListChildColumn + '\' /></ViewFields>',
          // Override the default view rowlimit and get all appropriate rows
          CAMLRowLimit: 0,
          // Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
          CAMLQueryOptions: opt.CAMLQueryOptions,
          completefunc: function (xData) {
            // Handle errors
            $(xData.responseXML).find('errorstring').each(function () {
              var thisFunction = 'SPServices.SPCascadeDropdowns';
              var errorText = $(this).text();
              if (opt.debug && errorText === 'One or more field types are not installed properly. Go to the list settings page to delete these fields.') {
                utils.errBox(thisFunction, 'relationshipListParentColumn: ' + opt.relationshipListParentColumn + ' or ' + 'relationshipListChildColumn: ' + opt.relationshipListChildColumn, 'Not found in relationshipList ' + opt.relationshipList);
              } else if (opt.debug && errorText === 'Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).') {
                utils.errBox(thisFunction, 'relationshipList: ' + opt.relationshipList, 'List not found');
              }
            });
            // Add an explanatory prompt
            switch (childSelect.Type) {
            case constants.dropdownType.simple:
              // Remove all of the existing options
              childSelect.Obj[0].innerHTML = '';
              //                            $(childSelect.Obj).find("option").remove();
              // If the column is required or the promptText option is empty, don't add the prompt text
              if (!childColumnRequired && opt.promptText.length > 0) {
                childSelect.Obj.append('<option value=\'0\'>' + opt.promptText.replace(/\{0\}/g, opt.childColumn) + '</option>');
              } else if (!childColumnRequired) {
                childSelect.Obj.append('<option value=\'0\'>' + opt.noneText + '</option>');
              }
              break;
            case constants.dropdownType.complex:
              // If the column is required, don't add the "(None)" option
              choices = childColumnRequired ? '' : opt.noneText + '|0';
              childSelect.Obj.val('');
              break;
            case constants.dropdownType.multiSelect:
              // Remove all of the existing options
              $(childSelect.master.candidateControl).find('option').remove();
              newMultiLookupPickerdata = '';
              break;
            default:
              break;
            }
            // Get the count of items returned and save it so that we can select if it's a single option
            // The item count is stored thus: <rs:data ItemCount="1">
            numChildOptions = parseFloat($(xData.responseXML).SPFilterNode('rs:data').attr('ItemCount'));
            // Add an option for each child item
            $(xData.responseXML).SPFilterNode('z:row').each(function () {
              var thisOption = {};
              // If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
              // else the ID of the relationshipList item
              var thisValue = $(this).attr('ows_' + opt.relationshipListChildColumn);
              if (typeof thisValue !== 'undefined' && thisValue.indexOf(constants.spDelim) > 0) {
                thisOption = new utils.SplitIndex(thisValue);
              } else {
                thisOption.id = $(this).attr('ows_ID');
                thisOption.value = thisValue;
              }
              // If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
              // but by the datatype.  In this case, thisOption.id should be the ID of the relationshipList item.
              // e.g., float;#12345.67
              if (isNaN(thisOption.id)) {
                thisOption.id = $(this).attr('ows_ID');
              }
              // Save the id and value for the first child option in case we need to select it (selectSingleOption option is true)
              firstChildOptionId = thisOption.id;
              firstChildOptionValue = thisOption.value;
              switch (childSelect.Type) {
              case constants.dropdownType.simple:
                var selected = $(this).attr('ows_ID') === childSelectSelected[0] ? ' selected=\'selected\'' : '';
                childSelect.Obj.append('<option' + selected + ' value=\'' + thisOption.id + '\'>' + thisOption.value + '</option>');
                break;
              case constants.dropdownType.complex:
                if (thisOption.id === childSelectSelected[0]) {
                  childSelect.Obj.val(thisOption.value);
                }
                choices = choices + (choices.length > 0 ? '|' : '') + thisOption.value + '|' + thisOption.id;
                break;
              case constants.dropdownType.multiSelect:
                $(childSelect.master.candidateControl).append('<option value=\'' + thisOption.id + '\'>' + thisOption.value + '</option>');
                newMultiLookupPickerdata += thisOption.id + '|t' + thisOption.value + '|t |t |t';
                break;
              default:
                break;
              }
            });
            switch (childSelect.Type) {
            case constants.dropdownType.simple:
              childSelect.Obj.trigger('change');
              // If there is only one option and the selectSingleOption option is true, then select it
              if (numChildOptions === 1 && opt.selectSingleOption === true) {
                $(childSelect.Obj).find('option[value!=\'0\']:first').attr('selected', 'selected');
              }
              break;
            case constants.dropdownType.complex:
              // Set the allowable choices
              childSelect.Obj.attr('choices', choices);
              // If there is only one option and the selectSingleOption option is true, then select it
              if (numChildOptions === 1 && opt.selectSingleOption === true) {
                // Set the input element value
                $(childSelect.Obj).val(firstChildOptionValue);
                // Set the value of the optHid input element
                childSelect.optHid.val(firstChildOptionId);
              }
              // If there's no selection, then remove the value in the associated hidden input element (optHid)
              if (childSelect.Obj.val() === '') {
                childSelect.optHid.val('');
              }
              break;
            case constants.dropdownType.multiSelect:
              // Clear the master
              childSelect.master.data = '';
              childSelect.MultiLookupPickerdata.val(newMultiLookupPickerdata);
              // Clear any prior selections that are no longer valid or aren't selected
              $(childSelect.master.resultControl).find('option').each(function () {
                var thisSelected = $(this);
                thisSelected.prop('selected', true);
                $(childSelect.master.candidateControl).find('option[value=\'' + thisSelected.val() + '\']').each(function () {
                  thisSelected.prop('selected', false);
                });
              });
              GipRemoveSelectedItems(childSelect.master);
              // Hide any options in the candidate list which are already selected
              $(childSelect.master.candidateControl).find('option').each(function () {
                var thisSelected = $(this);
                $(childSelect.master.resultControl).find('option[value=\'' + thisSelected.val() + '\']').each(function () {
                  thisSelected.remove();
                });
              });
              GipAddSelectedItems(childSelect.master);
              // Set master.data to the newly allowable values
              childSelect.master.data = GipGetGroupData(newMultiLookupPickerdata);
              // Trigger a dblclick so that the child will be cascaded if it is a multiselect.
              $(childSelect.master.candidateControl).trigger('dblclick');
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
      });  // $(childColumns).each(function()
    }
    // End cascadeDropdown
    return $;
  }(jquery, src_utils_constants, src_core_SPServicesutils);
  src_SPServices = function ($) {
    return $;
  }(jquery);
}));
}());