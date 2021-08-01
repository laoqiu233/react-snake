const path = require('path');
const merge = require('webpack-merge');
const common = require('./common.webpack.config.js');

module.exports = merge.merge(common, {
    mode: 'production'
})