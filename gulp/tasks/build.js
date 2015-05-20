var gulp = require('gulp')

gulp.task('build', ['less', 'sass', 'browserify', 'common-js', 'rev-replace'])
