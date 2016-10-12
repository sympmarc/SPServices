---
title: 'GetList'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'GetList'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This is an example from Matt Bramer ([iOnline247](http://www.codeplex.com/site/users/view/iOnline247)).

```javascript
$().SPServices({
  operation: "GetList",
  listName: "Master List",
  completefunc: function(xData, Status) {
    console.log(xData.responseText);
    $(xData.responseXML).find("Fields > Field").each(function() {
      var $node = $(this);
      console.log( "Type: " + $node.attr("Type") + " StaticName: " + $node.attr("StaticName") );
    });
  }
});
```
