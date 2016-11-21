// ./node_modules/webpack/bin/webpack.js --plugin webpack-async-await --config webpack.js build/ui/web.js dist/ui-webpack.js
// npm i webpack@2.1.0-beta.23 acorn@latest webpack-async-await awesome-typescript-loader
const AsyncAwaitPlugin = require('webpack-async-await')
const path = require('path')


module.exports = {

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: {
    // TODO use ./src
    ui: "./src/ui/web.tsx",
    logger: "./src/logger.ts"
  },
  plugins: [
    new AsyncAwaitPlugin({})
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].webpack.js"
  }
}
