---
title: 'SpellCheck'
function: '$().SPServices'
web_service: 'SpellChecker'
web_service_operation: 'SpellCheck'
---

## Example

This is adapted from an example by [TechnSmile](http://www.codeplex.com/site/users/view/TechnSmile).

```javascript
var chunks = "Thhank yoou Marck ;)".split(" ");

for (i=0; i<chunks.length; i++){
  chunks[i] = "<string>" + chunks[i] + "</string>";
}

var spellResults;
$().SPServices({
  operation: "SpellCheck",
  chunksToSpell: chunks,
  declaredLanguage: 1033, // use 1033 for english
  useLad: false,
  completefunc: function(xData, Status){
    alert(xData.responseText)
  }
});
```
