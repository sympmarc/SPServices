---
title: 'defaults'
function: '$().SPServices.defaults'
description: 'With this defaults function, you can set the defaults for the remainder of the page life. This can be useful if you’d like to make many calls into the library for a single list or site.'
introduced: 0.2.4
nav_sort: 2
---

## Functionality

Using the defaults object, you can set the defaults for the remainder of the page life. This can be useful if you'd like to make many calls into the library for a single list or site. For a list of the available options, see the source code.

## Syntax
```javascript
$().SPServices.defaults.optionName = value;
```

## Examples

```javascript
$().SPServices.defaults.webURL = "http://sitecollection/siteA";  // URL of the target Web
$().SPServices.defaults.listName = "Site Parameters";  // Name of the list for list operations
```
