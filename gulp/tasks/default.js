var gulp = require('gulp')

gulp.task('default', ['sass', 'build-common-lib', 'watch', 'start-db', 'start-redis'])
