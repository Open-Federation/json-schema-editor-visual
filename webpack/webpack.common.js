const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:8].js',
    sourceMapFilename: '[name].[hash:8].map',
    libraryTarget: 'umd',
    chunkFilename: '[id].[hash:8].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map[query]'
    }),
    new HtmlWebpackPlugin({template: 'dist/index.html', inject: 'body'}),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  }
};
