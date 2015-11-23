/**
 * Created by Marc D Anderson on 11/23/2015.
 */

QUnit.test( "SPGetCurrentUser", function( assert ) {
    var currentUser = $().SPServices.SPGetCurrentUser();
    assert.ok( currentUser !== undefined, "Passed!" );
});


QUnit.test( "SPGetCurrentSite", function( assert ) {
    var currentSite = $().SPServices.SPGetCurrentSite();
    assert.ok( currentSite !== undefined, "Passed! SPCurrentSite =::" + currentSite + "::" );
});
