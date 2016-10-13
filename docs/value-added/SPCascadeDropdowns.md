---
title: 'SPCascadeDropdowns'
function: '$().SPServices.SPCascadeDropdowns'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This is the first function we implemented which allows you to take advantage of the Web Services calls in a meaningful way. It allows you to easily set up cascading dropdowns on a list form. (What we mean by cascading dropdowns is the situation where the available options for one column depend on the value you select in another column.)'
introduced: 0.2.6
---

## Functionality

The SPCascadeDropdowns function lets you set up cascading dropdowns on SharePoint forms. What this means is that you can enforce hierarchical relationships between column values. The function uses the GetListItems operation of the Lists Web Service to refresh the allowable values based on relationships which are maintained in reference lists. By implementing this function, there are no coding requirements to manage the hierarchical relationships (once it is in place) and you can let your users manage the content in the reference lists.

This function works with any number of options in the dropdowns as well as multi-select parent and child columns, as shown in the following table. This is significant because each of the three column types are rendered significantly differently by SharePoint.



| | | parentColumn |
|------------- |
| | | <20 options | 20+ options | multi-select |
| childColumn | <20 options | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| |  20+ options | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| | multi-select | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |


When the relationshipList contains lookup columns for both the relationshipListParentColumn and relationshipListChildColumn columns, the function uses the relationshipListParentColumn's ID rather than the relationshipList item's ID. This means that "secondary lists" are also supported.

![](img/SPCascadeDropdown1.png)

Note that "multiple cascades" are supported, such as Country -> Region -> State. In this example, we have two "cascades" in place: Country -> Region, and Region -> State. There's not a lot to show here, but the available options in the dropdowns will change based on the relationships defined in the lists shown below. So, if you choose **Country** = `United States`, the options for **Region** will be limited to `Northeast, Southeast, Midwest, Mountain, Southwest, Northwest`. If you choose **Country** = `Canada`, the options for **Region** would be `Eastern Provinces, Western Provinces`.

## Demo Page

Take a look at our [demo page ](http://www.sympraxisconsulting.com/Demos/Demo%20Pages/CascadingDropdowns.aspx).

## Prerequisites

*   Relationship list contains at least two columns: relationshipListParentColumn and relationshipListChildColumn
*   The dropdown for childColumn is a lookup into relationshipList's relationshipListChildColumn column OR a list column which is a lookup into another list column ("secondary list").

## Syntax

```javascript
$().SPServices.SPCascadeDropdowns({
  relationshipWebURL: "",
  relationshipList: "",
  relationshipListParentColumn: "",
  relationshipListChildColumn: "",
  relationshipListSortColumn: "",
  parentColumn: "",
  childColumn: "",
  CAMLQuery: "",
  CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>", // Added in 2013.01
  listName: $().SPServices.SPListNameFromUrl(),
  promptText: "",
  simpleChild: false,			// Added in v0.6.2
  selectSingleOption: false,    // Added in v0.6.2
  matchOnId: false,             // Added in v0.7.1
  completefunc: null,
  debug: false
});
```

_relationshipWebURL_

The URL of the Web (site) which contains the relationshipList. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

**_relationshipList_**

The name or GUID of the list which contains the parent/child relationships. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the _relatedWebURL_ if the list is in another site.

**_relationshipListParentColumn_**

The [StaticName](../glossary.md#staticname) of the parent column in the _relationshipList_

**_relationshipListChildColumn_**

The [StaticName](../glossary.md#staticname) of the child column in the _relationshipList_

_CAMLQuery_

The CAMLQuery option allows you to specify an additional filter on the relationshipList. The additional filter will be <And>ed with the existing CAML which is checking for matching items based on the parentColumn selection. Because it is combined with the CAML required to make the function work, CAMLQuery should contain a CAML **fragment** such as:
``` javascript
<Eq><FieldRef Name='Country'/><Value Type='Text'>United States</Value></Eq>
```

_CAMLQueryOptions_

This option can be used to specify additional options for retrieval from the sourceList. See the [MSDN documentation for GetListItems](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx) for the syntax.

_relationshipListSortColumn_

If specified, sort the options in the dropdown by this column otherwise the options are sorted by _relationshipListChildColumn_

**_parentColumn_**

The [DisplayName](../glossary.md#displayname) of the parent column in the _form_

**_childColumn_**

The [DisplayName](../glossary.md#displayname) of the child column in the _form_

_listName_

By default, set to the list name for the current context based on the URL. If your form is outside the context of the list, then you can specify the listName yourself.

_promptText_

Text to use as prompt. If included, {0} will be replaced with the value of childColumn. The default value is `""`.

NOTE: I discourage the use of this option. Yes, I put it into the function, but if the user doesn't make a choice, they get an ugly error because SharePoint doesn't understand it as an option. I've left in in for backward compatibility.

**Deprecated in v0.7.1.**

_simpleChild_

If set to true, the child dropdown will be converted to a "simple" dropdown - only if it is a "complex" dropdown on page load. See [$().SPServices.SPComplexToSimpleDropdown](http://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPComplexToSimpleDropdown) for details on how this works.  The default value is false.

_selectSingleOption_

If set to true and there is only a single child option, select it.  The default value is false.

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

## Example

To make the example shown at the top of the page for Country -> Region -> State work, here's what you need to do.

The end result will look like this:

![](img/SPCascadeDropdown1.png)

You'll need these three relationship lists:

**Countries List**

The Countries list simply contains all of the country names, stored in the list's Title column.

![](img/SPCascadeDropdown2.png)

**Regions List**

The Regions list contains all of the Region names in the Title column. The Country column is a Lookup column into the Countries list's Title column.

![](img/SPCascadeDropdown3.png) 

**States List**

The States list contains all of the State names in the Title column. Note that I've changed the DisplayName of the Title column to State, but the StaticName is still Title. The Region Name column is a Lookup column into the Regions list's Title column. (The State Abbreviation column is only here to show that you can also store additional information about the States in this list. The same is true of the Countries and Regions lists, of course.)

![](img/SPCascadeDropdown4.png) 

This is the sum total of what you'll need to add to your page to make the function work for the example above. The first two lines simply pull the script files into the page, and the `$(document).ready(function()` line is a jQuery function that says "Run this script when the page has been fully rendered". In the first call to the function, note that we're turning [debug mode](../glossary.md#debug-mode) on by setting `debug: true`.

```html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.11.3.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-2014.02.min.js"></script>
<script language="javascript" type="text/javascript">

$(document).ready(function() {
  $().SPServices.SPCascadeDropdowns({
    relationshipList: "Regions",
    relationshipListParentColumn: "Country",
    relationshipListChildColumn: "Title",
    CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>",   parentColumn: "Country",
    childColumn: "Region",
    debug: true
  });
  $().SPServices.SPCascadeDropdowns({
    relationshipList: "States",
    relationshipListParentColumn: "Region_x0020_Name",
    relationshipListChildColumn: "Title",
    relationshipListSortColumn: "ID",
    parentColumn: "Region",
    childColumn: "State"
  });
});

</script>
```
