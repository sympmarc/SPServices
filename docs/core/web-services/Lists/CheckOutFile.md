---
title: 'CheckOutFile'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'CheckOutFile'
---

## Example

Here is an example of using CheckOutFile from [jonesnick770](http://www.codeplex.com/site/users/view/jonesnick770). This link from a DVWP calls the function to check out the document:

```html
<a href="javascript:CheckOutBook('http://muskit9238/{@FileDirRef}/{@FileLeafRef}', '{@Modified}');"><b>Request Book</b></a>
```

Below is the javascript/jQuery:

```javascript
function CheckOutBook(bookURL, lastDate) {
    $().SPServices({
        operation: "CheckOutFile",
        pageUrl: bookURL,
        checkoutToLocal: "false"
    });
    location.reload(true);
}
```
