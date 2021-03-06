<template>
  <div class="search-suggestion">
    <van-cell icon="search"  :key="index" @click="$emit('search',text)"
     v-for="(text,index) in suggestions">
     <span slot="title" v-html="highlight(text)"></span>

    </van-cell>

  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js'
import { debounce } from 'lodash' // lodash按需加载，只会把使用到得成员打包到结果中
export default {
  // 组件名称
  name: 'searchSuggestion',
  // 组件参数 接收来自父组件的数据
  props: {
    //   1,接收父组件的搜索内容
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
      suggestions: []
      // htmlStr:`Hello <span style="color:red">World</span>`
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchText: {
      // handler(val) {
      //   // console.log(val);
      //   this.loderSearchSuggestion(val);
      // },
      handler: debounce(function (val) {
        // console.log(val);
        this.loderSearchSuggestion(val)
      }, 200),
      immediate: true
    }
  },
  // 组件方法
  methods: {
    async loderSearchSuggestion (q) {
      try {
        // 获得搜索建议
        const { data } = await getSearchSuggestion(q)
        // console.log(data);
        this.suggestions = data.data.options
      } catch {
        this.$toast('搜索失败')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
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

<style scoped lang="less">
.search-suggestion{
  /deep/ span.active{
    color: #3296fa;
  }
}
</style>
