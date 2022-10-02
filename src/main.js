import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'

import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css'
import 'ant-design-vue/es/notification/style/css'

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)

// prettier-ignore
if (import.meta.env.DEV) 
  app.provide('axiosBaseURL', 'http://127.0.0.1:5000/apivue')
 else 
  app.provide('axiosBaseURL', 'https://www.dutbit.com/apivue')

app.mount('#app')

app.config.productionTip = false
app.config.globalProperties.$message = message
