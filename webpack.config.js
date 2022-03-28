const path = require('path');

module.exports = (env) => {
  let webpackConfig = {
    entry: {
      app: './src/index.js',
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'lib'),
      library: 'graphiql',
      libraryTarget: 'commonjs2',
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
          test: /\.css$/i,
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
    externals: {
      react: 'commonjs2 react',
      'react-dom': 'commonjs2 react-dom',
    },
  };
  if (!env) {
    webpackConfig = {
      ...webpackConfig,
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
        contentBase: './lib',
        open: true,
        overlay: true,
        stats: 'errors-only',
        watchContentBase: true,
      },
    };
  }
  return webpackConfig;
};