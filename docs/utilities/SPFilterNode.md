---
title: 'SPFilterNode'
function: '$().SPFilterNode'
certification:
  sp2007: 'certified'
  sp2010: 'certified'
description: 'Can be used to find namespaced elements in returned XML, such as rs:data or z:row from GetListItems.'
introduced: 0.7.0
---

## Functionality

<div class="alert alert-danger">**IMPORTANT NOTE: This function was introduced in v0.7.0 because of a change that the jQuery team made in jQuery 1.7. See my blog posts [here](http://sympmarc.com/2011/11/08/problem-with-jquery-1-7-and-spservices/) and [here](http://sympmarc.com/2011/11/23/jquery-library-for-sharepoint-web-services-spservices-v0-7-0-beta-1-available/) for details. If you are using a version of SPServices prior to v0.7.0, you do not have this function.**</div>

Can be used to find namespaced elements in returned XML, such as `rs:data` or `z:row` from GetListItems.

My hope is that by having this function in place, SPServices will be a bit more future-proof against changes made by the jQuery team. The function is only required if you want your script to work reliably cross-browser, as Internet Explorer will reliably find the elements with the simpler `.find("z:row")` syntax.

## Syntax

``` javascript
$(xData.responseXML).SPFilterNode(somenode)
```

## Example

``` javascript
$(xData.responseXML).SPFilterNode("z:row").each(function() {
   // Do something
});
```

## Additional Notes

Because the SPFilterNode function may be so widely used, I did not namepsace it with SPServices to keep replacement of .find("z:row") or .find("[nodeName='z:row']") as straightforward as possible.

The function is very simple, and is reproduced here. Thanks to Steve Workman for devising, testing, and documenting this approach.

``` javascript
// This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
// http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
// for performance details.
$.fn.SPFilterNode = function(name) {
  return this.find('*').filter(function() {
    return this.nodeName === name;
  });
};
```
