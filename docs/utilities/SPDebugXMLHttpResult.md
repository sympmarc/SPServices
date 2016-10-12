---
title: 'SPDebugXMLHttpResult'
function: '$().SPServices.SPDebugXMLHttpResult'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This function displays the XMLHttpResult from an Ajax call formatted for easy debugging. You can call it manually as part of your completefunc.'
introduced: 0.2.10
---

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
