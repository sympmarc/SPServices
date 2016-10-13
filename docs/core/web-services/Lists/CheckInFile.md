---
title: 'CheckInFile'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'CheckInFile'
---

## Example

As an example, here is a call I made to CheckInFile in a real client project. It comes from a page where I was allowing the user to edit the metadata and check in files after a bulk upload.  

```javascript
// Check in a single document, disable all of the column controls and give a visual cue that it is checked in
 function checkInDocument(obj, pageUrl) {
  var success = true;
  $().SPServices({
   operation: "CheckInFile",
   async: false,
   pageUrl: pageUrl,
   comment: "Checked in during bulk upload",
   CheckinType: 1,
   completefunc: function (xData, Status) {
    $(xData.responseXML).find("errorstring").each(function() {
     alert($(this).text() + " Please save all of your changes before attempting to check in the document.");
     success = false;
    });
   }
  });
  // If we couldn't check the document in, then don't disable the item's row
  if(!success) return success;
  // Disable the item and show it is checked in
  $(obj).closest("tr").each(function() {
   // Mark the item's row so that the user can see it is checked in
   $(this).attr("style", "background-color:#bee1aa");
   // Remove the Check In link
   $(this).find("td:first").remove();
   $(this).prepend("<td class='actiondone'></td>");
   // Disable the Name column
   $(this).find("input:[Title='Name']").attr("disabled", "disabled");
   // Disable the RequestID column
   $(this).find("input:[Title='RequestID']").each(function() {
    $(this).attr("disabled", "disabled");
    $(this).parent().find("img").remove();
   });
   // Disable the Artifact Type column
   $(this).find("input:[Title='ArtifactType']").each(function() {
    $(this).attr("disabled", "disabled");
    $(this).parent().find("img").remove();
   });
   // Disable the AuditRequired column
   $(this).find("[id^='AuditRequired'] input").each(function() {
    $(this).attr("disabled", "disabled");
   });
  });
  return success;
 }
```
