module.exports = {
  entry: "./components/Root.jsx",
  output: {
    path: __dirname,
    filename: "build.js"
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=react,presets[]=es2015'
      }
    ]
  }
}
