---
title: 'SPGetListItemsJson'
function: '$().SPServices.SPGetListItemsJson'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'SPGetListItemsJson combines several SPServices capabilities into one powerful function. By calling GetListItemChangesSinceToken, parsing the list schema, and passing the resulting mapping and data to SPXmlToJson automagically, we have a one-stop shop for retrieving SharePoint list data in JSON format. No manual mapping required!'
introduced: 2014.01
---

## Functionality

SPGetListItemsJson combines several SPServices capabilities into one powerful function. By calling [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx), parsing the list schema, and passing the resulting mapping and data to [SPXmlToJson](SPXmlToJson.md) automagically, we have a one-stop shop for retrieving SharePoint list data in JSON format. No manual mapping required!

<div class="alert alert-warning">**Note:** The function does not handle custom Field Types. If you have custom Field Types, you can create your own mapping to handle them but you are limited to the existing objectTypes. See [this discussion](https://spservices.codeplex.com/discussions/577590) for details on one specific case.</div>

## Prerequisites

None

## Syntax

``` javascript
$().SPServices.SPGetListItemsJson({
  webURL: "",
  listName: "",
  viewName: "",
  CAMLQuery: "",
  CAMLViewFields: "",
  CAMLRowLimit: "",
  CAMLQueryOptions: "",
  changeToken: "",
  contains: "",
  mapping: null,
  mappingOverrides: null,
  debug: false
});
```

### webURL

The URL of the Web (site) which contains the list. If not specified, the current site is used. Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.

### listName

The name or GUID of the list which contains the parent/child relationships. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". Note also that if you use the GUID, you do not need to specify the _webURL_ if the list is in another site.

### CAMLQuery

The CAMLQuery option allows you to specify the filter on the list. CAMLQuery here should contain valid CAML such as:

``` javascript
CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq></Where></Query>"
```

See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### CAMLViewFields

If specified, only the columns in CAMLViewFields plus some other required columns are retrieved. This can be very important if your list has a lot of columns, as it can reduce the amount of data returned from the call. See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### CAMLRowLimit

This option can be used to limit the number of items retrieved from the list. See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### CAMLQueryOptions

This option can be used to specify additional options for retrieval from the list. See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### changeToken

GetListItemChangesSinceToken passes back a _changeToken_ on each call. If you are making calls after the initial one and pass in the _changeToken_ value, only the changes since that token will be retrieved. See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### contains

This option allows you to pass in an additional filter for the request. It should be a valid CAML clause. See the [MSDN documentation for GetListItemsChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) for the syntax.

### mapping

If you have created your own _mapping_, as specified in [SPXmltoJson](https://spservices.codeplex.com/wikipage?title=%24%28%29.SPXmlToJson), pass it as this option. If present, the function will use your mapping and ignore the list schema returned by GetListItemChangesSinceToken.

### mappingOverrides

If you want the function to use the list schema returned by GetListItemChangesSinceToken for the majority of the columns but you would like to specify your own mapping for some of the columns, pass those mappings in using the _mappingOverrides_ option.

As an example, this _mappingOverride_ would only change the way the two specified columns are converted by the [SPXmlToJson](https://spservices.codeplex.com/wikipage?title=%24%28%29.SPXmlToJson) function internally in the call (the **JSON** _objectType_ is not available from the list schema):

``` javascript
mappingOverrides: {
  ows_FiscalPeriodData: {
    mappedName: "FiscalPeriodData",
    objectType: "JSON"
  },
  ows_FiscalPeriodNames: {
    mappedName: "FiscalPeriodNames",
    objectType: "JSON"
  }
}
```

### debug

Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like using a column name which doesn't exist. I call this [debug mode](../glossary.md#debug-mode).

## Returns

The function returns a JavaScript object like so:

``` javascript
{
  changeToken: "",
  mapping: {},
  data: [],
  deletedIds: []
}
```

### changeToken

The _changeToken_ as returned by GetListItemChangesSinceToken. This token can be passed to subsequent calls to the function. The various parts of the _changeToken_ have specific meaning, but you should treat it as an immutable string.

### mapping

The mapping used to parse the data into JSON. This mapping will include any specific overrides you specified as well as the automatically created mappings. You can pass this mapping into the function on subsequent calls to reduce overhead, though the function saves the mapping in a local data store for reuse.

### data

The main reason we make the call, the data property is an object containing all of the retrieved data in JSON format, as specified in [SPXmlToJson](https://spservices.codeplex.com/wikipage?title=%24%28%29.SPXmlToJson).

### deletedIds

If this is call 2-n to the function, _deletedIds_ will contain an array of IDs for list items which have been deleted since the prior call.

## Example

In this example, I’m reading items from a list containing information about trainees in courses. Two of the columns – Scores and Attendance – are Multiple lines of text columns which contain JSON in text format.

``` javascript
var traineePromise = $().SPServices.SPGetListItemsJson({
    listName: "Trainees",
    CAMLQuery: "<Query><Where><Eq><FieldRef Name='accountName' LookupId='TRUE'/><Value Type='Integer'>" + opt.traineeId + "</Value></Eq></Where></Query>",
    changeToken: opt.changeToken,
    mappingOverrides: {
        ows_Scores: {
            mappedName: "Scores",
            objectType: "JSON"
        },
        ows_Attendance: {
            mappedName: "Attendance",
            objectType: "JSON"
        }
    }
});

$.when(traineePromise).done(function() {

    thisTraineeUser = this.data;

});
```
