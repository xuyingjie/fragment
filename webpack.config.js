module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname,
    filename: "build.js"
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
