---
title: 'WebUrlFromPageUrl'
function: '$().SPServices'
web_service: 'Webs'
web_service_operation: 'WebUrlFromPageUrl'
---

## Example

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
