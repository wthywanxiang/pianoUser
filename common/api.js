const {
	http
} = uni.$u

export const TeacherLogin = (params = {}, config = {}) =>
	http.post('/api/user/teacherLogin', params, config)
	
export const StudentLogin = (params = {}, config = {}) =>
	http.post('/api/user/studentLogin', params, config)
	
export const checkAvatar = (params = {}, config = {}) =>
	http.post('/api/user/checkAvatar', params, config)
		
export const UnfinishedReserve = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/UnfinishedReserve', params, config)

export const GetUserDetail = (params = {}, config = {}) =>
	http.post('/api/user/MP/GetUserDetail', params, config)

export const TopTen = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/TopTen', params, config)

export const CancelReserve = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/CancelReserve', params, config)

export const HistoryRecord = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/HistoryRecord', params, config)

export const AvailableRoom = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/AvailableRoom', params, config)
	
export const CreateReserve = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/CreateReserve', params, config)
	
export const ViewStudents = (params = {}, config = {}) =>
	http.post('/api/user/Reserve/ViewStudents', params, config)

export const signIn = (params = {}, config = {}) =>{
	return http.post('/api/user/Reserve/signIn', params, config)
}

export const uploadImg = (url,fromdata) =>
	http.upload('/api/user/upload/images', {
		params: {} /* 会加在url上 */,
		filePath: url, // 要上传文件资源的路径。
		// 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
		custom: {}, // 可以加一些自定义参数，在拦截器等地方使用。比如这里我加了一个auth，可在拦截器里拿到，如果true就传token
		name: 'photo', // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
		// #ifdef H5 || APP-PLUS
		timeout: 60000, // H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)
		// #endif
		header: {} /* 会与全局header合并，如有同名属性，局部覆盖全局 */,
		formData: {fromdata}, // HTTP 请求中其他额外的 form data
		getTask: (task, options) => {
			task.onProgressUpdate((res) => {
				console.log('上传进度' + res.progress)
				console.log('已经上传的数据长度' + res.totalBytesSent)
				console.log(
					'预期需要上传的数据总长度' + res.totalBytesExpectedToSend
				)
			})
		},
	})
