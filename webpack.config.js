var path = require('path');
var webpack = require('webpack')

module.exports = {
    entry: './dist/index.js',
    output: {
        filename: 'vue-smooth-height.min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "dist/",
        library:'SmoothHeight',
        libraryExport: "default"
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
}