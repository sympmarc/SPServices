---
title: 'GetUserProfileByName'
function: '$().SPServices'
web_service: 'UserProfileService'
web_service_operation: 'GetUserProfileByName'
---

## Example

Here is a slightly adapted example of using GetUserProfileByName from [nileshc](http://www.codeplex.com/site/users/view/nileshc).

```javascript
function get_user_profile_by_login(login) {
  var user = {};
  var params = {
    operation: 'GetUserProfileByName',
    async: false,
    completefunc: function (xData, Status) {
      $(xData.responseXML).SPFilterNode("PropertyData").each(function() {
        user[$(this).find("Name").text()] = $(this).find("Value").text();
      }); // end each
      // Easy names
      user.login = user.AccountName;
      user.full_name = user.PreferredName;
      user.email = user.WorkEmail;
    } // end completefunc
  };
  if (login != null) {
    params.accountName = login;
  } else {
    params.accountName = $().SPServices.SPGetCurrentUser({
      fieldName: "Name"
    });
  }

  $().SPServices(params);
  return user;
}
```

This example gets the Manager value for a specific user account:

```javascript
$().SPServices({
  operation: "GetUserProfileByName",
  async: false,
  AccountName: "MBULOGIN\\will266",
  completefunc: function (xData, Status) {
    firstName = getUPValue(xData.responseXML, "FirstName");
    office = getUPValue(xData.responseXML, "Office");
   }
});

function getUPValue(x, p) {
  var thisValue = $(x).SPFilterNode("PropertyData").filter(function() {
    return $(this).find("Name").text() == p;
  }).find("Values").text();
  return thisValue;
}
```
