---
title: 'Lists'
certification:
  sp2007: 'certified'
  sp2010: 'works'
certification_notes: 'See individual operations below.'
function: '$().SPServices'
web_service: 'Lists'
---

## Supported Operations

**Notes:**

*   Many of the operations here accept a webURL option. This allows you to change the context for the Web Service operation to a different site. For instance, you may want to GetListItems from a list in another farm or UpdateListItems in a list in a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if you need the context to be a different site.
*   Links in the Operation column will show you more details for the operation, including examples, if available. Links in the MSDN Documentation column will take you to the SDK on MSDN for that operation.

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| AddAttachment | `[webURL], listName, listItemID, fileName, attachment` | [Lists.AddAttachment Method](http://msdn.microsoft.com/en-us/library/lists.lists.addattachment%28v=office.12%29.aspx) | [0.5.5](http://spservices.codeplex.com/releases/view/43225) |
| AddDiscussionBoardItem | `[webURL], listName, message` | [Lists.AddDiscussionBoardItem Method](http://msdn.microsoft.com/en-us/library/lists.lists.adddiscussionboarditem%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| AddList | `[webURL], listName, description, templateID` | [Lists.AddList Method](http://msdn.microsoft.com/en-us/library/lists.lists.addlist.aspx) | [0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341) |
| AddListFromFeature | `[webURL], listName, description, featureID, templateID` | [Lists.AddListFromFeature Method](http://msdn.microsoft.com/en-us/library/lists.lists.addlistfromfeature%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| [CheckInFile](Lists/CheckInFile.md) | `pageUrl, comment, CheckinType` | [Lists.CheckInFile Method](http://msdn.microsoft.com/en-us/library/lists.lists.checkinfile.aspx) | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) |
| ApplyContentTypeToList | `webUrl, contentTypeId, listName` | [Lists.ApplyContentTypeToList Method](http://msdn.microsoft.com/en-us/library/lists.lists.applycontenttypetolist%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| [CheckOutFile](Lists/CheckOutFile.md) | `pageUrl, checkoutToLocal, lastmodified` | [Lists.CheckOutFile Method](http://msdn.microsoft.com/en-us/library/lists.lists.checkoutfile.aspx) | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) |
| CreateContentType | `[webURL],` `listName, displayName, parentType, fields, ContentTypeProperties, addToView` | [Lists.CreateContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.createcontenttype%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| DeleteAttachment | `[webURL], listName, listItemID, url` | [Lists.DeleteAttachment Method](http://msdn.microsoft.com/en-us/library/websvclists.lists.deleteattachment.aspx) | [0.7.0](http://spservices.codeplex.com/releases/view/68781) |
| DeleteContentType | `[webURL],` `listName, contentTypeId` | [Lists.DeleteContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttype%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| DeleteContentTypeXmlDocument | `[webURL], listName, contentTypeId, documentUri` | [Lists.DeleteContentTypeXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttypexmldocument%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| DeleteList | `[webURL], listName` | [Lists.DeleteList Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletelist.aspx) | [0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341) |
| [GetAttachmentCollection](Lists/GetAttachmentCollection.md) | `[webURL], listName, ID` | [Lists.GetAttachmentCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getattachmentcollection.aspx) | [0.2.6](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31946) |
| [GetList](Lists/GetList.md) | `[webURL], listName` | [Lists.GetList Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlist.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| GetListAndView | `[webURL], listName, viewName` | [Lists.GetListAndView Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistandview.aspx) | [0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341) |
| GetListCollection | `[webURL]` | [Lists.GetListCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcollection.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| GetListContentType | `[webURL], listName, contentTypeId` | [Lists.GetListContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttype.aspx) | [0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505) |
| [GetListContentTypes](Lists/GetListContentTypes.md) | `[webURL], listName`* | [Lists.GetListContentTypes Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttypes.aspx) | [0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505) |
| GetListItemChanges | `[webURL],` `listName, viewFields, since, contains` | [Lists.GetListItemChanges Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchanges%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| GetListItemChangesSinceToken | `[webURL], listName, viewName, CAMLQuery, CAMLViewFields, CAMLRowLimit, CAMLQueryOptions, changeToken, contains` | [Lists.GetListItemChangesSinceToken Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| [GetListItems](Lists/GetListItems.md) | `[webURL], listName, viewName, CAMLViewFields, CAMLQuery, CAMLRowLimit, CAMLQueryOptions` | [Lists.GetListItems Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| GetVersionCollection | `strlistID, strlistItemID, strFieldName` | [Lists.GetVersionCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getversioncollection%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| UndoCheckOut | `pageUrl` | [Lists.UndoCheckOut Method](http://msdn.microsoft.com/en-us/library/lists.lists.undocheckout%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| UpdateContentType | `[webURL], listName, contentTypeId, contentTypeProperties, newFields, updateFields, deleteFields, addToView` | [Lists.UpdateContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttype%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| UpdateContentTypesXmlDocument | `[webURL], listName, newDocument` | [Lists.UpdateContentTypesXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypesxmldocument%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| UpdateContentTypeXmlDocument | `[webURL], listName, contentTypeId, newDocument` | [Lists.UpdateContentTypeXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypexmldocument%28v=office.12%29.aspx) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| [UpdateList](Lists/UpdateList.md) | `[webURL], listName, listProperties, newFields, updateFields, deleteFields, listVersion` | [Lists.UpdateList Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatelist.aspx) | [0.4.6](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35830) |
| [UpdateListItems](Lists/UpdateListItems.md) | `[webURL], listName, updates, [batchCmd, valuepairs, ID]` | [Lists.UpdateListItems Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatelistitems.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |

\* Note that the SDK says that `contentTypeId` is a required parameter for `GetListContentTypes`. It is not, and in fact it is ignored if present. ** Attested by Mark Rackley.
