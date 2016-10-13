---
title: 'Workflow'
function: '$().SPServices'
web_service: 'Workflow'
---

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| [AlterToDo](Workflow/AlterToDo.md) | `item, todoId, todoListId, taskData` | [Workflow.AlterToDo Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.altertodo%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| [GetTemplatesForItem](Workflow/GetTemplatesForItem.md) | `item` | [Workflow.GetTemplatesForItem Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.gettemplatesforitem.aspx) | [0.3.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33030) |
| [GetToDosForItem](Workflow/GetToDosForItem.md) | `item` | [Workflow.GetToDosForItem Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.gettodosforitem.aspx) | [0.3.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33030) |
| GetWorkflowDataForItem | `item` | [Workflow.GetWorkflowDataForItem Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.getworkflowdataforitem.aspx) | [0.3.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33030) |
| GetWorkflowTaskData | `item, listId, taskId` | [Workflow.GetWorkflowTaskData Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.getworkflowtaskdata) | [0.3.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33030) |
| [StartWorkflow](Workflow/StartWorkflow.md) | `item, templateId, workflowParameters` | [Workflow.StartWorkflow Method](http://msdn.microsoft.com/en-us/library/workflow.workflow.startworkflow.aspx) | [0.3.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33030) |
