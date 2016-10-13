---
title: 'Sites'
function: '$().SPServices'
web_service: 'Sites'
---

## Notes

The Sites Web Service is available in SharePoint 2007, but only minimally. Please be aware of the differences between the [2007](http://msdn.microsoft.com/en-us/library/sites.sites_methods%28v=office.12%29.aspx) and [2010](http://msdn.microsoft.com/en-us/library/websvcsites.sites_methods.aspx) versions.

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| CreateWeb | `urlType, titleType, descriptionType, templateNameType, languageType, languageSpecifiedType, localeType, localeSpecifiedType, collationLocaleType, collationLocaleSpecifiedType, uniquePermissionsType, uniquePermissionsSpecifiedType, anonymousType, anonymousSpecifiedType, presenceType, presenceSpecifiedType` | [Sites.CreateWeb Method](http://msdn.microsoft.com/en-us/library/ee658286) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| DeleteWeb | `url` | [Sites.DeleteWeb Method](http://msdn.microsoft.com/en-us/library/websvcsites.sites.deleteweb) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| GetSite | `SiteUrl` | [Sites.GetSite Method](http://msdn.microsoft.com/en-us/library/websvcsites.sites.getsite) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
| GetSiteTemplates | `LCID, TemplateList` | [Sites.GetSiteTemplates](http://msdn.microsoft.com/en-us/library/websvcsites.sites.getsitetemplates) | [0.7.2](http://spservices.codeplex.com/releases/view/81401) |
