---
title: 'SPScriptAudit'
function: '$().SPServices.SPScriptAudit'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'The SPScriptAudit function allows you to run an auditing report showing where scripting is in use in a site.'
introduced: 0.4.8
---

## Functionality

The SPScriptAudit function allows you to run an auditing report showing where scripting is in use in a site.

## How Does It Work?

*   Calls [GetListCollection](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcollection.aspx) to get all of the lists in the site specified in `webURL` (or the current site if `webURL` is not specified).
*   For each list, calls [GetListContentTypes](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttypes.aspx) to identify the specific forms which have been customized. What we see in the results from GetListContentTypes is any form which has been specified in the Supporting Files tab of the list properties. I'm explicitly excluding the Folder Content Type right now; I'm not sure there's any real utility in including it.
    *   For each customized form, does an AJAX call to fetch the form
    *   Find each Web Part in the form and looks for internal `<script>` tags. If any are found, then they are reported. I also look for any occurrences of "`$(`" within the `<script>` tags, which should indicate usage of jQuery, but I'm interested in better or more reliable ideas for this.
    *   Find `<script>` tags **outside** of Web Parts. If any are found, then they are reported.
*   Next, go through the same process for the list's View pages by calling [GetFormCollection](http://msdn.microsoft.com/en-us/library/forms.forms.getformcollection.aspx) for the list.
*   Finally, the same basic process for the Pages, if requested.

## Syntax

``` javascript
$().SPServices.SPScriptAudit({
	webURL: "",
	listName: "",
	outputId: "",
	auditForms: true,
	auditViews: true,
	auditPages: true,
	auditPagesListName: "Pages",
	showHiddenLists: false,
	showNoScript: false,
	showSrc: true
});
```

### webURL

The site on which to run the audit. If no site is specified, the current site is used. Examples would be: "/Departments", "/Departments/HR", "/Sites", etc.

### listName

The name of a specific list to audit. If not present, all lists in the site are audited.

### outputId

The ID of an HTML element into which to insert the report. If you would like to see the report within this div: `<div id="MyOutput"></div>`, then the value would be "MyOutput".

### auditForms

Audit the form pages if true. The default is `true`.

### auditViews

Audit the view pages if true. The default is `true`.

### auditPages

Audit the Pages Document Library if true. The default is `true`.

### auditPagesListName
The Pages Document Library, if desired. The default is `"Pages"`.

### showHiddenLists
`true` if you would like to see the output for hidden lists; `false` if not. The default is `false`.

### showNoScript

`true` if you would like to see the output for lists with no scripts (effectively "verbose"); `false` if not. The default is `false`.

### showSrc
`true` if you would like to see the included script files on each page; `false` if not. The default is `true`.

## Example

``` javascript
$().SPServices.SPScriptAudit({
	webURL: "",
	outputId: "WSOutput",
	showHiddenLists: true,
	showNoScript: false,
	showSrc: true
});
```

![script audit results](img/SPScriptAudit1.jpg)
