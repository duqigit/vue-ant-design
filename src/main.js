import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 引入全局样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

// 使用ant-design
Vue.use(Antd)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
