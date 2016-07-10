!(function(){

    var QUnit = require('qunit');
    var $ = require('jquery');
    var equal = require('equal');

    // A few QUnit configuration settings
    // For more, see: http://api.qunitjs.com/QUnit.config/
    QUnit.config.autostart  = false;
    QUnit.config.reorder    = false;

    /* Setup variables */
    var testList = {};
    testList.Name = new Date().toString();
    testList.Description = "This is the test description.";

    QUnit.test( "AddList", function(assert) {

        assert.expect(2);
        var done = assert.async();

        var p = $().SPServices({
            operation: "AddList",
            listName: testList.Name,
            description: testList.Description,
            templateID: 100
        });
        p.done(function(){

            var listInfo = $(p.responseXML).find("List");
            equal(listInfo.attr("Title"), testList.Name, "Title of list should be should be ::" + testList.Name);
            equal(listInfo.attr("Description"), testList.Description, "Description of list should be should be ::" + testList.Description);
            done();

        });

    });

    QUnit.test( "UpdateListItems - New", function(assert) {

        assert.expect(1);
        var done = assert.async();

        var p = $().SPServices({
            operation: "UpdateListItems",
            listName: testList.Name,
            batchCmd: "New",
            valuepairs: [["Title", "New Title Value"]]
        });
        p.done(function(){

            var listError = $(p.responseXML).SPFilterNode("ErrorCode").text();
            equal(listError, "0x00000000", "Error code should be should be 0x00000000");
            done();

        });

    });

    QUnit.test( "GetListItems", function(assert) {

        assert.expect(1);
        var done = assert.async();

        var p = $().SPServices({
            operation: "GetListItems",
            listName: testList.Name
        });
        p.done(function(){

            var listCount = $(p.responseXML).SPFilterNode("rs:data").attr("ItemCount");
            equal(listCount, 1, "Count of list items should be should be 1");
            done();

        });

    });

    QUnit.test("SPGetDisplayFromStatic", function(assert) {

        assert.expect(1);

        var thisDisplayName =  $().SPServices.SPGetDisplayFromStatic({
            listName: testList.Name,
            columnStaticName: "Title"
        });

        equal(thisDisplayName, "Title", "SPGetDisplayFromStatic retrieved displayName=::" + thisDisplayName + "::");

    });

    QUnit.test("SPGetStaticFromDisplay", function(assert) {

        assert.expect(1);

        var thisStaticName =  $().SPServices.SPGetStaticFromDisplay({
            listName: testList.Name,
            columnDisplayName: "Title"
        });

        equal(thisStaticName, "Title", "SPGetStaticFromDisplay retrieved staticName=::" + thisStaticName + "::");

    });

    QUnit.test("SPGetLastItemId", function(assert) {

        assert.expect(1);

        var thisItemId =  $().SPServices.SPGetLastItemId({
            listName: testList.Name
        });

        equal(thisItemId, 1, "SPGetLastItemId retrieved thisItemId=::" + thisItemId + "::");

    });

    QUnit.test( "DeleteList", function(assert) {

        assert.expect(1);
        var done = assert.async();

        var p = $().SPServices({
            operation: "DeleteList",
            listName: testList.Name
        });
        p.done(function(){

            var listInfo = $(p.responseXML).find("DeleteListResponse");

            equal(listInfo.length, 1, "List deleted successfully" + testList.Name);
            done();

        });

    });

}());