var browserSync = require('browser-sync')
var gulp        = require('gulp')
var config      = require('../config').browserSync

gulp.task('browserSync', ['nodemon'], function() {
  browserSync(config)
})
