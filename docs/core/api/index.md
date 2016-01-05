### Function

$().SPServices

### Certification

[![Certified for SharePoint 2007](http://www.sympraxisconsulting.com/SPServices/sp2007-cert.jpg "Certified for SharePoint 2007")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) [![Works with Caveats with SharePoint 2010](http://www.sympraxisconsulting.com/SPServices/sp2010-works.jpg "Works with Caveats with SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification)
See individual Web Services pages for certification specifics.

### Notes

As of version 2013.01, all calls return a [jQuery deferred object](http://api.jquery.com/category/deferred-object/) aka a promise.

As of v0.7.2, the core `$().SPServices()` function allows for simple caching of the XML results using jQuery promises in a similar manner to that outlined in Scot Hillier's excellent post [Utilizing Promises in SharePoint 2013 Apps](http://www.shillier.com/archive/2012/11/29/utilizing-promises-in-sharepoint-2013-apps.aspx). See the [Caching](/wikipage?title=Caching) page for more details.

### Supported Web Services

The table below shows the Web Services for which we have implemented at least one operation (or have operations coming in planned releases) with a link to more detailed documentation, indicators for whether the Web Service is available in WSS 3.0 and/or MOSS, and links to the MSDN documentation pages. Note that there are some [general syntax instructions](/wikipage?title=%24%28%29.SPServices&ANCHOR#GeneralSyntax) below the table.

| SharePoint 2007 | SharePoint 2010 |
| --------------- | --------------- |
| Web Service | WSS 3.0 | MOSS | MSDN Documentation | Foundation | SP2010 |
| --------- | ------- | ------------------ | ---------- |
| [Alerts](/wikipage?title=Alerts) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Alerts Web Service](http://msdn.microsoft.com/en-us/library/alerts.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Authentication](/wikipage?title=Authentication) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Authentication Web Service](http://msdn.microsoft.com/en-us/library/authentication.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Copy](/wikipage?title=Copy) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Copy Web Service](http://msdn.microsoft.com/en-us/library/copy.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Forms](/wikipage?title=Forms) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Forms Web Service](http://msdn.microsoft.com/en-us/library/forms.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Lists](/wikipage?title=Lists) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Lists Web Service](http://msdn.microsoft.com/en-us/library/lists.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Meetings](/wikipage?title=Meetings) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Meetings Web Service](http://msdn.microsoft.com/en-us/library/ms774629.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [People](/wikipage?title=People) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [People Web Service](http://msdn.microsoft.com/en-us/library/people.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Permissions](/wikipage?title=Permissions) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Permissions Web Service](http://msdn.microsoft.com/en-us/library/permissions.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [SiteData](/wikipage?title=SiteData) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [SiteData Web Service](http://msdn.microsoft.com/en-us/library/ms774821(v=office.12).aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Sites](/wikipage?title=Sites) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | Sites Web Service [2007](http://msdn.microsoft.com/en-us/library/ms774847(v=office.12).aspx) [2010](http://msdn.microsoft.com/en-us/library/bb250173.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Users and Groups](/wikipage?title=Users%20and%20Groups) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Users and Groups Web Service](http://msdn.microsoft.com/en-us/library/ms772647.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Versions](/wikipage?title=Versions) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Versions Web Service](http://msdn.microsoft.com/en-us/library/ms772545.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Views](/wikipage?title=Views) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Views Web Service](http://msdn.microsoft.com/en-us/library/views.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [WebPartPages](/wikipage?title=WebPartPages) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Web Part Pages Web Service](http://msdn.microsoft.com/en-us/library/ms774569.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Webs](/wikipage?title=Webs) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Webs Web Service](http://msdn.microsoft.com/en-us/library/webs.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [PublishedLinksService](/wikipage?title=PublishedLinksService) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [PublishedLinksService Web Service](http://msdn.microsoft.com/en-us/library/aa981003.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Official File (Records Repository)](/wikipage?title=OfficialFile) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Official File Web Service](http://msdn.microsoft.com/en-us/library/aa981147(v=office.12).aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Search](/wikipage?title=Search) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Search Web Service](http://msdn.microsoft.com/en-us/library/search.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [SpellChecker](/wikipage?title=SpellChecker) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [SpellChecker Web Service](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.publishing.spellchecker.spellcheck.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [UserProfileService](/wikipage?title=UserProfileService) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [User Profile Web Service](http://msdn.microsoft.com/en-us/library/aa981571.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Workflow](/wikipage?title=Workflow) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | [Workflow Web Service](http://msdn.microsoft.com/en-us/library/aa981383.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [Diagnostics](/wikipage?title=Diagnostics) | [Diagnostics Web Service](http://msdn.microsoft.com/en-us/library/ee551419.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [SocialDataService](http://spservices.codeplex.com/wikipage?title=SocialDataService) | [SocialDataService Web Service](http://msdn.microsoft.com/en-us/library/ee590294.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |
| [TaxonomyClientService](http://spservices.codeplex.com/wikipage?title=TaxonomyClientService) | [TaxonomyClientService Web Service](http://msdn.microsoft.com/en-us/library/ee586638.aspx) | ![Available](http://download-codeplex.sec.s-msft.com/Download?ProjectName=spservices&DownloadId=758301) |

### General Syntax

`$().SPServices({
	operation: "operationname",
	[webURL: "/sitepath",]
	[option1: value1,]
	[option2: value2,]
	[async: false,]
	completefunc: function (xData, Status) {
		//...do stuff...
	}
});`


_operation_
The name of the Web Service operation (see the SDK documentation links above). Because the Web Services operations are named uniquely, you only need to specify the operation.

_webURL_
For Web Service operations where it makes sense, you can pass in a webURL to change the context for the AJAX call. By default, the current site (as determined by [$().SPServices.SPGetCurrentSite](/wikipage?title=%24%28%29.SPServices.SPGetCurrentSite)) is used.

_options_
The options vary based on which Web Service and operation you are calling. In all instances, the options will take the same names as those described in the SDK.

_async_
By default, all of the Web Service operations are called asynchronously with AJAX. Generally, this will be the desired approach, but to force synchronicity, add the async: false option.

_cacheXML_
If set to true, the result's raw XML will be cached using jQuery promises in a similar manner to that outlined in Scot Hillier's excellent post [Utilizing Promises in SharePoint 2013 Apps](http://www.shillier.com/archive/2012/11/29/utilizing-promises-in-sharepoint-2013-apps.aspx). See more about how this works on the [Caching](/wikipage?title=Caching) page.

_completefunc_
A function to call on completion of the AJAX call to the Web Service:

`completefunc: function(xData, Status) {
  //...do something...
},`

### Example

Example call for GetListItems. This example is taken directly from SPCascadeDropdowns:

`$().SPServices({
	operation: <span style="color: #a31515;">"GetListItems"</span>,
	<span style="color: green;">// Force sync so that we have the right values for the child column onchange trigger</span>
	async: <span style="color: blue;">false</span>,
	webURL: opt.relationshipWebURL,
	listName: opt.relationshipList,
	<span style="color: green;">// Filter based on the currently selected parent column's value</span>
	CAMLQuery: camlQuery,
	<span style="color: green;">// Only get the parent and child columns</span>
	CAMLViewFields: <span style="color: #a31515;">"<ViewFields><FieldRef Name='"</span> + opt.relationshipListParentColumn + <span style="color: #a31515;">"' /><FieldRef Name='"</span> + opt.relationshipListChildColumn + <span style="color: #a31515;">"' /></ViewFields>"</span>,
	<span style="color: green;">// Override the default view rowlimit and get all appropriate rows</span>
	CAMLRowLimit: 0,
	completefunc: <span style="color: blue;">function</span>(xData, Status) {
		...
	}`

Example call for GetUserInfo:

`waitMessage = <span style="color: #a31515;">"<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/gears_an.gif'/></td></tr></table>"</span>;

$(<span style="color: #a31515;">"#WSOutput"</span>).html(waitMessage).SPServices({
	operation: <span style="color: #a31515;">"GetUserInfo"</span>,
	userLoginName: <span style="color: #a31515;">"SHARE1\\demouser"</span>,
	completefunc: <span style="color: blue;">function</span> (xData, Status) {
		$(<span style="color: #a31515;">"#WSOutput"</span>).html(<span style="color: #a31515;">""</span>).append(<span style="color: #a31515;">"<b>This is the output from the GetUserInfo operation:</b>"</span>);
		$(xData.responseXML).find(<span style="color: #a31515;">"User"</span>).each(<span style="color: blue;">function</span>() {
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>ID: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"ID"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>Sid: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"Sid"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>Name: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"Name"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>LoginName: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"LoginName"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>Email: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"Email"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>Notes: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"Notes"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>IsSiteAdmin: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"IsSiteAdmin"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<li>IsDomainGroup: "</span> + $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"IsDomainGroup"</span>) + <span style="color: #a31515;">"</li>"</span>);
			$(<span style="color: #a31515;">"#WSOutput"</span>).append(<span style="color: #a31515;">"<hr/>"</span>);
		});
	}
});`
