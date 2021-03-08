const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { createLodashAliases } = require('lodash-loader');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = (env, argv) => Object({
    context: __dirname,
    entry: {
        // vendor: './assets/pepr/vendor',
        pepr: './assets/pepr/index',
        // content: './assets/content/index',
    },

    output: {
        path: path.resolve('pepr/static/pepr'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },

    optimization: {
        //usedExports: true,
        // concatenateModules: argv.mode == 'production' ? true : false,

        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    enforce: true,

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
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    }
                }],
            },
        ],
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-browser.js',
        },
        modules: [
            './assets',
            './node_modules',
        ],
        extensions: ['.js', '.vue', '.css', '.scss', '.styl', '.ttf']
    },
})

