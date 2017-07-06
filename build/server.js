/**
 * Created by apple on 2017/3/31.
 */
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const config = require('./config')
const port = config.dev.port

var app = express()
var compiler = webpack(webpackConfig)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

// serve webpack bundle output
app.use(devMiddleware)
app.use(require('webpack-hot-middleware')(compiler))

// serve pure static assets
var staticPath = path.join(config.build.assetsPublicPath, config.build.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const server = require('http').createServer(app)
server.listen(port)

console.log('Listening on port %s', port)
