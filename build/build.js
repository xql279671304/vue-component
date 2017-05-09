/**
 * Created by apple on 2017/4/5.
 */
require('shelljs/global')
env.NODE_ENV = 'production'
const path = require('path')
const config = require('./config')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/', assetsPath)

webpack(webpackConfig, function(err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n')
})