var webpack = require('webpack')

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
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
}
