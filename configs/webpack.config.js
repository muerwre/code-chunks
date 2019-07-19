// import webpack from 'webpack';
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { join } = require('path');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  title: 'Boilerplate',
  hash: false,
  // favicon: 'src/sprites/favicon.png',
});

const miniCssExractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[id].css'
});

const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = isDevelopment ? 'cheap-module-eval-source-map' : 'source-map';

const resolve = {
  alias: {
    'react-dom': '@hot-loader/react-dom',
    '~': join(__dirname, 'src'),
  },
  extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json']
};

/* Configuration */

module.exports = () => {
  /* Export */
  const plugins = [
    htmlPlugin,
    miniCssExractPlugin,
    new webpack.HashedModuleIdsPlugin(),
    new Dotenv(),
  ];

  return {
    module: {
      rules: [
        {
          test: /locales/,
          loader: '@alienfast/i18next-loader',
          query: {
            include: ['**/*.json'],
            relativePathAsNamespace: true,
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            { loader: isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader },
            // { loader: 'css-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                camelCase: true,
                importLoaders: 2,
                localIdentName: '[folder]_[local]__[hash:base64:5]',
              }
            },
            {
              loader: 'sass-loader',
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  'src/styles/variables.scss',
                  'src/styles/mixins.scss',
                ],
              },
            },
          ]
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        { test: /\.(ts|tsx)?$/, loader: 'awesome-typescript-loader' },
        {
          test: /\.(eot|ttf|woff|woff2|otf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
        {
          test: /\.(png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
                name: '[name]_[hash].[ext]',
            }
          }
        }
      ]
    },
    devtool,
    resolve,
    plugins,
    entry: {
      app: './src/index.tsx',
    },
    output: {
      publicPath: '/',
      filename: isDevelopment ? '[name].[hash].js' : '[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          }
        }
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
    },
    devServer: {
      open: false,
      historyApiFallback: true,
      port: 8000,
      host: '0.0.0.0',
      contentBase: 'dist',
      publicPath: '/'
    }
  };
};

