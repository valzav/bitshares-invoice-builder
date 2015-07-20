var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

if(process.env.PROD){
    console.log("PRODUCTION mode");
}
else if(process.env.TEST){
    console.log("TEST mode");
}
else{
    console.log("DEVELOPMENT mode");
}

var config = {
    entry: path.resolve(__dirname, "app/App.jsx"),
    output: {
        path: path.resolve(__dirname, "bundle"),
        filename: "app.js"
    },
    cache: true,
    debug: process.env.PROD ? false : true,
    module: {
        loaders: [
            { test: /\.jsx$/, loaders: ["react-hot", "babel-loader"] },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style!css") },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css!sass?outputStyle=expanded&includePaths[]=" + (path.resolve(__dirname, "./node_modules")))
            },
        ]
    },
    resolve: {
        root: [path.resolve(__dirname, "./app")],
        extensions: ["", ".js", ".jsx"],
        modulesDirectories: ["node_modules"],
        fallback: [path.resolve(__dirname, "./node_modules")]
    },
    resolveLoader: {
        root: path.join(__dirname, "node_modules"),
        fallback: [path.resolve(__dirname, "./node_modules")]
    },
    plugins: [
        new ExtractTextPlugin("app.css")
    ]
};

module.exports = config;
