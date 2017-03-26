const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    entry: ["./src/js/index.js", "./src/scss/style.scss"],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }],
                    fallback: {
                        loader: "style-loader" // creates style nodes from JS strings
                    }
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: true
        })
    ]
}

module.exports = config;