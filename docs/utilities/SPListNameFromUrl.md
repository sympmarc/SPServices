---
title: 'SPListNameFromUrl'
function: '$().SPServices.SPListNameFromUrl'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'Returns the current list’s GUID *if* called in the context of a list, meaning that the URL is within the list, like /DocLib or /Lists/ListName.'
introduced: 0.5.7
---

## Functionality

This utility function, which is also publicly available, returns the current list's GUID **_if_** called in the context of a list, meaning that the URL is within the list, like **/DocLib** or **/Lists/ListName**.

## Syntax

``` javascript
$().SPServices.SPListNameFromUrl();
```

### listName

Option to allow passing in a URL to the function rather than simply picking up the current context. This will help where custom list forms are stored outside the list context.

## Returns

The current list's GUID.

## Example

``` javascript
var thisList = $().SPServices.SPListNameFromUrl();
```
