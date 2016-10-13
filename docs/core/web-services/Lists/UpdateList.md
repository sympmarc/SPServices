---
title: 'UpdateList'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'UpdateList'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This is an example from [MartijnMolegraaf](http://www.codeplex.com/site/users/view/MartijnMolegraaf).

```javascript
// Update default values of the metadata fields
var fieldsToUpdate = '<Fields>';
fieldsToUpdate += '<Method ID="1"><Field Type="Text" Name="ProjectName" DisplayName="Project name"><Default>' + projectName + '</Default></Field></Method>';
fieldsToUpdate += '<Method ID="2"><Field Type="Text" Name="MarinProjectNumber" DisplayName="Project number"><Default>' + projectNumber + '</Default></Field></Method>';
fieldsToUpdate += '<Method ID="3"><Field Type="Text" Name="CustomerNumber" DisplayName="Customer number"><Default>' + customerNumber + '</Default></Field></Method>';
fieldsToUpdate += '<Method ID="4"><Field Type="Text" Name="CustomerName" DisplayName="Customer name"><Default>' + customerName + '</Default></Field></Method>';
fieldsToUpdate += '</Fields>';


$().SPServices({
  operation: "UpdateList",
  listName: "Documents",
  listProperties:"",
  updateFields: fieldsToUpdate,
  newFields: "",
  deleteFields: "",
  listVersion: "",
  async: false,
  completefunc: function (xData, Status){}
});
```
