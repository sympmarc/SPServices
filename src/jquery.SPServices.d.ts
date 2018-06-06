
declare module JQuerySPServices {
    interface SPServicesOptions {
        /** If true, we'll cache the XML results with jQuery's .data() function */
        cacheXML?: boolean;
        /** The Web Service operation */
        operation: string;
        /** URL of the target Web */
        webURL?: string;
        /** true to make the view the default view for the list */
        makeViewDefault?: boolean;

        // For operations requiring CAML, these options will override any abstractions 

        /** View name in CAML format. */
        viewName?: string;
        /** Query in CAML format */
        CAMLQuery?: string;
        /** View fields in CAML format */
        CAMLViewFields?: string;
        /** Row limit as a string representation of an integer */
        CAMLRowLimit?: number;
        /** Query options in CAML format */
        CAMLQueryOptions?: string;

        // Abstractions for CAML syntax 

        /** Method Cmd for UpdateListItems */
        batchCmd?: string;
        /** Fieldname / Fieldvalue pairs for UpdateListItems */
        valuepairs?: [string, any][];

        // As of v0.7.1, removed all options which were assigned an empty string ("") 

        /** Array of destination URLs for copy operations */
        DestinationUrls?: string[];
        /** An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 } */
        behavior?: string;
        /** A Storage value indicating how the Web Part is stored: {None | Personal | Shared} */
        storage?: string;
        /** objectType for operations which require it */
        objectType?: string;
        /** true to delete a meeting;false to remove its association with a Meeting Workspace site */
        cancelMeeting?: boolean;
        /** true if the calendar is set to a format other than Gregorian;otherwise, false. */
        nonGregorian?: boolean;
        /** Specifies if the action is a claim or a release. Specifies true for a claim and false for a release. */
        fClaim?: boolean;
        /** The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings. */
        recurrenceId?: number;
        /** An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied. */
        sequence?: number;
        /** SocialDataService maximumItemsToReturn */
        maximumItemsToReturn?: number;
        /** SocialDataService startIndex */
        startIndex?: number;
        /** SocialDataService isHighPriority */
        isHighPriority?: boolean;
        /** SocialDataService isPrivate */
        isPrivate?: boolean;
        /** SocialDataService rating */
        rating?: number;
        /** Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10. */
        maxResults?: number;
        /** Specifies user scope and other information? [None | User | DistributionList | SecurityGroup | SharePointGroup | All] */
        principalType?: string;

        /** Allow the user to force async */
        async?: boolean;
        /** Function to call on completion */
        completefunc?: (xData: JQueryXHR, status: string) => void;

        // Additional options


        // Alert Operations

        /** Array of GUIDs for DeleteAlerts */
        IDs?: string[];

        // Authentication Operations

        /** Username for Login operation. */
        username?: string;
        /** Password for Login operation. */
        password?: string;

        // Copy Operations

        /** Source URL for copy operations. */
        SourceUrl?: string;
        /** Document information as a set of fields, from copy operations. */
        Fields?: any;
        /** A byte stream representing a document's binary data, from copy operations. */
        Stream?: any;
        /** An array of CopyResult objects, from copy operations. */
        Results?: any;
        /**
         * Absolute URL for source document, for Copy.GetItem; or,
         * a specified URL to query the GUID and URL of the site collection to which it belongs, for GetSiteUrl.
         */
        Url?: string;

        // Form Operations

        /** Site-relative URL of the form to retrieve. */
        formUrl?: string;

        // List Operations

        /** List name for operations involving SharePoint lists. */
        listName?: string;
        /** ID of a list item for operations involving list attachments. */
        listItemID?: string;
        /**
         * Name of the file to add as an attachment, for operations involving list attachments; or,
         * the site-relative location of the folder name and file name of the file whose versions are to be retrieved, restored, or deleted.
         */
        fileName?: string;
        /** Byte array that contains the file to attach by using base-64 encoding, for operations involving list attachments. */
        attachment?: any;
        /**
         * The base64Binary content of the item to add to a discussion board; or,
         * a string containing the message to display to the client, for SendClientScriptErrorReport.
         */
        message?: string | any;
        /**
         * Description of the list, for operations that create new lists; or,
         * of the Web to be created; or,
         * of the group.
         */
        description?: string;
        /** A 32-bit integer that specifies the list template to use; for options, see the MSDN documentation for AddList. */
        templateID?: number;
        /** A System.Guid specifying the Feature ID. */
        featureID?: string;
        /** The full path to the document, for check-in, check-out, web, or web part operations. */
        pageUrl?: string;
        /** Optional check-in comments; or, the contents of a social comment. */
        comment?: string;
        /** In string form, any of the values 0, 1 or 2, where 0 = MinorCheckIn, 1 = MajorCheckIn, and 2 = OverwriteCheckIn, for CheckInItems. */
        CheckinType?: string;
        /** The content type ID of the list or site content type. */
        contentTypeId?: string;
        /** Either "true" or "false" in string form, designating whether the file is to be flagged as checked out for offline editing. */
        checkoutToLocal?: string;
        /**
         * A string in RFC 1123 date format representing the date and time of the last modification to the file.
         * @example "20 Jun 1982 12:00:00 GMT"
         */
        lastModified?: string;
        /** Display name of the list or site content type. */
        displayName?: string;
        /** The content type ID of the site content type on which to base the list or site content type. */
        parentType?: string;
        /**
         * A string representing the collection of columns to include on the new site content type.
         * 
         * Format the column collection as a FieldRefs element, where each FieldRef child element represents a reference to an existing column to include on the content type.
         */
        fields?: string;
        /**
         * A string representing the properties to specify for the content type.
         * 
         * Format the properties as a ContentType element, and include the element attributes for the properties you want to specify.
         */
        contentTypeProperties?: string;
        /** A string containing "true" or "false" that designates whether to add the content type to the list view. */
        addToView?: string;
        /**
         * A string that contains the absolute URL of the Web to be created or deleted; or,
         * associated with a social data element; or,
         * for the attachment, as follows:
         * 
         * @example http://Server_Name/Site_Name/Lists/List_Name/Attachments/Item_ID/FileName.
         */
        url?: string;
        /**
         * The document URI specified in the XMLDocument element.
         * 
         * Windows SharePoint Services uses this URI to identify the correct XMLDocument element to delete.
         */
        documentUri?: string;
        /**
         * List item ID for list operations, when accessing a particular item on the list.
         * 
         * GetAttachmentCollection uses a string; UpdateListItems uses a number.
         */
        ID?: number | string;
        /**
         * A ViewFields element that specifies which fields to return in the query and in what order, and that can be assigned to a System.Xml.XmlNode object.
         * 
         * @example
         * <ViewFields><FieldRef Name="ID" />
         * <FieldRef Name="Title" /></ViewFields>
         */
        viewFields?: string;
        /**
         * A string that contains the date and time in Coordinated Universal Time (UTC) ISO8601 format from which to start retrieving changes in the 
         * list. The value of this parameter is typically retrieved from a prior SOAP response. If this value is null, the query returns all items in 
         * the list.
         */
        since?: string;
        /**
         * A Contains element that defines custom filtering for the query and that can be assigned to a System.Xml.XmlNode object.
         * 
         * This parameter can contain null.
         * 
         * @example
         * <Contains>
         *    <FieldRef Name="Status"/>
         *    <Value Type="Text">Complete</Value>
         * </Contains>
         */
        contains?: string;
        /** A string that contains the change token for the request. If null is passed, all items in the list are returned. */
        changeToken?: string;
        /** A string that contains the ID of the list. */
        strlistID?: string;
        /** A string that contains the ID of the item. */
        strlistItemID?: string;
        /** A string that contains the name of the field. */
        strFieldName?: string;
        /**
         * A string that represents the collection of columns to add to the list or site content type.
         * 
         * Format the column collection as a FieldRefs element, where each FieldRef child element references a column to add to the list content type.
         */
        newFields?: string;
        /**
         * A string that represents the collection of columns to update on the list or site content type.
         * 
         * Format the column collection as a FieldRefs element, where each FieldRef references a column to update on the content type.
         * 
         * In each FieldRef child element, include the element attributes for the column properties you want to update.
         */
        updateFields?: string;
        /**
         * A string that represents the collection of columns to delete from the list or site content type.
         * 
         * Format the column collection as a FieldRefs element, where each FieldRef references a column to delete from the content type.
         * 
         * In each FieldRef child element, include the ID attributes for the column you want to delete.
         */
        deleteFields?: string;
        /** A string representing the XML document to replace the existing XML document. */
        newDocument?: string;
        /**
         * An XML fragment in the following form that can be assigned to a System.Xml.XmlNode object and that contains all the list properties to be updated.
         * 
         * For possible attributes, see the MSDN documentation for UpdateList.
         * 
         * @example
         * <List Title="List_Name" Description="List_Description" Direction="LTR"/>
         */
        listProperties?: string;
        /** A string that contains the version of the list that is being updated so that conflict detection can be performed. */
        listVersion?: string;

        // Meetings Operations

        /** The e-mail address, specified as email_address@domain.ext, for the meeting organizer. */
        organizerEmail?: string;
        /** A persistent GUID for the calendar component. */
        uid?: string;
        /** The date and time that the instance of the iCalendar object was created. This parameter needs to be in the UTC format (for example, 2003-03-04T04:45:22-08:00).*/
        utcDateStamp?: string;
        /** The title (subject) of the meeting, meeting workspace, Web, or social data. */
        title?: string;
        /** The location of the meeting. */
        location?: string;
        /** The start date and time for the meeting, expressed in UTC. */
        utcDateStart?: string;
        /** The end date and time for the meeting, expressed in UTC. */
        utcDateEnd?: string;
        /**
         * The name of the template to use when the site is created.
         * 
         * See Windows SharePoint Services template naming guidelines for specifying a configuration within a template.
         */
        templateName?: string;
        /**
         * The LCID (locale identifier) to use when the site is created; or,
         * the language that the term set label will be added or returned in.
         */
        lcid?: number;
        /** The time zone information to use when the site is created. */
        timeZoneInformation?: any;

        // Official File Operations

        /** The file being submitted. */
        fileToSubmit?: any;
        /** A string representing a collection of RecordsRepositoryProperty objects, each of which represents a document property being submitted with the file. */
        properties?: string;
        /** A string that represents the name of the record routing type. */
        recordRouting?: string;
        /** A string representing the current URL of the file being submitted. */
        sourceUrl?: string;
        /**
         * A string representing the logon name of the user who is submitting the file; or,
         * the display name of the user, for UserGroup operations.
         */
        userName?: string;

        // People Operations

        /** Logon name of the principal. */
        principalKeys?: string[];
        /** Indicates whether to add the principal to a SPUserCollection that is associated with the Web site. */
        addToUserInfoList?: boolean;
        /** Principal logon name. */
        searchText?: string;

        // Permission Operations

        /** A string that contains the name of the list or site. */
        objectName?: string;
        /** A string that contains the name of the site group, the name of the cross-site group, or the user name (DOMAIN\User_Alias) of the user to whom the permission applies. */
        permissionIdentifier?: string;
        /** A string that specifies "user", "group" (cross-site group), or "role" (site group). The user or cross-site group has to be valid, and the site group has to already exist on the site. */
        permissionType?: string;
        /**
         * A 32-bit integer in 0x00000000 format that represents a Microsoft.SharePoint.SPRights value and defines the permission.
         * For available options, see the MSDN documentation on SPRights Enumeration. NOTE: This API is now obsolete.
        */
        permissionMask?: string;
        /** An XML fragment that specifies the permissions to add and that can be passed as a System.Xml.XmlNode object. */
        permissionsInfoXml?: string;
        /** An XML fragment that specifies the permissions to remove and that can be passed as a System.Xml.XmlNode object. */
        memberIdsXml?: string;

        // Search Operations

        /** A string specifying the search query XML. */
        queryXml?: string;
        /** A string that specifies the registration requested in XML. */
        registrationXml?: string;

        // SharePoint Diagnostics Operations

        /** A string containing the location of the file from which the error is being generated. */
        file?: string;
        /** A string containing the line of code from which the error is being generated. */
        line?: string;
        /** A string containing the client name that is experiencing the error. */
        client?: string;
        /** A string containing the call stack information from the generated error. */
        stack?: string;
        /** A string containing a team or product name. */
        team?: string;
        /** A string containing the original file name. */
        originalFile?: string;

        // SiteData Operations

        /** A string that contains the site-relative URL of the folder. */
        strFolderUrl?: string;
        /** A string that contains either the name of the list or the GUID of the list enclosed in curly braces ({}). */
        strListName?: string;
        /** A string that contains an integer specifying the identifier (ID) of the item. */
        strItemId?: string;

        // Sites Operations

        /** Language of the site. */
        language?: number;
        /** Whether or not a language is specified for this site. */
        languageSpecified?: boolean;
        /** Locale of the site. */
        locale?: number;
        /** Whether or not a locale is specified for this site. */
        localeSpecified?: boolean;
        /** Collation locale of the site. */
        collationLocale?: number;
        /** Whether or not a collation locale is specified for this site. */
        collationLocaleSpecified?: boolean;
        /** Whether the site will use unique permissions. */
        uniquePermissions?: boolean;
        /** Whether unique permissions will be used for this site. */
        uniquePermissionsSpecified?: boolean;
        /** Whether the site will be anonymous. */
        anonymous?: boolean;
        /** Whether an anonymity condition is specified for this site. */
        anonymousSpecified?: boolean;
        /** Whether the site will use a presence condition. */
        presence?: boolean;
        /** Whether a presence condition is specified for this site. */
        presenceSpecified?: boolean;
        /** URL of the site. */
        SiteUrl?: string;
        /** A 32-bit integer that specifies the locale identifier (LCID), for example, 1033 in English. */
        LCID?: number;
        /** A template array whose elements provide fields containing information about each template. */
        TemplateList?: any;

        // SocialDataService Operations

        /** The identifier (ID) of the social tag term. */
        termID?: string;
        /** The keyword associated with the social tag. This value must contain fewer than 256 characters. */
        keyword?: string;
        /** The account name of the specified user. */
        userAccountName?: string;
        /** The last modified time of the social comment to be updated or deleted. */
        lastModifiedTime?: string;
        /** The URL from which the social terms are retrieved. This value must be an empty string or in a valid URI format and must contain fewer than 2085 characters. */
        urlFolder?: string;
        /**
         * The analysis data for the social rating.
         * 
         * The documentation claims that analysisDataEntry is required, but in my testing it is not. There also don't seem to be any user settable values in the XML structure.
         */
        analysisDataEntry?: string;

        // Spellcheck Operations

        /** Chunks of text to spell check. */
        chunksToSpell?: string[];
        /** Language to spell check again. */
        declaredLanguage?: number;
        /** Detect language if possible. */
        useLad?: boolean;

        // Taxonomy Operations

        /** TermStore ID of TermSet for term operations. */
        sharedServiceId?: string;
        /** TermSet ID for term operations. */
        termSetId?: string;
        /** XML of new Terms to be added. */
        newTerms?: string;
        /** TermStore ID of parent Term. */
        sspId?: string;
        /** Term IDs must be passed in as GUIDs contained in XML nodes. */
        termIds?: string;
        /** "StartsWith" or "ExactMatch" to specify what type of matching is to be used. */
        matchOption?: string;
        /** Maximum number of Term objects to be returned. */
        resultCollectionSize?: number;
        /** If matchOption is ExactMatch and no match is found and this flag is set to true, a new Term will be added to the TermStore object. */
        addIfNotFound?: boolean;
        /** TermStore IDs for multiple term operations, must be passed in as GUIDs contained in XML nodes. */
        sharedServiceIds?: string;
        /** Collection of TimeStamps which are the last edit time of TermSets stored on the client. */
        clientTimeStamps?: string;
        /** Collection of versions of the server that each TermSet was downloaded from (always 1 unless the client doesn't have the TermSet, then it is 0). */
        clientVersions?: string;

        // Users and Groups Operations

        /** A string that contains the (new) name of the group. */
        groupName?: string;
        /** A System.Xml.XmlNode object that specifies one or more group names. */
        groupNamesXml?: string;
        /** A string that contains the user name (DOMAIN\User_Alias) of the owner for the group. */
        ownerIdentifier?: string;
        /** A string that specifies the type of owner, which can be either "user" or "group". */
        ownerType?: string;
        /** A string that contains the user name (DOMAIN\User_Alias) of the default user for the group. */
        defaultUserLoginName?: string;
        /** A string that contains the name of the role definition. */
        roleName?: string;
        /** A System.Xml.XmlNode object that specifies one or more role definition names. */
        roleNamesXml?: string;
        /** A System.Xml.XmlNode object that contains information about the users. */
        usersInfoXml?: string;
        /** A string that contains the user name (DOMAIN\User_Alias) of the user. */
        userLoginName?: string;
        /** A System.Xml.XmlNode object that contains information about the users. */
        userLoginNamesXml?: string;
        /** A string that contains the e-mail address of the user. */
        userEmail?: string;
        /** A System.Xml.XmlNode object that specifies the e-mail address of the user. */
        emailXml?: string;
        /** A string that contains notes for the user. */
        userNotes?: string;
        /** A string that contains the old name of the group. */
        oldGroupName?: string;

        // User Profile Service Operations

        /** Name of an account, for User Profile Service operations. */
        accountName?: string;
        /** Name of the colleague account, for User Profile Service operations involving colleagues. */
        colleagueAccountName?: string;
        /** Group to be used in the operation. */
        group?: string;
        /** Privacy policy of the user profile data: [Public, Contacts, Organization, Manager, Private]. */
        privacy?: string;
        /** Updated privacy policy of the user profile data: [Public, Contacts, Organization, Manager, Private]. */
        newPrivacy?: string;
        /** User Profile Service isInWorkGroup */
        isInWorkGroup?: boolean;
        /** Membership information, in the form of a MembershipData object. */
        membershipInfo?: string;
        /** Name of the property that has a choice list. */
        propertyName?: string;
        /** GUID of the user profile, for GetUserProfileByGuid */
        guid?: string;
        /** Index of the user profile, for GetUserProfileByIndex */
        index?: number;
        /** Name of the account, for GetUserProfileByName */
        AccountName?: string;
        /** New property name and values, in XML node format. */
        newData?: string;
        /** ID of user profile links to remove. */
        id?: number;
        /** Internal unique identifier. */
        sourceInternal?: string;
        /** DirectoryEntry of the Distribution List (DL) from the Active Directory, or the SPWeb or SPSite object, depending on the MemberGroup. */
        sourceReference?: string;
        /** New data associated with a link or pinned link. */
        data?: string;

        // Versions Operations

        /** A string that identifies the file version. */
        fileVersion?: string;

        // View Operations

        /** A Query element containing the query that determines which records are returned and in what order, and that can be assigned to a System.Xml.XmlNode object. */
        query?: string;
        /**
         * A RowLimit element that specifies the number of items, or rows, to display on a page before paging begins, and that can be assigned to a 
         * System.Xml.XmlNode object. The fragment can include the Paged attribute to specify that the view return list items in pages.
         */
        rowLimit?: string;
        /** A string that specifies whether the view is an HTML view or a Datasheet view. Possible values include "HTML" and "Grid". */
        type?: string;
        /** An XML fragment that contains all the view-level properties as attributes, such as Editor, Hidden, ReadOnly, and Title. */
        viewProperties?: string;
        /** An Aggregations element that specifies the fields to aggregate and that can be assigned to a System.Xml.XmlNode object. */
        aggregations?: string;
        /** A Formats element that defines the grid formatting for columns and that can be assigned to a System.Xml.XmlNode object. */
        formats?: string;
        /** A Toolbar element that sets the HTML used to render the toolbar in a view and that can be assigned to a System.Xml.XmlNode object. */
        toolbar?: string;
        /** A ViewHeader element that sets the HTML used to render the header of a view and that can be assigned to a System.Xml.XmlNode object. */
        viewHeader?: string;
        /** A ViewBody element that sets the HTML used to render the body of a view and that can be assigned to a System.Xml.XmlNode object. */
        viewBody?: string;
        /** A ViewFooter element that sets the HTML used to render the footer of a view and that can be assigned to a System.Xml.XmlNode object. */
        viewFooter?: string;
        /** A ViewEmpty element that contains the HTML used to render the page if the query returns no items and that can be assigned to a System.Xml.XmlNode object. */
        viewEmpty?: string;
        /** A RowLimitExceeded element that specifies alternate rendering for when the specified row limit is exceeded and that can be assigned to a System.Xml.XmlNode object. */
        rowLimitExceeded?: string;

        // Web Part Pages Operations

        /** A string containing the XML of the Web Part. */
        webPartXml?: string;
        /** A Storage value indicating how the Web Part was stored: [None | Personal | Shared]. */
        storageKey?: string;
        /** ID of the zone to add the Web Part. */
        zoneId?: string;
        /** Index of the zone to add the Web Part. */
        zoneIndex?: number;
        /** The name of the Web Part Page. */
        documentName?: string;
        /** true to allow saving the Web Part as a different type; otherwise, false. */
        allowTypeChange?: boolean;

        // Webs Operations

        /** URL of the file for GetCustomizedPageStatus. */
        fileUrl?: string;
        /** URL of the object for GetObjectIdFromUrl. */
        objectUrl?: string;
        /** URL of the page for WebUrlFromPageUrl. */
        pageURL?: string;

        // Workflow Operations

        /** The URL location of an item on which a workflow is being run. */
        item?: string;
        /** Unique identifier of the assigned task. */
        todoId?: string;
        /** Globally unique identifier (GUID) of the assigned task list containing the task. */
        todoListId?: string;
        /** Task data for conversion into a hash table. */
        taskData?: string;
        /** Unique identifier of a task. */
        taskId?: string;
        /** Globally unique identifier (GUID) of a task list containing the task. */
        listId?: string;
        /** Globally unique identifier (GUID) of a template. */
        templateId?: string;
        /** The initiation form data. */
        workflowParameters?: string;
    }

    interface SPServices {
        /**
         * With this defaults function, you can set the defaults for the remainder of the page life. 
         * This can be useful if you'd like to make many calls into the library for a single list or site.
         */
        defaults: SPServicesOptions;

        /**
         * Returns the current version of SPServices as a string, e.g., "0.7.2" 
         */
        Version(): string;

        /**
         * This is the core function of the library, which you can use to make Ajax calls to the SharePoint Web Services. 
         * 
         * Note: As of version 2013.01, all calls return a jQuery deferred object aka a promise.
         */
        (options: SPServicesOptions): JQueryXHR;

        // region Value Added Functions

        /**
         * The SPArrangeChoices rearranges radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate. 
         * If the column has "Allow 'Fill-in' choices:" set to 'Yes', the fill-in option will always remain at the bottom of the controls.
         */
        SPArrangeChoices(options: {
            /** 
             * [Optional] If specified, this list will be used to look up the column's attributes. 
             * By default, this is set at runtime to the list name for the current form's context based on the form's URL. 
             * You will not generally need to specify this value.
             */
            listName?: string;
            /** The DisplayName of the Choice column in the form. This function works with both radio buttons and checkboxes. */
            columnName: string;
            /** The maximum number of choices to show per row. */
            perRow: number;
            /** [Optional] If true, randomize the order of the options. */
            randomize?: boolean;
        }): void;

        /**
         * The SPAutocomplete function lets you provide values for a single line of text column from values in a SharePoint list. 
         * The function is highly configurable and can enhance the user experience with forms.
         */
        SPAutocomplete(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the sourceList. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            WebURL?: string;
            /**
             * The name or GUID of the list which contains the available values. 
             * If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the WebURL if the list is in another site.
             */
            sourceList: string;
            /** The StaticName of the source column in sourceList */
            sourceColumn: string;
            /** The DisplayName of the column in the form */
            columnName: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify an additional filter on the relationshipList. 
             * The additional filter will be ANDed with the existing CAML which is checking for matching items based on the parentColumn selection. 
             * Bacause it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML fragment such as: 
             * 
             * @example
             * CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
             */
            CAMLQuery?: string;
            /**
             * [Optional] This option can be used to specify additional options for retrieval from the sourceList. 
             * See the MSDN documentation for GetListItems for the syntax.
             */
            CAMLQueryOptions?: string;
            /**
             * [Optional] This option allows you to specify how values should be matched. 
             * The available values are [BeginsWith, Contains] and the default is "BeginsWith".
             */
            filterType?: string;
            /** [Optional] Wait until this number of characters has been typed before attempting any actions. The default is 0. */
            numChars?: number;
            /** [Optional] If set to true, the function ignores case, if false it looks for an exact match. The default is false. */
            ignoreCase?: boolean;
            /**
             * [Optional] When a matching value is shown, the matching characters are wrapped in a <span>. 
             * If highlightClass is specified, that class is applied to the span. An example might be:
             * 
             * @example
             * highlightClass: "ms-bold"
             */
            highlightClass?: string;
            /** [Optional] If set to true, only unique values returned from sourceList will be shown. The default is false. */
            uniqueVals?: boolean;
            /** [Optional] Speed at which the div should slide down when values match (milliseconds or [fast, slow]). The default is "fast". */
            slideDownSpeed?: number | string;
            /**
             * [DEPRECATED] If present, this markup will be shown while Web Service processing is occurring. 
             * The default is "<img src='_layouts/images/REFRESH.GIF'/>". 
             * Because this library requires no server-side deployment, I wanted to use one of the out of the box images. 
             * You can substitute whatever image or text you would like in HTML format.
             * 
             * Note: This option has been deprecated as of v0.6.0
             */
            processingIndicator?: string;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        /**
         * This is the first function we implemented which allows you to take advantage of the Web Services calls in a meaningful way. 
         * It allows you to easily set up cascading dropdowns on a list form. 
         *
         * (What we mean by cascading dropdowns is the situation where the available options for one column depend on the value you select in another 
         * column.)
         */
        SPCascadeDropdowns(options: {
            /** [Optional] The name of the Web (site) which contains the relationships list */
            relationshipWebURL?: string;
            /** The name of the list which contains the parent/child relationships */
            relationshipList: string;
            /** The internal name of the parent column in the relationship list */
            relationshipListParentColumn: string;
            /** The internal name of the child column in the relationship list */
            relationshipListChildColumn: string;
            /** [Optional] If specified, sort the options in the dropdown by this column, 
             *  otherwise the options are sorted by relationshipListChildColumn
             */
            relationshipListSortColumn?: string;
            /** The display name of the parent column in the form */
            parentColumn: string;
            /** The display name of the child column in the form */
            childColumn: string;
            /** The list the form is working with. This is useful if the form is not in the list context. 
             * 
             *  will try to default to: $().SPServices.SPListNameFromUrl()
             */
            listName?: string;
            /** [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList */
            CAMLQuery?: string;
            /** [Optional] For power users, ability to specify Query Options */
            CAMLQueryOptions?: string;
            /** [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. Original value "Choose {0}..." */
            promptText?: string;
            /** [Optional] Text to use for the (None) selection. Provided for non-English language support. */
            noneText?: string;
            /** [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown */
            simpleChild?: boolean;
            /** [Optional] If set to true and there is only a single child option, select it */
            selectSingleOption?: boolean;
            /** By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead. */
            matchOnId?: boolean;
            /** Function to call on completion of rendering the change. */
            completefunc?: (xData: JQueryXHR, status: string) => void;
            /** If true, show error messages; if false, run silent */
            debug?: boolean;
        }): void;

        /**
         * The SPComplexToSimpleDropdown function lets you convert a "complex" dropdown rendered by SharePoint in a form to a "simple" dropdown. 
         * It can work in conjunction with SPCascadeDropdowns; call SPComplexToSimpleDropdown first.
         * 
         * While this function doesn't use the SharePoint Web Services directly, it can be used with other SPServices functions which do.
         */
        SPComplexToSimpleDropdown(options: {
            /** The DisplayName of the column in the form */
            columnName: string;
            /**
             * [Optional] If specified, the completefunc will be called each time there is a change to columnName. Potential uses for the 
             * completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways:
             * 
             * @example
             * completefunc: function() {
             *   ...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
             */
            completefunc?: () => void;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        /**
         * SPDisplayRelatedInfo is a function in the jQuery Library for SharePoint Web Services that lets you display information which is related 
         * to the selection in a dropdown. This can really bring your forms to life for users: rather than just selecting bland text values, you can 
         * show them images and links that are related to their choices.
         */
        SPDisplayRelatedInfo(options: {
            /** The DisplayName of the column in the form */
            columnName: string;
            /** [Optional] The URL of the Web (site) which contains the relatedList. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs. */
            relatedWebURL?: string;
            /**
             * The name or GUID of the list which contains the related information. 
             * If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the relatedWebURL if the list is in another site.
             */
            relatedList: string;
            /** The StaticName of the column in the relatedList */
            relatedListColumn: string;
            /** An array of StaticNames of related columns to display */
            relatedColumns: string[];
            /**
             * [Optional] The format to use in displaying the related information. The default is "table". The displayFormat takes one of two options:
             * 
             * * "table" displays the matching items much like a standard List View Web Part would, in a table with column headers
             * * "list" also uses a table, but displays the item(s) in a vertical orientation
             */
            displayFormat?: string;
            /** [Optional] If specified, the CSS class for the table headers. The default is "ms-vh2". */
            headerCSSClass?: string;
            /** [Optional] If specified, the CSS class for the table cells. The default is "ms-vb". */
            rowCSSClass?: string;
            /**
             * [Optional] If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been 
             * entered. The default is 0.
             */
            numChars?: string;
            /**
             * [Optional] If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or 
             * "BeginsWith". The default is "Eq". 
             */
            matchType?: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify an additional filter on the relationshipList. 
             * The additional filter will be ANDed with the existing CAML which is checking for matching items based on the parentColumn selection. 
             * Because it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML fragment such as: 
             * 
             * @example
             * CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
             */
            CAMLQuery?: string;
            /**
             * [Optional] By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead. 
             * The default value is false.
             */
            matchOnId?: boolean;
            /**
             * [Optional] If specified, the completefunc will be called each time there is a change to parentColumn. Potential uses for the 
             * completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways:
             * 
             * @example
             * completefunc: function() {
             *   ...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
             */
            completefunc?: () => void;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        /**
         * The SPFilterDropdown function allows you to filter the values available in a Lookup column using CAML against the Lookup column's source 
         * list. This function works with all three types of "dropdown": <20 options (simple select), 20+ options (complex select), and multi-select.
         */
        SPFilterDropdown(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the relationshipList. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            relationshipWebURL?: string;
            /**
             * The name or GUID of the list which contains the parent/child relationships. 
             * If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the relationshipWebURL if the list is in another site. 
             */
            relationshipList: string;
            /** The StaticName of the column in the relationshipList which is used for the lookup column */
            relationshipListColumn: string;
            /** [Optional] If specified, sort the options in the dropdown by this column otherwise the options are sorted by relationshipListColumn */
            relationshipListSortColumn?: string;
            /** [Optional] Allows sorting either ascending (true) or descending (false). The default is true (ascending). */
            relationshipListSortAscending?: boolean;
            /** The DisplayName of the column in the form */
            columnName: string;
            /**
             * [Optional] By default, set to the list name for the current context based on the URL. 
             * If your form is outside the context of the list, then you can specify the listName yourself.
             */
            listName?: string;
            /**
             * [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. The default value is "".
             * 
             * NOTE: I discourage the use of this option. Yes, I put it into the function, but if the user doesn't make a choice, they get an ugly 
             * error because SharePoint doesn't understand it as an option. I've left in in for backward compatibility.
             * 
             * Deprecated in v0.7.1.
             */
            promptText?: string;
            /** [Optional] Text to use for the (None) selection. Provided for non-English language support. The default value is "(None)". */
            noneText?: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify the filter on the relationshipList. 
             * The additional filter will be ANDed with the existing CAML which is checking for matching items based on the parentColumn selection. 
             * The CAMLQuery should contain a CAML fragment such as: 
             * 
             * @example
             * CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
             */
            CAMLQuery?: string;
            /**
             * [Optional] This option can be used to specify additional options for retrieval from the sourceList. See the MSDN documentation for 
             * GetListItems for the syntax.
             */
            CAMLQueryOptions?: string;
            /**
             * [Optional] If specified, the completefunc will be called upon completion of the filtering. 
             * Uses for the completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways: 
             * 
             * @example
             * completefunc: function() {
             * 	...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
             */
            completefunc?: () => void;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        /**
         * The SPFindMMSPicker function helps you find a Managed Metadata Service (MMS) Picker's values.
         */
        SPFindMMSPicker(options: {
            /** The DisplayName of the People Picker in the form. */
            MMSDisplayName: string;
        }): { guid: string, value: string }[];

        /**
         * SPFindPeoplePicker allows you to get or set the values for People Pickers. When you call it with the DisplayName of a People Picker, the 
         * function returns an object which contains information about the People Picker's structure and current value.
         */
        SPFindPeoplePicker(options: {
            /** The DisplayName of the People Picker in the form. */
            peoplePickerDisplayName: string;
            /** [Optional] If you'd like to set the value of the People Picker, optionally provide it here. */
            valueToSet?: string;
            /**
             * [Optional] If you'd like to "click" on the Check Names icon to resolve the name in the People Picker, set checkNames to true. The 
             * default value is true.
             */
            checkNames?: boolean;
        }): {
                /**
                 * This is reference to the table row which contains the People Picker. This can be useful if you want to hide or show the row 
                 * conditionally based on some user action.
                 */
                row: any;
                /** The full contents of the div[name='upLevelDiv'] element. */
                contents: any;
                /**
                 * The current value set in the People Picker. If you pass a value into the function, it will be set and returned in this string. 
                 * If there are multiple people specified, they are returned separated by semi-colons, as in the People Picker display. 
                 */
                currentValue: string;
                /**
                 * This is a reference to the checkNames img tag in the People Picker. It's used by the function to initiate resolution of a Person 
                 * or Group value by firing the click event on it. Once you have this reference, you can do the same.
                 */
                checkNames: any;
                /**
                 * If the browser is Internet Explorer, then this object will contain the full dictionary entry values for each user or group in the 
                 * People Picker value. If the browser is not IE, then the function calls GetUserInfo to retrieve similar values to mirror the 
                 * dictionary entry structure.
                 */
                dictionaryEntries: any;
            };

        /**
         * The SPLookupAddNew function allows you to provide a link in forms for Lookup columns so that the user can add new values to the Lookup 
         * list easily. It is based on a blog post by Waldek Mastykarz.
         */
        SPLookupAddNew(options: {
            /** The DisplayName of the Lookup column in the form. */
            lookupColumn: string;
            /**
             * [Optional] The text to display as a link to add a new value to the lookup list. If you include the {0} placeholder, it will be 
             * replaced with the value of looukupColumn. The default value is "Add new {0}".
             */
            promptText?: string;
            /** [Optional] If true, the link will open in a new window without passing the Source. The default value is false. */
            newWindow?: boolean;
            /**
             * [Optional] If ContentTypeID is specified, it will be passed on the Query String to the NewForm for the Lookup column's list. 
             * e.g., "/SiteName/NewForm.aspx?ContentTypeID=0x0100FD8C376B70E78A46974ECF1B10F8D7AD" 
             */
            ContentTypeID?: string;
            /**
             * [Optional] If specified, the completefunc will be called upon successful completion of the call to SPLookupAddNew. Potential uses for 
             * the completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways:
             * 
             * @example
             * completefunc: function() {
             * 	...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
            */
            completefunc?: () => void;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        /**
         * This function allows you to redirect to another page from a new item form with the new item's ID. This allows chaining of forms from item 
         * creation onward.
         */
        SPRedirectWithID(options: {
            /**
             * The page for the redirect. Upon save of the form, the page will refresh briefly and then be redirected to redirectUrl with the new 
             * item's ID on the Query String.
             */
            redirectUrl: string;
            /**
             * [Optional] In some cases, you may want to pass the newly created item's ID with a different parameter name than ID. Specify that 
             * name here, if needed. The default is ID.
             */
            qsParamName?: string;
        }): void;

        /**
         * Checks to see if the value for a column on the form is unique in the list. The idea for this function came from testing 
         * $().SPServices.SPCascadeDropdowns. When using lists like relational tables, you want to be sure that at least one column contains unique 
         * values. Currently, the function works only with Single line of text columns, and will generally be used with the Title column. There is 
         * considerable flexibility in the use of this function based on the combination of options and the ability to change the messages and their 
         * formatting.
         * 
         * Note that this function will work on the NewForm and EditForm for a list, but not in the datasheet view. The intent is to put some rigor 
         * around the normal item creation process. Because this is a client-side function, it does not pervasively enforce the uniqueness rule.
         */
        SPRequireUnique(options?: {
            /** [Optional] The StaticName of the column on the form. The default value is "Title". */
            columnStaticName?: string;
            /**
             * [Optional] This indicates what should happen if the user enters a value which already exists. The default is 0 (warn).
             * 
             * * 0 = warn means that a warning message will be placed on the screen, but the user can save the item
             * * 1 = prevent means that a warning message will be placed on the screen and the user will be prevented from saving the item (the OK 
             *   button will be disabled until a unique value is entered)
             */
            duplicateAction?: number;
            /** [Optional] If set to true, the function ignores case, if false it looks for an exact match. The default is false. */
            ignoreCase?: boolean;
            /**
             * [Optional] The initial message to display after setup. The message is displayed below in input control, but above the column 
             * description, if any. The default value is "This value must be unique."
             */
            initMsg?: string;
            /** [Optional] The CSS class for the initial message specified in initMsg. The default value is "ms-vb". */
            initMsgCSSClass?: string;
            /**
             * [Optional] The error message to display if the value is not unique. The message is displayed below in input control, but above the 
             * column description, if any. (This is the same location as the initMsg.) The default value is "This value is not unique."
             */
            errMsg?: string;
            /** [Optional] The CSS class for the error message specified in errMsg. The default value is "ms-formvalidation". */
            errMsgCSSClass?: string;
            /**
             * [Optional] If true, the function will show the other items in the list which are duplicates as links so that one can easily research 
             * what they are and potentially clean them up.
             */
            showDupes?: boolean;
            /**
             * [Optional] If specified, the completefunc will be called upon successful completion of the call to SPRequireUnique. Potential uses for 
             * the completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways: 
             * 
             * @example
             * completefunc: function() {
             * 	...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
             */
            completefunc?: () => void;
        }): void;

        /**
         * The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically based on the values they 
         * contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
         */
        SPSetMultiSelectSizes(options: {
            /** The DisplayName of the multi-select column in the form. */
            multiSelectColumn: string;
            /**
             * [Optional] If present, the width of the multi-select boxes will not be set narrower than this number of pixels. If either minWidth 
             * or maxWidth is greater than zero, then they provide the lower and upper bounds (in pixels) for the width of the multi-select boxes.
             */
            minWidth?: number;
            /**
             * [Optional] If present, the width of the multi-select boxes will not be set wider than this number of pixels. If either minWidth or 
             * maxWidth is greater than zero, then they provide the lower and upper bounds (in pixels) for the width of the multi-select boxes.
             */
            maxWidth?: number;
        }): void;

        /**
         * SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.
         */
        SPUpdateMultipleListItems(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the list. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            webURL?: string;
            /**
             * The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.
             */
            listName: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify the filter on the list. CAMLQuery here should contain valid CAML such as:
             * 
             * @example
             * CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq></Where></Query>"
             */
            CAMLQuery?: string;
            /** [Optional] The batchCmd option specifies what the action should be. The choices are "Update" or "Delete". "Update" is the default. */
            batchCmd?: string;
            /** [Optional] Fieldname / Fieldvalue pairs for UpdateListItems */
            valuepairs?: [string, any][];
            /**
             * [Optional] If specified, the completefunc will be called each time there is a change to parentColumn. Potential uses for the 
             * completefunc: consistent default formatting overrides, additional lookup customizations, image manipulations, etc. 
             * You can pass your completefunc in either of these two ways:
             * 
             * @example
             * completefunc: function() {
             * 	...do something...
             * },
             * 
             * or
             * 
             * @example
             * completefunc: doSomething, // Where doSomething is the name of your function
             */
            completefunc?: () => void;
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): void;

        // endregion

        // region Utilities Functions

        /**
         * This utility function converts a JavaScript date object to the ISO 8601 format required by SharePoint to update list items.
         * 
         * @param dateToConvert [Optional] The JavaScript date we'd like to convert. If no date is passed, the function returns the current date/time.
         * @param dateOffset [Optional] The time zone offset requested. Default is EST.
         */
        SPConvertDateToISO(dateToConvert?: Date, dateOffset?: string): string;

        /**
         * This function displays the XMLHttpResult from an AJAX call formatted for easy debugging. You can call it manually as part of your 
         * completefunc. The function returns an HTML string which contains a parsed version of the XMLHttpResult object.
         */
        SPDebugXMLHttpResult(options: {
            /** An XMLHttpResult object returned from an AJAX call */
            node: Document;
        }): string;

        /**
         * SPDropdownCtl was previously a private function I used in SPServices to find dropdown controls in the DOM. Because of the changes to the 
         * way title values are set in Office365 circa Jan 2014, it made sense to expose this as a public function. By making this a public function, 
         * it is my hope that it will help to smooth over any future changes to the way SharePoint renders this type of control in the DOM. 
         *
         * The function finds a dropdown in a form based on the name of the column (either the DisplayName or the StaticName) and returns an object 
         * you can use in your own functions.
         */
        SPDropdownCtl(options: {
            /** The DisplayName of the parent column in the form */
            displayName: string;
        }): { [key: string]: any };

        /**
         * This utility function, which is also publicly available, simply returns the current site's URL. It mirrors the functionality of the 
         * WebUrlFromPageUrl operation.
         */
        SPGetCurrentSite(): string;

        /**
         * This utility function, which is also publicly available, returns information about the current user.
         */
        SPGetCurrentUser(options?: {
            /** [Optional] URL of the target Site Collection. If not specified, the current Web is used. */
            webURL?: string;
            /**
             * [Optional] You can specify which value from userdisp.aspx you'd like returned with this option. The default is the user's account 
             * (Name in the Field Internal Name column below). You can specify any of the Field Internal Names for option fieldName. The fields 
             * listed below are the default out-of-the-box fields. If you've got custom fields which are exposed on the userdisp.aspx page, then you 
             * should be able to retrieve them with this function as well.
             *
             * Note that, as of v0.6.1, you can also request the ID of the user by specifying fieldName: "ID".
             */
            fieldName?: string;
            /**
             * [Optional] Added in v0.7.2 to allow requesting multiple column values. 
             * The column names can be passed in as an array, such as ["ID", "Last Name"]
             */
            fieldNames?: string[];
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): string | { [key: string]: any };

        /**
         * This function returns the DisplayName for a column based on the StaticName. This simple utility function, which utilizes the GetList 
         * operation of the Lists Web Service, seemed useful to expose as a public function.
         */
        SPGetDisplayFromStatic(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the listName. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            webURL?: string;
            /**
             * The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.
             */
            listName: string;
            /** [Optional] The StaticName of the column. */
            columnStaticName?: string;
            /**
             * [Optional] The StaticNames of the columns in an array. This option was added in v0.7.2 to allow multiple column conversions at the 
             * same time.
             */
            columnStaticNames?: string[];
        }): string | string[];

        /**
         * Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships. 
         * This function was built for use by the $().SPServices.SPRedirectWithID function, but is also useful in other circumstances.
         */
        SPGetLastItemId(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the listName. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            webURL?: string;
            /**
             * The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the relationshipWebURL if the list is in another site.
             */
            listName: string;
            /** [Optional] The account for the user in DOMAIN\username format. If not specified, the current user is used. */
            userAccount?: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify an additional filter on the relationshipList. 
             * The additional filter will be ANDed with the existing CAML which is checking for matching items based on the parentColumn selection. 
             * Because it is combined with the CAML required to make the function work, CAMLQuery here should contain a CAML fragment such as:
             * 
             * @example
             * CAMLQuery: "<Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>"
             */
            CAMLQuery?: string;
        }): string;

        /**
         * SPGetListItemsJson combines several SPServices capabilities into one powerful function. By calling GetListItemChangesSinceToken, parsing 
         * the list schema, and passing the resulting mapping and data to SPXmlToJson automagically, we have a one-stop shop for retrieving 
         * SharePoint list data in JSON format. No manual mapping required!
         */
        SPGetListItemsJson(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the list. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            webURL?: string;
            /**
             * The name or GUID of the list which contains the parent/child relationships. 
             * If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.
             */
            listName: string;
            /**
             * [Optional] The CAMLQuery option allows you to specify the filter on the list. CAMLQuery here should contain valid CAML such as:
             * 
             * @example
             * CAMLQuery: "<Query><Where><Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq></Where></Query>"
             */
            CAMLQuery?: string;
            /**
             * [Optional] If specified, only the columns in CAMLViewFields plus some other required columns are retrieved. 
             * This can be very important if your list has a lot of columns, as it can reduce the amount of data returned from the call. 
             * See the MSDN documentation for GetListItemsChangesSinceToken for the syntax.
             */
            CAMLViewFields?: string;
            /**
             * [Optional] This option can be used to limit the number of items retrieved from the list. 
             * See the MSDN documentation for GetListItemsChangesSinceToken for the syntax.
             */
            CAMLRowLimit?: string;
            /**
             * [Optional] This option can be used to specify additional options for retrieval from the list. 
             * See the MSDN documentation for GetListItemsChangesSinceToken for the syntax.
             */
            CAMLQueryOptions?: string;
            /**
             * [Optional] GetListItemChangesSinceToken passes back a changeToken on each call. 
             * If you are making calls after the initial one and pass in the changeToken value, only the changes since that token will be retrieved. 
             * See the MSDN documentation for GetListItemsChangesSinceToken for the syntax.
             */
            changeToken?: string;
            /**
             * [Optional] This option allows you to pass in an additional filter for the request. It should be a valid CAML clause. 
             * See the MSDN documentation for GetListItemsChangesSinceToken for the syntax.
             */
            contains?: string;
            /**
             * [Optional] If you have created your own mapping, as specified in SPXmltoJson, pass it as this option. 
             * If present, the function will use your mapping and ignore the list schema returned by GetListItemChangesSinceToken.
             */
            mapping?: { [key: string]: any };
            /** 
             * [Optional] If you want the function to use the list schema returned by GetListItemChangesSinceToken for the majority of the columns 
             * but you would like to specify your own mapping for some of the columns, pass those mappings in using the mappingOverrides option.
             * 
             * As an example, this mappingOverride would only change the way the two specified columns are converted by the SPXmlToJson function 
             * internally in the call (the JSON objectType is not available from the list schema):
             * 
             * @example
             * mappingOverrides: {
             *     ows_FiscalPeriodData: {
             *         mappedName: "FiscalPeriodData",
             *         objectType: "JSON"
             *     },
             *     ows_FiscalPeriodNames: {
             *         mappedName: "FiscalPeriodNames",
             *         objectType: "JSON"
             *     }
             * }
             */
            mappingOverrides?: { [key: string]: any };
            /**
             * [Optional] Setting debug: true indicates that you would like to receive messages if anything obvious is wrong with the function call, 
             * like using a column name which doesn't exist. I call this debug mode.
             */
            debug?: boolean;
        }): {
                /**
                 * The changeToken as returned by GetListItemChangesSinceToken. This token can be passed to subsequent calls to the function. 
                 * The various parts of the changeToken have specific meaning, but you should treat it as an immutable string.
                 */
                changeToken: string;
                /**
                 * The mapping used to parse the data into JSON. This mapping will include any specific overrides you specified as well as the 
                 * automatically created mappings. You can pass this mapping into the function on subsequent calls to reduce overhead, though the 
                 * function saves the mapping in a local data store for reuse.
                 */
                mapping: { [key: string]: any };
                /**
                 * The main reason we make the call, the data property is an object containing all of the retrieved data in JSON format, 
                 * as specified in SPXmlToJson.
                 */
                data: { [key: string]: any };
                /**
                 * If this is call 2-n to the function, deletedIds will contain an array of IDs for list items which have been deleted since the 
                 * prior call.
                 */
                deletedIds: string[];
            };

        /**
         * The SPGetQueryString function parses out the parameters on the Query String and makes them available for further use. This function was 
         * previously included, but was a private function.
         */
        SPGetQueryString(): string;

        /**
         * This function returns the StaticName for a column based on the DisplayName. This simple utility function, which utilizes the GetList 
         * operation of the Lists Web Service, seemed useful to expose as a public function.
         */
        SPGetStaticFromDisplay(options: {
            /**
             * [Optional] The URL of the Web (site) which contains the listName. If not specified, the current site is used. 
             * Examples would be: "/", "/Accounting", "/Departments/HR", etc. Note: It's always best to use relative URLs.
             */
            webURL?: string;
            /**
             * The name or GUID of the list. If you choose to use the GUID, it should look like: "{E73FEA09-CF8F-4B30-88C7-6FA996EE1706}". 
             * Note also that if you use the GUID, you do not need to specify the webURL if the list is in another site.
             */
            listName: string;
            /** [Optional] The DisplayName of the column. */
            columnDisplayName?: string;
            /**
             * [Optional] The DisplayNames of the columns in an array. This option was added in v0.7.2 to allow multiple column conversions at the 
             * same time.
             */
            columnDisplayNames?: string[];
        }): string | string[];

        /**
         * This utility function, which is also publicly available, returns the current list's GUID if called in the context of a list, meaning that 
         * the URL is within the list, like /DocLib or /Lists/ListName.
         * 
         * @param listName [Optional] Option to allow passing in a URL to the function rather than simply picking up the current context. This will 
         * help where custom list forms are stored outside the list context.
         */
        SPListNameFromUrl(listName?: string): string;

        /**
         * The SPScriptAudit function allows you to run an auditing report showing where scripting is in use in a site.
         */
        SPScriptAudit(options?: {
            /**
             * [Optional] The site on which to run the audit. If no site is specified, the current site is used. 
             * Examples would be: "/Departments", "/Departments/HR", "/Sites", etc.
             */
            webURL?: string;
            /** [Optional] The name of a specific list to audit. If not present, all lists in the site are audited. */
            listName?: string;
            /**
             * [Optional] The ID of an HTML element into which to insert the report. 
             * If you would like to see the report within this div: <div id="MyOutput"></div>, then the value would be "MyOutput".
             */
            outputId?: string;
            /** [Optional] Audit the form pages if true. The default is true. */
            auditForms?: boolean;
            /** [Optional] Audit the view pages if true. The default is true. */
            auditViews?: boolean;
            /** [Optional] Audit the Pages Document Library if true. The default is true. */
            auditPages?: boolean;
            /** [Optional] The Pages Document Library, if desired. The default is "Pages". */
            auditPagesListName?: string;
            /** [Optional] true if you would like to see the output for hidden lists; false if not. The default is false. */
            showHiddenLists?: boolean;
            /**
             * [Optional] true if you would like to see the output for lists with no scripts (effectively "verbose"); false if not. The default is 
             * false.
             */
            showNoScript?: boolean;
            /** [Optional] true if you would like to see the included script files on each page; false if not. The default is true. */
            showSrc?: boolean;
        }): void;

        // endregion
    }
}

interface JQuery {
    /**
     * SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. 
     *
     * It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. 
     * It works entirely client side and requires no server install.
     */
    SPServices: JQuerySPServices.SPServices;

    /**
     * Can be used to find namespaced elements in returned XML, such as rs:data or z:row from GetListItems. 
     * 
     * My hope is that by having this function in place, SPServices will be a bit more future-proof against changes made by the jQuery team. 
     * The function is only required if you want your script to work reliably cross-browser, as Internet Explorer will reliably find the elements 
     * with the simpler .find("z:row") syntax.
     * 
     * @param nodeName An XML node name, such as rs:data or z:row.
     */
    SPFilterNode(nodeName: string): JQuery;

    /**
     * SPXmlToJson is a function to convert XML data into JSON for client-side processing.
     */
    SPXmlToJson(options?: {
        /**
         * An array of columns to return in the JSON. While you should generally limit the values you request in your Web Services calls where you 
         * can, in some cases you won't have that capability. This option alows you to create "lean" JSON by only including the attributes you need. 
         * You can also rename the attributes for better compatibility with other jQuery plugins, for instance. Where it makes sense, the different 
         * column types (SPFieldType) are returned as analogous JavaScript objects. If not specified in the mapping, values are returned as strings.
         *
         * The default value for mapping is {} (no mappings).
         */
        mapping?: { [key: string]: any };
        /** If true, return all attributes, regardless whether they are in the mapping. The default is false. */
        includeAllAttrs?: boolean;
        /** Specifically for GetListItems, if true, the leading "ows_" will be stripped from the field name. */
        removeOws?: boolean;
        /** If true, empty ("") values will not be returned. The default is false. Added in 2014.01. */
        sparse?: boolean;
    }): { [key: string]: any };
}

