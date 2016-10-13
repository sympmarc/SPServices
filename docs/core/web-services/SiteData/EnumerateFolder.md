---
title: 'EnumerateFolder'
function: '$().SPServices'
web_service: 'SiteData'
web_service_operation: 'EnumerateFolder'
---

## Example

This is an example from [alexuni](http://www.codeplex.com/site/users/view/alexuni).

```javascript
$(function(){
  var currentSite = $().SPServices.SPGetCurrentSite();
  var txt="";
  $().SPServices({
    operation: "EnumerateFolder",
    async: false,
    strFolderUrl: currentSite,
    completefunc: function (xData, Status) {
      $(xData.responseXML).find("_sFPUrl").each(function(){
        txt += " Url: " + $("Url", this).text();
        txt += " IsFolder: " + $("IsFolder",this).text();
        txt += " LastModified: " + $("LastModified",this).text() + "";
      });
    }
  });
  txt += " ";
  $("#Result").html("").append(txt);
});
```
