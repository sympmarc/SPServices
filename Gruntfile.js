/**
 * Created by Marc on 4/26/2015.
 */
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    "use strict";

    var
//    path        = require("path"),
    fs          = require("fs"),
    buildDate   = grunt.template.today('yyyy-mm-dd'),
    buildYear   = grunt.template.today('yyyy'),
    buildId     = (new Date()).getTime(),
    banner      = "/*\n" +
        "* <%= pkg.name %> - <%= pkg.description_short %>\n" +
        "* Version <%= pkg.version %>\n" +
        "* @requires <%= pkg.requires %>\n" +
        "*\n" +
        "* Copyright (c) <%= pkg.copyright %>\n" +
        "* Examples and docs at:\n" +
        "* <%= pkg.homepage %>\n" +
        "* Licensed under the MIT license:\n" +
        "* http://www.opensource.org/licenses/mit-license.php\n" +
        "*/\n" +
        "/*\n" +
        "* @description <%= pkg.description_long %>\n" +
        "* @type jQuery\n" +
        "* @name <%= pkg.name %>\n" +
        "* @category Plugins/<%= pkg.name %>\n" +
        "* @author <%= pkg.authors %>\n" +
        "* @build <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today('yyyy-mm-dd hh:MM:ss') %>\n" +
        "*/\n";

    // If we don't yet have a user's build file, create it.
    if (!grunt.file.isFile('me.build.json')) {
        grunt.file.write('me.build.json',
            JSON.stringify({
                deployLocation: ''
            }, null, 4)
        );
        grunt.log.writeln("me.build.json file was created at the root of the project" );
    }


    /**
     * Returns a function that can be used with grunt's copy
     * task 'filter' option. Checks if file being copied
     * is newer than that destination file.
     *
     * @param {Object} target
     *      The config object from copy task.
     * @param {String} timestampFile
     *      A timestamp file. Will be used instead of accessing the
     *      destination file when determining if file should be copied.
     *
     * @return {Boolean}
     *      True - yes, its new
     *      false - no, its not new
     *
     * @see {https://github.com/gruntjs/grunt-contrib-copy/issues/78#issuecomment-19027806}
     *
     */

/*
    function onlyNew(target, timestampFile) {

        if (!onlyNew.isTaskCreated) {
            onlyNew.isTaskCreated = true;
            grunt.registerTask('onlyNewPostRun', function(){
                var file = Array.prototype.slice.call(arguments, 0).join(':');
                grunt.log.writeln("onlyNewPostRun Task RUNNING for file: " + file);
                fs.writeFileSync(timestampFile, 'temp file');
            });
            onlyNew.timestampFiles = {};
        }

        // Return the callback function for each file check - used in the task
        return function(src) {

            var dest    = grunt.config(target.concat('dest')),
                cwd     = grunt.config(target.concat('cwd')),
                dstat, stat, response;

            if (!timestampFile) {
                dest = cwd ?
                       path.join(dest, path.relative(cwd, src)) :
                       path.join(dest, src);
            } else {
                dest = timestampFile;
            }

            if (timestampFile && !onlyNew.timestampFiles[timestampFile]) {
                onlyNew.timestampFiles[timestampFile] = true;
                grunt.task.run("onlyNewPostRun:" + timestampFile);
            }

            // grunt.log.writeln("this.target: " + this.name);
            grunt.verbose.writeln("Src  File: " + src);
            grunt.verbose.writeln("Dest File: " + dest);

            try {
                dstat   = fs.statSync(dest);
                stat    = fs.statSync(src);
            } catch (e) {
                // grunt.log.writeln("    Unable to get stat data... Returning True");
                return true;
            }

            // grunt.log.writeln("    Src  is File: " + stat.isFile() + " | mTime: " + stat.mtime.getTime());
            // grunt.log.writeln("    Dest is File: " + dstat.isFile() + " | mTime: " + dstat.mtime.getTime());
            // grunt.log.writeln("mod[" + dstat.mtime.getTime() + "]: " + dest);
            response = ( stat.isFile() && stat.mtime.getTime() > dstat.mtime.getTime() );
            // grunt.log.writeln("    Response: " + response);
            return response;
        };

    } //end: onlyNew()
*/

    /**
     * Replaces build variables in files with actual values. Meant to be used
     * with the 'copy' task as a contentProcess function
     *
     * @param {String} fileContent
     * @param {String} srcPath
     *
     * @return {String}
     */
    function replaceBuildVariables(fileContent, srcPath){

        grunt.verbose.writeln("Processing : " + srcPath );

        return fileContent
            .replace( /@BUILD/g, buildId)
            .replace( /@VERSION/g, grunt.template.process("<%= pkg.version %>"))
            .replace( /@DATE/g, buildDate )
            .replace( /@YEAR/g, buildYear )
            .replace( /@AUTHOR/g, grunt.template.process("<%= pkg.author %>") );

    } //end: replaceBuildVariables()

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        userBuildOpt: grunt.file.readJSON("me.build.json"),

        copy: {
            options : {
                processContentExclude: [
                    '**/*.{png,gif,jpg,ico,psd}'
                ]
            },
            // DEPLOY:
            // Copies the files from /src/* and build/* to the folder defined by
            // the user's build options (me.build.json) attribute 'deployLocation'
            // deploy only copies files that have changed since last time.
            deploy: {
                options : {
                    processContent: function(fileContent, filePath){
                        return replaceBuildVariables(fileContent, filePath);
                    }
                },
                src:    [
                    "src/**/*",
                    "build/**/*.js",
                    "tests/**/*"
                ],
                dest:   "<%= userBuildOpt.deployLocation %>",
                expand: true
//                ,
//                filter: onlyNew(['copy', 'deploy'], "me.deploy.timestamp.txt")
            },

            // DEPLOY ALWAYS
            // These file are always deployed.
            deployAlways: {
                options : {
                    processContent: function(fileContent, filePath){
                        return replaceBuildVariables(fileContent, filePath);
                    }
                },
                src:    [
                    "src/dev.aspx"
                ],
                dest:   "<%= userBuildOpt.deployLocation %>",
                expand: true
            },

            processBuildVariables: {
                options : {
                    processContent: function(fileContent, filePath){
                        return replaceBuildVariables(fileContent, filePath);
                    }
                },
                src:    "build/<%= pkg.filename %>.js",
                dest:   "build/<%= pkg.filename %>.js"
            }
        },

        concat: {
            license: {
                src: "license.txt",
                dest: "build/license.txt"
            },
            src: {
                options: {
                    banner: banner
                },
                src:    "build/<%= pkg.filename %>.js",
                dest:   "build/<%= pkg.filename %>.js"
            }
        },

        uglify: {
            options: {
                banner: banner
            },
            build: {
                src:    "build/<%= pkg.filename %>.js",
                dest:   "build/<%= pkg.filename %>.min.js"
            }
        },

        zip: {
            package: {
                src: "<%= pkg.package_zipfiles %>",
                dest: 'build/<%= pkg.filename %>.zip'
            }
        },

        jshint : {
            options : {
                jshintrc : true,
                ignores: [
                    "src/jquery.SPServices Intellisense.js"
                ]
            },
            gruntfile : {
                src : 'Gruntfile.js'
            },
            src : {
                src : ['src/**/*.js']
            }
        },

        watch : {
            gruntfile : {
                files : 'Gruntfile.js',
                tasks : ['jshint:gruntfile']
            },
            src : {
                files : ['src/**/*'],
                tasks : ['jshint:src']
            }
        },

        requirejs: {

            // See requireJS builder documentation (r.js) of more on how to set this up
            // http://requirejs.org/docs/optimization.html#options
            // https://github.com/jrburke/r.js/blob/master/build/example.build.js
            compile: {
                options: {
                    baseUrl: ".",
                    paths: {
                        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min'
                    },
                    exclude: ["jquery"],
                    optimize: "none",

                    optimizeCss: "standard.keepLines.keepWhitespace",

                    wrap: {
                        // AMD loader code
                        start: ';(function(factory){\n' +
                                '    if ( typeof define === "function" && define.amd ) {\n' +
                                    '        define(["jquery"], factory );\n' +
                                '    } else {\n' +
                                    '        factory(jQuery);' +
                                '    }' +
                            '}(function($) {\n   var jquery = jQuery;\n',
                        end: '}));'
                    },
                    done: function(done, output) {

                        // Let's check to ensure that no one module was built/included more than once.
                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (Object.keys(duplicates).length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            for (var key in duplicates) {
                                grunt.log.error(duplicates[key] + ": " + key);
                            }
                            return done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        } else {
                            grunt.log.success("No duplicates found!");
                        }

                        done();
                    },
                    onModuleBundleComplete: function (data) {

                        var amdclean = require('amdclean');

                        // Make a copy of the requireJS optimized file
                        // Uncomment this if you would like to get a single requirejs file
                        // fs.writeFileSync(
                            // data.path + ".compiled.js",
                            // fs.readFileSync(outputFile)
                        // );

                        fs.writeFileSync(data.path, amdclean.clean({
                            'filePath': data.path,
                            'ignoreModules': ["jquery"],
                            transformAMDChecks: false
                        }));

                    },
                    name: "src/SPServices",
                    out: "build/jquery.SPServices.js"
                }
            }

        },

        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    paths: ["src/css"]
                },
                files: {
                    "src/css/SPServices.css": "src/less/SPServices.less"
                }
            }

        }


    });

    // Load the plugins for tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s).
    grunt.registerTask('default', [
        'jshint',
        'less',
        'requirejs:compile',
        'concat',
        'copy:processBuildVariables',
        'uglify',
        'zip'
    ]);

    grunt.registerTask('deploy', function(){

        if (!grunt.config(['userBuildOpt', 'deployLocation'])) {
            grunt.fail.fatal("deployLocation property in me.build.json \n" +
                "is not defined. Unable to deploy");
            return;
        }

        grunt.task.run([
            "default",
            "copy:deploy",
            "copy:deployAlways"
        ]);

    });

};
