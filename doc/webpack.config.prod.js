var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: {
        main: './src/index.js'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                // use: ['style-loader', 'css-loader']
                loader: ExtractTextPlugin.extract('css-loader?sourceMap')
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },

    devtool: 'source-map',

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         warnings: false
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     template: './public/index.html'
        // }),
        new ExtractTextPlugin({
            filename: 'css/main.css',
            disable: false,
            allChunks: true
        })
    ]
}
