SPServices
==========
[![Code Climate](https://codeclimate.com/github/sympmarc/SPServices/badges/gpa.svg)](https://codeclimate.com/github/sympmarc/SPServices)
[![CDNJS](https://img.shields.io/cdnjs/v/jquery.SPServices.svg?style=plastic)](https://cdnjs.com/libraries/jquery.SPServices)

SPServices is a jQuery library which abstracts SharePoint's Web Services and makes them easier to use. It also includes functions which use the various Web Service operations to provide more useful (and cool) capabilities. It works entirely client side and requires no server install.

SPServices is primarily hosted on Codeplex, with this repository mirroring most of the downloads there.

## This is a work in progress. It's a port of SPServices from [Codeplex](https://spservices.codeplex.com/) to GitHub, with a rewrite along the way.
_*Until otherwise announced, this is not a fully functional version of SPServices. When complete, this version will be:*_
* SPServices 2.0
* AMD-enabled using [RequireJS](http://requirejs.org/)
* Converted from a monolithic file to modules
* Enabled to take advantage of SharePoint's REST APIs - where available - for internal calls to get list data in the value-added functions

### Progress Report
* 2016-10-12 Great [new home page for SPServices](http://sympmarc.github.io/SPServices/), thanks to @joshmcrty
* 2016-07-10 All modules are in place, most documentation has been migrated over, and building is functional (if simplistic)
* 2015-12-06 Began adding modules back in to build up a "full build" of existing SPService functionality.
* 2015-12-05 Initial tests using QUnit are in place. Instructions below.
* 2015-12-01 The monolithic SPServices file is not broken out into modules, one per major function.
* 2016-01-04 SPServices 2.0 is now building and operational - pre-alpha.
* 2016-03-07 Switched from grunt/requirejs to gulp/webpack.

For full documentation, please visit http://spservices.codeplex.com/documentation

Contribute
-----------
Would you like to contribute to the next generation of SPServices?

* Test the "pre-alpha" builds of SPServices 2.0. If you're familiar enough with the library to drop builds into your test environments, that would be a great help. I've tested using the same lists and pages I always use, but more real-world testing would be good. Report any issues you find using GitHub issues.
* Write some tests. I've started writing tests with QUnit, but I've only scratched the surface. Writing good tests here is difficult, as we have to be sitting on top of SharePoint; in greenfield development, we can test anywhere. You'll find some instructions for how to use the existing tests on the GitHub pages.
* Migrate the documentation from Codeplex to GitHub - Since Codeplex is falling apart, there's no reason to leave the documentation there, either. There are a few dozen pages (I can't actually count the pages on Codeplex easily) of documentation, and it's probably easiest just to move the over to GitHub manually.
* Move the discussions off Codeplex - This one is hardest, I think. IMO, one of the big values to SPServices is the historical discussions about how to use it. But those discussions have covered many other things as well, and I'd hate to lose any of it. I'm not sure how to go about this, so if anyone has some experience moving forums like this, I'm all ears.
* Propose improvements - I ask the community for suggestions all the time, but I don't get a lot of them. If you've solved some gnarly SharePoint UI problem and would be willing to submit your code or just wish that someone would fix the darn _____, then let me know in the GitHub issues. Consider the issues our own UserVoice for SPServices.


Development
-----------

### Prerequisites

1.  nodeJS
2.  gulp


### Setup Environment

1.  Fork this repository and checkout the source
2.  From the root of the project, run:

        npm install

    This will install all of the necessary dependencies


### Run a build

1.  run:

        gulp

    TODO: complete documentation here on what a build will actually do.

### Develop and Watch

A `gulp` target called `watch` is available for linting code as files are changed and saved. To use it, simply run:

    gulp watch

This will start a job that watches the sources files as they are saved and runs the linting tool to ensure they are clean of issues.


### Unit Tests

Unit test cases are written under the test folder using [QUnit](http://qunitjs.com/). Tests will run in the dev.aspx above.

Currently the tests require a real SharePoint server. The tests will create and delete some test data to validate basic core calls.

### Documentation

Documentation is generated using the files in the [`/docs`](/docs) directory of this repo. Pages are written in Markdown with YAML front matter and then converted to HTML for hosting on GitHub pages via the `gh-pages` branch. _The `gh-pages` branch should never need to be directly edited or modified_.

To edit documentation and see a live preview of changes in the browser, run:

```
gulp servedocs
```

This will build the documentation and serve the HTML files using Browsersync. Any changes to the source files in [`/docs`](/docs) will be reloaded in the browser automatically.

When documentation changes are complete:

1.  Stop the `servedocs` task (Ctrl+C or Cmd+C)
2.  Run `gulp docs` to clean the `dist/docs` folder and rebuild it using the latest source files from `/docs`
3.  If ready to deploy to gh-pages, run:

        gulp deploydocs

  This will package everything in the `/dist` folder into a ZIP file, then update the `gh-pages` branch with the ZIP file and all documentation files. Changes may take a few minutes to show up on http://sympmarc.github.io/SPServices.
