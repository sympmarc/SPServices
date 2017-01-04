---
title: 'SPGetListWorkflows'
function: '$().SPServices.SPGetListWorkflows'

description: 'Function to return an array of workflows associated with the supplied list'
introduced: 0.4.0
---

## Functionality

Function to return an array of workflows associated with the supplied list.  Useful for identifying what workflows may be associated with a list.

## Prerequisites

_None_

## Syntax

``` javascript
$().SPServices.SPGetListWorkflows({
	webURL: "",
	listName: ""
});
```

### webURL

The URL of the Web (site) which contains the listName. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### listName

The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the relationshipWebURL if the list is in another site.

## Example

The following example will return the workflow names associated with a list

``` html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.4.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.5.1.min.js"></script>
<script language="javascript" type="text/javascript">
  var listWorkflows = $().SPServices.SPGetListWorkflows({
    listName: "States"
  });
</script>
```
