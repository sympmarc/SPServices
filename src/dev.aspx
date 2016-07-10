<%-- SPWidgets DEV test page --%>
<%--  --%>
<%@ Page language="C#" MasterPageFile="~masterurl/default.master"
        Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=12.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register
        Tagprefix="SharePoint"
        Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register
        Tagprefix="Utilities"
        Namespace="Microsoft.SharePoint.Utilities"
        Assembly="Microsoft.SharePoint, Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register
        Tagprefix="WebPartPages"
        Namespace="Microsoft.SharePoint.WebPartPages"
        Assembly="Microsoft.SharePoint, Version=12.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
    SPServices Development
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitleInTitleArea" runat="server">
    SPServices Development
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>SPServices Development</title>
    <meta name="description" content="A plugin to add discussions to any item.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--[if lt IE 9]>
        <script src="https://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->


    <!-- Load QUnit -->
    <link rel="stylesheet" href="https://code.jquery.com/qunit/qunit-1.20.0.css">
    <script type="text/javascript" src="https://code.jquery.com/qunit/qunit-1.20.0.js"></script>

    <!-- Load Blanket
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/blanket.js/1.1.4/blanket.min.js" data-cover-reporter="reporter/grunt-reporter.js"></script>
-->

    <script type="text/javascript">
        document.write(
            '<link rel="stylesheet" href="/' +
            '/ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.css?_@BUILD">'
        );

        // Define SPSERVICES global variable - for dev. stuff
        window.SPSERVICES = {
            mode: "dev" // others: built, builtmin
        };

        if (location.search && location.search.indexOf("mode=builtmin") > -1) {
            window.SPSERVICES.mode = "builtmin";
            document.write(
                '<script src="/' + '/ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></' + 'script>'
            );
            document.write(
                '<script src=".' + './build/jquery.SPServices.min.js?_@BUILD"></' + 'script>'
            );

        } else if (location.search && location.search.indexOf("mode=built") > -1) {
            window.SPSERVICES.mode = "built";
            document.write(
                '<script src="/' + '/ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></' + 'script>'
            );
            document.write(
                '<script src=".' + './build/jquery.SPServices.js?_@BUILD"></' + 'script>'
            );

        } else {
            document.write(
                '<script src="/' + '/cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js?_@BUILD"></' + 'script>'
            );
        }

    </script>

    <!-- LOAD TEST CASE FILES -->
    <script type="text/javascript" src="../test/general.js"></script>
<!--    <script type="text/javascript" src="../tests/Lists.js"></script> -->


</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderSearchArea" runat="server">
    <SharePoint:DelegateControl runat="server" ControlId="SmallSearchInputBox" />
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderLeftActions" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageDescription" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderBodyRightMargin" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderPageImage" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderLeftNavBar" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderNavSpacer" runat="server"></asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

    <div id="spservices_dev_cntr">
        <div>
            <span>Mode: </span>
            <a href="dev.aspx" title="Loads requireJS modules">Development</a> |
            <a href="dev.aspx?mode=built" title="Loads the built jQuery library">Built jQuery Library</a> |
            <a href="dev.aspx?mode=builtmin"  title="Loads the built jQuery library minified">Built jQuery Library (minified)</a>
            <hr/>
        </div>
    </div>

    <div id="qunit"></div>
    <div id="qunit-fixture"></div>

    <script type="text/javascript">

        (function(window, document){

            var done = function($, SPServices){
                $("#spservices_dev_cntr").append(
                    "<div>jQuery: v." + jQuery.fn.jquery + " Loaded!</div>" +
                    "<div>SPServices Loaded!</div>" +
                    "<div>v." + $().SPServices.Version() + ", Build: @BUILD</div>" +
                    "<div>Open the browser console to debug/test</div><hr/>"
                );

                // now run the test cases
                QUnit.start();
            };

            if (window.SPSERVICES.mode === "dev") {
                var app = requirejs.config({
                        context: "SPServices",
                        baseUrl: "./",
                        urlArgs: '@BUILD',
                        paths: {
                            jquery : '//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min'
                        },
                        shim: {}
                    });

                app(["require", "jquery", "SPServices"], function(require, $, SPServices){
                    done($, SPServices);
                });

            } else {
                done(jQuery);
            }

        }(window, document));

    </script>

</asp:Content>
