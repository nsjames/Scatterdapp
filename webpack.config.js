const webpack = require("webpack");
module.exports = {
    // entry:'./src/scatterdapp.ts',
    // For testing only
    entry:'./src/index-test.ts',
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