---
title: 'SearchPrinciples'
function: '$().SPServices'
web_service: 'People'
web_service_operation: 'SearchPrinciples'
---

## Example

Here's an example provided by [StefanBauer](http://www.codeplex.com/site/users/view/StefanBauer). Thanks!

To search Principals the following code works:

```javascript
$().SPServices({
  operation: "SearchPrincipals",
  webURL: "/",
  searchText: "bauer",
  maxResults: 100,
  SPPrincipalType: "SPPrincipalType.User",
  completefunc: function (xData, Status) {
    alert(xData);
  }
});
```
