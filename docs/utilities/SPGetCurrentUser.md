---
title: 'SPGetCurrentUser'
---

## Function

**$().SPServices.SPGetCurrentUser**

## Certification

[![Certified for SharePoint 2007](../img/sp2007-cert.jpg "Certified for SharePoint 2007")](../glossary/index.md#Certification) [![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)*

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
| Account | Name | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Name | Title | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Work e-mail | EMail | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| About me | Notes | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Picture | Picture | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Department | Department | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Job Title | JobTitle | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| SIP Address | SipAddress | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| First name | FirstName | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Last Name | LastName | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Work phone | WorkPhone | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Office | Office | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| User name | UserName | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Web site | WebSite | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |
| Responsibilities | SPResponsibility | | ![](http://mdasblog.files.wordpress.com/2009/09/chkmrk.gif) |

### fieldNames
Added in v0.7.2 to allow requesting multiple column values. The column names can be passed in as an array, such as ["ID", "Last Name"]

### debug
Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like specifying a value which doesn't exist. I call this [debug mode](../glossary/index.md#DebugMode).

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

\* Attested by Geoff Varosky
