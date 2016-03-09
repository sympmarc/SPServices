### Function

**$().SPServices**

### Web Service

**Users and Groups**

### Operation

**GetRolesAndPermissionsForCurrentUser**

### Example

Check out the great example provided by [Jim Bob Howard](http://www.codeplex.com/site/users/view/jbhoward) entitled [Displaying/Hiding Content based on User Permissions or "When Edit permissions don't work..."](http://spservices.codeplex.com/Thread/View.aspx?ThreadId=80847).  

Here's the code from that write up:
``` javascript
$(document).ready(function() {

   $().SPServices({
     operation: "GetRolesAndPermissionsForCurrentUser",
     async: false,
     completefunc: function(xData, Status) {
//        alert(xData.responseXML.xml);
        var userPerm = $(xData.responseXML).find("Permissions").attr("Value");
//        alert("userPerm = " + userPerm);
        var nonAdminP = (33554432 & userPerm) == 33554432;
//        alert("nonAdminP == 33554432: " + nonAdminP);
        var adminP = userPerm == 9223372036854775807;
//        alert(adminP);
        var hideEdit = !(nonAdminP | adminP);
//        alert("hideEdit = " + hideEdit);

        
        if (hideEdit) {
		   //alert("Hide");
		   $("a[title='Edit Item']").parent().parent().parent().hide();
		   $("td.ms-separator:nth-child(2)").hide();
        }
     }
   });
   
});
```