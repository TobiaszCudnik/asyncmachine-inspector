const AsyncAwaitPlugin = require('webpack-async-await')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  entry: {
    'inspector-layout-worker': './src/inspector/joint/graph-layout-worker'
  },
  plugins: [
    // new AsyncAwaitPlugin({})
  ],
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
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: `am-[name].umd.js`,
    library: 'am-[name]',
    libraryTarget: 'umd'
  },

  devtool: 'eval'
}
