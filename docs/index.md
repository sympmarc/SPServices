** Please read the documentation (starting with the [General Instructions](/docs/index.md#general-instructions) at the bottom of this page) before asking questions. I'm happy to help out, but it's so much nicer when folks read the documentation.**

### Core

| Function Name | Short Description | Introduced | Certification |
| ------------- | ----------------- | ---------- | ------------- |
| **[$().SPServices](/wikipage?title=$().SPServices&referringTitle=Documentation)** | This is the core function of the library, which you can use to make Ajax calls to the SharePoint Web Services. **Note**: As of version 2013.01, all calls return a [jQuery deferred object](http://api.jquery.com/category/deferred-object/) aka a promise. | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) | See individual Web Services |
| **[$().SPServices.defaults](/wikipage?title=$().SPServices.defaults&referringTitle=Documentation)** | With this defaults function, you can set the defaults for the remainder of the page life. This can be useful if you'd like to make many calls into the library for a single list or site. | [0.2.4](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31793) | NA |
| **[$().SPServices.Version](http://spservices.codeplex.com/wikipage?title=$().SPServices.Version&referringTitle=Documentation)** | Returns the current version of SPServices as a string, e.g., "0.7.2" | [0.7.2](http://spservices.codeplex.com/releases/view/81401) | NA |

### Form Enhancements/Assistance

| Function Name | Short Description | Introduced | SharePoint 2010 |
| ------------- | ----------------- | ---------- | --------------- |
| **[$().SPServices.SPCascadeDropdowns](/docs/value-added/SPCascadeDropdowns&referringTitle=Documentation)** | This is the first function we implemented which allows you to take advantage of the Web Services calls in a meaningful way. It allows you to easily set up cascading dropdowns on a list form. (What we mean by cascading dropdowns is the situation where the available options for one column depend on the value you select in another column.) | [0.2.6](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31946) | [![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) |
| **[$().SPServices.SPDisplayRelatedInfo](/docs/value-added/SPDisplayRelatedInfo&referringTitle=Documentation)** | This function lets you display related information on forms when an option in a dropdown is chosen. | [0.2.9](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32341) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPLookupAddNew](/docs/value-added/SPLookupAddNew&referringTitle=Documentation)** | This function allows you to provide a link in forms for Lookup columns so that the user can add new values to the Lookup list easily. It is based on a blog post by Waldek Mastykarz. (see [Credits](/wikipage?title=Credits&referringTitle=Documentation)) | [0.3.2](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33921) | [![Works with Caveats with SharePoint 2010](/docs/img/sm_works.jpg "Works with Caveats with SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) |
| **[$().SPServices.SPRedirectWithID](/docs/value-added/SPRedirectWithID&referringTitle=Documentation)** | This function allows you to redirect to a another page from a new item form **with** the new item's ID. This allows chaining of forms from item creation onward. | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) | [![Not Tested with SharePoint 2010](/docs/img/sm_notest.jpg "Not Tested with SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) |
| **[$().SPServices.SPRequireUnique](/docs/value-added/SPRequireUnique&referringTitle=Documentation)** | Checks to see if the value for a column on the form is unique in the list. | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPSetMultiSelectSizes](/docs/value-added/SPSetMultiSelectSizes&referringTitle=Documentation)** | Sets the size of the boxes in a multi-select picker based on the values they contain. | [0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPArrangeChoices](/docs/value-added/SPArrangeChoices&referringTitle=Documentation)** | Rearranges radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate. | [0.5.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34865) | [![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) |
| **[$().SPServices.SPAutocomplete](/docs/value-added/SPAutocomplete&referringTitle=Documentation)** | The SPAutocomplete lets you provide values for a <span class="codeInline">Single line of text column</span> from values in a SharePoint list. The function is highly configurable and can enhance the user experience with forms. | [0.5.4](http://spservices.codeplex.com/releases/view/42672) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPUpdateMultipleListItems](/docs/value-added/SPUpdateMultipleListItems)** | SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria. | [0.5.8](http://spservices.codeplex.com/releases/view/53275) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPFilterDropdown](/docs/value-added/SPFilterDropdown)** | The SPFilterDropdown function allows you to filter the values available in a Lookup column using CAML against the Lookup column's source list. | [0.6.1](http://spservices.codeplex.com/releases/view/62021) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPComplexToSimpleDropdown](/docs/value-added/SPComplexToSimpleDropdown)** | Converts a "complex" dropdown (which SharePoint displays if there are 20+ options) to a "simple" dropdown (select). | [0.6.2](http://spservices.codeplex.com/releases/view/64390) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPFindPeoplePicker](/docs/value-added/SPFindPeoplePicker)** | The SPFindPeoplePicker function helps you find and set People Picker column values. | [0.7.2](http://spservices.codeplex.com/releases/view/81401) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPFindMMSPicker](/docs/value-added/SPFindMMSPicker)** | The SPFindMMSPicker function helps you find an MMS Picker's values. | [2013.01](http://spservices.codeplex.com/releases/view/92552 "2013.01") | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |

### Utilities

| Function Name | Short Description | Introduced | SharePoint 2010 |
| ------------- | ----------------- | ---------- | --------------- |
| **[$().SPServices.SPGetCurrentSite](/docs/utilities/SPGetCurrentSite)** | This utility function, which is also publicly available, simply returns the current site's URL. It mirrors the functionality of the WebUrlFromPageUrl operation. | [0.2.4](http://spservices.codeplex.com/releases/view/31793) | [![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010")](http://spservices.codeplex.com/wikipage?title=Glossary#Certification) |
| **[$().SPServices.SPDebugXMLHttpResult](/docs/utilities/SPDebugXMLHttpResult)** | This function displays the XMLHttpResult from an Ajax call formatted for easy debugging. You can call it manually as part of your completefunc. | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetCurrentUser](/docs/utilities/SPGetCurrentUser)** | This function returns information about the current user. It is based on an insightful trick from Einar Otto Stangvik (see [Credits](/wikipage?title=Credits&referringTitle=Documentation)). | [0.3.1](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=33657) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetLastItemId](/docs/utilities/SPGetLastItemId)** | Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships. | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetDisplayFromStatic](/docs/utilities/SPGetDisplayFromStatic)** | This function returns the [DisplayName](/wikipage?title=Glossary&referringTitle=Documentation&ANCHOR#DisplayName) for a column based on the [StaticName](/wikipage?title=Glossary&referringTitle=Documentation&ANCHOR#StaticName). | [0.4.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34458) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetStaticFromDisplay](/docs/utilities/SPGetStaticFromDisplay)** | This function returns the [StaticName](/wikipage?title=Glossary&referringTitle=Documentation&ANCHOR#StaticName) for a column based on the [DisplayName](/wikipage?title=Glossary&referringTitle=Documentation&ANCHOR#DisplayName). | [0.5.4](http://spservices.codeplex.com/releases/view/42672) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPScriptAudit](/docs/utilities/SPScriptAudit)** | The SPScriptAudit function allows you to run an auditing report showing where scripting is in use in a site. | [0.4.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=37505) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetQueryString](/docs/utilities/SPGetQueryString)** | The SPGetQueryString function returns an array containing the Query String parameters and their values. | [0.5.1](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=40011) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPListNameFromUrl](/docs/utilities/SPListNameFromUrl)** | Returns the current list's GUID *if* called in the context of a list, meaning that the URL is within the list, like /DocLib or /Lists/ListName. | [0.5.7](http://spservices.codeplex.com/releases/view/47136) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPFilterNode](/docs/utilities/SPFilterNode)** | Can be used to find namespaced elements in returned XML, such as rs:data or z:row from GetListItems. | [0.7.0](http://spservices.codeplex.com/releases/view/68781) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPXmlToJson](/docs/utilities/SPXmlToJson)** | SPXmlToJson is a function to convert XML data into JSON for client-side processing. | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPConvertDateToISO](/docs/utilities/SPConvertDateToISO)** | Convert a JavaScript date to the ISO 8601 format required by SharePoint to update list items. | [2013.01](http://spservices.codeplex.com/releases/view/92552 "2013.01") | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPGetListItemsJson](/docs/utilities/SPGetListItemsJson)** | SPGetListItemsJson combines several SPServices capabilities into one powerful function. By calling [GetListItemChangesSinceToken](http://msdn.microsoft.com/en-us/library/lists.lists.getlistitemchangessincetoken(v=office.12).aspx), parsing the list schema, and passing the resulting mapping and data to [SPXmlToJson](https://spservices.codeplex.com/wikipage?title=%24%28%29.SPXmlToJson) automagically, we have a one-stop shop for retrieving SharePoint list data in JSON format. No manual mapping required! | [2014.01](https://spservices.codeplex.com/releases/view/116626) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |
| **[$().SPServices.SPDropdownCtl](/docs/utilities/SPDropdownCtl)** | The function finds a dropdown in a form based on the name of the column (either the DisplayName or the StaticName) and returns an object you can use in your own functions. | [2014.01](https://spservices.codeplex.com/releases/view/116626) | ![Certified for SharePoint 2010](/docs/img/sm_certified.jpg "Certified for SharePoint 2010") |

<a name="general-instructions"></a>

### General Instructions

First, please read [this blog post](http://sympmarc.com/2011/07/08/adding-jqueryspservices-to-a-sharepoint-page-step-one-always/), which can help you to be sure that your script file references are correct.

The library can be implemented by adding a reference to it into a single page, a page layout, or a master page, depending upon your desired scope of use. The SPServices library requires the [jQuery library](http://jquery.com/). See the System Requirements section for required versions.

Most releases of the library include both a [minified](/wikipage?title=Glossary&referringTitle=Documentation&ANCHOR#minified) and a normal version of the release. If you would like to understand the workings of the library, look at the normal version, but use the minified version for any production use.

I recommend storing the jQuery library and SPServices in a Document Library in your Site Collection and referencing it as needed, like this:

```html
<script language="javascript" type="text/javascript" src="/jQueryLibraries/jquery-1.11.0.min.js"></script>
<script language="javascript" type="text/javascript" src="/jQueryLibraries/jquery.SPServices-2014.02.min.js"></script>
```

You can also reference the js files from a CDN, like so:

```html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2013.02a/jquery.SPServices-2014.03.min.js"></script>
```
See [this post](http://sympmarc.com/2013/02/07/referencing-jquery-jqueryui-and-spservices-from-cdns-revisited/) for more info on using CDNs.

[Debug Mode](/docs/glossary/index.md#DebugMode), first implemented in [v0.4.5](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35706), also can be helpful in implementing solutions with the library. 

Here's a small example. If you want to add functionality to NewForm.aspx, then take a copy of the form, call it something like NewFormCustom.aspx, and add your script into it. I like to put my scripts below this line:
```html
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
```
Other places may work, but this location has proven foolproof for me, regardless of what others may recommend.
```html
...
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
<script type="text/javascript" language="javascript" src="/jQuery%20Libraries/jquery-1.11.3.min.js"></script>
<script type="text/javascript" language="javascript" src="/jQuery%20Libraries/jquery.SPServices-2014.02.min.js"></script>
<script type="text/javascript">
    $(document).ready(function() {
        $().SPServices.SPCascadeDropdowns({
            relationshipList: "Regions",
            relationshipListParentColumn: "Country",
            relationshipListChildColumn: "Title",
            parentColumn: "Country",
            childColumn: "Region"
        });
    });
</script>
...
```
Obviously, the src attributes should point to wherever you've put the .js files.

Alternatively, you can place the code in a Content Editor Web Part (CEWP). I prefer the approach above (see the [FAQs](http://spservices.codeplex.com/wikipage?title=FAQs)), but the CEWP approach works as well.

Once you've got the page set up the way you want it, right click on the list in the Folder List pane, select Properties, and then the Supporting Files tab. Choose the Content Type in the dropdown (NOT Folder) and then browse to your NewFormCustom.aspx to set it as the New Item Form. Click OK and you should be good to go.

**Debugging Hints and Tips**

1.  If you are working in SharePoint Designer, Ctrl-click the addresses of each of the two .js references. If you get a "file not found" message, you have a bad src URL. Most often, it's an incomplete path or occasionally a very innocuous misspelling.
2.  Set the debug parameter to "true" (if available for the function you are using), and make one purposeful mistake, e.g., misspelling a column name. Then save and preview in a browser. You should get a popup error message. If not, your script is not running, most likely because it is in the wrong place. Reposition the script elsewhere in the code until you get an error message.
3.  Wrapping your script in
```javascript
$(document).ready(function() {
  // ...
 });
```
means that the calls will be made once the page is fully loaded, i.e., the page is "ready". If you aren't getting the results you want and you aren't using $(document).ready(), then wrap your code in it and try again. (Depending on what you are trying to do, wrapping your script in $(document).ready() may *not* be what you want, but if you are just using the "value-added functions", you almost always will use it.)