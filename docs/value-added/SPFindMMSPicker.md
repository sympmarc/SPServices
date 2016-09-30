---
title: 'SPFindMMSPicker'
---

## Function

**$().SPServices.SPFindMMSPicker**

## Certification

[![Certified for SharePoint 2010](../img/sp2010-cert.jpg "Certified for SharePoint 2010")](../glossary/index.md#Certification)

## Functionality

The SPFindMMSPicker function helps you find a Managed Metadata Service (MMS) Picker's values.

## Syntax

``` javascript
$().SPServices.SPFindMMSPicker({  
  MMSDisplayName: ""  
});
```

### MMSDisplayName
The [DisplayName](../glossary/index.md#DisplayName) of the People Picker in the form.

## Returns

The function returns an array of terms, with both the guid and the value for each term.

## Example

Assume there is a MMS Picker in the form for a column named **Office** which allows multiple values and that it is set like so:

![](img/SPFindMMSPicker1.png)

After the call:

``` javascript
var office = $().SPServices.SPFindMMSPicker({
  MMSDisplayName: "Office"
});
```

office will be an object like this:

![](img/SPFindMMSPicker2.png)

Note that invalid values will have the guid set to "00000000-0000-0000-0000-000000000000".
