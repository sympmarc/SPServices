---
title: 'Views'
function: '$().SPServices'
web_service: 'Views'
---

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| [AddView](Views/AddView.md) | `[webURL], listName, viewName, viewFields, query, rowLimit, type, makeViewDefault` | [Views.AddView Method](http://msdn.microsoft.com/en-us/library/views.views.addview%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| DeleteView | `[webURL], listName, viewName` | [Views.DeleteView Method](http://msdn.microsoft.com/en-us/library/views.views.deleteview%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetView | `[webURL], listName, viewName` | [Views.GetView Method](http://msdn.microsoft.com/en-us/library/views.views.getview%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetViewCollection | `[webURL], listName` | [Views.GetViewCollection Method](http://msdn.microsoft.com/en-us/library/views.views.getviewcollection.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| GetViewHtml | `[webURL], listName, viewName` | [Views.GetViewHtml Method](http://msdn.microsoft.com/en-us/library/views.views.getviewhtml%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| [UpdateView](Views/UpdateView.md) | `[webURL], listName, viewName, viewProperties, query, viewFields, aggregations, formats, rowLimit` | [Views.UpdateView Method](http://msdn.microsoft.com/en-us/library/views.views.updateview%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| UpdateViewHtml | `[webURL], listName, viewName, viewProperties, toolbar, viewHeader, viewBody, viewFooter, viewEmpty, rowLimitExceeded, query, viewFields, aggregations, formats, rowLimit` | [Views.UpdateViewHtml Method](http://msdn.microsoft.com/en-us/library/views.views.updateviewhtml%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
