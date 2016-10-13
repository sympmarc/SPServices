---
title: 'ModifyUserPropertyByAccountName'
function: '$().SPServices'
web_service: 'UserProfileService'
web_service_operation: 'ModifyUserPropertyByAccountName'
---

## Example

Here is an example of using ModifyUserPropertyByAccountName from [Karel](http://www.codeplex.com/site/users/view/Karel).

```javascript
<script type='text/javascript'>
var propertyData = "<PropertyData>" +
    "<IsPrivacyChanged>false</IsPrivacyChanged>" +
    "<IsValueChanged>true</IsValueChanged>" +
    "<Name>" + propName + "</Name>" +
    "<Privacy>NotSet</Privacy>" +
    "<Values><ValueData><Value xsi:type=\"xsd:string\">" + propValue + "</Value></ValueData></Values>" +
  "</PropertyData>";
$().SPServices({
  operation: "ModifyUserPropertyByAccountName",
  async: false,
  webURL: "http://dell-dev-dev25/my",
  accountName: userId,
  newData: propertyData,
  completefunc: function (xData, Status) {
    var result = $(xData.responseXML);
  }
});
```
