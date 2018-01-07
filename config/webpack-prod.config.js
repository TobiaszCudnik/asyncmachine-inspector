const config = require('./webpack.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

config.plugins.push(
  new UglifyJSPlugin({
    uglifyOptions: {
      ecma: 8
    }
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
)
config.devtool = 'none'

module.exports = config
