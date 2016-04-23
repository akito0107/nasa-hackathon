var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var node = require('node-dev');
var source = require('vinyl-source-stream');
var path = require('path');

function errorHandler(err) {
  console.log('Error: ' + err.message);
}

// babelify
// translate ES6, JSX to bundle.js
gulp.task('build', function() {
  browserify({entries: ['./index.js']})
    .transform(babelify)
    .bundle()
    .on('error', function(err){   //ここからエラーだった時の記述
      console.log(err.message);
      console.log(err.stack);
  })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream: true}));
});


// // start local server
// gulp.task('server', function() {
//     var addPath = path.resolve(__dirname, './server.js');
//   node([addPath]);
// });


// watch
// watch each files to run build
gulp.task('watch', function() {
  gulp.watch('./index.js', ['build']);
  gulp.watch('./index.html', ['build']);
  gulp.watch('./components/*.js', ['build']);
});

// set each tasks to command "gulp"
gulp.task('default', ['build', 'watch']);
