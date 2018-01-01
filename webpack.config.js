const webpack = require("webpack");
const path = require('path');

module.exports = {
    // For testing only
    // entry:'./src/index-test.ts',
    entry:{
        'index.js':'./src/index-test.ts',
        'scatterdapp.min.js':'./src/scatterdapp.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]'
    },
    resolve: {
        extensions:['.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}