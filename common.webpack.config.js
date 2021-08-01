const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.tsx',
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].bundle.js',
        publicPath: '/',
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],

                loader: 'ts-loader'
            },

            {
                test: /\.(le|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            },

            {
                test: /\.ttf$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]'
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),

        new MiniCssExtractPlugin()
    ]
}