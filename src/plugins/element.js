import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// message需要进行全局挂载才能this.使用
Vue.prototype.$message = Message  /*挂载到了vue的原型对象上*/
