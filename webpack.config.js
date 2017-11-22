const AsyncAwaitPlugin = require('webpack-async-await')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  entry: {
    inspector: './src/ui/inspector',
    'logger-file': './src/logger-file',
    'logger-client': './src/logger-client',
    'worker-layout': './src/ui/worker-layout'
  },
  // plugins: [
  //   new AsyncAwaitPlugin({})
  // ],
  // plugins: [new BundleAnalyzerPlugin()],
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      g: "jointjs/dist/geometry.js"
    }
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `am_[name].umd.js`,
    library: 'am_[name]',
    libraryTarget: 'umd'
  },

  // devtool: 'source-map',
  devtool: 'eval'
}
