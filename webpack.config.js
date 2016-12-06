const AsyncAwaitPlugin = require('webpack-async-await')
const path = require('path')


module.exports = {

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: {
    inspector: "./src/ui/web",
    logger: "./src/logger",
    "worker-layout": "./src/ui/worker-layout"
  },
  // plugins: [
  //   new AsyncAwaitPlugin({})
  // ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].umd.js",
    library: "[name]",
    libraryTarget: "umd"
  },

  devtool: 'eval',
}
