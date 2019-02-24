var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    mode: 'development',
    plugins: [new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        inject: 'body'
        }),
        //new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            REACT_APP_STAGE: JSON.stringify("local"),
            "process.env": {"REACT_APP_STAGE": JSON.stringify(process.env.REACT_APP_STAGE || "dev")}
        })
    ],
    output: {
        //libraryTarget: 'commonjs',
        path: path.join(__dirname, 'dist'),
        filename: 'outbundle.js',
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/react', '@babel/preset-env']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            },
            {
                test: /\.(png|jpg|gif)/,
                loader: 'file-loader',
                options: {
                    outputPath: path.join(__dirname, 'dist/images'),
                    publicPath: '/images',
                }
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
                options: {
                    modules: false,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dist'),
    },
    externals: [ ]
        // global app config object
       // config: JSON.stringify({
       //     apiUrl: 'http://localhost:4000'
       // })

}
