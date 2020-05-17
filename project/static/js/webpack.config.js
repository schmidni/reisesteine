const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'scripts'),
        filename: 'app.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules\//,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
}