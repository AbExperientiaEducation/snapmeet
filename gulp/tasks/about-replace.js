var gulp = require('gulp')
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
var config = require('../config').aboutReplace

gulp.task("about-replace", function(){
  var manifest = gulp.src(config.manifestFile);
  return gulp.src(config.indexPath + config.indexName)
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(config.indexPath + '/built'));
});
