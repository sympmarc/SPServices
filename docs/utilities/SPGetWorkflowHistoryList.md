---
title: 'SPGetWorkflowHistoryList'
function: '$().SPServices.SPGetWorkflowHistoryList'

description: 'Function to return the GUID of a workflow's History List'
introduced: 0.4.0
---

## Functionality

Function to return the GUID of a workflow's History List

## Prerequisites

_None_

## Syntax

``` javascript
$().SPServices.SPGetWorkflowHistoryList({
	webURL: "",
	workflowName: ""
});
```

### webURL

The URL of the Web (site) which contains the listName. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### workflowName

The name of the workflow of which to obtain the History List GUID.

## Example

The following example will return the workflow's History List ID

``` html
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery-1.4.1.min.js"></script>
<script language="javascript" type="text/javascript" src="../../jQuery%20Libraries/jquery.SPServices-0.5.1.min.js"></script>
<script language="javascript" type="text/javascript">
  var listWorkflows = $().SPServices.SPGetWorkflowHistoryList({
    workflowName: "newStateNotificationWorkflow"
  });
</script>
```
