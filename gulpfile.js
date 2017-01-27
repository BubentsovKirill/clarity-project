'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cssnano = require ('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var imageminPngquant = require('imagemin-pngquant');

gulp.task('scss', function(){
    return gulp.src('app/scss/main.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('app/css/'))
});

gulp.task('css',['scss'], function(){
    return gulp.src('app/css/style.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('tmp/css/'))
});

gulp.task('js',function(){
    return gulp.src(['app/libs/jquery/dist/jquery.js',
    'app/js/script.js'])
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('tmp/js'))
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [imageminPngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync',function(){
    browserSync({
        server: ["tmp", "app"],
        port: 8080,
        notify: false,
        ui: {
            port: 8081
        }
    });
});

gulp.task('clear',function(){
    return del.sync('dist');
});

gulp.task('default',['browser-sync','scss','js'], function(){
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/scss/*.scss', ['scss']);
    gulp.watch('app/css/*.css', ['css']);
    gulp.watch('tmp/css/*.css', browserSync.reload);
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('tmp/js/*.js', browserSync.reload);
});

gulp.task('build',['clear','img','scss','js'],function(){
    var buildHtml = gulp.src(['app/*.html'])
        .pipe(gulp.dest('dist'))
    var buildCss = gulp.src(['tmp/css/*.css'])
        .pipe(gulp.dest('dist/css'))
    var buildJs = gulp.src('tmp/js/*.js')
        .pipe(gulp.dest('dist/js'))
    var buildFonts = gulp.src('app/fonts/*.*')
        .pipe(gulp.dest('dist/fonts/'))
});


