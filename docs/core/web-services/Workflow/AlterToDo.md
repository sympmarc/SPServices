---
title: 'AlterToDo'
function: '$().SPServices'
web_service: 'Workflow'
web_service_operation: 'AlterToDo'
---

## Example

Here's an example provided by [VisualBacon](http://www.codeplex.com/site/users/view/VisualBacon). Thanks!

```javascript
$().SPServices({
    operation: "GetToDosForItem",
    item: respItemURL,
    async: false,
    completefunc: function (xData, Status) {
     var respToDoID = '';
     var respToDoListID = '';

     $(xData.responseXML).SPFilterNode("z:row").each(function() {
      respToDoID = $(this).attr("ows_ID");
      respToDoListID = $(this).attr("ows_TaskListId");
     });

     $().SPServices({
      operation: "AlterToDo",
      async: false,
      todoId: respToDoID,
      todoListId: respToDoListID,
      item: respItemURL,
      taskData: '<my:myFields xmlns:my="http://schemas.microsoft.com/office/infopath/2003/myXSD" >' +
        '<my:Status>Completed</my:Status>' +
        '<my:PercentComplete>1.00000000000000</my:PercentComplete>' +
        '<my:WorkflowOutcome>Completed</my:WorkflowOutcome>' +
        '<my:FormData>Completed</my:FormData>' +
        '<my:Completed>1</my:Completed>' +
       '</my:myFields>',
      completefunc: function (xData, Status) {
       alert(Status);
      }
     });

    }
   });
```
