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
        <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
    <script type="text/javascript">
        document.write(
            '<script src="/' + '/cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js?_@BUILD"></' + 'script>'
        );
        document.write(
            '<link rel="stylesheet" href="/' +
            '/ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.css?_@BUILD">'
        );
    </script>

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

    <div id="spservices_dev_cntr"></div>
    <script type="text/javascript">

        (function(window, document){

            var app = requirejs.config({
                    context: "SPServices",
                    baseUrl: "./",
                    urlArgs: '@BUILD',
                    paths: {
                        jquery      : '//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min',
                        'jquery-ui' : '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min'
                    },
                    shim: {}
                });

            app(["require", "jquery", "SPServices"], function(require, $){
                $("#spservices_dev_cntr").append("<div>SPServices Loaded!</div>")
            });

        }(window, document));

    </script>

</asp:Content>
