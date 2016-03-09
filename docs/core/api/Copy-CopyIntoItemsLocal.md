### Function

**$().SPServices**

### Web Service

**Copy**

### Operation

**CopyIntoItemsLocal**

### Example

Here is an example provided by [LeSanglier](http://www.codeplex.com/site/users/view/LeSanglier) from the Discussions thread [Move/copy item from/to document library](http://spservices.codeplex.com/Thread/View.aspx?ThreadId=79766).  
``` javascript 
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
```