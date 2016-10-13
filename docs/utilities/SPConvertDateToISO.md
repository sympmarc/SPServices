---
title: 'SPConvertDateToISO'
function: '$().SPServices.SPConvertDateToISO'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items.'
introduced: 2013.01
---

## Functionality

This utility function converts a JavaScript date object to the ISO 8601 format required by SharePoint to update list items.

## Syntax

``` javascript
$().SPServices.SPConvertDateToISO({
   dateToConvert: new Date(),
   dateOffset: "-05:00"
});
```

### dateToConvert

The JavaScript date we'd like to convert. If no date is passed, the function returns the current date/time.

### dateOffset

The time zone offset requested. Default is EST.

## Returns

A string date in ISO format, e.g., "2013-05-08T01:20:29Z-05:00".

## Example

``` javascript
var thisDate = $().SPServices.SPConvertDateToISO();
```
