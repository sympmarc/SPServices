---
title: 'SPAutocomplete'
function: '$().SPServices.SPAutocomplete'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'The SPAutocomplete lets you provide values for a Single line of text column from values in a SharePoint list. The function is highly configurable and can enhance the user experience with forms.'
introduced: 0.5.4
---

## Functionality

The SPAutocomplete function lets you provide values for a single line of text column from values in a SharePoint list. The function is highly configurable and can enhance the user experience with forms.

## Demo Page

Take a look at the [demo page](http://www.sympraxisconsulting.com/Demos/Demo Pages/SPAutocomplete.aspx).

## Prerequisites

*   Source list contains a column of available values

## Syntax

``` javascript
$().SPServices.SPAutocomplete({
	WebURL: "",
	sourceList: "",
	sourceColumn: "",
	columnName: "",
	CAMLQuery: "",
	CAMLQueryOptions: "<QueryOptions></QueryOptions>",
	filterType: "BeginsWith",
	numChars: 0,
	ignoreCase: false,
	highlightClass: "",
	uniqueVals: false,
	slideDownSpeed: "fast",
 processingIndicator: "<img src='_layouts/images/REFRESH.GIF'/>", // NOTE: This option has been deprecated as of v0.6.0 	debug: false
});
```

### WebURL

The URL of the Web (site) which contains the sourceList. If not specified, the current site is used. Examples would be: `"/"`, `"/Accounting"`, `"/Departments/HR"`, etc. **Note**: It's always best to use relative URLs.

### sourceList

The name or GUID of the list which contains the available values. If you choose to use the GUID, it should look like: `"{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}"`. Note also that if you use the GUID, you do not need to specify the WebURL if the list is in another site.

### sourceColumn

The [StaticName](../glossary.md#staticname) of the source column in sourceList

### columnName

The [DisplayName](../glossary.md#displayname) of the column in the form

### CAMLQuery

The CAMLQuery option allows you to specify an additional filter on the relationshipList. The additional filter will be <And>ed with the existing CAML which is checking for matching items based on the parentColumn selection. Bacause it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML **fragment** such as:

``` javascript
CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
```

### CAMLQueryOptions

This option can be used to specify additional options for retrieval from the sourceList. See the [MSDN documentation for GetListItems](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx) for the syntax.

### filterType

This option allows you to specify how values should be matched. The available values are `[BeginsWith, Contains]` and the default is `"BeginsWith"`.

### numChars
Wait until this number of characters has been typed before attempting any actions. The default is `0`.

### ignoreCase
If set to true, the function ignores case, if false it looks for an exact match. The default is `false`. 

### highlightClass

When a matching value is shown, the matching characters are wrapped in a `<span>`. If highlightClass is specified, that class is applied to the `span`. An example might be:

``` javascript
highlightClass: "ms-bold",
```

### uniqueVals

If set to true, only unique values returned from sourceList will be shown. The default is `false`.

### slideDownSpeed

Speed at which the div should slide down when values match (milliseconds or `[fast, slow]`). The default is `"fast"`.

### processingIndicator

**Note**: This option has been deprecated as of v0.6.0

If present, this markup will be shown while Web Service processing is occurring. The default is `"<img src='_layouts/images/REFRESH.GIF'/>"`. Because this library requires no server-side deployment, I wanted to use one of the out of the box images. You can substitute whatever image or text you would like in HTML format.

### debug

Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like using a column name which doesn't exist. I call this [debug mode](../glossary.md#debug-mode).

## Examples

This is the sum total of what you'll need to add to your page to make the function work as it does in the [demo page](http://www.sympraxisconsulting.com/Demos/Demo Pages/SPAutocomplete.aspx). The first two lines simply pull the script files into the page, and the `$(document).ready(function()` line is a jQuery function that says "Run this script when the page has been fully rendered". In the first call to the function, note that we're turning [debug mode](../glossary.md#debug-mode) on by setting `debug: true`.

``` html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.4.2.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.5.4.min.js"></script>
<script language="javascript" type="text/javascript">
$(document).ready(function() {
	$().SPServices.SPAutocomplete({
		sourceList: "Products",
		sourceColumn: "Title",
		columnName: "Title",
		ignoreCase: true,
		numChars: 3,
		slideDownSpeed: 1000,
		debug: true
	});
});
</script>
```
