---
title: 'Caching'
---

I've added a caching option into SPServices v0.7.2 and it can save a decent amount of traffic back and forth with the server, depending on how you are using things. It uses [jQuery’s `.data()` functions](http://api.jquery.com/category/data/) to cache the XML for each request which has the option `cacheXML: true`.

This is basically brute force. If `cacheXML: true`, then the returned XML is saved as a data object on the body of the page with the request XML as the key. If you make the exact same call again, then the request is fulfilled from that cache. Note that it has to be the “exact same call”. This means that the request XML has to match exactly.

in v0.7.2, I’ve set the option to true for some of the internal calls to the Web Services operations to speed things up when you use functions multiple times. For instance, quite a few of the value-added functions make a call to GetList to get details about the current list, and there’s no need to make that call more than once during the page life. If you are creating more than one cascade with [SPCascadeDropdowns](value-added/SPCascadeDropdowns.md), for example, you’ll see an immediate improvement. However, since I can’t predict how many values you may have coming back from `GetListItems` calls, I haven’t turned on caching pervasively, since I didn’t want to break things in an effort to be more efficient. Some client machines may not have the horsepower to cache large volumes of data, etc. If you know your data and your client machine capabilities well, you can set the option to true in the defaults:

``` javascript
$().SPServices.defaults.cacheXML = true;
```

which will affect all Web Service operation calls in the current page lifecycle.

You can use the `cacheXML: true` option with any Web Service operation in [SPServices Core](core/web-services.md), though as you can imagine some operations will benefit more than others.
