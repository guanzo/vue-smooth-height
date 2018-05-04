const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const commonConfig = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
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
    }
}

module.exports = [
    merge(commonConfig, {
        output: {
            filename: 'vue-smooth-height.min.js',
            library:'SmoothHeight',
            libraryTarget: 'window',
            libraryExport: "default"
        },
        plugins:[
            new UglifyJSPlugin(),
        ]
    }),
    merge(commonConfig, {
        output: {
            filename: 'vue-smooth-height.js',
            libraryTarget: 'umd',
            library:'vue-smooth-height',
        }
    })
]
