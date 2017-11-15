'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    fileinclude = require('gulp-file-include'),
	uglify = require('gulp-uglify'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat');

// SCSS workers
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(gulp.dest('build/'));
});

// HTML workers
gulp.task('html', function() {
  gulp.src(['src/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('build/'));
});

// JS workers
gulp.task('js', function() {
  gulp.src('src/js/background/*.js')
	.pipe(concat('background.js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('build/'));
  gulp.src('src/js/index/*.js')
	.pipe(concat('index.js'))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('build/'));
});

// Watchers
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/js/**/*.js', ['js']);
});

// Okey, we ready now! Just type "gulp" in CLI
gulp.task('default', ['sass', 'html', 'js', 'watch']);
