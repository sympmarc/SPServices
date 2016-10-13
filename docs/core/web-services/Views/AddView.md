---
title: 'AddView'
function: '$().SPServices'
web_service: 'Views'
web_service_operation: 'AddView'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This example comes from [whiskers1978](https://www.codeplex.com/site/users/view/whiskers1978).

```javascript
$().SPServices({
    operation: "AddView",
    listName: "Test List 2",
    viewName: "Test2",
    viewFields: "<ViewFields><FieldRef Name='Title' /><FieldRef Name='State' /></ViewFields>",
    query: "<Query><Where><Eq><FieldRef Name='State' /><Value Type='Text'>Massachusetts</Value></Eq></Where></Query>",
    rowLimit: "<RowLimit paged='True'>100</RowLimit>",
    type: "HTML",
    makeViewDefault: false,
    completefunc: function (xData, Status) {
        alert(xData.responseText);
    }
});
```

Note that if you omit the Type in the Where clause, your view will be created, but it will throw an error. See the thread for more details.
