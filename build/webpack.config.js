/**
 * Created by apple on 2017/3/31.
 */
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const Glob = require('glob')
const IS_ENV = process.env.NODE_ENV === 'production'

var entries = getEntry('./src/views/**/*.js')
var chunks = Object.keys(entries)

if (!IS_ENV) {
  var hotMiddlewareScript = 'webpack-hot-middleware/client'
  for (var i in entries) {
    entries[i] = [entries[i], hotMiddlewareScript]
  }
}

var options = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'], // 后缀名自动补全
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'buble-loader',
      exclude: /node_modules/,
      options: {
        objectAssign: 'Object.assign'
      }
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        preserveWhitespace: false,
        postcss: [
          require('autoprefixer')({
            browsers: ['last 3 versions']
          })
        ]
      }
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }
    ]
  },
  plugins: [
        // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 公共模块的名称
      chunks: chunks, // chunks是需要提取的模块
      minChunks: chunks.length
    })
  ]
}

if (IS_ENV) {
  options.plugins.push(
        // minify JS
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
    )
} else {
  options.plugins.push(
        // 错误消息提示
        new FriendlyErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin()
    )
}

var pages = getEntry('./src/views/**/*.html')

for (var pathname in pages) {
    // 配置生成的html文件，定义路径等
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], // 模板路径
    inject: true // js插入位置
  }

  if (pathname in options.entry) {
    conf.chunks = ['vendors', pathname]
    conf.hash = true
  }

  options.plugins.push(new HtmlWebpackPlugin(conf))
}

module.exports = options

function getEntry (globPath) {
  var entries = {}
  var basename
  var tmp
  var pathname

  Glob.sync(globPath).forEach(function (entry) {
    tmp = entry.split('/').splice(-3)
    basename = tmp[1]
    pathname = tmp[0] + '/' + basename // 正确输出js和html的路径
    entries[pathname] = entry
  })

  return entries
}
