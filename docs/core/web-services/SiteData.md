---
title: 'SiteData'
function: '$().SPServices'
web_service: 'SiteData'
---

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| [EnumerateFolder](SiteData/EnumerateFolder.md) | `strFolderUrl` | [SiteData.EnumerateFolder Method](http://msdn.microsoft.com/en-us/library/ms774758%28v=office.12%29.aspx) | [0.5.7](http://spservices.codeplex.com/releases/view/47136) |
| GetList -> Must be called as **SiteDataGetList** | `[webURL], strListName` | [SiteData.GetList Method](http://msdn.microsoft.com/en-us/library/ms774793%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetListCollection -> Must be called as **SiteDataGetListCollection** | `[webURL]` | [SiteData.GetListCollection Method](http://msdn.microsoft.com/en-us/library/ms774864%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| GetSite -> Must be called as **SiteDataGetSite** | `[webURL]` | [SiteData.GetSite Method](http://msdn.microsoft.com/en-us/library/ms773417%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| GetSiteUrl -> Must be called as **SiteDataGetSiteUrl** | `Url` | [SiteData.GetSiteUrl Method](http://msdn.microsoft.com/en-us/library/ms774895%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
| [GetWeb](SiteData/GetWeb.md) -> Must be called as **SiteDataGetWeb** | `[webURL]` | [SiteData.GetWeb Method](http://msdn.microsoft.com/en-us/library/ms772798%28v=office.12%29.aspx) | [0.7.1](http://spservices.codeplex.com/releases/view/77486 "0.7.1") |
