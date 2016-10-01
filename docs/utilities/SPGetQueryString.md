---
title: 'SPGetQueryString'
---

## Function

**$().SPServices.SPGetQueryString**

## Certification

[![Certified for SharePoint 2007](../img/sp2007-cert.jpg "Certified for SharePoint 2007")](../glossary/index.md#Certification) [![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)

## Functionality

The SPGetQueryString function parses out the parameters on the Query String and makes them available for further use. This function was previously included, but was a private function.

## Syntax

``` javascript
var queryStringVals = $().SPServices.SPGetQueryString();
```

The Query String parameter values can then be accessed by name reference:

``` javascript
var thisSource = queryStringVals["Source"];
```

or

``` javascript
var thisSource = queryStringVals.Source;
```

## Example

In this example, lastID will be assigned the value of the ID Query String parameter. So if the URL is:
`http://servername/sitename/Lists/MyList/NewForm.aspx?ID=10`
lastID will be assigned the value 10.

``` javascript
var queryStringVals = $().SPServices.SPGetQueryString();
var lastID = queryStringVals["ID"];
```
