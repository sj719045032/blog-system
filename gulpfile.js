c/**
 * Created by shijin on 2016/3/1.
 */
var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
/*gulp.task('default', function () {
    gulp.src('builds/!*.js').pipe(minify()).pipe(gulp.dest('mini'));
});*/
gulp.task('concat', function () {
    gulp.src(['**/jquery/dist/jquery.min.js',
        '**/dropzone/dist/min/dropzone.min.js',
        '**/lightbox2/dist/js/lightbox.min.js',
        '**/angular/angular.js',
    '**/js/myjs/myjs.js']).pipe(concat('bundle.js')).pipe(gulp.dest('./public/js'));
});