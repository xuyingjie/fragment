module.exports = {
  entry: "./js/root.js",
  output: {
    path: __dirname,
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
