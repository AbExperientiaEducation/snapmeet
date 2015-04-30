var gulp           = require('gulp')
var exec = require('child_process').exec;

gulp.task('start-db', function(callback) {
var child = exec('neo4j start',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.error('exec error: ' + error);
    }
  });
})
