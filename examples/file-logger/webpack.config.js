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
    filename: `am-[name].umd.js`,
    library: 'am-[name]',
    libraryTarget: 'umd'
  },

  // devtool: 'source-map',
  devtool: 'eval'
}
