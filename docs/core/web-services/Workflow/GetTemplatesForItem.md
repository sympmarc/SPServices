---
title: 'GetTemplatesForItem'
function: '$().SPServices'
web_service: 'Workflow'
web_service_operation: 'GetTemplatesForItem'
---

## Example

Here's an example provided by [nrahlstr](http://www.codeplex.com/site/users/view/nrahlstr). Thanks, Nathan!

```javascript
var workflowGUID = null;
$().SPServices({
  operation: "GetTemplatesForItem",
  item: itemURL,
  async: false,
  completefunc: function (xData, Status) {
    $(xData.responseXML).find("WorkflowTemplates > WorkflowTemplate").each(function(i,e) {
      // hard coded workflow name
      if ( $(this).attr("Name") == "Workflow Name" ) {              
        var guid = $(this).find("WorkflowTemplateIdSet").attr("TemplateId");        
        if ( guid != null ) {
          workflowGUID = "{" + guid + "}";
          }
        }
      });
  }
});
```
