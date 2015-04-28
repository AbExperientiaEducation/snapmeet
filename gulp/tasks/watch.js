/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
*/

var gulp     = require('gulp')
var config   = require('../config')

gulp.task('watch', ['watchify'], function(callback) {
  gulp.watch(config.sass.watch,   ['sass'])
  gulp.watch(config.less.watch,   ['less'])
  // gulp.watch(config.images.src, ['images'])
  // gulp.watch(config.markup.src, ['markup'])
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
})
