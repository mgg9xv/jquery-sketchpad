var gulp = require('gulp');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps   = require('gulp-sourcemaps');


gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

gulp.task('compile-scss-to-css', function(){
    return gulp.src('src/stylesheets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/stylesheets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('perform-postcss', function () {
    var plugins = [
        autoprefixer('last 2 version'),
        cssnano()
    ];
    return gulp.src('./src/stylesheets/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ require('postcss-flexboxfixer'), autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/stylesheets/css'));
});

gulp.task('perform-optimizations', function(){
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-images-to-dist', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            interlaced: true,
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('copy-fonts-to-dist', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'compile-scss-to-css'],function(){
    gulp.watch('src/stylesheets/scss/*', ['compile-scss-to-css']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('develop', function(callback) {
    runSequence(
        ['compile-scss-to-css', 'browserSync'],
        'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'compile-scss-to-css',
        'perform-postcss',
        ['perform-optimizations', 'copy-images-to-dist', 'copy-fonts-to-dist'],
        callback
    )
});