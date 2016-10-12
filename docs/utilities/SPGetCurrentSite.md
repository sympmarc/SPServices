---
title: 'SPGetCurrentSite'
function: '$().SPServices.SPGetCurrentSite'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This utility function, which is also publicly available, simply returns the current site’s URL. It mirrors the functionality of the WebUrlFromPageUrl operation.'
introduced: 0.2.4
---

## Functionality

This utility function, which is also publicly available, simply returns the current site’s URL. It mirrors the functionality of the WebUrlFromPageUrl operation.

<div class="alert alert-danger">**Note**: There is a bug in the versions 2013.01, 2013.02, and 2014.01 where only the relative path (`"/"`) is returned rather than the full path (`"http://servername/sitename"`). This causes problems in the root site for $().SPServices.SPGetCurrentSite and [$().SPServices.SPGetCurrentUser](SPGetCurrentUser.md).</div>

## Syntax

``` javascript
$().SPServices.SPGetCurrentSite();
```

## Example

``` javascript
var thisSite = $().SPServices.SPGetCurrentSite();
```

## Available Options

None

## Returns

The current site URL as a string. For example, if the current page is:  

`http://servername/sitename/Pages/default.aspx`
or  
`http://servername/sitename/Shared%20Documents/Forms/EditForm.aspx`
or  
`http://servername/sitename/Lists/Calendar/NewForm.aspx`

the function will return:

`http://servername/sitename`
