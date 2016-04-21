const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
var ghtmlSrc = require('gulp-html-src');
var uglify = require('gulp-uglify');

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('compile', function () {
  return gulp
    .src('app/**/*.ts')
    .pipe(sourcemaps.init())          // <--- sourcemaps
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))      // <--- sourcemaps
    .pipe(gulp.dest('dist/app'));
});

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('copy:js', function() {
  gulp.src('./index.html')
    .pipe(ghtmlSrc()) 
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('copy:css', function() {
  gulp.src('./index.html')
    .pipe(ghtmlSrc({ presets: 'css'}))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy:assets', ['clean'], function() {
  return gulp.src(['app/**/*', 'index.html', 'styles.css', '!app/**/*.ts'], { base : './' })
    .pipe(gulp.dest('dist'))
});

gulp.task('build', ['copy:assets', 'compile', 'copy:js', 'copy:css', 'copy:assets']);
gulp.task('default', ['build']);