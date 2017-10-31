const AsyncAwaitPlugin = require('webpack-async-await')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const WebpackShellPlugin = require('webpack-shell-plugin')
const path = require('path')

function createConfig(target) {
  let ret = {
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
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
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `[name].${target}.js`,
      library: '[name]',
      libraryTarget: target
    },

    // devtool: 'source-map',
    devtool: 'eval'
  }
  if (target == 'commonjs') {
    ret.plugins = [new WebpackShellPlugin({ onBuildEnd: ['make cjs-to-es6'] })]
    const { inspector } = ret.entry
    ret.entry = { inspector }
  }
  return ret
}
module.exports = [createConfig('umd'), createConfig('commonjs')]
