const webpack = require('webpack')
const path = require('path')

module.exports = {
    devtool: 'cheap-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'dsst.min.js',
        library: 'DSST',
        libraryExport: 'default',
        globalObject: 'this',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: '$',
            }],
        }, {
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
        }]
    },
}