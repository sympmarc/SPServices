---
title: 'UpdateColumns'
function: '$().SPServices'
web_service: 'Webs'
web_service_operation: 'UpdateColumns'
---

## Example

Thanks to [fereko](http://www.codeplex.com/site/users/view/fereko) for providing this example. See [CreateContentType](CreateContentType.md) for the addContentType code.

```javascript
function addColumns(){
  var fieldArray=new Array();
  fieldArray.push('<Field Type="User" DisplayName="GroupABC" FromBaseType="TRUE" AllowDeletion="TRUE"><Default></Default></Field>');
  fieldArray.push('<Field Type="User" DisplayName="GroupXYZ" FromBaseType="TRUE" AllowDeletion="TRUE"><Default></Default></Field>');
  var newFields='';
  for(var i=0; i<fieldArray.length; i++){
    newFields+='<Method ID="1">'+fieldArray[i]+'</Method>';
  }
  newFields='<Fields>'+newFields+'</Fields>';
  $().SPServices({
    operation: "UpdateColumns",
    newFields: newFields,
    completefunc: function (xData, Status) {
      var fields='';
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        fields=fields+'<Method ID="1"><Field ID="'+$(this).attr("ID")+'" Name="'+$(this).attr("Name")+'" DisplayName="'+$(this).attr("DisplayName")+'"/></Method>';
      });
      addContentType(fields);
    }
  });
}
```
