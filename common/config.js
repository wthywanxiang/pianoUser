// 线上服务器地址
const PRODUCTION_URL = 'https://'

// 开发服务器地址列表
const DEVELOPMENT_URLS = {
	PRODUCTION: PRODUCTION_URL,
	xingyeai: 'http://localhost:8088/EKKO-KING'
}

// 切换开发服务器地址
const DEVELOPMENT_URL = 'xingyeai'

module.exports = {
	baseUrl: process.env.NODE_ENV === 'production' ?
		PRODUCTION_URL : DEVELOPMENT_URLS[DEVELOPMENT_URL],
}
