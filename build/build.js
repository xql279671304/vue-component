/**
 * Created by apple on 2017/4/5.
 */
const shell = require('shelljs/global')
shell.NODE_ENV = 'production'
const path = require('path')
const config = require('./config')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
