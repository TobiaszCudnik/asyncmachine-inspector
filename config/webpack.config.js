const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

const config = {
  entry: {
    'inspector': './src/inspector/inspector',
    'logger': './src/logger/logger',
    'logger-remote': './src/logger/logger-remote',
    'logger-browser': './src/logger/browser',
    'logger-remote-browser': './src/logger/logger-remote-browser',
  },
  plugins: [
      // new BundleAnalyzerPlugin(),
  ],
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
    path: path.join(__dirname, '..', 'dist'),
    filename: `am-[name].umd.js`,
    library: 'am-[name]',
    libraryTarget: 'umd'
  },

  devtool: 'eval'
}

const config_cjs = {
  entry: {
    'logger': './src/logger/logger',
    'logger-remote': './src/logger/logger-remote',
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: `am-[name].cjs.js`,
    libraryTarget: 'commonjs'
  },
}

module.exports = [config, {...config, ...config_cjs}]