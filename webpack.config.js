const _ = require('lodash')._;
const path = require('path');
const webpack = require('webpack');

const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { createLodashAliases } = require('lodash-loader');
const { VueLoaderPlugin } = require('vue-loader');
//const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
//const StylusLoaderPlugin = require('stylus-loader');

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
                    name: 'vendor',
                    chunks: 'initial',
                    enforce: true,

                    test: /[\\/]node_modules[\\/]/,
                    // FIXME: splitting bundles => django-webpack need name manually in template
                    /*name(module) {
                          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                          return `npm.${packageName.replace('@', '')}`;
                    },*/
                },
            }
        }
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin(),
        //new VuetifyLoaderPlugin(),
    ],

    module: {
        rules: [
            { test: /\.css$/,
              use: [ { loader: MiniCssExtractPlugin.loader },
                     'css-loader' ] },
            { test: /\.(ttf|woff2?|eot|svg)$/, use: 'file-loader' },
            { test: /\.vue$/, use: 'vue-loader' },
            /*{ test: /\.styl$/,
              use: [ { loader: "style-loader" },
                     { loader: "css-loader" },
                     { loader: "stylus-loader" }] }*/
            // { test: /\.js$/,  use: "babel-loader!lodash-loader" },
        ],
    },

    resolve: {
        alias: _.extend(createLodashAliases(), {
            pepr: '../js',
            vue: 'vue/dist/vue.esm.browser.js',
            vuex: 'vuex/dist/vuex.esm.browser.js',
            // we have a modified version with v-runtime-template/pull/33
            'v-runtime-template': '../vue/v-runtime-template.js',
            'vuetify-css': 'vuetify/dist/vuetify.css',
        }),
        modules: [
            './assets/css',
            './assets/js',
            './node_modules',
        ],
        extensions: ['.js', '.vue', '.css', '.styl', '.ttf']
    },
}

