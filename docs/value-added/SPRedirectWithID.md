---
title: 'SPRedirectWithID'
function: '$().SPServices.SPRedirectWithID'
certification:
  sp2007: 'certified'
  sp2010: 'nottested'
description: 'This function allows you to redirect to a another page from a new item form with the new item’s ID. This allows chaining of forms from item creation onward.'
introduced: 0.4.0
---

## Functionality

This function allows you to redirect to another page from a new item form with the new item's ID. This allows chaining of forms from item creation onward.

**Important Notes: This function will not work in anonymous mode. See [this blog post](http://sympmarc.com/2011/01/28/spservices-spredirectwithid-in-anonymous-mode-nope-wont-work/) for details on why. Also, there must be a redirect in place, as [rdoyle78](http://www.codeplex.com/site/users/view/rdoyle78) points out in his comment:**
```
rdoyle78: "I just discovered something about SPRedirectWithID that I thought others might find useful.

I've got a list with a custom new item form, and it turns out that the SPRedirectWithID function
will not work if there is not already a redirect statement applied to the 'save' button.
The function works perfectly with a standard form, but it will fail if the "save" button only
performs a commit - it must also have a redirect action applied. I dont' know if I just missed
this in your setup, but it might be important for those of us who are using custom forms."
```

**Tip**: If you are using this function in conjunction with others in the library, call SPRedirectWithID first, as it will speed up the redirection.

## How Does It Work?

Assuming your NewForm is called NewFormCustom.aspx and the redirectUrl is set to EditForm.aspx:

* On the initial load of NewFormCustom.aspx, the form action is changed to point back to the same page, with ?Source=NewFormCust.aspx?ID=[the last ID created by the current user]%26RealSource=[the actual Source for the page]. The [the last ID created by the current user] is determined by calling the [$().SPServices.SPGetLastItemId](SPGetLastItemId.md) function.
* When the form reloads, because the ID is present on the Query String, the jQuery function then waits until [the last ID created by the current user] is not equal to the value on the Query String. This ensures that the commit has completed. The [the last ID created by the current user] is again determined by calling the [$().SPServices.SPGetLastItemId](SPGetLastItemId.md) function.
* The user should then be redirected to EditForm.aspx?ID=[the last ID created by the current user]

## Syntax

``` javascript
$().SPServices.SPRedirectWithID({
	redirectUrl: "",
	qsParamName: "ID"
});
```

### redirectUrl

The page for the redirect. Upon save of the form, the page will refresh briefly and then be redirected to redirectUrl with the new item's ID on the Query String.

### qsParamName

In some cases, you may want to pass the newly created item's ID with a different parameter name than ID. Specify that name here, if needed. The default is ID.

## Example

By placing the code below into any NewForm.aspx (or your customized version of it), the user will be redirected to EditForm.aspx with the ID for the newly created item as the value for OrderID. Thus, if the code is placed into the page:
http://servername/sitepath/Lists/listname/NewForm.aspx
the user will be redirected to
http://servername/sitepath/Lists/listname/EditForm.aspx?OrderID=nnn
after creating the item.

``` html
<script language="javascript" type="text/javascript">
	$(document).ready(function() {
		$().SPServices.SPRedirectWithID({
			redirectUrl: "EditForm.aspx",
			qsParamName: "OrderID"
		});
	});
</script>
```

The Source Query String parameter is preserved across the redirects, so:
http://servername/sitepath/Lists/listname/NewForm.aspx?Source=/sitepath/default.aspx
will redirect to:
http://servername/sitepath/Lists/listname/EditForm.aspx?OrderID=nnn&Source=/sitepath/default.aspx

It is possible to override the redirectUrl specified in the options by calling the page with a Query String parameter called RedirectURL. This allows for occasional overrides, if needed.
http://servername/sitepath/Lists/listname/NewForm.aspx?Source=/sitepath/default.aspx&RedirectURL=/sitepath/Lists/listname/EditForm2.aspx
will redirect to:
http://servername/sitepath/Lists/listname/EditForm2.aspx?OrderID=nnn&Source=/sitepath/default.aspx
regardless of the value specified for redirectUrl in the options.
