//
// 导入请求模块
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 遇到问题：后端返回得超大数字无法在js中精确表示
// 解决方案：借助 json-bigint 将超大数字转成字符串就行
import bigint from 'json-bigint'
const JSONBig = bigint({ storeAsString: true })
const request = axios.create({
  // create会返回一个新的axios对象
  baseURL: 'http://toutiao-app.itheima.net', // 基准路径
  // transformResponse 允许自定义原始得响应数据
  transformResponse: [
    function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        // 如果转换失败，就包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})

// 设置一个请求拦截器
// request.interceptors.request.use(config=>{
//   return config 请求体
// },err=>{
//   return Promise.reject(err)
// })
request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    if (config.url.startsWith('/app')) {
      config.url = config.url.slice(4)
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 响应拦截器
request.interceptors.response.use(
  // 响应成功进入得第一个函数
  // 该函数得参数是响应对象
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response
  },
  // 响应失败进入第二个参数，该函数得参数是错误对象
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 如果响应码是 401 ，则请求获取新的 token
    // 响应拦截器中的 error 就是那个响应的错误对象
    console.dir(error)
    if (error.response && error.response.status === 401) {
      // 校验是否有refresh_token
      const user = store.state.user
      if (!user || !user.refresh_token) {
        router.push('/login')
        // 代码不能往后执行了
        return
      }
      // 如果有refresh_token就获取新的token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 如果成功，就把新的token更新到容器中
        console.log('刷新 token成功', res)
        store.commit('setUser', {
          token: res.data.data.token, // 最新获取得可用token
          refresh_token: user.refresh_token
        })
        return request(error.config)
      } catch (err) {
        console.log('请求刷新token失败', err)
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default request
