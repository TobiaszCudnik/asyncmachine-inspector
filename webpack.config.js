var webpack = require('webpack');
module.exports = {
    entry: {
        // visualizer: './build/visualizer.js',
        test: './build/test/visualizer-test.js'
    },
    output: {
        filename: 'dist/[name].js'
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    // Add minification
    //plugins: [
    //    new webpack.optimize.UglifyJsPlugin()
    //],
    module: {
        loaders: [
            //{test: /\.ts$/, loader: 'ts'},
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                // exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /build\/asyncmachine\.js/,
                loader: "imports?this=>{}"
            }
        ],
        // noParse: [
        //     /build\/asyncmachine\.js/
        // ]
    }
}
