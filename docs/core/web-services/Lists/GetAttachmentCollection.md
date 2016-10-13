---
title: 'GetAttachmentCollection'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'GetAttachmentCollection'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This is an example from Matt Bramer ([iOnline247](http://www.codeplex.com/site/users/view/iOnline247)) from his [post in the discussions](https://spservices.codeplex.com/discussions/400677).
```javascript
$().SPServices({
  operation: "GetAttachmentCollection",
  listName: "MahAwesomeListName",
  ID: id,
  completefunc: function(xData, Status) {
    //console.log( Status );
    //console.log( xData.responseText );

    var output = "";

    //debugger;

    $(xData.responseXML).find("Attachments > Attachment").each(function(i, el) {
      var $node = $(this),
        filePath = $node.text(),
        arrString = filePath.split("/"),
        fileName = arrString[arrString.length - 1];

      output += "<a href='" + filePath + "' target='_blank'>" + fileName + "</a><br />";
    });

    $("#drop-zone").html(output);
  }
});
```
