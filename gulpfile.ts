var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
//var browserify = require('browserify');
var webpack = require('gulp-webpack');

var ts = require('gulp-typescript');
var merge = require('merge2');

var source_bundler = watchify(browserify('./build-es6/visualizer.js', {
    debug: true,
    insertGlobals: true,
    builtins: ['assert', '_process', 'buffer']
}));
source_bundler.transform(babelify.configure({
    stage: 2
}))

gulp.task('watch', bundle); // so you can run `gulp js` to build the file
source_bundler.on('update', bundle); // on any dep update, runs the bundler
source_bundler.on('log', gutil.log.bind(gutil))

function bundle() {
    return source_bundler.bundle()
        // log errors if they happen
        .on('error', swallowError)
        .pipe(source('dist.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./build-bundles'));
}

var test_bundler = watchify(browserify('./build-es6/test/visualizer-test.js', {
    debug: true,
    insertGlobals: true,
    builtins: ['assert', '_process', 'buffer']
}))
test_bundler.transform(babelify.configure({
    stage: 2
}))

gulp.task('watch-test', bundleTest); // so you can run `gulp js` to build the file
test_bundler.on('update', bundleTest); // on any dep update, runs the bundler
test_bundler.on('log', gutil.log.bind(gutil))

function bundleTest() {
    return test_bundler.bundle()
        // log errors if they happen
        .on('error', swallowError)
        .pipe(source('test.js'))
        // optional, remove if you dont want sourcemaps
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./build-bundles'));
}

function swallowError(error) {
    console.log(error.toString());
}

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true
});

gulp.task('build', function() {
    var tsResult = gulp.src('lib/*.ts')
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('release/definitions')),
        tsResult.js.pipe(gulp.dest('release/js'))
    ]);
});

gulp.task('default', ['watch'])


// gulp.task('build', shell.task([
//   'echo hello',
//   'echo world'
// ]))