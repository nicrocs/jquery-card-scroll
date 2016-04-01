var path = require('path');
module.exports = {
  entry: './js/index.js',
  output: {
    path: path.join(__dirname, "js"),
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "stage-0"]
        }
      }
    ]
  }
}
