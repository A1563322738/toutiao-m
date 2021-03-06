<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :immediate-check="false"
  >
    <comment-item
      @reply-click="$emit('reply-click', $event)"
      v-for="(item, index) in list"
      :comment="item"
      :key="index"
    ></comment-item>
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item'
export default {
  // 组件名称
  name: '',
  // 组件参数 接收来自父组件的数据
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  // 局部注册的组件
  components: {
    CommentItem
  },
  // 组件状态值
  data () {
    return {
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记(分页，从哪开始取这页数据)
      limit: 10, // (分页，每页多少条)
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
      // 1.异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id,文章id或评论id(需要手动加上toString(),否则会在source的值两边加上双引号，导致id不是一个有效的整形)
          offset: this.offset, // 获取数据的偏移量，值为评论id，表示id向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端默认的数量10
        })
        console.log(data)
        const { results } = data.data
        this.list.push(...results)
        this.$emit('onload-success', data.data)
        // 2.加载状态结束
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          // 3.数据全部加载完成
          this.finished = true
        }
      } catch (err) {}
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    // 当你手动初始onload的时候他不会自动开始初始的loading(调整慢速网络，进入评论回复界面会发现没有loading)
    // 所有我们要手动的开启初始loading
    this.loading = true
    this.onLoad()
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
</style>
