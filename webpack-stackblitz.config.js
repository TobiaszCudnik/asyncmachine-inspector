const WebpackShellPlugin = require('webpack-shell-plugin')
const config = require('./webpack.config')

const { inspector } = config.entry
config.entry = { inspector }

config.output.libraryTarget = 'commonjs'
config.output.filename = '[name]-cjs.js'

// config.devtool = 'inline-source-map'
config.plugins = [new WebpackShellPlugin({ onBuildEnd: ['make cjs-to-es6'] })]

module.exports = config
