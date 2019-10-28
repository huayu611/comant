const webpack = require('webpack');
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
        filename: '[name].[hash].bundle.js'
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
                test: /\.(less)$/,
                include: /node_modules\/antd/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options:
                        {
                            modules: false,
                        }
                    },
                    {
                        loader: 'less-loader',
                        options:
                        {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            {
                test: /\.(less)$/,
                exclude: /node_modules\/antd/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options:
                        {
                            modules: true,
                        }
                    },
                    {
                        loader: 'less-loader',
                        options:
                        {
                            javascriptEnabled: true
                        }
                    }
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
        new CleanWebpackPlugin(),
        new HotModuleReplacementPlugin(),

        //new CleanWebpackPlgin(),
        new CopyWebpackPlugin([{ from: 'static', to: 'static' }]),
        new UglifyJsPlugin(),
    ],

    performance: {
        hints: "warning",
        maxAssetSize: 999999999,
        maxEntrypointSize: 999999999,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    externals: {
        "react": "window.React",
        "react": "React",
        "react-dom": "window.ReactDOM",
        'moment': 'moment',
        'redux-thunk': 'ReduxThunk',
        'antd': true,
        'ReactQuill': 'react-quill'

    },
}