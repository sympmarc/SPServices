SPServices [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/) 
==========
[![bitHound Score](https://www.bithound.io/github/sympmarc/SPServices/badges/score.svg)](https://www.bithound.io/github/sympmarc/SPServices) [![Code Climate](https://codeclimate.com/github/sympmarc/SPServices/badges/gpa.svg)](https://codeclimate.com/github/sympmarc/SPServices)

SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.

SPServices is primarily hosted on Codeplex, with this repository mirroring most of the downloads there.

##This is a work in progress. It's a port of SPServices from [Codeplex](https://spservices.codeplex.com/) to GitHub, with a rewrite along the way.##
_*Until otherwise announced, this is not a fully functional version of SPServices. When complete, this version will be:*_
* SPServices 2.0 
* AMD-enabled using [RequireJS](http://requirejs.org/)
* Converted from a monolithic file to modules
* Enabled to take advantage of SharePoint's REST APIs - where available - for internal calls to get list data in the value-added functions

### Progress Report
* 2015-12-09 I have begun adding modules back in to build up a "full build" of existing SPService functionality.
* 2015-12-05 Initial tests using QUnit are in place. Instructions below.
* 2015-12-01 The monolithic SPServices file is not broken out into modules, one per major function.

For full documentation, please visit http://spservices.codeplex.com/documentation

Contribute
-----------
Would you like to contribute to the next generation of SPServices? Do you have ideas for functionality that you wish was in SPServices? Please let me know by adding questions or comments in the [Issues](https://github.com/sympmarc/SPServices/issues) here.

Development
-----------

### Setup Environment

1.  Fork this repository and checkout the source
2.  From the root of the project, run:

        npm install

    This will install all of the necessary dependencies


### Run a build

1.  run:

        grunt

    This will build SPServices and output the results to the `build` folder. During development, these are the files that should be used for testing (i.e. copy to SharePoint and link to them).

### Develop and Watch

A `grunt` target called `watch` is available for linting code as files are changed and saved. To use it, simply run:

    grunt watch

This will start a job that watches the sources files as they are saved and runs the linting tool to ensure they are clean of issues.


### Deploy to a SharePoint Folder

For development, just copy the entire `src` and `build` folders (after running `grunt`) to a SharePoint Document Library folder and click on the `src/dev.aspx` file. SPServices will be loaded using AMD (require.js). The page will display multiple ways to load SPServices (via requireJS, jQuery built library or jQuery built library minimized).

A build target has been created to facilitate this task - called `deploy`. In order to use it, you must first set the `deployLocation` in the `me.build.json` file that is automatically created at the root of this project when grunt is run.  The deploy location could be a locally mapped drive to the desired SharePoint folder or a network path. Example for an O365 tennat:

    //YourTenantNameHere.sharepoint.com@SSL/DavWWWRoot/sites/dev/Shared Documents/SPServices-dev


>   Note: When using a network path, you may receive an error on first attempt to `deploy`. This is likely because Windows is unable to authenticate with the SharePoint server. To resolve the issue, use the network path in Windows Explorer to access it directly and enter the appropriate credentials if prompted.

To deploy using grunt, run:

    grunt deploy

### Unit Tests

Unit test cases are written under the test folder using [QUnit](http://qunitjs.com/). Tests will run in the dev.aspx above.

Currently the tests require a real SharePoint server. The tests will create and delete some test data to validate basic core calls. 
