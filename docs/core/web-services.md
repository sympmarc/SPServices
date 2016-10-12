---
title: 'Web Services'
function: '$().SPServices'
certification:
  sp2007: 'certified'
  sp2010: 'works'
certification_notes: 'See individual Web Services for specific certifications'
description: 'This is the core function of the library, which you can use to make Ajax calls to the SharePoint Web Services. Note: As of version 2013.01, all calls return a jQuery deferred object aka a promise.'
nav_sort: 1
introduced: 0.2.3
---

## Notes

As of version 2013.01, all calls return a [jQuery deferred object](http://api.jquery.com/category/deferred-object/) aka a promise.

As of v0.7.2, the core `$().SPServices()` function allows for simple caching of the XML results using jQuery promises in a similar manner to that outlined in Scot Hillier's excellent post [Utilizing Promises in SharePoint 2013 Apps](http://www.shillier.com/archive/2012/11/29/utilizing-promises-in-sharepoint-2013-apps.aspx). See the [Caching](../../caching.md) page for more details.

## Supported Web Services

The table below shows the Web Services for which we have implemented at least one operation (or have operations coming in planned releases) with a link to more detailed documentation, indicators for whether the Web Service is available in WSS 3.0 and/or MOSS, and links to the MSDN documentation pages. Note that there are some [general syntax instructions](#general-syntax) below the table.

| Web Service | WSS 3.0 | MOSS | MSDN Documentation | Foundation | SP2010 |
| ----------- | ------- | ---- | ------------------ | ---------- | ------ |
| [Alerts](web-services/Alerts.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Alerts Web Service](http://msdn.microsoft.com/en-us/library/alerts.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Authentication](web-services/Authentication.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Authentication Web Service](http://msdn.microsoft.com/en-us/library/authentication.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Copy](web-services/Copy.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Copy Web Service](http://msdn.microsoft.com/en-us/library/copy.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Forms](web-services/Forms.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Forms Web Service](http://msdn.microsoft.com/en-us/library/forms.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Lists](web-services/Lists.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Lists Web Service](http://msdn.microsoft.com/en-us/library/lists.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Meetings](web-services/Meetings.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Meetings Web Service](http://msdn.microsoft.com/en-us/library/ms774629.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [People](web-services/People.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [People Web Service](http://msdn.microsoft.com/en-us/library/people.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Permissions](web-services/Permissions.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Permissions Web Service](http://msdn.microsoft.com/en-us/library/permissions.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [SiteData](web-services/SiteData.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [SiteData Web Service](http://msdn.microsoft.com/en-us/library/ms774821%28v=office.12%29.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Sites](web-services/Sites.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | Sites Web Service [2007](http://msdn.microsoft.com/en-us/library/ms774847%28v=office.12%29.aspx) [2010](http://msdn.microsoft.com/en-us/library/bb250173.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [UserGroup (Users and Groups)](web-services/UserGroup.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Users and Groups Web Service](http://msdn.microsoft.com/en-us/library/ms772647.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Versions](web-services/Versions.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Versions Web Service](http://msdn.microsoft.com/en-us/library/ms772545.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Views](web-services/Views.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Views Web Service](http://msdn.microsoft.com/en-us/library/views.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [WebPartPages](web-services/WebPartPages.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Web Part Pages Web Service](http://msdn.microsoft.com/en-us/library/ms774569.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [Webs](web-services/Webs.md) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | [Webs Web Service](http://msdn.microsoft.com/en-us/library/webs.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [PublishedLinksService](web-services/PublishedLinksService.md) | | ![](../img/checkmark.gif) | [Published Links Web Service](http://msdn.microsoft.com/en-us/library/aa981003.aspx) | | ![](../img/checkmark.gif) |
| [RecordsRepository (Official File)](web-services/RecordsRepository.md) | | ![](../img/checkmark.gif) | [Official File Web Service](http://msdn.microsoft.com/en-us/library/aa981147%28v=office.12%29.aspx) | | ![](../img/checkmark.gif) |
| [QueryService (Search)](web-services/QueryService.md) | | ![](../img/checkmark.gif) | [Search Web Service](http://msdn.microsoft.com/en-us/library/search.aspx) | | ![](../img/checkmark.gif) |
| [SpellChecker](web-services/SpellChecker.md) | | ![](../img/checkmark.gif) | [SpellChecker Web Service](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.publishing.spellchecker.spellcheck.aspx) | | ![](../img/checkmark.gif) |
| [UserProfileService](web-services/UserProfileService.md) | | ![](../img/checkmark.gif) | [User Profile Web Service](http://msdn.microsoft.com/en-us/library/aa981571.aspx) | | ![](../img/checkmark.gif) |
| [Workflow](web-services/Workflow.md) | | ![](../img/checkmark.gif) | [Workflow Web Service](http://msdn.microsoft.com/en-us/library/aa981383.aspx) | | ![](../img/checkmark.gif) |
| [Diagnostics](web-services/Diagnostics.md) | | | [Diagnostics Web Service](http://msdn.microsoft.com/en-us/library/ee551419.aspx) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| [SocialDataService](web-services/SocialDataService.md) | | | [SocialDataService Web Service](http://msdn.microsoft.com/en-us/library/ee590294.aspx) | | ![](../img/checkmark.gif) |
| [TaxonomyClientService](web-services/TaxonomyClientService.md) | | | [TaxonomyClientService Web Service](http://msdn.microsoft.com/en-us/library/ee586638.aspx) | | ![](../img/checkmark.gif) |

## General Syntax

```javascript
$().SPServices({
	operation: "operationname",
	[webURL: "/sitepath",]
	[option1: value1,]
	[option2: value2,]
	[async: false,]
	completefunc: function (xData, Status) {
		//...do stuff...
	}
});
```

_operation_
The name of the Web Service operation (see the SDK documentation links above). Because the Web Services operations are named uniquely, you only need to specify the operation.

_webURL_
For Web Service operations where it makes sense, you can pass in a webURL to change the context for the AJAX call. By default, the current site (as determined by [$().SPServices.SPGetCurrentSite](../../utilities/SPGetCurrentSite.md)) is used.

_options_
The options vary based on which Web Service and operation you are calling. In all instances, the options will take the same names as those described in the SDK.

_async_
By default, all of the Web Service operations are called asynchronously with AJAX. Generally, this will be the desired approach, but to force synchronicity, add the async: false option.

_cacheXML_
If set to true, the result's raw XML will be cached using jQuery promises in a similar manner to that outlined in Scot Hillier's excellent post [Utilizing Promises in SharePoint 2013 Apps](http://www.shillier.com/archive/2012/11/29/utilizing-promises-in-sharepoint-2013-apps.aspx). See more about how this works on the [Caching](../../caching.md) page.

_completefunc_
A function to call on completion of the AJAX call to the Web Service:

```javascript
completefunc: function(xData, Status) {
  //...do something...
},
```

## Example

Example call for GetListItems. This example is taken directly from SPCascadeDropdowns:

```javascript
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
	completefunc: function(xData, Status) {
		// ...
	}
});
```

Example call for GetUserInfo:
```javascript
waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/gears_an.gif'/></td></tr></table>";

$("#WSOutput").html(waitMessage).SPServices({
	operation: "GetUserInfo",
	userLoginName: "SHARE1\\demouser",
	completefunc: function (xData, Status) {
		$("#WSOutput").html("").append("<b>This is the output from the GetUserInfo operation:</b>");
		$(xData.responseXML).find("User").each(function() {
			$("#WSOutput").append("<li>ID: " + $(this).attr("ID") + "</li>");
			$("#WSOutput").append("<li>Sid: " + $(this).attr("Sid") + "</li>");
			$("#WSOutput").append("<li>Name: " + $(this).attr("Name") + "</li>");
			$("#WSOutput").append("<li>LoginName: " + $(this).attr("LoginName") + "</li>");
			$("#WSOutput").append("<li>Email: " + $(this).attr("Email") + "</li>");
			$("#WSOutput").append("<li>Notes: " + $(this).attr("Notes") + "</li>");
			$("#WSOutput").append("<li>IsSiteAdmin: " + $(this).attr("IsSiteAdmin") + "</li>");
			$("#WSOutput").append("<li>IsDomainGroup: " + $(this).attr("IsDomainGroup") + "</li>");
			$("#WSOutput").append("<hr/>");
		});
	}
});
```
