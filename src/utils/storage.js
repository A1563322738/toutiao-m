//

// 封装本地存储数据 设置
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 封装本地存储数据 获取
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 封装本地存储数据 删除
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
