import Vue from 'vue'
import Vuex from 'vuex'
// 设置token
import { setItem, getItem } from '../utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_user'
export default new Vuex.Store({
  state: {
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    // 定义改变token的方法
    setUser (state, data) {
      state.user = data
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
