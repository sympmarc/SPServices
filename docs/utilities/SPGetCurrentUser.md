---
title: 'SPGetCurrentUser'
function: '$().SPServices.SPGetCurrentUser'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'This function returns information about the current user. It is based on an insightful trick from Einar Otto Stangvik (see Credits).'
introduced: 0.3.1
---

## Functionality

This utility function, which is also publicly available, returns information about the current user.

## How It Works

The SPGetCurrentUser function does an AJAX call to grab `/_layouts/userdisp.aspx?Force=True` and "scrapes" the values from the page based on the internal field name (aka StaticName).

<div class="alert alert-danger">**Note**: There is a bug in the versions 2013.01, 2013.02, and 2014.01 where only the relative path (`"/"`) is returned from [$().SPServices.SPGetCurrentSite](https://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPGetCurrentSite) rather than the full path (`"http://servername/sitename"`). This causes problems in the root site for $().SPServices.SPGetCurrentUser.</div>

## Syntax

``` javascript
$().SPServices.SPGetCurrentUser({
  webURL: "",		// Added in 2013.01  
  fieldName: "Name"</span>,
  fieldNames: {},     	// Added in v0.7.2 to allow multiple columns  
  debug: false
});
```

### webURL

URL of the target Site Collection.  If not specified, the current Web is used.

### fieldName
You can specify which value from `userdisp.aspx` you'd like returned with this option. The default is the user's account (`Name` in the `Field Internal Name` column below). You can specify any of the `Field Internal Name`s for option `fieldName`. The fields listed below are the default out-of-the-box fields. If you’ve got custom fields which are exposed on the `userdisp.aspx` page, then you should be able to retrieve them with this function as well.  

Note that, as of [v0.6.1](http://spservices.codeplex.com/releases/view/62021), you can also request the ID of the user by specifying `fieldName: "ID"`.  

| Field Name | Field Internal Name | WSS | MOSS |
| ---------- | ------------------- | ----| -----|
| Account | Name | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| Name | Title | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| Work e-mail | EMail | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| About me | Notes | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| Picture | Picture | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| Department | Department | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| Job Title | JobTitle | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| SIP Address | SipAddress | ![](../img/checkmark.gif) | ![](../img/checkmark.gif) |
| First name | FirstName | | ![](../img/checkmark.gif) |
| Last Name | LastName | | ![](../img/checkmark.gif) |
| Work phone | WorkPhone | | ![](../img/checkmark.gif) |
| Office | Office | | ![](../img/checkmark.gif) |
| User name | UserName | | ![](../img/checkmark.gif) |
| Web site | WebSite | | ![](../img/checkmark.gif) |
| Responsibilities | SPResponsibility | | ![](../img/checkmark.gif) |

### fieldNames
Added in v0.7.2 to allow requesting multiple column values. The column names can be passed in as an array, such as ["ID", "Last Name"]

### debug
Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like specifying a value which doesn't exist. I call this [debug mode](../glossary.md#debug-mode).

## Examples

``` javascript
var thisUserAccount = $().SPServices.SPGetCurrentUser({
	fieldName: "Name",
	debug: false
});
```

``` javascript
var thisUserName = $().SPServices.SPGetCurrentUser({
	fieldName: "Title",
	debug: false
});
```

``` javascript
var thisUserID = $().SPServices.SPGetCurrentUser({
	fieldName: "ID",
	debug: false
});
```

``` javascript
var thisUsersValues = $().SPServices.SPGetCurrentUser({
	fieldNames: ["ID", "Name", "SIP Address"],
	debug: false
});
```
