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

An example from [dsMagic12](https://github.com/dsmagic12), showing how to find and execute a list workflow by the workflow's name:

```javascript
var listURLName = "Tasks";
var itemId = 1;
var workflowName = "Kickoff This Workflow", workflowGUID = "";
/* first call a web service to get all of the workflows that could be run on the item in our list */
jQuery().SPServices({
    async: true,
    debug: true,
    operation: "GetTemplatesForItem",
    item: jQuery().SPServices.SPGetCurrentSite() +"/Lists/"+ listURLName +"/"+ itemId +"_.000",
    completefunc: function(xDataGetTemplatesForItem, StatusGetTemplatesForItem) {
        try{console.log("Got all of the workflow templates for item |"+ itemId +"| in list |"+ listURLName +"|");}catch(er){}
        try{console.log(xDataGetTemplatesForItem);}catch(er){}
        try{console.log(StatusGetTemplatesForItem);}catch(er){}
        /* loop through the workflows associated with this list and item */
        jQuery(xDataGetTemplatesForItem.responseXML).find("WorkflowTemplates > WorkflowTemplate").each(function(i,e) {
            /* find our workflow by its name, then capture its GUID */
            if ( jQuery(this).attr("Name") === workflowName ) {
                try{console.log("Found the workflow template for this list item that matches our target workflow name");}catch(er){}
                workflowGUID = jQuery(this).find("WorkflowTemplateIdSet").attr("TemplateId");
                /* now start our workflow on our item */
                try{console.log("Sending web service request to start the workflow");}catch(er){}
                jQuery().SPServices({
                    async: true,
                    debug: true,
                    operation: "StartWorkflow",
                    item: jQuery().SPServices.SPGetCurrentSite() +"/Lists/"+ listURLName +"/"+ itemId +"_.000",
                    templateId: workflowGUID,
                    workflowParameters: "<root />",
                    completefunc: function(xDataStartWorkflow, StatusStartWorkflow) {
                        try{console.log("Started workflow on item |"+ itemId +"|");}catch(er){}
                        try{console.log(xDataStartWorkflow);}catch(er){}
                        try{console.log(StatusStartWorkflow);}catch(er){}
                    }
                });
            }
        });
    }
});
```
