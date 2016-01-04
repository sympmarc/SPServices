### Function

**$().SPServices**

### Web Service

**Lists**

### Operation

**CheckInFile**

### Example

As an example, here is a call I made to CheckInFile in a real client project. It comes from a page where I was allowing the user to edit the metadata and check in files after a bulk upload.  

<div style="color: black; background-color: white;">

<pre><span style="color: green;">// Check in a single document, disable all of the column controls and give a visual cue that it is checked in</span>
 <span style="color: blue;">function</span> checkInDocument(obj, pageUrl) {
  <span style="color: blue;">var</span> success = <span style="color: blue;">true</span>;
  $().SPServices({
   operation: <span style="color: #a31515;">"CheckInFile"</span>,
   async: <span style="color: blue;">false</span>,
   pageUrl: pageUrl,
   comment: <span style="color: #a31515;">"Checked in during bulk upload"</span>,
   CheckinType: 1,
   completefunc: <span style="color: blue;">function</span> (xData, Status) {
    $(xData.responseXML).find(<span style="color: #a31515;">"errorstring"</span>).each(<span style="color: blue;">function</span>() {
     alert($(<span style="color: blue;">this</span>).text() + <span style="color: #a31515;">" Please save all of your changes before attempting to check in the document."</span>);
     success = <span style="color: blue;">false</span>;
    });
   }
  });
  <span style="color: green;">// If we couldn't check the document in, then don't disable the item's row</span>
  <span style="color: blue;">if</span>(!success) <span style="color: blue;">return</span> success;
  <span style="color: green;">// Disable the item and show it is checked in</span>
  $(obj).closest(<span style="color: #a31515;">"tr"</span>).each(<span style="color: blue;">function</span>() {
   <span style="color: green;">// Mark the item's row so that the user can see it is checked in</span>
   $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"style"</span>, <span style="color: #a31515;">"background-color:#bee1aa"</span>);
   <span style="color: green;">// Remove the Check In link</span>
   $(<span style="color: blue;">this</span>).find(<span style="color: #a31515;">"td:first"</span>).remove();
   $(<span style="color: blue;">this</span>).prepend(<span style="color: #a31515;">"<td class='actiondone'></td>"</span>);
   <span style="color: green;">// Disable the Name column</span>
   $(<span style="color: blue;">this</span>).find(<span style="color: #a31515;">"input:[Title='Name']"</span>).attr(<span style="color: #a31515;">"disabled"</span>, <span style="color: #a31515;">"disabled"</span>);
   <span style="color: green;">// Disable the RequestID column</span>
   $(<span style="color: blue;">this</span>).find(<span style="color: #a31515;">"input:[Title='RequestID']"</span>).each(<span style="color: blue;">function</span>() {
    $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"disabled"</span>, <span style="color: #a31515;">"disabled"</span>);
    $(<span style="color: blue;">this</span>).parent().find(<span style="color: #a31515;">"img"</span>).remove();
   });
   <span style="color: green;">// Disable the Artifact Type column</span>
   $(<span style="color: blue;">this</span>).find(<span style="color: #a31515;">"input:[Title='ArtifactType']"</span>).each(<span style="color: blue;">function</span>() {
    $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"disabled"</span>, <span style="color: #a31515;">"disabled"</span>);
    $(<span style="color: blue;">this</span>).parent().find(<span style="color: #a31515;">"img"</span>).remove();
   });
   <span style="color: green;">// Disable the AuditRequired column</span>
   $(<span style="color: blue;">this</span>).find(<span style="color: #a31515;">"[id^='AuditRequired'] input"</span>).each(<span style="color: blue;">function</span>() {
    $(<span style="color: blue;">this</span>).attr(<span style="color: #a31515;">"disabled"</span>, <span style="color: #a31515;">"disabled"</span>);
   });
  });
  <span style="color: blue;">return</span> success;
 }
</pre>

</div>