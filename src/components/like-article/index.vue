<template>
  <van-icon
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    @click="onLike"
    :loading="loading"
    :color="value === 1 ? '#e5645f' : '#777'"
  ></van-icon>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  // 组件名称
  name: 'linkeIndex',
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      loading: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   1.点击点赞
    async onLike () {
    //   console.log(111);
      this.loading = true
      try {
        let status = -1
        //   如果等于1，有点赞，就取消点赞
        if (this.value === 1) {
          await deleteLike(this.articleId)
          this.$toast('取消点赞')
        } else {
          //   执行添加点赞的事件
          await addLike(this.articleId)
          status = 1
          this.$toast('点赞成功')
        }
        this.$emit('input', status)
      } catch (err) {
        this.$toast('点赞失败')
      }
      this.loading = false
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
