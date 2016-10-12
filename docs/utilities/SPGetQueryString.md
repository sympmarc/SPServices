---
title: 'SPGetQueryString'
function: '$().SPServices.SPGetQueryString'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'The SPGetQueryString function returns an array containing the Query String parameters and their values.'
introduced: 0.5.1
---

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
