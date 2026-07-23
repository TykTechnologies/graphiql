const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  const isPlayground = env === 'playground' || (env && env.playground);
  let webpackConfig = {
    entry: {
      [isPlayground ? 'playground' : 'app']:
        isPlayground ? './src/playground.js' : './src/index.js',
    },
    output: {
      filename: isPlayground ? 'playground.js' : 'index.js',
      path: path.resolve(__dirname, 'lib'),
      library: isPlayground ? 'GraphiqlInit' : 'graphiql',
      libraryTarget: isPlayground ? 'window' : 'commonjs2',
      libraryExport: isPlayground ? 'default' : undefined,
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
    externals: isPlayground
      ? {}
      : {
          react: 'commonjs2 react',
          'react-dom': 'commonjs2 react-dom',
        },
    plugins: isPlayground
      ? [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })]
      : [],
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
