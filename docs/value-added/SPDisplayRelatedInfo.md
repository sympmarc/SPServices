---
title: 'SPDisplayRelatedInfo'
function: '$().SPServices.SPDisplayRelatedInfo'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This function lets you display related information on forms when an option in a dropdown is chosen.'
introduced: 0.2.9
---

## Functionality

SPDisplayRelatedInfo is a function in the jQuery Library for SharePoint Web Services that lets you display information which is related to the selection in a dropdown. This can really bring your forms to life for users: rather than just selecting bland text values, you can show them images and links that are related to their choices.

## How Does It Work?

The SPDisplayRelatedInfo function works like this:

*   When the function is first called, it attaches an event handler to the dropdown control. The logic here varies a bit depending on what type of dropdown it is.
*   When the selected option in the dropdown changes, SPDisplayRelatedInfo calls two Lists Web Service operations:
    *   GetList on the relatedList to get information about its columns (fields)
    *   GetListItems to get the items where the specified column’s value matches the current selection. Note that there can be multiple items returned; generally displayFormat: “table” makes more sense if you’ll want to display multiple items.
*   For each column it’s asked to display, SPDisplayRelatedInfo calls a private function (showColumn) to render the column value based on its type. Most of the normal column types are covered, though locale conversions can’t be done from the client side (yet!). The related information is shown in a DIV which is inserted into the form. The DIV is named **"SPDisplayRelatedInfo_" + columnStaticName** in case you need to do any post-processing.

**NOTE:** This function is only meant to be used on the NewForm or EditForm; it works when a dropdown's value is changed.

**Tip**: If you don't want to see the column headers, pass in ms-hidden for headerCSSClass. (This is a CSS class in core.css which sets display: none.)

## Prerequisites

*   You'll need to have a list (relatedList) which contains the values in the dropdown in one column and the related values you'd like to display in additional columns. If you're already using SPCascadeDropdowns, then you'll already have a list (or lists) in place which you can use here.

Here is an example of the form where you want to use SPDisplayRelatedInfo:
![](img/SPDisplayRelatedInfo1.jpg)
 In this example, I have a list called Systems, which has three columns:
![](img/SPDisplayRelatedInfo2.jpg)

## Syntax

**_columnName_**

The [DisplayName](../glossary.md#displayname) of the column in the _form_

_relatedWebURL_

The URL of the Web (site) which contains the relatedList. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

**_relatedList_**

The name or GUID of the list which contains the related information. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the _relatedWebURL_ if the list is in another site.

**_relatedListColumn_**

The [StaticName](../glossary.md#staticname) of the column in the _relatedList_

**_relatedColumns_**

An array of [StaticNames](../glossary.md#staticname) of related columns to display

_displayFormat_

 The format to use in displaying the related information. The default is "table". The displayFormat takes one of two options:

*   “table” displays the matching items much like a standard List View Web Part would, in a table with column headers
*   “list” also uses a table, but displays the item(s) in a vertical orientation

_headerCSSClass_

 If specified, the CSS class for the table headers. The default is "ms-vh2".

_rowCSSClass_

If specified, the CSS class for the table cells. The default is "ms-vb".

_numChars_

If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered. The default is 0.

_matchType_

If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith". The default is "Eq".

_CAMLQuery_

The CAMLQuery option allows you to specify an additional filter on the relationshipList. The additional filter will be <And>ed with the existing CAML which is checking for matching items based on the parentColumn selection. Bacause it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML _**fragment**_ such as:
```javascript
CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
```
_matchOnId_

By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead. The default value is false.

_completefunc_

If specified, the completefunc will be called each time there is a change to parentColumn. Potential uses for the completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. You can pass your completefunc in either of these two ways:
```javascript
completefunc: function() {
  ...do something...
},
```
or
``` javascript
completefunc: doSomething,    // Where doSomething is the name of your function
```

_debug_

Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like using a column name which doesn't exist. I call this [debug mode](../glossary.md#debug-mode).

## Examples
``` javascript
$().SPServices.SPDisplayRelatedInfo({
	columnName: "System",
	relatedList: "Systems",
	relatedListColumn: "Title",
	relatedColumns: ["System_x0020_Image", "Lead_x0020_Sales_x0020_Rep"],
	displayFormat: "list"
});
```
Here I’m asking SPDisplayRelatedInfo to show me the values in the `System_x0020_Image` and `Lead_x0020_Sales_x0020_Rep` columns (these are the [StaticNames](../glossary.md#staticname) of the list columns as opposed to the [DisplayNames](../glossary.md#displayname) in the `Systems` list under the `System` column in my form using the `list` display format where the `System value matches the `Title` value in the `Systems` list. I’m just taking the default CSS classes for the example. As you can see, you can pass in any CSS class you’d like to make the SPDisplayRelatedInfo output match your site branding.
![](img/SPDisplayRelatedInfo3.jpg)

In this example, I'm displaying some information about the `Region`. To make the output look better, I'm doing a little post-processing on the `Total_x0020_Sales` column. You’ll see that I’m both pre-pending the value with “$” and right justifying it. In my case, the column is `Region` and the `Total_x0020_Sales` column is the 4th one, so I’m using `:nth-child(4)`.
``` javascript
$().SPServices.SPDisplayRelatedInfo({       
  columnName: "Region",
  relatedWebURL: "/Intranet/JQueryLib",
  relatedList: "Regions",
  relatedListColumn: "Title",
  relatedColumns: ["ID", "Country", "Title", "Total_x0020_Sales"],
  displayFormat: "table",
  completefunc: addDollarSigns,
  debug: true
});

function addDollarSigns() {
  $("#SPDisplayRelatedInfo_Region td:nth-child(4)").prepend("$").css("textAlign", "right");
}
```
![](img/SPDisplayRelatedInfo4.png)
