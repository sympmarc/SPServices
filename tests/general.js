
!(function() {

    var QUnit = require('qunit');
    var $ = require('jquery');
    var equal = require('equal');

    // A few QUnit configuration settings
    // For more, see: http://api.qunitjs.com/QUnit.config/
    QUnit.config.autostart = false;
    QUnit.config.reorder = false;

    /* Setup variables */
    var testList = {};
    testList.Name = new Date().toString();
    testList.Description = "This is the test description.";

    QUnit.test("Version", function (assert) {
        var v = $().SPServices.Version();
        assert.ok(v !== undefined, "Passed! Ver =::" + v + "::");
    });

    QUnit.test("SPGetQueryString", function (assert) {
        var qs = $().SPServices.SPGetQueryString();
        assert.ok(qs !== undefined, "Passed! SPGetQueryString =::" + qs + "::");
    });

    QUnit.test("SPGetCurrentUser", function (assert) {
        var currentUser = $().SPServices.SPGetCurrentUser();
        assert.ok(currentUser !== undefined, "Passed! SPCurrentUser =::" + currentUser + "::");
    });

    QUnit.test("SPGetCurrentSite", function (assert) {
        var currentSite = $().SPServices.SPGetCurrentSite();
        assert.ok(currentSite !== undefined, "Passed! SPCurrentSite =::" + currentSite + "::");
    });

    QUnit.test("SPConvertDateToISO", function (assert) {
        var nowISO = $().SPServices.SPConvertDateToISO(new Date());
        assert.ok(nowISO !== undefined, "Passed! SPConvertDateToISO =::" + nowISO + "::");
    });


}());