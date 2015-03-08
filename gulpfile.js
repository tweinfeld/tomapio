var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap'),
    order = require('gulp-order');

gulp.task('build', function() {
    return gulp.src([
        "./src/*.js",
        "./src/reporter/*.js",
        "./src/tracker/*.js"])
        .pipe(order(["stub.js", "common.js", "*_reporter.js", "*_tracker.js", "tomapio.js"]))
        .pipe(concat('tomapio.min.js'))
        .pipe(uglify({
            preserveComments: function(){ return false; },
            mangle: false,
            compress: true
        }))
        .pipe(wrap('(function(global, undefined){<%= contents %>})(window, undefined);'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', ["build"], function(){
    gulp.watch('./**/*.js', ['build']);
});