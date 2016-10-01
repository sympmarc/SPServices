---
title: 'SPGetStaticFromDisplay'
---

## Function

**$().SPServices.SPGetStaticFromDisplay**

## Certification

[![Certified for SharePoint 2007](../img/sp2007-cert.jpg "Certified for SharePoint 2007")](../glossary/index.md#Certification) [![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)

## Functionality

This function returns the [StaticName](../glossary/index.md#StaticName) for a column based on the [DisplayName](../glossary/index.md#DisplayName). This simple utility function, which utilizes the GetList operation of the Lists Web Service, seemed useful to expose as a public function.

## Prerequisites

_None_

## Syntax

``` javascript
var thisStaticName = $().SPServices.SPGetStaticFromDisplay ({
  webURL: "",
  listName: "",
  columnDisplayName: "",
  columnDisplayNames: {}   // Added in v0.7.2 to allow multiple columns
});
```

### webURL

The URL of the Web (site) which contains the listName. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### listName
The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.

### columnDisplayName

The [DisplayName](../glossary/index.md#DisplayName) of the column.

### columnDisplayNames

The [DisplayName](../glossary/index.md#DisplayName)s of the columns in an array. This option was added in v0.7.2 to allow multiple column conversions at the same time.

## Example

The following example will return the [StaticName](../glossary/index.md#StaticName) for the Title column in the States list in the current site.

``` html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.8.2.min.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.7.2.min.js"></script>
<script language="javascript" type="text/javascript">
  $(document).ready(function() {

    // Retrieve one value
    var thisStaticName = $().SPServices.SPGetStaticFromDisplay ({
      listName: "States",
      columnDisplayName: "Title"
    });
    alert("The StaticName for the Title column is: " + thisStaticName);
    ... do more stuff...

    // Retrieve multiple values
    var thisStaticNames = $().SPServices.SPGetStaticFromDisplay ({
      listName: "States",
      columnDisplayNames: ["Title", "State"]
    });
    alert("The StaticNames for the columns are: " + thisStaticNames);
    ... do more stuff...
  });
</script>
```
