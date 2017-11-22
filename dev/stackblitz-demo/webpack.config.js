const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: {
    demo: './index.ts',
  },
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
    // path: path.join(__dirname, 'dist'),
    filename: `am_[name].umd.js`,
    library: 'am_[name]',
    libraryTarget: 'umd'
  },

  // devtool: 'source-map',
  devtool: 'eval'
}
