/**
 * Created by shijin on 2016/2/26.
 */
var path = require("path");
var webpack = require('webpack');
module.exports={
    entry:['./src'],
    output:{
        path:path.resolve(__dirname, "builds"),
        filename:'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel?presets[]=react'

        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};