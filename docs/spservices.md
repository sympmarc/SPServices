<p><strong><span style="color: #ff0000;">Please read the documentation (starting with the <span style="color: #000080;"><a href="http://spservices.codeplex.com/documentation#general-instructions">General Instructions</a></span> at the bottom of this page) before asking questions. I'm happy to help out, but it's so much nicer when folks read the documentation.</span></strong></p>
<h3>Core</h3>
<table>
<tbody>
<tr><th>Function Name</th><th>Short Description</th><th>Introduced</th><th>Certification</th></tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices&amp;referringTitle=Documentation">$().SPServices</a></strong></td>
<td>This is the core function of the library, which you can use to make Ajax calls to the SharePoint Web Services. <strong>Note</strong>: As of version 2013.01, all calls return a <a href="http://api.jquery.com/category/deferred-object/" target="_blank"> jQuery deferred object</a> aka a promise.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744">0.2.3</a></td>
<td>See individual Web Services</td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.defaults&amp;referringTitle=Documentation">$().SPServices.defaults</a></strong></td>
<td>With this defaults function, you can set the defaults for the remainder of the page life. This can be useful if you'd like to make many calls into the library for a single list or site.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31793">0.2.4</a></td>
<td>NA</td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=$().SPServices.Version&amp;referringTitle=Documentation">$().SPServices.Version</a></strong></td>
<td>Returns the current version of SPServices as a string, e.g., "0.7.2"</td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
<td>NA</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<h3>Form Enhancements/Assistance</h3>
<table>
<tbody>
<tr><th>Function Name</th><th>Short Description</th><th>Introduced</th><th>SharePoint 2010</th></tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPCascadeDropdowns&amp;referringTitle=Documentation">$().SPServices.SPCascadeDropdowns</a></strong></td>
<td>This is the first function we implemented which allows you to take advantage of the Web Services calls in a meaningful way. It allows you to easily set up cascading dropdowns on a list form. (What we mean by cascading dropdowns is the situation where the available options for one column depend on the value you select in another column.)</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31946">0.2.6</a></td>
<td><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></a></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPDisplayRelatedInfo&amp;referringTitle=Documentation">$().SPServices.SPDisplayRelatedInfo</a></strong></td>
<td>This function lets you display related information on forms when an option in a dropdown is chosen.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341">0.2.9</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPLookupAddNew&amp;referringTitle=Documentation">$().SPServices.SPLookupAddNew</a></strong></td>
<td>This function allows you to provide a link in forms for Lookup columns so that the user can add new values to the Lookup list easily. It is based on a blog post by Waldek Mastykarz. (see <a href="/wikipage?title=Credits&amp;referringTitle=Documentation">Credits</a>)</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33921">0.3.2</a></td>
<td><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Works with Caveats with SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_works.jpg" alt="Works with Caveats with SharePoint 2010" /></a></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPRedirectWithID&amp;referringTitle=Documentation">$().SPServices.SPRedirectWithID</a></strong></td>
<td>This function allows you to redirect to a another page from a new item form <strong> with</strong> the new item's ID. This allows chaining of forms from item creation onward.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
<td><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Not Tested with SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_notest.jpg" alt="Not Tested with SharePoint 2010" /></a></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPRequireUnique&amp;referringTitle=Documentation">$().SPServices.SPRequireUnique</a></strong></td>
<td>Checks to see if the value for a column on the form is unique in the list.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPSetMultiSelectSizes&amp;referringTitle=Documentation">$().SPServices.SPSetMultiSelectSizes</a></strong></td>
<td>Sets the size of the boxes in a multi-select picker based on the values they contain.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505">0.4.8</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPArrangeChoices&amp;referringTitle=Documentation">$().SPServices.SPArrangeChoices</a></strong></td>
<td>Rearranges radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34865">0.5.0</a></td>
<td><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></a></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPAutocomplete&amp;referringTitle=Documentation">$().SPServices.SPAutocomplete</a></strong></td>
<td>The SPAutocomplete lets you provide values for a <span class="codeInline">Single line of text column</span> from values in a SharePoint list. The function is highly configurable and can enhance the user experience with forms.</td>
<td><a href="http://spservices.codeplex.com/releases/view/42672">0.5.4</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPUpdateMultipleListItems">$().SPServices.SPUpdateMultipleListItems</a></strong></td>
<td>SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.</td>
<td><a href="http://spservices.codeplex.com/releases/view/53275" target="_self">0.5.8</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPFilterDropdown">$().SPServices.SPFilterDropdown</a></strong></td>
<td>The SPFilterDropdown function allows you to filter the values available in a Lookup column using CAML against the Lookup column's source list.</td>
<td><a href="http://spservices.codeplex.com/releases/view/62021">0.6.1</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPComplexToSimpleDropdown">$().SPServices.SPComplexToSimpleDropdown</a></strong></td>
<td>Converts a "complex" dropdown (which SharePoint displays if there are 20+ options) to a "simple" dropdown (select).</td>
<td><a href="http://spservices.codeplex.com/releases/view/64390">0.6.2</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPFindPeoplePicker">$().SPServices.SPFindPeoplePicker</a></strong></td>
<td>The SPFindPeoplePicker function helps you find and set People Picker column values.</td>
<td><a href="http://spservices.codeplex.com/releases/view/81401">0.7.2</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=%24%28%29.SPServices.SPFindMMSPicker">$().SPServices.SPFindMMSPicker</a></strong></td>
<td>The SPFindMMSPicker function helps you find an MMS Picker's values.</td>
<td><a title="2013.01" href="/releases/view/92552">2013.01</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<h3>Utilities</h3>
<table>
<tbody>
<tr><th>Function Name</th><th>Short Description</th><th>Introduced</th><th>SharePoint 2010</th></tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetCurrentSite&amp;referringTitle=Documentation">$().SPServices.SPGetCurrentSite</a></strong></td>
<td>This utility function, which is also publicly available, simply returns the current site's URL. It mirrors the functionality of the WebUrlFromPageUrl operation.</td>
<td><a href="http://spservices.codeplex.com/releases/view/31793">0.2.4</a></td>
<td><a href="http://spservices.codeplex.com/wikipage?title=Glossary#Certification"><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></a></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPDebugXMLHttpResult&amp;referringTitle=Documentation">$().SPServices.SPDebugXMLHttpResult</a></strong></td>
<td>This function displays the XMLHttpResult from an Ajax call formatted for easy debugging. You can call it manually as part of your completefunc.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949">0.2.10</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetCurrentUser&amp;referringTitle=Documentation">$().SPServices.SPGetCurrentUser</a></strong></td>
<td>This function returns information about the current user. It is based on an insightful trick from Einar Otto Stangvik (see <a href="/wikipage?title=Credits&amp;referringTitle=Documentation">Credits</a>).</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33657">0.3.1</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetLastItemId&amp;referringTitle=Documentation">$().SPServices.SPGetLastItemId</a></strong></td>
<td>Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetDisplayFromStatic&amp;referringTitle=Documentation">$().SPServices.SPGetDisplayFromStatic</a></strong></td>
<td>This function returns the <a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#DisplayName"> DisplayName</a> for a column based on the <a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#StaticName"> StaticName</a>.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458">0.4.0</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetStaticFromDisplay&amp;referringTitle=Documentation">$().SPServices.SPGetStaticFromDisplay</a></strong></td>
<td>This function returns the <a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#StaticName"> StaticName</a> for a column based on the <a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#DisplayName"> DisplayName</a>.</td>
<td><a href="http://spservices.codeplex.com/releases/view/42672">0.5.4</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPScriptAudit&amp;referringTitle=Documentation">$().SPServices.SPScriptAudit</a></strong></td>
<td>The SPScriptAudit function allows you to run an auditing report showing where scripting is in use in a site.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505">0.4.8</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPGetQueryString&amp;referringTitle=Documentation">$().SPServices.SPGetQueryString</a></strong></td>
<td>The SPGetQueryString function returns an array containing the Query String parameters and their values.</td>
<td><a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=40011">0.5.1</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=$().SPServices.SPListNameFromUrl">$().SPServices.SPListNameFromUrl</a></strong></td>
<td>Returns the current list's GUID *if* called in the context of a list, meaning that the URL is within the list, like /DocLib or /Lists/ListName.</td>
<td><a href="http://spservices.codeplex.com/releases/view/47136">0.5.7</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="http://spservices.codeplex.com/wikipage?title=$().SPFilterNode">$().SPFilterNode</a></strong></td>
<td>Can be used to find namespaced elements in returned XML, such as rs:data or z:row from GetListItems.</td>
<td><a href="http://spservices.codeplex.com/releases/view/68781">0.7.0</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a title="SPXmlToJson" href="/wikipage?title=%24%28%29.SPXmlToJson">$().SPXmlToJson</a></strong></td>
<td>SPXmlToJson is a function to convert XML data into JSON for client-side processing.</td>
<td><a title="0.7.1" href="http://spservices.codeplex.com/releases/view/77486">0.7.1</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="/wikipage?title=$().SPServices.SPConvertDateToISO">$().SPServices.SPConvertDateToISO</a></strong></td>
<td>Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items.</td>
<td><a title="2013.01" href="/releases/view/92552">2013.01</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="https://spservices.codeplex.com/wikipage?title=$().SPServices.SPGetListItemsJson">$().SPServices.SPGetListItemsJson</a></strong></td>
<td>SPGetListItemsJson combines several SPServices capabilities into one powerful function. By calling <a href="http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken(v=office.12).aspx" target="_blank"> GetListItemChangesSinceToken</a>, parsing the list schema, and passing the resulting mapping and data to <a href="https://spservices.codeplex.com/wikipage?title=%24%28%29.SPXmlToJson" target="_blank"> SPXmlToJson</a> automagically, we have a one-stop shop for retrieving SharePoint list data in JSON format. No manual mapping required!</td>
<td><a href="https://spservices.codeplex.com/releases/view/116626">2014.01</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
<tr>
<td><strong><a href="https://spservices.codeplex.com/wikipage?title=%24%28%29.SPServices.SPDropdownCtl">$().SPServices.SPDropdownCtl</a></strong></td>
<td>The function finds a dropdown in a form based on the name of the column (either the DisplayName or the StaticName) and returns an object you can use in your own functions.</td>
<td><a href="https://spservices.codeplex.com/releases/view/116626">2014.01</a></td>
<td><img style="border-style: none;" title="Certified for SharePoint 2010" src="http://www.sympraxisconsulting.com/SPServices/sm_certified.jpg" alt="Certified for SharePoint 2010" /></td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<p><a name="general-instructions"></a></p>
<h3>General Instructions</h3>
<p>First, please read <a href="http://sympmarc.com/2011/07/08/adding-jqueryspservices-to-a-sharepoint-page-step-one-always/"> this blog post</a>, which can help you to be sure that your script file references are correct.</p>
<p>The library can be implemented by adding a reference to it into a single page, a page layout, or a master page, depending upon your desired scope of use. The SPServices library requires the <a href="http://jquery.com/">jQuery library</a>. See the System Requirements section for required versions.</p>
<p>Most releases of the library include both a <a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#minified"> minified</a> and a normal version of the release. If you would like to understand the workings of the library, look at the normal version, but use the minified version for any production use.</p>
<p>I recommend storing the jQuery library and SPServices in a Document Library in your Site Collection and referencing it as needed, like this:</p>
<div style="color: black; background-color: white;">
<pre><span style="color: blue;">&lt;</span><span style="color: #a31515;">script</span> <span style="color: red;">language</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">javascript</span><span style="color: black;">"</span> <span style="color: red;">type</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">text/javascript</span><span style="color: black;">"</span> <span style="color: red;">src</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">/jQueryLibraries/jquery-1.11.0.min.js</span><span style="color: black;">"</span><span style="color: blue;">&gt;</span><span style="color: blue;">&lt;/</span><span style="color: #a31515;">script</span><span style="color: blue;">&gt;</span>
<span style="color: blue;">&lt;</span><span style="color: #a31515;">script</span> <span style="color: red;">language</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">javascript</span><span style="color: black;">"</span> <span style="color: red;">type</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">text/javascript</span><span style="color: black;">"</span> <span style="color: red;">src</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">/jQueryLibraries/jquery.SPServices-2014.01.min.js</span><span style="color: black;">"</span><span style="color: blue;">&gt;</span><span style="color: blue;">&lt;/</span><span style="color: #a31515;">script</span><span style="color: blue;">&gt;</span></pre>
</div>
<p>You can also reference the js files from a CDN, like so:</p>
<div style="color: black; background-color: white;">
<pre><span style="color: green;">&lt;!-- Reference jQuery on the Google CDN --&gt;</span>
<span style="color: blue;">&lt;</span><span style="color: #a31515;">script</span> <span style="color: red;">type</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">text/javascript</span><span style="color: black;">"</span> <span style="color: red;">src</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js</span><span style="color: black;">"</span><span style="color: blue;">&gt;</span><span style="color: blue;">&lt;/</span><span style="color: #a31515;">script</span><span style="color: blue;">&gt;</span>
<span style="color: green;">&lt;!-- Reference SPServices on cdnjs (Cloudflare) --&gt;</span>
<span style="color: blue;">&lt;</span><span style="color: #a31515;">script</span> <span style="color: red;">type</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">text/javascript</span><span style="color: black;">"</span> <span style="color: red;">src</span><span style="color: blue;">=</span><span style="color: black;">"</span><span style="color: blue;">//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2013.02a/jquery.SPServices-2013.02a.min.js</span><span style="color: black;">"</span><span style="color: blue;">&gt;</span><span style="color: blue;">&lt;/</span><span style="color: #a31515;">script</span><span style="color: blue;">&gt;</span></pre>
</div>
<p>See <a href="http://sympmarc.com/2013/02/07/referencing-jquery-jqueryui-and-spservices-from-cdns-revisited/"> this post</a> for more info on using CDNs.</p>
<p><a href="/wikipage?title=Glossary&amp;referringTitle=Documentation&amp;ANCHOR#DebugMode">Debug Mode</a>, first implemented in <a href="http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35706"> v0.4.5</a>, also can be helpful in implementing solutions with the library. <br /> <br /> Here's a small example. If you want to add functionality to NewForm.aspx, then take a copy of the form, call it something like NewFormCustom.aspx, and add your script into it. I like to put my scripts below this line:</p>
<div style="color: black; background-color: white;">
<pre>&lt;asp:Content ContentPlaceHolderId=<span style="color: #a31515;">"PlaceHolderMain"</span> runat=<span style="color: #a31515;">"server"</span>&gt;</pre>
</div>
<p>Other places may work, but this location has proven foolproof for me, regardless of what others may recommend.</p>
<div style="color: black; background-color: white;">
<pre>...
&lt;asp:Content ContentPlaceHolderId=<span style="color: #a31515;">"PlaceHolderMain"</span> runat=<span style="color: #a31515;">"server"</span>&gt;
&lt;script type=<span style="color: #a31515;">"text/javascript"</span> language=<span style="color: #a31515;">"javascript"</span> src=<span style="color: #a31515;">"/jQuery%20Libraries/jquery-1.11.1.min.js"</span>&gt;&lt;/script&gt;
&lt;script type=<span style="color: #a31515;">"text/javascript"</span> language=<span style="color: #a31515;">"javascript"</span> src=<span style="color: #a31515;">"/jQuery%20Libraries/jquery.SPServices-2014.01.min.js"</span>&gt;&lt;/script&gt;
&lt;script type=<span style="color: #a31515;">"text/javascript"</span>&gt;
    $(document).ready(<span style="color: blue;">function</span>() {
        $().SPServices.SPCascadeDropdowns({
            relationshipList: <span style="color: #a31515;">"Regions"</span>,
            relationshipListParentColumn: <span style="color: #a31515;">"Country"</span>,
            relationshipListChildColumn: <span style="color: #a31515;">"Title"</span>,
            parentColumn: <span style="color: #a31515;">"Country"</span>,
            childColumn: <span style="color: #a31515;">"Region"</span>
        });
    });
&lt;/script&gt;
...</pre>
</div>
<p>Obviously, the src attributes should point to wherever you've put the .js files.</p>
<p>Alternatively, you can place the code in a Content Editor Web Part (CEWP). I prefer the approach above (see the <a href="http://spservices.codeplex.com/wikipage?title=FAQs">FAQs</a>), but the CEWP approach works as well.</p>
<p>Once you've got the page set up the way you want it, right click on the list in the Folder List pane, select Properties, and then the Supporting Files tab. Choose the Content Type in the dropdown (NOT Folder) and then browse to your NewFormCustom.aspx to set it as the New Item Form. Click OK and you should be good to go.</p>
<p><strong>Debugging Hints and Tips</strong></p>
<ol>
<li>If you are working in SharePoint Designer, Ctrl-click the addresses of each of the two .js references. If you get a "file not found" message, you have a bad src URL. Most often, it's an incomplete path or occasionally a very innocuous misspelling.</li>
<li>Set the debug parameter to "true" (if available for the function you are using), and make one purposeful mistake, e.g., misspelling a column name. Then save and preview in a browser. You should get a popup error message. If not, your script is not running, most likely because it is in the wrong place. Reposition the script elsewhere in the code until you get an error message.</li>
<li>Wrapping your script in
<div style="color: black; background-color: white;">
<pre>$(document).ready(<span style="color: blue;">function</span>()</pre>
</div>
</li>
</ol>
<p style="padding-left: 30px;">means that the calls will be made once the page is fully loaded, i.e., the page is "ready". If you aren't getting the results you want and you aren't using $(document).ready(), then wrap your code in it and try again. (Depending on what you are trying to do, wrapping your script in $(document).ready() may *not* be what you want, but if you are just using the "value-added functions", you almost always will use it.)</p>