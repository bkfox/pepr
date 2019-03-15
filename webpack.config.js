const _ = require('lodash')._;
const path = require('path');
const webpack = require('webpack');

const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { createLodashAliases } = require('lodash-loader');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    context: __dirname,
    entry: './assets/js/index',

    output: {
        path: path.resolve('./assets/bundles/'),
        filename: "[name]-[hash].js",
        chunkFilename: "[name]-[hash].js",
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                },
            }
        }
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader'
                ]
            },
            {
                test: /\.(ttf|woff2?|eot|svg)$/,
                use: [
                    { loader: 'file-loader', },
                ]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            // { test: /\.js$/,  use: "babel-loader!lodash-loader" },
        ],
    },

    resolve: {
        alias: _.extend(createLodashAliases(), {
            pepr: '../js',
            vue: 'vue/dist/vue.esm.browser.js',
            vuetifyCss: 'vuetify/dist/vuetify.css',
        }),
        modules: [
            './assets/css',
            './assets/js',
            './node_modules',
        ],
        extensions: ['.js', '.vue', '.css', '.ttf']
    },
}

