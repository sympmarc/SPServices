---
title: 'GetListContentTypes'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'GetListContentTypes'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This is an example from [jenglish](http://www.codeplex.com/site/users/view/jenglish). I wrote a [blog post](http://mdasblog.wordpress.com/2011/02/11/using-spservices-to-get-the-display-names-for-a-sharepoint-lists-content-types/) about this example as well.  

If you have a better, real life example, please create an issue or an PR.

```javascript
var queryStringVals = $().SPServices.SPGetQueryString(); // The SPGetQueryString function parses the Query String values out into an array
var contentTypeIdValue = queryStringVals["ContentTypeId"]; // This grabs the value of the ContentTypeId Query String parameter
var contentTypeName = ""; // Define a variable to hold the name of the Content Type

// Get the list's Content Types
$().SPServices({
  operation: "GetListContentTypes", // See the MSDN SDK at http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttypes.aspx for details on this operation
  listName: $().SPServices.SPListNameFromUrl(), // The SPListNameFromUrl function gets the list name for the current context based on the URL
  async: false, // We'll do this asynchronously
  completefunc: function (xData, Status) {
    $(xData.responseXML).find("ContentType").each(function() { // All of the list's Content Types will be returned. We'll loop through to get the one we are interested in
      if($(this).attr("ID") == contentTypeIdValue) { // If the contentTypeId matches...
        contentTypeName = $(this).attr("Name"); // ...store the name in our variable...
        return false; // ...and return false, which breaks us out of the loop. (We've found what we need, so no reason to continue looking.)
      }
    });
  }
});
//... do something with the Content Type Name ...
```
