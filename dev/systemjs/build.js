"use strict";
var rollup_1 = require('rollup');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
rollup_1.rollup({
    entry: 'foo.js',
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',
            // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
            //
            // // search for files other than .js files (must already
            // // be transpiled by a previous plugin!)
            // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]
            // if true then uses of `global` won't be dealt with by this plugin
            ignoreGlobal: false
        })
    ]
}).then(function (bundle) {
    // Alternatively, let Rollup do it for you
    // (this returns a promise). This is much
    // easier if you're generating a sourcemap
    return bundle.write({
        format: 'cjs',
        dest: 'bundle.js',
        sourceMap: true
    });
});
