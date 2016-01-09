
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
        valuepairs?: Array<any>;

        // As of v0.7.1, removed all options which were assigned an empty string ("") 

        /** Array of destination URLs for copy operations */
        DestinationUrls?: Array<any>;
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
         * Note: As of version 2013.01, all calls return a  jQuery deferred object aka a promise.
         */
        (options: SPServicesOptions): JQueryXHR;

        /**
         * This is the first function we implemented which allows you to take advantage of the Web Services calls in a meaningful way. 
         * It allows you to easily set up cascading dropdowns on a list form. 
         *
         * (What we mean by cascading dropdowns is the situation where the available options for one column depend on the value you select in another column.)
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
            /** If true, show error messages;if false, run silent */
            debug?: boolean;
        }): void;
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

}

