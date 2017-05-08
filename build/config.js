/**
 * Created by apple on 2017/5/3.
 */

var path = require('path')

module.exports = {
	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: process.env.NODE_ENV === 'production' ? '../' : '/',
		productionSourceMap: true
	},
	dev: {
		port: 8099,
		proxyTable: {}
	}
}