var gulp = require('gulp')

gulp.task('default', ['nodemon', 'watch', 'start-db', 'start-redis', 'build-common-lib'])
