---
title: 'GetGroupCollectionFromUser'
function: '$().SPServices'
web_service: 'UserGroup (Users and Groups)'
web_service_operation: 'GetGroupCollectionFromUser'
---

## Example

Here's an example from greginchicago on [EndUserSharePoint's Stump the Panel](http://www.endusersharepoint.com/STP/viewtopic.php?f=7&t=983&start=0). We worked through it together and it's a nice use of GetGroupCollectionFromUser to disable the 'Change Password' option for users belonging to a given Permission group in the 'Welcome' drop down located on the top right corner of the default SharePoint page.

Here's the code:

```javascript
<script type="text/javascript" src="/SRC/SRCjQuery/jquery-1.4.2.min.js"></script>
<script language="javascript" type="text/javascript" src="/SRC/SRCjQuery/jquery.SPServices-0.5.4.min.js"></script>
<script type="text/javascript">
/* place code right before the matching closing tag </asp:Content> for <asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">*/
  $(document).ready(function() {
    $().SPServices({
      operation: "GetGroupCollectionFromUser",
      userLoginName: $().SPServices.SPGetCurrentUser(),
      async: false,
      completefunc: function(xData, Status) {
        if($(xData.responseXML).find("Group[Name='GroupName']").length == 1) {
          $("#zz9_ID_PersonalizePage").remove();
          /*   zz5_ID_LoginAsDifferentUser
               zz6_ID_RequestAccess
               zz7_ID_Logout
               zz8_MSOMenu_ChangePassword
               zz9_ID_PersonalizePage   */
        }
      }
   }); /*close().SPServices({ */
}); /* close (document).ready(function() { */
</script>
```
