---
title: 'CopyIntoItemsLocal'
function: '$().SPServices'
web_service: 'Copy'
web_service_operation: 'CopyIntoItemsLocal'
---

## Example

Here is an example provided by [LeSanglier](http://www.codeplex.com/site/users/view/LeSanglier) from the Discussions thread [Move/copy item from/to document library](http://spservices.codeplex.com/Thread/View.aspx?ThreadId=79766).   

```html
<script language="javascript" type="text/javascript" src="/HRD/JQuery/jquery-1.3.2.min.js"></script>
<script language="javascript" type="text/javascript" src="/HRD/JQuery/spservices/jquery.SPServices-0.4.7.min.js"></script>

<script language="javascript" type="text/javascript" >

 function PreSaveAction() {
   $().SPServices({
    operation: "CopyIntoItemsLocal",
    async: false,
    SourceUrl: "http://philippe-ee2865/personal/administrator/Shared%20Documents/bradpitt_mini.jpg",
    DestinationUrls: ["http://philippe-ee2865/personal/administrator/Personal%20Documents/bradpitt.jpg"],
    completefunc: function(xData, Status) {
      alert("Status=" + Status + " XML=" + xData.responseXML.xml);     
      }
  });

  return true;

}
</script>
```
