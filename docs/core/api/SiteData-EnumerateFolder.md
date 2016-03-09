### Function

**$().SPServices**  

### Web Service

**SiteData**  

### Operation

**EnumerateFolder**  

### Example

This is an [example](http://spservices.codeplex.com/discussions/218037) from the Discussions.
``` javascript
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