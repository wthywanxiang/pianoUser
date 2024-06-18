import App from './App'
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

App.mpType = 'app'

// 引入全局TuniaoUI
import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)

// 引入store
import store from './store'

Vue.prototype.$store = store

const app = new Vue({
  store,
  ...App
})

require('./util/request/index')(app)

// 引入TuniaoUI提供的vuex简写方法
let vuexStore = require('@/store/$tn.mixin.js')
Vue.mixin(vuexStore)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif