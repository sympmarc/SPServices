---
title: 'GetRolesAndPermissionsForCurrentUser'
function: '$().SPServices'
web_service: 'UserGroup (Users and Groups)'
web_service_operation: 'GetRolesAndPermissionsForCurrentUser'
---

## Example

Check out the great example provided by [Jim Bob Howard](http://www.codeplex.com/site/users/view/jbhoward):

```javascript
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js" type="text/javascript"></script>
<script src="/js/jquery.SPServices-0.5.1.min.js" type="text/javascript"></script>
<script type="text/javascript">
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
</script>
```
