<template>
  <div class="">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-duration="1500"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
       <!-- 列表项组件 -->
        <article-item  v-for="(article, index) in list"
          :key="index" :article="article">

        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  // 组件名称
  name: '',
  // 组件参数 接收来自父组件的数据
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  // 局部注册的组件
  components: {
    ArticleItem
  },
  // 组件状态值
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null,
      error: false,
      count: 0,
      isRefreshLoading: false, // 控制刷新次数的
      refreshSuccessText: ''
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
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含文章0-不包含
        })
        const { results } = data.data // 这个是请求回来的结果数据
        console.log(results)
        // 数组的展开操作符。。。，它会把数组元素一个一个拿出来
        this.list.push(...results) // (将结果数据拆包之后，加到list中)
        this.loading = false // (隐藏加载中)
        // 判断是否全部加载完成:(如果长度为0代表没有数据)
        if (results.length) {
          //    更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多
          this.finished = true // (显示没有更多)
        }
      } catch (err) {
        this.loading = false // 关闭loading效果
        this.error = true // 开启错误提示
      }
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求

      // 数据全部加载完成
    },
    // 2.下拉刷新时候的数据
    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新每次都应该获取最新数据
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含文章0-不包含
        })
        const { results } = data.data // 这个是请求回来的结果数据
        // 2.1 将下一页数据追加到list的顶部
        this.list.unshift(...results)
        // 2.2关闭下拉加载
        this.isRefreshLoading = false
        // 2.3更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false // 关闭下拉刷新的loading状态
        this.$toast('刷新失败')
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
