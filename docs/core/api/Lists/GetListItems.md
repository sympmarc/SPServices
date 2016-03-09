### Function

**$().SPServices**  

### Web Service

**Lists**  

### Operation

**GetListItems**  

### Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

### Tips

See [Steve Ottenad's post](http://labs.steveottenad.com/getting-ows_metainfo-with-spservices/) about getting the MetaInfo in a useful way. The trick is to add
``` javascript
CAMLViewFields: "<ViewFields Properties='True' />",
```
to your call.

[fereko](http://www.codeplex.com/site/users/view/fereko) [noted](http://spservices.codeplex.com/discussions/262196#post807007) that there is a QueryOption which isn't detailed in the SDK:
``` javascript
CAMLQueryOptions: "<QueryOptions><ExpandUserField>True</ExpandUserField></QueryOptions>"
```
returns account name, email, and name instead of just the name.

### Example

This is an example from the [SharePoint and jQuery ](http://www.endusersharepoint.com/STP/viewtopic.php?f=13&t=937&p=4337#p4337) forum at [Stump the Panel](http://www.endusersharepoint.com/STP) over at [http://www.endusersharepoint.com](http://EndUserSharePoint.com).  

In this example, we're grabbing all of the items in the Announcements list and displaying the Titles in a bulleted list in the tasksUL div.  

If you have a better, real life example, please post it in the [Discussions](http://spservices.codeplex.com/Thread/List.aspx).  
``` javascript
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
```