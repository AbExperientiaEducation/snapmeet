var gulp           = require('gulp')
var exec = require('child_process').exec;

gulp.task('start-mongo', function(callback) {
var child = exec('mongod --auth',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.error('exec error: ' + error);
    }
  });
})
