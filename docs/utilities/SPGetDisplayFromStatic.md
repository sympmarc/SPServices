---
title: 'SPGetDisplayFromStatic'
function: '$().SPServices.SPGetDisplayFromStatic'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This function returns the DisplayName for a column based on the StaticName.'
introduced: 0.4.0
---

## Functionality

This function returns the [DisplayName](../glossary.md#displayname) for a column based on the [StaticName](../glossary.md#staticname). This simple utility function, which utilizes the GetList operation of the Lists Web Service, seemed useful to expose as a public function.

## Prerequisites

_None_

## Syntax

``` javascript
var thisDisplayName = $().SPServices.SPGetDisplayFromStatic ({
  webURL: "",
  listName: "",
  columnStaticName: "",
  columnStaticNames: {}   // Added in v0.7.2 to allow multiple columns
});
```

### webURL

The URL of the Web (site) which contains the listName. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### listName

The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.

### columnStaticName

The [StaticName](../glossary.md#staticname) of the column.

### columnStaticNames

The [StaticName](../glossary.md#staticname)s of the columns in an array. This option was added in v0.7.2 to allow multiple column conversions at the same time.

## Example

The following example will return the [DisplayName](../glossary.md#displayname) for the Title column in the States list in the current site.

``` html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.8.2.min.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.7.2.min.js"></script>
<script language="javascript" type="text/javascript">
  $(document).ready(function() {

    // Retrieve one value
    var thisDisplayName = $().SPServices.SPGetDisplayFromStatic ({
      listName: "States",
      columnStaticName: "Title"
    });
    alert("The DisplayName for the Title column is: " + thisDisplayName);
    ... do more stuff...

    // Retrieve multiple values
    var thisDisplayNames = $().SPServices.SPGetDisplayFromStatic ({
      listName: "States",
      columnStaticNames: ["Title", "State"] });
    alert("The DisplayNames for the columns are: " + thisDisplayNames);
    ... do more stuff...
  });
</script>
```
