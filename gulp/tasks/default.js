var gulp = require('gulp')

gulp.task('default', ['nodemon', 'watch', 'start-db', 
'start-mongo', 'common-js'])
