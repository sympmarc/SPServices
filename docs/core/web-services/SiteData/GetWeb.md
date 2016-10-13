---
title: 'GetWeb'
function: '$().SPServices'
web_service: 'SiteData'
web_service_operation: 'GetWeb (called as SiteDataGetWeb)'
---

## Example

This is an example from [Jburnish](http://www.codeplex.com/site/users/view/Jburnish).

```javascript
$().SPServices({
  operation: "SiteDataGetWeb",
  async:false,
  webURL: "/MySiteRelativeWebUrl",
  completefunc: function (xData, Status){
    //To show full return, create a div with the id of xmlMe
    //$("#xmlMe").text(xData.responseXML.xml);
    if(Status="Success") {
      var myWebId = $(xData.responseXML).find("WebID").text();        
      //returns full GUID with brackets which can then be used with 'GetListItems'        
    } else {
      alert("Status of web service call is " + Status + ". Please try a different site relative webURL.");
    }    
  } //End complete function
}); //end Services call
```
