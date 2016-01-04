## Web Service ### Lists #### Certification

[![Certified for SharePoint 2007](/docs/_images/sp2007-cert.jpg)](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) [![Works with Caveats with SharePoint 2010](/docs/_images/sp2010-works.jpg)](http://spservices.codeplex.com/wikipage?title=Glossary#Certification)
See individual operations below.

### Supported Operations

**Notes**

*   Many of the operations here accept a webURL option. This allows you to change the context for the Web Service operation to a different site. For instance, you may want to GetListItems from a list in another farm or UpdateListItems in a list in a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if you need the context to be a different site.
*   Links in the Operation column will show you more details for the operation, including examples, if available. Links in the MSDN Documentation column will take you to the SDK on MSDN for that operation.  

<table>

<tbody>

<tr>

<th>Operation</th>

<th>Options</th>

<th>MSDN Documentation</th>

<th>Introduced</th>

</tr>

<tr>

<td>AddAttachment</td>

<td><span class="codeInline">[webURL], listName, listItemID, fileName, attachment</span></td>

<td>[Lists.AddAttachment Method](http://msdn.microsoft.com/en-us/library/lists.lists.addattachment(v=office.12).aspx)</td>

<td>[0.5.5](http://spservices.codeplex.com/releases/view/43225)</td>

</tr>

<tr>

<td>AddDiscussionBoardItem</td>

<td><span class="codeInline">[webURL], listName, message</span></td>

<td>[Lists.AddDiscussionBoardItem Method](http://msdn.microsoft.com/en-us/library/lists.lists.adddiscussionboarditem(v=office.12).aspx)</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>AddList</td>

<td><span class="codeInline">[webURL], listName, description, templateID</span></td>

<td>[Lists.AddList Method](http://msdn.microsoft.com/en-us/library/lists.lists.addlist.aspx)</td>

<td>[0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341)</td>

</tr>

<tr>

<td>AddListFromFeature</td>

<td><span class="codeInline">[webURL], listName, description, featureID, templateID</span></td>

<td>[Lists.AddListFromFeature Method](http://msdn.microsoft.com/en-us/library/lists.lists.addlistfromfeature(v=office.12))</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>[CheckInFile](/wikipage?title=CheckInFile&referringTitle=Lists)</td>

<td><span class="codeInline">pageUrl, comment, CheckinType</span></td>

<td>[Lists.CheckInFile Method](http://msdn.microsoft.com/en-us/library/lists.lists.checkinfile.aspx)</td>

<td>[0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458)</td>

</tr>

<tr>

<td>ApplyContentTypeToList</td>

<td><span class="codeInline">webUrl, contentTypeId, listName</span></td>

<td>[Lists.ApplyContentTypeToList Method](http://msdn.microsoft.com/en-us/library/lists.lists.applycontenttypetolist(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>[CheckOutFile](/wikipage?title=CheckOutFile&referringTitle=Lists)</td>

<td><span class="codeInline">pageUrl, checkoutToLocal, lastmodified</span></td>

<td>[Lists.CheckOutFile Method](http://msdn.microsoft.com/en-us/library/lists.lists.checkoutfile.aspx)</td>

<td>[0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458)</td>

</tr>

<tr>

<td>CreateContentType</td>

<td><span class="codeInline">[webURL],</span> <span class="codeInline">listName, displayName, parentType, fields, ContentTypeProperties, addToView</span></td>

<td>[Lists.CreateContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.createcontenttype(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>DeleteAttachment</td>

<td><span class="codeInline">[webURL], listName, listItemID, url</span></td>

<td>[Lists.DeleteAttachment Method](http://msdn.microsoft.com/en-us/library/websvclists.lists.deleteattachment.aspx)</td>

<td>[0.7.0](http://spservices.codeplex.com/releases/view/68781)</td>

</tr>

<tr>

<td>DeleteContentType</td>

<td><span class="codeInline">[webURL],</span> <span class="codeInline">listName, contentTypeId</span></td>

<td>[Lists.DeleteContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttype(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>DeleteContentTypeXmlDocument</td>

<td><span class="codeInline">[webURL], listName, contentTypeId, documentUri</span></td>

<td>[Lists.DeleteContentTypeXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttypexmldocument(v=office.12).aspx)</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>DeleteList</td>

<td><span class="codeInline">[webURL], listName</span></td>

<td>[Lists.DeleteList Method](http://msdn.microsoft.com/en-us/library/lists.lists.deletelist.aspx)</td>

<td>[0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341)</td>

</tr>

<tr>

<td>[GetAttachmentCollection](/wikipage?title=GetAttachmentCollection)</td>

<td><span class="codeInline">[webURL], listName, ID</span></td>

<td>[Lists.GetAttachmentCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getattachmentcollection.aspx)</td>

<td>[0.2.6](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31946)</td>

</tr>

<tr>

<td>[GetList](/wikipage?title=GetList)</td>

<td><span class="codeInline">[webURL], listName</span></td>

<td>[Lists.GetList Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlist.aspx)</td>

<td>[0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744)</td>

</tr>

<tr>

<td>GetListAndView</td>

<td><span class="codeInline">[webURL], listName, viewName</span></td>

<td>[Lists.GetListAndView Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistandview.aspx)</td>

<td>[0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341)</td>

</tr>

<tr>

<td>GetListCollection</td>

<td><span class="codeInline">[webURL]</span></td>

<td>[Lists.GetListCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcollection.aspx)</td>

<td>[0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744)</td>

</tr>

<tr>

<td>GetListContentType</td>

<td><span class="codeInline">[webURL], listName, contentTypeId</span></td>

<td>[Lists.GetListContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttype.aspx)</td>

<td>[0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505)</td>

</tr>

<tr>

<td>[GetListContentTypes](/wikipage?title=GetListContentTypes&referringTitle=Lists)</td>

<td><span class="codeInline">[webURL], listName</span>*</td>

<td>[Lists.GetListContentTypes Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttypes.aspx)</td>

<td>[0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505)</td>

</tr>

<tr>

<td>GetListItemChanges</td>

<td><span class="codeInline">[webURL],</span> <span class="codeInline">listName, viewFields, since, contains</span></td>

<td>[Lists.GetListItemChanges Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchanges(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>GetListItemChangesSinceToken</td>

<td><span class="codeInline">[webURL], listName, viewName, CAMLQuery, <span class="codeInline">CAMLViewFields,</span> CAMLRowLimit, CAMLQueryOptions<span class="codeInline">, changeToken, contains</span></span></td>

<td>[Lists.GetListItemChangesSinceToken Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken(v=office.12).aspx)</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>[GetListItems](/wikipage?title=GetListItems&referringTitle=Lists)</td>

<td><span class="codeInline">[webURL], listName, viewName, CAMLViewFields, CAMLQuery, CAMLRowLimit, CAMLQueryOptions</span></td>

<td>[Lists.GetListItems Method](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx)</td>

<td>[0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744)</td>

</tr>

<tr>

<td>GetVersionCollection</td>

<td><span class="codeInline">strlistID, strlistItemID, strFieldName</span></td>

<td>[Lists.GetVersionCollection Method](http://msdn.microsoft.com/en-us/library/lists.lists.getversioncollection(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>UndoCheckOut</td>

<td><span class="codeInline">pageUrl</span></td>

<td>[Lists.UndoCheckOut Method](http://msdn.microsoft.com/en-us/library/lists.lists.undocheckout(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>UpdateContentType</td>

<td><span class="codeInline">[webURL],</span> <span class="codeInline">listName, contentTypeId, contentTypeProperties, newFields, updateFields, deleteFields, addToView</span></td>

<td>[Lists.UpdateContentType Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttype(v=office.12).aspx)</td>

<td>[0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1")</td>

</tr>

<tr>

<td>UpdateContentTypesXmlDocument</td>

<td><span class="codeInline">[webURL], listName, newDocument</span></td>

<td>[Lists.UpdateContentTypesXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypesxmldocument(v=office.12).aspx)</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>UpdateContentTypeXmlDocument</td>

<td><span class="codeInline">[webURL], listName, contentTypeId<span class="codeInline">, newDocument</span></span></td>

<td>[Lists.UpdateContentTypeXmlDocument Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypexmldocument(v=office.12).aspx)</td>

<td>[0.7.2](http://spservices.codeplex.com/releases/view/81401)</td>

</tr>

<tr>

<td>[UpdateList](/wikipage?title=UpdateList&referringTitle=Lists)</td>

<td><span class="codeInline">[webURL],</span> <span class="codeInline">listName, listProperties, newFields, updateFields, deleteFields, listVersion</span></td>

<td>[Lists.UpdateList Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatelist.aspx)</td>

<td>[0.4.6](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35830)</td>

</tr>

<tr>

<td>[UpdateListItems](/wikipage?title=UpdateListItems&referringTitle=Lists)</td>

<td><span class="codeInline">[webURL], listName, updates, [batchCmd, valuepairs, ID]</span></td>

<td>[Lists.UpdateListItems Method](http://msdn.microsoft.com/en-us/library/lists.lists.updatelistitems.aspx)</td>

<td>[0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744)</td>

</tr>

</tbody>

</table>

<span class="codeInline">*</span> Note that the SDK says that <span class="codeInline">contentTypeId</span> is a required parameter for <span class="codeInline">GetListContentTypes</span>. It is not, and in fact it is ignored if present.  
** Attested by Mark Rackley.