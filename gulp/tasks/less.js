var less = require('gulp-less');
var path = require('path');
var config  = require('../config').less
var gulp     = require('gulp')
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less', function () {
  return gulp.src(config.src)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest));
});
