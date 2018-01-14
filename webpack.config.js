const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry:{
        // 'index.js':'./src/index-test.ts',
        'scatterdapp.min.js':'./src/scatterdapp.ts',
        'scatterdapp.js':'./src/scatterdapp.ts'
    },
    output: {
        path: path.resolve(__dirname, './lib'),
        filename: '[name]',
        library: 'scatterdapp',
        libraryTarget:'umd',
        umdNamedDefine:true
    },
    devtool: 'source-map',
    resolve: {
        extensions:['.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}