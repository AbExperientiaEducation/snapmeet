var gulp = require('gulp')

gulp.task('build', ['less', 'sass', 'browserify', 'build-common-lib'])
