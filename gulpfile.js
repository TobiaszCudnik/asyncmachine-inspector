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
var sorcery = require('sorcery')
var typescript = require('typescript')

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
    './typings/index.d.ts'
];

var compileProject = ts.createProject('./tsconfig.json', 
    { typescript } )

// Setup the project for a fastest build
var buildProject = ts.createProject('./tsconfig.json', {
    isolatedModules: true,
    typescript,
    jsx: 'preserve'
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
        // .pipe(sourcemaps.write('.'))
        // .pipe(gulp.dest('./build'))
})

gulp.task('ts:build:watch', 'Build the TS sources and watch for changes', ['ts:build'], function() {
            gulp.watch(watchGlob.lib, ['ts:build']);
        });

//----- BUNDLE WEB UI

linkerTasks({
    name: 'ui',
    desc: 'Build the web UI dist file',
    entry: './build/ui/web.js',
    // optional
    standalone: 'amv_ui',
    target: 'ui.js',
    browser: true
})

//----- BUNDLE LOGGER

linkerTasks({
    name: 'logger',
    desc: 'Build the logger dist file',
    entry: './build/logger.js',
    // optional
    standalone: 'amv_logger',
    target: 'logger.js'
})

//----- BUNDLE SERVER

linkerTasks({
    name: 'server',
    desc: '(BROKEN) Build the node server dist file',
    entry: './build/server/server.js',
    target: 'server.js'
})

//----- BUNDLE MAIN

linkerTasks({
    name: 'complete',
    desc: 'Build the complete dist file',
    entry: './build/main.js',
    // optional
    standalone: 'amv',
    target: 'main.js'
})

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

var compileTestProject = ts.createProject('./test/no-ui/tsconfig.json', { typescript })

// Setup the project for a fastest build
var buildTestProject = ts.createProject('./test/no-ui/tsconfig.json', {
    isolatedModules: true,
    typescript
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

// --- BROWSERIFY LINKER

function linkerTasks(options) {
    // gulp.task(options.name + ':link', 'Build the dist file', ['ts:build'], bundle)

    // gulp.task(options.name + ':link:watch', 'Build the dist file and watch for changes',
    //         ['ts:build:watch'], function() {
    //             source_bundler.plugin(watchify)
    //             return bundle()
    //         })
    gulp.task(options.name + ':link', 'Build the dist file', bundle)

    gulp.task(options.name + ':link:watch', 'Build the dist file and watch for changes', function() {
        source_bundler.plugin(watchify)
        return bundle()
    })

    var bundler_options = {
        cache: {},
        packageCache: {},
        entries: [options.entry],
        debug: true
    }

    if (options.standalone)
        bundler_options.standalone = options.standalone
    if (!options.browser) {
        bundler_options.insertGlobals = ['__filename', '__dirname']
        bundler_options.builtins = []
        bundler_options.detectGlobals = false
    }

    var source_bundler = browserify(bundler_options)
            .transform("babelify", {
        presets: ["es2015"],
        plugins: [
            "transform-es2015-modules-commonjs"
        ],
        // sourceMaps: false,
        sourceMapRelative: path.resolve(__dirname, 'src'),
        only: 'build/**'
    })
    source_bundler.on('update', bundle)
    source_bundler.on('log', gutil.log)

    /**
     * TODO vars for path and names
     */
    function bundle() {
        let dir = 'dist/'
        return source_bundler.bundle()
                .on('error', function(err) {
                    gutil.log(err.message)
                })
                .pipe(source(options.target))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../'}))
                .pipe(gulp.dest(dir))
                .on('end', function() {
                    chain = sorcery.loadSync( dir + options.target )
                    chain.write( dir + options.target )
                })
    }
}

// --- EXPERIMENTS - rollup linker
// watch cache is slow

// var rollup = require('rollup');
// var commonjs = require('rollup-plugin-commonjs');
// var nodeResolve = require('rollup-plugin-node-resolve');
// var typescript = require('rollup-plugin-typescript');
// // var watch = require('rollup-plugin-watch');

// var umd_globals = {
//     'util': 'window',
//     'crypto': 'window',
//     'net': 'window',
//     'fs': 'window',
//     'tty': 'window',
//     'zlib': 'window',
//     'utf-8-validate': 'window',
//     'bufferutil': 'window',
//     'tls': 'window',
//     'stream': 'window',
//     'https': 'window',
//     'http': 'window',
//     'child_process': 'window'
// }

// // var rollup_bundle
// // gulp.task('experimental-rollup', 'Make a dist file', function() {
// //     return rollup.rollup({
// //         entry: 'src/main.ts',
// //         plugins: [
// //             typescript({
// //                 isolatedModules: false,
// //                 module: 'es6'
// //             }),
// //             nodeResolve({
// //                 jsnext: true,
// //                 main: true,
// //                 preferBuiltins: false
// //             }),
// //             commonjs({
// //                 include: 'node_modules/**',
// //                 ignoreGlobal: true
// //             })
// //         ],
// //         external: [
// //             'bufferutil',
// //             'utf-8-validate'
// //         ],
// //         cache: rollup_bundle
// //     }).then(function (bundle) {
// //         rollup_bundle = bundle
// //         console.log('rolled up!')
// //         // Alternatively, let Rollup do it for you
// //         // (this returns a promise). This is much
// //         // easier if you're generating a sourcemap
// //         return Promise.all([
// //             bundle.write({
// //                 format: 'umd',
// //                 dest: 'dist/rollup.umd.js',
// //                 moduleName: 'amv',
// //                 sourceMap: true,
// //                 globals: umd_globals
// //             }),
// //             bundle.write({
// //                 format: 'cjs',
// //                 dest: 'dist/rollup.cjs.js',
// //                 sourceMap: true
// //             })
// //         ]);
// //     });
// // });

// var rollupJson = require('rollup-plugin-json')

// var rollup_bundle
// gulp.task('experimental-rollup', 'Make a dist file', function() {
//     return rollup.rollup({
//         entry: 'src/server/server.ts',
//         plugins: [
//             rollupJson(),
//             typescript({
//                 target: 'es5',
//                 isolatedModules: false,
//                 module: 'es6'
//             }),
//             nodeResolve({
//                 jsnext: true,
//                 main: true,
//                 preferBuiltins: false
//             }),
//             commonjs({
//                 include: 'node_modules/**',
//                 ignoreGlobal: false,
//                 extensions: [ '.js', '.json' ]
//             })
//         ],
//         external: [
//             'util',
//         ],
//         cache: rollup_bundle
//     }).then(function (bundle) {
//         rollup_bundle = bundle
//         console.log('rolled up!')
//         // Alternatively, let Rollup do it for you
//         // (this returns a promise). This is much
//         // easier if you're generating a sourcemap
//         return Promise.all([
//             bundle.write({
//                 format: 'cjs',
//                 dest: 'dist/server.js',
//                 sourceMap: true
//             })
//         ]);
//     });
// });


// gulp.task('experimental-rollup:watch', 'Make a dist file, watch for changes', ['rollup'], function() {
//     gulp.watch(watchGlob.lib, ['rollup'])
// })