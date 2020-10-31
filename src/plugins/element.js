import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把弹框组件挂载到vue的原型对象上 只要访问到$message就可以访问到message组件
Vue.prototype.$message = Message
