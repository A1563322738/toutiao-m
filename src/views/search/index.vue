<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form class="search-form" action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      ></van-search>
    </form>
    <!-- 历史结果-->
    <search-result
      :search-text="searchText"
      v-if="isResultShow"
    ></search-result>
    <!-- /历史结果 -->
    <!-- 联想建议 -->
    <search-suggestion
      :search-text="searchText"
      v-else-if="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /联想建议 -->
    <!-- 搜索历史纪录 -->
    <search-history
      @search="onSearch"
      @clear-search-histories="searchHistories = []"
      :search-histories="searchHistories"
      v-else
    ></search-history>
    <!-- /搜索历史纪录 -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage.js'
export default {
  // 组件名称
  name: 'searchIndex',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  // 组件状态值
  data () {
    return {
      searchText: '',
      // 控制搜索结果的显示与否
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    // 监测搜索历史得变化
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORY', val)
    }
  },
  // 组件方法
  methods: {
    onSearch (val) {
      // 1.1更新输入框数据
      this.searchText = val
      // 1.2存储搜索历史记录，要求:不要有重复历史纪录，最新得排在最前面
      const index = this.searchHistories.indexOf(val)
      // 1.3如果找得到就删除
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 1.4找不到得话就往历史纪录得最前面添加
      this.searchHistories.unshift(val)
      console.log(this.searchHistories)
      this.isResultShow = true
    },
    onCancel () {}
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
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
