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
var markdown = require('gulp-markdown');
var marked = require('marked');
var highlight = require('gulp-highlight');
var tap = require('gulp-tap');

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

gulp.task('docs', function () {
    return gulp.src(paths.docs) //paths.docs
        .pipe(markdown('index.html', {
            yamlMeta: true,
            templatePath: 'docs/index.html',
            highlightTheme: 'solarized_light'
        }))
        .pipe(gulp.dest('dist/docs/'));
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

// Deploy to gh-pages
gulp.task('deploydocs', function() {
    return gulp.src(paths.dist)
        .pipe(ghPages());
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
