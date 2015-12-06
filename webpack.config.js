module.exports = {
  entry: "./src/root.js",
  output: {
    path: __dirname,
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?presets[]=react,presets[]=es2015'
      }
    ]
  }
};