const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  let webpackConfig = {
    entry: {
      app: './src/index.js',
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'lib'),
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                disable: true,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: './index.html',
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
  if (!env) {
    webpackConfig = {
      ...webpackConfig,
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
        contentBase: './dist',
        open: true,
        overlay: true,
        stats: 'errors-only',
        watchContentBase: true,
      },
    };
  }
  return webpackConfig;
};