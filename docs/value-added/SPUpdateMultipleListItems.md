---
title: 'SPUpdateMultipleListItems'
function: '$().SPServices.SPUpdateMultipleListItems'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.'
introduced: 0.5.8
---

## Functionality

SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.

**IMPORTANT NOTE:** The first iterations of this function only worked with lists, not Document Libraries. As of [v0.6.1](http://spservices.codeplex.com/releases/view/62021), it works with Document libraries as well.

## How Does It Work?

The SPUpdateMultipleListItems function works like this:

*   It first calls GetListItems with the provided CAMLQuery to find all off the items which meet the criteria
*   Then the function calls UpdateListItems and updates all of the items found with the values provided

## Prerequisites

None

## Syntax

``` javascript
$().SPServices.SPUpdateMultipleListItems({
  webURL: "",
  listName: "",
  CAMLQuery: "",
  batchCmd: "Update",
  valuepairs: [],
  debug: false,
  completefunc: null
});
```

### webURL

The URL of the Web (site) which contains the list. If not specified, the current site is used. Examples would be: `"/"`, `"/Accounting"`, `"/Departments/HR"`, etc. **Note**: It's always best to use relative URLs.

### listName

The name or GUID of the list. If you choose to use the GUID, it should look like: `"{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}"`. Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.

### CAMLQuery

The CAMLQuery option allows you to specify the filter on the list. CAMLQuery here should contain valid CAML such as:

``` javascript
CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq></Where></Query>"
```

### batchCmd

The batchCmd option specifies what the action should be. The choices are `"Update"` or `"Delete"`. `"Update"` is the default.

### completefunc

If specified, the completefunc will be called each time there is a change to parentColumn. Potential uses for the completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. You can pass your completefunc in either of these two ways:

``` javascript
completefunc: function() {
  ...do something...
},
```

or

``` javascript
completefunc: doSomething, // Where doSomething is the name of your function
```

### debug

Setting `debug: true` indicates that you would like to receive messages if anything obvious is wrong with the function call, like using a column name which doesn't exist. I call this [debug mode](../glossary.md#debug-mode).

**NOTE**: Debug mode is not implemented in the initial release of SPUpdateMultipleListItems in v0.5.8.

## Examples

``` javascript
$().SPServices.SPUpdateMultipleListItems({
  listName: "States",
  CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq></Where></Query>",
  valuepairs: [["Status", "Inactive"]]
});
```

This call to SPUpdateMultipleListItems will update all of the items in the States list which have their Status = "Active", setting their Status = "Inactive".

``` javascript
$().SPServices.SPUpdateMultipleListItems({
  listName: "States",
  CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Inactive</Value></Eq></Where></Query>",
  batchCmd: "Delete"
});
```

This call to SPUpdateMultipleListItems will delete all of the items in the States list which have their Status = "Inactive".
