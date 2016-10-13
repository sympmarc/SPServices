---
title: 'TaxonomyClientService'
function: '$().SPServices'
web_service: 'TaxonomyClientService'
---

A big thanks to [Thomas MacMillan](http://zepeda-mcmillan.blogspot.com/) for providing the code to make this addition to SPServices possible. Check out his blog for some tips and tricks about using this Web Service. Specifically, it is difficult to get at the correct GUIDs. Thomas' post [Working with Lists and Schemas](http://zepeda-mcmillan.blogspot.com/2011/02/working-with-lists-and-schemas.html) provides some Powershell to help with this. [Several other of Thomas' posts](http://zepeda-mcmillan.blogspot.com/search?q=taxonomy) may also help you understand more about this Web Service.

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| AddTerms | `sharedServiceId, termSetId, lcid, newTerms` | [TaxonomyClientService.AddTerms Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.addterms.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetChildTermsInTerm | `sspId, lcid, termId, termSetId` | [TaxonomyClientService.GetChildTermsInTerm Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.getchildtermsinterm.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetChildTermsInTermSet | `sspId, lcid, termSetId` | [TaxonomyClientService.GetChildTermsInTermSet Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.getchildtermsintermset.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetKeywordTermsByGuids | `termIds, lcid` | [TaxonomyClientService.GetKeywordTermsByGuids Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.getkeywordtermsbyguids.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetTermsByLabel | `label, lcid, matchOption, resultCollectionSize, termIds, addIfNotFound` | [TaxonomyClientService.GetTermsByLabel Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.gettermsbylabel.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetTermSets  | `sharedServiceIds, termSetIds, lcid, clientTimeStamps, clientVersions, serverTermSetTimeStampXml` | [TaxonomyClientService.GetTermSets Method](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.taxonomy.webservices.taxonomyclientservice.gettermsets.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
