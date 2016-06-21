/*
TODO
- separate builds for ui and graph source
*/

var gulp = require('gulp-help')(require('gulp'))
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell')
var fs = require('fs')
var browserify = require('browserify')
var watchify = require('watchify')
var gutil = require('gulp-util')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var path = require('path')
var del = require('del')
var plumber = require('gulp-plumber')

gulp.task('default', ['js:build'])

var watchGlob = {
    lib: ['src/**/**.ts', 'typings/**/**.d.ts'],
    testNoUi: null
}
watchGlob.testNoUi = watchGlob.lib.concat(['test/no-ui/**/**.ts'])

//----- CLEAN

gulp.task('clean:dist', "Clean the ./dist dir", function() {
    del(['dist/**', '!dist']);
})

gulp.task('clean:build', "Clean the ./build dir", function() {
    del(['build/**', '!build']);
})

gulp.task('clean:build:test', "Clean the ./build-test dir", function() {
    del(['build-test/**', '!build-test']);
})

//----- SOURCE

var tsFiles = [
    './src/**/**.ts',
    // TODO this should be taken from tsconfig.json
    './typings/tsd.d.ts'
];

var compileProject = ts.createProject('./tsconfig.json')

// Setup the project for a fastest build
var buildProject = ts.createProject('./tsconfig.json', {
    isolatedModules: true
})

gulp.task('ts:compile', 'Compile the TS sources without writing to disk',
        function() {
            gulp.src(tsFiles, { base: './src' })
                .pipe(ts(compileProject))
        })

gulp.task('ts:compile:watch',
        'Compile the TS sources without writing to disk and watch for changes',
        ['ts:compile'], function() {
            gulp.watch(watchGlob.lib, ['ts:compile']);
        })

gulp.task('ts:build', 'Build the TS sources', function() {
    return gulp.src(tsFiles, { base: './src' })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        // TODO this shouldn't emit non-changed files
        .pipe(ts(buildProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'))
})

gulp.task('ts:build:watch', 'Build the TS sources and watch for changes',
        ['clean:dist', 'ts:build'], function() {
            gulp.watch(watchGlob.lib, ['clean:dist', 'ts:build']);
        });

//----- DIST

var source_bundler = browserify({
    cache: {},
    packageCache: {},
    entries: ['./build/main.js'],
    debug: true,
    standalone: 'amv'
}).transform("babelify", {
    presets: ["es2015"],
    plugins: [
        "transform-es2015-modules-commonjs"
    ],
    // sourceMaps: false,
    sourceMapRelative: path.resolve(__dirname, 'src'),
    only: 'build/**'
})

gulp.task('js:build', 'Build the dist file', ['ts:build'], bundle)

gulp.task('js:build:watch', 'Build the dist file and watch for changes',
        ['ts:build:watch'], function() {
            source_bundler.plugin(watchify)
            return bundle()
        })
source_bundler.on('update', bundle)
source_bundler.on('log', gutil.log)

/**
 * TODO vars for path and names
 */
function bundle() {
    return source_bundler.bundle()
            .on('error', function(err) {
                gutil.log(err.message)
            })
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../'}))
            .pipe(gulp.dest('./dist'))
            // // TODO use a stream
            // .pipe(shell([
            //     'sorcery -i dist/main.js'
            // ]))
}

//gulp.task('dist', "Minify the dist file", function() {
//    // TODO
//})

//----- TESTS

var defaultReporter = ts.reporter.defaultReporter()
// ignores TS2445 errors
// ignores errors from the /src dir
var filterTestErrors = function(error) {
    //if (~error.message.indexOf('src/'))
    //    return true;

    if (~error.message.indexOf('TS2445'))
        return true;

    return defaultReporter.error(error)
}
var testErrorReporter = Object.create(defaultReporter)
testErrorReporter.error = filterTestErrors

var compileTestProject = ts.createProject('./test/no-ui/tsconfig.json')

// Setup the project for a fastest build
var buildTestProject = ts.createProject('./test/no-ui/tsconfig.json', {
    isolatedModules: true
})

var testFiles = [
    './src/**/**.ts',
    './test/no-ui/**/**.ts',
    // TODO list all d.ts files (maybe parse tsd.d.ts) and turn off parseExternals
    "./typings/tsd.d.ts",
    "./typings/mocha/mocha.d.ts",
    "./typings/chai/chai.d.ts",
    "./typings/node/node.d.ts",
    "./typings/sinon/sinon.d.ts"
]

gulp.task('tests:compile', 'Compile unit tests without writing to disc', function() {
    gulp.src(testFiles, { base: '.'})
        .pipe(ts(compileTestProject, [], testErrorReporter))
});

gulp.task('tests:compile:watch', 'Compile unit tests and watch for changes', ['tests:compile'], function() {
    gulp.watch(watchGlob.testNoUi, ['tests:compile']);
});

gulp.task('tests:build', 'Build unit tests', function() {
    return gulp.src(testFiles, { base: '.'})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        // TODO this shouldn't emit non-changed files
        .pipe(ts(buildTestProject))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build-test/no-ui'))
});

gulp.task('tests:build:watch', 'Compile unit tests and watch for changes', ['tests:build'], function() {
    gulp.watch(watchGlob.testNoUi, ['tests:build']);
});

gulp.task('tests:run', 'Run already BUILT unit tests', shell.task([
    'mocha build-test/no-ui/test/no-ui/test.js'
]))

gulp.task('tests:debug', 'Run already BUILT unit tests', shell.task([
    'mocha --debug-brk --no-timeouts build-test/no-ui/test/no-ui/test.js'
]))

gulp.task('tests:debug:inspector', 'Run already BUILT unit tests', shell.task([
    'node-debug _mocha --no-timeouts build-test/no-ui/test/no-ui/test.js'
]))

// TODO ignore test errors in watch
gulp.task('tests:run:watch', 'Run already BUILT unit tests and watch for changes', ['tests:run'], function() {
    gulp.watch(watchGlob.testNoUi, ['tests:run']);
});

// TODO
//gulp.task('tests:compile')
//gulp.task('tests:compile:watch')

gulp.task('test', 'Run the test suite', ['tests:build', 'tests:run'])

//----- MISC

// shows the counter of infered "any" types
gulp.task('server', 'Start the web server', shell.task([
    'httpserver'
]))

//----- MISC

// shows the counter of infered "any" types
gulp.task('ts:count-any', 'Show the amount of inferred ANY types', shell.task([
    'tsc -noEmit --noImplicitAny | grep "has an \'any\' type" | wc -l'
]))

// build docs from the TS code
gulp.task('docs', 'Generate API docs from the TypeScript source', shell.task([
    'typedoc --out docs  --target ES6 --includeDeclarations ' +
    '--ignoreCompilerErrors' +
    '--hideGenerator --name AV ' +
    'src/ typings/'
]))
