var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var less = require('gulp-less');
// var sourcemaps = require('gulp-sourcemaps');

gulp.task('js', function() {
  return gulp.src(['js/*.js'])
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('.'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('less', function() {
  return gulp.src('less/app.less')
    // .pipe(sourcemaps.init())
    .pipe(less())
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
})

gulp.task('default', ['js', 'less'], function() {
  gulp.watch('less/*.less', ['less']);
  var watcher = gulp.watch('js/*.js', ['js']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
