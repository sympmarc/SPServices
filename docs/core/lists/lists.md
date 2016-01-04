<h3>Web Service</h3>
<p><strong>Lists</strong></p>
<h3>Certification</h3>
<p><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Certified for SharePoint 2007" src="http://www.sympraxisconsulting.com/SPServices/sp2007-cert.jpg" alt="Certified for SharePoint 2007" /></a> <a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Works with Caveats with SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sp2010-works.jpg" alt="Works with Caveats with SharePoint 2010" /></a> See individual operations below.</p>
<h3>Supported Operations</h3>
<p><strong>Notes</strong></p>
<ul>
<li>Many of the operations here accept a webURL option. This allows you to change the context for the Web Service operation to a different site. For instance, you may want to GetListItems from a list in another farm or UpdateListItems in a list in a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if you need the context to be a different site.</li>
<li>Links in the Operation column will show you more details for the operation, including examples, if available. Links in the MSDN Documentation column will take you to the SDK on MSDN for that operation. <br /> </li>
</ul>
<table width="1301">
<tbody>
<tr><th>Operation</th><th>Options</th><th>MSDN Documentation</th><th>Introduced</th></tr>
<tr>
<td>AddAttachment</td>
<td><span class="codeInline">[webURL], listName, listItemID, fileName, attachment</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.addattachment(v=office.12).aspx">Lists.AddAttachment Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/43225">0.5.5</a></td>
</tr>
<tr>
<td>AddDiscussionBoardItem</td>
<td><span class="codeInline">[webURL], listName, message</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.adddiscussionboarditem(v=office.12).aspx">Lists.AddDiscussionBoardItem Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td>AddList</td>
<td><span class="codeInline">[webURL], listName, description, templateID</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.addlist.aspx">Lists.AddList Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341">0.2.9</a></td>
</tr>
<tr>
<td>AddListFromFeature</td>
<td><span class="codeInline">[webURL], listName, description, featureID, templateID</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.addlistfromfeature(v=office.12)">Lists.AddListFromFeature Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=CheckInFile&amp;referringTitle=Lists">CheckInFile</a></td>
<td><span class="codeInline">pageUrl, comment, CheckinType</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.checkinfile.aspx">Lists.CheckInFile Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
</tr>
<tr>
<td>ApplyContentTypeToList</td>
<td><span class="codeInline">webUrl, contentTypeId, listName</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.applycontenttypetolist(v=office.12).aspx" target="_blank">Lists.ApplyContentTypeToList Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=CheckOutFile&amp;referringTitle=Lists">CheckOutFile</a></td>
<td><span class="codeInline">pageUrl, checkoutToLocal, lastmodified</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.checkoutfile.aspx">Lists.CheckOutFile Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
</tr>
<tr>
<td>CreateContentType</td>
<td><span class="codeInline">[webURL], </span><span class="codeInline">listName, displayName, parentType, fields, ContentTypeProperties, addToView</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.createcontenttype(v=office.12).aspx" target="_blank">Lists.CreateContentType Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>DeleteAttachment</td>
<td><span class="codeInline">[webURL], listName, listItemID, url</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/websvclists.lists.deleteattachment.aspx">Lists.DeleteAttachment Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/68781">0.7.0</a></td>
</tr>
<tr>
<td>DeleteContentType</td>
<td><span class="codeInline">[webURL], </span><span class="codeInline">listName, contentTypeId</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttype(v=office.12).aspx" target="_blank">Lists.DeleteContentType Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>DeleteContentTypeXmlDocument</td>
<td><span class="codeInline">[webURL], listName, contentTypeId, documentUri</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.deletecontenttypexmldocument(v=office.12).aspx">Lists.DeleteContentTypeXmlDocument Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td>DeleteList</td>
<td><span class="codeInline">[webURL], listName</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.deletelist.aspx">Lists.DeleteList Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341">0.2.9</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=GetAttachmentCollection">GetAttachmentCollection</a></td>
<td><span class="codeInline">[webURL], listName, ID</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getattachmentcollection.aspx">Lists.GetAttachmentCollection Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31946">0.2.6</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=GetList">GetList</a></td>
<td><span class="codeInline">[webURL], listName</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlist.aspx">Lists.GetList Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744">0.2.3</a></td>
</tr>
<tr>
<td>GetListAndView</td>
<td><span class="codeInline">[webURL], listName, viewName</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistandview.aspx">Lists.GetListAndView Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341">0.2.9</a></td>
</tr>
<tr>
<td>GetListCollection</td>
<td><span class="codeInline">[webURL]</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistcollection.aspx">Lists.GetListCollection Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744">0.2.3</a></td>
</tr>
<tr>
<td>GetListContentType</td>
<td><span class="codeInline">[webURL], listName, contentTypeId</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttype.aspx">Lists.GetListContentType Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505">0.4.8</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=GetListContentTypes&amp;referringTitle=Lists">GetListContentTypes</a></td>
<td><span class="codeInline">[webURL], listName</span>*</td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistcontenttypes.aspx">Lists.GetListContentTypes Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505">0.4.8</a></td>
</tr>
<tr>
<td>GetListItemChanges</td>
<td><span class="codeInline">[webURL], </span><span class="codeInline">listName, viewFields, since, contains</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchanges(v=office.12).aspx" target="_blank">Lists.GetListItemChanges Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>GetListItemChangesSinceToken</td>
<td><span class="codeInline">[webURL], listName, viewName, CAMLQuery, <span class="codeInline"> CAMLViewFields, </span>CAMLRowLimit, CAMLQueryOptions<span class="codeInline">, changeToken, contains</span> </span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken(v=office.12).aspx">Lists.GetListItemChangesSinceToken Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=GetListItems&amp;referringTitle=Lists">GetListItems</a></td>
<td><span class="codeInline">[webURL], listName, viewName, CAMLViewFields, CAMLQuery, CAMLRowLimit, CAMLQueryOptions</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems.aspx">Lists.GetListItems Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744">0.2.3</a></td>
</tr>
<tr>
<td>GetVersionCollection</td>
<td><span class="codeInline">strlistID, strlistItemID, strFieldName</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.getversioncollection(v=office.12).aspx" target="_blank">Lists.GetVersionCollection Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>UndoCheckOut</td>
<td><span class="codeInline">pageUrl</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.undocheckout(v=office.12).aspx" target="_blank">Lists.UndoCheckOut Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>UpdateContentType</td>
<td><span class="codeInline">[webURL], </span><span class="codeInline">listName, contentTypeId, contentTypeProperties, newFields, updateFields, deleteFields, addToView</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttype(v=office.12).aspx" target="_blank">Lists.UpdateContentType Method</a></td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
</tr>
<tr>
<td>UpdateContentTypesXmlDocument</td>
<td><span class="codeInline">[webURL], listName, newDocument</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypesxmldocument(v=office.12).aspx">Lists.UpdateContentTypesXmlDocument Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td>UpdateContentTypeXmlDocument</td>
<td><span class="codeInline">[webURL], listName, contentTypeId<span class="codeInline">, newDocument</span> </span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.updatecontenttypexmldocument(v=office.12).aspx">Lists.UpdateContentTypeXmlDocument Method</a></td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=UpdateList&amp;referringTitle=Lists">UpdateList</a></td>
<td><span class="codeInline">[webURL], </span><span class="codeInline">listName, listProperties, newFields, updateFields, deleteFields, listVersion</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.updatelist.aspx">Lists.UpdateList Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35830">0.4.6</a></td>
</tr>
<tr>
<td><a href="/wikipage?title=UpdateListItems&amp;referringTitle=Lists">UpdateListItems</a></td>
<td><span class="codeInline">[webURL], listName, updates, [batchCmd, valuepairs, ID]</span></td>
<td><a href="http://msdn.microsoft.com/en-us/library/lists.lists.updatelistitems.aspx">Lists.UpdateListItems Method</a></td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744">0.2.3</a></td>
</tr>
</tbody>
</table>
<p><span class="codeInline">* </span>Note that the SDK says that <span class="codeInline"> contentTypeId</span> is a required parameter for <span class="codeInline">GetListContentTypes</span>. It is not, and in fact it is ignored if present. <br /> ** Attested by Mark Rackley.</p>