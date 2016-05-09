---
label: WebPartPages
id: WebPartPages
categorySlug: 'core'
categoryLabel: 'core'
categorySort: 'alphabetical'
documentSort: 'alphabetical'

### Function

**$().SPServices**

### Web Service

**Web Part Pages**

### Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| [AddWebPart](/docs/core/api/WebPartPages-AddWebPart.md) | `pageUrl, webPartXml, storage` | [WebPartPagesWebService.AddWebPart Method](http://msdn.microsoft.com/en-us/library/ms774670.aspx) | [0.5.0](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=34865) |
| AddWebPartToZone | `pageUrl, webPartXml, storage, zoneId, zoneIndex` | [WebPartPagesWebService.AddWebPartToZone Method](http://msdn.microsoft.com/en-us/library/aa979720(v=office.12).aspx) |  [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| DeleteWebPart | `pageUrl, storageKey, storage ` | [WebPartPagesWebService.DeleteWebPart Method](http://msdn.microsoft.com/en-us/library/ms774622(v=office.12).aspx)  | [2014.02](https://spservices.codeplex.com/releases/view/119578) |
| GetWebPart2 | `pageUrl, storageKey, storage, behavior` | [WebPartPagesWebService.GetWebPart2 Method](http://msdn.microsoft.com/en-us/library/aa979489.aspx) | [0.2.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32071) |
| GetWebPartPage | `documentName, behavior` | [WebPartPagesWebService.GetWebPartPage Method](http://msdn.microsoft.com/en-us/library/ms772651.aspx) | [0.2.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32071) |
| GetWebPartProperties | `pageUrl, storage` | [WebPartPagesWebService.GetWebPartProperties Method](http://msdn.microsoft.com/en-us/library/ms772724.aspx) | [0.4.5](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=35706) |
| GetWebPartProperties2 | `pageUrl, storage, behavior` | [WebPartPagesWebService.GetWebPartProperties2 Method](http://msdn.microsoft.com/en-us/library/aa979659.aspx) | [0.2.8](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32071) |
| SaveWebPart2 | `pageUrl, storageKey, webPartXml, storage, allowTypeChange` | [WebPartPagesWebService.SaveWebPart2 Method](http://msdn.microsoft.com/en-us/library/ms774675(v=office.12).aspx) | [2014.02](https://spservices.codeplex.com/releases/view/119578) |