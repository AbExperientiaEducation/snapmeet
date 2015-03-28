/*
 * Externalize all site-wide libraries into one file.  Since these libraries are all sizable, it would be better for the
 * client to request it individually once and then retreive it from the cache
 */
var libs = require('../config').libs
var gulp = require('gulp')
var _ = require('lodash')
var babelify = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream');

gulp.task("build-common-lib", function() {
    return browserify(require.resolve('babelify/polyfill'))
    .require(libs.srcs)
    .transform(babelify)
    .bundle()
    .pipe(source("common.js"))
    .pipe(gulp.dest(libs.dest + "/../lib/"));

});