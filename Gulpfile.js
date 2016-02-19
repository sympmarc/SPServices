/**
 * Created by Marc D Anderson on 2/18/2016.
 */

"use strict;"

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var gutil = require('gulp-util');
var webpack = require('webpack-stream');

// Convert .less files to .css
gulp.task('less', function () {
    return gulp.src('src/less/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('src/css'))
});

// Gulp watch syntax
gulp.task('watch', ['less'], function(){
    gulp.watch('src/less/**/*.less', ['less']);
    // Other watchers
});


// Build module
gulp.task('default', function() {
    return gulp.src('src/**/*.js')
        .pipe(webpack(require('./webpack.config.js'), null, function(err, stats) {
            // Output stats so we can tell what happened
            gutil.log(stats.toString());
        }))
        .pipe(gulpIf('*.js', uglify())) // Minify all modules
        .pipe(gulp.dest('build/')); //
});