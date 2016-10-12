---
title: 'GetListItems'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'GetListItems'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Tips  

See  [Steve Ottenad's post](http://labs.steveottenad.com/getting-ows_metainfo-with-spservices/) about getting the MetaInfo in a useful way. The trick is to add the following snippet to your call:

```javascript
CAMLViewFields: "<ViewFields Properties='True' />",
```

[fereko](http://www.codeplex.com/site/users/view/fereko) noted that there is a QueryOption which isn't detailed in the SDK and returns account name, email, and name instead of just the name:

```javascript
CAMLQueryOptions: "<QueryOptions><ExpandUserField>True</ExpandUserField></QueryOptions>"
```

## Example

This is an example from the [SharePoint and jQuery](http://www.endusersharepoint.com/STP/viewtopic.php?f=13&t=937&p=4337#p4337) forum at [Stump the Panel](http://www.endusersharepoint.com/STP) over at http://www.endusersharepoint.com.

In this example, we're grabbing all of the items in the Announcements list and displaying the Titles in a bulleted list in the tasksUL div.

If you have a better, real life example, please create an issue or an PR.

```javascript
<script type="text/javascript" src="filelink/jquery-1.6.1.min.js"></script>
<script type="text/javascript" src="filelink/jquery.SPServices-0.6.2.min.js"></script>
<script language="javascript" type="text/javascript">

$(document).ready(function() {
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Announcements",
    CAMLViewFields: "<ViewFields><FieldRef Name='Title' /></ViewFields>",
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        var liHtml = "<li>" + $(this).attr("ows_Title") + "</li>";
        $("#tasksUL").append(liHtml);
      });
    }
  });
});
</script>
<ul id="tasksUL"/>
```
