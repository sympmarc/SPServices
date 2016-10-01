---
title: 'SPDebugXMLHttpResult'
---

## Function

**$().SPServices.SPDebugXMLHttpResult**

## Certification

[![Certified for SharePoint 2007](../img/sp2007-cert.jpg "Certified for SharePoint 2007")](../glossary/index.md#Certification) [![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)

## Functionality

This function displays the XMLHttpResult from an AJAX call formatted for easy debugging. You can call it manually as part of your completefunc. The function returns an HTML string which contains a parsed version of the XMLHttpResult object.

## Prerequisites

_None_

## Syntax

``` javascript
var out = $().SPServices.SPDebugXMLHttpResult({
	node: xData.responseXML
});
```

### node

An XMLHttpResult object returned from an AJAX call

## Example

``` javascript
$().SPServices({
	operation: "GetList",
	listName: "States",
	completefunc: function (xData, Status) {
		var out = $().SPServices.SPDebugXMLHttpResult({
			node: xData.responseXML
		});
		$("#WSOutput").html("").append("<b>This is the output from the GetList operation:</b>" + out);
	}
});
```
