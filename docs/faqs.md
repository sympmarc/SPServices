---
title: 'FAQs'
nav_group:
  - primary
nav_sort: 6
---

**Q: What do I need to install?**  
A: Not much. You need to put the two script files (jQuery and SPServices) into a location where all users have read permission. I recommend a Document Library in the root site of your Site Collection for easy access. (If you have many Site Collections, then perhaps in the root site of your Web Application.) There is nothing to install server-side.

**Q: Why did you build this darn thing?**  
A: For the answer to this and other things, check out my posts on [EndUserSharePoint.com](http://www.endusersharepoint.com/category/authors/marc-d-anderson/) (EUSP) and [my own blog](http://sympmarc.com). More to come, of course.

**Q: Why is the download count so low? I've heard lots of people talk about how great this library is.**  
A: I release new versions frequently, and each new release starts with the download counter set at zero. If you'd like to see the download stats over time, check out the [more detailed data](http://spservices.codeplex.com/stats).  

**Q: What can I accomplish with this library?**  
A: See [myarticles on EUSP](http://www.endusersharepoint.com/category/authors/marc-d-anderson/) as well as [my blog](http://sympmarc.com) for real life examples.  

**Q: What do I need to learn about jQuery to use the library?**  
A: That all depends on what you want to accomplish. If you simply want to use functions like [$().SPServices.SPCascadeDropdowns](value-added/SPCascadeDropdowns.md) or [$().SPServices.SPDisplayRelatedInfo](value-added/SPDisplayRelatedInfo.md) on a form, then you really don't need to understand jQuery much at all -- just adapt the example calls to meet your needs. If you want to take advantage of the underlying Web Services wrapped in [$().SPServices](core/web-services.md), then you'll need to understand jQuery to use the results.  

**Q: Why the need for list constructs for [$().SPServices.SPCascadeDropdowns](value-added/SPCascadeDropdowns.md) and some of the other functions?**  
A: For the functions to be reliable and robust, we need to be able to have these relational table constructs in place. They ensure that the relationships between column values are clean and that relational database-like rules are adhered to. The requirement for Lookup columns is there because we need to be able to make exact, not "fuzzy" matches.  

**Q: How can I help this project?**  
A: You can help in the following ways:

*   by using the library and letting me know what you use it for
*   by asking for the Web Services operations you might need that aren't there yet
*   by asking for cool functionality that takes advantage of the Web Services (this is my favorite category)
*   by asking questions when you get stuck so that I can improve the documentation for others, and/or
*   by contributing code patches or improvements

For any of these, start by posting to the [Discussions](http://spservices.codeplex.com/discussions) and we can take it from there.  

**Q: Should I put the function calls into Content Editor Web Parts (CEWPs)?**  
A: I don't advocate the use of CEWPs for scripting for several reasons:

*   jQuery is code, pure and simple. You should follow good coding practices with it just like anything else. Auditability becomes difficult if you place code in CEWPs.
*   Users with the appropriate permissions can delete or otherwise mess with the script in CEWPs, whether on purpose or inadvertantly.
*   The C in CEWP stands for Content, and that is the real intention for its use.

All that said, I know that some of you will put the scripts into CEWPs and they will work just fine.  

**Q: So where should I put the function calls?**  
A: I recommend putting the calls into the page(s) themselves with SharePoint Designer. By placing the scripts in the page (or page layout or master page), you'll keep it on the developer side of things. There's a general example of how I suggest doing this at the bottom of the [General Instructions page](general-instructions.md).  

**Q: Does this library replace the need for Visual Studio (managed) code?**  
A: Of course not. This library allows you to accomplish certain business requirements, hopefully easily and reliably, but I don't claim that it solves all requirements. I'm am a strong advocate of [development in "The Middle Tier"](http://sympmarc.com/2010/04/14/the-middle-tier-manifesto-an-alternative-approach-to-development-with-microsoft-sharepoint/) (meaning scripting and SharePoint Designer), but it isn't the right solution for everything. (Just most things, IMHO!)  

**Q: What about SharePoint 2010?**  
A: While I started this library aiming squarely at SharePoint 2007, it also works well with SharePoint 2010\. SharePoint 2010 has the same Web Services as SharePoint 2007, some with new operations. There are also new Web Services which expose new functionality, for instance the [SocialDataService Web Service](core/web-services/SocialDataService.md). I'll adapt the library over time based on what I see as trends in its use. Note that I have [certification icons](glossary.md#certification) in the documentation which indicate what I've tested with SharePoint 2010\. If you use something with SharePoint 2010 let me know how it works.  

**Q: Are any other Codeplex-based projects using this library?**  
A: So far I know of a couple: [SharePoint jQuery.SPItemsRotator](http://spitemsrotator.codeplex.com) and [SharePoint jQuery MultiSiteAdmin UI](http://spmsaui.codeplex.com). Let me know if you hear of others!  

**Q: My question isn't covered here, What should I do?**  
A: Leave a comment in the [Discussions](http://spservices.codeplex.com/Thread/List.aspx) and/or look through what's already posted there. You'll find that quite a few people are using the library and may have had some of the same questions as you initially.
