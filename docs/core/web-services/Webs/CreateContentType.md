---
title: 'CreateContentType'
function: '$().SPServices'
web_service: 'Webs'
web_service_operation: 'CreateContentType'
---

## Example

Thanks to [fereko](http://www.codeplex.com/site/users/view/fereko) for providing this example. See [UpdateColumns](UpdateColumns.md) for the set up code.

```javascript
var thisWeb;
$().SPServices({
  operation: "WebUrlFromPageUrl",
  pageURL: ((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href),
  completefunc: function (xData, Status) {
    $(xData.responseXML).SPFilterNode("z:row").each(function() {
       thisWeb = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
  }
});
```
