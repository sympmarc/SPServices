---
title: 'SPListNameFromUrl'
---

## Function

**$().SPServices.SPListNameFromUrl**

## Certification

[![Certified for SharePoint 2007](../img/sp2007-cert.jpg "Certified for SharePoint 2007")](../glossary/index.md#Certification) [![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)

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
