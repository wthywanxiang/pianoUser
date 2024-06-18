/**
 * 响应拦截
 * @param {Object} http
 */
module.exports = (vm) => {
	uni.$u.http.interceptors.response.use(
		(response) => {
			/* 对响应成功做点什么 可使用async await 做异步操作*/
			process.env.NODE_ENV === 'development' &&
				console.log('Interceptors.response.success', response)
			const data = response.data
			// 自定义参数
			const custom = response.config?.custom
			if (data.status !== 0) {
				// 服务端返回的状态码不等于200，则reject()
				// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
				if (custom.toast !== false) {
					uni.$u.toast('提示信息：' + data?.msg)
				}
				if(data.status===3){
					return data??{}
				}
				// 如果需要catch返回，则进行reject
				if (custom?.catch) {
					return Promise.reject(data)
				} else {
					// 否则返回一个pending中的promise
					return new Promise(() => {})
				}
			}
			return data ?? {}
		},
		(response) => {
			/*  对响应错误做点什么 （statusCode !== 200）*/
			process.env.NODE_ENV === 'development' &&
				console.error('Interceptors.response.error', response)
			if (response.statusCode === 401) {
				return new Promise((resolve, reject) => {
					/*
					RefreshJwToken({
						Token: vm.$store.state.$userInfo.token,
						RefreshToken: vm.$store.state.$userInfo.refreshToken,
					})
						.then((res) => {
							vm.$store.state.$userInfo.token = res.Token
							vm.$store.state.$userInfo.refreshToken =
								res.RefreshToken
							vm.$u.http.request(response.config).then((res) => {
								console.log('重发成功', res)
								resolve(res)
							})
						})
						.catch((err) => {
							uni.$u.route({
								type: 'reLaunch',
								url: '/pages/login/login',
							})
							reject(err)
						})
					*/
				})
			}
			return new Promise(() => {})
			// return Promise.reject(response)
		}
	)
}
