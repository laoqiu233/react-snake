const path = require('path');
const merge = require('webpack-merge');
const common = require('./common.webpack.config.js');

module.exports = merge.merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        port: 8080
    }
})