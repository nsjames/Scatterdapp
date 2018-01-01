const webpack = require("webpack");
module.exports = {
    // For testing only
    // entry:'./src/index-test.ts',
    entry:'./src/scatterdapp.ts',
    output: {
        filename:'./dist/scatterdapp.min.js'
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