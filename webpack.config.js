/*eslint-disable*/

var resolveHere = require('path').resolve.bind(null, __dirname);
var assignDeep = require('assign-deep');
var values = require('object-values');
var webpack = require('webpack');

var env = process.env.NODE_ENV || 'development';

var loaders = {
  common: {
    js: {test: /\.js$/, include: [resolveHere('src')], loader: 'babel'},
    svg: {test: /\.svg$/, loader: 'url?limit=8192&mimetype=image/svg+xml'},
  },

  development: {},

  production: {}
}

var webpackConfig = {
  common: {
    output: {
      library: 'Catalog',
      libraryTarget: 'umd',
      path: resolveHere('.'),
      filename: 'catalog.js'
    },
    resolve: {
      root: resolveHere('src')
    },
    module: {
      loaders: values(assignDeep(loaders.common, loaders[env])),
      noParse: [
        /\.min\.js$/
      ]
    }
  },

  development: {
    entry: [
      'webpack-hot-middleware/client',
      resolveHere('src/index')
    ],
    output: {
      pathinfo: true
    },
    devtool: '#eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
       '__DEV__': JSON.stringify(true),
       'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  production: {
    entry: resolveHere('src/index'),
    plugins: [
      new webpack.DefinePlugin({
        '__DEV__': JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
};


module.exports = assignDeep({}, webpackConfig.common, webpackConfig[env]);
