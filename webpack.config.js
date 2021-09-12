const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { createLodashAliases } = require('lodash-loader');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = (env, argv) => Object({
    context: __dirname,
    entry: {
        core: './assets/core/index',
        content: './assets/content/index',
    },

    output: {
        path: path.resolve('pepr/core/static/pepr/'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },

    optimization: {
        //usedExports: true,
        // concatenateModules: argv.mode == 'production' ? true : false,

        splitChunks: {
            cacheGroups: {
                /*core: {
                    name: 'core', chunks: 'initial', enforce: true,
                    test: /[\\/]assets[\\/]core[\\/]/,
                },
                content: {
                    name: 'content', chunks: 'initial', enforce: true,
                    test: /[\\/]assets[\\/]content[\\/]/,
                },*/
                vendor: {
                    name: 'vendor', chunks: 'initial', enforce: true,

                    test: /[\\/]node_modules[\\/]/,
                },
                /*admin: {
                    name: 'admin',
                    chunks: 'initial',
                    enforce: false,
                    test: /assets[\\/]admin[\\/]/,
                },*/

                /*noscript: {
                    name: 'noscript',
                    chunks: 'initial',
                    enforce: true,
                    test: /noscript/,
                }*/
            }
        }
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].css"
        }),
        new VueLoaderPlugin(),
    ],

    module: {
        rules: [
            { test: /\.vue$/, loader: 'vue-loader' },
            {
                test: /\/node_modules\//,
                sideEffects: false
            },
            {
                test: /\.(c|sa|sc)?ss$/,
                use: [ { loader: MiniCssExtractPlugin.loader },
                       { loader: 'css-loader' },
                       { loader: 'sass-loader' , options: { sourceMap: true }} ],
            },
            {
                test: /\.(ttf|eot|svg|woff2?)$/,
                type: 'asset/resource',
            },
        ],
    },

    resolve: {
        alias: {
            pepr: path.resolve('./assets/'),
            vue: 'vue/dist/vue.esm-browser.js',
        },
        modules: [
            './node_modules',
        ],
        extensions: ['.js', '.vue', '.css', '.scss', '.styl', '.ttf']
    },
})

