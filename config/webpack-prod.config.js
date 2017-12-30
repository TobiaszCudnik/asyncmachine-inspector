const config = require('./webpack.config')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

config.plugins.push(
  new UglifyJSPlugin({
    uglifyOptions: {
      ecma: 8
    }
  })
)
config.devtool = 'none'

module.exports = config
