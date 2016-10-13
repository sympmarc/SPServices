---
title: 'UpdateListItems'
function: '$().SPServices'
web_service: 'Lists'
web_service_operation: 'UpdateListItems'
---

## Notes

* This operation accepts a webURL option. This allows you to change the context for the operation to a different site. Using a GUID for the listName does NOT change the context as it does with the Object Model, so you need to use the webURL option as well if your list is in a different site.

## Additional Syntax

If you want to update a single list item, rather than using the CAML syntax in updates you can specify valuepairs and the item's ID. If you specify valuepairs then updates should not be specified. The way it works is that it lets you specify an array of column [StaticNames](../../glossary.md#staticname) and values. So if you wanted to update the Title and the Body:

```javascript
batchCmd: "Update",
valuepairs: [["Title", "New Title Value"], ["Body", "Here is a the new text for the body column."]],
ID: 1234,
```

All that happens here is that the valuepairs are used to build up the CAML for UpdateListItems rather than requiring you to specify the full CAML syntax, which in this case would be:

```javascript
<Batch OnError='Continue'>
  <Method ID='1' Cmd='Update'>
    <Field Name='Title'>New Title Value</Field>
    <Field Name='Body'>Here is a the new text for the body column.</Field>
    <Field Name='ID'>1234</Field>
  </Method>
</Batch>
```

Note that if you decide to use the valuepairs approach, you also need to specify the ID option. The default for the batchCmd option is 'Update'. Also, the choices for Cmd are [New, Update, Delete, Moderate].

## Example

This is an example from my test harness. If you have a better, real life example, please create an issue or an PR.

```javascript
$(divId).html(waitMessage).SPServices({
	operation: "UpdateListItems",
	listName: testList,
	ID: ID,
	valuepairs: [["Title", now]],
	completefunc: function (xData, Status) {
		var out = $().SPServices.SPDebugXMLHttpResult({
			node: xData.responseXML,
			outputId: divId
		});
		$(divId).html("").append("<b>This is the output from the UpdateListItems operation:</b>" + out);
		$(divId).append("<b>Refresh to see the change in the list above.</b>");
	}
});
```

Here's an example of creating a folder in a Document Library using the PreSaveAction which came from a discussion with [LeSanglier](http://www.codeplex.com/site/users/view/LeSanglier).  (The PreSaveAction is called when the form is submitted and is a useful place to put business logic.)

```javascript
<script language="javascript" type="text/javascript" src="/HRD/JQuery/jquery-1.3.2.min.js"></script>
<script language="javascript" type="text/javascript" src="/HRD/JQuery/spservices/jquery.SPServices-0.4.7.min.js"></script>

<script language="javascript" type="text/javascript" >
function PreSaveAction() {
    var folderName = "essai";
    $().SPServices({
        operation: "UpdateListItems",
        async: false,
        listName: "documents",
        updates: "<Batch OnError='Continue' PreCalc='TRUE'>" +
                "<Method ID='1' Cmd='New'>" +
                    "<Field Name='FSObjType'>1</Field>" +
                    "<Field Name='BaseName'>" + folderName + "</Field>" +
                "</Method>" +
            "</Batch>",
        completefunc: function(xData, Status) {
            …
        }
    });
    return true;
}</script>
```

Another example from [_tomdaly_](http://www.codeplex.com/site/users/view/_tomdaly_). This example takes advantage of the valuepairs notation, which is part of SPServices. The List Web Service itself requires the Batch notation shown above.

This is an example of adding a new list item from a simple feedback type form.

```javascript
$(document).ready(function() {
    $("#feedback-submit input").click(function() {

		var subject = $("#feedback-subject-input input").val();
		var message = $("#feedback-message-input textarea").text();

		CreateNewItem(subject, message);		

    });
});

function CreateNewItem(subject, message) {
    $().SPServices({
        operation: "UpdateListItems",
        async: false,
        batchCmd: "New",
        listName: "Feedback",
        valuepairs: [["Title", subject], ["Message", message]],
        completefunc: function(xData, Status) {
          alert("completed");
        }
    });
}
```
