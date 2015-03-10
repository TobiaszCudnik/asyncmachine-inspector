var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');

var bundler = watchify(browserify('./src/visualizer.js', {
    detectGlobals: false
}));
bundler.transform(babelify);

gulp.task('watch', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler
bundler.on('log', gutil.log.bind(gutil))

function bundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', swallowError)
        .pipe(source('build.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./build'));
}

function swallowError(error) {
    console.log(error.toString());
}

gulp.task('default', ['watch'])
