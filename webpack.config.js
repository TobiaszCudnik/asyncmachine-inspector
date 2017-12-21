const AsyncAwaitPlugin = require('webpack-async-await')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  entry: {
    inspector: './src/inspector/inspector',
    'inspector-layout-worker': './src/inspector/joint/layout-worker',
    'logger-browser-file': './src/logger/browser-file',
    'logger-browser-client': './src/logger/browser-client',
    'logger-server-file': './src/logger/server-file',
    'logger-server-client': './src/logger/server-client',
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
    filename: `am-[name].umd.js`,
    library: 'am-[name]',
    libraryTarget: 'umd'
  },

  // devtool: 'source-map',
  devtool: 'eval'
}
