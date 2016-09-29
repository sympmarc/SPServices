---
title: 'Webs-GetAllSubWebCollection'
---

### Function

**$().SPServices**

### Web Service

**Webs**

### Operation

**GetAllSubWebCollection**

### Example

Thanks to Matt Bramer ([iOnline247](http://www.codeplex.com/site/users/view/iOnline247)) for providing this example.

```javascript
$().SPServices({
  operation: "GetAllSubWebCollection",
  completefunc: function(xData, Status) {
    console.log( xData.responseText );
    $(xData.responseXML).find("Webs > Web").each(function() {
      var $node = $(this);
      console.log( $node.attr("Title") );
    });
  }
});
```
