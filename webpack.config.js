var path = require('path');
var webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: './index.js',
    output: {
        filename: 'vue-smooth-height.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: "build/",
        library:'SmoothHeight',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin(),
    ]
};