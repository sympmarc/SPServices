## Function

**$().SPServices.SPGetLastItemId**

## Certification

[![Certified for SharePoint 2007](/docs/img/sp2007-cert.jpg)](/docs/glossary/index.md#Certification) [![Certified for SharePoint 2010](/docs/img/sp2010-cert.jpg "Certified for SharePoint 2010")](/docs/glossary/index.md#Certification)

## Functionality

Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships. This function was built for use by the [$().SPServices.SPRedirectWithID](/docs/value-added/SPRedirectWithID.md) function, but is also useful in other circumstances.

## Prerequisites

* none

## Syntax

``` javascript
$().SPServices.SPGetLastItemId({	
	webURL: "",
	listName: "",
	userAccount: "",
	CAMLQuery: ""
});
```

### webURL

The URL of the Web (site) which contains the listName. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### listName

The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the relationshipWebURL if the list is in another site.

### userAccount

The account for the user in DOMAIN\username format. If not specified, the current user is used.

### CAMLQuery

The CAMLQuery option allows you to specify an additional filter on the relationshipList. The additional filter will be <And>ed with the existing CAML which is checking for matching items based on the parentColumn selection. Bacause it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML **fragment** such as:

``` xml
CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
```

## Example

The following example will return the most recently created item's ID for the current user from the States list in the current site.

``` javascript
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.4.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.5.1.min.js"></script>
<script language="javascript" type="text/javascript">
  var lastId = $().SPServices.SPGetLastItemId({ 
    listName: "States"
  }); 
</script>
```
