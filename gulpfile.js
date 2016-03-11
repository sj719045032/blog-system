/**
 * Created by shijin on 2016/3/1.
 */
var gulp=require('gulp');
var minify=require('gulp-minify');
gulp.task('default', function () {
    gulp.src('builds/*.js').pipe(minify()).pipe(gulp.dest('mini'));
});