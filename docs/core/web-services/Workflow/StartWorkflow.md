---
title: 'StartWorkflow'
function: '$().SPServices'
web_service: 'Workflow'
web_service_operation: 'StartWorkflow'
---

## Example

This example comes from a [great article](https://www.nothingbutsharepoint.com/sites/eusp/Pages/4-clicks-or-1-using-jquery-to-start-a-sharepoint-workflow.aspx) over at [NothingButSharePoint.com](https://www.nothingbutsharepoint.com/) by Jason MacKenzie ([Intelligence Among Us](http://www.intelligenceamong.us/)). In it, Jason shows how you can use a call to StartWorkflow to improve the user experience with, you guessed it, starting a workflow. I'm only going to include the SPServices snippet from the article; read the whole article to see it in context.

Note the trick with the `workflowParameters` option, where Jason passes an XML node.

```javascript
<script type="text/javascript" src="/sites/sprc/Resources%20%20jQuery/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="/sites/sprc/Resources%20%20jQuery/jQuery%20SP%20Services/jquery.SPServices-0.5.4.min.js"></script>
<script type="text/javascript">

function StartWorkflow(ItemURL, ItemID) {
  var loadingImage = ‘Loader’ + ItemID;
  var workflowDiv = ‘WorkflowDiv’ + ItemID;
  //Show our loading image
  document.getElementById(loadingImage).style.visibility = ‘visible’;
  $().SPServices({
    operation: "StartWorkflow",
    item: ItemURL,
    templateId: "{04ee1c93-f6b7-49b3-a79c-fa3142ecd688}",
    workflowParameters: "<root />",
    completefunc: function() {
      document.getElementById(workflowDiv).innerHTML = ‘Workflow Started’;
    }
  });
}
</script>
```

Here's another example from [Rkbradford](http://www.codeplex.com/site/users/view/Rkbradford) which shows how you can pass workflow parameter values:

```javascript
$().SPServices({
  debug:true,
  operation: "StartWorkflow",
  async: true,
  item: "https://server/site/Lists/item" + idData + "_.000",
  templateId: "{c29c1291-a25c-47d7-9345-8fb1de2a1fa3}",
  workflowParameters: "<Data><monthName>" + txtBox.value + "</monthName></Data>",
  ...
});
```

[alan_usa](http://www.codeplex.com/site/users/view/alan_usa) provided a tip that, when passing more than one parameter, the syntax should be:

```javascript
workflowParameters: "<Data><Parameter1>" + parameter1 + "</Parameter1><Parameter2>" + parameter2 + "</Parameter2></Data>"
```


Here's a complete example from [dsMagic12](https://github.com/dsmagic12) which shows to start a workflow given a know list item ID number, the title of the list the item is in, and the GUID of the workflow you wish to execute (assumes you do not need to pass any  parameter values):

```javascript
var listURLName = "Tasks";
var itemId = 1;
var workflowGuid = "{01116f76-e2c2-4a1a-b099-9b82680c14e8}";
jQuery().SPServices({
    async: true,
    debug: true,
    operation: "StartWorkflow",
    item: jQuery().SPServices.SPGetCurrentSite() +"/Lists/"+ listURLName +"/"+ itemId +"_.000",
    templateId: workflowGuid,
    workflowParameters: "<root />",
    completefunc: function(xDataStartWorkflow, StatusStartWorkflow) {
        try{console.log("Started workflow on item |"+ itemId +"|");}catch(er){}
        try{console.log(xDataStartWorkflow);}catch(er){}
        try{console.log(StatusStartWorkflow);}catch(er){}
    }
});
```

