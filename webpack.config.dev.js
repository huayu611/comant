const webpack = require('webpack');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
var openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const importParam = {
    "libraryName": "antd",
    "libraryDirectory": "es",
    "style": true
}

module.exports = {
    entry: './src/index.js',

    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '~': path.resolve(__dirname, 'node_modules/'),
            STORE: path.resolve(__dirname, 'src/redux/store')
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:
                {
                    loader: 'babel-loader',
                    options:
                    {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                        plugins: [
                            ["babel-plugin-import", importParam],
                            ["@babel/plugin-transform-runtime", { "corejs": 2 }],
                            ["@babel/plugin-proposal-decorators", { 'legacy': true }],
                            ['@babel/plugin-proposal-class-properties', { "loose": true }],
                           
                        ]

                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },

                    {
                        loader: 'less-loader', // compiles Less to CSS

                        options: {
                            modifyVars: {
                                'table-header-bg':'rgba(00,155,229,0.1)',
                     
                            },
                            javascriptEnabled: true,
                        },
                    },

                ]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },



    plugins: [
        new HotModuleReplacementPlugin(),
        new openBrowserWebpackPlugin({ url: 'http://localhost:3006' }),
        //new CleanWebpackPlgin(),
        // new HtmlWebpackPlugin({ chunks: '?', template: 'src/dev.ejs' }),
        new CopyWebpackPlugin([{from: 'static', to: 'static'}]),
    ],
    devServer: {
        historyApiFallback:true,
        contentBase: './dist',
        inline: true,
        port: 3006,
        hot: true,
        proxy: {
            '/eframe': {
                target: 'http://localhost:8080',
               
                }
            }
        },
      
        performance: {
            hints: "warning",
            maxAssetSize: 999999999,
            maxEntrypointSize: 999999999,
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
            }
        },
        devtool: 'inline-source-map',
    }