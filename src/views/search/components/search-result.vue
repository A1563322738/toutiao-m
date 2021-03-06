<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，请重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
export default {
  // 组件名称
  name: 'searchResult',
  // 组件参数 接收来自父组件的数据
  // props:['searchText',''],
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    async onLoad () {
      try {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        })
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成;
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败
        this.error = true
        // 加载失败得话loading也需要关闭
        this.loading = false
      }
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less"></style>
