const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
    //Entry point to the project
    entry: [
        path.join(__dirname, '/src/app/app.jsx'),
    ],
    //Webpack config options on how to obtain modules
    resolve: {
        //When requiring, you don't need to add these extensions
        extensions: ['', '.js', '.jsx'],

        //Modules will be searched for in these directories
        modulesDirectories: [
            // We need /docs/node_modules to be resolved before /node_modules
            path.resolve(__dirname, 'node_modules'),
            'node_modules',
            path.resolve(__dirname, '../src')
        ],
    },
    devtool: 'source-map',
    //Configuration for server
    devServer: {
        contentBase: 'build',
    },
    //Output file config
    output: {
        path: buildPath, //Path of output file
        filename: 'app.js', //Name of output file
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: path.join(__dirname, '/src/www/index.html'),
        }),
        //Allows error warninggs but does not stop compiling. Will remove when eslint is added
        new webpack.NoErrorsPlugin(),
        //Transfer Files
        new TransferWebpackPlugin([{
            from: 'www/css',
            to: 'css'
        }, {
            from: 'www/images',
            to: 'images'
        }, ], path.resolve(__dirname, 'src')),
    ],
    externals: {
        fs: 'fs', // To remove once https://github.com/benjamn/recast/pull/238 is released
    },
    module: {
        //Allow loading of non-es5 js files.
        loaders: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }],
    }
};

module.exports = config;
