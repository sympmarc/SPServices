"use strict";

var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var header = require('gulp-header');
var rename = require('gulp-rename');
var ghPages = require('gulp-gh-pages');
var tap = require('gulp-tap');
var metalsmith = require('metalsmith');
var msMarkdown = require('metalsmith-markdown');
var msReplace = require('metalsmith-text-replace');
var msRegisterHelpers = require('metalsmith-register-helpers');
var msLayouts = require('metalsmith-layouts');
var msCollections = require('metalsmith-collections');
var msCollectionMetadata = require('metalsmith-collection-metadata');
var msNavigation = require('metalsmith-navigation');
var msWatch = require('metalsmith-watch');
var msIgnore = require('metalsmith-ignore');
var msAssets = require('metalsmith-assets');
var zip = require('gulp-zip');
var merge = require('merge-stream');
var browserSync = require('browser-sync');


var
    packageFile = 'package.json',
    pkg = require('./' + packageFile),
    paths = {
        scripts: ['src/**/*.js', '!src/jquery.SPServices Intellisense.js'],
        less: ['src/less/**/*.less'],
        docs: ['docs/**/*.md'],
        dist: ['dist/**/*']
    },
//    buildDate   = gulp.template.today('yyyy-mm-dd'),
//    buildYear   = gulp.template.today('yyyy'),
//    buildId     = (new Date()).getTime(),
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
//        "* @build <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today('yyyy-mm-dd hh:MM:ss') %>\n" +
        "*/\n";



gulp.task('config', function() {
    fs = require("fs");
    pkg = fs.readFileSync(packageFile, "utf8");
    gutil.log(pkg.toString());

});

gulp.task('clean:build', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});

gulp.task('clean:docs', function() {
    return del(['dist/docs/**/*']);
});

// Convert .less files to .css
gulp.task('less', function () {
    return gulp.src(paths.less)
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('src/css'));
});

// Lint the files to catch any issues
gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Gulp watch syntax
gulp.task('watch', ['less'], function(){
    gulp.watch(paths.less, ['less']);
    // Other watchers
});

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        //        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(concat('jQuery.SPServices-' + pkg.version + '.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/'));
});


/*
    gulp.task('fixdocs', function () {
        return gulp.src(paths.docs) //paths.docs
            .pipe(tap(function(file) {
                gutil.log(file.path);
                var tmp = file.path.split('\\');
                var cat = tmp.length > 4 ? tmp[4] : '';
                var name = tmp[tmp.length - 1].split('.')[0];
                file.contents = Buffer.concat([
                    new Buffer(['---',
                        'label: ' + name,
                        'id: ' + name,
                        'categorySlug: \'' + cat + '\'',
                        'categoryLabel: \'' + cat + '\'',
                        'categorySort: \'alphabetical\'', // 'alphabetical' || 'rank'
                        'documentSort: \'alphabetical\'', // 'alphabetical' || 'rank'
                        '', ''].join('\n')),
                    file.contents
                ])
            }))
            .pipe(gulp.dest('dist/tmp'));
    });
*/

gulp.task('docs', ['clean:docs'], function () {

    return metalsmith(__dirname)
        .metadata({
          site: {
            title: pkg.name,
            description: pkg.description_long
          },
          version: pkg.version,
          copyright: pkg.copyright,
          repository: pkg.repository.url,
          license: pkg.licenses[0]
        })
        .source('./docs')
        .clean(false) // Don't delete files while Gulp tasks are running
        .destination('./dist/docs')
        .use(msWatch({
          paths: {
            '${source}/**/*': true, // Rebuild an individual file when it is changed
            "docs/**/*.md": "**/*.md", // Rebuild all .md files when a .md file is changed
            "docs/layouts/**/*.*": "**/*.md" // Rebuild all .md files when a template file is changed
          }
        }))
        .use(msIgnore('layouts/**/*')) // Don't output template files in dist/docs
        .use(msMarkdown())
        .use(msReplace({
          '**/*.html': [
            {
              find: /.md"/gi,
              replace: '.html"'
            },
            {
              find: /.md#/gi,
              replace: '.html#'
            },
            {
              find: /<table>/gi,
              replace: '<table class="table">' // Bootstrap table class
            },
            {
              find: /<code class="lang-/gi,
              replace: '<code class="language-' // Prism.js classes are prefixed with language- instead of -lang
            }
          ]
        }))
        .use(msCollections({
          'All': {
            pattern: '**/*' // Used by msCollectionMetadata
          }
        }))
        .use(msCollectionMetadata({
          'collections.All': {
            nav_group_global: 'global' // Add all pages to 'global' nav; this ensure that every page has a 'nav_path' property
          }
        }))
        .use(msNavigation({
          global: {
            filterProperty: 'nav_group_global',
            sortBy: 'nav_sort',
            breadcrumbProperty: 'breadcrumb_path'
          },
          primary: {
            filterProperty: 'nav_group',
            sortBy: 'nav_sort'
          },
          featured: {
            filterProperty: 'nav_group',
            sortBy: 'nav_sort'
          }
        }))
        .use(msRegisterHelpers({
          directory: 'docs/layouts/helpers'
        }))
        .use(msLayouts({
          engine: 'handlebars',
          directory: 'docs/layouts',
          partials: 'docs/layouts/partials',
          default: 'main.hbs'
        }))
        .use(msAssets({
          'source': './docs/assets',
          'destination': 'assets'
        }))
        .build(function (err) {
          if (err) {
            throw err;
          }
        });
});


// Build module
gulp.task('build', function() {
    return gulp.src(paths.scripts)
        .pipe(webpack(require('./webpack.config.js'), null, function(err, stats) {
            // Output stats so we can tell what happened
            gutil.log(stats.toString());
        }))
        .pipe(rename('jQuery.SPServices-' + pkg.version + '.js'))
        .pipe(gulp.dest('build/')) // SPServices.js
        .pipe(gulpIf('*.js', uglify())) // Minify all modules
        .pipe(rename('jQuery.SPServices-' + pkg.version + '.min.js'))
        .pipe(gulp.dest('build/')); // SPServices.min.js
});

// Run local server for viewing docs
gulp.task('servedocs', ['docs'], function() {

    // Create browser-sync instance
    var bs = browserSync.create();

    // Start browser-sync server for HTML docs
    bs.init({
      files: 'dist/**/*',
      server: {
        baseDir: 'dist/docs'
      },
      reloadDelay: 300, // Allow all dist/docs HTML files to be updated before reloading
      reloadDebounce: 1000 // Only reload once per second (avoids multiple reloads when many docs are updated simultaneously e.g. when a template file is updated)
    });
});

// Deploy to gh-pages
gulp.task('deploydocs', function() {
    return merge(
        gulp.src(paths.dist).pipe(zip('SPServices.zip')),
        gulp.src('dist/docs/**/*')
    ).pipe(ghPages());
});

// Default task(s).
gulp.task('default', [
    'clean:build',
    'lint',
    'less',
    'scripts',
    'build'
//    'concat',
//    'copy:processBuildVariables',
//    'uglify',
//    'zip'
]);
