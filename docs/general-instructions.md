---
title: 'General Instructions'
nav_group:
  - primary
nav_sort: 1
---

First, please read [this blog post](http://sympmarc.com/2011/07/08/adding-jqueryspservices-to-a-sharepoint-page-step-one-always/), which can help you to be sure that your script file references are correct.

The library can be implemented by adding a reference to it into a single page, a page layout, or a master page, depending upon your desired scope of use. The SPServices library requires the [jQuery library](http://jquery.com/). See the System Requirements section for required versions.

Most releases of the library include both a [minified](glossary.md#minified) and a normal version of the release. If you would like to understand the workings of the library, look at the normal version, but use the minified version for any production use.

I recommend storing the jQuery library and SPServices in a Document Library in your Site Collection and referencing it as needed, like this:
``` html
<script language="javascript" type="text/javascript" src="/jQueryLibraries/jquery-1.11.0.min.js"></script>
<script language="javascript" type="text/javascript" src="/jQueryLibraries/jquery.SPServices-2014.02.min.js"></script>
```

You can also reference the js files from a CDN, like so:

``` html
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices-2014.02.min.js"></script>
```
See [this post](http://sympmarc.com/2013/02/07/referencing-jquery-jqueryui-and-spservices-from-cdns-revisited/) for more info on using CDNs.

[Debug Mode](glossary.md#debug-mode), first implemented in [v0.4.5](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35706), also can be helpful in implementing solutions with the library.

Here's a small example. If you want to add functionality to NewForm.aspx, then take a copy of the form, call it something like NewFormCustom.aspx, and add your script into it. I like to put my scripts below this line:
``` html
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
```
Other places may work, but this location has proven foolproof for me, regardless of what others may recommend.
``` html
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
``` javascript
$(document).ready(function() {
  // ...
 });
```
means that the calls will be made once the page is fully loaded, i.e., the page is "ready". If you aren't getting the results you want and you aren't using $(document).ready(), then wrap your code in it and try again. (Depending on what you are trying to do, wrapping your script in $(document).ready() may *not* be what you want, but if you are just using the "value-added functions", you almost always will use it.)
