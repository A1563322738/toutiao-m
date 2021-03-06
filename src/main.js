import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
// 导入全局样式
import './styles/index.less'
import 'vant/lib/index.css'
// 导入加载动态rem的基准值
import 'amfe-flexible'

// 时间初始化
import './utils/dayjs'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
