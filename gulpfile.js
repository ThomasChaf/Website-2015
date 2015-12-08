'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
// var $$ = require('gulp-load-plugins')();
var reload = browserSync.reload;
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var less = require('gulp-less');
var injectSelf = require('gulp-inject-self');
var rename = require('gulp-rename');

gulp.task('buildStyles', function() {
    gulp
    .src('app/styles/*.less')
    .pipe(less())
    .pipe(minifyCss())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/styles/'));
});

gulp.task('buildProperties', function() {
    gulp
    .src('app/properties/my-styles.html')
    .pipe(gulp.dest('dist/properties/'));
    gulp
    .src('app/properties/colors.less')
    .pipe(less())
    .pipe(injectSelf('app/properties/colors.html', /<!-- inject -->/))
    .pipe(rename('colors.html'))
    .pipe(gulp.dest('dist/properties/'));
    gulp
    .src('app/properties/*.json')
    .pipe(gulp.dest('dist/properties/'));
});

gulp.task('index', function() {
    gulp
    .src('app/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('buildElements', function() {
    gulp
    .src([
        'app/elements/**/*.html',
        'app/elements/**/*.css',
        'app/elements/**/*.js'
    ])
    .pipe(gulp.dest('dist/elements'));
});

gulp.task('buildImages', function() {
    gulp
    .src(['app/images/**/{*.png,*.jpg}'])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('buildScripts', function() {
    gulp
    .src(['app/scripts/**/*.js'])
    .pipe(gulp.dest('dist/scripts'));
    // .pipe($$.uglify({preserveComments: 'some'}))
});

gulp.task('buildVendor', function() {
    gulp
    .src([
        'bower_components/**/*'
    ])
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('build', ['index', 'buildElements', 'buildScripts', 'buildVendor', 'buildImages', 'buildStyles', 'buildProperties']);

gulp.task('serve', function() {
    browserSync({
        port: 5000,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch(['app/**/*.html', 'app/index.html', 'app/**/*.less', 'app/**/*.js'], ['build', reload]);
});

gulp.task('default', ['build', 'serve']);
