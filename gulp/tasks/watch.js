/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
*/

var gulp     = require('gulp')
var config   = require('../config')

gulp.task('watch', ['watchify'], function(callback) {
  gulp.watch(config.sass.watch, function() {
    gulp.run('sass')
  })
  gulp.watch(config.less.watch, function(){
    gulp.run('less')
  })
  gulp.watch(config.revReplace.watch, function() {
    gulp.run('rev-replace')
  })
  
  // gulp.watch(config.revReplace.watch, ['rev-replace'])
  // gulp.watch(config.images.src, ['images'])
  // gulp.watch(config.markup.src, ['markup'])
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
})

