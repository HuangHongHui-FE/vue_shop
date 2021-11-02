import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器，
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


// 1.导入nprogress的js与css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8890/H'
// 2.在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config => {
	// console.log(config)
	NProgress.start()
	config.headers.Authorization = window.sessionStorage.getItem('token')
	// 在最后必须要return,为每次api请求挂载token
	return config
})

// 3.在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
	NProgress.done()
	return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)



// 全局的过滤器, originVal传过来的时间
Vue.filter('dateFormat', function(originVal) {
	const dt = new Date(originVal)

	const y = dt.getFullYear()
	// 因为得到的月份从零开始, padStart: 总共两位，不足两位的用0填充
	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
	const d = (dt.getDate() + '').padStart(2, '0')
	const hh = (dt.getHours() + '').padStart(2, '0')
	const mm = (dt.getMinutes() + '').padStart(2, '0')
	const ss = (dt.getSeconds() + '').padStart(2, '0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
