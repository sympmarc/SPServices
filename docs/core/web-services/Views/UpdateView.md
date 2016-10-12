---
title: 'UpdateView'
function: '$().SPServices'
web_service: 'Views'
web_service_operation: 'UpdateView'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Example

This example comes from [DesOwen](http://www.codeplex.com/site/users/view/DesOwen). Thanks, Des!

Usage:

UpdateView("http://sharepoint/sites/mysite", "project contacts","All Items")

The function below looks for the GUID based name of the list view with a title "All Items" and uses that GUID to update the view with a list of the columns we would like to use.

```javascript
function UpdateView(url,list,view)
{
    var viewname = "";
    $().SPServices({
        operation: "GetViewCollection",
        webURL: url,
        async: false,
        listName: list,
        completefunc: function (xData, Status)
        {
            $(xData.responseXML).find("[nodeName='View']").each(function()
            {
                 var viewdisplayname = $(this).attr("DisplayName");
                 if (viewdisplayname==view)
                 {
                       viewname = $(this).attr("Name");
                       return false;
                 }
        });
    }
    });


  var viewfields = "<ViewFields><FieldRef Name=\"Contacts_x0020_Full_x0020_Name\" /><FieldRef Name=\"Associated_x0020_With\" /><FieldRef Name=\"Contacts_x0020_Job_x0020_Title\" /><FieldRef Name=\"Email_x0020_Address\" /><FieldRef Name=\"Mobile_x0020_Telephone\" /><FieldRef Name=\"Business_x0020_Telephone\" /></ViewFields>";
  $().SPServices({
        operation: "UpdateView",
        webURL: url,
        async: false,
        listName: list,
        viewName: viewname,
        viewFields: viewfields,
        completefunc: function (xData, Status)
        {
        }

    });

}
```
